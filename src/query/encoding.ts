import {isObject} from 'datalib/src/util';
import {AggregateOp} from 'vega';
import {Axis} from 'vega-lite/build/src/axis';
import {BinParams} from 'vega-lite/build/src/bin';
import {ExtendedChannel} from 'vega-lite/build/src/channel';
import * as vlChannelDef from 'vega-lite/build/src/channeldef';
import {ValueDef} from 'vega-lite/build/src/channeldef';
import {scaleType as compileScaleType} from 'vega-lite/build/src/compile/scale/type';
import {Encoding} from 'vega-lite/build/src/encoding';
import {Legend} from 'vega-lite/build/src/legend';
import {Mark} from 'vega-lite/build/src/mark';
import {Scale} from 'vega-lite/build/src/scale';
import {EncodingSortField, SortOrder} from 'vega-lite/build/src/sort';
import {StackOffset} from 'vega-lite/build/src/stack';
import {TimeUnit} from 'vega-lite/build/src/timeunit';
import * as TYPE from 'vega-lite/build/src/type';
import {Type as VLType} from 'vega-lite/build/src/type';
import {FlatProp, isEncodingNestedParent, Property} from '../property';
import {Schema} from '../schema';
import {isWildcard, SHORT_WILDCARD, Wildcard, WildcardProperty} from '../wildcard';
import {ExpandedType} from './expandedtype';
import {PROPERTY_SUPPORTED_CHANNELS} from './shorthand';

export type EncodingQuery = FieldQuery | ValueQuery | AutoCountQuery;

export interface EncodingQueryBase {
  channel: WildcardProperty<ExtendedChannel>;

  description?: string;
}

export interface ValueQuery extends EncodingQueryBase {
  value: WildcardProperty<boolean | number | string>;
}

export function isValueQuery(encQ: EncodingQuery): encQ is ValueQuery {
  return encQ !== null && encQ !== undefined && encQ['value'] !== undefined;
}

export function isFieldQuery(encQ: EncodingQuery): encQ is FieldQuery {
  return encQ !== null && encQ !== undefined && (encQ['field'] || encQ['aggregate'] === 'count');
}

export function isAutoCountQuery(encQ: EncodingQuery): encQ is AutoCountQuery {
  return encQ !== null && encQ !== undefined && 'autoCount' in encQ;
}

export function isDisabledAutoCountQuery(encQ: EncodingQuery) {
  return isAutoCountQuery(encQ) && encQ.autoCount === false;
}

export function isEnabledAutoCountQuery(encQ: EncodingQuery) {
  return isAutoCountQuery(encQ) && encQ.autoCount === true;
}

/**
 * A special encoding query that gets added internally if the `config.autoCount` flag is on. See SpecQueryModel.build for its generation.
 *
 * __Note:__ this type of query should not be specified by users.
 */
export interface AutoCountQuery extends EncodingQueryBase {
  /**
   * A count function that gets added internally if the config.autoCount flag in on.
   * This allows us to add one extra encoding mapping if needed when the query produces
   * plot that only have discrete fields.
   * In such cases, adding count make the output plots way more meaningful.
   */
  autoCount: WildcardProperty<boolean>;
  type: 'quantitative';
}

export interface FieldQueryBase {
  // FieldDef
  aggregate?: WildcardProperty<AggregateOp>;
  timeUnit?: WildcardProperty<TimeUnit>;

  /**
   * Special flag for enforcing that the field should have a fuction (one of timeUnit, bin, or aggregate).
   *
   * For example, if you enumerate both bin and aggregate then you need `undefined` for both.
   *
   * ```
   * {aggregate: {enum: [undefined, 'mean', 'sum']}, bin: {enum: [false, true]}}
   * ```
   *
   * This would enumerate a fieldDef with "mean", "sum", bin:true, and no function at all.
   * If you want only "mean", "sum", bin:true, then use `hasFn: true`
   *
   * ```
   * {aggregate: {enum: [undefined, 'mean', 'sum']}, bin: {enum: [false, true]}, hasFn: true}
   * ```
   */
  hasFn?: boolean;

