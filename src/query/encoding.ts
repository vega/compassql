import {AggregateOp} from 'vega-lite/src/aggregate';
import {AxisOrient} from 'vega-lite/src/axis';
import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {SortOrder, SortField} from 'vega-lite/src/sort';
import {defaultScaleType, TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {Wildcard, isWildcard, SHORT_WILDCARD, WildcardProperty} from '../wildcard';
import {contains} from '../util';

export type Field = string;

export interface EncodingQuery {
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

  field?: WildcardProperty<Field>;
  type?: WildcardProperty<Type>;
  // TODO: value

  axis?: boolean | AxisQuery | SHORT_WILDCARD;
  legend?: boolean | LegendQuery | SHORT_WILDCARD;
}

export interface AxisQuery extends Wildcard<boolean> {
  // General Axis Properties
  axisColor?: WildcardProperty<string>;
  axisWidth?: WildcardProperty<number>;
  layer?: WildcardProperty<string>;
  offset?: WildcardProperty<number>;
  orient?: WildcardProperty<AxisOrient>;

  // Axis_Grid Properties
  grid?: WildcardProperty<boolean>;
  gridColor?: WildcardProperty<string>;
  gridDash?: WildcardProperty<number>;
  gridOpacity?: WildcardProperty<number>;
  gridWidth?: WildcardProperty<number>;

  // Axis_Label Properties
  labels?: WildcardProperty<boolean>;
  format?: WildcardProperty<string>;
  labelAngle?: WildcardProperty<number>;
  labelMaxLength?: WildcardProperty<number>;
  shortTimeLabels?: WildcardProperty<boolean>;

  // Axis_Tick Properties
  subdivide?: WildcardProperty<number>;
  ticks?: WildcardProperty<number>;
  tickColor?: WildcardProperty<string>;
  tickLabelColor?: WildcardProperty<string>;
  tickLabelFont?: WildcardProperty<string>;
  ticklabelFontSize?: WildcardProperty<number>;
  tickPadding?: WildcardProperty<number>;
  tickSize?: WildcardProperty<number>;
  tickSizeMajor?: WildcardProperty<number>;
  tickSizeMinor?: WildcardProperty<number>;
  tickSizeEnd?: WildcardProperty<number>;
  tickWidth?: WildcardProperty<number>;
  values?: WildcardProperty<number>;

  // Axis_Title Properties
  title?: WildcardProperty<string>;
  titleColor?: WildcardProperty<string>;
  titleFont?: WildcardProperty<string>;
  titleFontWeight?: WildcardProperty<string>;
  titleFontSize?: WildcardProperty<number>;
  titleOffset?: WildcardProperty<number>;
  titleMaxLength?: WildcardProperty<number>;
  characterWidth?: WildcardProperty<number>;
}

export interface BinQuery extends Wildcard<boolean> {
  maxbins?: WildcardProperty<number>;
  min?: WildcardProperty<number>;
  max?: WildcardProperty<number>;
  base?: WildcardProperty<number>;
  step?: WildcardProperty<number>;
  steps?: WildcardProperty<number>;
  minstep?: WildcardProperty<number>;
  div?: WildcardProperty<number>;
}

export interface LegendQuery extends Wildcard<boolean> {
  // General Legend Properties
  orient?: WildcardProperty<string>;
  offset?: WildcardProperty<number>;
  values?: WildcardProperty<any>;

  // Legend_Label Properties
  format?: WildcardProperty<string>;
  labelAlign?: WildcardProperty<string>;
  labelBaseline?:string | Wildcard<string> | SHORT_WILDCARD;
  labelColor?: WildcardProperty<string>;
  labelFont?: WildcardProperty<string>;
  labelFontSize?: WildcardProperty<number>;
  shortTimeLabels?: WildcardProperty<boolean>;

  // Legend_Symbol Properties
  symbolColor?: WildcardProperty<string>;
  symbolShape?: WildcardProperty<string>;
  symbolSize?: WildcardProperty<number>;
  symbolStrokeWidth?: WildcardProperty<number>;

  // Legend_Title Properties
  title?: WildcardProperty<string>;
  titleColor?: WildcardProperty<string>;
  titleFont?: WildcardProperty<string>;
  titleFontSize?: WildcardProperty<number>;
  titleFontWeight?: WildcardProperty<string>;
}

export interface ScaleQuery extends Wildcard<boolean> {
  bandSize?: WildcardProperty<number>;
  clamp?: WildcardProperty<boolean>;
  domain?: number[] | string[] | Wildcard<number[] | string[]> | SHORT_WILDCARD;
  exponent?: WildcardProperty<number>;
  nice?: WildcardProperty<boolean>;
  range?: string | number[] | string[] | Wildcard<string | number[] | string[]> | SHORT_WILDCARD;
  round?: WildcardProperty<boolean>;
  type?: WildcardProperty<ScaleType>;
  useRawDomain?: WildcardProperty<boolean>;
  zero?: WildcardProperty<boolean>;

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

