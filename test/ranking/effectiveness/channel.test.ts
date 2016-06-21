import {X, Y, SIZE, COLOR, OPACITY, TEXT, ROW, COLUMN, SHAPE, DETAIL} from 'vega-lite/src/channel';

import {BIN_Q, TIMEUNIT_T, Q, N, O, T} from '../../../src/ranking/effectiveness/type';
import {TypeChannelScore, PreferredAxisScore, PreferredFacetScore, DimensionScore} from '../../../src/ranking/effectiveness/channel';
import {nestedMap} from '../../../src/util';
import {RuleSet, testRuleSet} from './rule';

export const TYPE_CHANNEL_RULESET: RuleSet<string> = {
  name: 'typeChannelScore (quantitative)',
  rules: [].concat(
    [Q, T].map((type) => {
      const order = [[X, Y], SIZE, COLOR, OPACITY, [ROW, COLUMN], SHAPE, DETAIL];
      return {
        name: type + '',
        items: nestedMap(order, (channel) => {
          return TypeChannelScore.featurize(type, channel);
        })
      };
    }),
    [BIN_Q, TIMEUNIT_T, O].map((type) => {
      const order = [[X, Y], SIZE, [ROW, COLUMN], COLOR, OPACITY, SHAPE, DETAIL];
      return {
        name: type + '',
        items: nestedMap(order, (channel) => {
          return TypeChannelScore.featurize(type, channel);
        })
      };
    }),
    [{
      name: 'nominal',
      items: nestedMap([[X, Y], COLOR, SHAPE, [ROW, COLUMN], TEXT, SIZE, DETAIL, OPACITY], (channel) => {
          return TypeChannelScore.featurize(N, channel);
        })
    }]
  )
};

describe('typeChannelScore', () => {
  const TYPE_CHANNEL_SCORE = TypeChannelScore.init();

  function getTypeChannelScore(feature: string) {
    return TYPE_CHANNEL_SCORE[feature];
  }

  testRuleSet(TYPE_CHANNEL_RULESET, getTypeChannelScore);
});

export const PREFERRED_AXIS_RULESET: RuleSet<string> = {
  name: 'preferredAxisScore (bin, temporal)',
  rules: [].concat(
    [BIN_Q, T].map((type) => {
      return {
        name: type + '',
        items: nestedMap([X, Y], (channel) => {
          return PreferredAxisScore.featurize(type, channel);
        })
      };
    }),
    [O, N].map((type) => {
        return {
          name: type + '',
          items: nestedMap([Y, X], (channel) => {
            return PreferredAxisScore.featurize(type, channel);
          })
        };
    })
  )
};

describe('preferredAxisScore', () => {
  const PREFERRED_AXIS_SCORE = PreferredAxisScore.init();

  function getPreferredAxisScore(feature: string) {
    return PREFERRED_AXIS_SCORE[feature];
  }

  testRuleSet(PREFERRED_AXIS_RULESET, getPreferredAxisScore);
});

export const PREFERRED_FACET_RULESET: RuleSet<string> = {
  name: 'preferredFacetScore',
  rules: [{
    name: 'preferredFacetScore' + '',
    items: [ROW, COLUMN] as any[]
  }]
};

describe('preferredFacetScore', () => {
  const PREFERRED_FACET_SCORE = PreferredFacetScore.init();

  function getPreferredFacetScore(feature: string) {
    return PREFERRED_FACET_SCORE[feature];
  }


  testRuleSet(PREFERRED_FACET_RULESET, getPreferredFacetScore);
});

export const PREFERRED_DIMENSION_RULESET: RuleSet<string> = {
  name: 'dimensionScore',
  rules: [{
    name: 'dimensionScore',
    items: [[COLOR, SIZE, OPACITY, SHAPE], [ROW, COLUMN]] as any[]
  }]
};

describe('dimensionScore', () => {
  const DIMENSION_SCORE = DimensionScore.init();

  function getDimensionScore(feature: string) {
    return DIMENSION_SCORE[feature];
  }

  testRuleSet(PREFERRED_DIMENSION_RULESET, getDimensionScore);
});