  bin?: boolean | BinQuery | SHORT_WILDCARD;
  scale?: boolean | ScaleQuery | SHORT_WILDCARD;

  sort?: SortOrder | EncodingSortField<string>;
  stack?: StackOffset | SHORT_WILDCARD;

  field?: WildcardProperty<string>;
  type?: WildcardProperty<ExpandedType>;

  axis?: boolean | AxisQuery | SHORT_WILDCARD;
  legend?: boolean | LegendQuery | SHORT_WILDCARD;

  format?: string;
}

export type FieldQuery = EncodingQueryBase & FieldQueryBase;

// Using Mapped Type from TS2.1 to declare query for an object without nested property
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#mapped-types
export type FlatQuery<T> = {[P in keyof T]: WildcardProperty<T[P]>};

export type FlatQueryWithEnableFlag<T> = (Wildcard<boolean> | {}) & FlatQuery<T>;

export type BinQuery = FlatQueryWithEnableFlag<BinParams>;
export type ScaleQuery = FlatQueryWithEnableFlag<Scale>;
export type AxisQuery = FlatQueryWithEnableFlag<Axis>;
export type LegendQuery = FlatQueryWithEnableFlag<Legend<any>>;

const DEFAULT_PROPS = [
  Property.AGGREGATE,
  Property.BIN,
  Property.TIMEUNIT,
  Property.FIELD,
  Property.TYPE,
  Property.SCALE,
  Property.SORT,
  Property.AXIS,
  Property.LEGEND,
  Property.STACK,
  Property.FORMAT
];

export interface ConversionParams {
  schema?: Schema;
  props?: FlatProp[];
  wildcardMode?: 'skip' | 'null';
}

export function toEncoding(encQs: EncodingQuery[], params: ConversionParams): Encoding<string> {
  const {wildcardMode = 'skip'} = params;
  let encoding: Encoding<string> = {};

  for (const encQ of encQs) {
    if (isDisabledAutoCountQuery(encQ)) {
      continue; // Do not include this in the output.
    }

    const {channel} = encQ;

    // if channel is a wildcard, return null
    if (isWildcard(channel)) {
      throw new Error('Cannot convert wildcard channel to a fixed channel');
    }
    const channelDef = isValueQuery(encQ) ? toValueDef(encQ) : toFieldDef(encQ, params);

    if (channelDef === null) {
      if (params.wildcardMode === 'null') {
        // contains invalid property (e.g., wildcard, thus cannot return a proper spec.)
        return null;
      }
      continue;
    }
    // Otherwise, we can set the channelDef
    encoding[channel] = channelDef;
  }
  return encoding;
}

export function toValueDef(valueQ: ValueQuery): ValueDef {
  const {value} = valueQ;
  if (isWildcard(value)) {
    return null;
  }
  return {value};
}

