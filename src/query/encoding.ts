import {AggregateOp} from 'vega-lite/src/aggregate';
import {AxisOrient} from 'vega-lite/src/axis';
import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {SortOrder, SortField} from 'vega-lite/src/sort';
import {defaultScaleType, TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {Wildcard, isWildcard, ShortWildcard, SHORT_WILDCARD} from '../wildcard';
import {contains} from '../util';

export type Field = string;

export interface EncodingQuery {
  channel: Channel | Wildcard<Channel> | ShortWildcard;

  // FieldDef
  aggregate?: AggregateOp | Wildcard<AggregateOp> | ShortWildcard;
  /** Internal flag for representing automatic count that are added to plots with only ordinal or binned fields. */
  autoCount?: boolean | Wildcard<boolean> | ShortWildcard;
  timeUnit?: TimeUnit | Wildcard<TimeUnit> | ShortWildcard;

  /**
   * Special flag for enforcing that the field should have either timeUnit, bin, or aggregate
   */
  hasFn?: boolean;

  bin?: boolean | BinQuery | ShortWildcard;
  scale?: boolean | ScaleQuery | ShortWildcard;

  sort?: SortOrder | SortField;

  field?: Field | Wildcard<Field> | ShortWildcard;
  type?: Type | Wildcard<Type> | ShortWildcard;
  // TODO: value

  axis?: boolean | AxisQuery | ShortWildcard;
  legend?: boolean | LegendQuery | ShortWildcard;
}

export interface AxisQuery extends Wildcard<boolean> {
  // General Axis Properties
  axisColor?: string | Wildcard<string> | ShortWildcard;
  axisWidth?: number | Wildcard<number> | ShortWildcard;
  layer?: string | Wildcard<string> | ShortWildcard;
  offset?: number | Wildcard<number> | ShortWildcard;
  orient?: AxisOrient | Wildcard<AxisOrient> | ShortWildcard;

  // Axis_Grid Properties
  grid?: boolean | Wildcard<boolean> | ShortWildcard;
  gridColor?: string | Wildcard<string> | ShortWildcard;
  gridDash?: number[] | Wildcard<number[]> | ShortWildcard;
  gridOpacity?: number | Wildcard<number> | ShortWildcard;
  gridWidth?: number | Wildcard<number> | ShortWildcard;

  // Axis_Label Properties
  labels?: boolean | Wildcard<boolean> | ShortWildcard;
  format?: string | Wildcard<string> | ShortWildcard;
  labelAngle?: number | Wildcard<number> | ShortWildcard;
  labelMaxLength?: number | Wildcard<number> | ShortWildcard;
  shortTimeLabels?: boolean | Wildcard<boolean> | ShortWildcard;

  // Axis_Tick Properties
  subdivide?: number | Wildcard<number> | ShortWildcard;
  ticks?: number | Wildcard<number> | ShortWildcard;
  tickColor?: string | Wildcard<string> | ShortWildcard;
  tickLabelColor?: string | Wildcard<string> | ShortWildcard;
  tickLabelFont?: string | Wildcard<string> | ShortWildcard;
  ticklabelFontSize?: number | Wildcard<number> | ShortWildcard;
  tickPadding?: number | Wildcard<number> | ShortWildcard;
  tickSize?: number | Wildcard<number> | ShortWildcard;
  tickSizeMajor?: number | Wildcard<number> | ShortWildcard;
  tickSizeMinor?: number | Wildcard<number> | ShortWildcard;
  tickSizeEnd?: number | Wildcard<number> | ShortWildcard;
  tickWidth?: number | Wildcard<number> | ShortWildcard;
  values?: number[] | Wildcard<number[]> | ShortWildcard;

  // Axis_Title Properties
  title?: string | Wildcard<string> | ShortWildcard;
  titleColor?: string | Wildcard<string> | ShortWildcard;
  titleFont?: string | Wildcard<string> | ShortWildcard;
  titleFontWeight?: string | Wildcard<string> | ShortWildcard;
  titleFontSize?: number | Wildcard<number> | ShortWildcard;
  titleOffset?: number | Wildcard<number> | ShortWildcard;
  titleMaxLength?: number | Wildcard<number> | ShortWildcard;
  characterWidth?: number | Wildcard<number> | ShortWildcard;
}

export interface BinQuery extends Wildcard<boolean> {
  maxbins?: number | Wildcard<number> | ShortWildcard;
}

export interface LegendQuery extends Wildcard<boolean> {
  // General Legend Properties
  orient?: string | Wildcard<string> | ShortWildcard;
  offset?: number | Wildcard<number> | ShortWildcard;
  values?: any[] | Wildcard<any[]> | ShortWildcard;

  // Legend_Label Properties
  format?: string | Wildcard<string> | ShortWildcard;
  labelAlign?: string | Wildcard<string> | ShortWildcard;
  labelBaseline?:string | Wildcard<string> | ShortWildcard;
  labelColor?: string | Wildcard<string> | ShortWildcard;
  labelFont?: string | Wildcard<string> | ShortWildcard;
  labelFontSize?: number | Wildcard<number> | ShortWildcard;
  shortTimeLabels?: boolean | Wildcard<boolean> | ShortWildcard;

  // Legend_Symbol Properties
  symbolColor?: string | Wildcard<string> | ShortWildcard;
  symbolShape?: string | Wildcard<string> | ShortWildcard;
  symbolSize?: number | Wildcard<number> | ShortWildcard;
  symbolStrokeWidth?: number | Wildcard<number> | ShortWildcard;

  // Legend_Title Properties
  title?: string | Wildcard<string> | ShortWildcard;
  titleColor?: string | Wildcard<string> | ShortWildcard;
  titleFont?: string | Wildcard<string> | ShortWildcard;
  titleFontSize?: number | Wildcard<number> | ShortWildcard;
  titleFontWeight?: string | Wildcard<string> | ShortWildcard;
}

export interface ScaleQuery extends Wildcard<boolean> {
  bandSize?: number | Wildcard<number> | ShortWildcard;
  clamp?: boolean | Wildcard<boolean> | ShortWildcard;
  domain?: number[] | string[] | Wildcard<number[] | string[]> | ShortWildcard;
  exponent?: number | Wildcard<number> | ShortWildcard;
  nice?: boolean | Wildcard<boolean> | ShortWildcard;
  range?: string | number[] | string[] | Wildcard<string | number[] | string[]> | ShortWildcard;
  round?: boolean | Wildcard<boolean> | ShortWildcard;
  type?: ScaleType | Wildcard<ScaleType> | ShortWildcard;
  useRawDomain?: boolean | Wildcard<boolean> | ShortWildcard;
  zero?: boolean | Wildcard<boolean> | ShortWildcard;

}

export function isDimension(encQ: EncodingQuery) {
  return contains([Type.NOMINAL, Type.ORDINAL], encQ.type) ||
      (!isWildcard(encQ.bin) && !!encQ.bin) ||          // surely Q type
      (!isWildcard(encQ.timeUnit) && !!encQ.timeUnit);  // surely T type
}

export function isMeasure(encQ: EncodingQuery) {
  return (encQ.type === Type.QUANTITATIVE && !encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !encQ.timeUnit);
}

/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */

export function scaleType(encQ: EncodingQuery) {
  const scale: ScaleQuery = encQ.scale === true || encQ.scale === SHORT_WILDCARD ? {} : encQ.scale;
  const type = encQ.type;
  const timeUnit = encQ.timeUnit;

  if (scale && scale.type !== undefined) {
    return scale.type;
  }
  if (isWildcard(type)) {
    return undefined;
  }

  /* istanbul ignore else */
  if (type === Type.QUANTITATIVE) {
    return ScaleType.LINEAR;
  } else if (type === Type.ORDINAL || type === Type.NOMINAL) {
    return ScaleType.ORDINAL;

  } else if (type === Type.TEMPORAL) {
    if (timeUnit !== undefined) {
      if (isWildcard(timeUnit)) {
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

