import {assert} from 'chai';
import {TextDef} from 'vega-lite/build/src/channeldef';
import {ScaleType} from 'vega-lite/build/src/scale';
import {
  TimeUnit,
  LOCAL_SINGLE_TIMEUNIT_INDEX,
  UTC_SINGLE_TIMEUNIT_INDEX,
  LOCAL_MULTI_TIMEUNIT_INDEX,
  UTC_MULTI_TIMEUNIT_INDEX
} from 'vega-lite/build/src/timeunit';
import * as TYPE from 'vega-lite/build/src/type';
import {scaleType, toFieldDef, toValueDef} from '../../src/query/encoding';
import {SHORT_WILDCARD} from '../../src/wildcard';

const TIMEUNITS = Object.keys(LOCAL_SINGLE_TIMEUNIT_INDEX).concat(
  Object.keys(UTC_SINGLE_TIMEUNIT_INDEX),
  Object.keys(LOCAL_MULTI_TIMEUNIT_INDEX),
  Object.keys(UTC_MULTI_TIMEUNIT_INDEX)
);

describe('query/encoding', () => {
  describe('toFieldDef', () => {
    it('return correct fieldDef for autoCount', () => {
      assert.deepEqual(toFieldDef({channel: 'x', autoCount: true, type: 'quantitative'}), {
        aggregate: 'count',
        field: '*',
        type: 'quantitative'
      });
    });

    it('return correct fieldDef for FieldQuery', () => {
      assert.deepEqual(
        toFieldDef(
          {bin: false, channel: 'x', field: 'Q', type: 'quantitative'},
          {props: ['bin', 'timeUnit', 'type'], wildcardMode: 'skip'}
        ),
        {type: 'quantitative'}
      );
    });

    it('return correct fieldDef for Text FieldQuery with format', () => {
      assert.deepEqual<TextDef<string>>(
        toFieldDef(
          {format: '.3f', channel: 'text', field: 'Q', type: 'quantitative'},
          {props: ['field', 'format', 'type'], wildcardMode: 'skip'}
        ) as TextDef<string>,
        {format: '.3f', field: 'Q', type: 'quantitative'}
      );
    });
  });

  describe('toValueDef', () => {
    it('return correct ValueDef for ValueQuery with constant', () => {
      assert.deepEqual(toValueDef({channel: 'x', value: 5}), {value: 5});
    });

    it('return correct null for ValueQuery with wildcard', () => {
      assert.deepEqual(toValueDef({channel: 'x', value: '?'}), null);
    });
  });

  describe('scaleType', () => {
    it('should return specified scale type if it is valid', () => {
      const sType = scaleType({
        channel: 'x',
        scale: {type: ScaleType.LINEAR},
        type: 'quantitative'
      });
      assert.equal(sType, ScaleType.LINEAR);
    });

    it('should return undefined if scale.type is a wildcard', () => {
      const sType = scaleType({
        channel: 'x',
        scale: {type: '?'},
        type: 'quantitative'
      });
      assert.equal(sType, undefined);
    });

    it('should return undefined if type is a wildcard', () => {
      const sType = scaleType({
        channel: 'x',
        type: '?'
      });
      assert.equal(sType, undefined);
    });

    it('should return undefined if channel is a wildcard', () => {
      const sType = scaleType({
        channel: '?',
        type: 'quantitative'
      });
      assert.equal(sType, undefined);
    });

    // These tests are for the commented rule in the scaleType() function.
    // it('should return undefined if channel is x/y and scale.rangeStep is a short wildcard', () => {
    //   const sType = scaleType({
    //     channel: 'x',
    //     type: 'quantitative',
    //     scale: {rangeStep: '?'}
    //   });
    //   assert.equal(sType, undefined);
    // });

    // it('should return undefined if channel is x/y and scale.rangeStep is a wildcard that contains undefined', () => {
    //   const sType = scaleType({
    //     channel: 'x',
    //     type: 'quantitative',
    //     scale: {rangeStep: {enum: [undefined, 21]}}
    //   });
    //   assert.equal(sType, undefined);
    // });

    // it('should not return undefined if channel is x/y and scale.rangeStep is a wildcard that contain only number', () => {
    //   const sType = scaleType({
    //     channel: 'x',
    //     type: 'quantitative',
    //     scale: {rangeStep: {enum: [17, 21]}}
    //   });
    //   assert.notEqual(sType, undefined);
    // });

    it('should return undefined if timeUnit is a wildcard for a temporal field', () => {
      const sType = scaleType({
        channel: 'x',
        timeUnit: '?',
        type: 'temporal'
      });
      assert.equal(sType, undefined);
    });

    it('should return ScaleType.LINEAR if type is quantitative for x and scale type is not specified', () => {
      const sType = scaleType({
        channel: 'x',
        type: TYPE.QUANTITATIVE
      });
      assert.equal(sType, ScaleType.LINEAR);
    });

    it('should return undefined if scale type is not specified, type is temporal, and TimeUnit is a Wildcard', () => {
      const sType = scaleType({
        channel: SHORT_WILDCARD,
        timeUnit: SHORT_WILDCARD,
        type: TYPE.TEMPORAL
      });
      assert.equal(sType, undefined);
    });

    it('should return ScaleType.TIME if type is temporal and scale type and TimeUnit are not specified', () => {
      const sType = scaleType({
        channel: 'x',
        type: TYPE.TEMPORAL
      });
      assert.equal(sType, ScaleType.TIME);
    });

    TIMEUNITS.forEach(timeUnit => {
      it('should return ScaleType.TIME if type is temporal and has timeUnit', () => {
        const sType = scaleType({
          channel: 'x',
          timeUnit: timeUnit as TimeUnit,
          type: TYPE.TEMPORAL
        });
        assert.equal(sType, ScaleType.TIME);
      });
    });

    it('should return ScaleType.TIME if type is temporal, TimeUnit is undefined, and scale type is not defined', () => {
      const sType = scaleType({
        channel: 'x',
        type: TYPE.TEMPORAL
      });
      assert.equal(sType, ScaleType.TIME);
    });
  });
});
