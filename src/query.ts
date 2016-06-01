import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR, TEXT, DETAIL} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/Type';

import {Property} from './property';
import {isin} from './util';

export interface QueryConfig {
  verbose?: boolean;

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

  // TODO: scaleType, etc.

  // SPECIAL MODE
  /**
   * Allow automatically adding a special count (autoCount) field for
   * plots that contain neither unbinned quantitative field nor temporal field without time unit.
   */
  autoAddCount?: boolean;

  // CONSTRAINTS
  // Spec Constraints

  omitFacetOverPositionalChannels?: boolean;
  omitMultipleNonPositionalChannels?: boolean;
  omitRawContinuousFieldForAggregatePlot?: boolean;
  omitRawWithXYBothOrdinalScaleOrBin?: boolean;
  omitRepeatedField?: boolean;
  omitNonPositionalOverPositionalChannels?: boolean;
  omitVerticalDotPlot?: boolean;

  preferredBinAxis?: Channel;
  preferredTemporalAxis?: Channel;
  preferredOrdinalAxis?: Channel;
  preferredNominalAxis?: Channel;

  // Encoding Constraints

  maxCardinalityForCategoricalColor?: number;
  maxCardinalityForFacet?: number;
  maxCardinalityForShape?: number;
  typeMatchesSchemaType?: boolean;
}

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  verbose: false,
  propertyPrecedence: [
    // Projection
    Property.TYPE, // type is a constraint for field
    Property.FIELD,

    // TODO: transform

    // Field Transform
    Property.BIN,
    Property.TIMEUNIT,
    Property.AGGREGATE,
    Property.AUTOCOUNT,

    // Encoding
    Property.CHANNEL,
    Property.MARK
  ],

  marks: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA, Mark.TEXT, Mark.TICK],
  channels: [X, Y, ROW, COLUMN, SIZE, COLOR, TEXT, DETAIL],
  aggregates: [undefined, AggregateOp.MEAN],
  timeUnits: [TimeUnit.MONTH],
  types: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL],

  // TODO: scaleType, etc.


  // CONSTRAINTS
  // Spec Constraints -- See description inside src/constraints/spec.ts
  autoAddCount: false,
  omitFacetOverPositionalChannels: true,
  omitMultipleNonPositionalChannels: true,
  omitRawContinuousFieldForAggregatePlot: true,
  omitRepeatedField: true,
  omitNonPositionalOverPositionalChannels: true,
  omitVerticalDotPlot: true,

  preferredBinAxis: Channel.X,
  preferredTemporalAxis: Channel.X,
  preferredOrdinalAxis: Channel.Y, // ordinal on y makes it easier to read.
  preferredNominalAxis: Channel.Y, // nominal on y makes it easier to read.

  // Encoding Constraints -- See description inside src/constraints/encoding.ts
  maxCardinalityForCategoricalColor: 20,
  maxCardinalityForFacet: 10,
  maxCardinalityForShape: 6,
  typeMatchesSchemaType: true
};

/** Enum for a short form of the enumeration spec. */
export enum ShortEnumSpec {
  ENUMSPEC = '?' as any
}

export const SHORT_ENUM_SPEC = ShortEnumSpec.ENUMSPEC;

export interface EnumSpec<T> {
  name?: string;
  enumValues?: T[];
}

export function isEnumSpec(prop: any) {
  return prop === SHORT_ENUM_SPEC || (prop !== undefined && !!prop.enumValues);
}

export function initEnumSpec(prop: any, defaultName: string, defaultEnumValues: any[]): EnumSpec<any> {
  return {
    name: prop.name || defaultName,
    enumValues: prop.enumValues || defaultEnumValues
  };
}

function enumSpecShort(value: any): string {
  return (isEnumSpec(value) ? SHORT_ENUM_SPEC : value) + '';
}

export interface SpecQuery {
  mark: Mark | EnumSpec<Mark> | ShortEnumSpec;
  transform?: TransformQuery;
  encodings: EncodingQuery[];

  // TODO: make config query (not important at all, only for the sake of completeness.)
  config?: Config;
}

export function stringifySpecQuery (specQ: SpecQuery): string {
  const mark = enumSpecShort(specQ.mark);
  const encodings = specQ.encodings.map(stringifyEncodingQuery)
                        .sort()
                        .join('|');  // sort at the end to ignore order

  return mark + '|' +
      // TODO: transform
      encodings;
}

export interface TransformQuery {
  filter: FilterQuery[];
}

export interface FilterQuery {
  field: Field | EnumSpec<Field> | ShortEnumSpec;
  operator: string;
  operand: any | EnumSpec<any> | ShortEnumSpec;
}

type Field = string;

export interface EncodingQuery {
  channel: Channel | EnumSpec<Channel> | ShortEnumSpec;

  // FieldDef
  aggregate?: AggregateOp | EnumSpec<AggregateOp> | ShortEnumSpec;
  /** Internal flag for representing automatic count that are added to plots with only ordinal or binned fields. */
  autoCount?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  timeUnit?: TimeUnit | EnumSpec<TimeUnit> | ShortEnumSpec;

  // TODO: change to binQuery to support bin parameters
  bin?: boolean | EnumSpec<boolean> | ShortEnumSpec;

  field?: Field | EnumSpec<Field> | ShortEnumSpec;
  type?: Type | EnumSpec<Field> | ShortEnumSpec;
  // TODO: value

  // TODO: scaleQuery, axisQuery, legendQuery
}

export function isDimension(encQ: EncodingQuery) {
  return isin(encQ.type, [Type.NOMINAL, Type.ORDINAL]) ||
      (!isEnumSpec(encQ.bin) && !!encQ.bin) ||          // surely Q type
      (!isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit);  // surely T type
}

export function isMeasure(encQ: EncodingQuery) {
  return (encQ.type === Type.QUANTITATIVE && !encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !encQ.timeUnit);
}

export function stringifyEncodingQuery(encQ: EncodingQuery): string {
  return enumSpecShort(encQ.channel) + ':' + stringifyEncodingQueryFieldDef(encQ);
}

export function stringifyEncodingQueryFieldDef(encQ: EncodingQuery): string {
  let fn = null;
  if (encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
    fn = encQ.aggregate;
  } else if (encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
    fn = encQ.timeUnit;
  } else if (encQ.bin && !isEnumSpec(encQ.bin)) {
    fn = 'bin';
  } else if (encQ.autoCount && !isEnumSpec(encQ.autoCount)) {
    fn = 'count';
  } else if (
      (encQ.aggregate && isEnumSpec(encQ.aggregate)) ||
      (encQ.autoCount && isEnumSpec(encQ.autoCount)) ||
      (encQ.timeUnit && isEnumSpec(encQ.timeUnit)) ||
      (encQ.bin && isEnumSpec(encQ.bin))
    ) {
    fn = SHORT_ENUM_SPEC + '';
  }

  const fieldType = enumSpecShort(encQ.field || '*') + ',' + enumSpecShort(encQ.type || Type.QUANTITATIVE).substr(0,1);
  return (fn ? fn + '(' + fieldType + ')' : fieldType);
}
