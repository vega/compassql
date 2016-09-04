import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR} from 'vega-lite/src/channel';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {AxisOrient} from 'vega-lite/src/axis';
import {Config} from 'vega-lite/src/config';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {SortOrder} from 'vega-lite/src/sort';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {Property, DEFAULT_PROPERTY_PRECEDENCE} from './property';

export interface QueryConfig {
  verbose?: boolean;

  defaultSpecConfig?: Config;

  propertyPrecedence?: Property[];

  /** Default marks to enumerate. */
  marks?: Mark[];

  /** Default channels to enumerate. */
  channels?: Channel[];

  /** Default aggregate ops to enumerate. */
  aggregates?: AggregateOp[];

  /** Default time units to enumerate */
  timeUnits?: TimeUnit[];

  /** Default types to enumerate */
  types?: Type[];

  /** Default ratio for number fields to be considered ordinal */
  numberNominalProportion?: number;

  /** Default cutoff for not applying the numberOrdinalProportion inference */
  numberNominalLimit?: number;

  /** Default maxbins to enumerate */
  maxBinsList?: number[];

  axisAxisColors?: string[];

  axisAxisWidths?: number[];

  axisLayers?: string[];

  axisOffsets?: number[];

  axisOrients?: AxisOrient[];

  axisGridColors?: string[];

  axisGridDashes?: number[];

  axisGridOpacities?: number[];

  axisGridWidths?: number[];

  axisFormats?: string[];

  axisLabelAngles?: number[];

  axisLabelMaxLengths?: number[];

  axisSubDivides?: number[];

  axisTicks?: number[];

  axisTickColors?: string[];

  axisTickLabelColors?: string[];

  axisTickLabelFonts?: string[];

  axisTickLabelFontSizes?: number[];

  axisTickPaddings?: number[];

  axisTickSizes?: number[];

  axisTickSizeMajors?: number[];

  axisTickSizeMinors?: number[];

  axisTickSizeEnds?: number[];

  axisTickWidths?: number[];

  axisValuesList?: number[];

  axisTitles?: string[];

  axisTitleColors?: string[];

  axisTitleFonts?: string[];

  axisTitleFontWeights?: number[];

  axisTitleFontSizes?: number[];

  axisTitleOffsets?: number[];

  axisTitleMaxLengths?: number[];

  axisCharacterWidths?: number[];

  legendOrients?: string[];

  legendOffsets?: number[];

  legendValuesList?: any[];

  legendFormats?: string[];

  legendLabelAligns?: string[];

  legendLabelBaselines?: string[];

  legendLabelColors?: string[];

  legendLabelFonts?: string[];

  legendLabelFontSizes?: number[];

  legendSymbolColors?: string[];

  legendSymbolShapes?: string[];

  legendSymbolSizes?: number[];

  legendSymbolStrokeWidths?: number[];

  legendTitles?: string[];

  legendTitleColors?: string[];

  legendTitleFonts?: string[];

  legendTitleFontSizes?: number[];

  legendTitleFontWeights?: string[];

  // TODO: Come back and implement correctly when designing sort enumeration.
  sorts?: SortOrder[];

  sortFields?: string[];

  sortOps?: AggregateOp[];

  sortOrders?: SortOrder[];

  scaleBandSizes?: number[];

  scaleDomains?: Array<number[] | string[]>;

  scaleExponents?: number[];

  scaleRanges?: Array<string | number[] | string[]>;

  scaleTypes?: ScaleType[];

  // SPECIAL MODE
  /**
   * Allow automatically adding a special count (autoCount) field for
   * plots that contain neither unbinned quantitative field nor temporal field without time unit.
   */
  autoAddCount?: boolean;

  // CONSTRAINTS
  constraintManuallySpecifiedValue?: boolean;
  // Spec Constraints

  hasAppropriateGraphicTypeForMark?: boolean;
  omitAggregate?: boolean;
  omitAggregatePlotWithDimensionOnlyOnFacet?: boolean;
  omitAggregatePlotWithoutDimension?: boolean;
  omitBarLineAreaWithOcclusion?: boolean;
  omitBarTickWithSize?: boolean;
  omitMultipleNonPositionalChannels?: boolean;
  omitNonSumStack?: boolean;
  omitRaw?: boolean;
  omitRawContinuousFieldForAggregatePlot?: boolean;
  omitRawWithXYBothOrdinalScaleOrBin?: boolean;
  omitRepeatedField?: boolean;
  omitNonPositionalOrFacetOverPositionalChannels?: boolean;
  omitTableWithOcclusionIfAutoAddCount?: boolean;
  omitVerticalDotPlot?: boolean;

  preferredBinAxis?: Channel;
  preferredTemporalAxis?: Channel;
  preferredOrdinalAxis?: Channel;
  preferredNominalAxis?: Channel;
  preferredFacet?: Channel;

  // Encoding Constraints

  maxCardinalityForCategoricalColor?: number;
  maxCardinalityForFacet?: number;
  maxCardinalityForShape?: number;
  timeUnitShouldHaveVariation?: boolean;
  typeMatchesSchemaType?: boolean;

  // STYLIZE
  stylize?: boolean;
  smallBandSizeForHighCardinalityOrFacet?: {maxCardinality: number, bandSize: number};
  nominalColorScaleForHighCardinality?: {maxCardinality: number, palette: string};
  xAxisOnTopForHighYCardinalityWithoutColumn?: {maxCardinality: number};

