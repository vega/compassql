import {PropertyType, Schema, SpecQueryModel, isEnumSpec} from '../schema';
import {every, some} from '../util';
import {AbstractConstraint, AbstractConstraintModel} from './base';

export interface SpecConstraintChecker {
  (specQ: SpecQueryModel, schema: Schema): boolean;
}

export class SpecConstraintModel extends AbstractConstraintModel {
  constructor(specConstraint: SpecConstraint) {
    super(specConstraint);
  }

  public satisfy(specQ: SpecQueryModel, schema: Schema) {
    if (this.constraint.requireAllProperties) {
      // TODO: extract as a method and do unit test
      const hasRequiredPropertyAsEnumSpec = some(this.constraint.propertyTypes,
        (propertyType) => {
          switch(propertyType) {
            // Mark
            case PropertyType.MARK:
              return isEnumSpec(specQ.getMark());

            // TODO: transform

            // Encoding properties
            case PropertyType.CHANNEL:
            case PropertyType.AGGREGATE:
            case PropertyType.BIN:
            case PropertyType.TIMEUNIT:
            case PropertyType.FIELD:
            case PropertyType.TYPE:
              return some(specQ.getEncodings(), (encodingQuery) => {
                return isEnumSpec(encodingQuery[propertyType]);
              });
            default:
              throw new Error('Unimplemnted');
          }
        }
      );
      // If one of the required property is still an enum spec, do not check the constraint yet.
      if (hasRequiredPropertyAsEnumSpec) {
        return true; // Return true since the query still satisfy the constraint.
      }
    }
    return (this.constraint as SpecConstraint).satisfy(specQ, schema);
  }
}

export interface SpecConstraint extends AbstractConstraint {
  /** Method for checking if the spec query satisfies this constraint. */
  satisfy: SpecConstraintChecker;
}

export const SPEC_CONSTRAINTS: SpecConstraintModel[] = [
  {
    name: 'noRepeatChannel',
    description: 'Each encoding channel should only be used once.',
    propertyTypes: [PropertyType.CHANNEL],
    requireAllProperties: false,
    strict: true,
    satisfy: (specQ: SpecQueryModel, schema: Schema) => {
      let usedChannel = {};

      // channel for all encodings should be valid
      return every(specQ.getEncodings(), (encQ) => {
        if (!isEnumSpec(encQ.channel)) {
          // If channel is specified, it should no be used already
          if (usedChannel[encQ.channel]) {
            return false;
          }
          usedChannel[encQ.channel] = true;
          return true;
        }
        return true; // unspecified channel is valid
      });
    }
  }
].map((sc) => new SpecConstraintModel(sc));

export const SPEC_CONSTRAINT_INDEX: {[name: string]: SpecConstraintModel} =
  SPEC_CONSTRAINTS.reduce((m: any, c: SpecConstraintModel) => {
    m[c.name()] = c;
    return m;
  }, {});

export const SPEC_CONSTRAINTS_BY_PROPERTY: {[propertyType: string]: SpecConstraintModel[]} =
   SPEC_CONSTRAINTS.reduce((m, c: SpecConstraintModel) => {
    c.propertyTypes().forEach((propertyType) => {
      m[propertyType] = m[propertyType] || [];
      m[propertyType].push(c);
    });
    return m;
  }, {});
