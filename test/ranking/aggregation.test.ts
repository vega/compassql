import {isAggregateOp} from 'vega-lite/build/src/aggregate';
import {isUTCTimeUnit,isLocalSingleTimeUnit} from 'vega-lite/build/src/timeunit';
import * as TYPE from 'vega-lite/build/src/type';
import {DEFAULT_QUERY_CONFIG} from '../../src/config';
import {SpecQueryModel} from '../../src/model';
import {EncodingQuery} from '../../src/query/encoding';
import {score} from '../../src/ranking/aggregation';
import {SHORT_WILDCARD} from '../../src/wildcard';
import {schema} from '../fixture';
import {RuleSet, testRuleSet} from './rule';

function getScore(shortenedFields: string) {
  const encodings: EncodingQuery[] = shortenedFields.split('x').map((shortenedEncQ: string) => {
    let encQ: EncodingQuery = {channel: SHORT_WILDCARD};
    const split = shortenedEncQ.trim().split('_');

    const field: string = (encQ.field = split.length > 1 ? split[1] : split[0]);

    encQ.type = field === '*' ? TYPE.QUANTITATIVE : schema.vlType(field);

    if (split.length > 1) {
      const fn = split[0];
      if (fn === 'bin') {
        encQ.bin = true;
      } else if (isUTCTimeUnit(fn) || isLocalSingleTimeUnit(fn)) {
        encQ.timeUnit = fn;
      } else if (isAggregateOp(fn)) {
        encQ.aggregate = fn;
      }
    }
    return encQ;
  });

  const specM = SpecQueryModel.build(
    {
      mark: SHORT_WILDCARD,
      encodings: encodings
    },
    schema,
    DEFAULT_QUERY_CONFIG
  );

  return score(specM, schema, DEFAULT_QUERY_CONFIG).score;
}

describe('ranking/aggregation', () => {
  describe('aggregationQuality', () => {
    const SUMMARY_RULESET: RuleSet<string> = {
      name: 'aggregationQuality',
      rules: [
        {
          name: '1D',
          items: [['Q', 'T'], ['bin_Q x count_*', 'year_T x count_*'], 'mean_Q', ['O', 'N']]
        },
        {
          name: '2D',
          items: [
            [
              'NxQ',
              'TxQ',
              'QxQ',
              'NxT',
              'year_TxQ',
              'TxT1',
              'Txyear_T1' // TODO: possibly move these two to the next tier
            ],
            ['N x mean_Q', 'year_T x mean_Q'],
            [
              'N x N x count_*',
              'N x year_T x count_*',
              'N x bin_Q x count_*',
              'year_T x year_T1 x count_*',
              'year_T x bin_Q x count_*',
              'bin_Q x bin_Q1 x count_*'
            ],
            ['bin_Q x mean_Q1'],
            ['mean_Q x mean_Q'],
            ['NxN', 'N x year_T', 'N x bin_Q', 'year_T x year_T1', 'year_T x bin_Q', 'bin_Q x bin_Q1'],
            ['T x mean_Q', 'Q x mean_Q'] // FIXME this is not necessarily bad depending on the data distribution
          ]
        }
      ]
    };

    testRuleSet(SUMMARY_RULESET, getScore);
  });
});
