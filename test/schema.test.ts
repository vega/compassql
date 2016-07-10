import {assert} from 'chai';

import {Type} from 'vega-lite/src/type';
import {Channel} from 'vega-lite/src/channel';

import {Schema, PrimitiveType} from '../src/schema';
import {DEFAULT_QUERY_CONFIG} from '../src/config';

describe('schema', () => {

  describe('build', () => {
    it('should correctly create a Schema object with empty data', () => {
      const data = [];
      var schema = Schema.build(data);

      assert.isNotNull(schema);
      assert.equal(schema.fields().length, 0);
    });
  });

  const data = [
    {a: 1, b: 'a', c: 1.1, d: '1/1/2010'},
    {a: 2, b: 'b', c: 1.1, d: '1/1/2010'}
  ];
  const schema = Schema.build(data);

  describe('fields', () => {
    it('should return an array of the correct fields', () => {
      const fields: string[] = schema.fields();

      assert.equal(fields.length, 4);
      assert.notEqual(fields.indexOf('a'), -1);
      assert.notEqual(fields.indexOf('b'), -1);
      assert.notEqual(fields.indexOf('c'), -1);
      assert.notEqual(fields.indexOf('d'), -1);
    });
  });

  describe('primitiveType', () => {
    it('should return the expected primitive type of each field', () => {
      assert.equal(schema.primitiveType('a'), PrimitiveType.INTEGER);
      assert.equal(schema.primitiveType('b'), PrimitiveType.STRING);
      assert.equal(schema.primitiveType('c'), PrimitiveType.NUMBER);
      assert.equal(schema.primitiveType('d'), PrimitiveType.DATE);
    });
  });

  describe('type', () => {
    it('should return the correct type of measurement for each field', () => {
      assert.equal(schema.type('a'), Type.QUANTITATIVE);
      assert.equal(schema.type('b'), Type.NOMINAL);
      assert.equal(schema.type('c'), Type.QUANTITATIVE);
      assert.equal(schema.type('d'), Type.TEMPORAL);
    });
    
    it('should infer nominal type for integers when cardinality is much less than the total', () => {
      const numberData = [];
      // add enough non-distinct data to make the field ordinal
      var total = 1 / DEFAULT_QUERY_CONFIG.numberOrdinalProportion + 1;
      for (var i = 0; i < total; i++) {
        numberData.push({a: 1});
      }
      const numberSchema = Schema.build(numberData);
      assert.equal(numberSchema.type('a'), Type.NOMINAL);
    });
    
    it('should infer nominal type for integers when cardinality is much less than the total and numbers are in order', () => {
      const numberData = [];
      // add enough non-distinct data to make the field ordinal and have multiple in-order keys
      var total = 3 * (1 / DEFAULT_QUERY_CONFIG.numberOrdinalProportion + 1);
      for (var i = 0; i < total; i++) {
        numberData.push({a: 1});
        numberData.push({a: 2});
        numberData.push({a: 3});
      }
      const numberSchema = Schema.build(numberData);
      assert.equal(numberSchema.type('a'), Type.NOMINAL);
    });
    
    it('should infer ordinal type for integers when cardinality is much less than the total and numbers are not in order', () => {
      const numberData = [];
      // add enough non-distinct data to make the field ordinal and have multiple in-order keys
      var total = 3 * (1 / DEFAULT_QUERY_CONFIG.numberOrdinalProportion + 1);
      for (var i = 0; i < total; i++) {
        numberData.push({a: 1});
        numberData.push({a: 3});
        numberData.push({a: 5});
      }
      const numberSchema = Schema.build(numberData);
      assert.equal(numberSchema.type('a'), Type.ORDINAL);
    });
  });

  describe('cardinality', () => {
    it('should return the correct cardinality for each field', () => {
      assert.equal(schema.cardinality({field: 'a', channel: Channel.X}), 2);
      assert.equal(schema.cardinality({field: 'b', channel: Channel.X}), 2);
      assert.equal(schema.cardinality({field: 'c', channel: Channel.X}), 1);
      assert.equal(schema.cardinality({field: 'd', channel: Channel.X}), 1);
    });
  });

  describe('stats', () => {
    it('should return null for an EncodingQuery whose field does not exist in the schema', () => {
      const summary: Summary = schema.stats({field: 'foo', channel: Channel.X});
      assert.isNull(summary);
    });
    it('should return the correct summary for a valid EncodingQuery', () => {
      const summary: Summary = schema.stats({field: 'a', channel: Channel.X});
      assert.isNotNull(summary);
      assert.equal(summary.count, 2);
      assert.equal(summary.distinct, 2);
      assert.equal(summary.min, 1);
      assert.equal(summary.max, 2);
    });
  });

});
