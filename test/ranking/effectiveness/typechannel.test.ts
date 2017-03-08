import {X, Y, SIZE, COLOR, OPACITY, TEXT, ROW, COLUMN, SHAPE, DETAIL} from 'vega-lite/build/src/channel';

import {BIN_Q, TIMEUNIT_T, TIMEUNIT_O, Q, N, O, T} from '../../../src/ranking/effectiveness/type';
import {TypeChannelScorer} from '../../../src/ranking/effectiveness/typechannel';
import {nestedMap} from '../../../src/util';
import {RuleSet, testRuleSet} from '../rule';

const typeChannelScorer = new TypeChannelScorer();

export const TYPE_CHANNEL_RULESET: RuleSet<string> = {
  name: 'typeChannelScore (quantitative)',
  rules: [].concat(
    [Q, T, TIMEUNIT_T].map((type) => {
      const order = [[X, Y], SIZE, COLOR, TEXT, OPACITY, [ROW, COLUMN, SHAPE], DETAIL];
      return {
        name: type + '',
        items: nestedMap(order, (channel) => {
          return typeChannelScorer.featurize(type, channel);
        })
      };
    }),
    [BIN_Q, TIMEUNIT_O, O].map((type) => {
      const order = [[X, Y], SIZE, COLOR, [ROW, COLUMN], OPACITY, SHAPE, TEXT, DETAIL];
      return {
        name: type + '',
        items: nestedMap(order, (channel) => {
          return typeChannelScorer.featurize(type, channel);
        })
      };
    }),
    [{
      name: 'nominal',
      items: nestedMap([[X, Y], COLOR, SHAPE, [ROW, COLUMN], TEXT, DETAIL, SIZE, OPACITY], (channel) => {
          return typeChannelScorer.featurize(N, channel);
        })
    }]
  )
};

describe('typeChannelScore', () => {
  function getTypeChannelScore(feature: string) {
    return typeChannelScorer.scoreIndex[feature];
  }

  testRuleSet(TYPE_CHANNEL_RULESET, getTypeChannelScore);
});
