import {Mark} from 'vega-lite/src/mark';

import {QueryConfig} from './config';
import {checkEncoding} from './constraint/encoding';
import {checkSpec} from './constraint/spec';
import {EnumSpecIndex} from './enumspecindex';
import {SpecQueryModel} from './model';
import {Property, ENCODING_PROPERTIES, NESTED_ENCODING_PROPERTIES} from './property';
import {EnumSpec} from './enumspec';
import {Schema} from './schema';

export let ENUMERATOR_INDEX: {[prop: string]: EnumeratorFactory} = {};

export interface Enumerator {
  (answerSets: SpecQueryModel[], specM: SpecQueryModel): SpecQueryModel[];
}

export interface EnumeratorFactory {
  (enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig): Enumerator;
}

ENUMERATOR_INDEX[Property.MARK] = (enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig): Enumerator => {
  return (answerSet, specM: SpecQueryModel) => {
    const markEnumSpec = specM.getMark() as EnumSpec<Mark>;

    // enumerate the value
    markEnumSpec.enum.forEach((mark) => {
      specM.setMark(mark);
      // Check spec constraint
      const violatedSpecConstraint = checkSpec(Property.MARK, enumSpecIndex.mark, specM, schema, opt);
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
  return (enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig): Enumerator => {

    return (answerSet: SpecQueryModel[], specM: SpecQueryModel) => {
      // index of encoding mappings that require enumeration
      const indices = enumSpecIndex.encodingIndicesByProperty[prop];

      function enumerate(jobIndex: number) {
        if (jobIndex === indices.length) {
          // emit and terminate
          answerSet.push(specM.duplicate());
          return;
        }
        const index = indices[jobIndex];
        const enumSpec: EnumSpec<any> = enumSpecIndex.encodings[index][prop];
        const encQ = specM.getEncodingQueryByIndex(index);
        const propEnumSpec = specM.getEncodingProperty(index, prop);

        if (
            // TODO: encQ.exclude
            // If this encoding query is an excluded autoCount, there is no point enumerating other properties
            // for this encoding query because they will be excluded anyway.
            // Thus, we can just move on to the next encoding to enumerate.
            encQ.autoCount === false ||
            // nested encoding property might have its parent set to false
            // therefore, we no longer have to enumerate them
            !propEnumSpec
          ) { // TODO: encQ.excluded
          enumerate(jobIndex + 1);
        } else {
          enumSpec.enum.forEach((propVal) => {
            if (propVal === null) {
              // our duplicate() method use JSON.stringify, parse and thus can accidentally
              // convert undefined in an array into null
              propVal = undefined;
            }
            specM.setEncodingProperty(index, prop, propVal, enumSpec);

            // Check encoding constraint
            const violatedEncodingConstraint = checkEncoding(prop, enumSpec, index, specM, schema, opt);
            if (violatedEncodingConstraint) {
              return; // do not keep searching
            }
            // Check spec constraint
            const violatedSpecConstraint = checkSpec(prop, enumSpec, specM, schema, opt);
            if (violatedSpecConstraint) {
              return; // do not keep searching
            }
            // If qualify all of the constraints, keep enumerating
            enumerate(jobIndex + 1);
          });

          // Reset to avoid side effect
          specM.resetEncodingProperty(index, prop, enumSpec);
        }
      }

      // start enumerating from 0
      enumerate(0);

      return answerSet;
    };
  };
}
