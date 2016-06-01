import {Mark} from 'vega-lite/src/mark';

import {checkEncoding} from './constraint/encoding';
import {checkSpec} from './constraint/spec';

import {EnumSpecIndex, EnumSpecIndexTuple, SpecQueryModel} from './model';
import {Property, ENCODING_PROPERTIES, NESTED_ENCODING_PROPERTIES} from './property';
import {EnumSpec, QueryConfig, SpecQuery, DEFAULT_QUERY_CONFIG} from './query';
import {Schema} from './schema';
import {Stats} from './stats';
import {extend} from './util';

export let ENUMERATOR_INDEX: {[prop: string]: EnumeratorFactory} = {};

export function generate(specQ: SpecQuery, schema: Schema, stats: Stats, opt: QueryConfig = {}) {
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
      const reducer = ENUMERATOR_INDEX[prop](enumSpecIndex, schema, stats, opt);
      answerSet = answerSet.reduce(reducer, []);
    }
  });

  return answerSet;
}


export interface Enumerator {
  (answerSets: SpecQueryModel[], specM: SpecQueryModel): SpecQueryModel[];
}

export interface EnumeratorFactory {
  (enumSpecIndex: EnumSpecIndex, schema: Schema, stats: Stats, opt: QueryConfig): Enumerator;
}

ENUMERATOR_INDEX[Property.MARK] = (enumSpecIndex: EnumSpecIndex, schema: Schema, stats: Stats, opt: QueryConfig): Enumerator => {
  return (answerSet, specM: SpecQueryModel) => {
    const markEnumSpec = specM.getMark() as EnumSpec<Mark>;

    // enumerate the value
    markEnumSpec.values.forEach((mark) => {
      specM.setMark(mark);
      // Check spec constraint
      const violatedSpecConstraint = checkSpec(Property.MARK, enumSpecIndex.mark, specM, schema, stats, opt);
      if (!violatedSpecConstraint) {
        // emit
        answerSet.push(specM.duplicate());
      }
    });

    // Reset to avoid side effect
    specM.resetMark();

    return answerSet;
  };
};

ENCODING_PROPERTIES.forEach((prop) => {
  ENUMERATOR_INDEX[prop] = EncodingPropertyGeneratorFactory(prop);
});

NESTED_ENCODING_PROPERTIES.forEach((nestedProp) => {
  ENUMERATOR_INDEX[nestedProp.property] = EncodingPropertyGeneratorFactory(nestedProp.property);
});

/**
 * @param prop property type.
 * @return an answer set reducer factory for the given prop.
 */
export function EncodingPropertyGeneratorFactory(prop: Property): EnumeratorFactory {
  /**
   * @return as reducer that takes a specQueryModel as input and output an answer set array.
   */
  return (enumSpecIndex: EnumSpecIndex, schema: Schema, stats: Stats, opt: QueryConfig): Enumerator => {

    return (answerSet: SpecQueryModel[], specM: SpecQueryModel) => {
      // index of encoding mappings that require enumeration
      const indexTuples: EnumSpecIndexTuple<any>[] = enumSpecIndex[prop];

      function enumerate(jobIndex: number) {
        if (jobIndex === indexTuples.length) {
          // emit and terminate
          answerSet.push(specM.duplicate());
          return;
        }
        const indexTuple = indexTuples[jobIndex];
        const encQ = specM.getEncodingQueryByIndex(indexTuple.index);

        if (encQ.autoCount === false) { // TODO: encQ.excluded
          // If this encoding query is excluded, there is no point enumerating other properties
          // for this encoding query because they will be excluded anyway.
          // Thus, we can just move on to the next encoding to enumerate.
          enumerate(jobIndex + 1);
        } else {
          const propEnumSpec = specM.getEncodingProperty(indexTuple.index, prop);
          propEnumSpec.values.forEach((propVal) => {
            if (propVal === null) {
              // our duplicate() method use JSON.stringify, parse and thus can accidentally
              // convert undefined in an array into null
              propVal = undefined;
            }
            specM.setEncodingProperty(indexTuple.index, prop, propVal, indexTuple.enumSpec);

            // Check encoding constraint
            const violatedEncodingConstraint = checkEncoding(prop, indexTuple, specM, schema, stats, opt);
            if (violatedEncodingConstraint) {
              return; // do not keep searching
            }
            // Check spec constraint
            const violatedSpecConstraint = checkSpec(prop, indexTuple, specM, schema, stats, opt);
            if (violatedSpecConstraint) {
              return; // do not keep searching
            }
            // If qualify all of the constraints, keep enumerating
            enumerate(jobIndex + 1);
          });

          // Reset to avoid side effect
          specM.resetEncodingProperty(indexTuple.index, prop, indexTuple.enumSpec);
        }
      }

      // start enumerating from 0
      enumerate(0);

      return answerSet;
    };
  };
}
