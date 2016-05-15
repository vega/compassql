import {assert} from 'chai';

import {Mark} from 'vega-lite/src/mark';
import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {SPEC_CONSTRAINT_INDEX} from '../../src/constraint/spec';
import {Schema} from '../../src/schema';
import {SpecQueryModel} from '../../src/query';

describe('constraints/spec', () => {
  const schema = new Schema([]);

  describe('channelPermittedByMarkType', () => {
    it('should return true for supported channel', () => {
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specQ, schema));
    });

    it('should return false for unsupported channel', () => {
      const specQ = new SpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['channelPermittedByMarkType'].satisfy(specQ, schema));
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

      assert.isTrue(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specQ, schema));
    });

    it('should return false when there are repeated channels', function() {
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.SHAPE, field: 'A', type: Type.NOMINAL},
          {channel: Channel.SHAPE, field: 'B', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['noRepeatedChannel'].satisfy(specQ, schema));
    });
  });

  describe('noRepeatedField', () => {
    it('should return true when there is no repeated field', function() {
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: {enumValues: ['B']}, type: Type.NOMINAL}
        ]
      });

      assert.isTrue(SPEC_CONSTRAINT_INDEX['noRepeatedField'].satisfy(specQ, schema));
    });

    it('should return false when there are repeated field', function() {
      const specQ = new SpecQueryModel({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.NOMINAL},
          {channel: Channel.Y, field: 'A', type: Type.NOMINAL}
        ]
      });

      assert.isFalse(SPEC_CONSTRAINT_INDEX['noRepeatedField'].satisfy(specQ, schema));
    });
  });
});
