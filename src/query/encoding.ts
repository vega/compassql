import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {SortOrder, SortField} from 'vega-lite/src/sort';
import {defaultScaleType, TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {EnumSpec, isEnumSpec, ShortEnumSpec} from '../enumspec';
import {contains} from '../util';

export type Field = string;

export interface EncodingQuery {
  channel: Channel | EnumSpec<Channel> | ShortEnumSpec;

  // FieldDef
  aggregate?: AggregateOp | EnumSpec<AggregateOp> | ShortEnumSpec;
  /** Internal flag for representing automatic count that are added to plots with only ordinal or binned fields. */
  autoCount?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  timeUnit?: TimeUnit | EnumSpec<TimeUnit> | ShortEnumSpec;

  bin?: boolean | BinQuery | ShortEnumSpec;
  scale?: boolean | ScaleQuery | ShortEnumSpec;

  sort?: SortOrder | SortField;

  field?: Field | EnumSpec<Field> | ShortEnumSpec;
  type?: Type | EnumSpec<Type> | ShortEnumSpec;
  // TODO: value

  // TODO: axisQuery, legendQuery
}

export interface BinQuery extends EnumSpec<boolean> {
  maxbins?: number | EnumSpec<number> | ShortEnumSpec;
}

export interface ScaleQuery extends EnumSpec<boolean> {
  bandSize?: number | EnumSpec<number> | ShortEnumSpec;
  clamp?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  domain?: number[] | string[] | EnumSpec<number[] | string[]> | ShortEnumSpec;
  exponent?: number | EnumSpec<number> | ShortEnumSpec;
  nice?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  range?: string | number[] | string[] | EnumSpec<string | number[] | string[]> | ShortEnumSpec;
  round?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  type?: ScaleType | EnumSpec<ScaleType> | ShortEnumSpec;
  useRawDomain?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  zero?: boolean | EnumSpec<boolean> | ShortEnumSpec;

}

export function isDimension(encQ: EncodingQuery) {
  return contains([Type.NOMINAL, Type.ORDINAL], encQ.type) ||
      (!isEnumSpec(encQ.bin) && !!encQ.bin) ||          // surely Q type
      (!isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit);  // surely T type
      // TODO For T type, take scale type of the timeUnit into account
}

export function isMeasure(encQ: EncodingQuery) {
  return (encQ.type === Type.QUANTITATIVE && !encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !encQ.timeUnit);
      // TODO For T type, take scale type of the timeUnit into account
}

/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is an EnumSpec, there is no clear scale type
 */

export function scaleType(scaleType: ScaleType | EnumSpec<ScaleType> | ShortEnumSpec,
    timeUnit: TimeUnit | EnumSpec<TimeUnit> | ShortEnumSpec,
    type: Type | EnumSpec<Type> | ShortEnumSpec) {
  if (scaleType !== undefined) {
    return scaleType;
  }

  if (isEnumSpec(type)) {
    return undefined;
  }

  /* istanbul ignore else */
  if (type === Type.QUANTITATIVE) {
    return ScaleType.LINEAR;
  } else if (type === Type.ORDINAL || type === Type.NOMINAL) {
    return ScaleType.ORDINAL;

  } else if (type === Type.TEMPORAL) {
    if (timeUnit !== undefined) {
      if (isEnumSpec(timeUnit)) {
        return undefined;
      }
      return defaultScaleType(timeUnit as TimeUnit);
    } else {
      return ScaleType.TIME;
    }
  } else {
    throw new Error('Unsupported type: ' + type + ' in scaleType');
  }
}

