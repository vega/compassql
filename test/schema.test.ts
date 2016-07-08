import {assert} from 'chai';

import {Type} from 'vega-lite/src/type';
import {Channel} from 'vega-lite/src/channel';

import {Schema, PrimitiveType} from '../src/schema';

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
  });

  describe('cardinality', () => {
    it('should return the correct cardinality for each field', () => {
      assert.equal(schema.cardinality({field: 'a', channel: Channel.X}), 2);
      assert.equal(schema.cardinality({field: 'b', channel: Channel.X}), 2);
      assert.equal(schema.cardinality({field: 'c', channel: Channel.X}), 1);
      assert.equal(schema.cardinality({field: 'd', channel: Channel.X}), 1);
    });
  });

});
