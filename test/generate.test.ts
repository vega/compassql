import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {generate} from '../src/generate';
import {ScaleQuery} from '../src/query/encoding';
import {SHORT_ENUM_SPEC} from '../src/enumspec';
import {extend, some} from '../src/util';

import {schema} from './fixture';

const CONFIG_WITH_AUTO_ADD_COUNT = extend({}, DEFAULT_QUERY_CONFIG, {autoAddCount: true});

describe('generate', function () {
  describe('1D', () => {
    describe('Q with aggregate=?, bin=?', () => {
      it('should enumerate raw, bin, aggregate', () => {
        const query = {
          mark: Mark.POINT,
          encodings: [{
            channel: Channel.X,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        assert.equal(answerSet.length, 3);
      });
    });
  });

  describe('2D', () => {
    describe('x:N,y:N', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'N',
          type: Type.NOMINAL
        },{
          channel: Channel.Y,
          field: 'N20',
          type: Type.NOMINAL
        }],
        config: CONFIG_WITH_AUTO_ADD_COUNT
      };

      const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should return counted heatmaps', () => {
        assert.isTrue(answerSet.length > 0);
        answerSet.forEach((specM) => {
          assert.isTrue(some(specM.getEncodings(), (encQ) => {
            return encQ.autoCount === true;
          }));
        });
      });

      it('should not use tick, bar, line or area', () => {
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), Mark.AREA);
          assert.notEqual(specM.getMark(), Mark.LINE);
          assert.notEqual(specM.getMark(), Mark.BAR);
          assert.notEqual(specM.getMark(), Mark.TICK);
        });
      });
    });

    describe('QxQ', () => {
      it('should not return any of bar, tick, line, or area', () => {
        const query = {
          mark: SHORT_ENUM_SPEC,
          encodings: [{
            channel: Channel.X,
            field: 'Q',
            type: Type.QUANTITATIVE
          },{
            channel: Channel.Y,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), Mark.AREA);
          assert.notEqual(specM.getMark(), Mark.LINE);
          assert.notEqual(specM.getMark(), Mark.BAR);
          assert.notEqual(specM.getMark(), Mark.TICK);
        });
      });
    });

    describe('A(Q) x A(Q)', () => {
      it('should return neither line nor area', () => {
        const query = {
          mark: SHORT_ENUM_SPEC,
          encodings: [{
            channel: Channel.X,
            aggregate: AggregateOp.MEAN,
            field: 'Q',
            type: Type.QUANTITATIVE
          },{
            channel: Channel.Y,
            aggregate: AggregateOp.MEAN,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), Mark.AREA);
          assert.notEqual(specM.getMark(), Mark.LINE);
        });
      });
    });
  });

  describe('3D', () => {
    describe('NxNxQ', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: SHORT_ENUM_SPEC,
          field: 'N',
          type: Type.NOMINAL
        },{
          channel: SHORT_ENUM_SPEC,
          field: 'N20',
          type: Type.NOMINAL
        },{
          channel: SHORT_ENUM_SPEC,
          field: 'Q',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema);

      it('should return not generate a plot with both x and y as dimensions.', () => {
        answerSet.forEach((specM) => {
          assert.isFalse(
            specM.getEncodingQueryByChannel(Channel.X).type === Type.NOMINAL &&
            specM.getEncodingQueryByChannel(Channel.Y).type === Type.NOMINAL
          );
        });
      });
    });
  });

  describe('scale-bandSize', () => {
    it('should enumerate correct scaleType with bandSize', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              bandSize: 10,
              type: {values: [undefined, ScaleType.LOG, ScaleType.TIME, ScaleType.ORDINAL]}
            },
            field: 'Q',
            type: Type.NOMINAL
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.ORDINAL);
    });
  });

  describe('scale-clamp', () => {
    it('should enumerate correct scale type when scale clamp is used with scale exponent and Type.Quantitative', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              clamp: true,
              exponent: [1,2],
              type: {values: [undefined, ScaleType.LINEAR, ScaleType.LOG, ScaleType.ORDINAL,
                              ScaleType.POW, ScaleType.QUANTILE, ScaleType.QUANTIZE, ScaleType.SQRT,
                              ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.POW);
    });
  });

  describe('scale-nice', () => {
    it('should enuemrate correct scale type when scale nice is used with scale round and Type.QUANTITATIVE', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              nice: true,
              round: true,
              type: {values: [undefined, ScaleType.LINEAR, ScaleType.LOG, ScaleType.ORDINAL,
                              ScaleType.POW, ScaleType.QUANTILE, ScaleType.QUANTIZE, ScaleType.SQRT,
                              ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 4);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.LINEAR);
      assert.equal((answerSet[2].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal((answerSet[3].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.POW);
    });
  });

  describe('scale-zero', () => {
    it('should enumerate correct scale type when scale zero is used without bar mark or binning', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              zero: true,
              type: {values: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.ORDINAL, ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.SQRT);
    });

    it('should enumerate correct scale properties with mark bar', () => {
      const specQ = {
        mark: Mark.BAR,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              zero: true,
              type: {values: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.ORDINAL, ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.SQRT);
    });

    it('should enumerate correct scale properties with binned field and scale zero', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            bin: true,
            channel: Channel.X,
            scale: {
              zero: true,
              type: {values: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.ORDINAL, ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);

      /* note for future developer:
        You might expect this answerset to be completely empty since there is a constraint that prevents bin and zero from working together,
        however if you look inside generate() you'll see that we only call omitScaleZeroWithBinnedField, which requires Property.BIN and Property.SCALE_ZERO,
        if at least one of the properties is enumerated. Since they're true values they don't run through.
      */
      assert.equal(answerSet.length, 1);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale properties with binned field, scale zero, and bar mark', () => {
      const specQ = {
        mark: Mark.BAR,
        encodings: [
          {
            bin: true,
            channel: Channel.X,
            scale: {
              zero: true,
              type: {values: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.ORDINAL, ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 1);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
    });
  });

  describe('scale-type', () => {
    it('should enumerate correct scale enabling and scale type for quantitative field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              values: [true, false],
              type: {values: [undefined, ScaleType.LOG, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 3);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal(answerSet[2].getEncodingQueryByIndex(0).scale, false);
    });

    it('should enumerate correct scale type for quantitative field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {values: [undefined, ScaleType.LOG, ScaleType.UTC]}},
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.LOG);
    });

    it('should enumerate correct scale type for temporal field without timeunit', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {values: [ScaleType.TIME, ScaleType.UTC, ScaleType.ORDINAL, undefined, ScaleType.LOG]}},
            field: 'T',
            type: Type.TEMPORAL
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 3);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.TIME);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.UTC);
      assert.equal((answerSet[2].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for temporal field with timeunit', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {values: [ScaleType.TIME, ScaleType.UTC, ScaleType.ORDINAL, undefined, ScaleType.LOG]}},
            field: 'T',
            type: Type.TEMPORAL,
            timeUnit: TimeUnit.MINUTES
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 4);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.TIME);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.UTC);
      assert.equal((answerSet[2].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.ORDINAL);
      assert.equal((answerSet[3].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for ordinal field with timeunit', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {values: [ScaleType.ORDINAL, undefined, ScaleType.LOG]}},
            field: 'O',
            type: Type.ORDINAL,
            timeUnit: TimeUnit.MINUTES
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.ORDINAL);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for ordinal field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {values: [ScaleType.ORDINAL, ScaleType.QUANTILE, undefined, ScaleType.LOG]}},
            field: 'O',
            type: Type.ORDINAL
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, ScaleType.ORDINAL);
      assert.equal((answerSet[1].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for nominal field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {values: [undefined, ScaleType.LOG]}},
            field: 'N',
            type: Type.NOMINAL
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 1);
      assert.equal((answerSet[0].getEncodingQueryByIndex(0).scale as ScaleQuery).type, undefined);
    });
  });

  describe('bin-maxbins', () => {
    describe('Qx#', () => {
      it('should enumerate multiple maxbins parameter', () => {
        const specQ = {
          mark: Mark.BAR,
          encodings: [
            {
              channel: Channel.X,
              bin: {maxbins: {values: [10, 20, 30]}},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        };

        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 3);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin['maxbins'], 10);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin['maxbins'], 20);
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).bin['maxbins'], 30);
      });

      it('should support enumerating both bin enabling and maxbins parameter', () => {
        const specQ = {
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              bin: {
                values: [true, false],
                maxbins: {values: [10, 20, 30]}
              },
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        };

        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 4);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).bin['maxbins'], 10);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).bin['maxbins'], 20);
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).bin['maxbins'], 30);
        assert.equal(answerSet[3].getEncodingQueryByIndex(0).bin, false);
      });
    });
  });

  describe('autoAddCount', () => {
    describe('ordinal only', () => {
      it('should output autoCount in the answer set', () => {
        const query = {
          mark: Mark.POINT,
          encodings: [
              { channel: Channel.X, field: 'O', type: Type.ORDINAL},
          ]
        };
        const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        assert.equal(answerSet.length, 1);
        assert.isTrue(answerSet[0].getEncodings()[1].autoCount);
      });
    });

    describe('non-binned quantitative only', () => {
      const query = {
        mark: Mark.POINT,
        encodings: [
          { channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
        ]
      };
      const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should output autoCount=false', () => {
        assert.isFalse(answerSet[0].getEncodingQueryByIndex(1).autoCount);
      });

      it('should not output duplicate results in the answer set', () => {
        assert.equal(answerSet.length, 1);
      });
    });

    describe('enumerate channel for a non-binned quantitative field', () => {
      const query = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: {values: [Channel.X, Channel.SIZE, Channel.COLOR]},
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should not output point with only size for color', () => {
        answerSet.forEach((model) => {
          model.getEncodings().forEach((encQ) => {
            assert.notEqual(encQ.channel, Channel.COLOR);
            assert.notEqual(encQ.channel, Channel.SIZE);
          });
        });
      });
    });
  });
});
