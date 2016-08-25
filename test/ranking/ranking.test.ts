import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
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
    it('should create a comparator that returns a score difference when passed an orderBy array', () => {
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
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.X, field: 'N', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE},
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const comparator = comparatorFactory(['aggregationQuality', 'effectiveness'], schema, DEFAULT_QUERY_CONFIG);
      assert.isNumber(comparator(specM1, specM2));
    });

    it('should create a comparator that returns a score difference when passed an orderBy string', () => {
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
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.X, field: 'N', type: Type.NOMINAL},
            {channel: Channel.Y, field: 'Q', type: Type.QUANTITATIVE},
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      const comparator = comparatorFactory('aggregationQuality', schema, DEFAULT_QUERY_CONFIG);
      assert.isNumber(comparator(specM1, specM2));
    });
  });
});
