import {assert} from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import {ScaleType} from 'vega-lite/build/src/scale';
import {TimeUnit} from 'vega-lite/build/src/timeunit';
import {Step} from 'vega-lite/build/src/spec/base';
import * as vegaTime from 'vega-time';
import * as TYPE from 'vega-lite/build/src/type';
import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {generate} from '../src/generate';
import {AutoCountQuery, AxisQuery, FieldQuery, isAutoCountQuery, ScaleQuery} from '../src/query/encoding';
import {SpecQuery} from '../src/query/spec';
import {extend, some} from '../src/util';
import {SHORT_WILDCARD} from '../src/wildcard';
import {schema} from './fixture';

const CONFIG_WITH_AUTO_ADD_COUNT = extend({}, DEFAULT_QUERY_CONFIG, {autoAddCount: true});

describe('generate', function () {
  describe('1D', () => {
    describe('Q with mark=?, channel=size', () => {
      it('should enumerate mark=point and generate a point plot', () => {
        const specQ: SpecQuery = {
          mark: '?',
          encodings: [
            {
              channel: CHANNEL.SIZE,
              field: 'A',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };
        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getMark(), MARK.POINT);
      });
    });

    describe('Q with mark=point, channel=?', () => {
      it('should only enumerate channel x and y', () => {
        const specQ: SpecQuery = {
          mark: MARK.POINT,
          encodings: [
            {
              channel: '?',
              field: 'A',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };
        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
      });

      it('should only enumerate channel x and channel y even if omitNonPositionalOrFacetOverPositionalChannels turned off', () => {
        const specQ: SpecQuery = {
          mark: MARK.POINT,
          encodings: [
            {
              channel: '?',
              field: 'A',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };
        const answerSet = generate(
          specQ,
          schema,
          extend({}, DEFAULT_QUERY_CONFIG, {omitNonPositionalOrFacetOverPositionalChannels: false})
        );
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
      });
    });

    describe('Q with mark=?, channel=column, bin', () => {
      it('should generate point marks', () => {
        const specQ: SpecQuery = {
          mark: '?',
          encodings: [
            {
              channel: CHANNEL.COLUMN,
              field: 'A',
              type: TYPE.QUANTITATIVE,
              bin: {},
            },
          ],
        };
        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getMark(), MARK.POINT);
      });
    });

    describe('Q with mark=?, channel=?', () => {
      it('should enumerate tick or point mark with x or y channel', () => {
        const specQ: SpecQuery = {
          mark: '?',
          encodings: [
            {
              channel: '?',
              field: 'A',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };

        const answerSet = generate(
          specQ,
          schema,
          extend({}, DEFAULT_QUERY_CONFIG, {omitNonPositionalOrFacetOverPositionalChannels: false})
        );
        assert.equal(answerSet.length, 4);

        assert.equal(answerSet[0].getMark(), MARK.POINT);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, CHANNEL.X);
        assert.equal(answerSet[1].getMark(), MARK.TICK);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, CHANNEL.X);
        assert.equal(answerSet[2].getMark(), MARK.POINT);
        assert.equal(answerSet[2].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
        assert.equal(answerSet[3].getMark(), MARK.TICK);
        assert.equal(answerSet[3].getEncodingQueryByIndex(0).channel, CHANNEL.Y);
      });
    });

    describe('Q with aggregate=?, bin=?', () => {
      it('should enumerate raw, bin, aggregate', () => {
        const specQ: SpecQuery = {
          mark: MARK.POINT,
          encodings: [
            {
              channel: CHANNEL.X,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD,
              field: 'Q',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };
        const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        assert.equal(answerSet.length, 3);
      });
    });
  });

  describe('1D raw', () => {
    describe('dotplot', () => {
      it('should generate only a raw dot plot if omitAggregate is enabled.', () => {
        const specQ: SpecQuery = {
          mark: MARK.POINT,
          encodings: [
            {
              aggregate: {name: 'aggregate', enum: [undefined, 'mean']},
              channel: CHANNEL.X,
              field: 'A',
              type: TYPE.QUANTITATIVE,
            },
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
          mark: MARK.POINT,
          encodings: [
            {
              aggregate: {name: 'aggregate', enum: [undefined, 'mean']},
              channel: CHANNEL.X,
              field: 'A',
              type: TYPE.QUANTITATIVE,
            },
          ],
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
      const specQ: SpecQuery = {
        mark: SHORT_WILDCARD,
        encodings: [
          {
            channel: CHANNEL.X,
            field: 'N',
            type: TYPE.NOMINAL,
          },
          {
            channel: CHANNEL.Y,
            field: 'N20',
            type: TYPE.NOMINAL,
          },
        ],
        config: CONFIG_WITH_AUTO_ADD_COUNT,
      };

      const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should return counted heatmaps', () => {
        assert.isTrue(answerSet.length > 0);
        answerSet.forEach((specM) => {
          assert.isTrue(
            some(specM.getEncodings(), (encQ) => {
              return isAutoCountQuery(encQ) && encQ.autoCount === true;
            })
          );
        });
      });

      it('should not use tick, bar, line, area, or rect', () => {
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), MARK.AREA);
          assert.notEqual(specM.getMark(), MARK.LINE);
          assert.notEqual(specM.getMark(), MARK.BAR);
          assert.notEqual(specM.getMark(), MARK.TICK);
        });
      });
    });

    describe('NxO', () => {
      const specQ: SpecQuery = {
        mark: '?',
        encodings: [
          {channel: CHANNEL.Y, field: 'O', type: TYPE.ORDINAL},
          {field: 'N', type: TYPE.NOMINAL, channel: '?'},
        ],
      };

      const answerSet = generate(specQ, schema);

      it('should generate a rect table with x and y as dimensions with autocount turned off', () => {
        answerSet.forEach((specM) => {
          assert.isTrue(
            (specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).type === TYPE.NOMINAL &&
              (specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).type === TYPE.ORDINAL
          );
        });
      });
    });

    describe('QxQ', () => {
      it('should not return any of bar, tick, line, or area', () => {
        const specQ: SpecQuery = {
          mark: SHORT_WILDCARD,
          encodings: [
            {
              channel: CHANNEL.X,
              field: 'Q',
              type: TYPE.QUANTITATIVE,
            },
            {
              channel: CHANNEL.Y,
              field: 'Q1',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };
        const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), MARK.AREA);
          assert.notEqual(specM.getMark(), MARK.LINE);
          assert.notEqual(specM.getMark(), MARK.BAR);
          assert.notEqual(specM.getMark(), MARK.TICK);
        });
      });
    });

    describe('A(Q) x A(Q)', () => {
      it('should return neither line nor area', () => {
        const specQ: SpecQuery = {
          mark: SHORT_WILDCARD,
          encodings: [
            {
              channel: CHANNEL.X,
              aggregate: 'mean',
              field: 'Q',
              type: TYPE.QUANTITATIVE,
            },
            {
              channel: CHANNEL.Y,
              aggregate: 'mean',
              field: 'Q1',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };
        const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        answerSet.forEach((specM) => {
          assert.notEqual(specM.getMark(), MARK.AREA);
          assert.notEqual(specM.getMark(), MARK.LINE);
        });
      });
    });
  });

  describe('3D', () => {
    describe('NxNxQ', () => {
      const specQ: SpecQuery = {
        mark: SHORT_WILDCARD,
        encodings: [
          {
            channel: SHORT_WILDCARD,
            field: 'N',
            type: TYPE.NOMINAL,
          },
          {
            channel: SHORT_WILDCARD,
            field: 'N20',
            type: TYPE.NOMINAL,
          },
          {
            channel: SHORT_WILDCARD,
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };

      const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should not generate a plot with both x and y as dimensions with auto add count enabled', () => {
        answerSet.forEach((specM) => {
          assert.isFalse(
            (specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).type === TYPE.NOMINAL &&
              (specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).type === TYPE.NOMINAL
          );
        });
      });
    });

    describe('NxNxQ with x = N1 and y = N2', () => {
      const specQ: SpecQuery = {
        mark: SHORT_WILDCARD,
        encodings: [
          {
            channel: CHANNEL.X,
            field: 'N',
            type: TYPE.NOMINAL,
          },
          {
            channel: CHANNEL.Y,
            field: 'N20',
            type: TYPE.NOMINAL,
          },
          {
            channel: SHORT_WILDCARD,
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };

      const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);
      it('should generate a rect heatmap with color encoding the quantitative measure', () => {
        answerSet.forEach((specM) => {
          assert.isTrue(
            specM.getMark() === MARK.RECT &&
              (specM.getEncodingQueryByChannel(CHANNEL.COLOR) as FieldQuery).type === TYPE.QUANTITATIVE
          );
        });
      });
    });
  });

  describe('axis-zindex', () => {
    it('should enumerate default axisLayers', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            field: 'Q',
            type: TYPE.QUANTITATIVE,
            axis: {zindex: SHORT_WILDCARD},
          },
        ],
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).axis as AxisQuery).zindex, 1);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).axis as AxisQuery).zindex, 0);
    });
  });

  describe('scale-rangeStep', () => {
    it('should enumerate correct scaleType with width step', () => {
      const specQ = {
        width: {step: 10},
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {
              type: {enum: [undefined, ScaleType.LOG, ScaleType.TIME, ScaleType.POINT]},
            },
            field: 'Q',
            type: TYPE.NOMINAL,
          },
        ],
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POINT);
    });
  });

  describe('scale-exponent', () => {
    it('should enumerate correct scale type when scale clamp is used with scale exponent and TYPE.Quantitative', () => {
      const specQ: SpecQuery = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {
              clamp: true,
              exponent: 1,
              type: {
                enum: [
                  undefined,
                  ScaleType.LINEAR,
                  ScaleType.LOG,
                  ScaleType.POINT,
                  ScaleType.POW,
                  ScaleType.SQRT,
                  // TODO: add these back ScaleType.QUANTILE, ScaleType.QUANTIZE,
                  ScaleType.TIME,
                  ScaleType.UTC,
                ],
              },
            },
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 1);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POW);
    });
  });

  describe('scale-nice', () => {
    it('should enumerate correct scale type when scale nice is used with scale round and TYPE.QUANTITATIVE', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {
              nice: true,
              round: true,
              type: {
                enum: [
                  undefined,
                  ScaleType.LINEAR,
                  ScaleType.LOG,
                  ScaleType.POINT,
                  ScaleType.POW,
                  ScaleType.SQRT,
                  // TODO: add these back ScaleType.QUANTILE, ScaleType.QUANTIZE,
                  ScaleType.TIME,
                  ScaleType.UTC,
                ] as ScaleType[],
              },
            },
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 5);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(
        ((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type,
        ScaleType.LINEAR
      );
      assert.equal(((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal(((answerSet[3].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POW);
      assert.equal(((answerSet[4].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.SQRT);
    });
  });

  describe('scale-zero', () => {
    it('should enumerate correct scale type when scale zero is used without bar mark or binning', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {
              zero: true,
              type: {enum: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.POINT, ScaleType.TIME, ScaleType.UTC]},
            },
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.SQRT);
    });

    it('should enumerate correct scale properties with mark bar', () => {
      const specQ = {
        mark: MARK.BAR,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {
              zero: true,
              type: {enum: [undefined, ScaleType.SQRT, ScaleType.LOG, ScaleType.POINT, ScaleType.TIME, ScaleType.UTC]},
            },
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };
      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.SQRT);
    });
  });

  describe('scale-type', () => {
    it('should enumerate correct scale enabling and scale type for quantitative field', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {
              enum: [true, false],
              type: {enum: [undefined, ScaleType.LOG, ScaleType.UTC]},
            },
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 3);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LOG);
      assert.equal((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).scale, false);
    });

    it('should enumerate correct scale type for quantitative field', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {type: {enum: [undefined, ScaleType.LOG, ScaleType.UTC]}},
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.LOG);
    });

    it('should enumerate correct scale type for temporal field without timeunit', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {type: {enum: [ScaleType.TIME, ScaleType.UTC, ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'T',
            type: TYPE.TEMPORAL,
          },
        ],
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 3);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.TIME);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.UTC);
      assert.equal(((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for temporal field with timeunit', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {type: {enum: [ScaleType.TIME, ScaleType.UTC, ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'T',
            type: TYPE.TEMPORAL,
            timeUnit: vegaTime.MINUTES,
          },
        ],
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
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {type: {enum: [ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'O',
            type: TYPE.ORDINAL,
            timeUnit: vegaTime.MINUTES,
          },
        ],
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POINT);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for ordinal field', () => {
      const specQ: SpecQuery = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: 'x',
            scale: {type: {enum: [ScaleType.POINT, undefined, ScaleType.LOG]}},
            field: 'O',
            type: TYPE.ORDINAL,
          },
        ],
      };

      const answerSet = generate(specQ, schema);
      assert.equal(answerSet.length, 2);
      assert.equal(((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, ScaleType.POINT);
      assert.equal(((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).type, undefined);
    });

    it('should enumerate correct scale type for nominal field', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            scale: {type: {enum: [undefined, ScaleType.LOG]}},
            field: 'N',
            type: TYPE.NOMINAL,
          },
        ],
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
          mark: MARK.BAR,
          encodings: [
            {
              channel: CHANNEL.X,
              bin: {maxbins: {enum: [10, 20, 30]}},
              field: 'Q',
              type: TYPE.QUANTITATIVE,
            },
          ],
        };

        const answerSet = generate(specQ, schema);
        assert.equal(answerSet.length, 3);
        assert.equal((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 10);
        assert.equal((answerSet[1].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 20);
        assert.equal((answerSet[2].getEncodingQueryByIndex(0) as FieldQuery).bin['maxbins'], 30);
      });

      it('should support enumerating both bin enabling and maxbins parameter', () => {
        const specQ = {
          mark: MARK.POINT,
          encodings: [
            {
              channel: CHANNEL.X,
              bin: {
                enum: [true, false],
                maxbins: {enum: [10, 20, 30]},
              },
              field: 'Q',
              type: TYPE.QUANTITATIVE,
            },
          ],
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
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}],
        };
        const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);
        assert.equal(answerSet.length, 1);
        assert.isTrue((answerSet[0].getEncodings()[1] as AutoCountQuery).autoCount);
      });
    });

    describe('non-binned quantitative only', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE}],
      };
      const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should output autoCount=false', () => {
        assert.isFalse((answerSet[0].getEncodingQueryByIndex(1) as AutoCountQuery).autoCount);
      });

      it('should not output duplicate results in the answer set', () => {
        assert.equal(answerSet.length, 1);
      });
    });

    describe('enumerate channel for a non-binned quantitative field', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: {enum: [CHANNEL.X, CHANNEL.SIZE, CHANNEL.COLOR]},
            field: 'Q',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };
      const answerSet = generate(specQ, schema, CONFIG_WITH_AUTO_ADD_COUNT);

      it('should not output point with only size for color', () => {
        answerSet.forEach((model) => {
          model.getEncodings().forEach((encQ) => {
            assert.notEqual(encQ.channel, CHANNEL.COLOR);
            assert.notEqual(encQ.channel, CHANNEL.SIZE);
          });
        });
      });
    });
  });

  describe('stylizer', () => {
    it('should generate answerSet when all stylizers are turned off', () => {
      const specQ = {
        mark: MARK.POINT,
        encodings: [
          {
            channel: CHANNEL.X,
            field: 'A',
            type: TYPE.QUANTITATIVE,
          },
        ],
      };

      const CONFIG_WITHOUT_HIGH_CARDINALITY_OR_FACET = extend(
        {},
        DEFAULT_QUERY_CONFIG,
        {nominalColorScaleForHighCardinality: null},
        {smallRangeStepForHighCardinalityOrFacet: null}
      );

      const answerSet = generate(specQ, schema, CONFIG_WITHOUT_HIGH_CARDINALITY_OR_FACET);
      assert.equal(answerSet.length, 1);
    });

    describe('nominalColorScaleForHighCardinality', () => {
      it('should output range = category20', () => {
        const specQ = {
          mark: MARK.POINT,
          encodings: [
            {
              channel: CHANNEL.COLOR,
              field: 'N20',
              scale: {},
              type: TYPE.NOMINAL,
            },
          ],
        };

        const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.equal(
          ((answerSet[0].getEncodingQueryByIndex(0) as FieldQuery).scale as ScaleQuery).scheme,
          'category20'
        );
      });
    });

    describe('smallRangeStepForHighCardinalityOrFacet', () => {
      it('should output height step = 12', () => {
        const specQ = {
          mark: MARK.BAR,
          encodings: [
            {
              channel: CHANNEL.Y,
              field: 'O_100',
              scale: {},
              type: TYPE.ORDINAL,
            },
          ],
        };

        const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.equal((answerSet[0].specQuery.height as Step).step, 12);
      });

      it('should output height step = 12', () => {
        const specQ = {
          mark: MARK.BAR,
          encodings: [
            {
              channel: CHANNEL.Y,
              field: 'A',
              scale: {},
              type: TYPE.ORDINAL,
            },
            {
              channel: CHANNEL.ROW,
              field: 'A',
              type: TYPE.ORDINAL,
            },
          ],
        };

        const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.equal((answerSet[0].specQuery.height as Step).step, 12);
      });
    });
  });
});
