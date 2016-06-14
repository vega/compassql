import {POINT, TICK, BAR, LINE, AREA, RULE, TEXT as TEXTMARK} from 'vega-lite/src/mark';

import {BIN_Q, TIMEUNIT_T, Q, N, O, T} from '../../../src/ranking/effectiveness/type';
import {MarkScore} from '../../../src/ranking/effectiveness/mark';
import {nestedMap} from '../../../src/util';
import {RuleSet, testRuleSet} from './rule';

const MARK_SCORE = MarkScore.init();

function getScore(feature: string) {
  return MARK_SCORE[feature];
}

const MARK_RULES: RuleSet<string>[] = [
  {
    name: 'Continous-Continous Plots',
    rules: function() {
      const _rules = [];
      [Q, T].forEach((xType) => {
        [Q, T].forEach((yType) => {
          const continuousRank = [POINT, TEXTMARK, TICK, [BAR, LINE, AREA], RULE];
          _rules.push({
            name: xType + ' x ' + yType + ' (with occlusion)',
            items: nestedMap(continuousRank, (mark) => {
              return MarkScore.featurize(xType, yType, true, mark);
            })
          });

          _rules.push({
            name: xType + ' x ' + yType + ' (without occlusion)',
            items: nestedMap(continuousRank, (mark) => {
              return MarkScore.featurize(xType, yType, false, mark);
            })
          });

          // TODO: BAR, LINE, AREA, RULE should be terrible
        });
      });
      return _rules;
    }()
  },{
    name: 'Continous-Discrete Plots',
    rules: function() {
      const _rules = [];
      [Q, T].forEach((measureType) => {
        // Has Occlusion
        [TIMEUNIT_T, O, BIN_Q, N].forEach((dimensionType) => {
          const dimWithOcclusionRank = [TICK, POINT, TEXTMARK, [LINE, AREA, BAR], RULE];
          _rules.push({
            name: measureType + ' x ' + dimensionType + ' (with occlusion)',
            items: nestedMap(dimWithOcclusionRank, (mark) => {
              return MarkScore.featurize(measureType, dimensionType, true, mark);
            })
          });

          _rules.push({
            name: dimensionType + ' x ' + measureType + ' (with occlusion)',
            items: nestedMap(dimWithOcclusionRank, (mark) => {
              return MarkScore.featurize(dimensionType, measureType, true, mark);
            })
          });
          // TODO: BAR, LINE, AREA, RULE should be terrible
        });

        // No Occlusion

        [TIMEUNIT_T, O].forEach((dimensionType) => {
          const orderedDimNoOcclusionRank = [LINE, AREA, BAR, POINT, TICK, TEXTMARK, RULE];

          _rules.push({
            name: measureType + ' x ' + dimensionType + ' (without occlusion)',
            items: nestedMap(orderedDimNoOcclusionRank, (mark) => {
              return MarkScore.featurize(measureType, dimensionType, false, mark);
            })
          });

          _rules.push({
            name: dimensionType + ' x ' + measureType + ' (without occlusion)',
            items: nestedMap(orderedDimNoOcclusionRank, (mark) => {
              return MarkScore.featurize(dimensionType, measureType, false, mark);
            })
          });
          // TODO: BAR, LINE, AREA, RULE should be terrible
        });

        [BIN_Q].forEach((dimensionType) => {
          const binDimNoOcclusionRank = [BAR, POINT, TICK, TEXTMARK, [LINE, AREA], RULE];

          _rules.push({
            name: measureType + ' x ' + dimensionType + ' (without occlusion)',
            items: nestedMap(binDimNoOcclusionRank, (mark) => {
              return MarkScore.featurize(measureType, dimensionType, false, mark);
            })
          });

          _rules.push({
            name: dimensionType + ' x ' + measureType + ' (without occlusion)',
            items: nestedMap(binDimNoOcclusionRank, (mark) => {
              return MarkScore.featurize(dimensionType, measureType, false, mark);
            })
          });
          // TODO: RULE should be terrible
        });

        [N].forEach((dimensionType) => {
          const binDimNoOcclusionRank = [BAR, POINT, TICK, TEXTMARK, [LINE, AREA], RULE];

          _rules.push({
            name: measureType + ' x ' + dimensionType + ' (without occlusion)',
            items: nestedMap(binDimNoOcclusionRank, (mark) => {
              return MarkScore.featurize(measureType, dimensionType, false, mark);
            })
          });

          _rules.push({
            name: dimensionType + ' x ' + measureType + ' (without occlusion)',
            items: nestedMap(binDimNoOcclusionRank, (mark) => {
              return MarkScore.featurize(dimensionType, measureType, false, mark);
            })
          });

          // TODO: LINE, AREA, RULE should be terrible
        });
      });
      return _rules;
    }()
  },{
    name: 'Discrete-Discrete Plots',
    rules: function() {
      const _rules = [];
      [TIMEUNIT_T, O, BIN_Q, N].forEach((xType) => {
        [TIMEUNIT_T, O, BIN_Q, N].forEach((yType) => {
          const ddRank = [POINT, TEXTMARK, TICK, [BAR, LINE, AREA], RULE];

          // TODO: RECT is not bad here.

          _rules.push({
            name: xType + ' x ' + yType + ' (with occlusion)',
            items: nestedMap(ddRank, (mark) => {
              return MarkScore.featurize(xType, yType, true, mark);
            })
          });

          _rules.push({
            name: xType + ' x ' + yType + ' (without occlusion)',
            items: nestedMap(ddRank, (mark) => {
              return MarkScore.featurize(xType, yType, false, mark);
            })
          });

          // TODO: BAR, LINE, AREA, RULE should be terrible
        });
      });
      return _rules;
    }()
  },

];

describe('markScore', () => {
  MARK_RULES.forEach((ruleSet) => {
    testRuleSet(ruleSet, getScore);
  });
});
