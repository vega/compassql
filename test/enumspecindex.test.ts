import {EnumSpecIndex} from '../src/enumspecindex';
import {Property} from '../src/property';

import {assert} from 'chai';

describe('enumspecindex', () => {
  describe('isEmpty', () => {
    it('should return false if enumSpecIndex has mark and encodingIndicesByProperty', () => {
      const enumSpecIndex = new EnumSpecIndex({name: 'mark', values: undefined}, {}, {'test': [1, 2]});
      assert.equal(enumSpecIndex.isEmpty(), false);
    });

    it('should return false if enumSpecIndex has encodingIndicesByProperty', () => {
      const enumSpecIndex = new EnumSpecIndex(undefined, {}, {'test': [1, 2]});
      assert.equal(enumSpecIndex.isEmpty(), false);
    });

    it('should return false if enumSpecIndex has mark', () => {
      const enumSpecIndex = new EnumSpecIndex({name: 'mark', values: undefined}, {}, {});
      assert.equal(enumSpecIndex.isEmpty(), false);
    });

    it('should return true if enumSpecIndex does not have mark and encodingIndicesByProperty', () => {
      const enumSpecIndex = new EnumSpecIndex(undefined, {}, {});
      assert.equal(enumSpecIndex.isEmpty(), true);
    });
  });

  describe('hasProperty', () => {
    it('should return true if encodingIndicesByProperty contains a specified encoding property', () => {
      const enumSpecIndex = new EnumSpecIndex(undefined, {}, {'scale': [1,2]});
      assert.equal(enumSpecIndex.hasProperty(Property.SCALE), true);
    });

    it('should return false if encodingIndicesByProperty does not contain a specified encoding property', () => {
      const enumSpecIndex = new EnumSpecIndex(undefined, {}, {'channel': [1,2]});
      assert.equal(enumSpecIndex.hasProperty(Property.BIN), false);
    });

    // TODO: Case for Property.MARK
  });
});
