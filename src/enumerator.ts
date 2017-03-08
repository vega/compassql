import {Mark} from 'vega-lite/build/src/mark';

import {QueryConfig} from './config';
import {checkEncoding} from './constraint/encoding';
import {checkSpec} from './constraint/spec';
import {WildcardIndex} from './wildcardindex';
import {SpecQueryModel} from './model';
import {Property, ENCODING_TOPLEVEL_PROPS, ENCODING_NESTED_PROPS} from './property';
import {PropIndex} from './propindex';
import {Wildcard} from './wildcard';
import {Schema} from './schema';
import {isValueQuery} from './query/encoding';

const ENUMERATOR_INDEX = new PropIndex<EnumeratorFactory>();

export interface Enumerator {
  (answerSets: SpecQueryModel[], specM: SpecQueryModel): SpecQueryModel[];
}

export function getEnumerator(prop: Property) {
  return ENUMERATOR_INDEX.get(prop);
}

export interface EnumeratorFactory {
  (wildcardIndex: WildcardIndex, schema: Schema, opt: QueryConfig): Enumerator;
}

ENUMERATOR_INDEX.set('mark', (wildcardIndex: WildcardIndex, schema: Schema, opt: QueryConfig): Enumerator => {
  return (answerSet, specM: SpecQueryModel) => {
    const markWildcard = specM.getMark() as Wildcard<Mark>;

    // enumerate the value
    markWildcard.enum.forEach((mark) => {
      specM.setMark(mark);
      // Check spec constraint
      const violatedSpecConstraint = checkSpec('mark', wildcardIndex.mark, specM, schema, opt);
      if (!violatedSpecConstraint) {
        // emit
        answerSet.push(specM.duplicate());
      }
    });

    // Reset to avoid side effect
    specM.resetMark();

    return answerSet;
  };
});

ENCODING_TOPLEVEL_PROPS.forEach((prop) => {
  ENUMERATOR_INDEX.set(prop, EncodingPropertyGeneratorFactory(prop));
});

ENCODING_NESTED_PROPS.forEach((nestedProp) => {
  ENUMERATOR_INDEX.set(nestedProp, EncodingPropertyGeneratorFactory(nestedProp));
});

/**
 * @param prop property type.
 * @return an answer set reducer factory for the given prop.
 */
export function EncodingPropertyGeneratorFactory(prop: Property): EnumeratorFactory {
  /**
   * @return as reducer that takes a specQueryModel as input and output an answer set array.
   */
  return (wildcardIndex: WildcardIndex, schema: Schema, opt: QueryConfig): Enumerator => {

    return (answerSet: SpecQueryModel[], specM: SpecQueryModel) => {
      // index of encoding mappings that require enumeration
      const indices = wildcardIndex.encodingIndicesByProperty.get(prop);

      function enumerate(jobIndex: number) {
        if (jobIndex === indices.length) {
          // emit and terminate
          answerSet.push(specM.duplicate());
          return;
        }
        const index = indices[jobIndex];
        const wildcard: Wildcard<any> = wildcardIndex.encodings[index].get(prop);
        const encQ = specM.getEncodingQueryByIndex(index);
        const propWildcard = specM.getEncodingProperty(index, prop);

        if (isValueQuery(encQ) || (
              // TODO: encQ.exclude
              // If this encoding query is an excluded autoCount, there is no point enumerating other properties
              // for this encoding query because they will be excluded anyway.
              // Thus, we can just move on to the next encoding to enumerate.
              encQ.autoCount === false ||
              // nested encoding property might have its parent set to false
              // therefore, we no longer have to enumerate them
              !propWildcard
            )
          ) { // TODO: encQ.excluded
          enumerate(jobIndex + 1);
        } else {
          wildcard.enum.forEach((propVal) => {
            if (propVal === null) {
              // our duplicate() method use JSON.stringify, parse and thus can accidentally
              // convert undefined in an array into null
              propVal = undefined;
            }
            specM.setEncodingProperty(index, prop, propVal, wildcard);

            // Check encoding constraint
            const violatedEncodingConstraint = checkEncoding(prop, wildcard, index, specM, schema, opt);
            if (violatedEncodingConstraint) {
              return; // do not keep searching
            }
            // Check spec constraint
            const violatedSpecConstraint = checkSpec(prop, wildcard, specM, schema, opt);
            if (violatedSpecConstraint) {
              return; // do not keep searching
            }
            // If qualify all of the constraints, keep enumerating
            enumerate(jobIndex + 1);
          });

          // Reset to avoid side effect
          specM.resetEncodingProperty(index, prop, wildcard);
        }
      }

      // start enumerating from 0
      enumerate(0);

      return answerSet;
    };
  };
}
