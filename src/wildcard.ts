import {QueryConfig} from './config';
import {Property} from './property';
import {Schema} from './schema';
import {extend, isArray} from './util';

export const SHORT_WILDCARD: SHORT_WILDCARD = '?';

export type SHORT_WILDCARD = '?';

export interface Wildcard<T> {
  name?: string;
  enum?: T[];
}

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

export function getDefaultName(prop: Property) {
  switch (prop) {
    case Property.MARK:
      return 'm';
    case Property.CHANNEL:
      return 'c';
    case Property.AGGREGATE:
      return 'a';
    case Property.AUTOCOUNT:
      return '#';
    case Property.BIN:
      return 'b';
    case Property.BIN_MAXBINS:
      return 'b-mb';
    case Property.BIN_MIN:
      return 'b-min';
    case Property.BIN_MAX:
      return 'b-max';
    case Property.BIN_BASE:
      return 'b-base';
    case Property.BIN_STEP:
      return 'b-step';
    case Property.BIN_STEPS:
      return 'b-steps';
    case Property.BIN_MINSTEP:
      return 'b-mstep';
    case Property.BIN_DIV:
      return 'b-div';
    case Property.SORT:
      return 'so';
    case Property.SORT_FIELD:
      return 'so-f';
    case Property.SORT_OP:
      return 'so-op';
    case Property.SORT_ORDER:
      return 'so-or';
    case Property.SCALE:
      return 's';
    case Property.SCALE_BANDSIZE:
      return 's-bs';
    case Property.SCALE_CLAMP:
      return 's-c';
    case Property.SCALE_DOMAIN:
      return 's-d';
    case Property.SCALE_EXPONENT:
      return 's-e';
    case Property.SCALE_NICE:
      return 's-n';
    case Property.SCALE_RANGE:
      return 's-ra';
    case Property.SCALE_ROUND:
      return 's-r';
    case Property.SCALE_TYPE:
      return 's-t';
    case Property.SCALE_USERAWDOMAIN:
      return 's-u';
    case Property.SCALE_ZERO:
      return 's-z';
    case Property.AXIS:
      return 'ax';
    case Property.AXIS_AXISCOLOR:
      return 'ax-ac';
    case Property.AXIS_AXISWIDTH:
      return 'ax-aw';
    case Property.AXIS_LAYER:
      return 'ax-lay';
    case Property.AXIS_OFFSET:
      return 'ax-of';
    case Property.AXIS_ORIENT:
      return 'ax-or';
    case Property.AXIS_GRID:
      return 'ax-g';
    case Property.AXIS_GRIDCOLOR:
      return 'ax-gc';
    case Property.AXIS_GRIDDASH:
      return 'ax-gd';
    case Property.AXIS_GRIDOPACITY:
      return 'ax-go';
    case Property.AXIS_GRIDWIDTH:
      return 'ax-gw';
    case Property.AXIS_LABELS:
      return 'ax-lab';
    case Property.AXIS_FORMAT:
      return 'ax-f';
    case Property.AXIS_LABELANGLE:
      return 'ax-laba';
    case Property.AXIS_LABELMAXLENGTH:
      return 'ax-labm';
    case Property.AXIS_SHORTTIMELABELS:
      return 'ax-stl';
    case Property.AXIS_SUBDIVIDE:
      return 'ax-sub';
    case Property.AXIS_TICKS:
      return 'ax-t';
    case Property.AXIS_TICKCOLOR:
      return 'ax-tc';
    case Property.AXIS_TICKLABELCOLOR:
      return 'ax-tlc';
    case Property.AXIS_TICKLABELFONT:
      return 'ax-tlf';
    case Property.AXIS_TICKLABELFONTSIZE:
      return 'ax-tlfs';
    case Property.AXIS_TICKPADDING:
      return 'ax-tp';
    case Property.AXIS_TICKSIZE:
      return 'ax-ts';
    case Property.AXIS_TICKSIZEMAJOR:
      return 'ax-tsma';
    case Property.AXIS_TICKSIZEMINOR:
      return 'ax-tsmi';
    case Property.AXIS_TICKSIZEEND:
      return 'ax-tse';
    case Property.AXIS_TICKWIDTH:
      return 'ax-tw';
    case Property.AXIS_VALUES:
      return 'ax-v';
    case Property.AXIS_TITLE:
      return 'ax-ti';
    case Property.AXIS_TITLECOLOR:
      return 'ax-tic';
    case Property.AXIS_TITLEFONT:
      return 'ax-tif';
    case Property.AXIS_TITLEFONTSIZE:
      return 'ax-tifs';
    case Property.AXIS_TITLEFONTWEIGHT:
      return 'ax-tifw';
    case Property.AXIS_TITLEOFFSET:
      return 'ax-tio';
    case Property.AXIS_TITLEMAXLENGTH:
      return 'ax-timl';
    case Property.AXIS_CHARACTERWIDTH:
      return 'ax-cw';
    case Property.LEGEND:
      return 'l';
    case Property.LEGEND_ORIENT:
      return 'l-or';
    case Property.LEGEND_OFFSET:
      return 'l-of';
    case Property.LEGEND_VALUES:
      return 'l-v';
    case Property.LEGEND_FORMAT:
      return 'l-f';
    case Property.LEGEND_LABELALIGN:
      return 'l-la';
    case Property.LEGEND_LABELBASELINE:
      return 'l-lb';
    case Property.LEGEND_LABELCOLOR:
      return 'l-lc';
    case Property.LEGEND_LABELFONT:
      return 'l-lf';
    case Property.LEGEND_LABELFONTSIZE:
      return 'l-lfs';
    case Property.LEGEND_SHORTTIMELABELS:
      return 'l-stl';
    case Property.LEGEND_SYMBOLCOLOR:
      return 'l-syc';
    case Property.LEGEND_SYMBOLSHAPE:
      return 'l-sysh';
    case Property.LEGEND_SYMBOLSIZE:
      return 'l-sysi';
    case Property.LEGEND_SYMBOLSTROKEWIDTH:
      return 'l-sysw';
    case Property.LEGEND_TITLE:
      return 'l-ti';
    case Property.LEGEND_TITLECOLOR:
      return 'l-tic';
    case Property.LEGEND_TITLEFONT:
      return 'l-tif';
    case Property.LEGEND_TITLEFONTSIZE:
      return 'l-tifs';
    case Property.LEGEND_TITLEFONTWEIGHT:
      return 'l-tifw';
    case Property.TIMEUNIT:
      return 'tu';
    case Property.FIELD:
      return 'f';
    case Property.TYPE:
      return 't';
  }
  /* istanbul ignore next */
  throw new Error('Default name undefined');
}

