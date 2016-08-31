import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel, getSupportedRole} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {Type} from 'vega-lite/src/type';

import {AbstractConstraint, AbstractConstraintModel} from './base';

import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {getNestedEncodingProperty, Property, SCALE_PROPERTIES, SUPPORTED_SCALE_PROPERTY_INDEX} from '../property';
import {isEnumSpec, EnumSpec} from '../enumspec';
import {EncodingEnumSpecIndex} from '../enumspecindex';
import {PrimitiveType, Schema} from '../schema';
import {contains, every} from '../util';

import {scaleType, EncodingQuery, isDimension, isMeasure, ScaleQuery} from '../query/encoding';

/**
 * Collection of constraints for a single encoding mapping.
 */

/** A method for satisfying whether the provided encoding query satisfy the constraint. */
export interface EncodingConstraintChecker {
  (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig): boolean;
}

export class EncodingConstraintModel extends AbstractConstraintModel {
  constructor(constraint: EncodingConstraint) {
    super(constraint);
  }

  public hasAllRequiredPropertiesSpecific(encQ: EncodingQuery): boolean {
    return every(this.constraint.properties, (prop) => {

      const nestedEncProp = getNestedEncodingProperty(prop);

      if (nestedEncProp) {
        let parent = nestedEncProp.parent;
        let child = nestedEncProp.child;

        if (!encQ[parent]) {
          return true;
        }

        return !isEnumSpec(encQ[parent][child]);
      }

      if (!encQ[prop]) {
        return true;
      }

      return !isEnumSpec(encQ[prop]);
    });
  }

