import {Axis} from 'vega-lite/build/src/axis';
import {BinParams} from 'vega-lite/build/src/bin';
import {Channel} from 'vega-lite/build/src/channel';
import * as vlFieldDef from 'vega-lite/build/src/fielddef';
import {Mark} from 'vega-lite/build/src/mark';
import {Scale} from 'vega-lite/build/src/scale';
import {Legend} from 'vega-lite/build/src/legend';
import {SortOrder, SortField} from 'vega-lite/build/src/sort';
import {TimeUnit} from 'vega-lite/build/src/timeunit';
import {Type as VLType, Type} from 'vega-lite/build/src/type';
import {ExpandedType} from './expandedtype';
import {scaleType as compileScaleType} from 'vega-lite/build/src/compile/scale/type';
import {Wildcard, isWildcard, SHORT_WILDCARD, WildcardProperty} from '../wildcard';
import {AggregateOp} from 'vega-lite/build/src/aggregate';
import {FieldDef} from 'vega-lite/build/src/fielddef';

export type EncodingQuery = FieldQuery | ValueQuery | AutoCountQuery;

export interface EncodingQueryBase {
  channel: WildcardProperty<Channel>;

  description?: string;
}

export interface ValueQuery extends EncodingQueryBase {
  value: WildcardProperty<boolean | number | string>;
}

export function isValueQuery(encQ: EncodingQuery): encQ is ValueQuery {
  return encQ !== null && encQ !== undefined && encQ['value'];
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

export interface AutoCountQuery extends EncodingQueryBase {
  autoCount: WildcardProperty<boolean>;
  type: 'quantitative';
}

export interface FieldQueryBase {
  // FieldDef
  aggregate?: WildcardProperty<AggregateOp>;
  timeUnit?: WildcardProperty<TimeUnit>;

  /**
   * Special flag for enforcing that the field should have either timeUnit, bin, or aggregate
   */
  hasFn?: boolean;

  bin?: boolean | BinQuery | SHORT_WILDCARD;
  scale?: boolean | ScaleQuery | SHORT_WILDCARD;

  sort?: SortOrder | SortField;

  field?: WildcardProperty<string>;
  type?: WildcardProperty<ExpandedType>;

  axis?: boolean | AxisQuery | SHORT_WILDCARD;
  legend?: boolean | LegendQuery | SHORT_WILDCARD;
}

export type FieldQuery = EncodingQueryBase & FieldQueryBase;

// Using Mapped Type from TS2.1 to declare query for an object without nested property
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#mapped-types
export type FlatQuery<T> = {
  [P in keyof T]: WildcardProperty<T[P]>
};

export type FlatQueryWithEnableFlag<T> = (Wildcard<boolean> | {}) & FlatQuery<T>;

export type BinQuery = FlatQueryWithEnableFlag<BinParams>;
export type ScaleQuery =  FlatQueryWithEnableFlag<Scale>;
export type AxisQuery =  FlatQueryWithEnableFlag<Axis>;
export type LegendQuery = FlatQueryWithEnableFlag<Legend>;


export function toFieldDef(encQ: FieldQuery | AutoCountQuery,
    props: (keyof (FieldQuery))[] = ['aggregate', 'bin', 'timeUnit', 'field', 'type']): FieldDef<string> {
  if (isFieldQuery(encQ)) {
    return props.reduce((fieldDef: FieldDef<string>, prop: keyof FieldQuery) => {
      const propValue = encQ[prop];
      if (isWildcard(propValue)) {
        throw new Error(`Cannot convert ${JSON.stringify(encQ)} to fielddef: ${prop} is wildcard`);
      } else if (propValue !== undefined) {
        if (prop === 'type') {
          fieldDef.type = propValue as Type;
        } else {
          fieldDef[prop] = propValue;
        }
      }
      return fieldDef;
    }, {} as FieldDef<string>);

  } else {
    if (encQ.autoCount === false) {
      throw new Error(`Cannot convert {autoCount: false} into a field def`);
    } else {
      return props.reduce((fieldDef: FieldDef<string>, prop: keyof FieldQuery) => {
        if (isWildcard(encQ[prop])) {
          throw new Error(`Cannot convert ${JSON.stringify(encQ)} to fielddef: ${prop} is wildcard`);
        }
        switch (prop) {
          case 'type':
            fieldDef.type = 'quantitative';
            break;
          case 'aggregate':
            fieldDef.aggregate = 'count';
            break;
        }
        return fieldDef;
      }, {} as FieldDef<string>);
    }
  }
}

/**
 * Is a field query continuous field?
 * This method is applicable only for fieldQuery without wildcard
 */
export function isContinuous(encQ: EncodingQuery) {
  if (isFieldQuery(encQ)) {
    return vlFieldDef.isContinuous(toFieldDef(encQ, ['bin', 'timeUnit', 'field', 'type']));
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
    const fieldDef = toFieldDef(encQ, ['bin', 'timeUnit', 'field', 'type']);
    return vlFieldDef.isDiscrete(fieldDef) || !!fieldDef.timeUnit;
  }
  return false;
}

/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
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
  const scaleConfig = {};

  if (isWildcard(scale.type) || isWildcard(type) || isWildcard(channel) || isWildcard(bin)) {
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

  let vegaLiteType: VLType = type === ExpandedType.KEY ? 'nominal': type;

  const fieldDef = {type: vegaLiteType, timeUnit: timeUnit as TimeUnit, bin: bin as BinParams};
  return compileScaleType(scale.type, channel, fieldDef, markType, scaleConfig);
}
