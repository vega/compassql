import {Dict} from './util';
import {ScaleType} from 'vega-lite/src/scale';

export enum Property {
  MARK = 'mark' as any,

  FILTER = 'filter' as any,
  // TODO: Sub-properties for filter

  CALCULATE = 'calculate' as any,
  // TODO: Sub-properties for calculate

  FILTERINVALID = 'filterInvalid' as any,

  // Layout
  STACK = 'stack' as any,
  // TODO: sub parts of stack

  // Encoding Properties
  CHANNEL = 'channel' as any,
  AGGREGATE = 'aggregate' as any,
  AUTOCOUNT = 'autoCount' as any,
  BIN = 'bin' as any,
  BIN_MAXBINS = 'binMaxbins' as any,
  HAS_FN = 'hasFn' as any,
  TIMEUNIT = 'timeUnit' as any,
  FIELD = 'field' as any,
  TYPE = 'type' as any,

  // - Sort
  SORT = 'sort' as any,
  SORT_FIELD = 'sortField' as any,
  SORT_OP = 'sortOp' as any,
  SORT_ORDER = 'sortOrder' as any,

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

  // General Axis Properties
  AXIS_AXISCOLOR = 'axisAxisColor' as any,
  AXIS_AXISWIDTH = 'axisAxisWidth' as any,
  AXIS_LAYER = 'axisLayer' as any,
  AXIS_OFFSET = 'axisOffset' as any,
  AXIS_ORIENT = 'axisOrient' as any,

  // Axis_Grid Properties
  AXIS_GRID = 'axisGrid' as any,
  AXIS_GRIDCOLOR = 'axisGridColor' as any,
  AXIS_GRIDDASH = 'axisGridDash' as any,
  AXIS_GRIDOPACITY = 'axisGridOpacity' as any,
  AXIS_GRIDWIDTH = 'axisGridWidth' as any,

  // Axis Properties
  AXIS_LABELS = 'axisLabels' as any,
  AXIS_FORMAT = 'axisFormat' as any,
  AXIS_LABELANGLE = 'axisLabelAngle' as any,
  AXIS_LABELMAXLENGTH = 'axisLabelMaxLength' as any,
  AXIS_SHORTTIMELABELS = 'axisShortTimeLabels' as any,

  // Axis_Tick Properties
  AXIS_SUBDIVIDE = 'axisSubdivide' as any,
  AXIS_TICKS = 'axisTicks' as any,
  AXIS_TICKCOLOR = 'axisTickColor' as any,
  AXIS_TICKLABELCOLOR = 'axisTickLabelColor' as any,
  AXIS_TICKLABELFONT = 'axisTickLabelFont' as any,
  AXIS_TICKLABELFONTSIZE = 'axisTickLabelFontSize' as any,
  AXIS_TICKPADDING = 'axisTickPadding' as any,
  AXIS_TICKSIZE = 'axisTickSize' as any,
  AXIS_TICKSIZEMAJOR = 'axisTickSizeMajor' as any,
  AXIS_TICKSIZEMINOR = 'axisTickSizeMinor' as any,
  AXIS_TICKSIZEEND = 'axisTickSizeEnd' as any,
  AXIS_TICKWIDTH = 'axisTickWidth' as any,
  AXIS_VALUES = 'axisValues' as any,

  // Axis_Title Properties
  AXIS_TITLE = 'axisTitle' as any,
  AXIS_TITLECOLOR = 'axisTitleColor' as any,
  AXIS_TITLEFONT = 'axisTitleFont' as any,
  AXIS_TITLEFONTSIZE = 'axisTitleFontSize' as any,
  AXIS_TITLEFONTWEIGHT = 'axisTitleFontWeight' as any,
  AXIS_TITLEOFFSET = 'axisTitleOffset' as any,
  AXIS_TITLEMAXLENGTH = 'axisTitleMaxLength' as any,
  AXIS_CHARACTERWIDTH = 'axisCharacterWidth' as any,

  // - Legend
  LEGEND = 'legend' as any,

  // General Legend Properties
  LEGEND_ORIENT = 'legendOrient' as any,
  LEGEND_OFFSET = 'legendOffset' as any,
  LEGEND_VALUES = 'legendValues' as any,

  // Legend_Label Properties
  LEGEND_FORMAT = 'legendFormat' as any,
  LEGEND_LABELALIGN = 'legendLabelAlign' as any,
  LEGEND_LABELBASELINE = 'legendLabelBaseline' as any,
  LEGEND_LABELCOLOR = 'legendLabelColor' as any,
  LEGEND_LABELFONT = 'legendLabelFont' as any,
  LEGEND_LABELFONTSIZE = 'legendLabelFontSize' as any,
  LEGEND_SHORTTIMELABELS = 'legendShortTimeLabels' as any,

