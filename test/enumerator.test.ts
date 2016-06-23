import {assert} from 'chai';

import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {generate} from '../src/generate';
import {ENUMERATOR_INDEX} from '../src/enumerator';
import {SpecQueryModel} from '../src/model';
import {BinQuery, SpecQuery} from '../src/query';
import {Property} from '../src/property';
import {extend} from '../src/util';

import {schema, stats} from './fixture';

function buildSpecQueryModel(specQ: SpecQuery) {
  return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
}

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
        // Shape should be excluded since it does not work with bar.
      });
    });

    describe('aggregate', () => {
      it('should correctly enumerate aggregate', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              aggregate: {values: [AggregateOp.MEAN, AggregateOp.MEDIAN]},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.AGGREGATE](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).aggregate, AggregateOp.MEAN);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).aggregate, AggregateOp.MEDIAN);
      });
      
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

