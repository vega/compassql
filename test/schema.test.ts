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
      // add enough non-distinct data to make the field nominal
      var total = 1 / DEFAULT_QUERY_CONFIG.numberOrdinalProportion + 1;
      for (var i = 0; i < total; i++) {
        numberData.push({a: 1});
      }
      const numberSchema = Schema.build(numberData);
      assert.equal(numberSchema.type('a'), Type.NOMINAL);
    });

    it('should infer nominal type for integers when cardinality is much less than the total and numbers are in order, starts at 0, and have no skipping', () => {
      const numberData = [];
      // add enough non-distinct data to make the field nominal/ordinal and have multiple in-order, non-skipping values that starts at 0
      // (and by default, we set them to nominal)
      var total = 3 * (1 / DEFAULT_QUERY_CONFIG.numberOrdinalProportion + 1);
      for (var i = 0; i < total; i++) {
        numberData.push({a: 0});
        numberData.push({a: 1});
        numberData.push({a: 2});
      }
      const numberSchema = Schema.build(numberData);
      assert.equal(numberSchema.type('a'), Type.NOMINAL);
    });

    it('should infer nominal type for integers when cardinality is much less than the total and numbers are in order, starts at 1, and have no skipping', () => {
      const numberData = [];
      // add enough non-distinct data to make the field nominal/ordinal and have multiple in-order, non-skipping values that starts at 1
      // (and by default, we set them to nominal)
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
      // add enough non-distinct data to make the field ordinal and have multiple in-order, with skipping values
      var total = 3 * (1 / DEFAULT_QUERY_CONFIG.numberOrdinalProportion + 1);
      for (var i = 0; i < total; i++) {
        numberData.push({a: 1});
        numberData.push({a: 3});
        numberData.push({a: 5});
      }
      const numberSchema = Schema.build(numberData);
      assert.equal(numberSchema.type('a'), Type.ORDINAL);
    });

    it('should not infer nominal type if the number set does not contain 0 or 1', () => {
      const numberData = [];
      // add enough non-distinct data to make the field ordinal and have multiple in-order, non-skipping values that do not start with 0 or 1
      var total = 3 * (1 / DEFAULT_QUERY_CONFIG.numberOrdinalProportion + 1);
      for (var i = 0; i < total; i++) {
        numberData.push({a: 2});
        numberData.push({a: 3});
        numberData.push({a: 4});
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

    it('should return the correct cardinality for a binned field when default bin parameters are specified', () => {
      const cardinalityData = [{a: 0}, {a: 10}]; // min/max
      const cardinalitySchema = Schema.build(cardinalityData);
      const cardinality: number = cardinalitySchema.cardinality({
        field: 'a',
        channel: Channel.X,
        bin: true  // should cause maxbins to be 10
      });
      assert.equal(cardinality, 10);
    });

    it('should return the correct cardinality that is less than the maximum amount of bins', () => {
      const cardinalityData = [{a: 0}, {a: 4}]; // min/max
      const cardinalitySchema = Schema.build(cardinalityData);
      const cardinality: number = cardinalitySchema.cardinality({
        field: 'a',
        channel: Channel.X,
        bin: true  // should cause maxbins to be 10
      });
      assert.isTrue(cardinality < 10);
    });

    it('should correctly return binned cardinality when specific bin parameters are specified', () => {
      const cardinalityData = [{a: 0}, {a: 5}]; // min/max
      const cardinalitySchema = Schema.build(cardinalityData);
      const cardinality: number = cardinalitySchema.cardinality({
        field: 'a',
        channel: Channel.X,
        bin: {
          maxbins: 5
        }
      });
      assert.equal(cardinality, 5);
    });

    it('should correctly compute new binned cardinality when bin params are not already cached', () => {
      const cardinalityData = [{a: 0}, {a: 7}]; // min/max
      const cardinalitySchema = Schema.build(cardinalityData);
      const cardinality: number = cardinalitySchema.cardinality({
        field: 'a',
        channel: Channel.X,
        bin: {
          maxbins: 7
        }
      });
      assert.equal(cardinality, 7);
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

  describe('domain', () => {
    const domainData = [
      {a: 1, b: 1.1, c: 'a', d: 'a', e: 'July 14 2016'},
      {a: 2, b: 1.2, c: 'b', d: 'a', e: '7/14/2016'},
      {a: 3, b: 1.3, c: 'c', d: 'b', e: '6/14/2016'},
      {a: 4, b: 1.4, c: 'd', d: 'b', e: '6-14-2016'}
    ];
    const domainSchema: Schema = Schema.build(domainData);
    it('should return an array containing one of each datapoint corresponding to the given EncodingQuery for non-Q data', () => {
      const domain: string[] = domainSchema.domain({field: 'c', channel: Channel.X});
      assert.isNotNull(domain);
      assert.equal(domain.length, 4);
      assert.notEqual(domain.indexOf('a'), -1);
      assert.notEqual(domain.indexOf('b'), -1);
      assert.notEqual(domain.indexOf('c'), -1);
      assert.notEqual(domain.indexOf('d'), -1);
    });

    it('should only return one copy of datapoints that occur multiple times', () => {
      const domain: string[] = domainSchema.domain({field: 'd', channel: Channel.X});
      assert.equal(domain.length, 2);
      assert.notEqual(domain.indexOf('a'), -1);
      assert.notEqual(domain.indexOf('b'), -1);
    });

    it('should return an array of length 2 containing min and max for quantitative data', () => {
      var domain: number[] = domainSchema.domain({field: 'a', channel: Channel.X});
      assert.equal(domain.length, 2);
      assert.equal(domain.indexOf(1), 0);
      assert.equal(domain.indexOf(4), 1);
      domain = domainSchema.domain({field: 'b', channel: Channel.X});
      assert.equal(domain.length, 2);
      assert.equal(domain.indexOf(1.1), 0);
      assert.equal(domain.indexOf(1.4), 1);
    });

    it('should return a date array containing correctly translated date types', () => {
      var domain: Date[] = domainSchema.domain({field: 'e', channel: Channel.X});
      assert.equal(domain.length, 2);
      assert.equal(domain[0].getTime(), new Date('7/14/2016').getTime());
      assert.equal(domain[1].getTime(), new Date('6/14/2016').getTime());
    });
  });

});
