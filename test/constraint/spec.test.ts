import {assert} from 'chai';

import {Mark} from 'vega-lite/src/mark';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {SPEC_CONSTRAINTS, SPEC_CONSTRAINT_INDEX} from '../../src/constraint/spec';
import {SpecQueryModel} from '../../src/model';
import {Schema} from '../../src/schema';
import {Stats} from '../../src/stats';
import {DEFAULT_QUERY_CONFIG, SpecQuery} from '../../src/query';
import {duplicate} from '../../src/util';

describe('constraints/spec', () => {
  const defaultOpt = DEFAULT_QUERY_CONFIG;
  const schema = new Schema([]);
  const stats = new Stats([]);

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
          assert.equal(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(model, schema, stats, defaultOpt), satisfy);
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
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.X, field: 'B', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the raw spec has one unbinned quantitative field.', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the raw spec has one temporal without time unit field.', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.TEMPORAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return false if the raw spec have only nominal, ordinal, binned quantitative or temporal with time unit fields.', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'B', type: Type.ORDINAL},
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, bin: true},
          {channel: Channel.Y, field: 'B', type: Type.TEMPORAL, timeUnit: TimeUnit.HOURS}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['autoAddCount'].satisfy(specQ, schema, stats, defaultOpt));
    });

  });

  describe('channelPermittedByMarkType', () => {
    it('should return true for supported channel', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return false for unsupported channel', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specQ, schema, stats, defaultOpt));
    });
  });

  describe('hasAllRequiredChannelsForMark', () => {
    it('should return true if area/line have both x and y', () => {
      [Mark.AREA, Mark.LINE].forEach((mark) => {
        const specQ = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'N', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
          ]
        });
        assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specQ, schema, stats, defaultOpt));
      });
    });

    it('should return false if area/line have do not have x or y', () => {
      [Channel.X, Channel.Y, Channel.COLOR].forEach((channel) => {
        [Mark.AREA, Mark.LINE].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: channel, field: 'N', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });
    });

    it('should return true for bar/circle/point/square/tick/rule with x or y', () => {
      [Channel.X, Channel.Y].forEach((channel) => {
        [Mark.BAR, Mark.CIRCLE, Mark.POINT, Mark.SQUARE, Mark.TICK, Mark.RULE].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: channel, field: 'N', type: Type.NOMINAL}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });
    });

    it('should return false for bar/circle/point/square/tick/rule with neither x nor y', () => {
      [Channel.COLOR, Channel.SHAPE].forEach((channel) => {
        [Mark.BAR, Mark.CIRCLE, Mark.POINT, Mark.SQUARE, Mark.TEXT, Mark.RULE].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: channel, field: 'N', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specQ, schema, stats, defaultOpt));
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
      it('should return true for graphics with one dimension and one measure on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });

      it('should return true for graphics with one binned dimension and one measure on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'Q1', type: Type.QUANTITATIVE, bin: true},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });

      it('should return true for graphics with one binned dimension and one measure on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'T', type: Type.TEMPORAL, timeUnit: TimeUnit.MONTH},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });

      it('should return false for graphics with two dimensions on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'N20', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });

      it('should return false for graphics with two measures on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'Q1', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'Q2', type: Type.QUANTITATIVE}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });


      it('should return false for graphics with one temporal field and one quantitative field on x/y', () => {
        [Mark.BAR, Mark.TICK].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'T', type: Type.TEMPORAL},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });
    });

    describe('line, area', () => {
      it('should return true for aggregate line/area with at least one dimension', () => {
        [Mark.LINE, Mark.AREA].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN}
            ]
          });
          assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });

      it('should return false for aggregate line/area with no dimension', () => {
        [Mark.LINE, Mark.AREA].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'Q1', type: Type.QUANTITATIVE},
              {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });

      it('should return false for graphics with two dimensions on x/y', () => {
        [Mark.LINE, Mark.AREA].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: Channel.X, field: 'N', type: Type.NOMINAL},
              {channel: Channel.Y, field: 'N20', type: Type.NOMINAL},
              {channel: Channel.SIZE, field:'*', aggregate: AggregateOp.COUNT, type: Type.QUANTITATIVE}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAppropriateGraphicTypeForMark'].satisfy(specQ, schema, stats, defaultOpt));
        });
      });
    });
  });

  describe('noRepeatedChannel', () => {
    it('should return true when there is no repeated channels', function() {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return false when there are repeated channels', function() {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specQ, schema, stats, defaultOpt));
    });
  });

  describe('omitFacetOverPositionalChannels', () => {
    it('should return true if facet is not used', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if facet is used when both x and y are used', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
          {channel: Channel.ROW, field: 'C', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if facet is used when x or y is not used', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.ROW, field: 'C', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
    });
  });

  describe('omitMultipleNonPositionalChannels', () => {
    it('should return true if there are zero non-positional channels', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if there are one non-positional channels', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'C', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return false if there are multiple non-positional channels', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'C', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'D', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
    });
  });

  describe('omitNonPositionalOverPositionalChannels', () => {
    it('should return true if color/shape/size is used when both x and y are used', () => {
      [Channel.SHAPE, Channel.SIZE, Channel.COLOR].forEach((channel) => {
        const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'B', type: Type.NOMINAL},
            {channel: channel, field: 'C', type: Type.NOMINAL}
          ]
        });
        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitNonPositionalOverPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
      });
    });

    it('should return false if color/shape/size is used when either x or y is not used', () => {
      [Channel.SHAPE, Channel.SIZE, Channel.COLOR].forEach((channel) => {
        const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.NOMINAL},
            {channel: channel, field: 'C', type: Type.NOMINAL}
          ]
        });
        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitNonPositionalOverPositionalChannels'].satisfy(specQ, schema, stats, defaultOpt));
      });
    });
  });

  describe('omitRawBarLineArea', () => {
    [Mark.BAR, Mark.LINE, Mark.AREA].forEach((mark) => {
      it('should return false for raw ' + mark, () => {
        const specQ = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawBarLineArea'].satisfy(specQ, schema, stats, defaultOpt));
      });

      it('should return true for aggregate ' + mark, () => {
        const specQ = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawBarLineArea'].satisfy(specQ, schema, stats, defaultOpt));
      });
    });

    [Mark.POINT, Mark.TICK, Mark.SQUARE].forEach((mark) => {
      it('should return true for raw ' + mark, () => {
        const specQ = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawBarLineArea'].satisfy(specQ, schema, stats, defaultOpt));
      });

      it('should return true for aggregate ' + mark, () => {
        const specQ = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'N', type: Type.NOMINAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawBarLineArea'].satisfy(specQ, schema, stats, defaultOpt));
      });
    });
  });

  describe('omitRawContinuousFieldForAggregatePlot', () => {
    it('should return false if the aggregate plot groups by a raw temporal field', () => {
      const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'C', type: Type.TEMPORAL}
          ]
        });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, timeUnit: TimeUnit.MONTH, field: 'C', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit as enumSpec', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, timeUnit: {enumValues: [TimeUnit.MONTH, undefined]}, field: 'C', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return false if the aggregate plot groups by a raw quantitative field', () => {
      const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'C', type: Type.QUANTITATIVE}
          ]
        });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a binned quantitative field', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, bin: true, field: 'C', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a quantitative field with bin as enumSpec', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, bin: {enumValues: [true, false]}, field: 'C', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true for a plot with only aggregated quantitative field.', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true for any raw plot', () => {
      [TimeUnit.MONTH, undefined, {enumValues: [TimeUnit.MONTH, undefined]}].forEach((timeUnit) => {
        const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, timeUnit: timeUnit, field: 'C', type: Type.TEMPORAL}
          ]
        });

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, stats, defaultOpt));
      });
    });
  });


  describe('omitRepeatedField', () => {
    it('should return true when there is no repeated field', function() {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: {enumValues: ['B']}, type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return false when there are repeated field', function() {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specQ, schema, stats, defaultOpt));
    });
  });

  describe('omitVerticalDotPlot', () => {
    it('should return true for horizontal dot plot', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specQ, schema, stats, defaultOpt));
    });


    it('should return false for vertical dot plot', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specQ, schema, stats, defaultOpt));
    });
  });

  describe('preferredBinAxis', () => {
    it('should return true if both axes are binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, bin: true, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, bin: true, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if both axes are not binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the preferred axis is binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, bin: true, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, stats, defaultOpt));

      // TODO: add another case for yEncQ
    });

    it('should return false if the non-preferred axis is the only one that is binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, bin: true, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, stats, defaultOpt));

      // TODO: add another case for yEncQ
    });
  });

  describe('preferredTemporalAxis', () => {
    it('should return true if both axes are temporal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.TEMPORAL},
          {channel: Channel.Y, field: 'B', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if both axes are not temporal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the preferred axis is binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.TEMPORAL},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, stats, defaultOpt));

      // TODO: add another case for yEncQ
    });

    it('should return false if the non-preferred axis is the only one that is temporal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.TEMPORAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, stats, defaultOpt));

      // TODO: add another case for yEncQ
    });
  });

  describe('preferredOrdinalAxis', () => {
    it('should return true if both axes are ordinal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: Channel.Y, field: 'B', type: Type.ORDINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if both axes are not ordinal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: Channel.Y, field: 'B', type: Type.ORDINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, stats, defaultOpt));
    });

    it('should return true if the preferred axis is binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.ORDINAL},
          {channel: Channel.X, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, stats, {preferredOrdinalAxis: Channel.Y}));

      // TODO: add another case for yEncQ
    });

    it('should return false if the non-preferred axis is the only one that is temporal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.X, field: 'B', type: Type.ORDINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, stats, defaultOpt));

      // TODO: add another case for yEncQ
    });
  });
});
