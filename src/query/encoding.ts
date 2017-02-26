
import {Axis} from 'vega-lite/src/axis';
import {Bin} from 'vega-lite/src/bin';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';

import {Scale} from 'vega-lite/src/scale';
import {Legend} from 'vega-lite/src/legend';
import {SortOrder, SortField} from 'vega-lite/src/sort';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import compileScaleType from 'vega-lite/src/compile/scale/type';

import {Wildcard, isWildcard, SHORT_WILDCARD, WildcardProperty} from '../wildcard';
import {contains} from '../util';
import {AggregateOp} from 'vega-lite/src/aggregate';

export type EncodingQuery = FieldQuery | ValueQuery;

export interface EncodingQueryBase {
  channel: WildcardProperty<Channel>;
}

export interface ValueQuery extends EncodingQueryBase {
  value: WildcardProperty<boolean | number | string>;
}

export function isValueQuery(encQ: EncodingQuery): encQ is ValueQuery {
  return encQ !== null && encQ !== undefined && encQ['value'];
}

export function isFieldQuery(encQ: EncodingQuery): encQ is FieldQuery {
  return encQ !== null && encQ !== undefined && (encQ['field'] || 'autoCount' in encQ);
}

// TODO: split this into FieldDefQuery and AutoCountQuery
export interface FieldQuery extends EncodingQueryBase {
  channel: WildcardProperty<Channel>;

  // FieldDef
  aggregate?: WildcardProperty<AggregateOp>;
  /** Internal flag for representing automatic count that are added to plots with only ordinal or binned fields. */
  autoCount?: WildcardProperty<boolean>;
  timeUnit?: WildcardProperty<TimeUnit>;

  /**
   * Special flag for enforcing that the field should have either timeUnit, bin, or aggregate
   */
  hasFn?: boolean;

  bin?: boolean | BinQuery | SHORT_WILDCARD;
  scale?: boolean | ScaleQuery | SHORT_WILDCARD;

  sort?: SortOrder | SortField;

  field?: WildcardProperty<string>;
  type?: WildcardProperty<Type>;
  // TODO: value

  axis?: boolean | AxisQuery | SHORT_WILDCARD;
  legend?: boolean | LegendQuery | SHORT_WILDCARD;
}

// Using Mapped Type from TS2.1 to declare query for an object without nested property
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#mapped-types
export type FlatQuery<T> = {
  [P in keyof T]: WildcardProperty<T[P]>
};

export type FlatQueryWithEnableFlag<T> = (Wildcard<boolean> | {}) & FlatQuery<T>;

export type BinQuery = FlatQueryWithEnableFlag<Bin>;
export type ScaleQuery =  FlatQueryWithEnableFlag<Scale>;
export type AxisQuery =  FlatQueryWithEnableFlag<Axis>;
export type LegendQuery = FlatQueryWithEnableFlag<Legend>;

export function isDimension(fieldQ: FieldQuery) {
  return contains([Type.NOMINAL, Type.ORDINAL], fieldQ.type) ||
      (!isWildcard(fieldQ.bin) && !!fieldQ.bin) ||          // surely Q type
      (!isWildcard(fieldQ.timeUnit) && !!fieldQ.timeUnit);  // surely T type
}

export function isMeasure(fieldQ: FieldQuery) {
  return (fieldQ.type === Type.QUANTITATIVE && !fieldQ.bin) ||
      (fieldQ.type === Type.TEMPORAL && !fieldQ.timeUnit);
}

/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */

export function scaleType(fieldQ: FieldQuery) {
  const scale: ScaleQuery = fieldQ.scale === true || fieldQ.scale === SHORT_WILDCARD ? {} : fieldQ.scale || {};
  const type = fieldQ.type;
  const channel = fieldQ.channel;
  const timeUnit = fieldQ.timeUnit;

  // HACK: All of markType, hasTopLevelSize, and scaleConfig only affect
  // sub-type of ordinal to quantitative scales (point or band)
  // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
  // Thus, instead of making this method requiring the global mark and topLevelSize,
  // we will just call it with mark = undefined and hasTopLevelSize = false.
  // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
  const markType: Mark = undefined;
  const hasTopLevelSize = false;
  const scaleConfig = {};

  if (isWildcard(scale.type) || isWildcard(type) || isWildcard(channel) ) {
    return undefined;
  }

  let rangeStep: number = undefined;
  // Note: Range step currently does not matter as we don't pass mark into compileScaleType anyway.
  // However, if we pass mark, we could use a rule like the following.
  // I also have few test cases listed in encoding.test.ts
  // if (channel === 'x' || channel === 'y') {
  //   if (isWildcard(scale.rangeStep)) {
  //     if (isShortWildcard(scale.rangeStep)) {
  //       return undefined;
  //     } else if (scale.rangeStep.enum) {
  //       const e = scale.rangeStep.enum;
  //       // if enumerated value contains enum then we can't be sure
  //       if (contains(e, undefined) || contains(e, null)) {
  //         return undefined;
  //       }
  //       rangeStep = e[0];
  //     }
  //   }
  // }

  // if type is fixed and it's not temporal, we can ignore time unit.
  if (type === 'temporal' && isWildcard(timeUnit)) {
    return undefined;
  }

  return compileScaleType(
    scale.type, type, channel, timeUnit as TimeUnit, markType,
    hasTopLevelSize, rangeStep, scaleConfig
  );
}
