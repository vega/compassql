import {assert} from 'chai';
import {isArray} from 'datalib/src/util';

export interface RuleSet<T> {
  name: string;
  rules: Rule<T>[];
}

export interface Rule<T> {
  name: string;
  items: (T | T[])[];
}

export function testRuleSet(ruleSet: RuleSet<any>, getScore: {(_: any): number}, stringify = JSON.stringify) {
  ruleSet.rules.forEach((rule) => {
    it(`should preserve ranking order for ${rule.name}`, () => {
      const items = rule.items;
      for (let i = 1; i < items.length; i++) {
        const l = items[i - 1];
        const r = items[i];
        (isArray(l) ? l : [l]).forEach((left) => {
          (isArray(r) ? r : [r]).forEach((right) => {
            const lScore = getScore(left) || 0;
            const rScore = getScore(right) || 0;
            assert.isTrue(
              lScore > rScore,
              `Score for ${stringify(left)} (${lScore.toFixed(3)}) ` +
                'should > ' +
                stringify(right) +
                ' (' +
                rScore.toFixed(3) +
                ')'
            );
          });
        });
      }
    });
  });
}
