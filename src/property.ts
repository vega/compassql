import {Dict} from './util';

export enum Property {
  // TODO: Filter (Field, Value?)


  MARK = 'mark' as any,

  // Encoding Properties
  CHANNEL = 'channel' as any,
  AGGREGATE = 'aggregate' as any,
  AUTOCOUNT = 'autoCount' as any,
  BIN = 'bin' as any,
  BIN_MAXBINS = 'binMaxBins' as any,
  TIMEUNIT = 'timeUnit' as any,
  FIELD = 'field' as any,
  TYPE = 'type' as any,

  // TODO: Sort

  // - Scale
  SCALE = 'scale' as any,
  SCALE_BANDSIZE = 'scaleBandSize' as any,
  SCALE_CLAMP = 'scaleClamp' as any,
  SCALE_DOMAIN = 'scaleDomain' as any,
  SCALE_EXPONENT = 'scaleExponent' as any,
  SCALE_NICE = 'scaleNice' as any,
  SCALE_RANGE = 'scaleRange' as any,
  SCALE_ROUND = 'scaleRound' as any,
  SCALE_TYPE = 'scaleType' as any,
  SCALE_USERAWDOMAIN = 'scaleUseRawDomain' as any,
  SCALE_ZERO = 'scaleZero' as any,


  // - Axis
  AXIS = 'axis' as any,
  // TODO: AXIS_*

  // - Legend
  LEGEND = 'legend' as any
  // TODO: LEGEND_*
}

export function hasNestedProperty(prop: Property) {
  switch (prop) {
    case Property.BIN:
    case Property.SCALE:
      // TODO: AXIS, LEGEND
      return true;
    case Property.MARK:
    case Property.CHANNEL:
    case Property.AGGREGATE:
    case Property.AUTOCOUNT:
    case Property.TIMEUNIT:
    case Property.FIELD:
    case Property.TYPE:
    case Property.BIN_MAXBINS:
    case Property.SCALE_BANDSIZE:
    case Property.SCALE_CLAMP:
    case Property.SCALE_DOMAIN:
    case Property.SCALE_EXPONENT:
    case Property.SCALE_NICE:
    case Property.SCALE_RANGE:
    case Property.SCALE_ROUND:
    case Property.SCALE_TYPE:
    case Property.SCALE_USERAWDOMAIN:
    case Property.SCALE_ZERO:
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
  Property.SCALE_BANDSIZE,
  Property.SCALE_CLAMP,
  Property.SCALE_DOMAIN,
  Property.SCALE_EXPONENT,
  Property.SCALE_NICE,
  Property.SCALE_RANGE,
  Property.SCALE_ROUND,
  Property.SCALE_TYPE,
  Property.SCALE_USERAWDOMAIN,
  Property.SCALE_ZERO
];

export const DEFAULT_PROPERTY_PRECEDENCE: Property[] =  [
  // Projection
  Property.TYPE, // type is a constraint for field
  Property.FIELD,

  // Field Transform
  Property.BIN,
  Property.TIMEUNIT,
  Property.AGGREGATE,
  Property.AUTOCOUNT,

  // Nested Transform Property
  Property.BIN_MAXBINS,

  // Encoding
  Property.CHANNEL,
  Property.MARK,
  Property.SCALE,

  // Nested Encoding Property
  Property.SCALE_BANDSIZE,
  Property.SCALE_CLAMP,
  Property.SCALE_DOMAIN,
  Property.SCALE_EXPONENT,
  Property.SCALE_NICE,
  Property.SCALE_RANGE,
  Property.SCALE_ROUND,
  Property.SCALE_TYPE,
  Property.SCALE_USERAWDOMAIN,
  Property.SCALE_ZERO
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
    property: Property.SCALE_BANDSIZE,
    parent: 'scale',
    child: 'bandSize'
  },
  {
    property: Property.SCALE_CLAMP,
    parent: 'scale',
    child: 'clamp'
  },
  {
    property: Property.SCALE_DOMAIN,
    parent: 'scale',
    child: 'domain'
  },
  {
    property: Property.SCALE_EXPONENT,
    parent: 'scale',
    child: 'exponent'
  },
  {
    property: Property.SCALE_NICE,
    parent: 'scale',
    child: 'nice'
  },
  {
    property: Property.SCALE_RANGE,
    parent: 'scale',
    child: 'range'
  },
  {
    property: Property.SCALE_ROUND,
    parent: 'scale',
    child: 'round'
  },
  {
    property: Property.SCALE_TYPE,
    parent: 'scale',
    child: 'type'
  },
  {
    property: Property.SCALE_USERAWDOMAIN,
    parent: 'scale',
    child: 'useRawDomain'
  },
  {
    property: Property.SCALE_ZERO,
    parent: 'scale',
    child: 'zero'
  }

  // TODO: other bin parameters
  // TODO: axis, legend
];

const NESTED_ENCODING_INDEX: Dict<NestedEncodingProperty> =
  NESTED_ENCODING_PROPERTIES.reduce((m, nestedProp) => {
    m[nestedProp.property] = nestedProp;
    return m;
  }, {} as Dict<NestedEncodingProperty>);

const NESTED_ENCODING_PROPERTY_PARENT_INDEX =
  NESTED_ENCODING_PROPERTIES.reduce((m, nestedProp) => {
    let parent = nestedProp.parent;

    // if the parent does not exist in m yet, add it as a key in m with empty [] as value
    if (!(parent in m)) {
      m[parent] = [];
    }

    m[nestedProp.parent].push(nestedProp);
    return m;
  }, {} as Dict<Array<NestedEncodingProperty>>); // as Dict<Array<String>>);

const ENCODING_INDEX: Dict<Property> =
  ENCODING_PROPERTIES.reduce((m, prop) => {
    m[prop] = prop;
    return m;
  }, {} as Dict<Property>);

export function isEncodingProperty(prop: Property): boolean {
  return ENCODING_INDEX[prop] !== undefined;
}

export function getNestedEncodingProperty(prop: Property) {
  return NESTED_ENCODING_INDEX[prop];
}

export function getNestedEncodingPropertyChildren(parent: Property) {
  return NESTED_ENCODING_PROPERTY_PARENT_INDEX[parent];
}

export function isNestedEncodingProperty(prop: Property) {
  return prop in NESTED_ENCODING_INDEX;
}
