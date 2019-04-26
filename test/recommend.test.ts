/* tslint:disable:quotemark */

import {assert} from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import {Mark} from 'vega-lite/build/src/mark';
import * as TYPE from 'vega-lite/build/src/type';
import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel, SpecQueryModelGroup} from '../src/model';
import {Property} from '../src/property';
import {Query} from '../src/query/query';
import {getScore} from '../src/ranking/ranking';
import {recommend} from '../src/recommend';
import {getTopResultTreeItem, isResultTree} from '../src/result';
import {duplicate} from '../src/util';
import {SHORT_WILDCARD, Wildcard} from '../src/wildcard';
import {schema} from './fixture';

describe('recommend()', () => {
  it('recommends line for a histogram of a temporal field', () => {
    const group = recommend(
      {
        spec: {
          data: {url: 'data/cars.json'},
          transform: [],
          mark: '?',
          encodings: [
            {
              channel: 'x',
              timeUnit: 'year',
              field: 'T1',
              type: 'temporal'
            },
            {
              channel: 'y',
              field: '*',
              type: 'quantitative',
              aggregate: 'count'
            }
          ],
          config: {
            // "overlay": {"line": true},
            scale: {useUnaggregatedDomain: true}
          }
        },
        groupBy: 'encoding',
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: {autoAddCount: false}
      },
      schema
    );

    assert.equal(getTopResultTreeItem(group.result).getMark(), 'line');
  });

  it('recommends bar chart given 1 nominal field and specifying value for size channel', () => {
    const group = recommend(
      {
        spec: {
          data: {url: 'data/cars.json'},
          mark: '?',
          encodings: [{channel: '?', field: 'Origin', type: 'nominal'}, {channel: 'size', value: 52}]
        },
        nest: [
          {
            groupBy: ['field', 'aggregate', 'bin', 'timeUnit', 'stack'],
            orderGroupBy: 'aggregationQuality'
          },
          {
            groupBy: [
              {
                property: 'channel',
                replace: {
                  x: 'xy',
                  y: 'xy',
                  color: 'style',
                  size: 'style',
                  shape: 'style',
                  opacity: 'style',
                  row: 'facet',
                  column: 'facet'
                }
              }
            ],
            orderGroupBy: 'effectiveness'
          },
          {groupBy: ['channel'], orderGroupBy: 'effectiveness'}
        ],
        orderBy: 'effectiveness',
        config: {autoAddCount: true}
      },
      schema
    );

    assert.equal(getTopResultTreeItem(group.result).getMark(), 'bar');
  });

  it('recommends bar for a histogram of a temporal field', () => {
    const group = recommend(
      {
        spec: {
          data: {url: 'data/cars.json'},
          transform: [],
          mark: '?',
          encodings: [
            {
              channel: 'x',
              bin: true,
              field: 'Q1',
              type: 'quantitative'
            }
          ]
        },
        groupBy: 'encoding',
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: {autoAddCount: true}
      },
      schema
    );

    assert.equal(getTopResultTreeItem(group.result).getMark(), 'bar');
  });

  it('recommends bar for a histogram of a temporal field', () => {
    const group = recommend(
      {
        spec: {
          data: {url: 'data/movies.json'},
          transform: [],
          mark: '?',
          encodings: [
            {
              channel: 'y',
              field: 'title',
              type: 'key'
            }
          ]
        },
        groupBy: 'encoding',
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: {autoAddCount: true}
      },
      schema
    );

    assert.equal(getTopResultTreeItem(group.result).getMark(), 'bar');
  });

  describe('omitAggregatePlotWithoutDimension', () => {
    it('?(Q) x ?(Q) should not produce MEAN(Q)xMEAN(Q) if omitAggregatePlotWithoutDimension is enabled.', () => {
      const q = {
        spec: {
          mark: MARK.POINT,
          encodings: [
            {
              channel: CHANNEL.X,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD,
              field: 'Q',
              type: TYPE.QUANTITATIVE
            },
            {
              channel: CHANNEL.Y,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD,
              field: 'Q1',
              type: TYPE.QUANTITATIVE
            }
          ]
        },
        nest: [
          {
            groupBy: [Property.FIELD, Property.AGGREGATE, Property.BIN, Property.TIMEUNIT]
          }
        ],
        config: {
          autoAddCount: true,
          omitAggregatePlotWithoutDimension: true
        }
      };
      const CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION = {
        ...DEFAULT_QUERY_CONFIG,
        omitAggregatePlotWithoutDimension: true
      };

      const result = recommend(q, schema, CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION).result;
      assert.equal(result.items.length, 6);
    });

    it('?(Q) x ?(Q) should produce MEAN(Q)xMEAN(Q) if omitAggregatePlotWithoutDimension is disabled.', () => {
      const q = {
        spec: {
          mark: MARK.POINT,
          encodings: [
            {
              channel: CHANNEL.X,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD,
              field: 'Q',
              type: TYPE.QUANTITATIVE
            },
            {
              channel: CHANNEL.Y,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD,
              field: 'Q1',
              type: TYPE.QUANTITATIVE
            }
          ]
        },
        nest: [
          {
            groupBy: [Property.FIELD, Property.AGGREGATE, Property.BIN, Property.TIMEUNIT]
          }
        ],
        config: {
          autoAddCount: true,
          omitAggregatePlotWithoutDimension: false
        }
      };
      const CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION = {
        ...DEFAULT_QUERY_CONFIG,
        omitAggregatePlotWithoutDimension: false
      };
      const result = recommend(q, schema, CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION).result;
      assert.equal(result.items.length, 7);
    });
  });

  describe('nested query', () => {
    const q: Query = {
      spec: {
        mark: '?',
        encodings: [{channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE}]
      },
      nest: [{groupBy: 'fieldTransform'}],
      orderBy: 'effectiveness'
    };
    const qCopy = duplicate(q);
    const output = recommend(q, schema);
    const result = output.result;

    it('enumerates a nested query correctly ', () => {
      assert.isTrue(isResultTree(result.items[0]));
      if (isResultTree(result.items[0])) {
        const group1: SpecQueryModelGroup = <SpecQueryModelGroup>result.items[0];
        assert.isFalse(isResultTree(group1.items[0]));
        assert.equal(group1.items.length, 2);
        assert.equal((<SpecQueryModel>group1.items[0]).specQuery.mark, 'tick');
        assert.equal((<SpecQueryModel>group1.items[1]).specQuery.mark, 'point');
      }
    });

    it('should augment wildcard name for wildcards', () => {
      assert.isDefined((output.query.spec.mark as Wildcard<Mark>).name);
    });

    it('should not cause side effect to the original query object.', () => {
      assert.deepEqual(q, qCopy);
    });
  });

  describe('rank', () => {
    it("should sort SpecQueryModelGroup's items when passed orderBy is an array", () => {
      const q: Query = {
        spec: {
          mark: '?',
          encodings: [
            {channel: '?', bin: '?', aggregate: '?', field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: '?', bin: '?', aggregate: '?', field: 'Q1', type: TYPE.QUANTITATIVE}
          ]
        },
        orderBy: ['aggregationQuality', 'effectiveness']
      };

      const output = recommend(q, schema);
      const result = output.result;

      function score(item: any, rankingName: string) {
        return getScore(item, rankingName, schema, DEFAULT_QUERY_CONFIG);
      }

      for (let i = 1; i < result.items.length; i++) {
        let prev = result.items[i - 1];
        let cur = result.items[i];

        assert.isTrue(
          score(prev, 'aggregationQuality') >= score(cur, 'aggregationQuality') ||
            (score(prev, 'aggregationQuality') === score(cur, 'aggregationQuality') &&
              score(prev, 'effectiveness') >= score(cur, 'effectiveness'))
        );
      }
    });
  });

  it('enumerates a flat query correctly ', () => {
    const q: Query = {
      spec: {
        mark: '?',
        encodings: [{channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE}]
      },
      orderBy: 'effectiveness'
    };
    const result = recommend(q, schema).result;
    assert.isFalse(isResultTree(result.items[0]));
    assert.equal(result.items.length, 2);
    assert.equal((<SpecQueryModel>result.items[0]).specQuery.mark, 'tick');
    assert.equal((<SpecQueryModel>result.items[1]).specQuery.mark, 'point');
  });
});
