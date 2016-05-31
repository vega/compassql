import {Mark} from 'vega-lite/src/mark';

// TODO: extract list of constraints into a constraint registry.

import {ENCODING_CONSTRAINTS_BY_PROPERTY, EncodingConstraintModel} from './constraint/encoding';
import {SPEC_CONSTRAINTS_BY_PROPERTY, SpecConstraintModel} from './constraint/spec';

import {EnumSpecIndex, EnumSpecIndexTuple, SpecQueryModel} from './model';
import {Property, ENCODING_PROPERTIES} from './property';
import {EnumSpec, QueryConfig, SpecQuery, DEFAULT_QUERY_CONFIG} from './query';
import {Schema} from './schema';
import {Stats} from './stats';
import {every, extend} from './util';

export let ENUMERATOR_INDEX: {[prop: string]: EnumeratorFactory} = {};

export function generate(specQuery: SpecQuery, schema: Schema, stats: Stats, opt: QueryConfig = {}) {
  opt = extend({}, DEFAULT_QUERY_CONFIG, opt);

  // 1. Build a SpecQueryModel, which also contains enumSpecIndex
  const specModel = SpecQueryModel.build(specQuery, schema, opt);
  const enumSpecIndex = specModel.enumSpecIndex;

  // 2. Enumerate each of the properties based on propPrecedence.

  let answerSet = [specModel]; // Initialize Answer Set with only the input spec query.
  opt.propertyPrecedence.forEach((prop) => {
    // If the original specQuery contains enumSpec for this prop type
    if (enumSpecIndex[prop]) {
      // update answerset
      const reducer = ENUMERATOR_INDEX[prop](enumSpecIndex, schema, stats, opt);
      answerSet = answerSet.reduce(reducer, []);
    }
  });

  return answerSet;
}


export interface Enumerator {
  (answerSets: SpecQueryModel[], specQ: SpecQueryModel): SpecQueryModel[];
}

export interface EnumeratorFactory {
  (enumSpecIndex: EnumSpecIndex, schema: Schema, stats: Stats, opt: QueryConfig): Enumerator;
}

ENUMERATOR_INDEX[Property.MARK] = (enumSpecIndex: EnumSpecIndex, schema: Schema, stats: Stats, opt: QueryConfig): Enumerator => {
  return (answerSet, specQ: SpecQueryModel) => {
    const markEnumSpec = specQ.getMark() as EnumSpec<Mark>;

    // enumerate the value
    markEnumSpec.enumValues.forEach((mark) => {
      specQ.setMark(mark);

      // Check spec constraint
      const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY[Property.MARK] || [];
      const satisfySpecConstraints = every(specConstraints, (c: SpecConstraintModel) => {
        // Check if the constraint is enabled
          if (c.strict() || !!opt[c.name()]) {
            // For strict constraint, or enabled non-strict, check the constraints
            const satisfy = c.satisfy(specQ, schema, stats, opt);
            if (!satisfy && opt.verbose) {
              console.log(c.name() + ' failed with ' + specQ.toShorthand() + ' for mark');
            }
            return satisfy;
          }
          // Otherwise, return true as we don't have to check the constraint yet.
          return true;
      });

      if (satisfySpecConstraints) {
        // emit
        answerSet.push(specQ.duplicate());
      }
    });

    // Reset to avoid side effect
    specQ.resetMark();

    return answerSet;
  };
};

ENCODING_PROPERTIES.forEach((prop) => {
  ENUMERATOR_INDEX[prop] = EncodingPropertyGeneratorFactory(prop);
});

/**
 * @return an answer set reducer factory for this type of prop.
 */
export function EncodingPropertyGeneratorFactory(prop: Property): EnumeratorFactory {
  /**
   * @return as reducer that takes specQ as input and output to an input answer set array.
   */
  return (enumSpecIndex: EnumSpecIndex, schema: Schema, stats: Stats, opt: QueryConfig): Enumerator => {

    return (answerSet: SpecQueryModel[], specQ: SpecQueryModel) => {
      // index of encoding mappings that require enumeration
      const indexTuples: EnumSpecIndexTuple<any>[] = enumSpecIndex[prop];

      function enumerate(jobIndex: number) {
        if (jobIndex === indexTuples.length) {
          // emit and terminate
          answerSet.push(specQ.duplicate());
          return;
        }
        const indexTuple = indexTuples[jobIndex];
        const propEnumSpec = specQ.getEncodingProperty(indexTuple.index, prop);
        propEnumSpec.enumValues.forEach((propVal) => {
          specQ.setEncodingProperty(indexTuple.index, prop, propVal, indexTuple.enumSpec);

          // Check encoding constraint
          const encodingConstraints = ENCODING_CONSTRAINTS_BY_PROPERTY[prop] || [];
          const satisfyEncodingConstraints = every(encodingConstraints, (c: EncodingConstraintModel) => {
            // Check if the constraint is enabled
            if (c.strict() || !!opt[c.name()]) {
              // For strict constraint, or enabled non-strict, check the constraints
              const satisfy = c.satisfy(specQ.getEncodingQueryByIndex(indexTuple.index), schema, stats, opt);
              if (!satisfy && opt.verbose) {
                console.log(c.name() + ' failed with ' + specQ.toShorthand() + ' for ' + indexTuple.enumSpec.name);
              }
              return satisfy;
            }

            // Otherwise, return true as we don't have to check the constraint yet.
            return true;
          });

          if (!satisfyEncodingConstraints) {
            return; // do not keep searching
          }

          // Check spec constraint
          const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY[prop] || [];
          const satisfySpecConstraints = every(specConstraints, (c: SpecConstraintModel) => {
            // Check if the constraint is enabled
            if (c.strict() || !!opt[c.name()]) {
              // For strict constraint, or enabled non-strict, check the constraints
              const satisfy = c.satisfy(specQ, schema, stats, opt);
              if (!satisfy && opt.verbose) {
                console.log(c.name() + ' failed with ' + specQ.toShorthand() + ' for ' + indexTuple.enumSpec.name);
              }
              return satisfy;
            }
            // Otherwise, return true as we don't have to check the constraint yet.
            return true;
          });

          if (!satisfySpecConstraints) {
            return; // do not keep searching
          }

          // If qualify all of the constraints, keep enumerating
          enumerate(jobIndex + 1);
        });

        // Reset to avoid side effect
        specQ.resetEncodingProperty(indexTuple.index, prop, indexTuple.enumSpec);
      }

      // start enumerating from 0
      enumerate(0);

      return answerSet;
    };
  };
}
