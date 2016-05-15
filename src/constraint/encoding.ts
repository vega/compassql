import {Type} from 'vega-lite/src/type';

import {EncodingQuery, PropertyType, Schema} from '../schema';
import {isEnumSpec} from '../schema';
import {some} from '../util';

import {AbstractConstraint, AbstractConstraintModel} from './base';

/**
 * Collection of constraints for a single encoding mapping.
 */

/** A method for satisfying whether the provided encoding query satisfy the constraint. */
export interface EncodingConstraintChecker {
  (encodingQ: EncodingQuery, schema: Schema): boolean;
}

export class EncodingConstraintModel extends AbstractConstraintModel {
  constructor(constraint: EncodingConstraint) {
    super(constraint);
  }

  public satisfy(encodingQ: EncodingQuery, schema: Schema): boolean {
    if (this.constraint.requireAllProperties) {
      // TODO: extract as a method and do unit test
      const hasRequiredPropertyAsEnumSpec = some(
        this.constraint.propertyTypes,
        (propertyType) => isEnumSpec(encodingQ[propertyType])
      );
      // If one of the required property is still an enum spec, do not check the constraint yet.
      if (hasRequiredPropertyAsEnumSpec) {
        return true; // Return true since the query still satisfy the constraint.
      }
    }
    return (this.constraint as EncodingConstraint).satisfy(encodingQ, schema);
  }
}

/** Constraint for a single encoding mapping */
export interface EncodingConstraint extends AbstractConstraint {
  /** Method for checking if the encoding query satisfies this constraint. */
  satisfy: EncodingConstraintChecker;
}

export const ENCODING_CONSTRAINTS: EncodingConstraintModel[] = [
  {
    name: 'aggregateOpSupportedByType',
    description: 'Aggregate function should be supported by data type.',
    propertyTypes: [PropertyType.TYPE, PropertyType.AGGREGATE],
    requireAllProperties: true,
    strict: true,
    satisfy: (encodingQ: EncodingQuery, schema: Schema) => {
      if (encodingQ.aggregate) {
        return encodingQ.type !== Type.ORDINAL && encodingQ.type !== Type.NOMINAL;
      }
      // TODO: some aggregate function are actually supported by ordinal
      return true; // no aggregate is okay with any type.
    }
  },
  {
    name: 'onlyOneTypeOfFunction',
    description: 'Only of of aggregate, timeUnit, or bin should be applied at the same time.',
    propertyTypes: [PropertyType.AGGREGATE, PropertyType.TIMEUNIT, PropertyType.BIN],
    requireAllProperties: false,
    strict: true,
    satisfy: (encodingQ: EncodingQuery, schema: Schema) => {
      const numFn = (!isEnumSpec(encodingQ.aggregate) && !!encodingQ.aggregate ? 1 : 0) +
        (!isEnumSpec(encodingQ.bin) && !!encodingQ.bin ? 1 : 0) +
        (!isEnumSpec(encodingQ.timeUnit) && !!encodingQ.timeUnit ? 1 : 0);
      return numFn <= 1;
    }
  },
  {
    name: 'timeUnitAppliedForTemporal',
    description: 'Time unit should be applied to temporal field only.',
    propertyTypes: [PropertyType.TYPE, PropertyType.TIMEUNIT],
    requireAllProperties: true,
    strict: true,
    satisfy: (encodingQ: EncodingQuery, schema: Schema) => {
      if (encodingQ.timeUnit && encodingQ.type !== Type.TEMPORAL) {
        return false;
      }
      return false;
    }
  // TODO: fill the rest of this
  // },{
  //   name: 'binAppliedForQuantitative',
  //   description: 'bin should be applied to quantitative field only.',
  //   propertyTypes: [PropertyType.TYPE, PropertyType.BIN]
  },
  {
    name: 'typeMatchesPrimitiveType',
    description: 'Data type should be supported by field\'s primitive type.',
    propertyTypes: [PropertyType.FIELD, PropertyType.TYPE],
    requireAllProperties: true,
    strict: true,
    satisfy: (encodingQ: EncodingQuery, schema: Schema) => {
      if (!isEnumSpec(encodingQ.field) && !isEnumSpec(encodingQ.type)) {
        // FIXME read schema
      }
      return true;
    }
  }
  // TODO: scaleType must match data type
].map((ec: EncodingConstraint) => new EncodingConstraintModel(ec));

export const ENCODING_CONSTRAINT_INDEX: {[name: string]: EncodingConstraintModel} =
  ENCODING_CONSTRAINTS.reduce((m, ec: EncodingConstraintModel) => {
    m[ec.name()] = ec;
    return m;
  }, {});

export const ENCODING_CONSTRAINTS_BY_PROPERTY: {[propertyType: string]: EncodingConstraintModel[]} =
  ENCODING_CONSTRAINTS.reduce((m, c: EncodingConstraintModel) => {
    c.propertyTypes().forEach((propertyType) => {
      m[propertyType] = m[propertyType] || [];
      m[propertyType].push(c);
    });
    return m;
  }, {});
