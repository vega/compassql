import {Dict, toMap} from './util';
import {ScaleType} from 'vega-lite/src/scale';

export namespace Property {
  export const MARK = 'mark';

  export const FILTER = 'filter';
  // TODO: Sub-properties for filter

  export const CALCULATE = 'calculate';
  // TODO: Sub-properties for calculate

  export const FILTERINVALID = 'filterInvalid';

  // Layout
  export const STACK = 'stack';
  // TODO: sub parts of stack

  // Encoding Properties
  export const CHANNEL = 'channel';
  export const AGGREGATE = 'aggregate';
  export const AUTOCOUNT = 'autoCount';
  export const BIN = 'bin';
  export const BIN_MAXBINS = 'binMaxbins';
  export const BIN_MIN = 'binMin';
  export const BIN_MAX = 'binMax';
  export const BIN_BASE = 'binBase';
  export const BIN_STEP = 'binStep';
  export const BIN_STEPS = 'binSteps';
  export const BIN_MINSTEP = 'binMinstep';
  export const BIN_DIV = 'binDiv';
  export const HAS_FN = 'hasFn';
  export const TIMEUNIT = 'timeUnit';
  export const FIELD = 'field';
  export const TYPE = 'type';

  // - Sort
  export const SORT = 'sort';
  export const SORT_FIELD = 'sortField';
  export const SORT_OP = 'sortOp';
  export const SORT_ORDER = 'sortOrder';

  // - Scale
  export const SCALE = 'scale';
  export const SCALE_BANDSIZE = 'scaleBandSize';
  export const SCALE_CLAMP = 'scaleClamp';
  export const SCALE_DOMAIN = 'scaleDomain';
  export const SCALE_EXPONENT = 'scaleExponent';
  export const SCALE_NICE = 'scaleNice';
  export const SCALE_RANGE = 'scaleRange';
  export const SCALE_ROUND = 'scaleRound';
  export const SCALE_TYPE = 'scaleType';
  export const SCALE_USERAWDOMAIN = 'scaleUseRawDomain';
  export const SCALE_ZERO = 'scaleZero';


  // - Axis
  export const AXIS = 'axis';

  // General Axis Properties
  export const AXIS_AXISCOLOR = 'axisAxisColor';
  export const AXIS_AXISWIDTH = 'axisAxisWidth';
  export const AXIS_LAYER = 'axisLayer';
  export const AXIS_OFFSET = 'axisOffset';
  export const AXIS_ORIENT = 'axisOrient';

  // Axis_Grid Properties
  export const AXIS_GRID = 'axisGrid';
  export const AXIS_GRIDCOLOR = 'axisGridColor';
  export const AXIS_GRIDDASH = 'axisGridDash';
  export const AXIS_GRIDOPACITY = 'axisGridOpacity';
  export const AXIS_GRIDWIDTH = 'axisGridWidth';

  // Axis Properties
  export const AXIS_LABELS = 'axisLabels';
  export const AXIS_FORMAT = 'axisFormat';
  export const AXIS_LABELANGLE = 'axisLabelAngle';
  export const AXIS_LABELMAXLENGTH = 'axisLabelMaxLength';
  export const AXIS_SHORTTIMELABELS = 'axisShortTimeLabels';

  // Axis_Tick Properties
  export const AXIS_SUBDIVIDE = 'axisSubdivide';
  export const AXIS_TICKS = 'axisTicks';
  export const AXIS_TICKCOLOR = 'axisTickColor';
  export const AXIS_TICKLABELCOLOR = 'axisTickLabelColor';
  export const AXIS_TICKLABELFONT = 'axisTickLabelFont';
  export const AXIS_TICKLABELFONTSIZE = 'axisTickLabelFontSize';
  export const AXIS_TICKPADDING = 'axisTickPadding';
  export const AXIS_TICKSIZE = 'axisTickSize';
  export const AXIS_TICKSIZEMAJOR = 'axisTickSizeMajor';
  export const AXIS_TICKSIZEMINOR = 'axisTickSizeMinor';
  export const AXIS_TICKSIZEEND = 'axisTickSizeEnd';
  export const AXIS_TICKWIDTH = 'axisTickWidth';
  export const AXIS_VALUES = 'axisValues';

