  import {ScaleType} from 'vega-lite/src/scale';
  import {Type} from 'vega-lite/src/type';
  import {TimeUnit} from 'vega-lite/src/timeunit';
  import {assert} from 'chai';

  import {scaleType} from '../../src/query/encoding';
  import {SHORT_ENUM_SPEC} from '../../src/enumspec';

  describe('scaleType', () => {
    it('should return specified as scale type', () => {
      const sType = scaleType({
        channel: SHORT_ENUM_SPEC,
        scale: {type: ScaleType.LINEAR},
        type: SHORT_ENUM_SPEC
      });
      assert.equal(sType, ScaleType.LINEAR);
    });

    it('should return undefined if scale type is not specified and type is an EnumSpec', () => {
      const sType = scaleType({
        channel: SHORT_ENUM_SPEC,
        type: SHORT_ENUM_SPEC
      });
      assert.equal(sType, undefined);
    });

    it('should return ScaleType.LINEAR if type is quantitative and scale type is not specified', () => {
      const sType = scaleType({
        channel: SHORT_ENUM_SPEC,
        type: Type.QUANTITATIVE
      });
      assert.equal(sType, ScaleType.LINEAR);
    });

    [Type.ORDINAL, Type.NOMINAL].forEach((type) => {
      it('should return ScaleType.ORDINAL if type is ' + type + ' and scale type is not specified', () => {
        const sType = scaleType({
          channel: SHORT_ENUM_SPEC,
          type: type
        });
        assert.equal(sType, ScaleType.ORDINAL);
      });
    });

    it('should return undefined if scale type is not specified, type is temporal, and TimeUnit is an EnumSpec', () => {
      const sType = scaleType({
        channel: SHORT_ENUM_SPEC,
        timeUnit: SHORT_ENUM_SPEC,
        type: Type.TEMPORAL
      });
      assert.equal(sType, undefined);
    });

    it('should return ScaleType.TIME if type is temporal and scale type and TimeUnit are not specified', () => {
      const sType = scaleType({
        channel: SHORT_ENUM_SPEC,
        type: Type.TEMPORAL
      });
      assert.equal(sType, ScaleType.TIME);
    });

    [TimeUnit.HOURS, TimeUnit.DAY, TimeUnit.MONTH, TimeUnit.QUARTER].forEach((timeUnit) => {
      it('should return ScaleType.ORDINAL if type is temporal and TimeUnit is ' + timeUnit + ' and scale type is not specified', () => {
        const sType = scaleType({
          channel: SHORT_ENUM_SPEC,
          timeUnit: timeUnit,
          type: Type.TEMPORAL
        });
        assert.equal(sType, ScaleType.ORDINAL);
      });
    });

    [TimeUnit.YEAR, TimeUnit.DATE, TimeUnit.MINUTES, TimeUnit.SECONDS, TimeUnit.MILLISECONDS, TimeUnit.YEARMONTH,
     TimeUnit.YEARMONTHDATE, TimeUnit.YEARMONTHDATEHOURS, TimeUnit.YEARMONTHDATEHOURSMINUTES, TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
     TimeUnit.HOURSMINUTES, TimeUnit.HOURSMINUTESSECONDS, TimeUnit.MINUTESSECONDS, TimeUnit.SECONDSMILLISECONDS,
     TimeUnit.YEARQUARTER, TimeUnit.QUARTERMONTH, TimeUnit.YEARQUARTERMONTH].forEach((timeUnit) => {
       it('should return ScaleType.TIME if type is temporal and TimeUnit is ' + timeUnit + ' and scale type is not specified', () => {
         const sType = scaleType({
          channel: SHORT_ENUM_SPEC,
          timeUnit: timeUnit,
          type: Type.TEMPORAL
         });
         assert.equal(sType, ScaleType.TIME);
       });
     });

     it('should return ScaleType.TIME if type is temporal, TimeUnit is undefined, and scale type is not defined', () => {
       const sType = scaleType({
         channel: SHORT_ENUM_SPEC,
         type: Type.TEMPORAL
       });
       assert.equal(sType, ScaleType.TIME);
     });
  });
