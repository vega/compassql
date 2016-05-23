import {Mark} from 'vega-lite/src/mark';

// TODO: extract list of constraints into a constraint registry.

import {ENCODING_CONSTRAINTS_BY_PROPERTY, EncodingConstraintModel} from './constraint/encoding';
import {SPEC_CONSTRAINTS_BY_PROPERTY, SpecConstraintModel} from './constraint/spec';

import {EnumSpecIndex, EnumSpecIndexTuple, SpecQueryModel} from './model';
import {Property, ENCODING_PROPERTIES} from './property';
import {EnumSpec, QueryConfig, SpecQuery, DEFAULT_QUERY_CONFIG} from './query';
import {Schema} from './Schema';
import {every, extend} from './util';

export let ENUMERATOR_INDEX: {[property: string]: EnumeratorFactory} = {};

export function generate(specQuery: SpecQuery, schema: Schema, opt: QueryConfig = {}) {
  opt = extend({}, DEFAULT_QUERY_CONFIG, opt);

  // 1. Build a SpecQueryModel, which also contains enumSpecIndex
  const specModel = SpecQueryModel.build(specQuery, schema, opt);
  const enumSpecIndex = specModel.enumSpecIndex;

  // 2. Enumerate each of the properties based on propertyPrecedence.

  let answerSet = [specModel]; // Initialize Answer Set with only the input spec query.
  opt.propertyPrecedence.forEach((property) => {
    // If the original specQuery contains enumSpec for this property type
    if (enumSpecIndex[property]) {
      // update answerset
      answerSet = answerSet.reduce(ENUMERATOR_INDEX[property](enumSpecIndex, schema, opt), []);
    }
  });

  return answerSet;
}


export interface Enumerator {
  (answerSets: SpecQueryModel[], specQ: SpecQueryModel): SpecQueryModel[];
}

export interface EnumeratorFactory {
  (enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig): Enumerator;
}

ENUMERATOR_INDEX[Property.MARK] = (enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig): Enumerator => {
  return (answerSet, specQ: SpecQueryModel) => {
    const markEnumSpec = specQ.getMark() as EnumSpec<Mark>;

    // enumerate the value
    markEnumSpec.enumValues.forEach((mark) => {
      specQ.setMark(mark);

      // Check spec constraint
      const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY[Property.MARK] || [];
      const satisfySpecConstraints = every(specConstraints, (c: SpecConstraintModel) => {
        // Check if the constraint is enabled
            return c.strict() || !!opt[c.name()] ?
              // For strict constraint, or enabled non-strict, check the constraints
              c.satisfy(specQ, schema, opt) :
              // Otherwise, return true as we don't have to check the constraint yet.
              true;
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

ENCODING_PROPERTIES.forEach((property) => {
  ENUMERATOR_INDEX[property] = EncodingPropertyGeneratorFactory(property);
});

/**
 * @return an answer set reducer factory for this type of property.
 */
export function EncodingPropertyGeneratorFactory(property: Property) {
  /**
   * @return as reducer that takes specQ as input and output to an input answer set array.
   */
  return (enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig) => {

    return (answerSet: SpecQueryModel[], specQ: SpecQueryModel) => {
      // index of encoding mappings that require enumeration
      const indexTuples: EnumSpecIndexTuple<any>[] = enumSpecIndex[property];

      function enumerate(jobIndex: number) {
        if (jobIndex === indexTuples.length) {
          // emit and terminate
          answerSet.push(specQ.duplicate());
          return;
        }
        const indexTuple = indexTuples[jobIndex];
        const propEnumSpec = specQ.getEncodingProperty(indexTuple.index, property);
        propEnumSpec.enumValues.forEach((propVal) => {
          specQ.setEncodingProperty(indexTuple.index, property, propVal, indexTuple.enumSpec);

          // Check encoding constraint
          const encodingConstraints = ENCODING_CONSTRAINTS_BY_PROPERTY[property] || [];
          const satisfyEncodingConstraints = every(encodingConstraints, (c: EncodingConstraintModel) => {
            // Check if the constraint is enabled
            return c.strict() || !!opt[c.name()] ?
              // For strict constraint, or enabled non-strict, check the constraints
              c.satisfy(specQ.getEncodingQueryByIndex(indexTuple.index), schema, opt) :
              // Otherwise, return true as we don't have to check the constraint yet.
              true;
          });

          if (!satisfyEncodingConstraints) {
            return; // do not keep searching
          }

          // Check spec constraint
          const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY[property] || [];
          const satisfySpecConstraints = every(specConstraints, (c: SpecConstraintModel) => {
            // Check if the constraint is enabled
            return c.strict() || !!opt[c.name()] ?
              // For strict constraint, or enabled non-strict, check the constraints
              c.satisfy(specQ, schema, opt) :
              // Otherwise, return true as we don't have to check the constraint yet.
              true;
          });

          if (!satisfySpecConstraints) {
            return; // do not keep searching
          }

          // If qualify all of the constraints, keep enumerating
          enumerate(jobIndex + 1);
        });

        // Reset to avoid side effect
        specQ.resetEncodingProperty(indexTuple.index, property, indexTuple.enumSpec);
      }

      // start enumerating from 0
      enumerate(0);

      return answerSet;
    };
  };
}
