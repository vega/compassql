import {AggregateOp} from 'vega-lite/src/aggregate';
import {AxisOrient} from 'vega-lite/src/axis';
import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {SortOrder, SortField} from 'vega-lite/src/sort';
import {defaultScaleType, TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {Wildcard, isWildcard, SHORT_WILDCARD} from '../wildcard';
import {contains} from '../util';

export type Field = string;

export interface EncodingQuery {
  channel: Channel | Wildcard<Channel> | SHORT_WILDCARD;

  // FieldDef
  aggregate?: AggregateOp | Wildcard<AggregateOp> | SHORT_WILDCARD;
  /** Internal flag for representing automatic count that are added to plots with only ordinal or binned fields. */
  autoCount?: boolean | Wildcard<boolean> | SHORT_WILDCARD;
  timeUnit?: TimeUnit | Wildcard<TimeUnit> | SHORT_WILDCARD;

  /**
   * Special flag for enforcing that the field should have either timeUnit, bin, or aggregate
   */
  hasFn?: boolean;

  bin?: boolean | BinQuery | SHORT_WILDCARD;
  scale?: boolean | ScaleQuery | SHORT_WILDCARD;

  sort?: SortOrder | SortField;

  field?: Field | Wildcard<Field> | SHORT_WILDCARD;
  type?: Type | Wildcard<Type> | SHORT_WILDCARD;
  // TODO: value

  axis?: boolean | AxisQuery | SHORT_WILDCARD;
  legend?: boolean | LegendQuery | SHORT_WILDCARD;
}

export interface AxisQuery extends Wildcard<boolean> {
  // General Axis Properties
  axisColor?: string | Wildcard<string> | SHORT_WILDCARD;
  axisWidth?: number | Wildcard<number> | SHORT_WILDCARD;
  layer?: string | Wildcard<string> | SHORT_WILDCARD;
  offset?: number | Wildcard<number> | SHORT_WILDCARD;
  orient?: AxisOrient | Wildcard<AxisOrient> | SHORT_WILDCARD;

  // Axis_Grid Properties
  grid?: boolean | Wildcard<boolean> | SHORT_WILDCARD;
  gridColor?: string | Wildcard<string> | SHORT_WILDCARD;
  gridDash?: number[] | Wildcard<number[]> | SHORT_WILDCARD;
  gridOpacity?: number | Wildcard<number> | SHORT_WILDCARD;
  gridWidth?: number | Wildcard<number> | SHORT_WILDCARD;

  // Axis_Label Properties
  labels?: boolean | Wildcard<boolean> | SHORT_WILDCARD;
  format?: string | Wildcard<string> | SHORT_WILDCARD;
  labelAngle?: number | Wildcard<number> | SHORT_WILDCARD;
  labelMaxLength?: number | Wildcard<number> | SHORT_WILDCARD;
  shortTimeLabels?: boolean | Wildcard<boolean> | SHORT_WILDCARD;

  // Axis_Tick Properties
  subdivide?: number | Wildcard<number> | SHORT_WILDCARD;
  ticks?: number | Wildcard<number> | SHORT_WILDCARD;
  tickColor?: string | Wildcard<string> | SHORT_WILDCARD;
  tickLabelColor?: string | Wildcard<string> | SHORT_WILDCARD;
  tickLabelFont?: string | Wildcard<string> | SHORT_WILDCARD;
  ticklabelFontSize?: number | Wildcard<number> | SHORT_WILDCARD;
  tickPadding?: number | Wildcard<number> | SHORT_WILDCARD;
  tickSize?: number | Wildcard<number> | SHORT_WILDCARD;
  tickSizeMajor?: number | Wildcard<number> | SHORT_WILDCARD;
  tickSizeMinor?: number | Wildcard<number> | SHORT_WILDCARD;
  tickSizeEnd?: number | Wildcard<number> | SHORT_WILDCARD;
  tickWidth?: number | Wildcard<number> | SHORT_WILDCARD;
  values?: number[] | Wildcard<number[]> | SHORT_WILDCARD;

  // Axis_Title Properties
  title?: string | Wildcard<string> | SHORT_WILDCARD;
  titleColor?: string | Wildcard<string> | SHORT_WILDCARD;
  titleFont?: string | Wildcard<string> | SHORT_WILDCARD;
  titleFontWeight?: string | Wildcard<string> | SHORT_WILDCARD;
  titleFontSize?: number | Wildcard<number> | SHORT_WILDCARD;
  titleOffset?: number | Wildcard<number> | SHORT_WILDCARD;
  titleMaxLength?: number | Wildcard<number> | SHORT_WILDCARD;
  characterWidth?: number | Wildcard<number> | SHORT_WILDCARD;
}

export interface BinQuery extends Wildcard<boolean> {
  maxbins?: number | Wildcard<number> | SHORT_WILDCARD;
}

export interface LegendQuery extends Wildcard<boolean> {
  // General Legend Properties
  orient?: string | Wildcard<string> | SHORT_WILDCARD;
  offset?: number | Wildcard<number> | SHORT_WILDCARD;
  values?: any[] | Wildcard<any[]> | SHORT_WILDCARD;

  // Legend_Label Properties
  format?: string | Wildcard<string> | SHORT_WILDCARD;
  labelAlign?: string | Wildcard<string> | SHORT_WILDCARD;
  labelBaseline?:string | Wildcard<string> | SHORT_WILDCARD;
  labelColor?: string | Wildcard<string> | SHORT_WILDCARD;
  labelFont?: string | Wildcard<string> | SHORT_WILDCARD;
  labelFontSize?: number | Wildcard<number> | SHORT_WILDCARD;
  shortTimeLabels?: boolean | Wildcard<boolean> | SHORT_WILDCARD;

  // Legend_Symbol Properties
  symbolColor?: string | Wildcard<string> | SHORT_WILDCARD;
  symbolShape?: string | Wildcard<string> | SHORT_WILDCARD;
  symbolSize?: number | Wildcard<number> | SHORT_WILDCARD;
  symbolStrokeWidth?: number | Wildcard<number> | SHORT_WILDCARD;

  // Legend_Title Properties
  title?: string | Wildcard<string> | SHORT_WILDCARD;
  titleColor?: string | Wildcard<string> | SHORT_WILDCARD;
  titleFont?: string | Wildcard<string> | SHORT_WILDCARD;
  titleFontSize?: number | Wildcard<number> | SHORT_WILDCARD;
  titleFontWeight?: string | Wildcard<string> | SHORT_WILDCARD;
}

export interface ScaleQuery extends Wildcard<boolean> {
  bandSize?: number | Wildcard<number> | SHORT_WILDCARD;
  clamp?: boolean | Wildcard<boolean> | SHORT_WILDCARD;
  domain?: number[] | string[] | Wildcard<number[] | string[]> | SHORT_WILDCARD;
  exponent?: number | Wildcard<number> | SHORT_WILDCARD;
  nice?: boolean | Wildcard<boolean> | SHORT_WILDCARD;
  range?: string | number[] | string[] | Wildcard<string | number[] | string[]> | SHORT_WILDCARD;
  round?: boolean | Wildcard<boolean> | SHORT_WILDCARD;
  type?: ScaleType | Wildcard<ScaleType> | SHORT_WILDCARD;
  useRawDomain?: boolean | Wildcard<boolean> | SHORT_WILDCARD;
  zero?: boolean | Wildcard<boolean> | SHORT_WILDCARD;

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

