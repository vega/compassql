import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark, BAR, AREA, PRIMITIVE_MARKS} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {StackOffset} from 'vega-lite/src/stack';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {assert} from 'chai';

import {schema} from './fixture';
import {EnumSpec, query, Query, SHORT_ENUM_SPEC, initEnumSpec, stack, stringifyEncodingQuery, stringifyEncodingQueryFieldDef, stringifySpecQuery, normalize} from '../src/query';
import {SpecQueryModel} from '../src/model';
import {isSpecQueryModelGroup, SpecQueryModelGroup} from '../src/modelgroup';
import {duplicate, without} from '../src/util';

describe('query', () => {
  describe('query()', () => {
    describe('nested query', () => {
      const q: Query = {
        spec: {
          mark: '?',
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        nest: [
          {groupBy: 'fieldTransform'}
        ],
        orderBy: 'effectiveness',
      };
      const qCopy = duplicate(q);
      const output = query(q, schema);
      const result = output.result;

      it('enumerates a nested query correctly ', () => {
        assert.isTrue(isSpecQueryModelGroup(result.items[0]));
        if (isSpecQueryModelGroup(result.items[0])) {
          const group1: SpecQueryModelGroup = <SpecQueryModelGroup> result.items[0];
          assert.isFalse(isSpecQueryModelGroup(group1.items[0]));
          assert.equal(group1.items.length, 2);
          assert.equal((<SpecQueryModel>group1.items[0]).specQuery.mark, 'tick');
          assert.equal((<SpecQueryModel>group1.items[1]).specQuery.mark, 'point');
        }
      });

      it('should augment enumSpec name for enum specs', () => {
        assert.isDefined((output.query.spec.mark as EnumSpec<Mark>).name);
      });

      it('should not cause side effect to the original query object.', () => {
        assert.deepEqual(q, qCopy);
      });
    });
    it('enumerates a flat query correctly ', () => {
      const q: Query = {
        spec: {
          mark: '?',
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        orderBy: 'effectiveness',
      };
      const result = query(q, schema).result;
      assert.isFalse(isSpecQueryModelGroup(result.items[0]));
      assert.equal(result.items.length, 2);
      assert.equal((<SpecQueryModel>result.items[0]).specQuery.mark, 'tick');
      assert.equal((<SpecQueryModel>result.items[1]).specQuery.mark, 'point');
    });
  });

  describe('initEnumSpec', () => {
    it('should return full enumSpec with other properties preserved', () => {
      const binQuery = initEnumSpec({values: [true, false], maxbins: 30}, 'b1', [true, false]);
      assert.deepEqual(binQuery.values, [true, false]);
      assert.equal(binQuery.maxbins, 30);
      assert.equal(binQuery.name, 'b1');
    });
  });

  describe('normalize', () => {
    it('should correctly normalize query', () => {
      const q: Query = {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        groupBy: 'fieldTransform',
        chooseBy: 'effectiveness',
        orderBy: 'effectiveness'
      };

      assert.deepEqual(normalize(q), {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        nest: [{
          groupBy: 'fieldTransform',
          orderGroupBy: 'effectiveness'
        }],
        chooseBy: 'effectiveness'
      });
    });
  });

  describe('stack', () => {
    const STACKABLE_MARKS = [BAR, AREA];
    const NON_STACKABLE_MARKS = without(PRIMITIVE_MARKS, STACKABLE_MARKS);

    it('should always return null for nonstackable marks with at least of of the stack channel', () => {
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
          assert.equal(stack(specQ), null);
        });
      });
    });

    it('should always return null for raw plot', () => {
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
          assert.equal(stack(specQ), null);
        });
      });
    });

    it('should always return null if there is no grouping channel', () => {
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
          assert.equal(stack(specQ), null);
        });
      });
    });
    it('should always be disabled if both x and y are aggregate', () => {
      [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
        PRIMITIVE_MARKS.forEach((mark) => {
          const specQ = {
              mark: mark,
              encodings: [
                {channel: Channel.X, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
                {channel: Channel.Y, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
                {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
              ]
            };
          assert.isNull(stack(specQ));
        });
      });
    });

    it('should always be disabled if neither x nor y is aggregate', () => {
      [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
        PRIMITIVE_MARKS.forEach((mark) => {
          const specQ = {
              mark: mark,
              encodings: [
                {channel: Channel.X, field: 'N', type: Type.NOMINAL},
                {channel: Channel.Y, field: 'N', type: Type.NOMINAL},
                {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
              ]
            };
          assert.isNull(stack(specQ));
        });
      });
    });

    describe('stack().groupbyChannel, .fieldChannel', () => {
      it('should be correct for horizontal', () => {
        [BAR, AREA].forEach((stackableMark) => {
          const specQ = {
              mark: stackableMark,
              encodings: [
                {channel: Channel.X, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
                {channel: Channel.Y, field: 'N', type: Type.NOMINAL},
                {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
              ]
            };
          const _stack = stack(specQ);
          assert.equal(_stack.fieldChannel, Channel.X);
          assert.equal(_stack.groupbyChannel, Channel.Y);
        });
      });

      it('should be correct for horizontal (single)', () => {
        [BAR, AREA].forEach((stackableMark) => {
          const specQ = {
              mark: stackableMark,
              encodings: [
                {channel: Channel.X, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
                {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
              ]
            };
          const _stack = stack(specQ);
          assert.equal(_stack.fieldChannel, Channel.X);
          assert.equal(_stack.groupbyChannel, null);
        });
      });

      it('should be correct for vertical', () => {
        [BAR, AREA].forEach((stackableMark) => {
          const specQ = {
              mark: stackableMark,
              encodings: [
                {channel: Channel.Y, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
                {channel: Channel.X, field: 'N', type: Type.NOMINAL},
                {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
              ]
            };
          const _stack = stack(specQ);
          assert.equal(_stack.fieldChannel, Channel.Y);
          assert.equal(_stack.groupbyChannel, Channel.X);
        });
      });

      it('should be correct for vertical (single)', () => {
        [BAR, AREA].forEach((stackableMark) => {
          const specQ = {
              mark: stackableMark,
              encodings: [
                {channel: Channel.Y, aggregate: AggregateOp.SUM, field: 'Q', type: Type.QUANTITATIVE},
                {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
              ]
            };
          const _stack = stack(specQ);
          assert.equal(_stack.fieldChannel, Channel.Y);
          assert.equal(_stack.groupbyChannel, null);
        });
      });


      it('should be correct for auto count', () => {
        [BAR, AREA].forEach((stackableMark) => {
          const specQ = {
              mark: stackableMark,
              encodings: [
                {channel: Channel.Y, autoCount: true, type: Type.QUANTITATIVE},
                {channel: Channel.COLOR, field: 'N1', type: Type.NOMINAL},
              ]
            };
          const _stack = stack(specQ);
          assert.isNotNull(_stack);
        });
      });
    });

    describe('stack().offset', () => {
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
          assert.equal(stack(specQ).offset, StackOffset.ZERO);
        });
      });

      it('should return the specified stack for stackable marks with at least one of the stack channel', () => {
        [StackOffset.CENTER, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((_stack) => {
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
            assert.equal(stack(specQ).offset, _stack);
          });
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


    it('should return correct fieldDef string for bin field with maxbins', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}
       });
       assert.equal(str, 'bin(a,q,maxbins=20)');
    });

    it('should return correct fieldDef string for bin field with maxbins and scale with scaleType log', () => {
      const str = stringifyEncodingQueryFieldDef({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}, scale: {type: ScaleType.LOG}
      });
      assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"log"})');
    });

    it('should return correct fieldDef string for disabled scale', () => {
      const str = stringifyEncodingQueryFieldDef({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: null
      });
      assert.equal(str, 'a,q,scale=false');
    });

    it('should return correct fieldDef string for disabled scale', () => {
      const str = stringifyEncodingQueryFieldDef({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: false
      });
      assert.equal(str, 'a,q,scale=false');
    });

    it('should return correct fieldDef string for scale with scaleType log', () => {
       const str = stringifyEncodingQueryFieldDef({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LOG}
       });
       assert.equal(str, 'a,q,scale={"type":"log"}');
    });

    // TODO: Update tests for other scale.*

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
