import {Channel} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';

import {toKey, DEFAULT_PROP_PRECEDENCE} from './property';
import {DEFAULT_ENUM_INDEX, EnumIndex} from './wildcard';

// We name this QueryConfig to avoid confusion with Vega-Lite's Config
export interface QueryConfig {
  verbose?: boolean;

  defaultSpecConfig?: Config;

  propertyPrecedence?: string[];

  enum?: Partial<EnumIndex>;

  /** Default ratio for number fields to be considered ordinal */
  numberNominalProportion?: number;

  /** Default cutoff for not applying the numberOrdinalProportion inference */
  numberNominalLimit?: number;

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
  smallRangeStepForHighCardinalityOrFacet?: {maxCardinality: number, rangeStep: number};
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
    scale: {useUnaggregatedDomain: true}
  },
  propertyPrecedence: DEFAULT_PROP_PRECEDENCE.map(toKey),
  enum: DEFAULT_ENUM_INDEX,

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
  smallRangeStepForHighCardinalityOrFacet: {maxCardinality: 10, rangeStep: 12},
  nominalColorScaleForHighCardinality: {maxCardinality: 10, palette: 'category20'},
  xAxisOnTopForHighYCardinalityWithoutColumn: {maxCardinality: 30},

  // RANKING PREFERENCE
  maxGoodCardinalityForFacet: 5, // FIXME: revise
  maxGoodCardinalityForColor: 7, // FIXME: revise
};

export function extendConfig(opt: QueryConfig) {
  return {
    ...DEFAULT_QUERY_CONFIG,
    ...opt,
    enum: extendEnumIndex(opt.enum)
  };
}

function extendEnumIndex(enumIndex: Partial<EnumIndex>) {
  const enumOpt: EnumIndex = {
    ...DEFAULT_ENUM_INDEX,
    ...enumIndex,
    binProps: extendNestedEnumIndex(enumIndex, 'bin'),
    scaleProps: extendNestedEnumIndex(enumIndex, 'scale'),
    axisProps: extendNestedEnumIndex(enumIndex, 'axis'),
    legendProps: extendNestedEnumIndex(enumIndex, 'legend')
  };
  return enumOpt;
}

function extendNestedEnumIndex(enumIndex: Partial<EnumIndex>, prop: 'bin' | 'scale' | 'axis' | 'legend') {
  return {
    ...DEFAULT_ENUM_INDEX[prop + 'Props'],
    ...enumIndex[prop + 'Props']
  };
}
