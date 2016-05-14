import {Mark} from 'vega-lite/src/mark';

import {EnumJob, EnumSpec, PropertyType, QueryConfig, SpecQuery, SHORT_ENUM_SPEC, initEnumSpec, isEnumSpec} from './schema';
import {duplicate} from './util';

export function generate(specQuery: SpecQuery, schema: any /*FIXME*/, opt: QueryConfig) {
  // 0. Initialize Answer Set with the input spec query as the only answer.
  let answerSet = [specQuery];

  // 1. Detect enumeration specifiers, append them to enumJobs
  const enumJob = initEnumJobs(specQuery, schema, opt);

  // 2. Enumerate each of the properties based on propertyTypePrecedence.
  opt.propertyTypePrecedence.forEach(function(propertyType) {
    // If the original specQuery contains enumSpec for this property type
    if (enumJob[propertyType]) {
      // update answerset
      answerSet = answerSet.reduce(generator[propertyType](opt), []);
    }
  });
}

/**
 * Detect enumeration specifiers in the input specQuery and
 * replace short enum specs with full ones.
 *
 * @return an enumJob object.
 */
export function initEnumJobs(specQ: SpecQuery, schema: any, opt: QueryConfig): EnumJob {
  let enumJob: EnumJob = {};

  // FIXME replace 'M', 'C', 'A', etc. with proper constant names

  // mark
  if (isEnumSpec(specQ.mark)) {
    enumJob[PropertyType.MARK] = true;
    specQ.mark = initEnumSpec(specQ.mark, 'm', opt.marks);
  }

  // TODO: transform

  // encodings
  specQ.encodings.forEach((encQ, index) => {
    // For each property of the encodingQuery, enumerate
    ENCODING_PROPERTIES.forEach((propertyType) => {
      if(isEnumSpec(encQ[propertyType])) {
        // Add index of the encoding mapping to the property's enum job.
        (enumJob[propertyType] = enumJob[propertyType] || []).push(index);

        // Assign default enum spec name and enum values.
        const defaultEnumSpecName = (propertyType + '').substr(0, 1) + index;
        const defaultEnumValues = propertyType === PropertyType.FIELD ?
          // For field, by default enumerate all fields
          schema.map((schemaFieldDef) => schemaFieldDef.field):
          // For other properties, take default enumValues from config.
          // The config name for each property is a plural form of the property.
          opt[propertyType+'s'];
        encQ[propertyType] = initEnumSpec(encQ[propertyType], defaultEnumSpecName, defaultEnumValues);
      }
    });
  });
  return enumJob;
}


        }


  }

  }


        }


          });
          }

        });
    };
  }
}
