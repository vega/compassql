  import {ScaleType} from 'vega-lite/src/scale';
  import {Type} from 'vega-lite/src/type';
  import {TimeUnit} from 'vega-lite/src/timeunit';
  import {assert} from 'chai';

  import {scaleType} from '../../src/query/encoding';
  import {SHORT_WILDCARD} from '../../src/wildcard';

  describe('query/encoding/scaleType', () => {
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
        type: 'temporal',
      });
      assert.equal(sType, undefined);
    });


    it('should return ScaleType.LINEAR if type is quantitative for x and scale type is not specified', () => {
      const sType = scaleType({
        channel: 'x',
        type: Type.QUANTITATIVE
      });
      assert.equal(sType, ScaleType.LINEAR);
    });

    it('should return undefined if scale type is not specified, type is temporal, and TimeUnit is a Wildcard', () => {
      const sType = scaleType({
        channel: SHORT_WILDCARD,
        timeUnit: SHORT_WILDCARD,
        type: Type.TEMPORAL
      });
      assert.equal(sType, undefined);
    });

    it('should return ScaleType.TIME if type is temporal and scale type and TimeUnit are not specified', () => {
      const sType = scaleType({
        channel: 'x',
        type: Type.TEMPORAL
      });
      assert.equal(sType, ScaleType.TIME);
    });

    [TimeUnit.HOURS, TimeUnit.DAY, TimeUnit.MONTH, TimeUnit.QUARTER].forEach((timeUnit) => {
      it('should return ScaleType.ORDINAL if type is temporal and TimeUnit is ' + timeUnit + ' and scale type is not specified', () => {
        const sType = scaleType({
          channel: 'x',
          timeUnit: timeUnit,
          type: Type.TEMPORAL
        });
        assert.equal(sType, ScaleType.POINT);
      });
    });

    [TimeUnit.YEAR, TimeUnit.DATE, TimeUnit.MINUTES, TimeUnit.SECONDS, TimeUnit.MILLISECONDS, TimeUnit.YEARMONTH,
     TimeUnit.YEARMONTHDATE, TimeUnit.YEARMONTHDATEHOURS, TimeUnit.YEARMONTHDATEHOURSMINUTES, TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
     TimeUnit.HOURSMINUTES, TimeUnit.HOURSMINUTESSECONDS, TimeUnit.MINUTESSECONDS, TimeUnit.SECONDSMILLISECONDS,
     TimeUnit.YEARQUARTER, TimeUnit.QUARTERMONTH, TimeUnit.YEARQUARTERMONTH].forEach((timeUnit) => {
       it('should return ScaleType.TIME if type is temporal and TimeUnit is ' + timeUnit + ' and scale type is not specified', () => {
         const sType = scaleType({
          channel: 'x',
          timeUnit: timeUnit,
          type: Type.TEMPORAL
         });
         assert.equal(sType, ScaleType.TIME);
       });
     });

     it('should return ScaleType.TIME if type is temporal, TimeUnit is undefined, and scale type is not defined', () => {
       const sType = scaleType({
         channel: 'x',
         type: Type.TEMPORAL
       });
       assert.equal(sType, ScaleType.TIME);
     });
  });