  // Legend_Symbol Properties
  LEGEND_SYMBOLCOLOR = 'legendSymbolColor' as any,
  LEGEND_SYMBOLSHAPE = 'legendSymbolShape' as any,
  LEGEND_SYMBOLSIZE = 'legendSymbolSize' as any,
  LEGEND_SYMBOLSTROKEWIDTH = 'legendSymbolStrokeWidth' as any,

  // Legend_Title Properties
  LEGEND_TITLE = 'legendTitle' as any,
  LEGEND_TITLECOLOR = 'legendTitleColor' as any,
  LEGEND_TITLEFONT = 'legendTitleFont' as any,
  LEGEND_TITLEFONTSIZE = 'legendTitleFontSize' as any,
  LEGEND_TITLEFONTWEIGHT = 'legendTitleFontWeight' as any
}

export const NESTED_ENCODING_PROPERTIES_PARENT = [
  'bin', 'scale', 'sort', 'axis', 'legend'
];

export function hasNestedProperty(prop: Property) {
  return NESTED_ENCODING_PROPERTIES_PARENT.indexOf(prop) !== -1;
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
  Property.SORT,
  Property.SORT_FIELD,
  Property.SORT_OP,
  Property.SORT_ORDER,
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
  Property.SCALE_ZERO,

  Property.AXIS,
  Property.AXIS_AXISCOLOR,
  Property.AXIS_AXISWIDTH,
  Property.AXIS_CHARACTERWIDTH,
  Property.AXIS_FORMAT,
  Property.AXIS_GRID,
  Property.AXIS_GRIDCOLOR,
  Property.AXIS_GRIDDASH,
  Property.AXIS_GRIDOPACITY,
  Property.AXIS_GRIDWIDTH,
  Property.AXIS_LABELANGLE,
  Property.AXIS_LABELMAXLENGTH,
  Property.AXIS_LABELS,
  Property.AXIS_LAYER,
  Property.AXIS_OFFSET,
  Property.AXIS_ORIENT,
  Property.AXIS_SHORTTIMELABELS,
  Property.AXIS_SUBDIVIDE,
  Property.AXIS_TICKCOLOR,
  Property.AXIS_TICKLABELCOLOR,
  Property.AXIS_TICKLABELFONT,
  Property.AXIS_TICKLABELFONTSIZE,
  Property.AXIS_TICKPADDING,
  Property.AXIS_TICKS,
  Property.AXIS_TICKSIZE,
  Property.AXIS_TICKSIZEEND,
  Property.AXIS_TICKSIZEMAJOR,
  Property.AXIS_TICKSIZEMINOR,
  Property.AXIS_TICKWIDTH,
  Property.AXIS_TITLE,
  Property.AXIS_TITLECOLOR,
  Property.AXIS_TITLEFONT,
  Property.AXIS_TITLEFONTSIZE,
  Property.AXIS_TITLEFONTWEIGHT,
  Property.AXIS_TITLEMAXLENGTH,
  Property.AXIS_TITLEOFFSET,
  Property.AXIS_VALUES,

  Property.LEGEND,
  Property.LEGEND_ORIENT,
  Property.LEGEND_OFFSET,
  Property.LEGEND_VALUES,
  Property.LEGEND_FORMAT,
  Property.LEGEND_LABELALIGN,
  Property.LEGEND_LABELBASELINE,
  Property.LEGEND_LABELCOLOR,
  Property.LEGEND_LABELFONT,
  Property.LEGEND_LABELFONTSIZE,
  Property.LEGEND_SHORTTIMELABELS,
  Property.LEGEND_SYMBOLCOLOR,
  Property.LEGEND_SYMBOLSHAPE,
  Property.LEGEND_SYMBOLSIZE,
  Property.LEGEND_SYMBOLSTROKEWIDTH,
  Property.LEGEND_TITLE,
  Property.LEGEND_TITLECOLOR,
  Property.LEGEND_TITLEFONT,
  Property.LEGEND_TITLEFONTSIZE,
  Property.LEGEND_TITLEFONTWEIGHT
];

