import {Dict} from './util';
import {ScaleType} from 'vega-lite/src/scale';

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
  SCALE_TYPE = 'scaleType' as any,
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
    case Property.SCALE_TYPE:
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
  Property.SCALE_TYPE,
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
  Property.SCALE_TYPE,
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
    property: Property.SCALE_TYPE,
    parent: 'scale',
    child: 'type'
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
    let child = nestedProp.child;

    // if the parent does not exist in m, add it as a key in m with empty [] as value
    if (!(parent in m)) {
      m[parent] = [];
    }

    m[parent].push(child);
    return m;
  }, {} as Dict<Array<String>>); // as Dict<Array<String>>);

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

export function getNestedEncodingPropertyChild(parent: Property) {
  return NESTED_ENCODING_PROPERTY_PARENT_INDEX[parent];
}

export function isNestedEncodingProperty(prop: Property) {
  return prop in NESTED_ENCODING_INDEX;
}

const SUPPORTED_SCALE_PROPERTY =
[
  {
    property: Property.SCALE_BANDSIZE, // "bandSize"
    supportedScaleType: [
      ScaleType.ORDINAL
    ]
  },
  {
    property: 'clamp', // TODO: Replace with Property.SCALE_CLAMP and others as Scale Properties are added
    supportedScaleType: [
      ScaleType.LINEAR,
      ScaleType.LOG,
      ScaleType.POW,
      ScaleType.TIME,
      ScaleType.UTC
    ]
  },
  {
    property: 'domain',
    supportedScaleType: [
      ScaleType.LINEAR,
      ScaleType.LOG,
      ScaleType.POW,
      ScaleType.QUANTILE,
      ScaleType.QUANTIZE,
      ScaleType.ORDINAL,
      ScaleType.SQRT,
      ScaleType.TIME,
      ScaleType.UTC
    ]
  },
  {
    property: 'exponent',
    supportedScaleType: [
      ScaleType.LOG,
      ScaleType.POW,
      ScaleType.SQRT
    ]
  },
  {
    property: 'nice',
    supportedScaleType: [
      ScaleType.LINEAR,
      ScaleType.LOG,
      ScaleType.POW,
      ScaleType.TIME,
      ScaleType.UTC
    ]
  },
  {
    property: 'range',
    supportedScaleType: [
      ScaleType.LINEAR,
      ScaleType.LOG,
      ScaleType.POW,
      ScaleType.QUANTILE,
      ScaleType.QUANTIZE,
      ScaleType.ORDINAL,
      ScaleType.SQRT,
      ScaleType.TIME,
      ScaleType.UTC
    ]
  },
  {
    property: 'round',
    supportedScaleType: [
      ScaleType.LINEAR,
      ScaleType.LOG,
      ScaleType.POW,
      ScaleType.SQRT,
      ScaleType.TIME,
      ScaleType.UTC
    ]
  },
  {
    property: 'useRawDomain',
    supportedScaleType: [
      ScaleType.LINEAR,
      ScaleType.LOG,
      ScaleType.POW,
      ScaleType.QUANTILE,
      ScaleType.QUANTIZE,
      ScaleType.ORDINAL,
      ScaleType.SQRT,
      ScaleType.TIME,
      ScaleType.UTC
    ]
  },
  {
    property: Property.SCALE_ZERO,
    supportedScaleType: [
      ScaleType.LINEAR,
      ScaleType.POW,
      ScaleType.SQRT
    ]
  }
];

export const SUPPORTED_SCALE_PROPERTY_INDEX: Dict<ScaleType[]> =
  SUPPORTED_SCALE_PROPERTY.reduce((m, scaleProp) => {
    let prop = scaleProp.property;

    m[prop] = scaleProp.supportedScaleType;
    return m;
  }, {} as Dict<ScaleType[]>);
