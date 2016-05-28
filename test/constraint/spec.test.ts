import {assert} from 'chai';

import {Mark} from 'vega-lite/src/mark';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {SPEC_CONSTRAINTS, SPEC_CONSTRAINT_INDEX} from '../../src/constraint/spec';
import {SpecQueryModel} from '../../src/model';
import {Schema} from '../../src/schema';
import {DEFAULT_QUERY_CONFIG, SpecQuery} from '../../src/query';

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

  describe('channelPermittedByMarkType', () => {
    it('should return true for supported channel', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return false for unsupported channel', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specQ, schema, defaultOpt));
    });
  });

  describe('hasAllRequiredChannelsForMark', () => {
    it('should return true if area/line have both x and y', () => {
      [Mark.AREA, Mark.LINE].forEach((mark) => {
        const specQ = buildSpecQueryModel({
          mark: mark,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.NOMINAL},
            {channel: Channel.Y, field: '*', type: Type.QUANTITATIVE}
          ]
        });
        assert.isTrue(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specQ, schema, defaultOpt));
      });
    });

    it('should return false if area/line have do not have x or y', () => {
      [Channel.X, Channel.Y, Channel.COLOR].forEach((channel) => {
        [Mark.AREA, Mark.LINE].forEach((mark) => {
          const specQ = buildSpecQueryModel({
            mark: mark,
            encodings: [
              {channel: channel, field: '*', type: Type.NOMINAL}
            ]
          });
          assert.isFalse(SPEC_CONSTRAINT_INDEX['hasAllRequiredChannelsForMark'].satisfy(specQ, schema, defaultOpt));
        });
      });
    });

    it('should return true for bar/circle/point/square/tick', () => {
      // TODO:
    });

    it('should return true for rule if has x or y', () => {
      // TODO:
    });

    it('should return false for rule if has neither x nor y', () => {
      // TODO:
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return false when there are repeated channels', function() {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specQ, schema, defaultOpt));
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specQ, schema, defaultOpt));
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if facet is used when x or y is not used', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.ROW, field: 'C', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specQ, schema, defaultOpt));
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specQ, schema, defaultOpt));
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specQ, schema, defaultOpt));
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

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specQ, schema, defaultOpt));
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
        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitNonPositionalOverPositionalChannels'].satisfy(specQ, schema, defaultOpt));
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
        assert.isFalse(SPEC_CONSTRAINT_INDEX['omitNonPositionalOverPositionalChannels'].satisfy(specQ, schema, defaultOpt));
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

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, timeUnit: TimeUnit.MONTH, field: 'C', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a temporal field with timeUnit as enumSpec', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, timeUnit: {enumValues: [TimeUnit.MONTH, undefined]}, field: 'C', type: Type.TEMPORAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return false if the aggregate plot groups by a raw quantitative field', () => {
      const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'C', type: Type.QUANTITATIVE}
          ]
        });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a binned quantitative field', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, bin: true, field: 'C', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the aggregate plot groups by a quantitative field with bin as enumSpec', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, bin: {enumValues: [true, false]}, field: 'C', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true for a plot with only aggregated quantitative field.', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, aggregate: AggregateOp.MEAN, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
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

        assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawContinuousFieldForAggregatePlot'].satisfy(specQ, schema, defaultOpt));
      });
    });
  });

  describe('omitRawWithXYBothOrdinalScaleOrBin', () => {
    it('should return false if the raw spec has dimensions on both x and y', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRawWithXYBothOrdinalScaleOrBin'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the raw spec has dimensions on both x and y', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRawWithXYBothOrdinalScaleOrBin'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true for aggregate', () => {
      // TODO:
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return false when there are repeated field', function() {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specQ, schema, defaultOpt));
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specQ, schema, defaultOpt));
    });


    it('should return false for vertical dot plot', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specQ, schema, defaultOpt));
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if both axes are not binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the preferred axis is binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, bin: true, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, defaultOpt));

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

      assert.isFalse(SPEC_CONSTRAINT_INDEX['preferredBinAxis'].satisfy(specQ, schema, defaultOpt));

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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if both axes are not temporal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the preferred axis is binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.TEMPORAL},
          {channel: Channel.Y, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, defaultOpt));

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

      assert.isFalse(SPEC_CONSTRAINT_INDEX['preferredTemporalAxis'].satisfy(specQ, schema, defaultOpt));

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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if both axes are not ordinal', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: Channel.Y, field: 'B', type: Type.ORDINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if the preferred axis is binned', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.ORDINAL},
          {channel: Channel.X, field: 'B', type: Type.QUANTITATIVE}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, defaultOpt));

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

      assert.isFalse(SPEC_CONSTRAINT_INDEX['preferredOrdinalAxis'].satisfy(specQ, schema, defaultOpt));

      // TODO: add another case for yEncQ
    });
  });
});
