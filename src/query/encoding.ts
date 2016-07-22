import {Channel} from 'vega-lite/src/channel';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';
import {ScaleType} from 'vega-lite/src/scale';

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

  field?: Field | EnumSpec<Field> | ShortEnumSpec;
  type?: Type | EnumSpec<Type> | ShortEnumSpec;
  // TODO: value

  // TODO: scaleQuery, axisQuery, legendQuery
}

export interface BinQuery extends EnumSpec<boolean> {
  maxbins?: number | EnumSpec<number> | ShortEnumSpec;
}

export interface ScaleQuery extends EnumSpec<boolean> {
  // TODO: add other properties from vegalite/src/scale
  type?: ScaleType | EnumSpec<ScaleType> | ShortEnumSpec;
  zero?: boolean | EnumSpec<boolean> | ShortEnumSpec;
}

export function isDimension(encQ: EncodingQuery) {
  return contains([Type.NOMINAL, Type.ORDINAL], encQ.type) ||
      (!isEnumSpec(encQ.bin) && !!encQ.bin) ||          // surely Q type
      (!isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit);  // surely T type
}

export function isMeasure(encQ: EncodingQuery) {
  return (encQ.type === Type.QUANTITATIVE && !encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !encQ.timeUnit);
}
