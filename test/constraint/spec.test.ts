import {assert} from 'chai';

import {Mark} from 'vega-lite/src/mark';
import {AggregateOp, SUM_OPS} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {SPEC_CONSTRAINTS, SPEC_CONSTRAINT_INDEX, SpecConstraintModel} from '../../src/constraint/spec';
import {Property} from '../../src/property';
import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {SpecQueryModel} from '../../src/model';
import {Schema} from '../../src/schema';
import {SpecQuery} from '../../src/query/spec';
import {SHORT_ENUM_SPEC} from '../../src/enumspec';
import {duplicate} from '../../src/util';

describe('constraints/spec', () => {
  const defaultOpt = DEFAULT_QUERY_CONFIG;
  const schema = new Schema([]);

  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  // Make sure all non-strict constraints have their configs.
  SPEC_CONSTRAINTS.forEach((constraint) => {
    if (!constraint.strict()) {
      it(constraint.name() + ' should have default config for all non-strict constraints', () => {
        assert.isDefined(DEFAULT_QUERY_CONFIG[constraint.name()]);
      });
    }
  });

  describe('alwaysIncludeZeroInScaleWithBarMark', () => {
    it('should return false if scale does not start at zero when bar mark is used', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', scale: {zero: false}, type: Type.QUANTITATIVE}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['alwaysIncludeZeroInScaleWithBarMark'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if scale starts at zero when bar mark is used', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', scale: {zero: true}, type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['alwaysIncludeZeroInScaleWithBarMark'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('hasAllRequiredPropertiesSpecific', () => {
    const specCModel = new SpecConstraintModel(
      {
        name: 'Test SpecModel for hasAllRequiredPropertiesSpecific class method',
        description: 'Test SpecModel for hasAllRequiredPropertiesSpecific class method',
        properties: [Property.AGGREGATE, Property.TYPE, Property.SCALE, Property.SCALE_TYPE, Property.MARK],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: undefined
      }
    );

    it('should return true if all properties is defined', () => {
      const specQM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {aggregate: AggregateOp.MEAN, channel: Channel.X, field: 'A', scale: {type: ScaleType.LOG}, type: Type.QUANTITATIVE}
        ]
      });
      assert.isTrue(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });

    it('should return true if a required property is undefined', () => {
      const specQM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {aggregate: AggregateOp.MEAN, channel: Channel.X, field: 'A',  type: Type.QUANTITATIVE}
        ]
      });
      assert.isTrue(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });

    it('should return false if a required property is an enum spec', () => {
      const specQM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {aggregate: AggregateOp.MEAN, channel: Channel.X, field: 'A', scale: SHORT_ENUM_SPEC, type: Type.QUANTITATIVE}
        ]
      });
      assert.isFalse(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });

    it('should return false if a nested required property is an enum spec', () => {
      const specQM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {aggregate: AggregateOp.MEAN, channel: Channel.X, field: 'A', scale: {type: SHORT_ENUM_SPEC}, type: Type.QUANTITATIVE}
        ]
      });
      assert.isFalse(specCModel.hasAllRequiredPropertiesSpecific(specQM));
    });
  });

  describe('autoAddCount', () => {
    function autoCountShouldBe(autoCount: boolean, when: string, baseSpecQ: SpecQuery) {
      [true, false].forEach((satisfy) => {
        it('should be ' + (satisfy ? autoCount + ' when ' : !autoCount + ' when (opposite of) ') + when, () => {
          const specQ = duplicate(baseSpecQ);
          specQ.encodings.push({
            channel: Channel.Y,
            autoCount: satisfy ? autoCount : !autoCount
          });
          const model = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
          assert.equal(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(model, schema, defaultOpt), satisfy);
        });
      });
    }

    [Type.NOMINAL, Type.ORDINAL].forEach((type) => {
      autoCountShouldBe(true, 'there is only a/an ' + type + ' field', {
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: type}
        ]
      });
    });

    [Type.QUANTITATIVE, Type.TEMPORAL].forEach((type) => {
      autoCountShouldBe(false, 'there is only a temporal without timeUnit or an unbinned quantitative field', {
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: type}
        ]
      });
    });

    autoCountShouldBe(true, 'there is only a temporal field with timeUnit or an unbinned quantitative field', {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'A', type: Type.TEMPORAL, timeUnit: TimeUnit.HOURS},
        {channel: Channel.COLOR, field: 'A', type: Type.QUANTITATIVE, bin: true}
      ]
    });

    autoCountShouldBe(false, 'there is an unbinned quantitative field', {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
      ]
    });

    autoCountShouldBe(false, 'there is a temporal field without time unit', {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'A', type: Type.TEMPORAL}
      ]
    });

    it('should return true for a raw plot that has only an unbinned quantitative field and a temporal field without time unit', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.X, field: 'B', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if the raw spec has one unbinned quantitative field.', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if the raw spec has one temporal without time unit field.', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.TEMPORAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, defaultOpt));
    });

    it('should return false if the raw spec have only nominal, ordinal, binned quantitative or temporal with time unit fields.', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'B', type: Type.ORDINAL},
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, bin: true},
          {channel: Channel.Y, field: 'B', type: Type.TEMPORAL, timeUnit: TimeUnit.HOURS}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specM, schema, defaultOpt));
    });

  });

  describe('channelPermittedByMarkType', () => {
    it('should return true for supported channel', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specM, schema, defaultOpt));
    });

    it('should return false for unsupported channel', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('hasAllRequiredChannelsForMark', () => {
    it('should return true if area/line have both x and y', () => {
      [Mark.AREA, Mark.LINE].forEach((mark) => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'N', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
          ]
        });
        assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, defaultOpt));
      });
    });

    it('should return false if area/line have do not have x or y', () => {
      [Channel.X, Channel.Y, Channel.COLOR].forEach((channel) => {
        [Mark.AREA, Mark.LINE].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: channel, field: 'N', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, defaultOpt));
        });
      });
    });

    it('should return true for bar/circle/point/square/tick/rule with x or y', () => {
      [Channel.X, Channel.Y].forEach((channel) => {
        [Mark.BAR, Mark.CIRCLE, Mark.POINT, Mark.SQUARE, Mark.TICK, Mark.RULE].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: channel, field: 'N', type: Type.NOMINAL}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, defaultOpt));
        });
      });
    });

    it('should return false for bar/circle/point/square/tick/rule with neither x nor y', () => {
      [Channel.COLOR, Channel.SHAPE].forEach((channel) => {
        [Mark.BAR, Mark.CIRCLE, Mark.POINT, Mark.SQUARE, Mark.TEXT, Mark.RULE].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: channel, field: 'N', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specM, schema, defaultOpt));
        });
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
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });

      it('should return true for plots with one binned dimension and one measure on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'Q1', type: Type.QUANTITATIVE, bin: true},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });

      it('should return true for plots with one binned dimension and one measure on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'T', type: Type.TEMPORAL, timeUnit: TimeUnit.MONTH},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });

      it('should return false for plots with two dimensions on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'N20', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });

      it('should return false for graphics with two measures on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'Q1', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'Q2', type: Type.QUANTITATIVE}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });

      it('should return false for graphics with one temporal field and one quantitative field on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'T', type: Type.TEMPORAL},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });
    });

    describe('line, area', () => {
      it('should return true for aggregate line/area with at least one non-nominal dimension', () => {
        [Mark.LINE, Mark.AREA].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.ORDINAL},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });


      it('should return false for aggregate line/area with at least one non-nominal dimension', () => {
        [Mark.LINE, Mark.AREA].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });

      it('should return false for aggregate line/area with no dimension', () => {
        [Mark.LINE, Mark.AREA].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'Q1', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });

      it('should return false for graphics with two dimensions on x/y', () => {
        [Mark.LINE, Mark.AREA].forEach((mark) => {
          const specM = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'N20', type: Type.NOMINAL},
              {channel: Channel.SIZE, field:'*', aggregate: AggregateOp.COUNT, type: Type.QUANTITATIVE}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specM, schema, defaultOpt));
        });
      });
    });
  });

  describe('noRepeatedChannel', () => {
    it('should return true when there is no repeated channels', function() {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specM, schema, defaultOpt));
    });

    it('should return false when there are repeated channels', function() {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specM, schema, defaultOpt));
    });
  });
  describe('omitAggregatePlotWithDimensionOnlyOnFacet', () => {
    it('should return false if the only dimension is facet', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN},
          {channel: Channel.Y, field: 'Q1', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN},
          {channel: Channel.ROW, field: 'N', type: Type.NOMINAL}
        ]
      });
      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if the only dimension is not facet', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN},
          {channel: Channel.Y, field: 'Q1', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN},
          {channel: Channel.SHAPE, field: 'N', type: Type.NOMINAL}
        ]
      });
      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if there are both facet and non-facet dimension', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN},
          {channel: Channel.Y, field: 'Q1', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN},
          {channel: Channel.ROW, field: 'N', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'N', type: Type.NOMINAL}
        ]
      });
      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitAggregatePlotWithDimensionOnlyOnFacet'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('omitBarLineAreaWithOcclusion', () => {
    [Mark.BAR, Mark.LINE, Mark.AREA].forEach((mark) => {
      it('should return false for raw ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, defaultOpt));
      });

      it('should return true for aggregate ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, defaultOpt));
      });
    });

    [Mark.POINT, Mark.TICK, Mark.SQUARE].forEach((mark) => {
      it('should return true for raw ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, defaultOpt));
      });

      it('should return true for aggregate ' + mark, () => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarLineAreaWithOcclusion'].satisfy(specM, schema, defaultOpt));
      });
    });
  });

  describe('omitBarTickWithSize', () => {
    it('should return false if bar/tick use size', () => {
      [Mark.BAR, Mark.TICK].forEach((mark) => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'N', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN},
            {channel: Channel.SIZE, field: 'Q1', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN}
          ]
        });

        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitBarTickWithSize'].satisfy(specM, schema, defaultOpt));
      });
    });

    it('should return true if bar/tick do not use size', () => {
      [Mark.BAR, Mark.TICK].forEach((mark) => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'N', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarTickWithSize'].satisfy(specM, schema, defaultOpt));
      });
    });
  });

  describe('omitFacetOverPositionalChannels', () => {
    it('should return true if facet is not used', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if facet is used when both x and y are used', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
          {channel: Channel.ROW, field: 'C', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if facet is used when x or y is not used', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.ROW, field: 'C', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('omitBarAreaForLogScale', () => {
    it('should return false if either x or y channel of bar or area mark is log scale', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.AREA,
        encodings: [
          {channel: Channel.X, field: 'A', scale: {type: ScaleType.LOG}, type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitBarAreaForLogScale'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if either x or y channel of bar or area mark is not log scale', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.AREA,
        encodings: [
          {channel: Channel.COLOR, field: 'A', scale: {type: ScaleType.LOG}, type: Type.QUANTITATIVE},
          {channel: Channel.SHAPE, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitBarAreaForLogScale'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('omitMultipleNonPositionalChannels', () => {
    it('should return true if there are zero non-positional channels', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if there are one non-positional channels', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'C', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, defaultOpt));
    });

    it('should return false if there are multiple non-positional channels', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'C', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'D', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('omitNonSumStack', () => {
    it('should return true if summative-based aggregate is used.', () => {
      SUM_OPS.forEach((aggregate) => {
        [Channel.OPACITY, Channel.DETAIL, Channel.COLOR].forEach((stackByChannel) => {
          const specM = buildSpecQueryModel({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, aggregate: aggregate},
              {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
              {channel: stackByChannel, field: 'C', type: Type.NOMINAL}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['omitNonSumStack'].satisfy(specM, schema, defaultOpt));
        });
      });
    });

    it('should return true for stack with autoCount.', () => {
      SUM_OPS.forEach((aggregate) => {
        [Channel.OPACITY, Channel.DETAIL, Channel.COLOR].forEach((stackByChannel) => {
          const specM = buildSpecQueryModel({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.X, autoCount: true, type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
              {channel: stackByChannel, field: 'C', type: Type.NOMINAL}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['omitNonSumStack'].satisfy(specM, schema, defaultOpt));
        });
      });
    });

    it('should return false if non-summative aggregate (e.g., mean, median) is used.', () => {
      [AggregateOp.MAX, AggregateOp.MEAN, AggregateOp.MEDIAN].forEach((aggregate) => {
        [Channel.OPACITY, Channel.DETAIL, Channel.COLOR].forEach((stackByChannel) => {
          const specM = buildSpecQueryModel({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, aggregate: aggregate},
              {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
              {channel: stackByChannel, field: 'C', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['omitNonSumStack'].satisfy(specM, schema, defaultOpt));
        });
      });
    });

    it('should return true for non-stack.', () => {
      [Channel.OPACITY, Channel.DETAIL, Channel.COLOR].forEach((stackByChannel) => {
        const specM = buildSpecQueryModel({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
            {channel: stackByChannel, field: 'C', type: Type.NOMINAL}
          ]
        });
        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitNonSumStack'].satisfy(specM, schema, defaultOpt));
      });
    });
  });

  describe('omitNonPositionalOverPositionalChannels', () => {
    it('should return true if color/shape/size is used when both x and y are used', () => {
      [Channel.SHAPE, Channel.SIZE, Channel.COLOR].forEach((channel) => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
            {channel: channel, field: 'C', type: Type.NOMINAL}
          ]
        });
        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitNonPositionalOverPositionalChannels'].satisfy(specM, schema, defaultOpt));
      });
    });

    it('should return false if color/shape/size is used when either x or y is not used', () => {
      [Channel.SHAPE, Channel.SIZE, Channel.COLOR].forEach((channel) => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.NOMINAL},
            {channel: channel, field: 'C', type: Type.NOMINAL}
          ]
        });
        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitNonPositionalOverPositionalChannels'].satisfy(specM, schema, defaultOpt));
      });
    });
  });

  describe('omitRawContinuousFieldForAggregatePlot', () => {
    it('should return false if the aggregate plot groups by a raw temporal field', () => {
      const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'C', type: Type.TEMPORAL}
          ]
        });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, timeUnit: TimeUnit.MONTH, field: 'C', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit as enumSpec', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, timeUnit: {values: [TimeUnit.MONTH, undefined]}, field: 'C', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
    });

    it('should return false if the aggregate plot groups by a raw quantitative field', () => {
      const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'C', type: Type.QUANTITATIVE}
          ]
        });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a binned quantitative field', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, bin: true, field: 'C', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a quantitative field with bin as enumSpec', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, bin: {values: [true, false]}, field: 'C', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true for a plot with only aggregated quantitative field.', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true for any raw plot', () => {
      [TimeUnit.MONTH, undefined, {values: [TimeUnit.MONTH, undefined]}].forEach((timeUnit) => {
        const specM = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, timeUnit: timeUnit, field: 'C', type: Type.TEMPORAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specM, schema, defaultOpt));
      });
    });
  });

  describe('omitRawDetail', () => {
    it('should return true when raw data does not have the detail channel', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, defaultOpt));
    });

    it('should return false when raw data has a detail channel', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.DETAIL, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, defaultOpt));
    });

    it('should return true if any of the encoding channels contain aggregate', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.DETAIL, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawDetail'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('omitRepeatedField', () => {
    it('should return true when there is no repeated field', function() {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: {values: ['B']}, type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specM, schema, defaultOpt));
    });

    it('should return false when there are repeated field', function() {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specM, schema, defaultOpt));
    });
  });

  describe('omitTableWithOcclusion', () => {
    it('return false for raw plot with both x and y as dimensions.', () => {
      [Mark.POINT, Mark.CIRCLE, Mark.SQUARE, Mark.LINE, Mark.AREA, Mark.BAR].forEach((mark) => {
        const specM = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'N', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'N20', type: Type.NOMINAL}
          ]
        });
        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitTableWithOcclusion'].satisfy(specM, schema, {autoAddCount: true}));
      });
    });
  });

  describe('omitVerticalDotPlot', () => {
    it('should return true for horizontal dot plot', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specM, schema, defaultOpt));
    });


    it('should return false for vertical dot plot', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specM, schema, defaultOpt));
    });
  });
});
