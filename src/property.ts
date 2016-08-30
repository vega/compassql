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
  BIN_MAXBINS = 'binMaxBins' as any,
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

export function hasNestedProperty(prop: Property) {
  switch (prop) {
    case Property.BIN:
    case Property.SCALE:
    case Property.SORT:
    case Property.AXIS:
    case Property.LEGEND:
      return true;
    case Property.MARK:
    case Property.FILTER:
    case Property.CALCULATE:
    case Property.FILTERINVALID:
    case Property.STACK:
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
    case Property.AXIS_AXISCOLOR:
    case Property.AXIS_AXISWIDTH:
    case Property.AXIS_LAYER:
    case Property.AXIS_OFFSET:
    case Property.AXIS_ORIENT:
    case Property.AXIS_GRID:
    case Property.AXIS_GRIDCOLOR:
    case Property.AXIS_GRIDDASH:
    case Property.AXIS_GRIDOPACITY:
    case Property.AXIS_GRIDWIDTH:
    case Property.AXIS_LABELS:
    case Property.AXIS_FORMAT:
    case Property.AXIS_LABELANGLE:
    case Property.AXIS_LABELMAXLENGTH:
    case Property.AXIS_SHORTTIMELABELS:
    case Property.AXIS_TICKS:
    case Property.AXIS_SUBDIVIDE:
    case Property.AXIS_TICKCOLOR:
    case Property.AXIS_TICKLABELCOLOR:
    case Property.AXIS_TICKLABELFONT:
    case Property.AXIS_TICKLABELFONTSIZE:
    case Property.AXIS_TICKPADDING:
    case Property.AXIS_TICKSIZE:
    case Property.AXIS_TICKSIZEMAJOR:
    case Property.AXIS_TICKSIZEMINOR:
    case Property.AXIS_TICKSIZEEND:
    case Property.AXIS_TICKWIDTH:
    case Property.AXIS_VALUES:
    case Property.AXIS_TITLE:
    case Property.AXIS_TITLECOLOR:
    case Property.AXIS_TITLEFONT:
    case Property.AXIS_TITLEFONTSIZE:
    case Property.AXIS_TITLEFONTWEIGHT:
    case Property.AXIS_CHARACTERWIDTH:
    case Property.AXIS_TITLEMAXLENGTH:
    case Property.AXIS_TITLEOFFSET:
    case Property.LEGEND_ORIENT:
    case Property.LEGEND_OFFSET:
    case Property.LEGEND_VALUES:
    case Property.LEGEND_FORMAT:
    case Property.LEGEND_LABELALIGN:
    case Property.LEGEND_LABELBASELINE:
    case Property.LEGEND_LABELCOLOR:
    case Property.LEGEND_LABELFONT:
    case Property.LEGEND_LABELFONTSIZE:
    case Property.LEGEND_SHORTTIMELABELS:
    case Property.LEGEND_SYMBOLCOLOR:
    case Property.LEGEND_SYMBOLSHAPE:
    case Property.LEGEND_SYMBOLSIZE:
    case Property.LEGEND_SYMBOLSTROKEWIDTH:
    case Property.LEGEND_TITLE:
    case Property.LEGEND_TITLECOLOR:
    case Property.LEGEND_TITLEFONT:
    case Property.LEGEND_TITLEFONTSIZE:
    case Property.LEGEND_TITLEFONTWEIGHT:
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

export const NESTED_ENCODING_PROPERTIES: NestedEncodingProperty[] = [
  {
    property: Property.BIN_MAXBINS,
    parent: 'bin',
    child: 'maxbins'
  },
  {
    property: Property.SORT_FIELD,
    parent: 'sort',
    child: 'field'
  },
  {
    property: Property.SORT_OP,
    parent: 'sort',
    child: 'op'
  },
  {
    property: Property.SORT_ORDER,
    parent: 'sort',
    child: 'order'
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
  },
  {
    property: Property.AXIS_AXISCOLOR,
    parent: 'axis',
    child: 'axisColor'
  },
  {
    property: Property.AXIS_AXISWIDTH,
    parent: 'axis',
    child: 'axisWidth'
  },
  {
    property: Property.AXIS_LAYER,
    parent: 'axis',
    child: 'layer'
  },
  {
    property: Property.AXIS_OFFSET,
    parent: 'axis',
    child: 'offset'
  },
  {
    property: Property.AXIS_ORIENT,
    parent: 'axis',
    child: 'orient'
  },
  {
    property: Property.AXIS_GRID,
    parent: 'axis',
    child: 'grid'
  },
  {
    property: Property.AXIS_GRIDCOLOR,
    parent: 'axis',
    child: 'gridColor'
  },
  {
    property: Property.AXIS_GRIDDASH,
    parent: 'axis',
    child: 'gridDash'
  },
  {
    property: Property.AXIS_GRIDOPACITY,
    parent: 'axis',
    child: 'gridOpacity'
  },
  {
    property: Property.AXIS_GRIDWIDTH,
    parent: 'axis',
    child: 'gridWidth'
  },
  {
    property: Property.AXIS_LABELS,
    parent: 'axis',
    child: 'labels'
  },
  {
    property: Property.AXIS_FORMAT,
    parent: 'axis',
    child: 'format'
  },
  {
    property: Property.AXIS_LABELANGLE,
    parent: 'axis',
    child: 'labelAngle'
  },
  {
    property: Property.AXIS_LABELMAXLENGTH,
    parent: 'axis',
    child: 'labelMaxLength'
  },
  {
    property: Property.AXIS_SHORTTIMELABELS,
    parent: 'axis',
    child: 'shortTimeLabels'
  },
  {
    property: Property.AXIS_TICKS,
    parent: 'axis',
    child: 'ticks'
  },
  {
    property: Property.AXIS_SUBDIVIDE,
    parent: 'axis',
    child: 'subdivide'
  },
  {
    property: Property.AXIS_TICKCOLOR,
    parent: 'axis',
    child: 'tickColor'
  },
  {
    property: Property.AXIS_TICKLABELCOLOR,
    parent: 'axis',
    child: 'tickLabelColor'
  },
  {
    property: Property.AXIS_TICKLABELFONT,
    parent: 'axis',
    child: 'tickLabelFont'
  },
  {
    property: Property.AXIS_TICKLABELFONTSIZE,
    parent: 'axis',
    child: 'tickLabelFontSize'
  },
  {
    property: Property.AXIS_TICKPADDING,
    parent: 'axis',
    child: 'tickPadding'
  },
  {
    property: Property.AXIS_TICKSIZE,
    parent: 'axis',
    child: 'tickSize'
  },
  {
    property: Property.AXIS_TICKSIZEMAJOR,
    parent: 'axis',
    child: 'tickSizeMajor'
  },
  {
    property: Property.AXIS_TICKSIZEMINOR,
    parent: 'axis',
    child: 'tickSizeMinor'
  },
  {
    property: Property.AXIS_TICKSIZEEND,
    parent: 'axis',
    child: 'tickSizeEnd'
  },
  {
    property: Property.AXIS_TICKWIDTH,
    parent: 'axis',
    child: 'tickWidth'
  },
  {
    property: Property.AXIS_VALUES,
    parent: 'axis',
    child: 'values'
  },
  {
    property: Property.AXIS_TITLE,
    parent: 'axis',
    child: 'title'
  },
  {
    property: Property.AXIS_TITLECOLOR,
    parent: 'axis',
    child: 'titleColor'
  },
  {
    property: Property.AXIS_TITLEFONT,
    parent: 'axis',
    child: 'titleFont'
  },
  {
    property: Property.AXIS_TITLEFONTSIZE,
    parent: 'axis',
    child: 'titleFontSize'
  },
  {
    property: Property.AXIS_TITLEFONTWEIGHT,
    parent: 'axis',
    child: 'titleFontWeight'
  },
  {
    property: Property.AXIS_CHARACTERWIDTH,
    parent: 'axis',
    child: 'characterWidth'
  },
  {
    property: Property.AXIS_TITLEMAXLENGTH,
    parent: 'axis',
    child: 'titleMaxLength'
  },
  {
    property: Property.AXIS_TITLEOFFSET,
    parent: 'axis',
    child: 'titleOffset'
  },
  {
    property: Property.LEGEND_ORIENT,
    parent: 'legend',
    child: 'orient'
  },
  {
    property: Property.LEGEND_OFFSET,
    parent: 'legend',
    child: 'offset',
  },
  {
    property: Property.LEGEND_VALUES,
    parent: 'legend',
    child: 'values'
  },
  {
    property: Property.LEGEND_FORMAT,
    parent: 'legend',
    child: 'format'
  },
  {
    property: Property.LEGEND_LABELALIGN,
    parent: 'legend',
    child: 'labelAlign'
  },
  {
    property: Property.LEGEND_LABELBASELINE,
    parent: 'legend',
    child: 'labelBaseline'
  },
  {
    property: Property.LEGEND_LABELFONT,
    parent: 'legend',
    child: 'labelFont'
  },
  {
    property: Property.LEGEND_LABELFONTSIZE,
    parent: 'legend',
    child: 'labelFontSize'
  },
  {
    property: Property.LEGEND_SHORTTIMELABELS,
    parent: 'legend',
    child: 'shortTimeLabels'
  },
  {
    property: Property.LEGEND_SYMBOLCOLOR,
    parent: 'legend',
    child: 'symbolColor'
  },
  {
    property: Property.LEGEND_SYMBOLSHAPE,
    parent: 'legend',
    child: 'symbolShape'
  },
  {
    property: Property.LEGEND_SYMBOLSIZE,
    parent: 'legend',
    child: 'symbolSize'
  },
  {
    property: Property.LEGEND_SYMBOLSTROKEWIDTH,
    parent: 'legend',
    child: 'symbolStrokeWidth'
  },
  {
    property: Property.LEGEND_TITLE,
    parent: 'legend',
    child: 'title'
  },
  {
    property: Property.LEGEND_TITLECOLOR,
    parent: 'legend',
    child: 'titleColor'
  },
  {
    property: Property.LEGEND_TITLEFONT,
    parent: 'legend',
    child: 'titleFont'
  },
  {
    property: Property.LEGEND_TITLEFONTSIZE,
    parent: 'legend',
    child: 'titleFontSize'
  },
  {
    property: Property.LEGEND_TITLEFONTWEIGHT,
    parent: 'legend',
    child: 'titleFontWeight'
  }

  // TODO: other bin parameters
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
