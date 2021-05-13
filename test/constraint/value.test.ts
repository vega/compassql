import {assert} from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import {Channel} from 'vega-lite/build/src/channel';
import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {VALUE_CONSTRAINT_INDEX} from '../../src/constraint/value';
import {PropIndex} from '../../src/propindex';
import {ValueQuery} from '../../src/query/encoding';
import {extend} from '../../src/util';
import {Wildcard} from '../../src/wildcard';
import {schema} from '../fixture';

describe('constraints/value', () => {
  const CONSTRAINT_MANUALLY_SPECIFIED_CONFIG = extend({}, DEFAULT_QUERY_CONFIG, {
    constraintManuallySpecifiedValue: true,
  });

  describe('Value Constraint Checks', () => {
    it('should return true if value is not a constant', () => {
      const validValueQ: ValueQuery = {
        value: 'color',
        channel: CHANNEL.COLOR,
      };
      assert.isTrue(
        VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(
          validValueQ,
          schema,
          new PropIndex<Wildcard<any>>(),
          CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
        )
      );
    });

    it('should return false if value is a constant', () => {
      ['row', 'column', 'x', 'y', 'detail'].forEach((channel: Channel) => {
        const invalidValueQ: ValueQuery = {
          value: channel,
          channel,
        };

        assert.isFalse(
          VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(
            invalidValueQ,
            schema,
            new PropIndex<Wildcard<any>>(),
            CONSTRAINT_MANUALLY_SPECIFIED_CONFIG
          )
        );
      });
    });
  });
});
