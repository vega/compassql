import {assert} from 'chai';

import {Channel} from 'vega-lite/build/src/channel';

import {PropIndex} from '../../src/propindex';
import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {VALUE_CONSTRAINT_INDEX} from '../../src/constraint/value';
import {ValueQuery} from '../../src/query/encoding';
import {Wildcard} from '../../src/wildcard';
import {extend} from '../../src/util';

import {schema} from '../fixture';

describe('constraints/value', () => {
  const CONSTRAINT_MANUALLY_SPECIFIED_CONFIG = extend({}, DEFAULT_QUERY_CONFIG, {constraintManuallySpecifiedValue: true});

  describe('Value Constraint Checks', () => {
    it('should return true if value is not a constant', () => {
      const validValueQ: ValueQuery = {
        value: 'color',
        channel: Channel.COLOR,
      };
      assert.isTrue(VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(validValueQ, schema, new PropIndex<Wildcard<any>>(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
    });

    it('should return false if value is a constant', () => {
      [['row', Channel.ROW], ['column', Channel.COLUMN], ['x', Channel.X], ['y', Channel.Y], ['detail', Channel.DETAIL]].forEach((type) => {
        const invalidValueQ: ValueQuery = {
          value: type[0],
          channel: type[1],
        };

        assert.isFalse(VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(invalidValueQ, schema, new PropIndex<Wildcard<any>>(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
      });
    });
  });
});
