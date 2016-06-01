import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR, TEXT, DETAIL} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/Type';

import {Property} from './property';

export interface QueryConfig {
  verbose?: boolean;

  propertyPrecedence?: Property[];

  /** Defautl marks to enumerate. */
  marks?: Mark[];

  /** Default channels to enumerate. */
  channels?: Channel[];

  /** Default aggregate ops to enumerate. */
  aggregates?: AggregateOp[];

  /** Default bin to enumerate */
  // TODO: what about bin parameter
  bins?: boolean[];

  /** Default time units to enumerate */
  timeUnits?: TimeUnit[];

  /** Default types to enumerate */
  types?: Type[];

  // TODO: scaleType, etc.

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
    // Property.COUNT

    // Encoding
    Property.CHANNEL,
    Property.MARK
  ],

  marks: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA, Mark.TEXT, Mark.TICK],
  channels: [X, Y, ROW, COLUMN, SIZE, COLOR, TEXT, DETAIL],
  aggregates: [undefined, AggregateOp.MEAN],
  // TODO: what about bin parameter
  bins: [true, false],
  timeUnits: [TimeUnit.MONTH],
  types: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL],

  // TODO: scaleType, etc.


  // CONSTRAINTS
  // Spec Constraints
  omitFacetOverPositionalChannels: true,
  omitMultipleNonPositionalChannels: true,
  omitRawContinuousFieldForAggregatePlot: true,
  omitRawWithXYBothOrdinalScaleOrBin: true,
  omitRepeatedField: true,
  omitNonPositionalOverPositionalChannels: true,
  omitVerticalDotPlot: true,

  preferredBinAxis: Channel.X,
  preferredTemporalAxis: Channel.X,
  preferredOrdinalAxis: Channel.Y, // ordinal on y makes it easier to read.
  preferredNominalAxis: Channel.Y, // nominal on y makes it easier to read.
  // Encoding Constraints
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
                        .sort();  // sort at the end to ignore order

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
  timeUnit?: TimeUnit | EnumSpec<TimeUnit> | ShortEnumSpec;

  // TODO: change to binQuery to support bin parameters
  bin?: boolean | EnumSpec<boolean> | ShortEnumSpec;

  field: Field | EnumSpec<Field> | ShortEnumSpec;
  type: Type | EnumSpec<Field> | ShortEnumSpec;
  // TODO: value

  // TODO: scaleQuery, axisQuery, legendQuery
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
  } else if (
      (encQ.aggregate && isEnumSpec(encQ.aggregate)) ||
      (encQ.timeUnit && isEnumSpec(encQ.timeUnit)) ||
      (encQ.bin && isEnumSpec(encQ.bin))
    ) {
    fn = SHORT_ENUM_SPEC + '';
  }

  const fieldType = enumSpecShort(encQ.field) + ',' + enumSpecShort(encQ.type).substr(0,1);
  return (fn ? fn + '(' + fieldType + ')' : fieldType);
}
