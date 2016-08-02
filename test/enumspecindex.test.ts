import {EnumSpecIndex} from '../src/enumspecindex';
import {SHORT_ENUM_SPEC} from '../src/enumspec';
import {Property} from '../src/property';

import {assert} from 'chai';

describe('enumspecindex', () => {
  describe('isEmpty', () => {
    it('should return false if encoding property is set', () => {
      let enumSpecIndex = new EnumSpecIndex()
        .setEncodingProperty(0, Property.SCALE, SHORT_ENUM_SPEC);
      assert.equal(enumSpecIndex.isEmpty(), false);
    });

    it('should return false if mark is set', () => {
      let enumSpecIndex = new EnumSpecIndex()
        .setMark(SHORT_ENUM_SPEC);
      assert.equal(enumSpecIndex.isEmpty(), false);
    });

    it('should return false if mark and encoding property are set', () => {
      let enumSpecIndex = new EnumSpecIndex()
        .setEncodingProperty(0, Property.SCALE, SHORT_ENUM_SPEC)
        .setMark(SHORT_ENUM_SPEC);
      assert.equal(enumSpecIndex.isEmpty(), false);
    });

    it('should return true if mark and encoding property are not set', () => {
      let enumSpecindex = new EnumSpecIndex();
      assert.equal(enumSpecindex.isEmpty(), true);
    });
  });

  describe('hasProperty', () => {
    it('should return true if encodingIndicesByProperty contains a specified encoding property', () => {
      let enumSpecIndex = new EnumSpecIndex()
        .setEncodingProperty(0, Property.SCALE, SHORT_ENUM_SPEC);
      assert.equal(enumSpecIndex.hasProperty(Property.SCALE), true);
    });

    it('should return false if encodingIndicesByProperty does not contain a specified encoding property', () => {
      let enumSpecIndex = new EnumSpecIndex();
      assert.equal(enumSpecIndex.hasProperty(Property.SCALE), false);
    });

    it('should return true if enumSpecIndex contains Property.MARK when Property.MARK is specified', () => {
      let enumSpecIndex = new EnumSpecIndex()
        .setMark(SHORT_ENUM_SPEC);
      assert.equal(enumSpecIndex.hasProperty(Property.MARK), true);
    });

    it('should return false if enumSpecIndex does not contain Property.MARK when Property.MARK is specified', () => {
      let enumSpecIndex = new EnumSpecIndex();
      assert.equal(enumSpecIndex.hasProperty(Property.SCALE), false);
    });
  });
});
