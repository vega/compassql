import {ENUMERATOR_INDEX} from '../src/enumerator';

import {QueryConfig, DEFAULT_QUERY_CONFIG} from './config';
import {SpecQueryModel} from './model';
import {SpecQuery} from './query/spec';
import {Schema} from './schema';
import {stylize} from './stylize';

export function generate(specQ: SpecQuery, schema: Schema, opt: QueryConfig = DEFAULT_QUERY_CONFIG) {
  // 1. Build a SpecQueryModel, which also contains wildcardIndex
  const specM = SpecQueryModel.build(specQ, schema, opt);
  const wildcardIndex = specM.wildcardIndex;

  // 2. Enumerate each of the properties based on propPrecedence.

  let answerSet = [specM]; // Initialize Answer Set with only the input spec query.
  opt.propertyPrecedence.forEach((prop) => {
    // If the original specQuery contains wildcard for this prop
    if (wildcardIndex.hasProperty(prop)) {
      // update answerset
      const reducer = ENUMERATOR_INDEX[prop](wildcardIndex, schema, opt);
      answerSet = answerSet.reduce(reducer, []);
    }
  });

  if (opt.stylize) {
    if ((opt.nominalColorScaleForHighCardinality !== null) ||
        (opt.smallRangeStepForHighCardinalityOrFacet !== null) ||
        (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
      return stylize(answerSet, schema, opt);
    }
  }

  return answerSet;
}
