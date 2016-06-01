import {assert} from 'chai';

import load = require('datalib/src/import/load');
import {inferAll} from 'datalib/src/import/type';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {ENUMERATOR_INDEX, generate} from '../src/generate';
import {SpecQueryModel} from '../src/model';
import {DEFAULT_QUERY_CONFIG, SHORT_ENUM_SPEC, SpecQuery} from '../src/query';
import {Schema} from '../src/schema';
import {extend, keys} from '../src/util';

import {schema, stats} from './fixture';

describe('generate', function () {
  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  it('should correct enumerate properties', () => {
    const query = {
      mark: SHORT_ENUM_SPEC,
      encodings: [
          { channel: SHORT_ENUM_SPEC, field: { enumValues: ['Name', 'Origin'] }, type: SHORT_ENUM_SPEC},
      ]
    };
    load({url: 'node_modules/vega-datasets/data/cars.json'}, function (data) {
        var types = inferAll(data);
        var fieldSchemas: any = keys(types).map(function (field) {
            var primitiveType = types[field];
            var type = primitiveType === 'number' || primitiveType === 'integer' ? 'quantitative' :
                primitiveType === 'date' ? 'temporal' : 'nominal';
            console.log('schema', field, type, primitiveType);
            return {
                field: field,
                type: type,
                primitiveType: types[field]
            };
        });
        var dataSchema = new Schema(fieldSchemas);
        var answerSet = generate(query, dataSchema, stats).map(function (answer) { return answer.toSpec(); });
        assert.isTrue(answerSet.length > 0);
    });
  });

  describe('mark', () => {
    it('should correctly enumerate marks', () => {
      const specQ = buildSpecQueryModel({
        mark: {enumValues: [Mark.POINT, Mark.BAR]},
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'O', type: Type.ORDINAL}
        ]
      });
      const enumerator = ENUMERATOR_INDEX['mark'](specQ.enumSpecIndex, schema, stats, DEFAULT_QUERY_CONFIG);

      const answerSet = enumerator([], specQ);
      assert.equal(answerSet.length, 2);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
      assert.equal(answerSet[1].getMark(), Mark.BAR);
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
});
