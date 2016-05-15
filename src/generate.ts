import {Mark} from 'vega-lite/src/mark';

import {ENCODING_CONSTRAINTS_BY_PROPERTY, EncodingConstraintModel} from './constraint/encoding';
import {SPEC_CONSTRAINTS_BY_PROPERTY, SpecConstraintModel} from './constraint/spec';


import {Property, ENCODING_PROPERTIES} from './property';
import {EnumSpec, QueryConfig, SpecQuery, SpecQueryModel, initEnumSpec, isEnumSpec} from './query';
import {Schema} from './Schema';
import {every} from './util';


export function generate(specQuery: SpecQuery, schema: Schema, opt: QueryConfig) {
  // 1. Detect enumeration specifiers, append them to enumJobs
  // and replace short enum specs with full ones.
  const enumJob = initEnumJobs(specQuery, schema, opt);

  // 2. Enumerate each of the properties based on propertyPrecedence.

  let answerSet = [new SpecQueryModel(specQuery)]; // Initialize Answer Set with only the input spec query.
  opt.propertyPrecedence.forEach((property) => {
    // If the original specQuery contains enumSpec for this property type
    if (enumJob[property]) {
      // update answerset
      answerSet = answerSet.reduce(generator[property](enumJob, schema, opt), []);
    }
  });

  return answerSet;
}


export interface EnumJob {
  /** Whether this enumerate job requires enumerating mask. */
  mark?: boolean;

  /** List of indices of encoding mappings that require channel enumeration. */
  channel?: number[];

  /** List of indices of encoding mappings that require aggregate enumeration. */
  aggregate?: number[];

  /** List of indices of encoding mappings that require bin enumeration. */
  bin?: number[];

  /** List of indices of encoding mappings that require timeUnit enumeration. */
  timeunit?: number[];

  /** List of indices of encoding mappings that require field enumeration. */
  field?: number[];

  /** List of indices of encoding mappings that require type enumeration. */
  type?: number[];
}


/**
 * Detect enumeration specifiers in the input specQuery and
 * replace short enum specs with full ones.
 *
 * @return an enumJob object.
 */
export function initEnumJobs(specQ: SpecQuery, schema: Schema, opt: QueryConfig): EnumJob {
  let enumJob: EnumJob = {};

  // FIXME replace 'M', 'C', 'A', etc. with proper constant names

  // mark
  if (isEnumSpec(specQ.mark)) {
    enumJob[Property.MARK] = true;
    specQ.mark = initEnumSpec(specQ.mark, 'm', opt.marks);
  }

  // TODO: transform

  // encodings
  specQ.encodings.forEach((encQ, index) => {
    // For each property of the encodingQuery, enumerate
    ENCODING_PROPERTIES.forEach((property) => {
      if(isEnumSpec(encQ[property])) {
        // Add index of the encoding mapping to the property's enum job.
        (enumJob[property] = enumJob[property] || []).push(index);

        // Assign default enum spec name and enum values.
        const defaultEnumSpecName = (property + '').substr(0, 1) + index;
        const defaultEnumValues = property === Property.FIELD ?
          // For field, by default enumerate all fields
          schema.fields():
          // For other properties, take default enumValues from config.
          // The config name for each property is a plural form of the property.
          opt[property+'s'];
        encQ[property] = initEnumSpec(encQ[property], defaultEnumSpecName, defaultEnumValues);
      }
    });
  });
  return enumJob;
}

export namespace generator {
  export function mark(enumJob: EnumJob, schema: Schema, opt: QueryConfig) {
    return (answerSets, specQ: SpecQueryModel) => {
      const markEnumSpec = specQ.getMark() as EnumSpec<Mark>;

      // enumerate the value
      markEnumSpec.enumValues.forEach((mark) => {
        specQ.setMark(mark);

        // Check spec constraint
        const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY[Property.MARK] || [];
        const satisfySpecConstraints = every(specConstraints, (c: SpecConstraintModel) => {
          return c.satisfy(specQ, schema);
        });

        if (satisfySpecConstraints) {
          // emit
          answerSets.push(specQ.duplicate());
        }
      });

      // Reset to avoid side effect
      specQ.setMark(markEnumSpec);

      return answerSets;
    };
  }

  export function channel(enumJob: EnumJob, schema: Schema, opt: QueryConfig) {
    return encoding(Property.CHANNEL, enumJob, schema, opt);
  }

  export function encoding(property: Property, enumJob: EnumJob, schema: Schema, opt: QueryConfig) {
    return (answerSets, specQ: SpecQueryModel) => {
      // index of encoding mappings that require enumeration
      const enumEncodingIndices: number[] = enumJob[property] as number[];

      function enumerate(jobIndex: number) {
        if (jobIndex === enumEncodingIndices.length) {
          // emit
          answerSets.push(specQ.duplicate());
        }
        const encodingIndex = enumEncodingIndices[jobIndex];
        const propEnumSpec = specQ.getEncodingProperty(encodingIndex, property);
        propEnumSpec.enumValues.forEach((propVal) => {
          specQ.setEncodingProperty(encodingIndex, property, propVal);

          // Check encoding constraint
          const encodingConstraints = ENCODING_CONSTRAINTS_BY_PROPERTY[property] || [];
          const satisfyEncodingConstraints = every(encodingConstraints, (c: EncodingConstraintModel) => {
            return c.satisfy(specQ.getEncodingQueryByIndex(encodingIndex), schema);
          });

          if (!satisfyEncodingConstraints) {
            return; // do not keep searching
          }

          // Check spec constraint
          const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY[property] || [];
          const satisfySpecConstraints = every(specConstraints, (c: SpecConstraintModel) => {
            return c.satisfy(specQ, schema);
          });

          if (!satisfySpecConstraints) {
            return; // do not keep searching
          }

          // If qualify all of the constraints, keep enumerating
          enumerate(jobIndex + 1);
        });

        // Reset to avoid side effect
        specQ.setEncodingProperty(encodingIndex, property, propEnumSpec);
      }

      // start enumerating from 0
      enumerate(0);
    };
  }
}
