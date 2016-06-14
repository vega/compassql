import {X, Y, SIZE, COLOR, OPACITY, TEXT, ROW, COLUMN, SHAPE, DETAIL} from 'vega-lite/src/channel';

import {BIN_Q, TIMEUNIT_T, Q, N, O, T} from '../../../src/ranking/effectiveness/type';
import {TypeChannelScore} from '../../../src/ranking/effectiveness/channel';
import {nestedMap} from '../../../src/util';
import {RuleSet, testRuleSet} from './rule';

const CHANNEL_SCORE = TypeChannelScore.init();

function getScore(feature: string) {
  return CHANNEL_SCORE[feature];
}

const CHANNEL_RULES: RuleSet<string>[] = [
  {
    name: 'typeChannelScore (quantitative)',
    rules: [Q, T].map((type) => {
      const order = [[X, Y], SIZE, COLOR, OPACITY, [ROW, COLUMN], SHAPE, DETAIL];
      return {
        name: type + '',
        items: nestedMap(order, (channel) => {
          return TypeChannelScore.featurize(type, channel);
        })
      };
    })
  },
  {
    name: 'typeChannelScore (ordered discrete)',
    rules: [BIN_Q, TIMEUNIT_T, O].map((type) => {
      const order = [[X, Y], SIZE, [ROW, COLUMN], COLOR, OPACITY, SHAPE, DETAIL];
      return {
        name: type + '',
        items: nestedMap(order, (channel) => {
          return TypeChannelScore.featurize(type, channel);
        })
      };
    })
  },
  {
    name: 'typeChannelScore (nominal)',
    rules: [{
      name: 'nominal',
      items: nestedMap([[X, Y], COLOR, SHAPE, [ROW, COLUMN], TEXT, SIZE, DETAIL, OPACITY], (channel) => {
          return TypeChannelScore.featurize(N, channel);
        })
    }]
  }
];

describe('channelScore', () => {
  CHANNEL_RULES.forEach((ruleSet) => {
    testRuleSet(ruleSet, getScore);
  });
});
