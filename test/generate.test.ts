import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {ENUMERATOR_INDEX, generate} from '../src/generate';
import {SpecQueryModel} from '../src/model';
import {DEFAULT_QUERY_CONFIG, SHORT_ENUM_SPEC, BinQuery, SpecQuery} from '../src/query';
import {Property} from '../src/property';
import {extend, some} from '../src/util';

import {schema, stats} from './fixture';

function buildSpecQueryModel(specQ: SpecQuery) {
  return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
}

describe('generate', function () {
  describe('1D', () => {
    describe('Q with aggregate=?, bin=?', () => {
      it('should enumerate raw, bin, aggregate', () => {
        const query = {
          mark: Mark.POINT,
          encodings: [{
            channel: Channel.X,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, stats, {autoAddCount: true});
        assert.equal(answerSet.length, 3);
      });
    });
  });

  describe('2D', () => {
    describe('x:N,y:N', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'N',
          type: Type.NOMINAL
        },{
          channel: Channel.Y,
          field: 'N20',
          type: Type.NOMINAL
        }],
        config: {autoAddCount: true}
      };

      const answerSet = generate(query, schema, stats, {autoAddCount: true});

      it('should return counted heatmaps', () => {
        assert.isTrue(answerSet.length > 0);
        answerSet.forEach((specM) => {
          assert.isTrue(some(specM.getEncodings(), (encQ) => {
            return encQ.autoCount === true;
          }));
        });
      });

      it('should not use tick, bar, line or area', () => {
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), Mark.AREA);
          assert.notEqual(specM.getMark(), Mark.LINE);
          assert.notEqual(specM.getMark(), Mark.BAR);
          assert.notEqual(specM.getMark(), Mark.TICK);
        });
      });
    });

    describe('QxQ', () => {
      it('should not return any of bar, tick, line, or area', () => {
        const query = {
          mark: SHORT_ENUM_SPEC,
          encodings: [{
            channel: Channel.X,
            field: 'Q',
            type: Type.QUANTITATIVE
          },{
            channel: Channel.Y,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, stats, {autoAddCount: true});
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), Mark.AREA);
          assert.notEqual(specM.getMark(), Mark.LINE);
          assert.notEqual(specM.getMark(), Mark.BAR);
          assert.notEqual(specM.getMark(), Mark.TICK);
        });
      });
    });

    describe('A(Q) x A(Q)', () => {
      it('should return neither line nor area', () => {
        const query = {
          mark: SHORT_ENUM_SPEC,
          encodings: [{
            channel: Channel.X,
            aggregate: AggregateOp.MEAN,
            field: 'Q',
            type: Type.QUANTITATIVE
          },{
            channel: Channel.Y,
            aggregate: AggregateOp.MEAN,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, stats, {autoAddCount: true});
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), Mark.AREA);
          assert.notEqual(specM.getMark(), Mark.LINE);
        });
      });
    });
  });

  describe('3D', () => {
    describe('NxNxQ', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: SHORT_ENUM_SPEC,
          field: 'N',
          type: Type.NOMINAL
        },{
          channel: SHORT_ENUM_SPEC,
          field: 'N20',
          type: Type.NOMINAL
        },{
          channel: SHORT_ENUM_SPEC,
          field: 'Q',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats);

      it('should return not generate a plot with both x and y as dimensions.', () => {
        answerSet.forEach((specM) => {
          assert.isFalse(
            specM.getEncodingQueryByChannel(Channel.X).type === Type.NOMINAL &&
            specM.getEncodingQueryByChannel(Channel.Y).type === Type.NOMINAL
          );
        });
      });
    });
  });

  describe('bin_maxbins', () => {
    describe('Qx#', () => {
      it('should enumerate multiple maxbins parameter', () => {
        const specQ = {
          mark: Mark.BAR,
          encodings: [
            {
              channel: Channel.X,
              bin: {maxbins: {values: [10, 20, 30]}},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        };

        const answerSet = generate(specQ, schema, stats);
        assert.equal(answerSet.length, 3);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin['maxbins'], 10);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin['maxbins'], 20);
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).bin['maxbins'], 30);
      });

      it('should support enumerating both bin enablling and maxbins parameter', () => {
        const specQ = {
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              bin: {
                values: [true, false],
                maxbins: {values: [10, 20, 30]}
              },
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        };

        const answerSet = generate(specQ, schema, stats);
        assert.equal(answerSet.length, 4);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin['maxbins'], 10);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin['maxbins'], 20);
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).bin['maxbins'], 30);
        assert.equal(answerSet[3].getEncodingQueryByIndex(0).bin, false);
      });
    });
  });
});

