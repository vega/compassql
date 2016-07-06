import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {SpecQueryModelGroup, getTopItem} from '../modelgroup';
import {Query} from '../query';
import {Dict} from '../util';
import {Schema} from '../schema';

export import effectiveness = require('./effectiveness/effectiveness');

export interface RankingScore {
  score: number;
  [metadata: string]: any;
}

export interface RankingFunction {
  (specM: SpecQueryModel, schema: Schema, opt: QueryConfig): RankingScore;
}

/**
 * Registry for all encoding ranking functions
 */
let rankingRegistry: Dict<RankingFunction>  = {};

/**
 * Add an ordering function to the registry.
 */
export function register(name: string, keyFn: RankingFunction) {
  rankingRegistry[name] = keyFn;
}

export function get(name: string) {
  return rankingRegistry[name];
}

export function rank(group: SpecQueryModelGroup, query: Query, schema: Schema, level: number) {
  if (!query.nest || level === query.nest.length) {
    if (query.orderBy || query.chooseBy) {
      group.items.sort(comparator(query.orderBy || query.chooseBy, schema, query.config));
      if (query.chooseBy) {
        // for chooseBy -- only keep the top-item
        group.items = [group.items[0]];
      }
    }
  } else {
    // sort lower-level nodes first because our ranking takes top-item in the subgroup
    group.items.forEach((subgroup) => {
      rank(subgroup as SpecQueryModelGroup, query, schema, level + 1);
    });
    if (query.nest[level].orderGroupBy) {
      group.items.sort(groupComparator(query.nest[level].orderGroupBy, schema, query.config));
    }
  }
  return group;
}

function getScore(model: SpecQueryModel, rankingName: string, schema: Schema, opt: QueryConfig) {
  if (model.getRankingScore(rankingName) !== undefined) {
    return model.getRankingScore(rankingName);
  }
  const fn = get(rankingName);
  const score = fn(model, schema, opt);
  model.setRankingScore(rankingName, score);
  return score;
}

export function comparator(name: string, schema: Schema, opt: QueryConfig) {
  return (m1: SpecQueryModel, m2: SpecQueryModel) => {
    return getScore(m2, name, schema, opt).score - getScore(m1, name, schema, opt).score;
  };
}

export function groupComparator(name: string, schema: Schema, opt: QueryConfig) {
  return (g1: SpecQueryModelGroup, g2: SpecQueryModelGroup) => {
    const m1 = getTopItem(g1);
    const m2 = getTopItem(g2);
    return getScore(m2, name, schema, opt).score - getScore(m1, name, schema, opt).score;
  };
}

export const EFFECTIVENESS = 'effectiveness';
register(EFFECTIVENESS, effectiveness.default);
