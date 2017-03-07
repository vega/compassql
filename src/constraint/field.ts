import {Channel} from 'vega-lite/build/src/channel';
import {channelCompatibility} from 'vega-lite/build/src/fielddef';
import {ScaleType, scaleTypeSupportProperty, hasDiscreteDomain, channelScalePropertyIncompatability, Scale} from 'vega-lite/build/src/scale';
import {Type} from 'vega-lite/build/src/type';

import {QueryConfig} from '../config';
import {getEncodingNestedProp, Property, SCALE_PROPS} from '../property';
import {PropIndex} from '../propindex';
import {isWildcard, Wildcard} from '../wildcard';
import {PrimitiveType, Schema} from '../schema';
import {contains} from '../util';

import {scaleType, FieldQuery, ScaleQuery, toFieldDef} from '../query/encoding';
import {EncodingConstraintModel, EncodingConstraint} from './base';

export const FIELD_CONSTRAINTS: EncodingConstraintModel<FieldQuery>[] = [
  {
    name: 'aggregateOpSupportedByType',
    description: 'Aggregate function should be supported by data type.',
    properties: [Property.TYPE, Property.AGGREGATE],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ.aggregate) {
        return fieldQ.type !== Type.ORDINAL && fieldQ.type !== Type.NOMINAL;
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
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      return (fieldQ.field === '*') === (fieldQ.aggregate === 'count');
    }
  // TODO: minCardinalityForBin
  },{
    name: 'binAppliedForQuantitative',
    description: 'bin should be applied to quantitative field only.',
    properties: [Property.TYPE, Property.BIN],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ.bin) {
        // If binned, the type must be quantitative
        return fieldQ.type === Type.QUANTITATIVE;
      }
      return true;
    }
  },{
    name: 'channelFieldCompatible',
    description: `encoding channel's range type be compatible with channel type.`,
    properties: [Property.CHANNEL, Property.TYPE, Property.BIN, Property.TIMEUNIT],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      const fieldDef = {
        field: 'f', // actual field doesn't really matter here
        ... toFieldDef(fieldQ, ['bin', 'timeUnit', 'type'])
      };
      return channelCompatibility(fieldDef, fieldQ.channel as Channel).compatible;
    }
  },{
    name: 'hasFn',
    description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
    properties: [Property.AGGREGATE, Property.BIN, Property.TIMEUNIT],
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ.hasFn) {
        return !!fieldQ.aggregate || !!fieldQ.bin || !!fieldQ.timeUnit;
      }
      return true;
    }
  },{
    name: 'omitScaleZeroWithBinnedField',
    description: 'Do not use scale zero with binned field',
    properties: [Property.SCALE, getEncodingNestedProp('scale', 'zero'), Property.BIN],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ.bin && fieldQ.scale) {
        if ((fieldQ.scale as ScaleQuery).zero === true) {
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
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      const numFn = (!isWildcard(fieldQ.aggregate) && !!fieldQ.aggregate ? 1 : 0) +
        (!isWildcard(fieldQ.autoCount) && !!fieldQ.autoCount ? 1 : 0) +
        (!isWildcard(fieldQ.bin) && !!fieldQ.bin ? 1 : 0) +
        (!isWildcard(fieldQ.timeUnit) && !!fieldQ.timeUnit ? 1 : 0);
      return numFn <= 1;
    }
  },{
    name: 'timeUnitAppliedForTemporal',
    description: 'Time unit should be applied to temporal field only.',
    properties: [Property.TYPE, Property.TIMEUNIT],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ.timeUnit && fieldQ.type !== Type.TEMPORAL) {
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
    satisfy: (fieldQ: FieldQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (fieldQ.timeUnit && fieldQ.type === Type.TEMPORAL) {
        if (!encWildcardIndex.has('timeUnit') && !opt.constraintManuallySpecifiedValue) {
          // Do not have to check this as this is manually specified by users.
          return true;
        }
        return schema.timeUnitHasVariation(fieldQ);
      }
      return true;
    }
  },{
    name: 'scalePropertiesSupportedByScaleType',
    description: 'Scale properties must be supported by correct scale type',
    properties: [].concat(SCALE_PROPS, [Property.SCALE, Property.TYPE]),
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ.scale) {
        const scale: ScaleQuery = fieldQ.scale as ScaleQuery;

         //  If fieldQ.type is an Wildcard and scale.type is undefined, it is equivalent
         //  to scale type is Wildcard. If scale type is an Wildcard, we do not yet know
         //  what the scale type is, and thus can ignore the constraint.

        const sType = scaleType(fieldQ);

        if (sType === undefined || sType === null) {
          // If still ambiguous, doesn't check the constraint
          return true;
        }

        for (let scaleProp in scale) {
          if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
            // ignore type and properties of wildcards
            continue;
          }
          const sProp = scaleProp as (keyof Scale);
          if (sType === 'point') {
            // HACK: our current implementation of scaleType() can return point
            // when the scaleType is a band since we didn't pass all parameter to Vega-Lite's scale type method.
            if (!scaleTypeSupportProperty('point', sProp) && !scaleTypeSupportProperty('band', sProp)) {
              return false;
            }
          } else if (!scaleTypeSupportProperty(sType, sProp)) {
            return false;
          }
        }
      }
      return true;
    }
  },{
    name: 'scalePropertiesSupportedByChannel',
    description: 'Not all scale properties are supported by all encoding channels',
    properties: [].concat(SCALE_PROPS, [Property.SCALE, Property.CHANNEL]),
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ) {
        let channel: Channel = fieldQ.channel as Channel;
        let scale: ScaleQuery = fieldQ.scale as ScaleQuery;
        if (channel && !isWildcard(channel) && scale) {
          for (let scaleProp in scale) {
            if (!scale.hasOwnProperty(scaleProp)) continue;
            if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
              // ignore type and properties of wildcards
              continue;
            }
            let isSupported = channelScalePropertyIncompatability(channel, scaleProp as keyof Scale) === undefined;
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
    satisfy: (fieldQ: FieldQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (fieldQ.field === '*') {
        return true;
      }

      const primitiveType = schema.primitiveType(fieldQ.field as string);
      const type = fieldQ.type;

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
    satisfy: (fieldQ: FieldQuery, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
        // Do not have to check this as this is manually specified by users.
        return true;
      }

      if (fieldQ.field === '*') {
        return fieldQ.type === Type.QUANTITATIVE;
      }

      return schema.type(fieldQ.field as string) === fieldQ.type;
    }
  },{
   name: 'maxCardinalityForCategoricalColor',
    description: 'Categorical channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (fieldQ: FieldQuery, schema: Schema, _: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      // TODO: missing case where ordinal / temporal use categorical color
      // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
      if (fieldQ.channel === Channel.COLOR && fieldQ.type === Type.NOMINAL) {
        return schema.cardinality(fieldQ) <= opt.maxCardinalityForCategoricalColor;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'maxCardinalityForFacet',
    description: 'Row/column channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (fieldQ: FieldQuery, schema: Schema, _: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (fieldQ.channel === Channel.ROW || fieldQ.channel === Channel.COLUMN) {
        return schema.cardinality(fieldQ) <= opt.maxCardinalityForFacet;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'maxCardinalityForShape',
    description: 'Shape channel should not have too high cardinality',
    properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (fieldQ: FieldQuery, schema: Schema, _: PropIndex<Wildcard<any>>, opt: QueryConfig) => {
      if (fieldQ.channel === Channel.SHAPE) {
        return schema.cardinality(fieldQ) <= opt.maxCardinalityForShape;
      }
      return true; // other channel is irrelevant to this constraint
    }
  },{
    name: 'dataTypeAndFunctionMatchScaleType',
    description: 'Scale type must match data type',
    properties: [Property.TYPE, Property.SCALE, getEncodingNestedProp('scale', 'type'), Property.TIMEUNIT, Property.BIN],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (fieldQ: FieldQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {
      if (fieldQ.scale) {
        const type = fieldQ.type;
        const sType = scaleType(fieldQ);

        if (contains([Type.ORDINAL, Type.NOMINAL], type)) {
            return sType === undefined || hasDiscreteDomain(sType);
        } else if (type === Type.TEMPORAL) {
          if(!fieldQ.timeUnit) {
            return contains([ScaleType.TIME, ScaleType.UTC, undefined], sType);
          } else {
            return contains([ScaleType.TIME, ScaleType.UTC, undefined], sType) || hasDiscreteDomain(sType);
          }
        } else if (type === Type.QUANTITATIVE) {
          if (fieldQ.bin) {
            return contains([ScaleType.LINEAR, undefined], sType);
          } else {
            return contains([ScaleType.LOG, ScaleType.POW, ScaleType.SQRT, ScaleType.QUANTILE, ScaleType.QUANTIZE, ScaleType.LINEAR, undefined], sType);
          }
        }
      }
      return true;
    }
  }
].map((ec: EncodingConstraint<FieldQuery>) => new EncodingConstraintModel<FieldQuery>(ec));

export const FIELD_CONSTRAINT_INDEX: {[name: string]: EncodingConstraintModel<FieldQuery>} =
  FIELD_CONSTRAINTS.reduce((m, ec: EncodingConstraintModel<FieldQuery>) => {
    m[ec.name()] = ec;
    return m;
  }, {});

export const FIELD_CONSTRAINTS_BY_PROPERTY =
  FIELD_CONSTRAINTS.reduce((index, c) => {
    for (const prop of c.properties()) {
      // Initialize array and use it
      index.set(prop, index.get(prop) || []);
      index.get(prop).push(c);
    }
    return index;
  }, new PropIndex<EncodingConstraintModel<FieldQuery>[]>());
