import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {SHORT_ENUM_SPEC} from '../../src/enumspec';
import {spec, encoding, fieldDefShorthand} from '../../src/query/shorthand';

import {assert} from 'chai';

describe('shorthand', () => {
  describe('spec', () => {
    it('should return correct spec string for specific specQuery', () => {
      const str = spec({
        mark: Mark.POINT,
        encodings: [
            {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|x:a,q');
    });

    it('should include stack for stacked specQuery', () => {
      const str = spec({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'q', type: Type.QUANTITATIVE, aggregate: AggregateOp.SUM},
          {channel: Channel.Y, field: 'n', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'n1', type: Type.NOMINAL}
        ]
      });
      assert.equal(str, 'bar|stack=zero|color:n1,n|x:sum(q,q)|y:n,n');
    });

    it('should return correct spec string for ambiguous specQuery', () => {
      const str = spec({
        mark: SHORT_ENUM_SPEC,
        encodings: [
            {channel: SHORT_ENUM_SPEC, field: SHORT_ENUM_SPEC, type: SHORT_ENUM_SPEC, aggregate: SHORT_ENUM_SPEC}
        ]
      });
      assert.equal(str, '?|?:?(?,?)');
    });
  });

  describe('encoding', () => {
    it('should return correct encoding string for raw field', () => {
       const str = encoding({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'x:a,q');
    });
  });

  describe('fieldDefShorthand', () => {
    it('should return correct fieldDefShorthand string for raw field', () => {
       const fieldDef = fieldDefShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(fieldDef, 'a,q');
    });

    it('should return correct fieldDefShorthand string for aggregate field', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN
       });
       assert.equal(fieldDef, 'mean(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate field', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: SHORT_ENUM_SPEC
       });
       assert.equal(fieldDef, '?(a,q)');
    });

    it('should return correct fieldDefShorthand string for timeunit field', () => {
      const fieldDef = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: TimeUnit.HOURS
        });
      assert.equal(fieldDef, 'hours(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous timeunit field', () => {
      const fieldDef = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: SHORT_ENUM_SPEC
        });
      assert.equal(fieldDef, '?(a,q)');
    });

    it('should return correct fieldDefShorthand string for bin field', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: true
       });
       assert.equal(fieldDef, 'bin(a,q)');
    });


    it('should return correct fieldDefShorthand string for bin field with maxbins', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}
       });
       assert.equal(fieldDef, 'bin(a,q,maxbins=20)');
    });

    it('should return correct fieldDefShorthand string for bin field with maxbins and scale with scaleType log', () => {
      const fieldDef = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}, scale: {type: ScaleType.LOG}
      });
      assert.equal(fieldDef, 'bin(a,q,maxbins=20,scale={"type":"log"})');
    });

    it('should return correct fieldDefShorthand string for disabled scale', () => {
      const fieldDef = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: null
      });
      assert.equal(fieldDef, 'a,q,scale=false');
    });

    it('should return correct fieldDefShorthand string for disabled scale', () => {
      const fieldDef = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: false
      });
      assert.equal(fieldDef, 'a,q,scale=false');
    });

    it('should return correct fieldDefShorthand string for scale with scaleType log', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LOG}
       });
       assert.equal(fieldDef, 'a,q,scale={"type":"log"}');
    });

    it('should return correct fieldDefShorthand string for scale with zero=true', () => {
      const fieldDef = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {zero: true}
      });
      assert.equal(fieldDef, 'a,q,scale={"zero":true}');
    });

    // TODO: Update tests for other scale.*

    it('should return correct fieldDefShorthand string for ambiguous bin field', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: SHORT_ENUM_SPEC
       });
       assert.equal(fieldDef, '?(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous field', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: SHORT_ENUM_SPEC, type: Type.QUANTITATIVE
       });
       assert.equal(fieldDef, '?,q');
    });

    it('should return correct fieldDefShorthand string for autocount field', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, autoCount: true
       });
       assert.equal(fieldDef, 'count(*,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous autocount field', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, autoCount: SHORT_ENUM_SPEC
       });
       assert.equal(fieldDef, '?(*,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous type', () => {
       const fieldDef = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: SHORT_ENUM_SPEC
       });
       assert.equal(fieldDef, 'a,?');
    });
  });
});
