import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';
import {assert} from 'chai';

import {schema} from '../fixture';

import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {EnumSpec, SHORT_ENUM_SPEC} from '../../src/enumspec';
import {SpecQueryModel} from '../../src/model';
import {isSpecQueryModelGroup, SpecQueryModelGroup} from '../../src/modelgroup';
import {normalize, query, Query} from '../../src/query/query';
import {Property} from '../../src/property';
import {duplicate, extend} from '../../src/util';

describe('query/query', () => {
  describe('query()', () => {
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
        assert.isTrue(isSpecQueryModelGroup(result.items[0]));
        if (isSpecQueryModelGroup(result.items[0])) {
          const group1: SpecQueryModelGroup = <SpecQueryModelGroup> result.items[0];
          assert.isFalse(isSpecQueryModelGroup(group1.items[0]));
          assert.equal(group1.items.length, 2);
          assert.equal((<SpecQueryModel>group1.items[0]).specQuery.mark, 'tick');
          assert.equal((<SpecQueryModel>group1.items[1]).specQuery.mark, 'point');
        }
      });

      it('should augment enumSpec name for enum specs', () => {
        assert.isDefined((output.query.spec.mark as EnumSpec<Mark>).name);
      });

      it('should not cause side effect to the original query object.', () => {
        assert.deepEqual(q, qCopy);
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
      assert.isFalse(isSpecQueryModelGroup(result.items[0]));
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

describe('2D aggregate', () => {
  describe('summary with mean', () => {
    it('should not generate 2D summary plot with MEAN(Q) x MEAN(Q1)', () => {
      const q = {
        spec: {
          mark: Mark.POINT,
          encodings:[
            {
            channel: Channel.X,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q',
            type: Type.QUANTITATIVE
            },
            {
            channel: Channel.Y,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
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
  });

    it('should generate 2D summary plot with MEAN(Q) x MEAN(Q1)', () => {
      const q = {
        spec: {
          mark: Mark.POINT,
          encodings:[
            {
            channel: Channel.X,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q',
            type: Type.QUANTITATIVE
            },
            {
            channel: Channel.Y,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
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
      // MEAN(Q) x MEAN(Q1) plot generates when omitAggregatePlotWithoutDimension config is turned off,
      // hence there being one more item here than when the config turned on
      assert.equal(result.items.length, 7);
    });
});
