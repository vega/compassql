import { getTopResultTreeItem } from '../result';
import { effectiveness } from './effectiveness';
export * from './effectiveness';
import * as aggregation from './aggregation';
import * as fieldOrder from './fieldorder';
export { aggregation, fieldOrder };
/**
 * Registry for all encoding ranking functions
 */
let rankingRegistry = {};
/**
 * Add an ordering function to the registry.
 */
export function register(name, keyFn) {
    rankingRegistry[name] = keyFn;
}
export function get(name) {
    return rankingRegistry[name];
}
export function rank(group, query, schema, level) {
    if (!query.nest || level === query.nest.length) {
        if (query.orderBy || query.chooseBy) {
            group.items.sort(comparatorFactory(query.orderBy || query.chooseBy, schema, query.config));
            if (query.chooseBy) {
                if (group.items.length > 0) {
                    // for chooseBy -- only keep the top-item
                    group.items.splice(1);
                }
            }
        }
    }
    else {
        // sort lower-level nodes first because our ranking takes top-item in the subgroup
        group.items.forEach((subgroup) => {
            rank(subgroup, query, schema, level + 1);
        });
        if (query.nest[level].orderGroupBy) {
            group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
        }
    }
    return group;
}
export function comparatorFactory(name, schema, opt) {
    return (m1, m2) => {
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
export function groupComparatorFactory(name, schema, opt) {
    return (g1, g2) => {
        const m1 = getTopResultTreeItem(g1);
        const m2 = getTopResultTreeItem(g2);
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
function getScoreDifference(name, m1, m2, schema, opt) {
    for (let rankingName of name) {
        let scoreDifference = getScore(m2, rankingName, schema, opt).score - getScore(m1, rankingName, schema, opt).score;
        if (scoreDifference !== 0) {
            return scoreDifference;
        }
    }
    return 0;
}
export function getScore(model, rankingName, schema, opt) {
    if (model.getRankingScore(rankingName) !== undefined) {
        return model.getRankingScore(rankingName);
    }
    const fn = get(rankingName);
    const score = fn(model, schema, opt);
    model.setRankingScore(rankingName, score);
    return score;
}
export const EFFECTIVENESS = 'effectiveness';
register(EFFECTIVENESS, effectiveness);
register(aggregation.name, aggregation.score);
register(fieldOrder.name, fieldOrder.score);
//# sourceMappingURL=ranking.js.map