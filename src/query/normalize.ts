import {Query} from './query';
import {Nest} from './groupby';
import {duplicate} from '../util';

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
