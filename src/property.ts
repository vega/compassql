import {Axis, AXIS_PROPERTIES} from 'vega-lite/build/src/axis';
import {BinParams} from 'vega-lite/build/src/bin';
import {Scale, SCALE_PROPERTIES} from 'vega-lite/build/src/scale';
import {Legend, LEGEND_PROPERTIES} from 'vega-lite/build/src/legend';
import {SortField} from 'vega-lite/build/src/sort';
import {Flag, flagKeys} from 'vega-lite/build/src/util';
import {FieldQuery, ValueQuery, AutoCountQuery} from './query/encoding';
import {TransformQuery} from './query/transform';
import {Diff} from './util';


/**
 * There are two types of `Property`'s.
 * One is just flat property names.
 * (Try to hover `FlatProp` to see all of them.)
 * Another is an object that describes a parent property (e.g., `scale`) and the child property (e.g., `type`)
 */
export type Property = FlatProp | EncodingNestedProp;
export type FlatProp = MarkProp | TransformProp | ViewProp | EncodingTopLevelProp;

export type MarkProp = 'mark' | 'stack'; // FIXME: determine how 'stack' works;
export type TransformProp = keyof TransformQuery;
export type ViewProp = 'width' | 'height' | 'background' | 'padding' | 'title';
export type EncodingTopLevelProp = Diff<keyof (FieldQuery & ValueQuery & AutoCountQuery), 'description'>; // Do not include description since description is simply a metadata

export type EncodingNestedProp = BinProp | SortProp | ScaleProp | AxisProp | LegendProp;

export type EncodingNestedChildProp = keyof BinParams | keyof SortField<string> | keyof Scale | keyof Axis | keyof Legend;

/**
 * An object that describes a parent property (e.g., `scale`) and the child property (e.g., `type`)
 */
export type BaseEncodingNestedProp<P, T> = {
  parent: P,
  child: keyof T
};

export type BinProp = BaseEncodingNestedProp<'bin', BinParams>;
export type SortProp = BaseEncodingNestedProp<'sort', SortField<string>>;
export type ScaleProp = BaseEncodingNestedProp<'scale', Scale>;
export type AxisProp = BaseEncodingNestedProp<'axis', Axis>;
export type LegendProp = BaseEncodingNestedProp<'legend', Legend>;

export function isEncodingNestedProp(p: Property): p is EncodingNestedProp {
  return !!p['parent'];
}

const ENCODING_TOPLEVEL_PROP_INDEX: Flag<EncodingTopLevelProp> = {
  channel: 1,
  aggregate: 1, autoCount: 1, bin: 1, timeUnit: 1, hasFn: 1,
  sort: 1, stack: 1,
  field: 1, type: 1,
  format: 1, scale: 1, axis: 1, legend: 1,
  value: 1
};

export const ENCODING_TOPLEVEL_PROPS = flagKeys(ENCODING_TOPLEVEL_PROP_INDEX);

export function isEncodingTopLevelProperty(p: Property): p is EncodingTopLevelProp {
  return p in ENCODING_TOPLEVEL_PROP_INDEX;
}

export type EncodingNestedPropParent = 'bin' | 'scale' | 'sort' | 'axis' | 'legend';

const ENCODING_NESTED_PROP_PARENT_INDEX: Flag<EncodingNestedPropParent> = {
  bin: 1,
  scale: 1,
  sort: 1,
  axis: 1,
  legend: 1
};

export function isEncodingNestedParent(prop: string): prop is EncodingNestedPropParent {
  return ENCODING_NESTED_PROP_PARENT_INDEX[prop as string];
}

// FIXME -- we should not have to manually specify these
export const BIN_CHILD_PROPS: (keyof BinParams)[] = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
export const SORT_CHILD_PROPS: (keyof SortField<string>)[] = ['field', 'op', 'order'];

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

export const VIEW_PROPS: Property[] = ['width', 'height', 'background', 'padding', 'title'] as Property[];

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

export function isEncodingProperty(p: Property): p is EncodingTopLevelProp | EncodingNestedProp {
  return isEncodingTopLevelProperty(p) || isEncodingNestedProp(p);
}

export const ALL_ENCODING_PROPS = ([] as Property[]).concat(
  ENCODING_TOPLEVEL_PROPS,
  ENCODING_NESTED_PROPS
);

export const DEFAULT_PROP_PRECEDENCE: Property[] =
([
  'type', // type is a constraint for field
  'field',

  // Field Transform
  'bin', 'timeUnit', 'aggregate', 'autoCount',

  // Encoding
  'channel',

  // Mark
  'mark', 'stack',

  'scale', 'sort',
  'axis', 'legend',
] as Property[]).concat(
  BIN_PROPS, SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS, SORT_PROPS
);

export namespace Property {
  export const MARK: 'mark' = 'mark';

  export const TRANSFORM: 'transform' = 'transform';
  // Layout
  export const STACK: 'stack' = 'stack';

  export const FORMAT: 'format' = 'format';

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

  export const WIDTH: 'width' = 'width';
  export const HEIGHT: 'height' = 'height';
  export const BACKGROUND: 'background' = 'background';
  export const PADDING: 'padding' = 'padding';
  export const TITLE: 'title' = 'title';
}
