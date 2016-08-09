import {Mark} from 'vega-lite/src/mark';

import {assert} from 'chai';
import {initEnumSpec, isEnumSpec, SHORT_ENUM_SPEC} from '../src/enumspec';

describe('enumspec', () => {
  describe('isEnumSpec', () => {
    it('should return true for an enum spec with name and values', () => {
      assert(isEnumSpec({
        name: 'a',
        values: [1,2,3]
      }));
    });

    it('should return true for an enum spec with name.', () => {
      assert(isEnumSpec({
        name: 'a'
      }));
    });

    it('should return true for an enum spec with values', () => {
      assert(isEnumSpec({
        values: [1,2,3]
      }));
    });

    it('should return true for a short enum spec', () => {
      assert(isEnumSpec(SHORT_ENUM_SPEC));
    });

    it('should return false for a string', () => {
      assert(!isEnumSpec('string'));
    });

    it('should return false for a number', () => {
      assert(!isEnumSpec(9));
    });

    it('should return false for a boolean value', () => {
      assert(!isEnumSpec(true));
    });

    it('should return false for an array', () => {
      assert(!isEnumSpec([1,2]));
    });
  });

  describe('initEnumSpec', () => {
    it('should not extend the enumSpec with SHORT_ENUM_SPEC.', () => {
      const mark = initEnumSpec(SHORT_ENUM_SPEC, 'm', [Mark.POINT]);
      assert.deepEqual(mark, {
        name: 'm',
        values: [Mark.POINT]
      });
    });

    it('should return full enumSpec with other properties preserved', () => {
      const binQuery = initEnumSpec({values: [true, false], maxbins: 30}, 'b1', [true, false]);
      assert.deepEqual(binQuery.values, [true, false]);
      assert.equal(binQuery['maxbins'], 30);
      assert.equal(binQuery.name, 'b1');
    });
  });
});
