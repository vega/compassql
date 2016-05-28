import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {assert} from 'chai';

import {SHORT_ENUM_SPEC, stringifyEncodingQuery, stringifyEncodingQueryFieldDef, stringifySpecQuery} from '../src/query';

describe('query', () => {
  describe('stringifySpecQuery', () => {
    it('should return correct spec string for specific specQuery', () => {
      const str = stringifySpecQuery({
        mark: Mark.POINT,
        encodings: [
            {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|x:a,q');
    });

    it('should return correct spec string for ambiguous specQuery', () => {
      const str = stringifySpecQuery({
        mark: SHORT_ENUM_SPEC,
        encodings: [
            {channel: SHORT_ENUM_SPEC, field: SHORT_ENUM_SPEC, type: SHORT_ENUM_SPEC, aggregate: SHORT_ENUM_SPEC}
        ]
      });
      assert.equal(str, '?|?:?(?,?)');
    });
  });

  describe('stringifyEncodingQuery', () => {
    it('should return correct encoding string for raw field', () => {
       const str = stringifyEncodingQuery({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'x:a,q');
    });
  });

  describe('stringifyEncodingQueryFieldDef', () => {
    it('should return correct fieldDef string for raw field', () => {
       const str = stringifyEncodingQueryFieldDef({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'a,q');
    });

    it('should return correct fieldDef string for aggregate field', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN
       });
       assert.equal(str, 'mean(a,q)');
    });

    it('should return correct fieldDef string for ambiguous aggregate field', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?(a,q)');
    });

    it('should return correct fieldDef string for timeunit field', () => {
      const str = stringifyEncodingQueryFieldDef({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: TimeUnit.HOURS
        });
      assert.equal(str, 'hours(a,q)');
    });

    it('should return correct fieldDef string for ambiguous timeunit field', () => {
      const str = stringifyEncodingQueryFieldDef({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: SHORT_ENUM_SPEC
        });
      assert.equal(str, '?(a,q)');
    });

    it('should return correct fieldDef string for bin field', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: true
       });
       assert.equal(str, 'bin(a,q)');
    });

    it('should return correct fieldDef string for ambiguous bin field', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?(a,q)');
    });

    it('should return correct fieldDef string for ambiguous field', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: SHORT_ENUM_SPEC, type: Type.QUANTITATIVE
       });
       assert.equal(str, '?,q');
    });

    it('should return correct fieldDef string for autocount field', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, autoCount: true
       });
       assert.equal(str, 'count(*,q)');
    });

    it('should return correct fieldDef string for ambiguous autocount field', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, autoCount: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?(*,q)');
    });

    it('should return correct fieldDef string for ambiguous type', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: 'a', type: SHORT_ENUM_SPEC
       });
       assert.equal(str, 'a,?');
    });
  });
});
