import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel, getSupportedRole} from 'vega-lite/src/channel';
import {ScaleType, scaleTypeSupportProperty, hasDiscreteDomain, channelScalePropertyIncompatability} from 'vega-lite/src/scale';
import {Type} from 'vega-lite/src/type';

import {AbstractConstraint, AbstractConstraintModel} from './base';

import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {isEncodingNestedProp, getEncodingNestedProp, Property, SCALE_PROPS} from '../property';
import {PropIndex} from '../propindex';
import {isWildcard, Wildcard} from '../wildcard';
import {PrimitiveType, Schema} from '../schema';
import {contains, every} from '../util';

import {scaleType, EncodingQuery, isDimension, isMeasure, ScaleQuery} from '../query/encoding';

/**
 * Collection of constraints for a single encoding mapping.
 */

/** A method for satisfying whether the provided encoding query satisfy the constraint. */
export interface EncodingConstraintChecker {
  (encQ: EncodingQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig): boolean;
}

export class EncodingConstraintModel extends AbstractConstraintModel {
  constructor(constraint: EncodingConstraint) {
    super(constraint);
  }

  public hasAllRequiredPropertiesSpecific(encQ: EncodingQuery): boolean {
    return every(this.constraint.properties, (prop: Property) => {

      if (isEncodingNestedProp(prop)) {
        let parent = prop.parent;
        let child = prop.child;

        if (!encQ[parent]) {
          return true;
        }

        return !isWildcard(encQ[parent][child]);
      }

      if (!encQ[prop]) {
        return true;
      }

      return !isWildcard(encQ[prop]);
    });
  }