  // EFFECTIVENESS PREFERENCE
  maxGoodCardinalityForColor?: number; // FIXME: revise
  maxGoodCardinalityForFacet?: number; // FIXME: revise
}

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  verbose: false,
  defaultSpecConfig: {
    overlay: {line: true},
    scale: {useRawDomain: true}
  },
  propertyPrecedence: DEFAULT_PROPERTY_PRECEDENCE,

  marks: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA, Mark.TICK], // Mark.TEXT
  channels: [X, Y, ROW, COLUMN, SIZE, COLOR], // TODO: TEXT
  aggregates: [undefined, AggregateOp.MEAN],
  timeUnits: [undefined, TimeUnit.YEAR, TimeUnit.MONTH, TimeUnit.DATE, TimeUnit.MINUTES, TimeUnit.SECONDS],
  types: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL],

  maxBinsList: [5, 10, 20],

  axisAxisColors: [undefined],
  axisAxisWidths: [undefined],
  axisLayers: ['front', 'back'],
  axisOffsets: [undefined],
  axisOrients: [undefined],

  axisGridColors: [undefined],
  axisGridDashes: [undefined],
  axisGridOpacities: [undefined],
  axisGridWidths: [undefined],

  axisFormats: [undefined],
  axisLabelAngles: [undefined],
  axisLabelMaxLengths: [undefined],

  axisSubDivides: [undefined],
  axisTicks: [undefined],
  axisTickColors: [undefined],
  axisTickLabelColors: [undefined],
  axisTickLabelFonts: [undefined],
  axisTickLabelFontSizes: [undefined],
  axisTickPaddings: [undefined],
  axisTickSizes: [undefined],
  axisTickSizeMajors: [undefined],
  axisTickSizeMinors: [undefined],
  axisTickSizeEnds: [undefined],
  axisTickWidths: [undefined],
  axisValuesList: [undefined],

  axisTitles: [undefined],
  axisTitleColors: [undefined],
  axisTitleFonts: [undefined],
  axisTitleFontWeights: [undefined],
  axisTitleFontSizes: [undefined],
  axisTitleOffsets: [undefined],
  axisTitleMaxLengths: [undefined],
  axisCharacterWidths: [undefined],

  legendOrients: ['left', 'right'],
  legendOffsets: [undefined],
  legendValuesList: [undefined],
  legendFormats: [undefined],
  legendLabelAligns: [undefined],
  legendLabelBaselines: [undefined],
  legendLabelColors: [undefined],
  legendLabelFonts: [undefined],
  legendLabelFontSizes: [undefined],
  legendSymbolColors: [undefined],
  legendSymbolShapes: [undefined],
  legendSymbolSizes: [undefined],
  legendSymbolStrokeWidths:[undefined],
  legendTitles: [undefined],
  legendTitleColors: [undefined],
  legendTitleFonts: [undefined],
  legendTitleFontSizes: [undefined],
  legendTitleFontWeights: [undefined],

  // TODO: Come back and implement correctly when designing sort enumeration.
  sorts: [SortOrder.ASCENDING, SortOrder.DESCENDING],
  sortOps: [AggregateOp.MIN, AggregateOp.MEAN],
  sortOrders: [SortOrder.ASCENDING, SortOrder.DESCENDING],

  scaleBandSizes: [17, 21],
  scaleDomains: [undefined],
  scaleExponents: [1],
  scaleRanges: [undefined],
  scaleTypes: [undefined, ScaleType.LOG],

  numberNominalProportion: 0.05,
  numberNominalLimit: 40,

  // CONSTRAINTS
  constraintManuallySpecifiedValue: false,
  // Spec Constraints -- See description inside src/constraints/spec.ts
  autoAddCount: false,

  hasAppropriateGraphicTypeForMark: true,
  omitAggregate: false,
  omitAggregatePlotWithDimensionOnlyOnFacet: true,
  omitAggregatePlotWithoutDimension: false,
  omitBarLineAreaWithOcclusion: true,
  omitBarTickWithSize: true,
  omitMultipleNonPositionalChannels: true,
  omitNonSumStack: true,
  omitRaw: false,
  omitRawContinuousFieldForAggregatePlot: true,
  omitRepeatedField: true,
  omitNonPositionalOrFacetOverPositionalChannels: true,
  omitTableWithOcclusionIfAutoAddCount: true,
  omitVerticalDotPlot: false,

  preferredBinAxis: Channel.X,
  preferredTemporalAxis: Channel.X,
  preferredOrdinalAxis: Channel.Y, // ordinal on y makes it easier to read.
  preferredNominalAxis: Channel.Y, // nominal on y makes it easier to read.
  preferredFacet: Channel.ROW, // row make it easier to scroll than column

  // Encoding Constraints -- See description inside src/constraints/encoding.ts
  maxCardinalityForCategoricalColor: 20,
  maxCardinalityForFacet: 20,
  maxCardinalityForShape: 6,
  timeUnitShouldHaveVariation: true,
  typeMatchesSchemaType: true,

  // STYLIZE
  stylize: true,
  smallBandSizeForHighCardinalityOrFacet: {maxCardinality: 10, bandSize: 12},
  nominalColorScaleForHighCardinality: {maxCardinality: 10, palette: 'category20'},
  xAxisOnTopForHighYCardinalityWithoutColumn: {maxCardinality: 30},

  // RANKING PREFERENCE
  maxGoodCardinalityForFacet: 5, // FIXME: revise
  maxGoodCardinalityForColor: 7, // FIXME: revise
};
