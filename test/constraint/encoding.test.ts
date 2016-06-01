import {assert} from 'chai';

import {Channel} from 'vega-lite/src/channel';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {ENCODING_CONSTRAINTS, ENCODING_CONSTRAINT_INDEX} from '../../src/constraint/encoding';
import {EncodingQuery, DEFAULT_QUERY_CONFIG} from '../../src/query';
import {Schema, PrimitiveType} from '../../src/schema';
import {duplicate} from '../../src/util';

describe('constraints/encoding', () => {
  const defaultOpt = DEFAULT_QUERY_CONFIG;

  const schema = new Schema([{
    field: 'mynumber',
    type: Type.QUANTITATIVE,
    primitiveType: PrimitiveType.NUMBER
  },{
    field: 'mystring',
    type: Type.ORDINAL,
    primitiveType: PrimitiveType.STRING,
  }]);

  // Make sure all non-strict constraints have their configs.
  ENCODING_CONSTRAINTS.forEach((constraint) => {
    if (!constraint.strict()) {
      it(constraint.name() + ' should have default config for all non-strict constraints', () => {
        assert.isDefined(DEFAULT_QUERY_CONFIG[constraint.name()]);
      });
    }
  });

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
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, schema, defaultOpt));
      });
    });

    it('should return true if aggregate is applied to quantitative field', () => {
      // TODO: verify if this really works with temporal
      [Type.QUANTITATIVE, Type.TEMPORAL].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, schema, defaultOpt));
      });
    });
  });

  describe('binAppliedForQuantitative', () => {
    let encQ: EncodingQuery = {
      channel: Channel.X,
      bin: true,
      field: 'A',
      type: undefined
    };

    it('should return false if bin is applied to non-quantitative type', () => {
      [Type.NOMINAL, Type.ORDINAL, Type.TEMPORAL].forEach((type) => {
        encQ.type = type;
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, schema, defaultOpt));
      });
    });

    it('should return true if bin is applied to quantitative type', () => {
      encQ.type = Type.QUANTITATIVE;
      assert.isTrue(ENCODING_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, schema, defaultOpt));
    });

    it('should return true for any non-binned field', () => {
      encQ.bin = undefined;
      [Type.NOMINAL, Type.ORDINAL, Type.TEMPORAL, Type.QUANTITATIVE].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, schema, defaultOpt));
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
      assert.isTrue(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema, defaultOpt));
    });

    it('should return true if there is only one function', () => {
      [
        ['aggregate', AggregateOp.MEAN], ['timeUnit', TimeUnit.MONTH], ['bin', true], , ['autoCount', true]
      ].forEach((tuple: any) => {
        let modifiedEncQ = duplicate(encQ);
        modifiedEncQ[tuple[0]] = tuple[1];
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema, defaultOpt));
      });

    });

    it('should return false if there are multiple functions', () => {
      [
        [AggregateOp.MEAN, TimeUnit.MONTH, true, undefined],
        [AggregateOp.MEAN, undefined, true, undefined],
        [AggregateOp.MEAN, TimeUnit.MONTH, undefined, undefined],
        [undefined, TimeUnit.MONTH, true, undefined],
        [AggregateOp.MEAN, undefined, undefined, true],
      ].forEach((tuple) => {
        encQ.aggregate = tuple[0];
        encQ.timeUnit = tuple[1];
        encQ.bin = tuple[2];
        encQ.autoCount = tuple[3];

        assert.isFalse(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema, defaultOpt));
      });
    });
  });

  describe('timeUnitAppliedForTemporal', () => {
    let encQ: EncodingQuery = {
        channel: Channel.X,
        timeUnit: TimeUnit.MONTH,
        field: 'A',
        type: undefined
      };

    it('should return false if timeUnit is applied to non-temporal type', () => {
      [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE].forEach((type) => {
        encQ.type = type;
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['timeUnitAppliedForTemporal'].satisfy(encQ, schema, defaultOpt));
      });
    });

    it('should return true if aggregate is applied to quantitative field', () => {
      // TODO: verify if this really works with temporal
      encQ.type = Type.TEMPORAL;
      assert.isTrue(ENCODING_CONSTRAINT_INDEX['timeUnitAppliedForTemporal'].satisfy(encQ, schema, defaultOpt));
    });
  });

  describe('typeMatchesSchemaType', () => {
    let encQ: EncodingQuery = {
      channel: Channel.X,
      field: 'mystring',
      type: undefined
    };

    it('should return false if type does not match schema\'s type', () => {
      [Type.TEMPORAL, Type.QUANTITATIVE, Type.NOMINAL].forEach((type) => {
        encQ.type = type;
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(encQ, schema, defaultOpt));
      });
    });

    it('should return true if string matches schema\'s type ', () => {
      [Type.ORDINAL].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(encQ, schema, defaultOpt));
      });
    });

    it('should return false if field does not exist', () => {
      const invalidFieldEncQ = {channel: Channel.X, field: 'random', type: Type.NOMINAL};
      assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(invalidFieldEncQ, schema, defaultOpt));
    });
  });

  describe('typeMatchesPrimitiveType', () => {
    let encQ: EncodingQuery = {
      channel: Channel.X,
      field: 'mystring',
      type: undefined
    };

    it('should return false if string is used as quantitative or temporal', () => {
      [Type.TEMPORAL, Type.QUANTITATIVE].forEach((type) => {
        encQ.type = type;
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(encQ, schema, defaultOpt));
      });
    });

    it('should return true if string is used as ordinal or nominal ', () => {
      [Type.NOMINAL, Type.ORDINAL].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(encQ, schema, defaultOpt));
      });
    });

    it('should return false if field does not exist', () => {
      const invalidFieldEncQ = {channel: Channel.X, field: 'random', type: Type.NOMINAL};
      assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(invalidFieldEncQ, schema, defaultOpt));
    });
  });
});
