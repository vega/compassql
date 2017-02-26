import {Mark} from 'vega-lite/src/mark';

import {assert} from 'chai';
import {initWildcard, isWildcard, SHORT_WILDCARD, getDefaultName, getDefaultEnumValues} from '../src/wildcard';
import {DEFAULT_PROP_PRECEDENCE, toKey} from '../src/property';
import {DEFAULT_QUERY_CONFIG} from '../src/config';

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

  describe('getDefaultName', () => {
    it('should return name for all properties and have no duplicate default names', () => {
      let defaultNameIndex = {};
      const missing = [];
      const duplicated = {};

      for (let prop of DEFAULT_PROP_PRECEDENCE) {
        const name = getDefaultName(prop);
        if (name === undefined) {
          missing.push(toKey(prop));
        } else {
          if (name in defaultNameIndex) {
            duplicated[defaultNameIndex[name]] = duplicated[defaultNameIndex[name]] || [];
            duplicated[defaultNameIndex[name]].push(toKey(prop));
          }
        }

        assert.equal(name in defaultNameIndex, false, `${name} is already used for ${JSON.stringify(defaultNameIndex[name])} and thus can't be used for ${JSON.stringify(prop)}`);
        defaultNameIndex[getDefaultName(prop)] = prop;
      }
      assert.equal(missing.length, 0, 'Properties with missing name: ' + missing.join(','));
      assert.equal(Object.keys(duplicated).length, 0, 'Properties with duplicate names: ' + JSON.stringify(duplicated));
    });

    it('should return enum for every properties by default', () => {
      const missing = [];
      const mockSchema = {
        fields: () => ['a','b']
      } as any;
      for (const prop of DEFAULT_PROP_PRECEDENCE) {
        const e = getDefaultEnumValues(prop, mockSchema, DEFAULT_QUERY_CONFIG);
        if (e === undefined) {
          missing.push(toKey(prop));
        }
      }
      assert.equal(missing.length, 0, 'Properties with missing enum: ' + missing.join(','));
    });
  });

  describe('getDefaultEnumValues', () => {
    it('should return enum for every properties by default.', () => {
      const missing = [];
      const mockSchema = {
        fields: () => ['a','b']
      } as any;
      for (const prop of DEFAULT_PROP_PRECEDENCE) {
        const e =getDefaultEnumValues(prop, mockSchema, DEFAULT_QUERY_CONFIG);
        if (e === undefined) {
          missing.push(toKey(prop));
        }
      }
      assert.equal(missing.length, 0, 'Properties with missing enum: ' + missing.join(','));
    });
  });
});
