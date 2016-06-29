import {Dict} from './util';

export enum Property {
  MARK = 'mark' as any,
  CHANNEL = 'channel' as any,
  AGGREGATE = 'aggregate' as any,
  AUTOCOUNT = 'autoCount' as any,
  BIN = 'bin' as any,
  BIN_MAXBINS = 'binMaxBins' as any,
  TIMEUNIT = 'timeUnit' as any,
  FIELD = 'field' as any,
  TYPE = 'type' as any,
  SCALE = 'scale' as any,
  SCALE_SCALETYPE = 'scaleScaleType' as any

  // TODO: Filter (Field, Value?)
  // TODO: SORT, SCALE, SCALE_TYPE, AXIS, AXIS_*, LEGEND, LEGEND_*
}

export function hasNestedProperty(prop: Property) {
  switch (prop) {
    case Property.BIN:
    case Property.SCALE:
      // TODO: SCALE, AXIS, LEGEND
      return true;
    case Property.MARK:
    case Property.CHANNEL:
    case Property.AGGREGATE:
    case Property.AUTOCOUNT:
    case Property.TIMEUNIT:
    case Property.FIELD:
    case Property.TYPE:
    case Property.BIN_MAXBINS:
      return false;
  }
  /* istanbul ignore next */
  throw new Error('hasNestedProperty undefined for property ' + prop);
}

export const ENCODING_PROPERTIES = [
  Property.CHANNEL,
  Property.BIN,
  Property.BIN_MAXBINS,
  Property.TIMEUNIT,
  Property.AGGREGATE,
  Property.AUTOCOUNT,
  Property.FIELD,
  Property.TYPE,
  Property.SCALE,
  Property.SCALE_SCALETYPE
];

export const DEFAULT_PROPERTY_PRECENCE: Property[] =  [
  // Projection
  Property.TYPE, // type is a constraint for field
  Property.FIELD,

  // TODO: transform

  // Field Transform
  Property.BIN,
  Property.TIMEUNIT,
  Property.AGGREGATE,
  Property.AUTOCOUNT,

  // Nested Property
  Property.BIN_MAXBINS,
  Property.SCALE_SCALETYPE,

  // Encoding
  Property.CHANNEL,
  Property.MARK,
  Property.SCALE
];

export interface NestedEncodingProperty {
  property: Property;
  parent: string;
  child: string;
}

export const NESTED_ENCODING_PROPERTIES: NestedEncodingProperty[] = [
  {
    property: Property.BIN_MAXBINS,
    parent: 'bin',
    child: 'maxbins'
  },
  {
    property: Property.SCALE_SCALETYPE,
    parent: 'scale',
    child: 'scaletype'
  }
  // TODO: other bin parameters
  // TODO: scale, axis, legend
];

const NESTED_ENCODING_INDEX: Dict<NestedEncodingProperty> =
  NESTED_ENCODING_PROPERTIES.reduce((m, nestedProp) => {
    m[nestedProp.property] = nestedProp;
    return m;
  }, {} as Dict<NestedEncodingProperty>);

export function getNestedEncodingProperty(prop: Property) {
  return NESTED_ENCODING_INDEX[prop];
}
