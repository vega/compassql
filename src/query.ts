import {Channel, X, Y, ROW, COLUMN, SIZE, COLOR, TEXT, DETAIL} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Encoding} from 'vega-lite/src/encoding';
import {FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/Type';
import {Spec} from 'vega-lite/src/Spec';

import {Property} from './property';
import {duplicate, keys} from './util';

export interface QueryConfig {
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
  omitRepeatedField?: boolean;
  omitNonPositionalOverPositionalChannels?: boolean;
  omitVerticalDotPlot?: boolean;

  // Encoding Constraints
  typeMatchesSchemaType?: boolean;
}

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  propertyPrecedence: [
    // Projection
    Property.TYPE, // type is a constraint for field
    Property.FIELD,

    // Field Transform
    Property.AGGREGATE,
    Property.BIN,
    Property.TIMEUNIT,

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
  omitRepeatedField: true,
  omitNonPositionalOverPositionalChannels: true,
  omitVerticalDotPlot: true,

  // Encoding Constraints
  typeMatchesSchemaType: true
};

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

  // TODO: make config query (not important at all, only for the sake of completeness.)
  config?: Config;
}

export interface EncodingQueryMap {
  [channel: string]: EncodingQuery;
}

export class SpecQueryModel {
  private spec: SpecQuery;
  private encodingMap: EncodingQueryMap;

  public constructor(spec: SpecQuery) {
    this.spec = spec;
    this.encodingMap = spec.encodings.reduce((m, encodingQuery) => {
      if (!isEnumSpec(encodingQuery.channel)) {
        m[encodingQuery.channel as string] = encodingQuery;
      }
      return m;
    }, {} as EncodingQueryMap);
  }

  public duplicate(): SpecQueryModel {
    return new SpecQueryModel(duplicate(this.spec));
  }

  public setMark(mark: Mark | EnumSpec<Mark>) {
    this.spec.mark = mark;
  }

  public getMark() {
    return this.spec.mark;
  }

  public getEncodingProperty(index: number, property: Property) {
    return this.spec.encodings[index][property];
  }

  public setEncodingProperty(index: number, property: Property, value: any) {
    if (property === Property.CHANNEL) {
      this.setChannel(this.spec.encodings[index], value);
    } else {
      this.spec.encodings[index][property] = value;
    }
  }

  private setChannel(encodingQuery: EncodingQuery, channel: Channel) {
    // If there is an old channel
    if (encodingQuery.channel) {
      delete this.encodingMap[channel];
    }

    encodingQuery.channel = channel;

    // If there is a new channel
    if (channel) {
      this.encodingMap[channel] = encodingQuery;
    }
  }

  public channelUsed(channel: Channel) {
    return !!this.encodingMap[channel];
  }

  public getEncodings() {
    return this.spec.encodings;
  }

  public getEncodingQueryByChannel(channel: Channel) {
    return this.encodingMap[channel];
  }

  public getEncodingQueryByIndex(i: number) {
    return this.spec.encodings[i];
  }

  public hasAllChannelAssigned() {
    return keys(this.encodingMap).length === this.spec.encodings.length;
  }

  /**
   * Convert a query to a Vega-Lite spec if it is completed.
   * @return a Vega-Lite spec if completed, null otherwise.
   */
  public toSpec(): Spec {
    if (isEnumSpec(this.spec.mark)) return null;

    let encoding: Encoding = {};

    for (let i = 0; i < this.spec.encodings.length; i++) {
      const encQ = this.spec.encodings[i];

      // if channel is an enum spec, return null
      if (isEnumSpec(encQ.channel)) return null;

      // assemble other property into a field def.
      let fieldDef: FieldDef = {};
      const PROPERTIES = [Property.AGGREGATE, Property.BIN, Property.TIMEUNIT, Property.FIELD, Property.TYPE];
      for (let j = 0; j < PROPERTIES.length; j++) {
        const prop = PROPERTIES[j];

        // if the property is an enum spec, return null
        if (isEnumSpec(encQ[prop])) return null;

        // otherwise, assign the proper to the field def
        if (encQ[prop] !== undefined) {
          fieldDef[prop] = encQ[prop];
        }
      }

      encoding[encQ.channel as Channel] = fieldDef;
    }
    return {
      // TODO: transform, config
      mark: this.spec.mark as Mark,
      encoding: encoding
    };
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
  // TODO: value

  // TODO: scaleQuery, axisQuery, legendQuery
}
