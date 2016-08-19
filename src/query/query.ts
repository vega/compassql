import {Config} from 'vega-lite/src/config';

import {SpecQuery} from './spec';
import {GroupBy} from './groupby';

import {QueryConfig, DEFAULT_QUERY_CONFIG} from '../config';
import {generate} from '../generate';
import {nest} from '../nest';
import {rank} from '../ranking/ranking';
import {Schema} from '../schema';
import {duplicate, extend} from '../util';

export import encoding = require('./encoding');
export import groupBy = require('./groupby');
export import shorthand = require('./shorthand');
export import spec = require('./spec');
export import transform = require('./transform');

export function query(q: Query, schema: Schema, config?: Config) {
  // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
  //    and merge config with the following precedence
  //    query.config > config > DEFAULT_QUERY_CONFIG
  q = extend({}, normalize(q), {
    config: extend({}, DEFAULT_QUERY_CONFIG, config, q.config)
  });

  // 2. Generate
  const answerSet = generate(q.spec, schema, q.config);
  const nestedAnswerSet = nest(answerSet, q);
  const result = rank(nestedAnswerSet, q, schema, 0);

  return {
    query: q,
    result: result
  };
}

/**
 * Normalize the non-nested version of the query to a standardize nested
 */
export function normalize(q: Query): Query {
  if (q.groupBy) {
    let nest: Nest = {
      groupBy: q.groupBy
    };

    if (q.orderBy) {
      nest.orderGroupBy = q.orderBy;
    }

    let normalizedQ: Query = {
      spec: duplicate(q.spec), // We will cause side effect to q.spec in SpecQueryModel.build
      nest: [nest],
    };

    if (q.chooseBy) {
      normalizedQ.chooseBy = q.chooseBy;
    }

    if (q.config) {
      normalizedQ.config = q.config;
    }

    return normalizedQ;
  }
  return duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
}

export interface Query {
  spec: SpecQuery;
  nest?: Nest[];
  groupBy?: GroupBy;
  orderBy?: string | string[];
  chooseBy?: string | string[];
  config?: QueryConfig;
}

export interface Nest {
  groupBy: GroupBy;
  orderGroupBy?: string | string[];
}
