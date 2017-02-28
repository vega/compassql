import {X, Y} from 'vega-lite/src/channel';

import {BIN_Q, TIMEUNIT_T, TIMEUNIT_O, N, O, T} from '../../../src/ranking/effectiveness/type';
import {AxisScorer} from '../../../src/ranking/effectiveness/axis';
import {nestedMap} from '../../../src/util';
import {RuleSet, testRuleSet} from '../rule';

const scorer = new AxisScorer();

export const PREFERRED_AXIS_RULESET: RuleSet<string> = {
  name: 'preferredAxisScore (bin, temporal)',
  rules: [].concat(
    [BIN_Q, TIMEUNIT_T, TIMEUNIT_O, T].map((type) => {
      return {
        name: type + '',
        items: nestedMap([X, Y], (channel) => {
          return scorer.featurize(type, channel);
        })
      };
    }),
    [O, N].map((type) => {
        return {
          name: type + '',
          items: nestedMap([Y, X], (channel) => {
            return scorer.featurize(type, channel);
          })
        };
    })
  )
};

describe('preferredAxisScore', () => {
  function getPreferredAxisScore(feature: string) {
    return scorer.scoreIndex[feature];
  }

  testRuleSet(PREFERRED_AXIS_RULESET, getPreferredAxisScore);
});
