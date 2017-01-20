import {AggregateOp} from 'vega-lite/src/aggregate';
import {AxisOrient} from 'vega-lite/src/axis';
import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {SortOrder, SortField} from 'vega-lite/src/sort';
import {defaultScaleType, TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {EnumSpec, isEnumSpec, ShortEnumSpec, SHORT_ENUM_SPEC} from '../enumspec';
import {contains} from '../util';

export type Field = string;

export interface EncodingQuery {
  channel: Channel | EnumSpec<Channel> | ShortEnumSpec;

  // FieldDef
  aggregate?: AggregateOp | EnumSpec<AggregateOp> | ShortEnumSpec;
  /** Internal flag for representing automatic count that are added to plots with only ordinal or binned fields. */
  autoCount?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  timeUnit?: TimeUnit | EnumSpec<TimeUnit> | ShortEnumSpec;

  /**
   * Special flag for enforcing that the field should have either timeUnit, bin, or aggregate
   */
  hasFn?: boolean;

  bin?: boolean | BinQuery | ShortEnumSpec;
  scale?: boolean | ScaleQuery | ShortEnumSpec;

  sort?: SortOrder | SortField;

  field?: Field | EnumSpec<Field> | ShortEnumSpec;
  type?: Type | EnumSpec<Type> | ShortEnumSpec;
  // TODO: value

  axis?: boolean | AxisQuery | ShortEnumSpec;
  legend?: boolean | LegendQuery | ShortEnumSpec;
}

export interface AxisQuery extends EnumSpec<boolean> {
  // General Axis Properties
  axisColor?: string | EnumSpec<string> | ShortEnumSpec;
  axisWidth?: number | EnumSpec<number> | ShortEnumSpec;
  layer?: string | EnumSpec<string> | ShortEnumSpec;
  offset?: number | EnumSpec<number> | ShortEnumSpec;
  orient?: AxisOrient | EnumSpec<AxisOrient> | ShortEnumSpec;

  // Axis_Grid Properties
  grid?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  gridColor?: string | EnumSpec<string> | ShortEnumSpec;
  gridDash?: number[] | EnumSpec<number[]> | ShortEnumSpec;
  gridOpacity?: number | EnumSpec<number> | ShortEnumSpec;
  gridWidth?: number | EnumSpec<number> | ShortEnumSpec;

  // Axis_Label Properties
  labels?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  format?: string | EnumSpec<string> | ShortEnumSpec;
  labelAngle?: number | EnumSpec<number> | ShortEnumSpec;
  labelMaxLength?: number | EnumSpec<number> | ShortEnumSpec;
  shortTimeLabels?: boolean | EnumSpec<boolean> | ShortEnumSpec;

  // Axis_Tick Properties
  subdivide?: number | EnumSpec<number> | ShortEnumSpec;
  ticks?: number | EnumSpec<number> | ShortEnumSpec;
  tickColor?: string | EnumSpec<string> | ShortEnumSpec;
  tickLabelColor?: string | EnumSpec<string> | ShortEnumSpec;
  tickLabelFont?: string | EnumSpec<string> | ShortEnumSpec;
  ticklabelFontSize?: number | EnumSpec<number> | ShortEnumSpec;
  tickPadding?: number | EnumSpec<number> | ShortEnumSpec;
  tickSize?: number | EnumSpec<number> | ShortEnumSpec;
  tickSizeMajor?: number | EnumSpec<number> | ShortEnumSpec;
  tickSizeMinor?: number | EnumSpec<number> | ShortEnumSpec;
  tickSizeEnd?: number | EnumSpec<number> | ShortEnumSpec;
  tickWidth?: number | EnumSpec<number> | ShortEnumSpec;
  values?: number[] | EnumSpec<number[]> | ShortEnumSpec;

  // Axis_Title Properties
  title?: string | EnumSpec<string> | ShortEnumSpec;
  titleColor?: string | EnumSpec<string> | ShortEnumSpec;
  titleFont?: string | EnumSpec<string> | ShortEnumSpec;
  titleFontWeight?: string | EnumSpec<string> | ShortEnumSpec;
  titleFontSize?: number | EnumSpec<number> | ShortEnumSpec;
  titleOffset?: number | EnumSpec<number> | ShortEnumSpec;
  titleMaxLength?: number | EnumSpec<number> | ShortEnumSpec;
  characterWidth?: number | EnumSpec<number> | ShortEnumSpec;
}

export interface BinQuery extends EnumSpec<boolean> {
  maxbins?: number | EnumSpec<number> | ShortEnumSpec;
}

export interface LegendQuery extends EnumSpec<boolean> {
  // General Legend Properties
  orient?: string | EnumSpec<string> | ShortEnumSpec;
  offset?: number | EnumSpec<number> | ShortEnumSpec;
  values?: any[] | EnumSpec<any[]> | ShortEnumSpec;

  // Legend_Label Properties
  format?: string | EnumSpec<string> | ShortEnumSpec;
  labelAlign?: string | EnumSpec<string> | ShortEnumSpec;
  labelBaseline?:string | EnumSpec<string> | ShortEnumSpec;
  labelColor?: string | EnumSpec<string> | ShortEnumSpec;
  labelFont?: string | EnumSpec<string> | ShortEnumSpec;
  labelFontSize?: number | EnumSpec<number> | ShortEnumSpec;
  shortTimeLabels?: boolean | EnumSpec<boolean> | ShortEnumSpec;

  // Legend_Symbol Properties
  symbolColor?: string | EnumSpec<string> | ShortEnumSpec;
  symbolShape?: string | EnumSpec<string> | ShortEnumSpec;
  symbolSize?: number | EnumSpec<number> | ShortEnumSpec;
  symbolStrokeWidth?: number | EnumSpec<number> | ShortEnumSpec;

  // Legend_Title Properties
  title?: string | EnumSpec<string> | ShortEnumSpec;
  titleColor?: string | EnumSpec<string> | ShortEnumSpec;
  titleFont?: string | EnumSpec<string> | ShortEnumSpec;
  titleFontSize?: number | EnumSpec<number> | ShortEnumSpec;
  titleFontWeight?: string | EnumSpec<string> | ShortEnumSpec;
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
}

export function isMeasure(encQ: EncodingQuery) {
  return (encQ.type === Type.QUANTITATIVE && !encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !encQ.timeUnit);
}

/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is an EnumSpec, there is no clear scale type
 */

export function scaleType(encQ: EncodingQuery) {
  const scale: ScaleQuery = encQ.scale === true || encQ.scale === SHORT_ENUM_SPEC ? {} : encQ.scale;
  const type = encQ.type;
  const timeUnit = encQ.timeUnit;

  if (scale && scale.type !== undefined) {
    return scale.type;
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

