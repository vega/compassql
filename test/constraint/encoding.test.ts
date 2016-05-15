import {assert} from 'chai';

import {Channel} from 'vega-lite/src/channel';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {ENCODING_CONSTRAINT_INDEX} from '../../src/constraint/encoding';
import {EncodingQuery} from '../../src/query';
import {Schema} from '../../src/schema';
import {duplicate} from '../../src/util';

describe('constraints/encoding', () => {
  const schema = new Schema([]);
  describe('aggregateOpSupportedByType', () => {
    let encQ: EncodingQuery = {
        channel: Channel.X,
        aggregate: AggregateOp.MEAN,
        field: 'A',
        type: undefined
      };

    it('should return false if aggregate is applied to non-quantitative type', () => {
      [Type.NOMINAL, Type.ORDINAL].forEach((type) => {
        encQ.type = type;
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, schema));
      });
    });

    it('should return true if aggregate is applied to quantitative field', () => {
      // TODO: verify if this really works with temporal
      [Type.QUANTITATIVE, Type.TEMPORAL].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, schema));
      });
    });
  });

  describe('onlyOneTypeOfFunction', () => {
    const encQ: EncodingQuery = {
        channel: Channel.X,
        field: 'A',
        type: Type.QUANTITATIVE
      };

    it('should return true if there is no function', () => {
      assert.isTrue(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema));
    });

    it('should return true if there is only one function', () => {
      [
        ['aggregate', AggregateOp.MEAN], ['timeUnit', TimeUnit.MONTH], ['bin', true]
      ].forEach((tuple: any) => {
        let modifiedEncQ = duplicate(encQ);
        modifiedEncQ[tuple[0]] = tuple[1];
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema));
      });

    });

    it('should return false if there are multiple functions', () => {
      [
        [AggregateOp.MEAN, TimeUnit.MONTH, true],
        [AggregateOp.MEAN, undefined, true],
        [AggregateOp.MEAN, TimeUnit.MONTH, undefined],
        [undefined, TimeUnit.MONTH, true]
      ].forEach((tuple) => {
        encQ.aggregate = tuple[0];
        encQ.timeUnit = tuple[1];
        encQ.bin = tuple[2];

        assert.isFalse(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema));
      });
    });
  });

  describe('timeUnitAppliedForTemporal', () => {
    // FIXME
  });

  describe('typeMatchesPrimitiveType', () => {
    // FIXME
  });
});
