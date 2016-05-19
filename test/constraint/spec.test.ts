import {assert} from 'chai';

import {Mark} from 'vega-lite/src/mark';
import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {SPEC_CONSTRAINTS, SPEC_CONSTRAINT_INDEX} from '../../src/constraint/spec';
import {Schema} from '../../src/schema';
import {DEFAULT_QUERY_CONFIG, SpecQueryModel} from '../../src/query';

describe('constraints/spec', () => {
  const defaultOpt = DEFAULT_QUERY_CONFIG;
  const schema = new Schema([]);

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
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return false for unsupported channel', () => {
      const specQ = new SpecQueryModel({
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
        const specQ = new SpecQueryModel({
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
          const specQ = new SpecQueryModel({
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
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return false when there are repeated channels', function() {
      const specQ = new SpecQueryModel({
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
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitFacetOverPositionalChannels'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if facet is used when both x and y are used', () => {
      const specQ = new SpecQueryModel({
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
      const specQ = new SpecQueryModel({
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
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitMultipleNonPositionalChannels'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return true if there are one non-positional channels', () => {
      const specQ = new SpecQueryModel({
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
      const specQ = new SpecQueryModel({
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
        const specQ = new SpecQueryModel({
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
        const specQ = new SpecQueryModel({
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

  describe('omitRepeatedField', () => {
    it('should return true when there is no repeated field', function() {
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: {enumValues: ['B']}, type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitRepeatedField'].satisfy(specQ, schema, defaultOpt));
    });

    it('should return false when there are repeated field', function() {
      const specQ = new SpecQueryModel({
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
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specQ, schema, defaultOpt));
    });


    it('should return false for vertical dot plot', () => {
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['omitVerticalDotPlot'].satisfy(specQ, schema, defaultOpt));
    });
  });
});
