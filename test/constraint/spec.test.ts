import {assert} from 'chai';
import {AggregateOp} from 'vega';
import {SUM_OPS} from 'vega-lite/build/src/aggregate';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
// import * as log from 'vega-lite/build/src/log';
import {ScaleType} from 'vega-lite/build/src/scale';
import {TimeUnit} from 'vega-lite/build/src/timeunit';
import * as TYPE from 'vega-lite/build/src/type';
import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {SpecConstraintModel, SPEC_CONSTRAINTS, SPEC_CONSTRAINT_INDEX} from '../../src/constraint/spec';
import {SpecQueryModel} from '../../src/model';
import {Property} from '../../src/property';
import {AutoCountQuery} from '../../src/query/encoding';
import {SpecQuery} from '../../src/query/spec';
import {Schema} from '../../src/schema';
import {duplicate, extend, without} from '../../src/util';
import {DEFAULT_ENUM_INDEX, SHORT_WILDCARD, Wildcard} from '../../src/wildcard';

describe('constraints/spec', () => {
  const schema = new Schema({fields: []});

  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  const CONSTRAINT_MANUALLY_SPECIFIED_CONFIG = extend({}, DEFAULT_QUERY_CONFIG, {
    constraintManuallySpecifiedValue: true
  });

  // Make sure all non-strict constraints have their configs.
  SPEC_CONSTRAINTS.forEach(constraint => {
    if (!constraint.strict()) {
      it(constraint.name() + ' should have default config for all non-strict constraints', () => {
        assert.isDefined(DEFAULT_QUERY_CONFIG[constraint.name()]);
      });
    }
  });

  describe('alwaysIncludeZeroInScaleWithBarMark', () => {
    it('should return false if scale does not start at zero when bar mark is used', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'A', scale: {zero: false}, type: TYPE.QUANTITATIVE}]
      });

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['alwaysIncludeZeroInScaleWithBarMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if scale starts at zero when bar mark is used', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'A', scale: {zero: true}, type: TYPE.QUANTITATIVE}]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['alwaysIncludeZeroInScaleWithBarMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });
  });

  describe('hasAllRequiredPropertiesSpecific', () => {
    const specCModel = new SpecConstraintModel({
      name: 'Test SpecModel for hasAllRequiredPropertiesSpecific class method',
      description: 'Test SpecModel for hasAllRequiredPropertiesSpecific class method',
      properties: [Property.AGGREGATE, Property.TYPE, Property.SCALE, {parent: 'scale', child: 'type'}, Property.MARK],
      allowWildcardForProperties: false,
      strict: true,
      satisfy: undefined
    });

    it('should return true if all properties is defined', () => {
      const specQM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {aggregate: 'mean', channel: CHANNEL.X, field: 'A', scale: {type: ScaleType.LOG}, type: TYPE.QUANTITATIVE}
        ]
      });
      assert.isTrue(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });

    it('should return true if a required property is undefined', () => {
      const specQM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{aggregate: 'mean', channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });
      assert.isTrue(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });

    it('should return false if a required property is a wildcard', () => {
      const specQM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{aggregate: 'mean', channel: CHANNEL.X, field: 'A', scale: SHORT_WILDCARD, type: TYPE.QUANTITATIVE}]
      });
      assert.isFalse(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });

    it('should return false if a nested required property is a wildcard', () => {
      const specQM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {aggregate: 'mean', channel: CHANNEL.X, field: 'A', scale: {type: SHORT_WILDCARD}, type: TYPE.QUANTITATIVE}
        ]
      });
      assert.isFalse(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });
  });

  describe('autoAddCount', () => {
    function autoCountShouldBe(expectedAutoCount: boolean, when: string, baseSpecQ: SpecQuery) {
      [true, false].forEach(satisfy => {
        const autoCount = satisfy ? expectedAutoCount : !expectedAutoCount;

        it(`should return ${satisfy} when autoCount is ${autoCount} and ${when}.`, () => {
          const specQ = duplicate(baseSpecQ);
          const model = SpecQueryModel.build(specQ, schema, {
            ...DEFAULT_QUERY_CONFIG,
            autoAddCount: true
          });
          const autoCountIndex = model.getEncodings().length - 1;
          model.setEncodingProperty(autoCountIndex, 'autoCount', autoCount, (model.getEncodingQueryByIndex(
            autoCountIndex
          ) as AutoCountQuery).autoCount as Wildcard<any>);

          assert.equal(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(model, schema, DEFAULT_QUERY_CONFIG), satisfy);
        });
      });
    }

    [TYPE.NOMINAL, TYPE.ORDINAL].forEach(type => {
      autoCountShouldBe(true, 'there is only a/an ' + type + ' field', {
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'A', type: type}]
      });
    });

    [TYPE.QUANTITATIVE, TYPE.TEMPORAL].forEach(type => {
      autoCountShouldBe(false, 'there is only a temporal without timeUnit or an unbinned quantitative field', {
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'A', type: type}]
      });
    });

    autoCountShouldBe(true, 'there is only a temporal field with timeUnit or a binned quantitative field', {
      mark: MARK.POINT,
      encodings: [
        {channel: CHANNEL.X, field: 'A', type: TYPE.TEMPORAL, timeUnit: TimeUnit.HOURS},
        {channel: CHANNEL.COLOR, field: 'A', type: TYPE.QUANTITATIVE, bin: true}
      ]
    });

    autoCountShouldBe(false, 'there is an unbinned quantitative field', {
      mark: MARK.POINT,
      encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
    });

    autoCountShouldBe(false, 'there is a temporal field without time unit', {
      mark: MARK.POINT,
      encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.TEMPORAL}]
    });

    it('should return true for a raw plot that has only an unbinned quantitative field and a temporal field without time unit', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.Y, field: 'A', type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.X, field: 'B', type: TYPE.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return true if the raw spec has one unbinned quantitative field.', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return true if the raw spec has one temporal without time unit field.', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.TEMPORAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false if the raw spec have only nominal, ordinal, binned quantitative or temporal with time unit fields.', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.SHAPE, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'B', type: TYPE.ORDINAL},
          {channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE, bin: true},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.TEMPORAL, timeUnit: TimeUnit.HOURS}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });

  describe('channelPermittedByMarkType', () => {
    it('should return true for supported channel', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.SHAPE, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false for unsupported channel', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.SHAPE, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });

  describe('hasAllRequiredChannelsForMark', () => {
    it('should return true if area/line have both x and y', () => {
      [MARK.AREA, MARK.LINE].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE}
          ]
        });
        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
        );
      });
    });

    it('should return false if area/line have do not have x or y', () => {
      [CHANNEL.X, CHANNEL.Y, CHANNEL.COLOR].forEach(channel => {
        [MARK.AREA, MARK.LINE].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [{channel: channel, field: 'N', type: TYPE.NOMINAL}]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });
    });

    it('should return true for bar/circle/point/square/tick/rule with x or y', () => {
      [CHANNEL.X, CHANNEL.Y].forEach(channel => {
        [MARK.BAR, MARK.CIRCLE, MARK.POINT, MARK.SQUARE, MARK.TICK, MARK.RULE].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [{channel: channel, field: 'N', type: TYPE.NOMINAL}]
          });
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });
    });

    it('should return false for bar/circle/point/square/tick/rule with neither x nor y', () => {
      [CHANNEL.COLOR, CHANNEL.SHAPE].forEach(channel => {
        [MARK.BAR, MARK.CIRCLE, MARK.SQUARE, MARK.TEXT, MARK.RULE].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [{channel: channel, field: 'N', type: TYPE.NOMINAL}]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });
    });

    it('should return true for point with neither x nor y', () => {
      [CHANNEL.COLOR, CHANNEL.SHAPE].forEach(channel => {
        const specM = buildSpecQueryModel({
          mark: MARK.POINT,
          encodings: [{channel: channel, field: 'N', type: TYPE.NOMINAL}]
        });
        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
        );
      });
    });

    it('should return false for text without text channel', () => {
      // TODO
    });

    it('should return true for text with text channel', () => {
      // TODO
    });
  });

  describe('hasAppropriateGraphicTypeForMark', () => {
    describe('bar, tick', () => {
      it('should return true for plots with one dimension and one measure on x/y', () => {
        [MARK.BAR, MARK.TICK].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return true for plots with one binned dimension and one measure on x/y', () => {
        [MARK.BAR, MARK.TICK].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'Q1', type: TYPE.QUANTITATIVE, bin: true},
              {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return true for plots with one binned dimension and one measure on x/y', () => {
        [MARK.BAR, MARK.TICK].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'T', type: TYPE.TEMPORAL, timeUnit: TimeUnit.MONTH},
              {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return true for plots with one binned dimension and one autoCount on x/y', () => {
        [MARK.BAR, MARK.TICK].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'Q1', type: TYPE.QUANTITATIVE, bin: true},
              {channel: CHANNEL.Y, autoCount: true, type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return false for plots with two dimensions on x/y', () => {
        [MARK.BAR, MARK.TICK].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.Y, field: 'N20', type: TYPE.NOMINAL}
            ]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return false for graphics with two measures on x/y', () => {
        [MARK.BAR, MARK.TICK].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'Q1', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.Y, field: 'Q2', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return true for graphics with one temporal field and one quantitative field on x/y', () => {
        [MARK.BAR, MARK.TICK].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'T', type: TYPE.TEMPORAL},
              {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });
    });

    describe('line, area', () => {
      it('should return true for aggregate line/area with at least one non-nominal dimension', () => {
        [MARK.LINE, MARK.AREA].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'N', type: TYPE.ORDINAL},
              {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
            ]
          });
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return true for aggregate line/area with one temporal field', () => {
        [MARK.LINE, MARK.AREA].forEach(mark => {
          [undefined, 'year'].forEach((timeUnit: TimeUnit) => {
            const specM = buildSpecQueryModel({
              mark: mark,
              encodings: [
                {channel: CHANNEL.X, timeUnit, field: 'T', type: TYPE.TEMPORAL},
                {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
              ]
            });
            assert.isTrue(
              SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG),
              `${mark}, ${timeUnit} test`
            );
          });
        });
      });

      it('should return false for aggregate line/area with at least one non-nominal dimension', () => {
        [MARK.LINE, MARK.AREA].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
            ]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return false for aggregate line/area with no dimension', () => {
        [MARK.LINE, MARK.AREA].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'Q1', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
            ]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });

      it('should return false for graphics with two dimensions on x/y', () => {
        [MARK.LINE, MARK.AREA].forEach(mark => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.Y, field: 'N20', type: TYPE.NOMINAL},
              {channel: CHANNEL.SIZE, field: '*', aggregate: 'count', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
          );
        });
      });
    });
  });

  describe('noRepeatedChannel', () => {
    it('should return true when there is no repeated channels', function() {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.SHAPE, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false when there are repeated channels', function() {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.SHAPE, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.SHAPE, field: 'B', type: TYPE.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });

  describe('omitAggregate', () => {
    it('should return true if there is only raw data', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });
      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitAggregate'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false if there is aggregate data', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{aggregate: 'mean', channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });
      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitAggregate'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });

  describe('omitAggregatePlotWithDimensionOnlyOnFacet', () => {
    it('should return false if the only dimension is facet and it is enumerated', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: {enum: [CHANNEL.ROW]}, field: 'N', type: TYPE.NOMINAL}
        ]
      });
      specM.setEncodingProperty(2, Property.CHANNEL, CHANNEL.ROW, {enum: [CHANNEL.ROW]});
      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if the only dimension is facet and it is specified', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.ROW, field: 'N', type: TYPE.NOMINAL}
        ]
      });
      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return false if the only dimension is facet and it is specified when we constraintManuallySpecifiedValue', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.ROW, field: 'N', type: TYPE.NOMINAL}
        ]
      });
      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(
          specM,
          schema,
          CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
        )
      );
    });

    it('should return true if the only dimension is not facet', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.SHAPE, field: 'N', type: TYPE.NOMINAL}
        ]
      });
      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if there are both facet and non-facet dimension', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
          {channel: CHANNEL.ROW, field: 'N', type: TYPE.NOMINAL},
          {channel: CHANNEL.SHAPE, field: 'N', type: TYPE.NOMINAL}
        ]
      });
      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });
  });

  describe('omitAggregatePlotWithoutDimension', () => {
    it('should return false if plot is aggregate and has no dimension', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'}]
      });
      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithoutDimension'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if plot is aggregate and has dimension', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.NOMINAL, aggregate: 'mean'},
          {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL}
        ]
      });
      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithoutDimension'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if plot is not aggregate', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL}]
      });
      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithoutDimension'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });
  });

  describe('omitBarLineAreaWithOcclusion', () => {
    [MARK.BAR, MARK.LINE, MARK.AREA].forEach(mark => {
      it('should return false for raw ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL}
          ]
        });

        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
        );
      });

      it('should return true for aggregate ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, aggregate: 'mean', field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL}
          ]
        });

        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
        );
      });
    });

    [MARK.POINT, MARK.TICK, MARK.SQUARE].forEach(mark => {
      it('should return true for raw ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL}
          ]
        });

        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
        );
      });

      it('should return true for aggregate ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, aggregate: 'mean', field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL}
          ]
        });

        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
        );
      });
    });
  });

  describe('omitBarTickWithSize', () => {
    it('should return false if bar/tick enumerates size', () => {
      [MARK.BAR, MARK.TICK].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
            {channel: {enum: [CHANNEL.SIZE]}, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
          ]
        });

        specM.setEncodingProperty(2, Property.CHANNEL, CHANNEL.SIZE, {enum: [CHANNEL.SIZE]});

        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitBarTickWithSize'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
      });
    });

    it('should return true if bar/tick contains manually specified size', () => {
      [MARK.BAR, MARK.TICK].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
            {channel: CHANNEL.SIZE, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarTickWithSize'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
      });
    });

    it('should return false if bar/tick contains manually specified size and we constraintManuallySpecifiedValue', () => {
      [MARK.BAR, MARK.TICK].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'},
            {channel: CHANNEL.SIZE, field: 'Q1', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
          ]
        });

        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitBarTickWithSize'].satisfy(specM, schema, CONSTRAINT_MANUALLY_SPECIFIED_CONFIG)
        );
      });
    });

    it('should return true if bar/tick do not use size', () => {
      [MARK.BAR, MARK.TICK].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'Q', type: TYPE.QUANTITATIVE, aggregate: 'mean'}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarTickWithSize'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
      });
    });
  });

  describe('omitBarAreaForLogScale', () => {
    it('should return false if either x or y channel of bar or area mark is log scale', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.AREA,
        encodings: [
          {channel: CHANNEL.X, field: 'A', scale: {type: ScaleType.LOG}, type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.QUANTITATIVE}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitBarAreaForLogScale'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return true if either x or y channel of bar or area mark is not log scale', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.AREA,
        encodings: [
          {channel: CHANNEL.COLOR, field: 'A', scale: {type: ScaleType.LOG}, type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.SHAPE, field: 'B', type: TYPE.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarAreaForLogScale'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });

  describe('omitMultipleNonPositionalChannels', () => {
    it('should return true if there are zero non-positional channels', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if there are one non-positional channels', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
          {channel: CHANNEL.SHAPE, field: 'C', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return false if there are multiple non-positional channels and at least one of them is enumerated', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
          {channel: {enum: [CHANNEL.SHAPE, CHANNEL.SIZE]}, field: 'C', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'D', type: TYPE.NOMINAL}
        ]
      });

      specM.setEncodingProperty(2, Property.CHANNEL, CHANNEL.SHAPE, {enum: [CHANNEL.SHAPE, CHANNEL.SIZE]});

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if there are multiple non-positional channels but none of them is enumerated', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
          {channel: CHANNEL.SHAPE, field: 'C', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'D', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return false if there are multiple non-positional channels and we constraintManuallySpecifiedValue', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
          {channel: CHANNEL.SHAPE, field: 'C', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'D', type: TYPE.NOMINAL}
        ]
      });

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(
          specM,
          schema,
          CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
        )
      );
    });

    it('should return true if there are multiple non-positional channels but one of them has autoCount === false', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
          {channel: {enum: [CHANNEL.SHAPE, CHANNEL.SIZE]}, field: 'C', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, autoCount: false, type: TYPE.QUANTITATIVE}
        ]
      });

      specM.setEncodingProperty(2, Property.CHANNEL, CHANNEL.SHAPE, {enum: [CHANNEL.SHAPE, CHANNEL.SIZE]});

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });
  });

  describe('omitInvalidStackSpec', () => {
    const NON_NULL_STACK_OFFSETS = without(DEFAULT_ENUM_INDEX.stack, [null]);

    it('should return false for stack with non linear scale type', () => {
      [
        ScaleType.LOG,
        ScaleType.POINT,
        ScaleType.BAND,
        ScaleType.POINT,
        ScaleType.POW,
        ScaleType.SQRT,
        ScaleType.TIME,
        ScaleType.UTC
      ].forEach(scaleType => {
        NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
          const specM = buildSpecQueryModel({
            mark: MARK.BAR,
            encodings: [
              {
                channel: CHANNEL.X,
                field: 'A',
                type: TYPE.QUANTITATIVE,
                stack: stackOffset,
                scale: {type: scaleType},
                aggregate: 'sum'
              },
              {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
              {channel: CHANNEL.COLOR, field: 'C', type: TYPE.NOMINAL}
            ]
          });
          specM.wildcardIndex.setEncodingProperty(0, Property.STACK, {name: 'stack', enum: DEFAULT_ENUM_INDEX.stack});

          // FIXME this should be false
          assert.isTrue(
            SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG),
            'for ' + scaleType
          );
        });
      });
    });

    it('should return true for stack with linear scale type', () => {
      NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
        const specM = buildSpecQueryModel({
          mark: MARK.BAR,
          encodings: [
            {
              channel: CHANNEL.X,
              field: 'A',
              type: TYPE.QUANTITATIVE,
              stack: stackOffset,
              scale: {type: ScaleType.LINEAR},
              aggregate: 'sum'
            },
            {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'C', type: TYPE.NOMINAL}
          ]
        });
        specM.wildcardIndex.setEncodingProperty(0, Property.STACK, {name: 'stack', enum: DEFAULT_ENUM_INDEX.stack});

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
      });
    });

    it('should return true if color uses a non-linear scale when it is mapped to a non-X or non-Y channel that is aggregate', () => {
      NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
        const specM = buildSpecQueryModel({
          mark: MARK.BAR,
          encodings: [
            {channel: CHANNEL.X, field: 'A', stack: stackOffset, type: TYPE.QUANTITATIVE, aggregate: 'sum'},
            {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'C', type: TYPE.QUANTITATIVE, scale: {type: ScaleType.POW}},
            {channel: CHANNEL.DETAIL, field: 'A', type: TYPE.NOMINAL}
          ]
        });
        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
      });
    });

    it('should return true if stack was not specified', () => {
      [CHANNEL.OPACITY, CHANNEL.DETAIL, CHANNEL.COLOR].forEach(stackByChannel => {
        const specM = buildSpecQueryModel({
          mark: MARK.BAR,
          encodings: [
            {channel: CHANNEL.X, field: 'A', scale: {type: ScaleType.LOG}, type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
            {channel: stackByChannel, field: 'C', type: TYPE.NOMINAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
      });
    });

    it('should return true if stack is defined without wildcard', () => {
      [CHANNEL.OPACITY, CHANNEL.DETAIL, CHANNEL.COLOR].forEach(stackByChannel => {
        NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
          const specM = buildSpecQueryModel({
            mark: MARK.BAR,
            encodings: [
              {
                channel: CHANNEL.X,
                field: 'A',
                type: TYPE.QUANTITATIVE,
                stack: stackOffset,
                scale: {type: ScaleType.LINEAR},
                aggregate: 'sum'
              },
              {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
              {channel: CHANNEL.COLOR, field: 'C', type: TYPE.NOMINAL}
            ]
          });

          assert.isTrue(SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
        });
      });
    });

    it('should return false for stack specified in incorrect channel', () => {
      NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
        const specStackInY = buildSpecQueryModel({
          mark: MARK.BAR,
          encodings: [
            {
              channel: CHANNEL.X,
              field: 'A',
              type: TYPE.QUANTITATIVE,
              scale: {type: ScaleType.LINEAR},
              aggregate: 'sum'
            },
            {channel: CHANNEL.Y, field: 'B', stack: stackOffset, type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'C', type: TYPE.NOMINAL}
          ]
        });
        specStackInY.wildcardIndex.setEncodingProperty(0, Property.STACK, {
          name: 'stack',
          enum: DEFAULT_ENUM_INDEX.stack
        });
        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specStackInY, schema, DEFAULT_QUERY_CONFIG)
        );

        const specStackInColor = buildSpecQueryModel({
          mark: MARK.BAR,
          encodings: [
            {
              channel: CHANNEL.X,
              field: 'A',
              type: TYPE.QUANTITATIVE,
              scale: {type: ScaleType.LINEAR},
              aggregate: 'sum'
            },
            {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'C', stack: stackOffset, type: TYPE.NOMINAL}
          ]
        });
        specStackInColor.wildcardIndex.setEncodingProperty(0, Property.STACK, {
          name: 'stack',
          enum: DEFAULT_ENUM_INDEX.stack
        });
        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specStackInColor, schema, DEFAULT_QUERY_CONFIG)
        );
      });
    });

    it('should return true for stack with autoCount.', () => {
      SUM_OPS.forEach(_ => {
        [CHANNEL.OPACITY, CHANNEL.DETAIL, CHANNEL.COLOR].forEach(stackByChannel => {
          NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
            const specM = buildSpecQueryModel({
              mark: MARK.BAR,
              encodings: [
                {channel: CHANNEL.X, autoCount: true, stack: stackOffset, type: TYPE.QUANTITATIVE},
                {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
                {channel: stackByChannel, field: 'C', type: TYPE.NOMINAL}
              ]
            });
            specM.wildcardIndex.setEncodingProperty(0, Property.STACK, {name: 'stack', enum: DEFAULT_ENUM_INDEX.stack});

            assert.isTrue(SPEC_CONSTRAINT_INDEX['omitInvalidStackSpec'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
          });
        });
      });
    });
  });

  describe('omitNonSumStack', () => {
    const NON_NULL_STACK_OFFSETS = without(DEFAULT_ENUM_INDEX.stack, [null]);

    it('should return true if summative-based aggregate is used.', () => {
      SUM_OPS.forEach(aggregate => {
        [CHANNEL.OPACITY, CHANNEL.DETAIL, CHANNEL.COLOR].forEach(stackByChannel => {
          NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
            const specM = buildSpecQueryModel({
              mark: MARK.BAR,
              encodings: [
                {channel: CHANNEL.X, field: 'A', stack: stackOffset, type: TYPE.QUANTITATIVE, aggregate: aggregate},
                {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
                {channel: stackByChannel, field: 'C', type: TYPE.NOMINAL}
              ]
            });
            specM.wildcardIndex.setEncodingProperty(0, Property.STACK, {name: 'stack', enum: DEFAULT_ENUM_INDEX.stack});

            assert.isTrue(SPEC_CONSTRAINT_INDEX['omitNonSumStack'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
          });
        });
      });
    });

    it('should return false if non-summative aggregate (e.g., mean, median) is used for explicit stack specs.', () => {
      ['max', 'mean', 'median'].forEach((aggregate: AggregateOp) => {
        [CHANNEL.OPACITY, CHANNEL.DETAIL, CHANNEL.COLOR].forEach(stackByChannel => {
          NON_NULL_STACK_OFFSETS.forEach(stackOffset => {
            const specM = buildSpecQueryModel({
              mark: MARK.BAR,
              encodings: [
                {channel: CHANNEL.X, field: 'A', stack: stackOffset, type: TYPE.QUANTITATIVE, aggregate: aggregate},
                {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
                {channel: stackByChannel, field: 'C', type: TYPE.NOMINAL}
              ]
            });
            specM.wildcardIndex.setEncodingProperty(0, Property.STACK, {name: 'stack', enum: DEFAULT_ENUM_INDEX.stack});

            assert.isFalse(SPEC_CONSTRAINT_INDEX['omitNonSumStack'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
          });
        });
      });
    });

    it('should return false if non-summative aggregate (e.g., mean, median) is used for implicit stack specs.', () => {
      ['max', 'mean', 'median'].forEach((aggregate: AggregateOp) => {
        [CHANNEL.OPACITY, CHANNEL.DETAIL, CHANNEL.COLOR].forEach(stackByChannel => {
          const specM = buildSpecQueryModel({
            mark: MARK.BAR,
            encodings: [
              {channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE, aggregate: aggregate},
              {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
              {channel: stackByChannel, field: 'C', type: TYPE.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['omitNonSumStack'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
        });
      });
    });
  });

  describe('omitNonPositionalOrFacetOverPositionalChannels', () => {
    it('should return true if only x and y are used', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
          specM,
          schema,
          DEFAULT_QUERY_CONFIG
        )
      );
    });

    it('should return true if color/shape/size is used when both x and y are used', () => {
      [CHANNEL.SHAPE, CHANNEL.SIZE, CHANNEL.COLOR].forEach(channel => {
        const specM = buildSpecQueryModel({
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
            {channel: channel, field: 'C', type: TYPE.NOMINAL}
          ]
        });
        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
            specM,
            schema,
            DEFAULT_QUERY_CONFIG
          )
        );
      });
    });

    it('should return false if color/shape/size is enumerated when either x or y is not used', () => {
      [CHANNEL.SHAPE, CHANNEL.SIZE, CHANNEL.COLOR].forEach(channel => {
        const specM = buildSpecQueryModel({
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
            {channel: {enum: [CHANNEL.SHAPE, CHANNEL.SIZE, CHANNEL.COLOR]}, field: 'C', type: TYPE.NOMINAL}
          ]
        });
        specM.setEncodingProperty(1, Property.CHANNEL, channel, {enum: [CHANNEL.SHAPE, CHANNEL.SIZE, CHANNEL.COLOR]});
        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
            specM,
            schema,
            DEFAULT_QUERY_CONFIG
          )
        );
      });
    });

    it('should return false if color/shape/size is manually specified if either x or y is not used and we constraintManuallySpecifiedValue', () => {
      [CHANNEL.SHAPE, CHANNEL.SIZE, CHANNEL.COLOR].forEach(channel => {
        const specM = buildSpecQueryModel({
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
            {channel: channel, field: 'C', type: TYPE.NOMINAL}
          ]
        });
        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
            specM,
            schema,
            CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
          )
        );
      });
    });

    it('should return true if color/shape/size is manually specified even when either x or y is not used', () => {
      [CHANNEL.SHAPE, CHANNEL.SIZE, CHANNEL.COLOR].forEach(channel => {
        const specM = buildSpecQueryModel({
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
            {channel: channel, field: 'C', type: TYPE.NOMINAL}
          ]
        });
        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
            specM,
            schema,
            DEFAULT_QUERY_CONFIG
          )
        );
      });
    });

    it('should return true if facet is used when both x and y are used', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'B', type: TYPE.NOMINAL},
          {channel: CHANNEL.ROW, field: 'C', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
          specM,
          schema,
          DEFAULT_QUERY_CONFIG
        )
      );
    });

    it('should return true if facet is specified when x or y is not used', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.ROW, field: 'C', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
          specM,
          schema,
          DEFAULT_QUERY_CONFIG
        )
      );
    });

    it('should return false if facet is specified when x or y is not used and we constraintManuallySpecifiedValue', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.ROW, field: 'C', type: TYPE.NOMINAL}
        ]
      });

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
          specM,
          schema,
          CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
        )
      );
    });

    it('should return false if facet is enumerated when x or y is not used', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: {enum: [CHANNEL.ROW]}, field: 'C', type: TYPE.NOMINAL}
        ]
      });

      specM.setEncodingProperty(1, Property.CHANNEL, CHANNEL.ROW, {enum: [CHANNEL.ROW]});
      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitNonPositionalOrFacetOverPositionalChannels'].satisfy(
          specM,
          schema,
          DEFAULT_QUERY_CONFIG
        )
      );
    });
  });

  describe('omitRaw', () => {
    it('should return false if there is raw data', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });
      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRaw'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('It should return true if there is a wildcard aggregate', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{aggregate: SHORT_WILDCARD, channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });
      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRaw'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('It should return true if there is a wildcard autoCount', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{autoCount: SHORT_WILDCARD, channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });
      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRaw'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return true if data is aggregate', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{aggregate: 'mean', channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });
      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRaw'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });

  describe('omitRawContinuousFieldForAggregatePlot', () => {
    it('should return false if the aggregate plot groups by a raw temporal field with timeUnit enumerated as undefined', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'C', type: TYPE.TEMPORAL, timeUnit: {enum: [undefined]}}
        ]
      });

      specM.setEncodingProperty(1, Property.TIMEUNIT, undefined, {enum: [undefined]});

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return false if the aggregate plot groups by a raw temporal field with specified timeUnit = undefined', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'C', type: TYPE.TEMPORAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return false if the aggregate plot groups by a raw temporal field with specified timeUnit = undefined and we constraintManuallySpecifiedValue', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'C', type: TYPE.TEMPORAL}
        ]
      });

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(
          specM,
          schema,
          CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
        )
      );
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, timeUnit: TimeUnit.MONTH, field: 'C', type: TYPE.TEMPORAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit as Wildcard', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, timeUnit: {enum: [TimeUnit.MONTH, undefined]}, field: 'C', type: TYPE.TEMPORAL}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if the aggregate plot groups by a quantitative field that is specified as raw', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'C', type: TYPE.QUANTITATIVE}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return false if the aggregate plot groups by a quantitative field that is specified as raw and we constraintManuallySpecifiedValue', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'C', type: TYPE.QUANTITATIVE}
        ]
      });

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(
          specM,
          schema,
          CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
        )
      );
    });

    it('should return false if the aggregate plot groups by a raw quantitative field that is enumerated', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, aggregate: {enum: [undefined]}, field: 'C', type: TYPE.QUANTITATIVE}
        ]
      });

      specM.setEncodingProperty(1, Property.AGGREGATE, undefined, {enum: [undefined]});

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if the aggregate plot groups by a binned quantitative field', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, bin: true, field: 'C', type: TYPE.QUANTITATIVE}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true if the aggregate plot groups by a quantitative field with bin as Wildcard', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, bin: {enum: [true, false]}, field: 'C', type: TYPE.QUANTITATIVE}
        ]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true for a plot with only aggregated quantitative field.', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.QUANTITATIVE}]
      });

      assert.isTrue(
        SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
      );
    });

    it('should return true for any raw plot', () => {
      [TimeUnit.MONTH, undefined, {enum: [TimeUnit.MONTH, undefined]}].forEach(timeUnit => {
        const specM = buildSpecQueryModel({
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, timeUnit: timeUnit, field: 'C', type: TYPE.TEMPORAL}
          ]
        });

        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG)
        );
      });
    });
  });

  describe('omitRawDetail', () => {
    it('should return true when raw data does not have the detail channel', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false when raw data has an enumerated detail channel', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: {enum: [CHANNEL.DETAIL]}, field: 'A', type: TYPE.NOMINAL}]
      });
      specM.setEncodingProperty(0, Property.CHANNEL, CHANNEL.DETAIL, {enum: [CHANNEL.DETAIL]});

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return true when raw data has a manually specified detail channel', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.DETAIL, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false when we constraintManuallySpecifiedValue raw data has a manually specified detail channel', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.DETAIL, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, CONSTRAINT_MANUALLY_SPECIFIED_CONFIG)
      );
    });

    it('should return true if any of the encoding channels contain aggregate', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.DETAIL, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.X, aggregate: 'mean', field: 'A', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });

  describe('omitRepeatedField', () => {
    it('should return true when there is no repeated field', function() {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: {enum: ['B']}, type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return true when repeated fields are not enumerated', function() {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'A', type: TYPE.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false when repeated fields are not enumerated but constraintManuallySpecifiedValue=true', function() {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: 'A', type: TYPE.NOMINAL}
        ]
      });

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specM, schema, CONSTRAINT_MANUALLY_SPECIFIED_CONFIG)
      );
    });

    it('should return false when one of the repeated fields is enumerated', function() {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [
          {channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL},
          {channel: CHANNEL.Y, field: {enum: ['A', 'B']}, type: TYPE.NOMINAL}
        ]
      });

      specM.setEncodingProperty(1, Property.FIELD, 'A', {enum: ['A', 'B']});

      assert.isFalse(
        SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specM, schema, CONSTRAINT_MANUALLY_SPECIFIED_CONFIG)
      );
    });
  });

  describe('omitTableWithOcclusionIfAutoAddCount', () => {
    it('return false for raw plot with both x and y as dimensions without autocount or aggregation.', () => {
      [MARK.POINT, MARK.CIRCLE, MARK.SQUARE, MARK.LINE, MARK.AREA, MARK.BAR].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'N20', type: TYPE.NOMINAL}
          ]
        });
        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitTableWithOcclusionIfAutoAddCount'].satisfy(specM, schema, {autoAddCount: true})
        );
      });
    });

    it('return false for raw plot with both x and y are either empty or raw/unaggregated field.', () => {
      [MARK.POINT, MARK.CIRCLE, MARK.SQUARE, MARK.LINE, MARK.AREA, MARK.BAR].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [{channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL}]
        });
        assert.isFalse(
          SPEC_CONSTRAINT_INDEX['omitTableWithOcclusionIfAutoAddCount'].satisfy(specM, schema, {autoAddCount: true})
        );
      });
    });

    it('return true for plot with x and y as dimensions and aggregation', () => {
      [MARK.POINT, MARK.CIRCLE, MARK.SQUARE, MARK.LINE, MARK.AREA, MARK.BAR].forEach(mark => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'N20', type: TYPE.NOMINAL},
            {aggregate: 'mean', channel: CHANNEL.SIZE, field: 'Q', type: TYPE.QUANTITATIVE}
          ]
        });
        assert.isTrue(
          SPEC_CONSTRAINT_INDEX['omitTableWithOcclusionIfAutoAddCount'].satisfy(specM, schema, {autoAddCount: true})
        );
      });
    });

    it('return false for plot with unaggregated non-position/facet channel', () => {
      [MARK.POINT, MARK.CIRCLE, MARK.SQUARE, MARK.LINE, MARK.AREA, MARK.BAR].forEach(mark => {
        [CHANNEL.COLOR, CHANNEL.DETAIL, CHANNEL.SHAPE, CHANNEL.SIZE, CHANNEL.OPACITY].forEach(rawChannel => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.Y, field: 'N20', type: TYPE.NOMINAL},
              {channel: rawChannel, field: 'Q', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['omitTableWithOcclusionIfAutoAddCount'].satisfy(specM, schema, {autoAddCount: true})
          );
        });
      });
    });

    it('return false for plot with unaggregated non-position/facet channel', () => {
      [MARK.POINT, MARK.CIRCLE, MARK.SQUARE, MARK.LINE, MARK.AREA, MARK.BAR].forEach(mark => {
        [CHANNEL.COLOR, CHANNEL.DETAIL, CHANNEL.SHAPE, CHANNEL.OPACITY].forEach(rawChannel => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.Y, field: 'N20', type: TYPE.NOMINAL},
              {aggregate: 'mean', channel: CHANNEL.SIZE, field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: rawChannel, field: 'Q', type: TYPE.QUANTITATIVE}
            ]
          });
          assert.isFalse(
            SPEC_CONSTRAINT_INDEX['omitTableWithOcclusionIfAutoAddCount'].satisfy(specM, schema, {autoAddCount: true})
          );
        });
      });
    });
  });

  describe('omitVerticalDotPlot', () => {
    it('should return true for horizontal dot plot', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });

    it('should return false for vertical dot plot', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.Y, field: 'A', type: TYPE.NOMINAL}]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specM, schema, DEFAULT_QUERY_CONFIG));
    });
  });
});
