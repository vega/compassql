import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {schema} from '../fixture';

import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {SpecQueryModel, SpecQueryModelGroup} from '../../src/model';
import {rank, comparatorFactory} from '../../src/ranking/ranking';

import {assert} from 'chai';


describe('ranking', () => {
  describe('rank', () => {
    it('should return an empty group if the input group is empty', () => {
      let group: SpecQueryModelGroup = rank(
        new SpecQueryModelGroup(),
        {
          spec: {
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.SHAPE, field: 'N', type: Type.NOMINAL},
            ]
          },
          chooseBy: 'effectiveness'
        },
        schema,
        0
      );
      assert.deepEqual(group.items, []);
    });
  });

  describe('comparatorFactory', () => {
    it('should create a comparator that uses the second ranker of an orderBy array to sort two spec ' +
       'if the first ranker results in a tie', () => {
      const specM1 = SpecQueryModel.build(
        {
          mark: Mark.LINE,
          encodings: [
            {channel: Channel.X, field: 'date', type: Type.TEMPORAL, timeUnit: TimeUnit.DAY},
            {aggregate: AggregateOp.MEAN, channel: Channel.Y, field: 'price', type: Type.QUANTITATIVE},
            {channel: Channel.COLOR, field: 'symbol', type: Type.NOMINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const specM2 = SpecQueryModel.build(
        {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'date', type: Type.TEMPORAL},
            {aggregate: AggregateOp.MEAN, channel: Channel.Y, field: 'price', type: Type.QUANTITATIVE},
            {channel: Channel.COLOR, field: 'symbol', type: Type.NOMINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const comparator = comparatorFactory(['aggregationQuality', 'effectiveness'], schema, DEFAULT_QUERY_CONFIG);
      assert.isBelow(comparator(specM1, specM2), 0);
    });

    it('should create a comparator that correctly sorts two spec when passed an orderBy string of effectiveness', () => {
      const specM1 = SpecQueryModel.build(
        {
          mark: Mark.LINE,
          encodings: [
            {channel: Channel.X, field: 'date', type: Type.TEMPORAL, timeUnit: TimeUnit.DAY},
            {aggregate: AggregateOp.MEAN, channel: Channel.Y, field: 'price', type: Type.QUANTITATIVE},
            {channel: Channel.COLOR, field: 'symbol', type: Type.NOMINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const specM2 = SpecQueryModel.build(
        {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'date', type: Type.TEMPORAL, timeUnit: TimeUnit.DAY},
            {aggregate: AggregateOp.MEAN, channel: Channel.Y, field: 'price', type: Type.QUANTITATIVE},
            {channel: Channel.COLOR, field: 'symbol', type: Type.NOMINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const comparator = comparatorFactory('effectiveness', schema, DEFAULT_QUERY_CONFIG);
      assert.isBelow(comparator(specM1, specM2), 0);
    });

    it('should create a comparator that correctly sorts two spec when passed an orderBy string of aggregationQuality', () => {
      const specM1 = SpecQueryModel.build(
        {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
            {channel: Channel.Y, field: 'Q1', type: Type.QUANTITATIVE},
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const specM2 = SpecQueryModel.build(
        {
          mark: Mark.POINT,
          encodings: [
            {aggregate: AggregateOp.MEAN, channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
            {aggregate: AggregateOp.MEAN, channel: Channel.Y, field: 'Q1', type: Type.QUANTITATIVE},
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const comparator = comparatorFactory('aggregationQuality', schema, DEFAULT_QUERY_CONFIG);
      assert.isTrue(comparator(specM1, specM2) < 0);
    });
  });
});
