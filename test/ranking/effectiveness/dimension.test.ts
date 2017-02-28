import {SIZE, COLOR, OPACITY, ROW, COLUMN, SHAPE} from 'vega-lite/src/channel';
import {DimensionScorer} from '../../../src/ranking/effectiveness/dimension';
import {RuleSet, testRuleSet} from '../rule';


const scorer = new DimensionScorer();

export const PREFERRED_DIMENSION_RULESET: RuleSet<string> = {
  name: 'dimensionScore',
  rules: [{
    name: 'dimensionScore',
    items: [[COLOR, SIZE, OPACITY, SHAPE], [ROW, COLUMN]] as any[]
  }]
};

describe('dimensionScore', () => {
  function getDimensionScore(feature: string) {
    return scorer.scoreIndex[feature];
  }

  testRuleSet(PREFERRED_DIMENSION_RULESET, getDimensionScore);
});