  // Axis_Title Properties
  export const AXIS_TITLE = 'axisTitle';
  export const AXIS_TITLECOLOR = 'axisTitleColor';
  export const AXIS_TITLEFONT = 'axisTitleFont';
  export const AXIS_TITLEFONTSIZE = 'axisTitleFontSize';
  export const AXIS_TITLEFONTWEIGHT = 'axisTitleFontWeight';
  export const AXIS_TITLEOFFSET = 'axisTitleOffset';
  export const AXIS_TITLEMAXLENGTH = 'axisTitleMaxLength';
  export const AXIS_CHARACTERWIDTH = 'axisCharacterWidth';

  // - Legend
  export const LEGEND = 'legend';

  // General Legend Properties
  export const LEGEND_ORIENT = 'legendOrient';
  export const LEGEND_OFFSET = 'legendOffset';
  export const LEGEND_VALUES = 'legendValues';

  // Legend_Label Properties
  export const LEGEND_FORMAT = 'legendFormat';
  export const LEGEND_LABELALIGN = 'legendLabelAlign';
  export const LEGEND_LABELBASELINE = 'legendLabelBaseline';
  export const LEGEND_LABELCOLOR = 'legendLabelColor';
  export const LEGEND_LABELFONT = 'legendLabelFont';
  export const LEGEND_LABELFONTSIZE = 'legendLabelFontSize';
  export const LEGEND_SHORTTIMELABELS = 'legendShortTimeLabels';

  // Legend_Symbol Properties
  export const LEGEND_SYMBOLCOLOR = 'legendSymbolColor';
  export const LEGEND_SYMBOLSHAPE = 'legendSymbolShape';
  export const LEGEND_SYMBOLSIZE = 'legendSymbolSize';
  export const LEGEND_SYMBOLSTROKEWIDTH = 'legendSymbolStrokeWidth';

  // Legend_Title Properties
  export const LEGEND_TITLE = 'legendTitle';
  export const LEGEND_TITLECOLOR = 'legendTitleColor';
  export const LEGEND_TITLEFONT = 'legendTitleFont';
  export const LEGEND_TITLEFONTSIZE = 'legendTitleFontSize';
  export const LEGEND_TITLEFONTWEIGHT = 'legendTitleFontWeight';
}