describe('enumerator', () => {
  describe('mark', () => {
    it('should correctly enumerate marks', () => {
      const specM = buildSpecQueryModel({
        mark: {values: [Mark.POINT, Mark.TICK]},
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'O', type: Type.ORDINAL}
        ]
      });
      const enumerator = ENUMERATOR_INDEX[Property.MARK](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

      const answerSet = enumerator([], specM);
      assert.equal(answerSet.length, 2);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
      assert.equal(answerSet[1].getMark(), Mark.TICK);
    });

    it('should not enumerate invalid mark', () => {
      const specM = buildSpecQueryModel({
        mark: {values: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA]},
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
          {channel: Channel.SHAPE, field: 'O', type: Type.ORDINAL}
        ]
      });
      const enumerator = ENUMERATOR_INDEX[Property.MARK](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

      const answerSet = enumerator([], specM);
      assert.equal(answerSet.length, 1);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
    });
  });

  describe('encoding', () => {
    describe('channel', () => {
      it('should correctly enumerate channels', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: {values: [Channel.X, Channel.Y]},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const opt = extend({}, DEFAULT_QUERY_CONFIG, {omitVerticalDotPlot: false});
        const enumerator = ENUMERATOR_INDEX[Property.CHANNEL](specM.enumSpecIndex, schema, stats, opt);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, Channel.Y);
      });

      it('should not enumerate invalid channels', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.BAR,
          encodings: [
            {
              channel: {values: [Channel.X, Channel.SHAPE]},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.CHANNEL](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
      });
    });

    describe('aggregate', () => {
      // TODO
    });

    describe('bin', () => {
      // TODO
    });

    describe('maxbin', () => {
      it('should correctly enumerate maxbins', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.BAR,
          encodings: [
            {
              channel: Channel.X,
              bin: {
                maxbins: {values: [5, 10, 20]}
              },
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.BIN_MAXBINS](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 3);
        assert.equal((answerSet[0].getEncodingQueryByIndex(0).bin as BinQuery).maxbins, 5);
        assert.equal((answerSet[1].getEncodingQueryByIndex(0).bin as BinQuery).maxbins, 10);
        assert.equal((answerSet[2].getEncodingQueryByIndex(0).bin as BinQuery).maxbins, 20);
      });
    });

    describe('timeUnit', () => {
      // TODO
    });

    describe('field', () => {
      // TODO
    });

    describe('type', () => {
      // TODO
    });
  });

  describe('autoAddCount', () => {
    describe('ordinal only', () => {
      it('should output autoCount in the answer set', () => {
        const query = {
          mark: Mark.POINT,
          encodings: [
              { channel: Channel.X, field: 'O', type: Type.ORDINAL},
          ]
        };
        const answerSet = generate(query, schema, stats, {autoAddCount: true});
        assert.equal(answerSet.length, 1);
        assert.isTrue(answerSet[0].getEncodings()[1].autoCount);
      });
    });

    describe('non-binned quantitative only', () => {
      const query = {
        mark: Mark.POINT,
        encodings: [
          { channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
        ]
      };
      const answerSet = generate(query, schema, stats, {autoAddCount: true});

      it('should output autoCount=false', () => {
        assert.isFalse(answerSet[0].getEncodingQueryByIndex(1).autoCount);
      });

      it('should not output duplicate results in the answer set', () => {
        assert.equal(answerSet.length, 1);
      });
    });

    describe('enumerate channel for a non-binned quantitative field', () => {
      const query = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: {values: [Channel.X, Channel.SIZE, Channel.COLOR]},
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(query, schema, stats, {autoAddCount: true});

      it('should not output point with only size for color', () => {
        answerSet.forEach((model) => {
          model.getEncodings().forEach((encQ) => {
            assert.notEqual(encQ.channel, Channel.COLOR);
            assert.notEqual(encQ.channel, Channel.SIZE);
          });
        });
      });
    });
  });
});
