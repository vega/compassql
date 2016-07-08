import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR} from 'vega-lite/src/channel';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Config} from 'vega-lite/src/config';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {Property, DEFAULT_PROPERTY_PRECENCE} from './property';

export interface QueryConfig {
  verbose?: boolean;

  defaultSpecConfig?: Config;

  propertyPrecedence?: Property[];

  /** Defautl marks to enumerate. */
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
  numberOrdinalProportion?: number;

  /** Default maxbins to enumerate */
  maxBinsList?: number[];

  scaleTypes?: ScaleType[];

  // SPECIAL MODE
  /**
   * Allow automatically adding a special count (autoCount) field for
   * plots that contain neither unbinned quantitative field nor temporal field without time unit.
   */
  autoAddCount?: boolean;

  // CONSTRAINTS
  // Spec Constraints

  hasAppropriateGraphicTypeForMark?: boolean;
  omitAggregatePlotWithDimensionOnlyOnFacet?: boolean;
  omitBarLineAreaWithOcclusion?: boolean;
  omitBarTickWithSize?: boolean;
  omitFacetOverPositionalChannels?: boolean;
  omitMultipleNonPositionalChannels?: boolean;
  omitNonSumStack?: boolean;
  omitRawContinuousFieldForAggregatePlot?: boolean;
  omitRawWithXYBothOrdinalScaleOrBin?: boolean;
  omitRepeatedField?: boolean;
  omitNonPositionalOverPositionalChannels?: boolean;
  omitTableWithOcclusion?: boolean;
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
  typeMatchesSchemaType?: boolean;

  // Effectiveness Preference
  maxGoodCardinalityForColor?: number; // FIXME: revise
  maxGoodCardinalityForFacet?: number; // FIXME: revise
}

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  verbose: false,
  defaultSpecConfig: {
    overlay: {line: true},
    scale: {useRawDomain: true}
  },
  propertyPrecedence: DEFAULT_PROPERTY_PRECENCE,

  marks: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA, Mark.TICK], // Mark.TEXT
  channels: [X, Y, ROW, COLUMN, SIZE, COLOR], // TODO: TEXT
  aggregates: [undefined, AggregateOp.MEAN],
  timeUnits: [undefined, TimeUnit.YEAR, TimeUnit.MONTH, TimeUnit.DAY, TimeUnit.DATE], // TODO: include hours and minutes
  types: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL],
  numberOrdinalProportion: .05,

  maxBinsList: [5, 10, 20],
  scaleTypes: [ScaleType.LINEAR, ScaleType.LOG],

  // CONSTRAINTS
  // Spec Constraints -- See description inside src/constraints/spec.ts
  autoAddCount: false,

  hasAppropriateGraphicTypeForMark: true,
  omitAggregatePlotWithDimensionOnlyOnFacet: true,
  omitBarLineAreaWithOcclusion: true,
  omitBarTickWithSize: true,
  omitFacetOverPositionalChannels: true,
  omitMultipleNonPositionalChannels: true,
  omitNonSumStack: true,
  omitRawContinuousFieldForAggregatePlot: true,
  omitRepeatedField: true,
  omitNonPositionalOverPositionalChannels: true,
  omitTableWithOcclusion: true,
  omitVerticalDotPlot: false,

  preferredBinAxis: Channel.X,
  preferredTemporalAxis: Channel.X,
  preferredOrdinalAxis: Channel.Y, // ordinal on y makes it easier to read.
  preferredNominalAxis: Channel.Y, // nominal on y makes it easier to read.
  preferredFacet: Channel.ROW, // row make it easier to scroll than column

  // Encoding Constraints -- See description inside src/constraints/encoding.ts
  maxCardinalityForCategoricalColor: 20,
  maxCardinalityForFacet: 10,
  maxCardinalityForShape: 6,
  typeMatchesSchemaType: true,

  // Ranking Preference

  maxGoodCardinalityForFacet: 5, // FIXME: revise
  maxGoodCardinalityForColor: 7, // FIXME: revise
};
