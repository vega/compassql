import { QueryConfig } from './config';
import {
  Property, isEncodingNestedProp,
  SCALE_CHILD_PROPS, AXIS_CHILD_PROPS, LEGEND_CHILD_PROPS
} from './property';
import { Schema } from './schema';
import { extend, isArray } from './util';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Axis} from 'vega-lite/src/axis';
import {Bin} from 'vega-lite/src/bin';
import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR} from 'vega-lite/src/channel';
import {FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import {Scale, ScaleType} from 'vega-lite/src/scale';
import {Legend} from 'vega-lite/src/legend';
import {SortField, SortOrder} from 'vega-lite/src/sort';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';


export const SHORT_WILDCARD: SHORT_WILDCARD = '?';
export type SHORT_WILDCARD = '?';

export interface Wildcard<T> {
  name?: string;
  enum?: T[];
}

export type WildcardProperty<T> = T | Wildcard<T> | SHORT_WILDCARD;

export interface ExtendedWildcard<T> extends Wildcard<T> {
  [prop: string]: any;
}

export function isWildcard(prop: any): prop is Wildcard<any> | SHORT_WILDCARD  {
  return isShortWildcard(prop) || (prop !== undefined && (!!prop.enum || !!prop.name) && !isArray(prop));
}

export function isShortWildcard(prop: any): prop is SHORT_WILDCARD {
  return prop === SHORT_WILDCARD;
}

export function initWildcard(prop: any, defaultName: string, defaultEnumValues: any[]): ExtendedWildcard<any> {
  return extend({}, {
      name: defaultName,
      enum: defaultEnumValues
    }, prop === SHORT_WILDCARD ? {} : prop);
}

/**
 * Initial short names from list of full camelCaseNames.
 * For each camelCaseNames, return unique short names based on initial (e.g., `ccn`)
 */
function initNestedPropName(fullNames: string[]) {
  let index = {};
  let has = {};
  for (const fullName of fullNames) {
    const initialIndices = [0];
    for (let i = 0; i < fullName.length ; i++) {
      if (fullName.charAt(i).toUpperCase() === fullName.charAt(i)) {
        initialIndices.push(i);
      }
    }
    let shortName = initialIndices.map(i => fullName.charAt(i)).join('').toLowerCase();
    if (!has[shortName]) {
      index[fullName] = shortName;
      has[shortName] = true;
      continue;
    }
    // If duplicate, add last character and try again!
    if (initialIndices[initialIndices.length - 1] !== fullName.length - 1) {
      shortName = initialIndices.concat([fullName.length - 1]).map(i => fullName.charAt(i)).join('').toLowerCase();
      if (!has[shortName]) {
        index[fullName] = shortName;
        has[shortName] = true;
        continue;
      }
    }
    for (let i = 1; !index[fullName]; i++) {
      let shortNameWithNo = shortName + '_' + i;
      if (!has[shortNameWithNo]) {
        index[fullName] = shortNameWithNo;
        has[shortNameWithNo] = true;
        break;
      }
    }
  }
  return index;
}

export const DEFAULT_NAME = {
  mark: 'm',
  channel: 'c',
  aggregate: 'a',
  autoCount: '#',
  hasFn: 'h',
  bin: 'b',
  sort: 'so',
  scale: 's',
  axis: 'ax',
  legend: 'l',

  timeUnit: 'tu',
  field: 'f',
  type: 't',

  binProps: {
    maxbins: 'mb',
    min: 'mi',
    max: 'ma',
    base: 'b',
    step: 's',
    steps: 'ss',
    minstep: 'ms',
    divide: 'd'
  },
  sortProps: {
    field: 'f',
    op: 'o',
    order: 'or'
  },
  scaleProps: initNestedPropName(SCALE_CHILD_PROPS),
  axisProps: initNestedPropName(AXIS_CHILD_PROPS),
  legendProps: initNestedPropName(LEGEND_CHILD_PROPS)
};

export function getDefaultName(prop: Property) {
  if (isEncodingNestedProp(prop)) {
    return DEFAULT_NAME[prop.parent] + '-' + DEFAULT_NAME[prop.parent + 'Props'][prop.child];
  }
  if (DEFAULT_NAME[prop]) {
    return DEFAULT_NAME[prop];
  }
  /* istanbul ignore next */
  throw new Error('Default name undefined for ' + prop);
}

/**
 * Generic index for default enum (values to enumerate) of a particular definition type.
 */
type DefEnumIndex<T> = { [P in keyof T]: T[P][]};

const DEFAULT_BOOLEAN_ENUM = [false, true];

export type EnumIndex =
  {
    mark: Mark[];
    channel: Channel[],
    autoCount: boolean[],
    hasFn: boolean[],
  } &
  DefEnumIndex<FieldDef> &
  {
    sort: (SortField | SortOrder)[],
    scale: boolean[],
    axis: boolean[],
    legend: boolean[],

    binProps: Partial<DefEnumIndex<Bin>>,
    sortProps: Partial<DefEnumIndex<SortField>>,
    scaleProps: Partial<DefEnumIndex<Scale>>,
    axisProps: Partial<DefEnumIndex<Axis>>,
    legendProps: Partial<DefEnumIndex<Legend>>
  };


const DEFAULT_BIN_PROPS_ENUM: DefEnumIndex<Bin> = {
  maxbins: [5, 10, 20],
  extent: [undefined],
  base: [10],
  step: [undefined],
  steps: [undefined],
  minstep: [undefined],
  divide: [[5, 2]]
};

const DEFAULT_SORT_PROPS: DefEnumIndex<SortField> = {
  field: [undefined], // This should be never call and instead read from the schema
  op: [AggregateOp.MIN, AggregateOp.MEAN],
  order: [SortOrder.ASCENDING, SortOrder.DESCENDING]
};

const DEFAULT_SCALE_PROPS_ENUM: DefEnumIndex<Scale> = {
  type: [undefined, ScaleType.LOG],
  domain: [undefined],
  exponent: [1, 2],

  clamp: DEFAULT_BOOLEAN_ENUM,
  nice: DEFAULT_BOOLEAN_ENUM,
  round: DEFAULT_BOOLEAN_ENUM,
  useRawDomain: DEFAULT_BOOLEAN_ENUM,
  zero: DEFAULT_BOOLEAN_ENUM,

  range: [undefined],
  rangeStep: [17, 21],
};


const DEFAULT_AXIS_PROPS_ENUM: DefEnumIndex<Axis> = {
  axisColor: [undefined],
  axisWidth: [undefined],
  zindex: [1, 0],
  offset: [undefined],
  orient: [undefined],
  shortTimeLabels: DEFAULT_BOOLEAN_ENUM,
  subdivide: [undefined],
  values: [undefined],

  grid: DEFAULT_BOOLEAN_ENUM,
  gridColor: [undefined],
  gridDash: [undefined],
  gridOpacity: [undefined],
  gridWidth: [undefined],

  format: [undefined],
  labels: DEFAULT_BOOLEAN_ENUM,
  labelAngle: [undefined],
  labelMaxLength: [undefined],


  ticks: DEFAULT_BOOLEAN_ENUM,
  tickColor: [undefined],
  tickLabelColor: [undefined],
  tickLabelFont: [undefined],
  tickLabelFontSize: [undefined],
  tickPadding: [undefined],
  tickSize: [undefined],
  tickSizeMajor: [undefined],
  tickSizeMinor: [undefined],
  tickSizeEnd: [undefined],
  tickWidth: [undefined],

  title: [undefined],
  titleColor: [undefined],
  titleFont: [undefined],
  titleFontWeight: [undefined],
  titleFontSize: [undefined],
  titleOffset: [undefined],
  titleMaxLength: [undefined]
};

const DEFAULT_LEGEND_PROPS_ENUM: DefEnumIndex<Legend> = {
  orient: ['left', 'right'],
  offset: [undefined],
  format: [undefined],
  shortTimeLabels: DEFAULT_BOOLEAN_ENUM,
  values: [undefined],

  labelAlign: [undefined],
  labelBaseline: [undefined],
  labelColor: [undefined],
  labelFont: [undefined],
  labelFontSize: [undefined],

  symbolColor: [undefined],
  symbolShape: [undefined],
  symbolSize: [undefined],
  symbolStrokeWidth:[undefined],

  title: [undefined],
  titleColor: [undefined],
  titleFont: [undefined],
  titleFontSize: [undefined],
  titleFontWeight: [undefined],
};

// Use FullEnumIndex to make sure we have all properties specified here!
export const DEFAULT_ENUM_INDEX: EnumIndex = {
  mark: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA, Mark.TICK], // Mark.TEXT
  channel: [X, Y, ROW, COLUMN, SIZE, COLOR], // TODO: TEXT

  aggregate: [undefined, AggregateOp.MEAN],
  autoCount: DEFAULT_BOOLEAN_ENUM,
  bin: DEFAULT_BOOLEAN_ENUM,
  hasFn: DEFAULT_BOOLEAN_ENUM,
  timeUnit: [undefined, TimeUnit.YEAR, TimeUnit.MONTH, TimeUnit.MINUTES, TimeUnit.SECONDS],

  field: [undefined], // This is not used as field should be read from schema
  type: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL],

  sort: [SortOrder.ASCENDING, SortOrder.DESCENDING],

  scale: [true],
  axis: DEFAULT_BOOLEAN_ENUM,
  legend: DEFAULT_BOOLEAN_ENUM,

  binProps: DEFAULT_BIN_PROPS_ENUM,
  sortProps: DEFAULT_SORT_PROPS,
  scaleProps: DEFAULT_SCALE_PROPS_ENUM,
  axisProps: DEFAULT_AXIS_PROPS_ENUM,
  legendProps: DEFAULT_LEGEND_PROPS_ENUM
};


// TODO: rename this to getDefaultEnum
export function getDefaultEnumValues(prop: Property, schema: Schema, opt: QueryConfig): any[] {
  if (prop === 'field' || (isEncodingNestedProp(prop) && prop.parent === 'sort' && prop.child === 'field')) {
    // For field, by default enumerate all fields
    return schema.fields();
  }

  let val;
  if (isEncodingNestedProp(prop)) {
    val = opt.enum[prop.parent + 'Props'][prop.child];
  } else {
    val = opt.enum[prop];
  }

  if (val !== undefined) {
    return val;
  }

  /* istanbul ignore next */
  throw new Error('No default enumValues for ' + prop);
}