  public satisfy(encQ: EncodingQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig): boolean {
    // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
    if (!this.constraint.allowWildcardForProperties) {
      // TODO: extract as a method and do unit test

      if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
        return true;
      }
    }
    return (this.constraint as EncodingConstraint).satisfy(encQ, schema, encWildcardIndex, opt);
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
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
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
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      return (encQ.field === '*') === (encQ.aggregate === AggregateOp.COUNT);
    }
  // TODO: minCardinalityForBin
  },{
    name: 'binAppliedForQuantitative',
    description: 'bin should be applied to quantitative field only.',
    properties: [Property.TYPE, Property.BIN],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (encQ.bin) {
        // If binned, the type must be quantitative
        return encQ.type === Type.QUANTITATIVE;
      }
      return true;
    }
  },{
    // FIXME(#301) revise this
    name: 'channelSupportsRole',
    description: 'encoding channel should support the role of the field',
    properties: [Property.CHANNEL, Property.TYPE, Property.BIN, Property.TIMEUNIT],
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (isWildcard(encQ.channel)) return true; // not ready for checking yet!

      if (!encWildcardIndex.has('channel') && !opt.constraintManuallySpecifiedValue) {
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
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (encQ.hasFn) {
        return !!encQ.aggregate || !!encQ.bin || !!encQ.timeUnit;
      }
      return true;
    }
  },{
    name: 'omitScaleZeroWithBinnedField',
    description: 'Do not use scale zero with binned field',
    properties: [Property.SCALE, getEncodingNestedProp('scale', 'zero'), Property.BIN],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
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
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      const numFn = (!isWildcard(encQ.aggregate) && !!encQ.aggregate ? 1 : 0) +
        (!isWildcard(encQ.autoCount) && !!encQ.autoCount ? 1 : 0) +
        (!isWildcard(encQ.bin) && !!encQ.bin ? 1 : 0) +
        (!isWildcard(encQ.timeUnit) && !!encQ.timeUnit ? 1 : 0);
      return numFn <= 1;
    }
  },{
    name: 'timeUnitAppliedForTemporal',
    description: 'Time unit should be applied to temporal field only.',
    properties: [Property.TYPE, Property.TIMEUNIT],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (encQ.timeUnit && encQ.type !== Type.TEMPORAL) {
        return false;
      }
      return true;
    }
  },{
    name: 'timeUnitShouldHaveVariation',
    description: 'A particular time unit should be applied only if they produce unique values.',
    properties: [Property.TIMEUNIT, Property.TYPE],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (encQ.timeUnit && encQ.type === Type.TEMPORAL) {
        if (!encWildcardIndex.has('timeUnit') && !opt.constraintManuallySpecifiedValue) {
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
    properties: [].concat(SCALE_PROPS, [Property.SCALE, Property.TYPE]),
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (encQ.scale) {
        const scale: ScaleQuery = encQ.scale as ScaleQuery;

         //  If encQ.type is an Wildcard and scale.type is undefined, it is equivalent
         //  to scale type is Wildcard. If scale type is an Wildcard, we do not yet know
         //  what the scale type is, and thus can ignore the constraint.

        const sType = scaleType(encQ);

        if (sType === undefined || sType === null) {
          // If still ambiguous, doesn't check the constraint
          return true;
        }

        for (let scaleProp in scale) {
          if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
            // ignore type and properties of wildcards
            continue;
          }
          if (sType === 'point') {
            // HACK: our current implementation of scaleType() can return point
            // when the scaleType is a band since we didn't pass all parameter to Vega-Lite's scale type method.
            if (!scaleTypeSupportProperty('point', scaleProp) && !scaleTypeSupportProperty('band', scaleProp)) {
              return false;
            }
          } else if (!scaleTypeSupportProperty(sType, scaleProp)) {
            return false;
          }
        }
      }
      return true;
    }
  },{
    name: 'scalePropertiesSupportedByChannel',
    description: 'Not all scale properties are supported by all encoding channels',
    properties: [Property.CHANNEL, Property.SCALE],
    allowWildcardForProperties: false, // unsure about this
    strict: true,
    satisfy: (encQ: EncodingQuery) => {
      if (encQ) {
        let channel = encQ.channel as Channel;
        let scale = encQ.scale;
        if (channel && scale) {
          let scaleProps = Object.keys(scale);
          for (let scaleProp in scaleProps) {

            if (!scaleProps.hasOwnProperty(scaleProp)) continue;

            if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
              // ignore type and properties of wildcards
              continue;
            }

            let isSupported = channelScalePropertyIncompatability(channel, scaleProp) === undefined;
            if (!isSupported) {
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
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (encQ.field === '*') {
        return true;
      }

      const primitiveType = schema.primitiveType(encQ.field as string);
      const type = encQ.type;

      if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
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
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
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
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, _: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
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
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, _: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (encQ.channel === Channel.ROW || encQ.channel === Channel.COLUMN) {
        return schema.cardinality(encQ) <= opt.maxCardinalityForFacet;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'maxCardinalityForShape',
    description: 'Shape channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (encQ: EncodingQuery, schema: Schema, _: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (encQ.channel === Channel.SHAPE) {
        return schema.cardinality(encQ) <= opt.maxCardinalityForShape;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'dataTypeAndFunctionMatchScaleType',
    description: 'Scale type must match data type',
    properties: [Property.TYPE, Property.SCALE, getEncodingNestedProp('scale', 'type'), Property.TIMEUNIT, Property.BIN],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (encQ: EncodingQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (encQ.scale) {
        const type = encQ.type;
        const sType = scaleType(encQ);

        if (contains([Type.ORDINAL, Type.NOMINAL], type)) {
            return sType === undefined || hasDiscreteDomain(sType);
        } else if (type === Type.TEMPORAL) {
          if(!encQ.timeUnit) {
            return contains([ScaleType.TIME, ScaleType.UTC, undefined], sType);
          } else {
            return contains([ScaleType.TIME, ScaleType.UTC, undefined], sType) || hasDiscreteDomain(sType);
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

const ENCODING_CONSTRAINTS_BY_PROPERTY =
  ENCODING_CONSTRAINTS.reduce((index, c) => {
    for (const prop of c.properties()) {
      // Initialize array and use it
      index.set(prop, index.get(prop) || []);
      index.get(prop).push(c);
    }
    return index;
  }, new PropIndex<EncodingConstraintModel[]>());

/**
 * Check all encoding constraints for a particular property and index tuple
 */
export function checkEncoding(prop: Property, wildcard: Wildcard<any>, index: number,
  specM: SpecQueryModel, schema: Schema, opt: QueryConfig): string {

  // Check encoding constraint
  const encodingConstraints = ENCODING_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
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
  return null;
}
