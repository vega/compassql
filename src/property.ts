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

  // TODO: Filter (Field, Value?)
  // TODO: SORT, SCALE_TYPE, AXIS, LEGEND
}

export const ENCODING_PROPERTIES = [
  Property.CHANNEL,
  Property.BIN,
  Property.BIN_MAXBINS,
  Property.TIMEUNIT,
  Property.AGGREGATE,
  Property.AUTOCOUNT,
  Property.FIELD,
  Property.TYPE
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
