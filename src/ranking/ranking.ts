import {QueryConfig} from '../config';
import {SpecQueryModel, SpecQueryModelGroup} from '../model';
import {Query} from '../query/query';
import {Dict} from '../util';
import {Schema} from '../schema';

export import effectiveness = require('./effectiveness/effectiveness');
export import aggregation = require('./aggregation');

export interface RankingScore {
  score: number;
  features: FeatureScore[];
}

export interface FeatureScore {
  score: number;
  type: string;
  feature: string;
}

export interface FeatureInitializer {
  (): Dict<number>;
}

export interface Featurizer {
  (specM: SpecQueryModel, schema: Schema, opt: QueryConfig): FeatureScore[];
}

export interface FeatureFactory {
  type: string;
  init: FeatureInitializer;
  getScore: Featurizer;
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
        if (group.items.length > 0) {
          // for chooseBy -- only keep the top-item
          group.items.splice(1);
        }
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

export function comparator(name: string | string[], schema: Schema, opt: QueryConfig) {
  return (m1: SpecQueryModel, m2: SpecQueryModel) => {
    if (name instanceof Array) {
      return getScoreDifference(name, m1, m2, schema, opt);

    } else {
      return getScore(m2, name, schema, opt).score - getScore(m1, name, schema, opt).score;
    }
  };
}

export function groupComparator(name: string | string[], schema: Schema, opt: QueryConfig) {
  return (g1: SpecQueryModelGroup, g2: SpecQueryModelGroup) => {
    const m1 = g1.getTopSpecQueryModel();
    const m2 = g2.getTopSpecQueryModel();
    if (name instanceof Array) {
      return getScoreDifference(name, m1, m2, schema, opt);
    } else {
      return getScore(m2, name, schema, opt).score - getScore(m1, name, schema, opt).score;
    }
  };
}

function getScoreDifference(name: string[], m1: SpecQueryModel, m2: SpecQueryModel, schema, opt): number {
    let scoreDifference = getScore(m2, name[0], schema, opt).score - getScore(m1, name[0], schema, opt).score;
    for (let i = 1; i < name.length; i++) {
      if (scoreDifference !== 0) {
        break;
      }
      scoreDifference = getScore(m2, name[i], schema, opt).score - getScore(m1, name[i], schema, opt).score;
    }
    return scoreDifference;
}

export const EFFECTIVENESS = 'effectiveness';
register(EFFECTIVENESS, effectiveness.default);

register(aggregation.name, aggregation.score);