export function getDefaultEnumValues(prop: Property, schema: Schema, opt: QueryConfig): any[] {
  switch (prop) {
    case Property.FIELD:       // For field, by default enumerate all fields
    case Property.SORT_FIELD:
      return schema.fields();

    // True, False for boolean values
    case Property.AXIS:
    case Property.AXIS_GRID:
    case Property.AXIS_LABELS:
    case Property.AXIS_SHORTTIMELABELS:
    case Property.BIN:
    case Property.LEGEND:
    case Property.LEGEND_SHORTTIMELABELS:
    case Property.SCALE:
    case Property.SCALE_CLAMP:
    case Property.SCALE_NICE:
    case Property.SCALE_ROUND:
    case Property.SCALE_USERAWDOMAIN:
    case Property.SCALE_ZERO:
    case Property.AUTOCOUNT:
      return [false, true];


    // For other properties, take default enumValues from config.
    // The config name for each prop is a plural form of the prop.
    case Property.AGGREGATE:
      return opt.aggregates;

    case Property.AXIS_AXISCOLOR:
      return opt.axisAxisColors;

    case Property.AXIS_AXISWIDTH:
      return opt.axisAxisWidths;

    case Property.AXIS_LAYER:
      return opt.axisLayers;

    case Property.AXIS_OFFSET:
      return opt.axisOffsets;

    case Property.AXIS_ORIENT:
      return opt.axisOrients;

    case Property.AXIS_GRIDCOLOR:
      return opt.axisGridColors;

    case Property.AXIS_GRIDDASH:
      return opt.axisGridDashes;

    case Property.AXIS_GRIDOPACITY:
      return opt.axisGridOpacities;

    case Property.AXIS_GRIDWIDTH:
      return opt.axisGridWidths;

    case Property.AXIS_FORMAT:
      return opt.axisFormats;

    case Property.AXIS_LABELANGLE:
      return opt.axisLabelAngles;

    case Property.AXIS_LABELMAXLENGTH:
      return opt.axisLabelMaxLengths;

    case Property.AXIS_SUBDIVIDE:
      return opt.axisSubDivides;

    case Property.AXIS_TICKS:
      return opt.axisTicks;

    case Property.AXIS_TICKCOLOR:
      return opt.axisTickColors;

    case Property.AXIS_TICKLABELCOLOR:
      return opt.axisTickLabelColors;

    case Property.AXIS_TICKLABELFONT:
      return opt.axisTickLabelFonts;

    case Property.AXIS_TICKLABELFONTSIZE:
      return opt.axisTickLabelFontSizes;

    case Property.AXIS_TICKPADDING:
      return opt.axisTickPaddings;

    case Property.AXIS_TICKSIZE:
      return opt.axisTickSizes;

    case Property.AXIS_TICKSIZEMAJOR:
      return opt.axisTickSizeMajors;

    case Property.AXIS_TICKSIZEMINOR:
      return opt.axisTickSizeMinors;

    case Property.AXIS_TICKSIZEEND:
      return opt.axisTickSizeEnds;

    case Property.AXIS_TICKWIDTH:
      return opt.axisTickWidths;

    case Property.AXIS_VALUES:
      return opt.axisValuesList;

    case Property.AXIS_TITLE:
      return opt.axisTitles;

    case Property.AXIS_TITLECOLOR:
      return opt.axisTitleColors;

    case Property.AXIS_TITLEFONT:
      return opt.axisTitleFonts;

    case Property.AXIS_TITLEFONTWEIGHT:
      return opt.axisTitleFontWeights;

    case Property.AXIS_TITLEFONTSIZE:
      return opt.axisTitleFontSizes;

    case Property.AXIS_TITLEOFFSET:
      return opt.axisTitleOffsets;

    case Property.AXIS_TITLEMAXLENGTH:
      return opt.axisTitleMaxLengths;

    case Property.AXIS_CHARACTERWIDTH:
      return opt.axisCharacterWidths;

    case Property.BIN_MAXBINS:
      return opt.maxBinsList;

    case Property.BIN_MIN:
      return opt.binMinList;

    case Property.BIN_MAX:
      return opt.binMaxList;

    case Property.BIN_BASE:
      return opt.binBaseList;

    case Property.BIN_STEP:
      return opt.binStepList;

    case Property.BIN_STEPS:
      return opt.binStepsList;

    case Property.BIN_MINSTEP:
      return opt.binMinstepList;

    case Property.BIN_DIV:
      return opt.binDivList;

    case Property.CHANNEL:
      return opt.channels;

    case Property.MARK:
      return opt.marks;

    case Property.LEGEND_ORIENT:
      return opt.legendOrients;

    case Property.LEGEND_OFFSET:
      return opt.legendOffsets;

    case Property.LEGEND_VALUES:
      return opt.legendValuesList;

    case Property.LEGEND_FORMAT:
      return opt.legendFormats;

    case Property.LEGEND_LABELALIGN:
      return opt.legendLabelAligns;

    case Property.LEGEND_LABELBASELINE:
      return opt.legendLabelBaselines;

    case Property.LEGEND_LABELCOLOR:
      return opt.legendLabelColors;

    case Property.LEGEND_LABELFONT:
      return opt.legendLabelFonts;

    case Property.LEGEND_LABELFONTSIZE:
      return opt.legendLabelFontSizes;

    case Property.LEGEND_SYMBOLCOLOR:
      return opt.legendSymbolColors;

    case Property.LEGEND_SYMBOLSHAPE:
      return opt.legendSymbolShapes;

    case Property.LEGEND_SYMBOLSIZE:
      return opt.legendSymbolSizes;

    case Property.LEGEND_SYMBOLSTROKEWIDTH:
      return opt.legendSymbolStrokeWidths;

    case Property.LEGEND_TITLE:
      return opt.legendTitles;

    case Property.LEGEND_TITLECOLOR:
      return opt.legendTitleColors;

    case Property.LEGEND_TITLEFONT:
      return opt.legendTitleFonts;

    case Property.LEGEND_TITLEFONTSIZE:
      return opt.legendTitleFontSizes;

    case Property.LEGEND_TITLEFONTWEIGHT:
      return opt.legendTitleFontWeights;

    case Property.SORT:
      return opt.sorts;

    case Property.SORT_OP:
      return opt.sortOps;

    case Property.SORT_ORDER:
      return opt.sortOrders;

    case Property.SCALE_BANDSIZE:
      return opt.scaleBandSizes;

    case Property.SCALE_DOMAIN:
      return opt.scaleDomains;

    case Property.SCALE_EXPONENT:
      return opt.scaleExponents;

    case Property.SCALE_RANGE:
      return opt.scaleRanges;

    case Property.SCALE_TYPE:
      return opt.scaleTypes;

    case Property.TIMEUNIT:
      return opt.timeUnits;

    case Property.TYPE:
      return opt.types;
  }
  /* istanbul ignore next */
  throw new Error('No default enumValues for ' + prop);
}
