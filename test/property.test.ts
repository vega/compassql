import {assert} from 'chai';
import {ENCODING_PROPERTIES, DEFAULT_PROPERTY_PRECEDENCE} from '../src/property';

describe('property', () => {
  describe('DEFAULT_PROPERTY_PRECEDENCE', () => {
    it('should contain all properties in ENCODING_PROPERTIES', () => {
      const DEFAULT_PROPERTY_PRECEDENCE_INDEX =
        DEFAULT_PROPERTY_PRECEDENCE.reduce((m, prop) => {
          m[prop] = prop;
          return m;
      }, {});

      for (let encProp of ENCODING_PROPERTIES) {
        assert.equal((encProp in DEFAULT_PROPERTY_PRECEDENCE_INDEX), true);
      }
    });
  });
});