export const DEFAULT_PROPERTY_PRECEDENCE: Property[] =  [
  // Projection
  Property.TYPE, // type is a constraint for field
  Property.FIELD,

  // TODO: Add stack and remove it from INCLUDE_ALL in shorthand

  // TODO: Add filter and remove it from INCLUDE_ALL in shorthand

  // TODO: Add calculate and remove it from INCLUDE_ALL in shorthand

  // TODO: Add filterInvalid and remove it from INCLUDE_ALL in shorthand

  // Field Transform
  Property.BIN,
  Property.TIMEUNIT,
  Property.AGGREGATE,
  Property.AUTOCOUNT,

  Property.SORT,
  Property.SORT_FIELD,
  Property.SORT_OP,
  Property.SORT_ORDER,

  // Nested Transform Property
  Property.BIN_MAXBINS,

  // Encoding
  Property.CHANNEL,
  Property.MARK,
  Property.SCALE,
  Property.AXIS,
  Property.LEGEND,

  // Nested Encoding Property

  // - Scale
  Property.SCALE_BANDSIZE,
  Property.SCALE_CLAMP,
  Property.SCALE_DOMAIN,
  Property.SCALE_EXPONENT,
  Property.SCALE_NICE,
  Property.SCALE_RANGE,
  Property.SCALE_ROUND,
  Property.SCALE_TYPE,
  Property.SCALE_USERAWDOMAIN,
  Property.SCALE_ZERO,

  // - Axis
  Property.AXIS_AXISCOLOR,
  Property.AXIS_AXISWIDTH,
  Property.AXIS_CHARACTERWIDTH,
  Property.AXIS_FORMAT,
  Property.AXIS_GRID,
  Property.AXIS_GRIDCOLOR,
  Property.AXIS_GRIDDASH,
  Property.AXIS_GRIDOPACITY,
  Property.AXIS_GRIDWIDTH,
  Property.AXIS_LABELANGLE,
  Property.AXIS_LABELMAXLENGTH,
  Property.AXIS_LABELS,
  Property.AXIS_LAYER,
  Property.AXIS_OFFSET,
  Property.AXIS_ORIENT,
  Property.AXIS_SHORTTIMELABELS,
  Property.AXIS_SUBDIVIDE,
  Property.AXIS_TICKCOLOR,
  Property.AXIS_TICKLABELCOLOR,
  Property.AXIS_TICKLABELFONT,
  Property.AXIS_TICKLABELFONTSIZE,
  Property.AXIS_TICKPADDING,
  Property.AXIS_TICKS,
  Property.AXIS_TICKSIZE,
  Property.AXIS_TICKSIZEEND,
  Property.AXIS_TICKSIZEMAJOR,
  Property.AXIS_TICKSIZEMINOR,
  Property.AXIS_TICKWIDTH,
  Property.AXIS_TITLE,
  Property.AXIS_TITLECOLOR,
  Property.AXIS_TITLEFONT,
  Property.AXIS_TITLEFONTSIZE,
  Property.AXIS_TITLEFONTWEIGHT,
  Property.AXIS_TITLEMAXLENGTH,
  Property.AXIS_TITLEOFFSET,
  Property.AXIS_VALUES,

  // - Legend
  Property.LEGEND_ORIENT,
  Property.LEGEND_OFFSET,
  Property.LEGEND_VALUES,
  Property.LEGEND_FORMAT,
  Property.LEGEND_LABELALIGN,
  Property.LEGEND_LABELBASELINE,
  Property.LEGEND_LABELCOLOR,
  Property.LEGEND_LABELFONT,
  Property.LEGEND_LABELFONTSIZE,
  Property.LEGEND_SHORTTIMELABELS,
  Property.LEGEND_SYMBOLCOLOR,
  Property.LEGEND_SYMBOLSHAPE,
  Property.LEGEND_SYMBOLSIZE,
  Property.LEGEND_SYMBOLSTROKEWIDTH,
  Property.LEGEND_TITLE,
  Property.LEGEND_TITLECOLOR,
  Property.LEGEND_TITLEFONT,
  Property.LEGEND_TITLEFONTSIZE,
  Property.LEGEND_TITLEFONTWEIGHT
];

export interface NestedEncodingProperty {
  property: Property;
  parent: string;
  child: string;
}

/**
 * Collection of nested encoding properties.
 *
 * [
 *  {
 *    property: Property.BIN_MAXBINS,
 *    parent: 'bin',
 *    child: 'maxbins'
 *  },
 *  ...
 * ]
 */
export const NESTED_ENCODING_PROPERTIES: NestedEncodingProperty[] =
 ENCODING_PROPERTIES.reduce((nestedEncodingProperties, prop: Property) => {
   const p = prop+'';

   // Check if it's a child property of any of the nested encoding property parent
   for (let parent of NESTED_ENCODING_PROPERTIES_PARENT) {
     if (p.length > parent.length && p.substr(0, parent.length) === parent) {

       // Convert PascalCase to camelCase
       const child = (p[parent.length] +'').toLowerCase() + p.substr(parent.length + 1);

       nestedEncodingProperties.push({
         property: prop,
         parent: parent,
         child: child
       });
       break;
     }
   }
   return nestedEncodingProperties;
 }, []);

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

export const SCALE_PROPERTIES: Property[] =
  NESTED_ENCODING_PROPERTY_PARENT_INDEX['scale'].map((nestedProp) => {
    return nestedProp.property;
  });

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

const SUPPORTED_SCALE_PROPERTY =
[
  {
    property: 'bandSize',
    supportedScaleType: [
      ScaleType.ORDINAL
    ]
  },
  {
    property: 'clamp',
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
    property: 'zero',
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
