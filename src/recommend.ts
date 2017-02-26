import {Query, normalize} from './query/query';
import {Schema} from './schema';
import {Config} from 'vega-lite/src/config';
import {SpecQueryModelGroup} from './model';
import {DEFAULT_QUERY_CONFIG} from './config';
import {generate} from './generate';
import {nest} from './nest';
import {rank} from './ranking/ranking';

export function recommend(q: Query, schema: Schema, config?: Config): {query: Query, result: SpecQueryModelGroup} {
  // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
  //    and merge config with the following precedence
  //    query.config > config > DEFAULT_QUERY_CONFIG
  q = {
    ...normalize(q),
    config: {
      ...DEFAULT_QUERY_CONFIG,
      ...config,
      ...q.config
    }
  };
  // 2. Generate
  const answerSet = generate(q.spec, schema, q.config);
  const nestedAnswerSet = nest(answerSet, q);
  const result = rank(nestedAnswerSet, q, schema, 0);

  return {
    query: q,
    result: result
  };
}
