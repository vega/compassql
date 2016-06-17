import {X, Y, SIZE, COLOR, OPACITY, TEXT, ROW, COLUMN, SHAPE, DETAIL} from 'vega-lite/src/channel';

import {BIN_Q, TIMEUNIT_T, Q, N, O, T} from '../../../src/ranking/effectiveness/type';
import {TypeChannelScore, PreferredAxisScore, PreferredFacetScore} from '../../../src/ranking/effectiveness/channel';
import {nestedMap} from '../../../src/util';
import {RuleSet, testRuleSet} from './rule';

describe('typeChannelScore', () => {
  const TYPE_CHANNEL_SCORE = TypeChannelScore.init();

  function getTypeChannelScore(feature: string) {
    return TYPE_CHANNEL_SCORE[feature];
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

  CHANNEL_RULES.forEach((ruleSet) => {
    testRuleSet(ruleSet, getTypeChannelScore);
  });
});

describe('preferredAxisScore', () => {
  const PREFERRED_AXIS_SCORE = PreferredAxisScore.init();

  function getPreferredAxisScore(feature: string) {
    return PREFERRED_AXIS_SCORE[feature];
  }

  const CHANNEL_RULES: RuleSet<string>[] = [
    {
      name: 'preferredAxisScore (bin, temporal)',
      rules: [BIN_Q, T].map((type) => {
        return {
          name: type + '',
          items: nestedMap([X, Y], (channel) => {
            return PreferredAxisScore.featurize(type, channel);
          })
        };
      })
    },{
      name: 'preferredAxisScore (ordinal, categorical)',
      rules: [O, N].map((type) => {
        return {
          name: type + '',
          items: nestedMap([Y, X], (channel) => {
            return PreferredAxisScore.featurize(type, channel);
          })
        };
      })
    }
  ];

  CHANNEL_RULES.forEach((ruleSet) => {
    testRuleSet(ruleSet, getPreferredAxisScore);
  });
});

describe('preferredFacetScore', () => {
  const PREFERRED_FACET_SCORE = PreferredFacetScore.init();

  function getPreferredFacetScore(feature: string) {
    return PREFERRED_FACET_SCORE[feature];
  }

  const CHANNEL_RULES: RuleSet<string>[] = [
    {
      name: 'preferredFacetScore',
      rules: [{
        name: 'preferredFacetScore' + '',
        items: [ROW, COLUMN] as any[]
      }]
    }
   ];

  CHANNEL_RULES.forEach((ruleSet) => {
    testRuleSet(ruleSet, getPreferredFacetScore);
  });
});
