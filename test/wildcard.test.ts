import {Mark} from 'vega-lite/src/mark';

import {assert} from 'chai';
import {initWildcard, isWildcard, SHORT_WILDCARD} from '../src/wildcard';

describe('wildcard', () => {
  describe('isWildcard', () => {
    it('should return true for a wildcard with name and values', () => {
      assert(isWildcard({
        name: 'a',
        enum: [1,2,3]
      }));
    });

    it('should return true for a wildcard with name.', () => {
      assert(isWildcard({
        name: 'a'
      }));
    });

    it('should return true for a wildcard with values', () => {
      assert(isWildcard({
        enum: [1,2,3]
      }));
    });

    it('should return true for a short wildcard', () => {
      assert(isWildcard(SHORT_WILDCARD));
    });

    it('should return false for a string', () => {
      assert(!isWildcard('string'));
    });

    it('should return false for a number', () => {
      assert(!isWildcard(9));
    });

    it('should return false for a boolean value', () => {
      assert(!isWildcard(true));
    });

    it('should return false for an array', () => {
      assert(!isWildcard([1,2]));
    });
  });

  describe('initWildcard', () => {
    it('should not extend the wildcard with SHORT_WILDCARD.', () => {
      const mark = initWildcard(SHORT_WILDCARD, 'm', [Mark.POINT]);
      assert.deepEqual(mark, {
        name: 'm',
        enum: [Mark.POINT]
      });
    });

    it('should return full wildcard with other properties preserved', () => {
      const binQuery = initWildcard({enum: [true, false], maxbins: 30}, 'b1', [true, false]);
      assert.deepEqual(binQuery.enum, [true, false]);
      assert.equal(binQuery['maxbins'], 30);
      assert.equal(binQuery.name, 'b1');
    });
  });
});
