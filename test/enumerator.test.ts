import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
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
      it('should correctly enumerate timeUnits', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              field: 'Q',
              timeUnit: {values: [TimeUnit.MONTH, TimeUnit.DAY, TimeUnit.YEAR]},
              type: Type.TEMPORAL
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.TIMEUNIT](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 3);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).timeUnit, TimeUnit.MONTH);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).timeUnit, TimeUnit.DAY);
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).timeUnit, TimeUnit.YEAR);
      });
    });

    describe('field', () => {
      it('should correctly enumerate fields with quantitative type', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              field: {values: ['Q', 'Q1', 'Q2', 'O', 'N', 'T']},
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.FIELD](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 3);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'Q');
        assert.equal(answerSet[1].getEncodingQueryByIndex(1).field, 'Q1');
        assert.equal(answerSet[2].getEncodingQueryByIndex(2).field, 'Q2');
      });

      it('should correctly enumerate fields with temporal type', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              field: 'T',
              type: Type.TEMPORAL
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.FIELD](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'T');
      });

      it('should correctly enumerate fields with ordinal type', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              field: {values: ['O', 'O_10', 'O_20', 'O_100']},
              type: Type.ORDINAL
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.FIELD](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 4);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'O');
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).field, 'O_10');
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).field, 'O_20');
        assert.equal(answerSet[3].getEncodingQueryByIndex(0).field, 'O_100');
      });

      it('should correctly enumerate fields with nominal type', () => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              field: {values: ['N', 'N20']},
              type: Type.NOMINAL
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.FIELD](specM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specM);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).field, 'N');
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).field, 'N20');
      });
    });

    // still need to figure out how to do type
    describe('type', () => {
      it('should correctly enumerate quantitative types', () => {
        const SpecM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.TYPE](SpecM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], SpecM);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, Type.QUANTITATIVE);
      });

      it('should correctly enumerate ordinal types', () => {
        const SpecM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.ORDINAL}
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.TYPE](SpecM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], SpecM);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, Type.ORDINAL);
      });

      it('should correctly enumerate temporal types', () => {
        const SpecM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.TEMPORAL}
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.TYPE](SpecM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], SpecM);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, Type.TEMPORAL);
      });

      it('should correctly enumerate nominal types', () => {
        const SpecM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.NOMINAL}
          ]
        });
        const enumerator = ENUMERATOR_INDEX[Property.TYPE](SpecM.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], SpecM);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).type, Type.NOMINAL);
      });
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

