import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Data} from 'vega-lite/src/data';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {generate} from './generate';
import {nest} from './nest';
import {Property, DEFAULT_PROPERTY_PRECENCE} from './property';
import {rank} from './ranking/ranking';
import {Schema} from './schema';
import {Stats} from './stats';
import {contains, extend} from './util';

export default function(query: Query, schema: Schema, stats: Stats) {
  const answerSet = generate(query.spec, schema, stats, query.config);
  const nestedAnswerSet = nest(answerSet, query, stats);
  return rank(nestedAnswerSet, query, stats, 0);
}

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

  /** Default maxbins to enumerate */
  maxBinsList?: number[];
  // TODO: scaleType, etc.

  // SPECIAL MODE
  /**
   * Allow automatically adding a special count (autoCount) field for
   * plots that contain neither unbinned quantitative field nor temporal field without time unit.
   */
  autoAddCount?: boolean;

  // CONSTRAINTS
  // Spec Constraints

  hasAppropriateGraphicTypeForMark?: boolean;
  omitBarLineAreaWithOcclusion?: boolean;
  omitBarTickWithSize?: boolean;
  omitFacetOverPositionalChannels?: boolean;
  omitMultipleNonPositionalChannels?: boolean;
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
  propertyPrecedence: DEFAULT_PROPERTY_PRECENCE,

  marks: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA, Mark.TICK], // Mark.TEXT
  channels: [X, Y, ROW, COLUMN, SIZE, COLOR], // TODO: TEXT
  aggregates: [undefined, AggregateOp.MEAN],
  timeUnits: [TimeUnit.YEAR, TimeUnit.MONTH, TimeUnit.DAY, TimeUnit.DATE], // TODO: include hours and minutes
  types: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL],

  maxBinsList: [5, 10, 20],
  // TODO: scaleType, etc.


  // CONSTRAINTS
  // Spec Constraints -- See description inside src/constraints/spec.ts
  autoAddCount: false,

  hasAppropriateGraphicTypeForMark: true,
  omitBarLineAreaWithOcclusion: true,
  omitBarTickWithSize: true,
  omitFacetOverPositionalChannels: true,
  omitMultipleNonPositionalChannels: true,
  omitRawContinuousFieldForAggregatePlot: true,
  omitRepeatedField: true,
  omitNonPositionalOverPositionalChannels: true,
  omitTableWithOcclusion: true,
  omitVerticalDotPlot: true,

  preferredBinAxis: Channel.X,
  preferredTemporalAxis: Channel.X,
  preferredOrdinalAxis: null, // Channel.Y, // ordinal on y makes it easier to read.
  preferredNominalAxis: Channel.Y, // nominal on y makes it easier to read.

  // Encoding Constraints -- See description inside src/constraints/encoding.ts


  maxCardinalityForCategoricalColor: 20,
  maxCardinalityForFacet: 10,
  maxCardinalityForShape: 6,
  typeMatchesSchemaType: true,

  // Ranking Preference

  maxGoodCardinalityForFacet: 5, // FIXME: revise
  maxGoodCardinalityForColor: 7, // FIXME: revise
};

/** Enum for a short form of the enumeration spec. */
export enum ShortEnumSpec {
  ENUMSPEC = '?' as any
}

export const SHORT_ENUM_SPEC = ShortEnumSpec.ENUMSPEC;

export interface EnumSpec<T> {
  name?: string;
  values?: T[];
}

export function isEnumSpec(prop: any) {
  return prop === SHORT_ENUM_SPEC || (prop !== undefined && !!prop.values);
}

export function initEnumSpec(prop: any, defaultName: string, defaultEnumValues: any[]): EnumSpec<any> & any {
  return extend({}, {
      name: defaultName,
      values: defaultEnumValues
    }, prop);
}

function enumSpecShort(value: any): string {
  return (isEnumSpec(value) ? SHORT_ENUM_SPEC : value) + '';
}

export interface Query {
  spec: SpecQuery;
  nest?: Nest[];
  orderBy?: string;
  chooseBy?: string;
  config?: QueryConfig;
}

export interface Nest {
  groupBy: string;
  orderGroupBy?: string;
}

export interface SpecQuery {
  data?: Data;
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

  bin?: boolean | BinQuery | ShortEnumSpec;

  field?: Field | EnumSpec<Field> | ShortEnumSpec;
  type?: Type | EnumSpec<Field> | ShortEnumSpec;
  // TODO: value

  // TODO: scaleQuery, axisQuery, legendQuery
}

export interface BinQuery extends EnumSpec<boolean> {
  maxbins?: number | EnumSpec<number> | ShortEnumSpec;
}

export function isDimension(encQ: EncodingQuery) {
  return contains([Type.NOMINAL, Type.ORDINAL], encQ.type) ||
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
  const params: {key: string, value: any}[]=  [];

  if (encQ.autoCount === false) {
    return '-';
  }

  if (encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
    fn = encQ.aggregate;
  } else if (encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
    fn = encQ.timeUnit;
  } else if (encQ.bin && !isEnumSpec(encQ.bin)) {
    fn = 'bin';
    if (encQ.bin['maxbins']) {
      params.push({key: 'maxbins', value: encQ.bin['maxbins']});
    }
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

  const fieldType = enumSpecShort(encQ.field || '*') + ',' +
    enumSpecShort(encQ.type || Type.QUANTITATIVE).substr(0,1) +
    params.map((p) => ',' + p.key + '=' + p.value);
  return (fn ? fn + '(' + fieldType + ')' : fieldType);
}
