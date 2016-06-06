import {assert} from 'chai';

import {json} from 'datalib/src/import/readers';
import {summary} from 'datalib/src/stats';
import {inferAll} from 'datalib/src/import/type';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {ENUMERATOR_INDEX, generate} from '../src/generate';
import {SpecQueryModel} from '../src/model';
import {DEFAULT_QUERY_CONFIG, SHORT_ENUM_SPEC, SpecQuery} from '../src/query';
import {Schema} from '../src/schema';
import {Stats} from '../src/stats';
import {extend, keys} from '../src/util';

import {schema, stats} from './fixture';

function buildSpecQueryModel(specQ: SpecQuery) {
  return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
}

describe('generate', function () {
  it('should correct enumerate properties', () => {
    const query = {
      mark: SHORT_ENUM_SPEC,
      encodings: [
          { channel: SHORT_ENUM_SPEC, field: { enumValues: ['Name', 'Origin'] }, type: SHORT_ENUM_SPEC},
      ]
    };

    const data = json('node_modules/vega-datasets/data/cars.json');
    var types = inferAll(data);
    var fieldSchemas: any = keys(types).map(function (field) {
        var primitiveType = types[field];
        var type = primitiveType === 'number' || primitiveType === 'integer' ? 'quantitative' :
            primitiveType === 'date' ? 'temporal' : 'nominal';
        return {
            field: field,
            type: type,
            primitiveType: types[field]
        };
    });
    const mySchema = new Schema(fieldSchemas);
    const mySummary = summary(data);
    const myStats = new Stats(mySummary);
    const answerSet = generate(query, mySchema, myStats);
    assert.isTrue(answerSet.length > 0);
  });

  describe('a quantitative field with aggregate, bin ambiguous', () => {
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
      const answerSet = generate(query, schema, stats, {autoAddCount: true, verbose: true});
      assert.equal(answerSet.length, 3);
    });
  });
});

describe('enumerator', () => {
  describe('mark', () => {
    it('should correctly enumerate marks', () => {
      const specQ = buildSpecQueryModel({
        mark: {enumValues: [Mark.POINT, Mark.TICK]},
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'O', type: Type.ORDINAL}
        ]
      });
      const enumerator = ENUMERATOR_INDEX['mark'](specQ.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

      const answerSet = enumerator([], specQ);
      assert.equal(answerSet.length, 2);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
      assert.equal(answerSet[1].getMark(), Mark.TICK);
    });

    it('should not enumerate invalid mark', () => {
      const specQ = buildSpecQueryModel({
        mark: {enumValues: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA]},
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
          {channel: Channel.SHAPE, field: 'O', type: Type.ORDINAL}
        ]
      });
      const enumerator = ENUMERATOR_INDEX['mark'](specQ.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

      const answerSet = enumerator([], specQ);
      assert.equal(answerSet.length, 1);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
    });
  });

  describe('encoding', () => {
    describe('channel', () => {
      it('should correctly enumerate channels', () => {
        const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: {enumValues: [Channel.X, Channel.Y]},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX['channel'](specQ.enumSpecIndex, schema, stats, extend({}, DEFAULT_QUERY_CONFIG, {omitVerticalDotPlot: false}));

        const answerSet = enumerator([], specQ);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, Channel.Y);
      });

      it('should not enumerate invalid channels', () => {
        const specQ = buildSpecQueryModel({
          mark: Mark.BAR,
          encodings: [
            {
              channel: {enumValues: [Channel.X, Channel.SHAPE]},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX['channel'](specQ.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specQ);
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
            channel: {enumValues: [Channel.X, Channel.SIZE, Channel.COLOR]},
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
