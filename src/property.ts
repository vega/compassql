import {Axis, AXIS_PROPERTIES} from 'vega-lite/src/axis';
import {Bin} from 'vega-lite/src/bin';
import {Scale, SCALE_PROPERTIES} from 'vega-lite/src/scale';
import {Legend, LEGEND_PROPERTIES} from 'vega-lite/src/legend';
import {SortField} from 'vega-lite/src/sort';

import {toMap} from './util';
import {FieldQuery, ValueQuery} from './query/encoding';
import {TransformQuery} from './query/transform';

export type Property = FlatProp | EncodingNestedProp;
export type FlatProp = MarkProp | TransformProp | EncodingTopLevelProp;

export type MarkProp = 'mark' | 'stack'; // FIXME: determine how 'stack' works;
export type TransformProp = keyof TransformQuery;
export type EncodingTopLevelProp = keyof (FieldQuery & ValueQuery);
export type EncodingNestedProp = BinProp | SortProp | ScaleProp | AxisProp | LegendProp;

export type EncodingNestedChildProp = keyof Bin | keyof SortField | keyof Scale | keyof Axis | keyof Legend;

export type BaseEncodingNestedProp<P, T> = {
  parent: P,
  child: keyof T
};

export type BinProp = BaseEncodingNestedProp<'bin', Bin>;
export type SortProp = BaseEncodingNestedProp<'sort', SortField>;
export type ScaleProp = BaseEncodingNestedProp<'scale', Scale>;
export type AxisProp = BaseEncodingNestedProp<'axis', Axis>;
export type LegendProp = BaseEncodingNestedProp<'legend', Legend>;

export function isEncodingNestedProp(p: Property): p is EncodingNestedProp {
  return !!p['parent'];
}

export const ENCODING_TOPLEVEL_PROPS: EncodingTopLevelProp[] = [
  // channel
  'channel',
  // fn
  'aggregate', 'autoCount', 'bin', 'timeUnit', 'hasFn',
  // sort
  'sort',
  // field / type
  'field', 'type',
  // scale / axis / legend
  'scale', 'axis', 'legend'
];

const ENCODING_TOPLEVEL_PROPERTY_INDEX = toMap(ENCODING_TOPLEVEL_PROPS);

export function isEncodingTopLevelProperty(p: Property) {
  return p in ENCODING_TOPLEVEL_PROPERTY_INDEX;
}

const ENCODING_NESTED_PROP_PARENTS: EncodingTopLevelProp[] = [
  'bin', 'scale', 'sort', 'axis', 'legend'
];

const ENCODING_NESTED_PROP_PARENT_INDEX = toMap(ENCODING_NESTED_PROP_PARENTS);

export function hasNestedProperty(prop: string) {
  return ENCODING_NESTED_PROP_PARENT_INDEX[prop as string];
}

export const BIN_CHILD_PROPS: (keyof Bin)[] = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
export const SORT_CHILD_PROPS: (keyof SortField)[] = ['field', 'op', 'order'];
export const SCALE_CHILD_PROPS: (keyof Scale)[] =
  ['clamp', 'domain', 'exponent', 'nice', 'range', 'rangeStep', 'round', 'type', 'zero'];

const BIN_PROPS = BIN_CHILD_PROPS.map((c): BinProp => {
  return {parent: 'bin', child: c};
});

export const SORT_PROPS = SORT_CHILD_PROPS.map((c): SortProp => {
  return {parent: 'sort', child: c};
});

export const SCALE_PROPS = SCALE_PROPERTIES.map((c): ScaleProp => {
  return {parent: 'scale', child: c};
});

const AXIS_PROPS = AXIS_PROPERTIES.map((c): AxisProp => {
  return {parent: 'axis', child: c};
});

const LEGEND_PROPS = LEGEND_PROPERTIES.map((c): LegendProp => {
  return {parent: 'legend', child: c};
});

export const ENCODING_NESTED_PROPS = ([] as EncodingNestedProp[]).concat(
  BIN_PROPS, SORT_PROPS, SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS
);

const PROP_KEY_DELIMITER = '.';

export function toKey(p: Property): string {
  if (isEncodingNestedProp(p)) {
    return p.parent + PROP_KEY_DELIMITER + p.child;
  }
  return p;
}

export function fromKey(k: string): Property {
  const split = k.split(PROP_KEY_DELIMITER);
  /* istanbul ignore else */
  if (split.length === 1) {
    return k as Property;
  } else if (split.length === 2) {
    return {
      parent: split[0],
      child: split[1]
    } as EncodingNestedProp;
  } else {
    throw 'Invalid property key with ' + split.length + ' dots: ' + k;
  }
}

const ENCODING_NESTED_PROP_INDEX = ENCODING_NESTED_PROPS.reduce((i, prop: EncodingNestedProp) => {
  i[prop.parent] = i[prop.parent] || [];
  i[prop.parent][prop.child] = prop;
  return i;
}, {});

// FIXME consider using a more general method
export function getEncodingNestedProp(parent: EncodingTopLevelProp, child: EncodingNestedChildProp) {
  return (ENCODING_NESTED_PROP_INDEX[parent] || {})[child];
}

export function isEncodingProperty(prop: Property): boolean {
  return isEncodingTopLevelProperty(prop) || isEncodingNestedProp(prop);
}

export const ALL_ENCODING_PROPS = ([] as Property[]).concat(
  ENCODING_TOPLEVEL_PROPS,
  ENCODING_NESTED_PROPS
);

export const DEFAULT_PROP_PRECEDENCE =
([
  'type', // type is a constraint for field
  'field',

  // Field Transform
  'bin', 'timeUnit', 'aggregate', 'autoCount',

  // Encoding
  'channel',

  // Mark
  'mark', // 'stack',

  'scale', 'sort',
  'axis', 'legend'
] as Property[]).concat(
  BIN_PROPS, SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS
);

export namespace Property {
  export const MARK: 'mark' = 'mark';

  export const FILTER: 'filter' = 'filter';
  // TODO: Sub-properties for filter

  export const CALCULATE: 'calculate' = 'calculate';
  // TODO: Sub-properties for calculate

  export const FILTERINVALID: 'filterInvalid' = 'filterInvalid';

  // Layout
  export const STACK: 'stack' = 'stack';
  // TODO: sub parts of stack

  // Encoding Properties
  export const CHANNEL: 'channel' = 'channel';
  export const AGGREGATE: 'aggregate' = 'aggregate';
  export const AUTOCOUNT: 'autoCount' = 'autoCount';
  export const BIN: 'bin' = 'bin';

  export const HAS_FN: 'hasFn' = 'hasFn';
  export const TIMEUNIT: 'timeUnit' = 'timeUnit';
  export const FIELD: 'field' = 'field';
  export const TYPE: 'type' = 'type';

  export const SORT: 'sort' = 'sort';

  export const SCALE: 'scale' = 'scale';
  export const AXIS: 'axis' = 'axis';

  export const LEGEND: 'legend' = 'legend';
}
