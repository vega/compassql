import {Type} from 'vega-lite/src/type';

import {Property} from '../property';
import {EncodingQuery, isEnumSpec, QueryConfig} from '../query';
import {PrimitiveType, Schema} from '../schema';
import {some} from '../util';

import {AbstractConstraint, AbstractConstraintModel} from './base';

/**
 * Collection of constraints for a single encoding mapping.
 */

/** A method for satisfying whether the provided encoding query satisfy the constraint. */
export interface EncodingConstraintChecker {
  (encQ: EncodingQuery, schema: Schema, opt: QueryConfig): boolean;
}

export class EncodingConstraintModel extends AbstractConstraintModel {
  constructor(constraint: EncodingConstraint) {
    super(constraint);
  }

  public satisfy(encQ: EncodingQuery, schema: Schema, opt: QueryConfig): boolean {
    // TODO: Re-order logic to optimize the "requireAllProperties" check
    if (this.constraint.requireAllProperties) {
      // TODO: extract as a method and do unit test
      const hasRequiredPropertyAsEnumSpec = some(
        this.constraint.properties,
        (property) => isEnumSpec(encQ[property])
      );
      // If one of the required property is still an enum spec, do not check the constraint yet.
      if (hasRequiredPropertyAsEnumSpec) {
        return true; // Return true since the query still satisfy the constraint.
      }
    }
    return (this.constraint as EncodingConstraint).satisfy(encQ, schema, opt);
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
    properties: [Property.TYPE, Property.AGGREGATE],
    requireAllProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      if (encQ.aggregate) {
        return encQ.type !== Type.ORDINAL && encQ.type !== Type.NOMINAL;
      }
      // TODO: some aggregate function are actually supported by ordinal
      return true; // no aggregate is okay with any type.
    }
  // TODO: minCardinalityForBin
  // TODO: omitBinWithLogScale
  },{
    name: 'binAppliedForQuantitative',
    description: 'bin should be applied to quantitative field only.',
    properties: [Property.TYPE, Property.BIN],
    requireAllProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      if (encQ.bin) {
        // If binned, the type must be quantitative
        return encQ.type === Type.QUANTITATIVE;
      }
      return true;
    }
  // TODO: channelsSupportRoles
  },{
    name: 'onlyOneTypeOfFunction',
    description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN],
    requireAllProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      const numFn = (!isEnumSpec(encQ.aggregate) && !!encQ.aggregate ? 1 : 0) +
        (!isEnumSpec(encQ.autoCount) && !!encQ.autoCount ? 1 : 0) +
        (!isEnumSpec(encQ.bin) && !!encQ.bin ? 1 : 0) +
        (!isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit ? 1 : 0);
      return numFn <= 1;
    }
  },{
    name: 'timeUnitAppliedForTemporal',
    description: 'Time unit should be applied to temporal field only.',
    properties: [Property.TYPE, Property.TIMEUNIT],
    requireAllProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      if (encQ.timeUnit && encQ.type !== Type.TEMPORAL) {
        return false;
      }
      return true;
    }
  },
  {
    name: 'typeMatchesPrimitiveType',
    description: 'Data type should be supported by field\'s primitive type.',
    properties: [Property.FIELD, Property.TYPE],
    requireAllProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      const primitiveType = schema.primitiveType(encQ.field as string);
      const type = encQ.type;

      switch (primitiveType) {
        case PrimitiveType.BOOLEAN:
        case PrimitiveType.STRING:
          return type !== Type.QUANTITATIVE && type !== Type.TEMPORAL;
        case PrimitiveType.NUMBER:
        case PrimitiveType.INTEGER:
          return type !== Type.TEMPORAL;
        case PrimitiveType.DATE:
          // TODO: add NOMINAL, ORDINAL support after we support this in Vega-Lite
          return type === Type.TEMPORAL;
        case null:
          // field does not exist in the schema
          return false;
      }
      throw new Error('Not implemented');
    }
  },
  {
    name: 'typeMatchesSchemaType',
    description: 'Enumerated data type of a field should match the field\'s type in the schema.',
    properties: [Property.FIELD, Property.TYPE],
    requireAllProperties: true,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      return schema.type(encQ.field as string) === encQ.type;
    }
  }
  // TODO: scaleType must match data type
].map((ec: EncodingConstraint) => new EncodingConstraintModel(ec));

export const ENCODING_CONSTRAINT_INDEX: {[name: string]: EncodingConstraintModel} =
  ENCODING_CONSTRAINTS.reduce((m, ec: EncodingConstraintModel) => {
    m[ec.name()] = ec;
    return m;
  }, {});

export const ENCODING_CONSTRAINTS_BY_PROPERTY: {[property: string]: EncodingConstraintModel[]} =
  ENCODING_CONSTRAINTS.reduce((m, c: EncodingConstraintModel) => {
    c.properties().forEach((property) => {
      m[property] = m[property] || [];
      m[property].push(c);
    });
    return m;
  }, {});
