import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {SHORT_ENUM_SPEC} from '../../src/enumspec';
import {spec as specShorthand, encoding as encodingShorthand, fieldDef as fieldDefShorthand} from '../../src/query/shorthand';

import {assert} from 'chai';

describe('query/shorthand', () => {
  describe('spec', () => {
    it('should return correct spec string for specific specQuery', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|x:a,q');
    });

    it('should return correct spec string for specific specQuery when mark is not included.', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      }, {channel: true, field: true, type: true});
      assert.equal(str, 'x:a,q');
    });

    it('should include stack for stacked specQuery', () => {
      const str = specShorthand({
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
      const str = specShorthand({
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
       const str = encodingShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'x:a,q');
    });

    it('should return correct encoding string for raw field when channel is not included', () => {
       const str = encodingShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE
       }, {
         field: true, type: true
       });
       assert.equal(str, 'a,q');
    });
  });

  describe('fieldDefShorthand', () => {
    it('should return - for disabled autocount field', () => {
       const str = fieldDefShorthand({channel: Channel.X, autoCount: false});
       assert.equal(str, '-');
    });

    it('should return correct fieldDefShorthand string for raw field', () => {
       const str = fieldDefShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'a,q');
    });

    it('should return correct fieldDefShorthand string for raw field when nothing is included', () => {
       const str = fieldDefShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}, {});
       assert.equal(str, '...');
    });

    it('should return correct fieldDefShorthand string for aggregate field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN
       });
       assert.equal(str, 'mean(a,q)');
    });

    it('should not include aggregate string for aggregate field when aggregate is not included', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN
       }, {field: true, type: true});
       assert.equal(str, 'a,q');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?(a,q)');
    });

    it('should return correct fieldDefShorthand string for timeunit field', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: TimeUnit.HOURS
        });
      assert.equal(str, 'hours(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous timeunit field', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: SHORT_ENUM_SPEC
        });
      assert.equal(str, '?(a,q)');
    });

    it('should return correct fieldDefShorthand string for bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: true
       });
       assert.equal(str, 'bin(a,q)');
    });


    it('should return correct fieldDefShorthand string for bin field with maxbins', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}
       });
       assert.equal(str, 'bin(a,q,maxbins=20)');
    });

    it('should return correct fieldDefShorthand string for bin field with maxbins and scale with scaleType log', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}, scale: {type: ScaleType.LOG}
      });
      assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"log"})');
    });

    it('should return correct fieldDefShorthand string for bin field with maxbins and scale with scaleType log when only field, bin, and type are included', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}, scale: {type: ScaleType.LOG}
      }, {field: true, bin: true, type: true});
      assert.equal(str, 'bin(a,q)');
    });

    it('should return correct fieldDefShorthand string for disabled scale', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: null
      });
      assert.equal(str, 'a,q,scale=false');
    });

    it('should return correct fieldDefShorthand string for disabled scale', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: false
      });
      assert.equal(str, 'a,q,scale=false');
    });

    it('should return correct fieldDefShorthand string for empty scale definition', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {}
      });
      assert.equal(str, 'a,q');
    });

    it('should return correct fieldDefShorthand string for scale with scaleType log', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LOG}
       });
       assert.equal(str, 'a,q,scale={"type":"log"}');
    });

    it('should return correct fieldDefShorthand string for scale with zero=true', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {zero: true}
      });
      assert.equal(str, 'a,q,scale={"zero":true}');
    });

    // TODO: Update tests for other scale.*

    it('should return correct fieldDefShorthand string for ambiguous bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: SHORT_ENUM_SPEC, type: Type.QUANTITATIVE
       });
       assert.equal(str, '?,q');
    });

    it('should return correct fieldDefShorthand string for autocount field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, autoCount: true
       });
       assert.equal(str, 'count(*,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous autocount field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, autoCount: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?(*,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous type', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: SHORT_ENUM_SPEC
       });
       assert.equal(str, 'a,?');
    });
  });
});
