import {Channel, getSupportedRole} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {QueryConfig} from '../config';
import {EnumSpecIndexTuple, SpecQueryModel} from '../model';
import {Property} from '../property';
import {EncodingQuery, isEnumSpec, isDimension, isMeasure, ScaleQuery} from '../query';
import {PrimitiveType, Schema} from '../schema';
import {contains, some} from '../util';
import {ScaleType} from 'vega-lite/src/scale';

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
        (prop) => isEnumSpec(encQ[prop])
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
  },{
    name: 'channelSupportsRole',
    description: 'encoding channel should support the role of the field',
    properties: [Property.CHANNEL, Property.TYPE, Property.BIN, Property.TIMEUNIT],
    requireAllProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      if (isEnumSpec(encQ.channel)) return true; // not ready for checking yet!

      const supportedRole = getSupportedRole(encQ.channel as Channel);
      if (isDimension(encQ)) {
        return supportedRole.dimension;
      } else if (isMeasure(encQ)) {
        return supportedRole.measure;
      }
      return true;
    }
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
  },{
   name: 'maxCardinalityForCategoricalColor',
    description: 'Categorical channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD],
    requireAllProperties: true,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      // TODO: missing case where ordinal / temporal use categorical color
      // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
      if (encQ.channel === Channel.COLOR && encQ.type === Type.NOMINAL) {
        return schema.cardinality(encQ) <= opt.maxCardinalityForCategoricalColor;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'maxCardinalityForFacet',
    description: 'Row/column channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
    requireAllProperties: true,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      if (encQ.channel === Channel.ROW || encQ.channel === Channel.COLUMN) {
        return schema.cardinality(encQ) <= opt.maxCardinalityForFacet;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'maxCardinalityForShape',
    description: 'Shape channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
    requireAllProperties: true,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      if (encQ.channel === Channel.SHAPE) {
        return schema.cardinality(encQ) <= opt.maxCardinalityForShape;
      }
      return true; // other channel is irrelevant to this constraint
    }
  }, {
    name: 'dataTypeAndFunctionMatchScaleType',
    description: 'Scale type must match data type',
    properties: [Property.TYPE, Property.SCALE_TYPE, Property.TIMEUNIT, Property.BIN],
    requireAllProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, opt: QueryConfig) => {
      if (encQ.scale) {
        const scaleType = (encQ.scale as ScaleQuery).type;
        const type = encQ.type;

        if (contains([Type.ORDINAL, Type.NOMINAL], type)) {
            return contains([ScaleType.ORDINAL, undefined], scaleType);
        } else if (type === Type.TEMPORAL) {
          if(!encQ.timeUnit) {
            return contains([ScaleType.TIME, ScaleType.UTC, undefined], scaleType);
          } else {
            return contains([ScaleType.TIME, ScaleType.UTC, ScaleType.ORDINAL, undefined], scaleType);
          }
        } else if (type === Type.QUANTITATIVE) {
          if (encQ.bin) {
            return contains([ScaleType.LINEAR, undefined], scaleType);
          } else {
            return contains([ScaleType.LOG, ScaleType.POW, ScaleType.SQRT, ScaleType.QUANTILE, ScaleType.QUANTIZE, ScaleType.LINEAR, undefined], scaleType);
          }
        }
      }
      return true;
    }
  }
].map((ec: EncodingConstraint) => new EncodingConstraintModel(ec));

export const ENCODING_CONSTRAINT_INDEX: {[name: string]: EncodingConstraintModel} =
  ENCODING_CONSTRAINTS.reduce((m, ec: EncodingConstraintModel) => {
    m[ec.name()] = ec;
    return m;
  }, {});

export const ENCODING_CONSTRAINTS_BY_PROPERTY: {[prop: string]: EncodingConstraintModel[]} =
  ENCODING_CONSTRAINTS.reduce((m, c: EncodingConstraintModel) => {
    c.properties().forEach((prop) => {
      m[prop] = m[prop] || [];
      m[prop].push(c);
    });
    return m;
  }, {});

/**
 * Check all encoding constraints for a particular property and index tuple
 */
export function checkEncoding(prop: Property, indexTuple: EnumSpecIndexTuple<any>,
  specM: SpecQueryModel, schema: Schema, opt: QueryConfig): string {

  // Check encoding constraint
  const encodingConstraints = ENCODING_CONSTRAINTS_BY_PROPERTY[prop] || [];
  const encQ = specM.getEncodingQueryByIndex(indexTuple.index);

  for (let i = 0; i < encodingConstraints.length; i++) {
    const c = encodingConstraints[i];
    // Check if the constraint is enabled
    if (c.strict() || !!opt[c.name()]) {
      // For strict constraint, or enabled non-strict, check the constraints

      const satisfy = c.satisfy(encQ, schema, opt);
      if (!satisfy) {
        let violatedConstraint = '(enc) ' + c.name();
        /* istanbul ignore if */
        if (opt.verbose) {
          console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + indexTuple.enumSpec.name);
        }
        return violatedConstraint;
      }
    }
  }
  return null;
}
