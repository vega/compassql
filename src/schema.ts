import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR, TEXT, DETAIL} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/Type';

import {duplicate, keys} from './util';

export class Schema {
  private fieldSchemas: FieldSchema[];
  private fieldSchemaIndex: {[field: string]: FieldSchema};

  constructor(fieldSchemas: FieldSchema[]) {
    this.fieldSchemas = fieldSchemas;
    this.fieldSchemaIndex = fieldSchemas.reduce((m, fieldSchema: FieldSchema) => {
      m[fieldSchema.field] = fieldSchema;
      return m;
    }, {});
  }

  public fields() {
    return this.fieldSchemas.map((fieldSchema) => fieldSchema.field);
  }

  public primitiveType(field: string) {
    return this.fieldSchemaIndex[field].primitiveType;
  }

  public type(field: string) {
    return this.fieldSchemaIndex[field].type;
  }
}

export interface FieldSchema {
  field: string;
  type?: Type;
  /** number, string, date  */
  primitiveType: string;
  title: string;
}

export enum PropertyType {
  MARK = 'mark' as any,
  CHANNEL = 'channel' as any,
  AGGREGATE = 'aggregate' as any,
  BIN = 'bin' as any,
  TIMEUNIT = 'timeUnit' as any,
  FIELD = 'field' as any,
  TYPE = 'type' as any,

  // TODO: Filter (Field, Value?)
  // TODO: SORT, SCALE_TYPE, AXIS, LEGEND
}

export const ENCODING_PROPERTIES = [
  PropertyType.CHANNEL,
  PropertyType.AGGREGATE,
  PropertyType.BIN,
  PropertyType.TIMEUNIT,
  PropertyType.FIELD,
  PropertyType.TYPE
];

export interface QueryConfig {
  propertyTypePrecedence: PropertyType[];

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

  // TODO: bin, scaleType, etc.
}

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  propertyTypePrecedence: [
    // Projection
    PropertyType.TYPE, // type is a constraint for field
    PropertyType.FIELD,

    // Field Transform
    PropertyType.AGGREGATE,
    PropertyType.BIN,
    PropertyType.TIMEUNIT,

    // Encoding
    PropertyType.CHANNEL,
    PropertyType.MARK
  ],

  marks: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA, Mark.TEXT, Mark.TICK],
  channels: [X, Y, ROW, COLUMN, SIZE, COLOR, TEXT, DETAIL],
  aggregates: [undefined, AggregateOp.MEAN],
  // TODO: what about bin parameter
  bins: [true, false],
  timeUnits: [TimeUnit.MONTH],
  types: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL]

  // TODO: bin, scaleType, etc.
};

export interface EnumJob {
  /** Whether this enumerate job requires enumerating mask. */
  mark?: boolean;

  /** List of indices of encoding mappings that require channel enumeration. */
  channel?: number[];

  /** List of indices of encoding mappings that require aggregate enumeration. */
  aggregate?: number[];

  /** List of indices of encoding mappings that require bin enumeration. */
  bin?: number[];

  /** List of indices of encoding mappings that require timeUnit enumeration. */
  timeunit?: number[];

  /** List of indices of encoding mappings that require field enumeration. */
  field?: number[];

  /** List of indices of encoding mappings that require type enumeration. */
  type?: number[];
}

/** Enum for a short form of the enumeration spec. */
export enum ShortEnumSpec {
  ENUMSPEC = '*' as any
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

export interface SpecQuery {
  mark: Mark | EnumSpec<Mark> | ShortEnumSpec;
  transform?: TransformQuery;
  encodings: EncodingQuery[];

  // Let's not make these queries for now.
  config?: Config;
}

export interface EncodingQueryMap {
  [channel: string]: EncodingQuery;
}

export class Query {
  private spec: SpecQuery;
  private encodingMap: EncodingQueryMap;

  public constructor(spec: SpecQuery) {
    this.spec = spec;
    this.encodingMap = spec.encodings.reduce(function(m, encodingQuery) {
      if (!isEnumSpec(encodingQuery.channel)) {
        m[encodingQuery.channel as string] = encodingQuery;
      }
      return m;
    }, {} as EncodingQueryMap);
  }

  public duplicate(): Query {
    return new Query(duplicate(this.spec));
  }

  public setMark(mark: Mark) {
    this.spec.mark = mark;
  }

  public getMark() {
    return this.spec.mark;
  }

  public setChannel(encodingQuery: EncodingQuery, channel: Channel) {
    encodingQuery.channel = channel;
    this.encodingMap[channel] = encodingQuery;
  }

  public getEncodingQuery(channel: Channel) {
    return this.encodingMap[channel];
  }

  public hasAllChannelAssigned() {
    return keys(this.encodingMap).length === this.spec.encodings.length;
  }
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

  // TODO: scaleQuery, axisQuery, legendQuery
}
