import {assert} from 'chai';

import {Channel} from 'vega-lite/src/channel';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {ENCODING_CONSTRAINTS, ENCODING_CONSTRAINT_INDEX} from '../../src/constraint/encoding';
import {EncodingQuery} from '../../src/query';
import {duplicate} from '../../src/util';

import {schema, stats} from '../fixture';

describe('constraints/encoding', () => {
  const defaultOpt = DEFAULT_QUERY_CONFIG;


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
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return true if aggregate is applied to quantitative field', () => {
      // TODO: verify if this really works with temporal
      [Type.QUANTITATIVE, Type.TEMPORAL].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['aggregateOpSupportedByType'].satisfy(encQ, schema, stats, defaultOpt));
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
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return true if bin is applied to quantitative type', () => {
      encQ.type = Type.QUANTITATIVE;
      assert.isTrue(ENCODING_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, schema, stats, defaultOpt));
    });

    it('should return true for any non-binned field', () => {
      encQ.bin = undefined;
      [Type.NOMINAL, Type.ORDINAL, Type.TEMPORAL, Type.QUANTITATIVE].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['binAppliedForQuantitative'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });
  });

  describe('channelSupportsRole', () => {
    [Channel.X, Channel.Y, Channel.COLOR, Channel.OPACITY, Channel.DETAIL].forEach((channel) => {
      it(channel + ' supports raw measure.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports aggregate measure.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports raw temporal measure.', () => {
        const encQ = {channel: channel, field: 'T', type: Type.TEMPORAL};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports timeUnit temporal dimension.', () => {
        const encQ = {channel: channel, field: 'T', type: Type.QUANTITATIVE, timeUnit: TimeUnit.MONTH};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports binned quantitative dimension.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE, bin: true};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports ordinal dimension.', () => {
        const encQ = {channel: channel, field: 'O', type: Type.ORDINAL};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports nominal dimension.', () => {
        const encQ = {channel: channel, field: 'N', type: Type.NOMINAL};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    [Channel.ROW, Channel.COLUMN, Channel.SHAPE].forEach((channel) => {
      it(channel + ' does not support raw measure.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE};
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' does not support aggregate measure.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN};
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' does not support raw temporal measure.', () => {
        const encQ = {channel: channel, field: 'T', type: Type.TEMPORAL};
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports timeUnit temporal dimension.', () => {
        const encQ = {channel: channel, field: 'T', type: Type.QUANTITATIVE, timeUnit: TimeUnit.MONTH};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports binned quantitative dimension.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE, bin: true};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports ordinal dimension.', () => {
        const encQ = {channel: channel, field: 'O', type: Type.ORDINAL};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports nominal dimension.', () => {
        const encQ = {channel: channel, field: 'N', type: Type.NOMINAL};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    [Channel.SIZE, Channel.TEXT].forEach((channel) => {
      it(channel + ' supports raw measure.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports aggregate measure.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' supports raw temporal measure.', () => {
        const encQ = {channel: channel, field: 'T', type: Type.TEMPORAL};
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' does not support timeUnit temporal dimension.', () => {
        const encQ = {channel: channel, field: 'T', type: Type.QUANTITATIVE, timeUnit: TimeUnit.MONTH};
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' does not support binned quantitative dimension.', () => {
        const encQ = {channel: channel, field: 'Q', type: Type.QUANTITATIVE, bin: true};
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' does not support ordinal dimension.', () => {
        const encQ = {channel: channel, field: 'O', type: Type.ORDINAL};
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });

      it(channel + ' does not support  nominal dimension.', () => {
        const encQ = {channel: channel, field: 'N', type: Type.NOMINAL};
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['channelSupportsRole'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

  });

  describe('maxCardinalityForCategoricalColor', () => {
    it('should return true for nominal color that has low cardinality', () => {
      ['O', 'O_10', 'O_20'].forEach((field) => {
        const encQ: EncodingQuery = {
          channel: Channel.COLOR,
          field: field,
          type: Type.NOMINAL
        };
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['maxCardinalityForCategoricalColor'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return false for nominal color that has high cardinality', () => {
      ['O_100'].forEach((field) => {
        const encQ: EncodingQuery = {
          channel: Channel.COLOR,
          field: field,
          type: Type.NOMINAL
        };
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['maxCardinalityForCategoricalColor'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    // TODO: timeUnit with categorical color scale

    // TODO: bin with categorical color scale
  });


  describe('maxCardinalityForFacet', () => {
    it('should return true for nominal field that has low cardinality', () => {
      [Channel.ROW, Channel.COLUMN].forEach((channel) => {
        ['O', 'O_10'].forEach((field) => {
          const encQ: EncodingQuery = {
            channel: channel,
            field: field,
            type: Type.NOMINAL
          };
          assert.isTrue(ENCODING_CONSTRAINT_INDEX['maxCardinalityForFacet'].satisfy(encQ, schema, stats, defaultOpt));
        });
      });
    });

    it('should return false for nominal field that has high cardinality', () => {
      [Channel.ROW, Channel.COLUMN].forEach((channel) => {
        ['O_20', 'O_100'].forEach((field) => {
          const encQ: EncodingQuery = {
            channel: channel,
            field: field,
            type: Type.NOMINAL
          };
          assert.isFalse(ENCODING_CONSTRAINT_INDEX['maxCardinalityForFacet'].satisfy(encQ, schema, stats, defaultOpt));
        });
      });
    });

    // TODO: timeUnit

    // TODO: bin
  });

  describe('maxCardinalityForShape', () => {
    it('should return true for nominal shape that has low cardinality', () => {
      ['O'].forEach((field) => {
        const encQ: EncodingQuery = {
          channel: Channel.SHAPE,
          field: field,
          type: Type.NOMINAL
        };
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['maxCardinalityForShape'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return false for nominal shape that has high cardinality', () => {
      ['O_10', 'O_20', 'O_100'].forEach((field) => {
        const encQ: EncodingQuery = {
          channel: Channel.SHAPE,
          field: field,
          type: Type.NOMINAL
        };
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['maxCardinalityForShape'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    // TODO: timeUnit

    // TODO: bin
  });

  describe('omitBinWithLogScale', () => {
    it('bin should not support log scale', () => {
      const encQ: EncodingQuery = {
        channel: Channel.X,
        field: 'Q',
        bin: true,
        scale: {type: ScaleType.LOG},
        type: Type.QUANTITATIVE
      };
      assert.isFalse(ENCODING_CONSTRAINT_INDEX['omitBinWithLogScale'].satisfy(encQ, schema, stats, defaultOpt));
    });
  });


  describe('dataTypeMatchesScaleType', () => {
   [ScaleType.ORDINAL, ScaleType.LINEAR].forEach((scaleType) => {
     it('scaleType of ' + scaleType + ' matches data type ordinal', () => {
       const encQ: EncodingQuery = {channel: Channel.X, field: 'O', scale: {type: scaleType}, type: Type.ORDINAL};
       assert.isTrue(ENCODING_CONSTRAINT_INDEX['dataTypeMatchesScaleType'].satisfy(encQ, schema, stats, defaultOpt));
     });
   });

   [ScaleType.ORDINAL, ScaleType.LINEAR].forEach((scaleType) => {
     it('scaleType of ' + scaleType + ' matches data type nominal', () => {
       const encQ: EncodingQuery = {channel: Channel.X, field: 'N', scale: {type: scaleType}, type: Type.NOMINAL};
       assert.isTrue(ENCODING_CONSTRAINT_INDEX['dataTypeMatchesScaleType'].satisfy(encQ, schema, stats, defaultOpt));
     });
   });

   [ScaleType.TIME, ScaleType.UTC, ScaleType.ORDINAL, ScaleType.LINEAR].forEach((scaleType) => {
     it('scaleType of ' + scaleType + ' matches data type temporal', () => {
       const encQ: EncodingQuery = {channel: Channel.X, field: 'T', scale: {type: scaleType}, type: Type.TEMPORAL};
       assert.isTrue(ENCODING_CONSTRAINT_INDEX['dataTypeMatchesScaleType'].satisfy(encQ, schema, stats, defaultOpt));
     });
   });

   [ScaleType.LOG, ScaleType.LINEAR].forEach((scaleType) => {
     it('scaleType of ' + scaleType + ' matches data type quantitative', () => {
       const encQ: EncodingQuery = {channel: Channel.X, field: 'Q', scale: {type: scaleType}, type: Type.QUANTITATIVE};
       assert.isTrue(ENCODING_CONSTRAINT_INDEX['dataTypeMatchesScaleType'].satisfy(encQ, schema, stats, defaultOpt));
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
      assert.isTrue(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema, stats, defaultOpt));
    });

    it('should return true if there is only one function', () => {
      [
        ['aggregate', AggregateOp.MEAN], ['timeUnit', TimeUnit.MONTH], ['bin', true], , ['autoCount', true]
      ].forEach((tuple: any) => {
        let modifiedEncQ = duplicate(encQ);
        modifiedEncQ[tuple[0]] = tuple[1];
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema, stats, defaultOpt));
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

        assert.isFalse(ENCODING_CONSTRAINT_INDEX['onlyOneTypeOfFunction'].satisfy(encQ, schema, stats, defaultOpt));
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
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['timeUnitAppliedForTemporal'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return true if aggregate is applied to quantitative field', () => {
      // TODO: verify if this really works with temporal
      encQ.type = Type.TEMPORAL;
      assert.isTrue(ENCODING_CONSTRAINT_INDEX['timeUnitAppliedForTemporal'].satisfy(encQ, schema, stats, defaultOpt));
    });
  });

  describe('typeMatchesSchemaType', () => {
    let encQ: EncodingQuery = {
      channel: Channel.X,
      field: 'O',
      type: undefined
    };

    it('should return false if type does not match schema\'s type', () => {
      [Type.TEMPORAL, Type.QUANTITATIVE, Type.NOMINAL].forEach((type) => {
        encQ.type = type;
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return true if string matches schema\'s type ', () => {
      [Type.ORDINAL].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return false if field does not exist', () => {
      const invalidFieldEncQ = {channel: Channel.X, field: 'random', type: Type.NOMINAL};
      assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesSchemaType'].satisfy(invalidFieldEncQ, schema, stats, defaultOpt));
    });
  });

  describe('typeMatchesPrimitiveType', () => {
    let encQ: EncodingQuery = {
      channel: Channel.X,
      field: 'O',
      type: undefined
    };

    it('should return false if string is used as quantitative or temporal', () => {
      [Type.TEMPORAL, Type.QUANTITATIVE].forEach((type) => {
        encQ.type = type;
        assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return true if string is used as ordinal or nominal ', () => {
      [Type.NOMINAL, Type.ORDINAL].forEach((type) => {
        encQ.type = type;
        assert.isTrue(ENCODING_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(encQ, schema, stats, defaultOpt));
      });
    });

    it('should return false if field does not exist', () => {
      const invalidFieldEncQ = {channel: Channel.X, field: 'random', type: Type.NOMINAL};
      assert.isFalse(ENCODING_CONSTRAINT_INDEX['typeMatchesPrimitiveType'].satisfy(invalidFieldEncQ, schema, stats, defaultOpt));
    });
  });
});
