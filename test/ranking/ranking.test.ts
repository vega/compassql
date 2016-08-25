import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {schema} from '../fixture';

import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {SHORT_ENUM_SPEC} from '../../src/enumspec';
import {generate} from '../../src/generate';
import {SpecQueryModelGroup} from '../../src/model';
import {SpecQuery} from '../../src/query/spec';
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
      const specQ: SpecQuery = {
        mark: SHORT_ENUM_SPEC,
        encodings: [
          {
            channel: SHORT_ENUM_SPEC,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q',
            type: Type.QUANTITATIVE
          },
          {
            channel: SHORT_ENUM_SPEC,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
      const comparator = comparatorFactory(['aggregationQuality', 'effectiveness'], schema, DEFAULT_QUERY_CONFIG);
      assert.isNumber(comparator(answerSet[1], answerSet[4]));
    });

    it('should create a comparator that returns a score difference when passed an orderBy string', () => {
      const specQ: SpecQuery = {
        mark: SHORT_ENUM_SPEC,
        encodings: [
          {
            channel: SHORT_ENUM_SPEC,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q',
            type: Type.QUANTITATIVE
          },
          {
            channel: SHORT_ENUM_SPEC,
            bin: SHORT_ENUM_SPEC,
            aggregate: SHORT_ENUM_SPEC,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }
        ]
      };
      const answerSet = generate(specQ, schema, DEFAULT_QUERY_CONFIG);
      const comparator = comparatorFactory('aggregationQuality', schema, DEFAULT_QUERY_CONFIG);
      assert.isNumber(comparator(answerSet[1], answerSet[4]));
    });
  });
});
