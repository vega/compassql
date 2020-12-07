import {assert} from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import * as vegaTime from 'vega-time';
import * as TYPE from 'vega-lite/build/src/type';
import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {SpecQueryModel, SpecQueryModelGroup} from '../../src/model';
import {comparatorFactory, rank} from '../../src/ranking/ranking';
import {schema} from '../fixture';

describe('ranking', () => {
  describe('rank', () => {
    it('should return an empty group if the input group is empty', () => {
      let group: SpecQueryModelGroup = rank(
        {
          name: '',
          path: '',
          items: []
        },
        {
          spec: {
            mark: MARK.BAR,
            encodings: [{channel: CHANNEL.SHAPE, field: 'N', type: TYPE.NOMINAL}]
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
    describe('nested / multiple ranking', () => {
      it(
        'should create a comparator that uses the second ranker of an orderBy array to specs ' +
          'if the first ranker results in a tie',
        () => {
          const specM1 = SpecQueryModel.build(
            {
              mark: MARK.LINE,
              encodings: [
                {channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY},
                {aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE}
              ]
            },
            schema,
            DEFAULT_QUERY_CONFIG
          );

          const specM2 = SpecQueryModel.build(
            {
              mark: MARK.POINT,
              encodings: [
                {channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY},
                {aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE}
              ]
            },
            schema,
            DEFAULT_QUERY_CONFIG
          );

          const comparator = comparatorFactory(['aggregationQuality', 'effectiveness'], schema, DEFAULT_QUERY_CONFIG);
          assert.isBelow(comparator(specM1, specM2), 0);
        }
      );

      it(
        'should create a comparator that uses the first orderBy to sort specs ' +
          'if the first ranker does not produce a tie',
        () => {
          const specM1 = SpecQueryModel.build(
            {
              mark: MARK.POINT,
              encodings: [
                {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
                {channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE}
              ]
            },
            schema,
            DEFAULT_QUERY_CONFIG
          );

          const specM2 = SpecQueryModel.build(
            {
              mark: MARK.POINT,
              encodings: [
                {aggregate: 'mean', channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
                {aggregate: 'mean', channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE}
              ]
            },
            schema,
            DEFAULT_QUERY_CONFIG
          );

          const comparator = comparatorFactory(['aggregationQuality', 'effectiveness'], schema, DEFAULT_QUERY_CONFIG);
          assert.isBelow(comparator(specM1, specM2), 0);
        }
      );
    });

    describe('single ranking', () => {
      it('should create a comparator that returns a value of 0 when the orderBy ranker results in a tie', () => {
        const specM1 = SpecQueryModel.build(
          {
            mark: MARK.LINE,
            encodings: [
              {channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY},
              {aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE}
            ]
          },
          schema,
          DEFAULT_QUERY_CONFIG
        );

        const specM2 = SpecQueryModel.build(
          {
            mark: MARK.POINT,
            encodings: [
              {channel: CHANNEL.X, field: 'date', type: TYPE.TEMPORAL, timeUnit: vegaTime.DAY},
              {aggregate: 'mean', channel: CHANNEL.Y, field: 'price', type: TYPE.QUANTITATIVE}
            ]
          },
          schema,
          DEFAULT_QUERY_CONFIG
        );

        const comparator = comparatorFactory('aggregationQuality', schema, DEFAULT_QUERY_CONFIG);
        assert.equal(comparator(specM1, specM2), 0);
      });

      it('should create a comparator that correctly sorts two spec when passed an orderBy string of aggregationQuality', () => {
        const specM1 = SpecQueryModel.build(
          {
            mark: MARK.POINT,
            encodings: [
              {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE}
            ]
          },
          schema,
          DEFAULT_QUERY_CONFIG
        );

        const specM2 = SpecQueryModel.build(
          {
            mark: MARK.POINT,
            encodings: [
              {aggregate: 'mean', channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
              {aggregate: 'mean', channel: CHANNEL.Y, field: 'Q1', type: TYPE.QUANTITATIVE}
            ]
          },
          schema,
          DEFAULT_QUERY_CONFIG
        );

        const comparator = comparatorFactory('aggregationQuality', schema, DEFAULT_QUERY_CONFIG);
        assert.isBelow(comparator(specM1, specM2), 0);
      });
    });
  });
});
