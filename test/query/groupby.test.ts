import {assert} from 'chai';

import {Property} from '../../src/property';
import {isExtendedGroupBy, toString, REPLACE_MARK_STYLE_CHANNELS} from '../../src/query/groupby';


describe('query/groupby', () => {
  describe('isExtendedGroupBy', () => {
    it('should return true for extended groupBy', () => {
      assert(isExtendedGroupBy({property: Property.CHANNEL}));
      assert(isExtendedGroupBy({property: Property.CHANNEL, replace: {x: 'xy', y: 'xy'}}));
    });

    it('should return false for normal groupBy', () => {
      assert(!isExtendedGroupBy(Property.CHANNEL));
    });
  });

  describe('toString', () => {
    it('should return correct string for groupBy properties (array)', () => {
      assert.equal(toString([
        Property.FIELD,
        {property: Property.AGGREGATE},
        {
          property: Property.CHANNEL,
          replace: REPLACE_MARK_STYLE_CHANNELS
        }
      ]), 'field,aggregate,channel[color,opacity,shape,size=>style]');
    });

    it('should return correct string for string groupBy', () => {
      assert.equal(toString('foobar'), 'foobar');
    });
  });
});
