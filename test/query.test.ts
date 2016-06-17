import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark, BAR, AREA, PRIMITIVE_MARKS} from 'vega-lite/src/mark';
import {StackOffset} from 'vega-lite/src/stack';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';


import {assert} from 'chai';

import {SHORT_ENUM_SPEC, initEnumSpec, stack, stringifyEncodingQuery, stringifyEncodingQueryFieldDef, stringifySpecQuery} from '../src/query';
import {without} from '../src/util';

describe('query', () => {
  describe('initEnumSpec', () => {
    it('should return full enumSpec with other properties preserved', () => {
      const binQuery = initEnumSpec({values: [true, false], maxbins: 30}, 'b1', [true, false]);
      assert.deepEqual(binQuery.values, [true, false]);
      assert.equal(binQuery.maxbins, 30);
      assert.equal(binQuery.name, 'b1');
    });
  });

  describe('stackOffset', () => {
    const STACKABLE_MARKS = [BAR, AREA];
    it('should return zero for stackable marks with at least of of the stack channel if stacked is unspecified', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const specQ = {
          mark: stackableMark,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL},
            {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
          ]
        };
        assert.equal(stack(specQ), StackOffset.ZERO);
      });
    });

    it('should return the specified stack for stackable marks with at least one of the stack channel', () => {
      [StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((_stack) => {
        [BAR, AREA].forEach((stackableMark) => {
          const specQ = {
            mark: stackableMark,
            encodings: [
              {channel: Channel.X, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'N', type: Type.NOMINAL},
              {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
            ],
            config: {mark: {stacked: _stack}}
          };
          assert.equal(stack(specQ), _stack);
        });
      });
    });

    const NON_STACKABLE_MARKS = without(PRIMITIVE_MARKS, STACKABLE_MARKS);
    it('should always return none for nonstackable marks with at least of of the stack channel', () => {
      [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((_stack) => {
        NON_STACKABLE_MARKS.forEach((nonStackableMark) => {
          const specQ = {
            mark: nonStackableMark,
            encodings: [
              {channel: Channel.X, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'N', type: Type.NOMINAL},
              {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
            ],
            config: {mark: {stacked: _stack}}
          };
          assert.equal(stack(specQ), StackOffset.NONE);
        });
      });
    });

    it('should always return none for raw plot', () => {
      [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((_stack) => {
        PRIMITIVE_MARKS.forEach((mark) => {
          const specQ = {
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'N', type: Type.NOMINAL},
              {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
            ],
            config: {mark: {stack: _stack}}
          };
          assert.equal(stack(specQ), StackOffset.NONE);
        });
      });
    });

    it('should always return none if there is no grouping channel', () => {
      [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((_stack) => {
        PRIMITIVE_MARKS.forEach((mark) => {
          const specQ = {
            mark: mark,
            encodings: [
              {channel: Channel.X, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
            ],
            config: {mark: {stack: _stack}}
          };
          assert.equal(stack(specQ), StackOffset.NONE);
        });
      });
    });
  });

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

    it('should include stack for stacked specQuery', () => {
      const str = stringifySpecQuery({
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