export function toFieldDef(
  encQ: FieldQuery | AutoCountQuery,
  params: ConversionParams = {}
): vlChannelDef.TypedFieldDef<string> {
  const {props = DEFAULT_PROPS, schema, wildcardMode = 'skip'} = params;

  if (isFieldQuery(encQ)) {
    const fieldDef = {} as vlChannelDef.TypedFieldDef<string>;
    for (const prop of props) {
      let encodingProperty = encQ[prop];
      if (isWildcard(encodingProperty)) {
        if (wildcardMode === 'skip') continue;
        return null;
      }

      if (encodingProperty !== undefined) {
        // if the channel supports this prop
        const isSupportedByChannel =
          !PROPERTY_SUPPORTED_CHANNELS[prop] || PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel as ExtendedChannel];
        if (!isSupportedByChannel) {
          continue;
        }

        if (isEncodingNestedParent(prop) && isObject(encodingProperty)) {
          encodingProperty = {...encodingProperty}; // Make a shallow copy first
          for (const childProp in encodingProperty) {
            // ensure nested properties are not wildcard before assigning to field def
            if (isWildcard(encodingProperty[childProp])) {
              if (wildcardMode === 'null') {
                return null;
              }
              delete encodingProperty[childProp]; // skip
            }
          }
        }

        if (prop === 'bin' && encodingProperty === false) {
          continue;
        } else if (prop === 'type' && encodingProperty === 'key') {
          fieldDef.type = 'nominal';
        } else {
          fieldDef[prop] = encodingProperty;
        }
      }

      if (prop === Property.SCALE && schema && encQ.type === TYPE.ORDINAL) {
        const scale = encQ.scale;
        const {ordinalDomain} = schema.fieldSchema(encQ.field as string);

        if (scale !== null && ordinalDomain) {
          fieldDef[Property.SCALE] = {
            domain: ordinalDomain,
            // explicitly specfied domain property should override ordinalDomain
            ...(isObject(scale) ? scale : {})
          };
        }
      }
    }
    return fieldDef;
  } else {
    if (encQ.autoCount === false) {
      throw new Error(`Cannot convert {autoCount: false} into a field def`);
    } else {
      return {
        aggregate: 'count',
        field: '*',
        type: 'quantitative'
      };
    }
  }
}

/**
 * Is a field query continuous field?
 * This method is applicable only for fieldQuery without wildcard
 */
export function isContinuous(encQ: EncodingQuery) {
  if (isFieldQuery(encQ)) {
    return vlChannelDef.isContinuous(toFieldDef(encQ, {props: ['bin', 'timeUnit', 'field', 'type']}));
  }
  return isAutoCountQuery(encQ);
}

export function isMeasure(encQ: EncodingQuery) {
  if (isFieldQuery(encQ)) {
    return !isDimension(encQ) && encQ.type !== 'temporal';
  }
  return isAutoCountQuery(encQ);
}

/**
 * Is a field query discrete field?
 * This method is applicable only for fieldQuery without wildcard
 */
export function isDimension(encQ: EncodingQuery) {
  if (isFieldQuery(encQ)) {
    const props: FlatProp[] = !!encQ['field'] ? ['field', 'bin', 'timeUnit', 'type'] : ['bin', 'timeUnit', 'type'];
    const fieldDef = toFieldDef(encQ, {props: props});
    return vlChannelDef.isDiscrete(fieldDef) || !!fieldDef.timeUnit;
  }
  return false;
}

/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's TYPE.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */

export function scaleType(fieldQ: FieldQuery) {
  const scale: ScaleQuery = fieldQ.scale === true || fieldQ.scale === SHORT_WILDCARD ? {} : fieldQ.scale || {};

  const {type, channel, timeUnit, bin} = fieldQ;

  // HACK: All of markType, and scaleConfig only affect
  // sub-type of ordinal to quantitative scales (point or band)
  // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
  // Thus, instead of making this method requiring the global mark,
  // we will just call it with mark = undefined .
  // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
  const markType: Mark = undefined;

  if (isWildcard(scale.type) || isWildcard(type) || isWildcard(channel) || isWildcard(bin)) {
    return undefined;
  }

  if (channel === 'row' || channel === 'column' || channel === 'facet') {
    return undefined;
  }

  // If scale type is specified, then use scale.type
  if (scale.type) {
    return scale.type;
  }

  // if type is fixed and it's not temporal, we can ignore time unit.
  if (type === 'temporal' && isWildcard(timeUnit)) {
    return undefined;
  }

  // if type is fixed and it's not quantitative, we can ignore bin
  if (type === 'quantitative' && isWildcard(bin)) {
    return undefined;
  }

  let vegaLiteType: VLType = type === ExpandedType.KEY ? 'nominal' : type;

  const fieldDef = {
    type: vegaLiteType,
    timeUnit: timeUnit as TimeUnit,
    bin: bin as BinParams
  };
  return compileScaleType({type: scale.type}, channel, fieldDef, markType);
}
