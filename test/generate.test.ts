import {assert} from 'chai';


import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {generate} from '../src/generate';
import {AxisQuery, ScaleQuery, FieldQuery, isFieldQuery} from '../src/query/encoding';
import {SHORT_WILDCARD} from '../src/wildcard';
import {extend, some} from '../src/util';

import {schema} from './fixture';
import {SpecQuery} from '../src/query/spec';

const CONFIG_WITH_AUTO_ADD_COUNT = extend({}, DEFAULT_QUERY_CONFIG, {autoAddCount: true});

describe('generate', function () {
  describe('1D', () => {
    describe('Q with mark=?, channel=size', () => {
      it('should enumerate mark=point and generate a point plot', () => {
        const query = {
          mark: '?',
          encodings: [{
            channel: Channel.SIZE,
            field: 'A',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getMark(), Mark.POINT);
      });
    });

    describe('Q with mark=point, channel=?', () => {
      it('should only enumerate channel x and y', () => {
        const query = {
          mark: Mark.POINT,
          encodings: [{
            channel: '?',
            field: 'A',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, Channel.Y);
      });

      it('should only enumerate channel x and channel y even if omitNonPositionalOrFacetOverPositionalChannels turned off', () => {
        const query = {
          mark: Mark.POINT,
          encodings: [{
            channel: '?',
            field: 'A',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, extend({}, DEFAULT_QUERY_CONFIG, {omitNonPositionalOrFacetOverPositionalChannels: false}));
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, Channel.Y);
      });
    });

    describe('Q with mark=?, channel=column, bin', () => {
      it('should generate point marks', () => {
        const query = {
          mark: '?',
          encodings: [{
            channel: Channel.COLUMN,
            field: 'A',
            type: Type.QUANTITATIVE,
            bin: {}
          }]
        };
        const answerSet = generate(query, schema);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getMark(), Mark.POINT);
      });
    });

    describe('Q with mark=?, channel=?', () => {
      it('should enumerate tick or point mark with x or y channel', () => {
        const query = {
          mark: '?',
          encodings: [{
            channel: '?',
            field: 'A',
            type: Type.QUANTITATIVE
          }]
        };

        const answerSet = generate(query, schema, extend({}, DEFAULT_QUERY_CONFIG, {omitNonPositionalOrFacetOverPositionalChannels: false}));
        assert.equal(answerSet.length, 4);

        assert.equal(answerSet[0].getMark(), Mark.POINT);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[1].getMark(), Mark.TICK);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[2].getMark(), Mark.POINT);
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).channel, Channel.Y);
        assert.equal(answerSet[3].getMark(), Mark.TICK);
        assert.equal(answerSet[3].getEncodingQueryByIndex(0).channel, Channel.Y);
      });
    });

    describe('Q with aggregate=?, bin=?', () => {
      it('should enumerate raw, bin, aggregate', () => {
        const query = {
          mark: Mark.POINT,
          encodings: [{
            channel: Channel.X,
            bin: SHORT_WILDCARD,
            aggregate: SHORT_WILDCARD,
            field: 'Q',
            type: Type.QUANTITATIVE
          }]
        };
        const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        assert.equal(answerSet.length, 3);
      });
    });
  });

  describe('1D raw', () => {
    describe('dotplot', () => {
      it('should generate only a raw dot plot if omitAggregate is enabled.', () => {
        const specQ: SpecQuery = {
          mark: Mark.POINT,
          encodings: [
            {aggregate: {name: 'aggregate', enum: [undefined, 'mean']}, channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
          ],
        };
        const CONFIG_WITH_OMIT_AGGREGATE = extend({}, DEFAULT_QUERY_CONFIG, {omitAggregate: true});
        const answerSet = generate(specQ, schema, CONFIG_WITH_OMIT_AGGREGATE);
        assert.equal(answerSet.length, 1);
        assert.equal((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).aggregate, undefined);
      });
    });
  });

  describe('1D aggregate', () => {
    describe('dotplot with mean + histogram', () => {
      it('should generate only an aggregate dot plot if omitRaw is enabled.', () => {
        const specQ: SpecQuery = {
          mark: Mark.POINT,
          encodings: [
            {aggregate: {name:'aggregate', enum: [undefined, 'mean']}, channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          ]
        };
        const CONFIG_WITH_OMIT_RAW = extend({}, DEFAULT_QUERY_CONFIG, {omitRaw: true});
        const answerSet = generate(specQ, schema, CONFIG_WITH_OMIT_RAW);
        assert.equal(answerSet.length, 1);
        assert.equal((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).aggregate, 'mean');
      });
    });
  });

  describe('2D', () => {
    describe('x:N,y:N', () => {
      const query = {
        mark: SHORT_WILDCARD,
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
            return isFieldQuery(encQ) && encQ.autoCount === true;
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

    describe('NxO', () => {
      const query = {
        mark: '?',
        encodings: [
          {channel: Channel.Y, field: 'O', type: Type.ORDINAL},
          {field: 'N', type: Type.NOMINAL, channel: '?'}
        ]
      };

      const answerSet = generate(query, schema);

      it('should generate a table with x and y as dimensions with autocount turned off', () => {
        answerSet.forEach((specM) => {
          assert.isTrue(
            (specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).type === Type.NOMINAL &&
            (specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).type === Type.ORDINAL
          );
        });
      });
    });

    describe('QxQ', () => {
      it('should not return any of bar, tick, line, or area', () => {
        const query = {
          mark: SHORT_WILDCARD,
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
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            aggregate: 'mean',
            field: 'Q',
            type: Type.QUANTITATIVE
          },{
            channel: Channel.Y,
            aggregate: 'mean',
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
        mark: SHORT_WILDCARD,
        encodings: [{
          channel: SHORT_WILDCARD,
          field: 'N',
          type: Type.NOMINAL
        },{
          channel: SHORT_WILDCARD,
          field: 'N20',
          type: Type.NOMINAL
        },{
          channel: SHORT_WILDCARD,
          field: 'Q',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should not generate a plot with both x and y as dimensions with auto add count enabled', () => {
        answerSet.forEach((specM) => {
          assert.isFalse(
            (specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).type === Type.NOMINAL &&
            (specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).type === Type.NOMINAL
          );
        });
      });
    });
  });

  describe('axis-zindex', () => {
    it('should enumerate default axisLayers', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            field: 'Q',
            type: Type.QUANTITATIVE,
            axis: {zindex: SHORT_WILDCARD}
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).axis as AxisQuery).zindex, 1);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).axis as AxisQuery).zindex, 0);
    });
  });

  describe('scale-rangeStep', () => {
    it('should enumerate correct scaleType with rangeStep', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              rangeStep: 10,
              type: {enum: [undefined, ScaleType.LOG, ScaleType.TIME, ScaleType.POINT]}
            },
            field: 'Q',
            type: Type.NOMINAL
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POINT);
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
              type: {enum: [undefined, ScaleType.LINEAR, ScaleType.LOG, ScaleType.POINT,
                            ScaleType.POW, ScaleType.SQRT,
                            // TODO: add these back ScaleType.QUANTILE, ScaleType.QUANTIZE,
                            ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POW);
    });
  });

  describe('scale-nice', () => {
    it('should enumerate correct scale type when scale nice is used with scale round and Type.QUANTITATIVE', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              nice: true,
              round: true,
              type: {enum: [undefined, ScaleType.LINEAR, ScaleType.LOG, ScaleType.POINT,
                            ScaleType.POW, ScaleType.SQRT,
                            // TODO: add these back ScaleType.QUANTILE, ScaleType.QUANTIZE,
                            ScaleType.TIME, ScaleType.UTC] as ScaleType[]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 5);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LINEAR);
      assert.equal(((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal(((answerSet[3].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POW);
      assert.equal(((answerSet[4].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.SQRT);
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
              type: {enum: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.POINT, ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.SQRT);
    });

    it('should enumerate correct scale properties with mark bar', () => {
      const specQ = {
        mark: Mark.BAR,
        encodings: [
          {
            channel: Channel.X,
            scale: {
              zero: true,
              type: {enum: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.POINT, ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.SQRT);
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
              type: {enum: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.POINT, ScaleType.TIME, ScaleType.UTC]}
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
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
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
              type: {enum: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.POINT, ScaleType.TIME, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 1);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
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
              enum: [true, false],
              type: {enum: [undefined, ScaleType.LOG, ScaleType.UTC]}
            },
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 3);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).scale, false);
    });

    it('should enumerate correct scale type for quantitative field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {enum: [undefined, ScaleType.LOG, ScaleType.UTC]}},
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LOG);
    });

    it('should enumerate correct scale type for temporal field without timeunit', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {enum: [ScaleType.TIME, ScaleType.UTC, ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'T',
            type: Type.TEMPORAL
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 3);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.TIME);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.UTC);
      assert.equal(((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for temporal field with timeunit', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {enum: [ScaleType.TIME, ScaleType.UTC, ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'T',
            type: Type.TEMPORAL,
            timeUnit: TimeUnit.MINUTES
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 4);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.TIME);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.UTC);
      assert.equal(((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POINT);
      assert.equal(((answerSet[3].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for ordinal field with timeunit', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {enum: [ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'O',
            type: Type.ORDINAL,
            timeUnit: TimeUnit.MINUTES
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POINT);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for ordinal field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: 'x',
            scale: {type: {enum: [ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'O',
            type: Type.ORDINAL
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POINT);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for nominal field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            scale: {type: {enum: [undefined, ScaleType.LOG]}},
            field: 'N',
            type: Type.NOMINAL
          }
        ]
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 1);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
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
              bin: {maxbins: {enum: [10, 20, 30]}},
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        };

        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 3);
        assert.equal((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 10);
        assert.equal((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 20);
        assert.equal((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 30);
      });

      it('should support enumerating both bin enabling and maxbins parameter', () => {
        const specQ = {
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.X,
              bin: {
                enum: [true, false],
                maxbins: {enum: [10, 20, 30]}
              },
              field: 'Q',
              type: Type.QUANTITATIVE
            }
          ]
        };

        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 4);
        assert.equal((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 10);
        assert.equal((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 20);
        assert.equal((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 30);
        assert.equal((answerSet[3].getEncodingQueryByIndex(0) as FieldQuery).bin, false);
      });
    });
  });

  describe('autoAddCount', () => {
    describe('ordinal only', () => {
      it('should output autoCount in the answer set', () => {
        const specQ = {
          mark: Mark.POINT,
          encodings: [
              { channel: Channel.X, field: 'O', type: Type.ORDINAL},
          ]
        };
        const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        assert.equal(answerSet.length, 1);
        assert.isTrue((answerSet[0].getEncodings()[1] as FieldQuery).autoCount);
      });
    });

    describe('non-binned quantitative only', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          { channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
        ]
      };
      const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should output autoCount=false', () => {
        assert.isFalse((answerSet[0].getEncodingQueryByIndex(1) as FieldQuery).autoCount);
      });

      it('should not output duplicate results in the answer set', () => {
        assert.equal(answerSet.length, 1);
      });
    });

    describe('enumerate channel for a non-binned quantitative field', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: {enum: [Channel.X, Channel.SIZE, Channel.COLOR]},
            field: 'Q',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);

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

  describe('stylizer', () => {
    it('should generate answerSet when all stylizers are turned off', () => {
      const specQ = {
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            field: 'A',
            type: Type.QUANTITATIVE
          }
        ]
      };

      const CONFIG_WITHOUT_HIGH_CARDINALITY_OR_FACET = extend(
        {}, DEFAULT_QUERY_CONFIG, {nominalColorScaleForHighCardinality: null}, {smallRangeStepForHighCardinalityOrFacet: null});

      const answerSet = generate(specQ, schema, CONFIG_WITHOUT_HIGH_CARDINALITY_OR_FACET);
      assert.equal(answerSet.length, 1);
    });

    describe('nominalColorScaleForHighCardinality', () => {
      it('should output range = category20', () => {
        const specQ = {
          mark: Mark.POINT,
          encodings: [
            {
              channel: Channel.COLOR,
              field: 'N20',
              scale: {},
              type: Type.NOMINAL
            }
          ]
        };

        const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).range, 'category20');
      });
    });

    describe('smallRangeStepForHighCardinalityOrFacet', () => {
      it('should output rangeStep = 12', () => {
        const specQ = {
          mark: Mark.BAR,
          encodings: [
            {
              channel: Channel.Y,
              field: 'O_100',
              scale: {},
              type: Type.ORDINAL
            }
          ]
        };

        const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
      });

      it('should output rangeStep = 12', () => {
        const specQ = {
          mark: Mark.BAR,
          encodings: [
            {
              channel: Channel.Y,
              field: 'A',
              scale: {},
              type: Type.ORDINAL
            },
            {
              channel: Channel.ROW,
              field: 'A',
              type: Type.ORDINAL
            }
          ]
        };

        const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
      });
    });
  });
});
