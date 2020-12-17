import {assert} from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import {TitleParams} from 'vega-lite/build/src/title';
import * as TYPE from 'vega-lite/build/src/type';
import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel, SpecQueryModelGroup} from '../src/model';
import {ENCODING_NESTED_PROPS, ENCODING_TOPLEVEL_PROPS, Property, toKey} from '../src/property';
import {AutoCountQuery, FieldQuery} from '../src/query/encoding';
import {SpecQuery} from '../src/query/spec';
import {FieldSchema, Schema} from '../src/schema';
import {duplicate, extend} from '../src/util';
import {getDefaultEnumValues, isWildcard, SHORT_WILDCARD} from '../src/wildcard';
import {schema} from './fixture';

const DEFAULT_SPEC_CONFIG = DEFAULT_QUERY_CONFIG.defaultSpecConfig;

describe('SpecQueryModel', () => {
  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  describe('build', () => {
    // Mark
    it('should have mark wildcardIndex if mark is a ShortWildcard.', () => {
      const specQ: SpecQuery = {
        mark: SHORT_WILDCARD,
        encodings: []
      };
      const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
      assert.deepEqual(wildcardIndex.mark, {
        name: 'm',
        enum: DEFAULT_QUERY_CONFIG.enum.mark
      });
    });

    it('should have mark wildcardIndex if mark is an Wildcard.', () => {
      const specQ: SpecQuery = {
        mark: {
          enum: [MARK.BAR]
        },
        encodings: []
      };
      const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
      assert.deepEqual(wildcardIndex.mark, {
        name: 'm',
        enum: [MARK.BAR]
      });
    });

    it('should have no mark wildcardIndex if mark is specific.', () => {
      const specQ: SpecQuery = {
        mark: MARK.BAR,
        encodings: []
      };
      const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
      assert.isNotOk(wildcardIndex.mark);
    });

    // TODO: Transform

    // Encoding
    describe('type', () => {
      it('should automatically add type as wildcard and index it', () => {
        const specQ: SpecQuery = {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.X, field: 'A'}]
        };

        const specM = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
        // check if type is wildcard
        assert.isTrue(isWildcard((specM.getEncodingQueryByIndex(0) as FieldQuery).type));
        // check if enumeration specifier index has an index for type
        assert.isOk(specM.wildcardIndex.encodings[0].get('type'));
      });
    });

    const templateSpecQ: SpecQuery = {
      mark: MARK.POINT,
      encodings: [{channel: CHANNEL.X, field: 'a', type: TYPE.QUANTITATIVE}]
    };

    ENCODING_TOPLEVEL_PROPS.forEach(prop => {
      it(`should have ${prop} wildcardIndex if it is a ShortWildcard.`, () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short wildcard
        specQ.encodings[0][prop] = SHORT_WILDCARD;

        const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
        assert.isOk(wildcardIndex.encodingIndicesByProperty.get(prop));
        assert.isOk(wildcardIndex.encodings[0].get(prop));
      });

      it(`should have ${prop} wildcardIndex if it is an Wildcard.`, () => {
        let specQ = duplicate(templateSpecQ);
        // set to a full wildcard
        const enumValues =
          prop === Property.FIELD ? ['A', 'B'] : getDefaultEnumValues(prop, schema, DEFAULT_QUERY_CONFIG);
        specQ.encodings[0][prop] = {
          enum: enumValues
        };

        const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
        assert.isOk(wildcardIndex.encodingIndicesByProperty.get(prop));
        assert.isOk(wildcardIndex.encodings[0].get(prop));
      });

      it(`should not have ${prop} wildcardIndex if it is specific.`, () => {
        let specQ = duplicate(templateSpecQ);
        // do not set to wildcard = make it specific

        const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
        assert.isNotOk(wildcardIndex.encodingIndicesByProperty.get(prop));
        assert.isNotOk(wildcardIndex.encodings[0]);
      });
    });

    ENCODING_NESTED_PROPS.forEach(nestedProp => {
      const propKey = toKey(nestedProp);
      const parent = nestedProp.parent;
      const child = nestedProp.child;

      it(`should have ${propKey} wildcardIndex if it is a ShortWildcard.`, () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short wildcard
        specQ.encodings[0][parent] = {};
        specQ.encodings[0][parent][child] = SHORT_WILDCARD;

        const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
        assert.isOk(wildcardIndex.encodingIndicesByProperty.get(nestedProp));
        assert.isOk(wildcardIndex.encodings[0].get(nestedProp));
      });

      it(`should have ${propKey} wildcardIndex if it is an Wildcard.`, () => {
        let specQ = duplicate(templateSpecQ);
        specQ.encodings[0][parent] = {};
        specQ.encodings[0][parent][child] = {
          enum: getDefaultEnumValues(nestedProp, schema, DEFAULT_QUERY_CONFIG)
        };

        const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
        assert.isOk(wildcardIndex.encodingIndicesByProperty.get(nestedProp));
        assert.isOk(wildcardIndex.encodings[0].get(nestedProp));
      });

      it(`should not have ${propKey} wildcardIndex if it is specific.`, () => {
        let specQ = duplicate(templateSpecQ);

        const wildcardIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).wildcardIndex;
        assert.isNotOk(wildcardIndex.encodingIndicesByProperty.get(nestedProp));
        assert.isNotOk(wildcardIndex.encodings[0]);
      });
    });

    describe('autoCount', () => {
      const specQ: SpecQuery = {
        mark: MARK.POINT,
        encodings: [{channel: CHANNEL.X, field: 'a', type: TYPE.ORDINAL}]
      };
      const model = SpecQueryModel.build(specQ, schema, extend({}, DEFAULT_QUERY_CONFIG, {autoAddCount: true}));

      it('should add new encoding if autoCount is enabled', () => {
        assert.equal(model.specQuery.encodings.length, 2);
        assert.isTrue(isWildcard((model.specQuery.encodings[1] as AutoCountQuery).autoCount));
      });

      it('should add new channel and autoCount to the wildcard', () => {
        assert.equal(model.wildcardIndex.encodingIndicesByProperty.get('autoCount')[0], 1);
        assert.equal(model.wildcardIndex.encodingIndicesByProperty.get('channel')[0], 1);
      });
    });
  });

  describe('channelUsed', () => {
    it('should return true if channel is used for general fieldDef', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE, aggregate: 'max'}]
      });
      assert.isTrue(specM.channelUsed(CHANNEL.X));
    });

    it('should return false if channel is used for general fieldDef', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE, aggregate: 'max'}]
      });
      assert.isFalse(specM.channelUsed(CHANNEL.Y));
    });

    it('should return false if channel is used for disabled autoCount', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, autoCount: false}]
      });
      assert.isFalse(specM.channelUsed(CHANNEL.X));
    });
  });

  describe('isAggregate', () => {
    it('should return false if the query is not aggregated', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}]
      });

      assert.isFalse(specM.isAggregate());
    });

    it('should return true if the query is aggregated', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE, aggregate: 'max'}]
      });

      assert.isTrue(specM.isAggregate());
    });

    it('should return true if the query has autoCount = true', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, autoCount: true}]
      });

      assert.isTrue(specM.isAggregate());
    });
  });

  describe('getEncodings()', () => {
    it('should return correct encodings', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [
          {channel: CHANNEL.Y, value: 5},
          {channel: CHANNEL.COLOR, field: 'a', type: 'quantitative'},
          {channel: CHANNEL.X, autoCount: false}
        ]
      });

      assert.deepEqual(specM.getEncodings(), [
        {channel: CHANNEL.Y, value: 5},
        {channel: CHANNEL.COLOR, field: 'a', type: 'quantitative'}
      ]);
    });
  });

  describe('toSpec', () => {
    it('should not return a Vega-Lite spec if an encoding property is wildcard', () => {
      const specM = buildSpecQueryModel({
        data: {values: [{Q: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encodings: [
          {
            channel: CHANNEL.X,
            field: '?',
            type: TYPE.QUANTITATIVE
          }
        ]
      });

      const spec = specM.toSpec();
      assert.isNull(spec);
    });

    it('should return a Vega-Lite spec if the query is completed', () => {
      const specM = buildSpecQueryModel({
        data: {values: [{Q: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encodings: [
          {
            channel: CHANNEL.X,
            field: 'Q',
            type: TYPE.QUANTITATIVE,
            axis: {orient: 'top', tickCount: 5, title: 'test x channel'}
          },
          {
            channel: CHANNEL.COLOR,
            field: 'Q2',
            type: TYPE.QUANTITATIVE,
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        data: {values: [{Q: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encoding: {
          x: {
            field: 'Q',
            type: TYPE.QUANTITATIVE,
            axis: {orient: 'top', tickCount: 5, title: 'test x channel'}
          },
          color: {
            field: 'Q2',
            type: TYPE.QUANTITATIVE,
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a Vega-Lite spec that does not output inapplicable legend', () => {
      const specM = buildSpecQueryModel({
        data: {values: [{Q: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encodings: [
          {
            channel: CHANNEL.X,
            field: 'Q',
            type: TYPE.QUANTITATIVE,
            axis: {orient: 'top', tickCount: 5, title: 'test x channel'},
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        data: {values: [{Q: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encoding: {
          x: {
            field: 'Q',
            type: TYPE.QUANTITATIVE,
            axis: {orient: 'top', tickCount: 5, title: 'test x channel'}
          }
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a Vega-Lite spec that does not output inapplicable axis', () => {
      const specQ: SpecQuery = {
        data: {values: [{Q: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encodings: [
          {
            channel: CHANNEL.COLOR,
            field: 'Q2',
            type: TYPE.QUANTITATIVE,
            axis: {orient: 'top', tickCount: 5, title: 'test x channel'},
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        ]
      };
      const specM = buildSpecQueryModel(specQ);

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        data: {values: [{Q: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encoding: {
          color: {
            field: 'Q2',
            type: TYPE.QUANTITATIVE,
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a spec with no bin if the bin=false.', () => {
      const specM = buildSpecQueryModel({
        data: {values: [{Q: 1}]},
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, bin: false, field: 'Q', type: TYPE.QUANTITATIVE}]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        data: {values: [{Q: 1}]},
        mark: MARK.BAR,
        encoding: {
          x: {field: 'Q', type: TYPE.QUANTITATIVE}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it(
      'should return a spec with the domain specified in FieldSchema if the encoding query ' +
        'already has scale but does not have domain',
      () => {
        const specM = SpecQueryModel.build(
          {
            data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
            mark: MARK.BAR,
            encodings: [
              {channel: CHANNEL.X, field: 'A', type: TYPE.ORDINAL, scale: {}},
              {channel: CHANNEL.Y, field: 'B', type: TYPE.QUANTITATIVE}
            ]
          },
          new Schema({
            fields: [
              {
                name: 'A',
                vlType: 'ordinal',
                type: 'string' as any,
                ordinalDomain: ['S', 'M', 'L'],
                stats: {
                  distinct: 3
                }
              },
              {
                name: 'B',
                vlType: 'quantitative',
                type: 'number' as any,
                stats: {
                  distinct: 3
                }
              }
            ] as FieldSchema[]
          }),
          DEFAULT_QUERY_CONFIG
        );

        const spec = specM.toSpec();
        assert.deepEqual(spec, {
          data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
          mark: MARK.BAR,
          encoding: {
            x: {field: 'A', type: TYPE.ORDINAL, scale: {domain: ['S', 'M', 'L']}},
            y: {field: 'B', type: TYPE.QUANTITATIVE}
          },
          config: DEFAULT_SPEC_CONFIG
        });
      }
    );

    it(
      'should return a spec with the domain specified in FieldSchema if the encoding query ' +
        'already has scale set to true',
      () => {
        const specM = SpecQueryModel.build(
          {
            data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
            mark: MARK.BAR,
            encodings: [
              {channel: CHANNEL.X, field: 'A', type: TYPE.ORDINAL, scale: true},
              {channel: CHANNEL.Y, field: 'B', type: TYPE.QUANTITATIVE}
            ]
          },
          new Schema({
            fields: [
              {
                name: 'A',
                vlType: 'ordinal',
                type: 'string' as any,
                ordinalDomain: ['S', 'M', 'L'],
                stats: {
                  distinct: 3
                }
              },
              {
                name: 'B',
                vlType: 'quantitative',
                type: 'number' as any,
                stats: {
                  distinct: 3
                }
              }
            ] as FieldSchema[]
          }),
          DEFAULT_QUERY_CONFIG
        );

        const spec = specM.toSpec();
        assert.deepEqual(spec, {
          data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
          mark: MARK.BAR,
          encoding: {
            x: {field: 'A', type: TYPE.ORDINAL, scale: {domain: ['S', 'M', 'L']}},
            y: {field: 'B', type: TYPE.QUANTITATIVE}
          },
          config: DEFAULT_SPEC_CONFIG
        });
      }
    );

    it(
      'should return a spec with the domain specified in FieldSchema if the encoding query scale is undefined',
      () => {
        const specM = SpecQueryModel.build(
          {
            data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
            mark: MARK.BAR,
            encodings: [
              {channel: CHANNEL.X, field: 'A', type: TYPE.ORDINAL},
              {channel: CHANNEL.Y, field: 'B', type: TYPE.QUANTITATIVE}
            ]
          },
          new Schema({
            fields: [
              {
                name: 'A',
                vlType: 'ordinal',
                type: 'string' as any,
                ordinalDomain: ['S', 'M', 'L'],
                stats: {
                  distinct: 3
                }
              },
              {
                name: 'B',
                vlType: 'quantitative',
                type: 'number' as any,
                stats: {
                  distinct: 3
                }
              }
            ] as FieldSchema[]
          }),
          DEFAULT_QUERY_CONFIG
        );

        const spec = specM.toSpec();
        assert.deepEqual(spec, {
          data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
          mark: MARK.BAR,
          encoding: {
            x: {field: 'A', type: TYPE.ORDINAL, scale: {domain: ['S', 'M', 'L']}},
            y: {field: 'B', type: TYPE.QUANTITATIVE}
          },
          config: DEFAULT_SPEC_CONFIG
        });
      }
    );

    it('should return a spec with the domain that is already set in an Encoding Query', () => {
      const specM = SpecQueryModel.build(
        {
          data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
          mark: MARK.BAR,
          encodings: [
            {channel: CHANNEL.X, field: 'A', type: TYPE.ORDINAL, scale: {domain: ['L', 'M', 'S']}},
            {channel: CHANNEL.Y, field: 'B', type: TYPE.QUANTITATIVE}
          ]
        },
        new Schema({
          fields: [
            {
              name: 'A',
              vlType: 'ordinal',
              type: 'string' as any,
              ordinalDomain: ['S', 'M', 'L'],
              stats: {
                distinct: 3
              }
            },
            {
              name: 'B',
              vlType: 'quantitative',
              type: 'number' as any,
              stats: {
                distinct: 3
              }
            }
          ] as FieldSchema[]
        }),
        DEFAULT_QUERY_CONFIG
      );

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        data: {values: [{A: 'L', B: 4}, {A: 'S', B: 2}, {A: 'M', B: 42}]},
        mark: MARK.BAR,
        encoding: {
          x: {field: 'A', type: TYPE.ORDINAL, scale: {domain: ['L', 'M', 'S']}},
          y: {field: 'B', type: TYPE.QUANTITATIVE}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a spec with bin as object if the bin has no parameter.', () => {
      const specM = buildSpecQueryModel({
        data: {values: [{Q: 1}]},
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, bin: {maxbins: 50}, field: 'Q', type: TYPE.QUANTITATIVE}]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        data: {values: [{Q: 1}]},
        mark: MARK.BAR,
        encoding: {
          x: {bin: {maxbins: 50}, field: 'Q', type: TYPE.QUANTITATIVE}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a correct Vega-Lite spec if the query has sort: SortOrder', () => {
      const specM = buildSpecQueryModel({
        data: {values: [{Q: 1, O: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encodings: [
          {channel: CHANNEL.X, field: 'Q', aggregate: 'mean', type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.Y, field: 'O', sort: {field: 'Q', op: 'mean', order: 'ascending'}, type: TYPE.ORDINAL}
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        data: {values: [{Q: 1, O: 1}]},
        transform: [{filter: 'datum.Q===1'}],
        mark: MARK.BAR,
        encoding: {
          x: {field: 'Q', aggregate: 'mean', type: TYPE.QUANTITATIVE},
          y: {field: 'O', sort: {field: 'Q', op: 'mean', order: 'ascending'}, type: TYPE.ORDINAL}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a correct Vega-Lite spec if the query has autoCount=true', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [
          {channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL},
          {channel: CHANNEL.Y, autoCount: true, type: TYPE.QUANTITATIVE}
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        mark: MARK.BAR,
        encoding: {
          x: {field: 'O', type: TYPE.ORDINAL},
          y: {aggregate: 'count', field: '*', type: TYPE.QUANTITATIVE}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a correct Vega-Lite spec if the query has autoCount=false', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}, {channel: CHANNEL.Y, autoCount: false}]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        mark: MARK.BAR,
        encoding: {
          x: {field: 'O', type: TYPE.ORDINAL}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a correct Vega-Lite spec if the query has autoCount=false even if channel is unspecified', () => {
      // Basically, we no longer enumerate ambiguous channel autoCount is false.
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}, {channel: SHORT_WILDCARD, autoCount: false}]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        mark: MARK.BAR,
        encoding: {
          x: {field: 'O', type: TYPE.ORDINAL}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return null if the query is incompleted', () => {
      const specM = buildSpecQueryModel({
        mark: {enum: [MARK.BAR, MARK.POINT]},
        encodings: [{channel: CHANNEL.X, field: 'A', type: TYPE.QUANTITATIVE}],
        config: DEFAULT_SPEC_CONFIG
      });

      assert.isNull(specM.toSpec());
    });

    it('should not output spec with inapplicable scale, sort, axis / legend ', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, bin: {maxbins: '?'}, field: 'A', type: TYPE.QUANTITATIVE}]
      });

      assert.isNull(specM.toSpec());
    });

    it('should return a spec with width and height specified', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        width: 100,
        height: 120,
        encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}]
      });

      assert.equal(specM.toSpec().width, 100);
      assert.equal(specM.toSpec().height, 120);
    });

    it('should return a spec with background color as specified', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        background: 'black',
        encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}]
      });

      assert.equal(specM.toSpec().background, 'black');
    });

    it('should return a spec with padding as specified', () => {
      const specM = buildSpecQueryModel({
        mark: MARK.BAR,
        padding: {
          left: 1,
          top: 2,
          right: 3,
          bottom: 4
        },
        encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}]
      });

      assert.deepEqual(specM.toSpec().padding, {left: 1, top: 2, right: 3, bottom: 4});
    });

    it('should return a spec with a title string specified', () => {
      const specM = buildSpecQueryModel({
        title: 'Big Title',
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}]
      });

      assert.equal(specM.toSpec().title, 'Big Title');
    });

    it('should return a spec with a title params specified', () => {
      const specM = buildSpecQueryModel({
        title: {
          text: 'A Simple Bar Chart',
          anchor: 'start'
        },
        mark: MARK.BAR,
        encodings: [{channel: CHANNEL.X, field: 'O', type: TYPE.ORDINAL}]
      });

      const title = specM.toSpec().title as TitleParams<any>;
      assert.equal(title.text, 'A Simple Bar Chart');
      assert.equal(title.anchor, 'start');
    });
  });
});

describe('SpecQueryModelGroup', () => {
  describe('constructor', () => {
    const group: SpecQueryModelGroup = {
      name: '',
      path: '',
      items: []
    };

    it('should have default values', () => {
      assert.equal(group.name, '');
      assert.equal(group.path, '');
      assert.isArray(group.items);
      assert.deepEqual(group.items, []);
      assert.equal(group.groupBy, undefined);
      assert.equal(group.orderGroupBy, undefined);
    });
  });
});
