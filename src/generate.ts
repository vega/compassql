import {ENUMERATOR_INDEX} from '../src/enumerator';

import {QueryConfig, DEFAULT_QUERY_CONFIG} from './config';
import {SpecQueryModel} from './model';
import {SpecQuery} from './query';
import {Schema} from './schema';
import {extend} from './util';

export function generate(specQ: SpecQuery, schema: Schema, opt: QueryConfig = {}) {
  opt = extend({}, DEFAULT_QUERY_CONFIG, opt);

  // 1. Build a SpecQueryModel, which also contains enumSpecIndex
  const specM = SpecQueryModel.build(specQ, schema, opt);
  const enumSpecIndex = specM.enumSpecIndex;

  // 2. Enumerate each of the properties based on propPrecedence.

  let answerSet = [specM]; // Initialize Answer Set with only the input spec query.
  opt.propertyPrecedence.forEach((prop) => {
    // If the original specQuery contains enumSpec for this prop type
    if (enumSpecIndex[prop]) {
      // update answerset
      const reducer = ENUMERATOR_INDEX[prop](enumSpecIndex, schema, opt);
      answerSet = answerSet.reduce(reducer, []);
    }
  });

  return answerSet;
}
