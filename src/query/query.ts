

import {SpecQuery} from './spec';
import {GroupBy} from './groupby';

import {QueryConfig} from '../config';
import {duplicate} from '../util';

export import encoding = require('./encoding');
export import groupBy = require('./groupby');
export import shorthand = require('./shorthand');
export import spec = require('./spec');
export import transform = require('./transform');


/**
 * Normalize the non-nested version of the query to a standardize nested
 */
export function normalize(q: Query): Query {
  let normalizedQ: Query = {
    spec: duplicate(q.spec), // We will cause side effect to q.spec in SpecQueryModel.build
  };

  if (q.groupBy && !q.nest) {
    let groupByNest: Nest = {
      groupBy: q.groupBy
    };

    if (q.orderBy) {
      groupByNest.orderGroupBy = q.orderBy;
    }
    normalizedQ.nest = [groupByNest];
  }

  if (q.chooseBy) {
    normalizedQ.chooseBy = q.chooseBy;
  }

  if (q.config) {
    normalizedQ.config = q.config;
  }

  return normalizedQ;
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
