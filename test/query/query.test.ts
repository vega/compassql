import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';
import {assert} from 'chai';

import {schema} from '../fixture';

import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {Wildcard, SHORT_WILDCARD} from '../../src/wildcard';
import {SpecQueryModel, SpecQueryModelGroup} from '../../src/model';
import {Property} from '../../src/property';
import {normalize, query, Query} from '../../src/query/query';
import {getScore} from '../../src/ranking/ranking';
import {duplicate, extend} from '../../src/util';

describe('query/query', () => {
  describe('query()', () => {
    describe('omitAggregatePlotWithoutDimension', () => {
      it('?(Q) x ?(Q) should not produce MEAN(Q)xMEAN(Q) if omitAggregatePlotWithoutDimension is enabled.', () => {
        const q = {
          spec: {
            mark: Mark.POINT,
            encodings:[
              {
                channel: Channel.X,
                bin: SHORT_WILDCARD,
                aggregate: SHORT_WILDCARD,
                field: 'Q',
                type: Type.QUANTITATIVE
              },
              {
                channel: Channel.Y,
                bin: SHORT_WILDCARD,
                aggregate: SHORT_WILDCARD,
                field: 'Q1',
                type: Type.QUANTITATIVE
              }
            ],
          },
          nest: [{
            groupBy: [Property.FIELD, Property.AGGREGATE, Property.BIN, Property.TIMEUNIT]
          }],
          config: {
            autoAddCount: true,
            omitAggregatePlotWithoutDimension: true
          }
        };
        const CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION = extend({}, DEFAULT_QUERY_CONFIG, {omitAggregatePlotWithoutDimension: true});
        const result = query(q, schema, CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION).result;
        assert.equal(result.items.length, 6);
      });

      it('?(Q) x ?(Q) should produce MEAN(Q)xMEAN(Q) if omitAggregatePlotWithoutDimension is disabled.', () => {
        const q = {
          spec: {
            mark: Mark.POINT,
            encodings:[
              {
              channel: Channel.X,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD,
              field: 'Q',
              type: Type.QUANTITATIVE
              },
              {
              channel: Channel.Y,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD,
              field: 'Q1',
              type: Type.QUANTITATIVE
              }
            ],
          },
          nest: [{
            groupBy: [Property.FIELD, Property.AGGREGATE, Property.BIN, Property.TIMEUNIT]
          }],
          config: {
            autoAddCount: true,
            omitAggregatePlotWithoutDimension: false
          }
        };
        const CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION = extend({}, DEFAULT_QUERY_CONFIG, {omitAggregatePlotWithoutDimension: false});
        const result = query(q, schema, CONFIG_WITH_OMIT_AGGREGATE_PLOT_WITHOUT_DIMENSION).result;
        assert.equal(result.items.length, 7);
      });
    });

    describe('nested query', () => {
      const q: Query = {
        spec: {
          mark: '?',
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        nest: [
          {groupBy: 'fieldTransform'}
        ],
        orderBy: 'effectiveness',
      };
      const qCopy = duplicate(q);
      const output = query(q, schema);
      const result = output.result;

      it('enumerates a nested query correctly ', () => {
        assert.isTrue(result.items[0] instanceof SpecQueryModelGroup);
        if (result.items[0] instanceof SpecQueryModelGroup) {
          const group1: SpecQueryModelGroup = <SpecQueryModelGroup> result.items[0];
          assert.isFalse(group1.items[0] instanceof SpecQueryModelGroup);
          assert.equal(group1.items.length, 2);
          assert.equal((<SpecQueryModel>group1.items[0]).specQuery.mark, 'tick');
          assert.equal((<SpecQueryModel>group1.items[1]).specQuery.mark, 'point');
        }
      });

      it('should augment wildcard name for enum specs', () => {
        assert.isDefined((output.query.spec.mark as Wildcard<Mark>).name);
      });

      it('should not cause side effect to the original query object.', () => {
        assert.deepEqual(q, qCopy);
      });
    });

    describe('rank', () => {
      it('should sort SpecQueryModelGroup\'s items when passed orderBy is an array', () => {
        const q: Query = {
          spec: {
            mark: '?',
            encodings: [
              {channel: '?', bin: '?', aggregate: '?', field: 'Q', type: Type.QUANTITATIVE},
              {channel: '?', bin: '?', aggregate: '?', field: 'Q1', type: Type.QUANTITATIVE}
            ]
          },
          orderBy: ['aggregationQuality', 'effectiveness']
        };

        const output = query(q, schema);
        const result = output.result;

        function score(item: any, rankingName: string) {
          return getScore(item, rankingName, schema, DEFAULT_QUERY_CONFIG);
        }

        for (let i = 1; i < result.items.length; i++) {
          let prev = result.items[i-1];
          let cur = result.items[i];


          assert.isTrue(
            score(prev, 'aggregationQuality') >= score(cur, 'aggregationQuality') ||
            (
              score(prev, 'aggregationQuality') === score(cur, 'aggregationQuality') &&
              score(prev, 'effectiveness') >= score(cur, 'effectiveness')
            )
          );
        }
      });
    });

    it('enumerates a flat query correctly ', () => {
      const q: Query = {
        spec: {
          mark: '?',
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        orderBy: 'effectiveness',
      };
      const result = query(q, schema).result;
      assert.isFalse(result.items[0] instanceof SpecQueryModelGroup);
      assert.equal(result.items.length, 2);
      assert.equal((<SpecQueryModel>result.items[0]).specQuery.mark, 'tick');
      assert.equal((<SpecQueryModel>result.items[1]).specQuery.mark, 'point');
    });
  });

  describe('normalize', () => {
    it('should correctly normalize query', () => {
      const q: Query = {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        groupBy: 'fieldTransform',
        chooseBy: 'effectiveness',
        orderBy: 'effectiveness'
      };

      assert.deepEqual(normalize(q), {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        nest: [{
          groupBy: 'fieldTransform',
          orderGroupBy: 'effectiveness'
        }],
        chooseBy: 'effectiveness'
      });
    });
  });
});