export type Property = typeof Property.MARK |
  typeof Property.FILTER |
  typeof Property.CALCULATE |
  typeof Property.FILTERINVALID |
  typeof Property.STACK |
  typeof Property.CHANNEL |
  typeof Property.AGGREGATE |
  typeof Property.AUTOCOUNT |
  typeof Property.BIN |
  typeof Property.BIN_MAXBINS |
  typeof Property.HAS_FN |
  typeof Property.TIMEUNIT |
  typeof Property.FIELD |
  typeof Property.TYPE |
  typeof Property.SORT |
  typeof Property.SORT_FIELD |
  typeof Property.SORT_OP |
  typeof Property.SORT_ORDER |
  typeof Property.SCALE |
  typeof Property.SCALE_BANDSIZE |
  typeof Property.SCALE_CLAMP |
  typeof Property.SCALE_DOMAIN |
  typeof Property.SCALE_EXPONENT |
  typeof Property.SCALE_NICE |
  typeof Property.SCALE_RANGE |
  typeof Property.SCALE_ROUND |
  typeof Property.SCALE_TYPE |
  typeof Property.SCALE_USERAWDOMAIN |
  typeof Property.SCALE_ZERO |
  typeof Property.AXIS |
  typeof Property.AXIS_AXISCOLOR |
  typeof Property.AXIS_AXISWIDTH |
  typeof Property.AXIS_LAYER |
  typeof Property.AXIS_OFFSET |
  typeof Property.AXIS_ORIENT |
  typeof Property.AXIS_GRID |
  typeof Property.AXIS_GRIDCOLOR |
  typeof Property.AXIS_GRIDDASH |
  typeof Property.AXIS_GRIDOPACITY |
  typeof Property.AXIS_GRIDWIDTH |
  typeof Property.AXIS_LABELS |
  typeof Property.AXIS_FORMAT |
  typeof Property.AXIS_LABELANGLE |
  typeof Property.AXIS_LABELMAXLENGTH |
  typeof Property.AXIS_SHORTTIMELABELS |
  typeof Property.AXIS_SUBDIVIDE |
  typeof Property.AXIS_TICKS |
  typeof Property.AXIS_TICKCOLOR |
  typeof Property.AXIS_TICKLABELCOLOR |
  typeof Property.AXIS_TICKLABELFONT |
  typeof Property.AXIS_TICKLABELFONTSIZE |
  typeof Property.AXIS_TICKPADDING |
  typeof Property.AXIS_TICKSIZE |
  typeof Property.AXIS_TICKSIZEMAJOR |
  typeof Property.AXIS_TICKSIZEMINOR |
  typeof Property.AXIS_TICKSIZEEND |
  typeof Property.AXIS_TICKWIDTH |
  typeof Property.AXIS_VALUES |
  typeof Property.AXIS_TITLE |
  typeof Property.AXIS_TITLECOLOR |
  typeof Property.AXIS_TITLEFONT |
  typeof Property.AXIS_TITLEFONTSIZE |
  typeof Property.AXIS_TITLEFONTWEIGHT |
  typeof Property.AXIS_TITLEOFFSET |
  typeof Property.AXIS_TITLEMAXLENGTH |
  typeof Property.AXIS_CHARACTERWIDTH |
  typeof Property.LEGEND |
  typeof Property.LEGEND_ORIENT |
  typeof Property.LEGEND_OFFSET |
  typeof Property.LEGEND_VALUES |
  typeof Property.LEGEND_FORMAT |
  typeof Property.LEGEND_LABELALIGN |
  typeof Property.LEGEND_LABELBASELINE |
  typeof Property.LEGEND_LABELCOLOR |
  typeof Property.LEGEND_LABELFONT |
  typeof Property.LEGEND_LABELFONTSIZE |
  typeof Property.LEGEND_SHORTTIMELABELS |
  typeof Property.LEGEND_SYMBOLCOLOR |
  typeof Property.LEGEND_SYMBOLSHAPE |
  typeof Property.LEGEND_SYMBOLSIZE |
  typeof Property.LEGEND_SYMBOLSTROKEWIDTH |
  typeof Property.LEGEND_TITLE |
  typeof Property.LEGEND_TITLECOLOR |
  typeof Property.LEGEND_TITLEFONT |
  typeof Property.LEGEND_TITLEFONTSIZE |
  typeof Property.LEGEND_TITLEFONTWEIGHT;


export const NESTED_ENCODING_PROPERTIES_PARENT = [
  'bin', 'scale', 'sort', 'axis', 'legend'
];

const NESTED_ENCODING_PROPERTIES_PARENT_INDEX = toMap(NESTED_ENCODING_PROPERTIES_PARENT);

export function hasNestedProperty(prop: Property) {
  return NESTED_ENCODING_PROPERTIES_PARENT_INDEX[prop];
}

export const ENCODING_PROPERTIES = [
  Property.CHANNEL,
  Property.BIN,
  Property.BIN_MAXBINS,
  Property.BIN_MIN,
  Property.BIN_MAX,
  Property.BIN_BASE,
  Property.BIN_STEP,
  Property.BIN_STEPS,
  Property.BIN_MINSTEP,
  Property.BIN_DIV,
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
  Property.BIN_MIN,
  Property.BIN_MAX,
  Property.BIN_BASE,
  Property.BIN_STEP,
  Property.BIN_STEPS,
  Property.BIN_MINSTEP,
  Property.BIN_DIV,

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