  public satisfy(encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig): boolean {
    // TODO: Re-order logic to optimize the "allowEnumSpecForProperties" check
    if (!this.constraint.allowEnumSpecForProperties) {
      // TODO: extract as a method and do unit test

      if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
        return true;
      }
    }
    return (this.constraint as EncodingConstraint).satisfy(encQ, schema, encEnumSpecIndex, opt);
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
    allowEnumSpecForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.aggregate) {
        return encQ.type !== Type.ORDINAL && encQ.type !== Type.NOMINAL;
      }
      // TODO: some aggregate function are actually supported by ordinal
      return true; // no aggregate is okay with any type.
    }
  // TODO: minCardinalityForBin
  },{
    name: 'asteriskFieldWithCountOnly',
    description: 'Field="*" should be disallowed except aggregate="count"',
    properties: [Property.FIELD, Property.AGGREGATE],
    allowEnumSpecForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      return (encQ.field === '*') === (encQ.aggregate === AggregateOp.COUNT);
    }
  // TODO: minCardinalityForBin
  },{
    name: 'binAppliedForQuantitative',
    description: 'bin should be applied to quantitative field only.',
    properties: [Property.TYPE, Property.BIN],
    allowEnumSpecForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
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
    allowEnumSpecForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (isEnumSpec(encQ.channel)) return true; // not ready for checking yet!

      if (!encEnumSpecIndex.channel && !opt.constraintManuallySpecifiedValue) {
        // Do not have to check this as this is manually specified by users.
        return true;
      }

      const supportedRole = getSupportedRole(encQ.channel as Channel);
      if (isDimension(encQ)) {
        return supportedRole.dimension;
      } else if (isMeasure(encQ)) {
        return supportedRole.measure;
      }
      return true;
    }
  },{
    name: 'hasFn',
    description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
    properties: [Property.AGGREGATE, Property.BIN, Property.TIMEUNIT],
    allowEnumSpecForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.hasFn) {
        return !!encQ.aggregate || !!encQ.bin || !!encQ.timeUnit;
      }
      return true;
    }
  },{
    name: 'omitScaleZeroWithBinnedField',
    description: 'Do not use scale zero with binned field',
    properties: [Property.SCALE, Property.SCALE_ZERO, Property.BIN],
    allowEnumSpecForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.bin && encQ.scale) {
        if ((encQ.scale as ScaleQuery).zero === true) {
          return false;
        }
      }
      return true;
    }
  },{
    name: 'onlyOneTypeOfFunction',
    description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN],
    allowEnumSpecForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
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
    allowEnumSpecForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.timeUnit && encQ.type !== Type.TEMPORAL) {
        return false;
      }
      return true;
    }
  },{
    name: 'timeUnitShouldHaveVariation',
    description: 'A particular time unit should be applied only if they produce unique values.',
    properties: [Property.TIMEUNIT, Property.TYPE],
    allowEnumSpecForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.timeUnit && encQ.type === Type.TEMPORAL) {
        if (!encEnumSpecIndex.timeUnit && !opt.constraintManuallySpecifiedValue) {
          // Do not have to check this as this is manually specified by users.
          return true;
        }

        return schema.timeUnitHasVariation(encQ);
      }
      return true;
    }
  },{
    name: 'scalePropertiesSupportedByScaleType',
    description: 'Scale properties must be supported by correct scale type',
    properties: SCALE_PROPERTIES.concat([Property.SCALE, Property.TYPE]),
    allowEnumSpecForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.scale) {
        const scale: ScaleQuery = encQ.scale as ScaleQuery;

         //  If encQ.type is an EnumSpec and scale.type is undefined, it is equivalent
         //  to scale type is EnumSpec. If scale type is an EnumSpec, we do not yet know
         //  what the scale type is, and thus can ignore the constraint.

        const sType = scaleType(encQ);

        if (sType === undefined) {
          // If still ambiguous, doesn't check the constraint
          return true;
        }

        for (let scaleProp in scale) {
          if (SUPPORTED_SCALE_PROPERTY_INDEX[scaleProp]) {
            if (!contains(SUPPORTED_SCALE_PROPERTY_INDEX[scaleProp], sType)) {
              return false;
            }
          }
        }
      }
      return true;
    }
  },{
    name: 'typeMatchesPrimitiveType',
    description: 'Data type should be supported by field\'s primitive type.',
    properties: [Property.FIELD, Property.TYPE],
    allowEnumSpecForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.field === '*') {
        return true;
      }

      const primitiveType = schema.primitiveType(encQ.field as string);
      const type = encQ.type;

      if (!encEnumSpecIndex.field && !encEnumSpecIndex.type && !opt.constraintManuallySpecifiedValue) {
        // Do not have to check this as this is manually specified by users.
        return true;
      }

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
    allowEnumSpecForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (!encEnumSpecIndex.field && !encEnumSpecIndex.type && !opt.constraintManuallySpecifiedValue) {
        // Do not have to check this as this is manually specified by users.
        return true;
      }

      if (encQ.field === '*') {
        return encQ.type === Type.QUANTITATIVE;
      }

      return schema.type(encQ.field as string) === encQ.type;
    }
  },{
   name: 'maxCardinalityForCategoricalColor',
    description: 'Categorical channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD],
    allowEnumSpecForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
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
    allowEnumSpecForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.channel === Channel.ROW || encQ.channel === Channel.COLUMN) {
        return schema.cardinality(encQ) <= opt.maxCardinalityForFacet;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'maxCardinalityForShape',
    description: 'Shape channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
    allowEnumSpecForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.channel === Channel.SHAPE) {
        return schema.cardinality(encQ) <= opt.maxCardinalityForShape;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'dataTypeAndFunctionMatchScaleType',
    description: 'Scale type must match data type',
    properties: [Property.TYPE, Property.SCALE, Property.SCALE_TYPE, Property.TIMEUNIT, Property.BIN],
    allowEnumSpecForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encEnumSpecIndex: EncodingEnumSpecIndex, opt: QueryConfig) => {
      if (encQ.scale) {
        const type = encQ.type;
        const sType = scaleType(encQ);

        if (contains([Type.ORDINAL, Type.NOMINAL], type)) {
            return contains([ScaleType.ORDINAL, undefined], sType);
        } else if (type === Type.TEMPORAL) {
          if(!encQ.timeUnit) {
            return contains([ScaleType.TIME, ScaleType.UTC, undefined], sType);
          } else {
            return contains([ScaleType.TIME, ScaleType.UTC, ScaleType.ORDINAL, undefined], sType);
          }
        } else if (type === Type.QUANTITATIVE) {
          if (encQ.bin) {
            return contains([ScaleType.LINEAR, undefined], sType);
          } else {
            return contains([ScaleType.LOG, ScaleType.POW, ScaleType.SQRT, ScaleType.QUANTILE, ScaleType.QUANTIZE, ScaleType.LINEAR, undefined], sType);
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
export function checkEncoding(prop: Property, enumSpec: EnumSpec<any>, index: number,
  specM: SpecQueryModel, schema: Schema, opt: QueryConfig): string {

  // Check encoding constraint
  const encodingConstraints = ENCODING_CONSTRAINTS_BY_PROPERTY[prop] || [];
  const encQ = specM.getEncodingQueryByIndex(index);

  for (let i = 0; i < encodingConstraints.length; i++) {
    const c = encodingConstraints[i];
    // Check if the constraint is enabled
    if (c.strict() || !!opt[c.name()]) {
      // For strict constraint, or enabled non-strict, check the constraints

      const satisfy = c.satisfy(encQ, schema, specM.enumSpecIndex.encodings[index], opt);
      if (!satisfy) {
        let violatedConstraint = '(enc) ' + c.name();
        /* istanbul ignore if */
        if (opt.verbose) {
          console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + enumSpec.name);
        }
        return violatedConstraint;
      }
    }
  }
  return null;
}
