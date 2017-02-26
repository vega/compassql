import {QueryConfig} from '../config';
import {SpecQueryModel, SpecQueryModelGroup} from '../model';
import {Query} from '../query/query';
import {Dict} from '../util';
import {Schema} from '../schema';
import {effectiveness} from './effectiveness';


export * from './effectiveness';
export import aggregation = require('./aggregation');
export import fieldOrder = require('./fieldorder');

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
      group.items.sort(comparatorFactory(query.orderBy || query.chooseBy, schema, query.config));
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
      group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
    }
  }
  return group;
}

export function comparatorFactory(name: string | string[], schema: Schema, opt: QueryConfig) {
  return (m1: SpecQueryModel, m2: SpecQueryModel) => {
    if (name instanceof Array) {
      return getScoreDifference(name, m1, m2, schema, opt);
    } else {
      return getScoreDifference([name], m1, m2, schema, opt);
    }
  };
}

export function groupComparatorFactory(name: string | string[], schema: Schema, opt: QueryConfig) {
  return (g1: SpecQueryModelGroup, g2: SpecQueryModelGroup) => {
    const m1 = g1.getTopSpecQueryModel();
    const m2 = g2.getTopSpecQueryModel();
    if (name instanceof Array) {
      return getScoreDifference(name, m1, m2, schema, opt);
    } else {
      return getScoreDifference([name], m1, m2, schema, opt);
    }
  };
}

function getScoreDifference(name: string[], m1: SpecQueryModel, m2: SpecQueryModel, schema: Schema, opt: QueryConfig): number {
  for (let rankingName of name) {
    let scoreDifference = getScore(m2, rankingName, schema, opt).score - getScore(m1, rankingName, schema, opt).score;
    if (scoreDifference !== 0) {
      return scoreDifference;
    }
  }
  return 0;
}

export function getScore(model: SpecQueryModel, rankingName: string, schema: Schema, opt: QueryConfig) {
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
