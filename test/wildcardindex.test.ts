import {assert} from 'chai';
import * as MARK from 'vega-lite/build/src/mark';
import {Property} from '../src/property';
import {WildcardIndex} from '../src/wildcardindex';

describe('wildcardindex', () => {
  describe('isEmpty', () => {
    it('should return false if encoding property is set', () => {
      let wildcardIndex = new WildcardIndex().setEncodingProperty(0, Property.SCALE, {
        name: 'scale',
        enum: [true, false]
      });
      assert.equal(wildcardIndex.isEmpty(), false);
    });

    it('should return false if mark is set', () => {
      let wildcardIndex = new WildcardIndex().setMark({name: 'mark', enum: [MARK.POINT, MARK.BAR, MARK.LINE]});
      assert.equal(wildcardIndex.isEmpty(), false);
    });

    it('should return false if mark and encoding property are set', () => {
      let wildcardIndex = new WildcardIndex()
        .setEncodingProperty(0, Property.SCALE, {name: 'scale', enum: [true, false]})
        .setMark({name: 'mark', enum: [MARK.POINT, MARK.BAR, MARK.LINE]});
      assert.equal(wildcardIndex.isEmpty(), false);
    });

    it('should return true if mark and encoding property are not set', () => {
      let wildcardIndex = new WildcardIndex();
      assert.equal(wildcardIndex.isEmpty(), true);
    });
  });

  describe('hasProperty', () => {
    it('should return true if encodingIndicesByProperty contains a specified encoding property', () => {
      let wildcardIndex = new WildcardIndex().setEncodingProperty(0, Property.SCALE, {
        name: 'scale',
        enum: [true, false]
      });
      assert.equal(wildcardIndex.hasProperty(Property.SCALE), true);
    });

    it('should return false if encodingIndicesByProperty does not contain a specified encoding property', () => {
      let wildcardIndex = new WildcardIndex();
      assert.equal(wildcardIndex.hasProperty(Property.SCALE), false);
    });

    it('should return true if wildcardIndex contains Property.MARK when Property.MARK is specified', () => {
      let wildcardIndex = new WildcardIndex().setMark({name: 'mark', enum: [MARK.POINT, MARK.BAR, MARK.LINE]});
      assert.equal(wildcardIndex.hasProperty(Property.MARK), true);
    });

    it('should return false if wildcardIndex does not contain Property.MARK when Property.MARK is specified', () => {
      let wildcardIndex = new WildcardIndex();
      assert.equal(wildcardIndex.hasProperty(Property.MARK), false);
    });
  });
});
