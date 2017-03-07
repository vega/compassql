import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {Property} from '../property';
import {Wildcard} from '../wildcard';
import {Schema} from '../schema';

import {isValueQuery} from '../query/encoding';
import {FIELD_CONSTRAINTS_BY_PROPERTY} from './field';
import {VALUE_CONSTRAINTS_BY_PROPERTY} from './value';

/**
 * Check all encoding constraints for a particular property and index tuple
 */
export function checkEncoding(prop: Property, wildcard: Wildcard<any>, index: number,
  specM: SpecQueryModel, schema: Schema, opt: QueryConfig): string {

  // Check encoding constraint
  const encodingConstraints = FIELD_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
  const encQ = specM.getEncodingQueryByIndex(index);

  for (const c of encodingConstraints) {
    // Check if the constraint is enabled
    if (c.strict() || !!opt[c.name()]) {
      // For strict constraint, or enabled non-strict, check the constraints

      const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
      if (!satisfy) {
        let violatedConstraint = '(enc) ' + c.name();
        /* istanbul ignore if */
        if (opt.verbose) {
          console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
        }
        return violatedConstraint;
      }
    }
  }

  const valueContraints = VALUE_CONSTRAINTS_BY_PROPERTY.get(prop) || [];

  for (const c of valueContraints) {
    // Check if the constraint is enabled
    if ((c.strict() || !!opt[c.name()]) && isValueQuery(encQ)) {
      // For strict constraint, or enabled non-strict, check the constraints
      const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
      if (!satisfy) {
        let violatedConstraint = '(enc) ' + c.name();
        /* istanbul ignore if */
        if (opt.verbose) {
          console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
        }
        return violatedConstraint;
      }
    }
  }
  return null;
}
