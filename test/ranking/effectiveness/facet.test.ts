import {ROW, COLUMN} from 'vega-lite/build/src/channel';
import {FacetScorer} from '../../../src/ranking/effectiveness/facet';
import {RuleSet, testRuleSet} from '../rule';

const scorer = new FacetScorer();

export const PREFERRED_FACET_RULESET: RuleSet<string> = {
  name: 'preferredFacetScore',
  rules: [
    {
      name: 'preferredFacetScore',
      items: [ROW, COLUMN] as any[],
    },
  ],
};

describe('preferredFacetScore', () => {
  function getPreferredFacetScore(feature: string) {
    return scorer.scoreIndex[feature];
  }

  testRuleSet(PREFERRED_FACET_RULESET, getPreferredFacetScore);
});
