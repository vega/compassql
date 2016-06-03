import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Data} from 'vega-lite/src/data';
import {Encoding} from 'vega-lite/src/encoding';
import {FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/TimeUnit';
import {Type} from 'vega-lite/src/type';
import {Spec} from 'vega-lite/src/Spec';

import {Property, ENCODING_PROPERTIES} from './property';
import {SpecQuery, EncodingQuery, EnumSpec, QueryConfig, initEnumSpec, isEnumSpec, isDimension, isMeasure, stringifySpecQuery} from './query';
import {Schema} from './schema';
import {Dict, duplicate, extend, some} from './util';

/**
 * Part of EnumSpecIndex which lists all enumSpec in a specQuery.
 */
export interface EnumSpecIndexTuple<T> {
  enumSpec: EnumSpec<T>;
  index?: number;
}

/**
 * Object that stores different types of EnumSpecIndexTuple
 */
export interface EnumSpecIndex {
  /** Index tuple for the mark (if mark requires enumeration). */
  mark?: EnumSpecIndexTuple<Mark>;

  /** List of indice tuples of encoding mappings that require channel enumeration. */
  channel?: EnumSpecIndexTuple<Channel>[];

  /** List of indice tuples of encoding mappings that require aggregate enumeration. */
  aggregate?: EnumSpecIndexTuple<AggregateOp>[];

  /** List of indice tuples of encoding mappings that require autoCount enumeration. */
  autoCount?: EnumSpecIndexTuple<AggregateOp>[];

  /** List of indice tuples of encoding mappings that require bin enumeration. */
  bin?: EnumSpecIndexTuple<boolean>[];

  /** List of indice tuples of encoding mappings that require timeUnit enumeration. */
  timeUnit?: EnumSpecIndexTuple<TimeUnit>[];

  /** List of indice tuples of encoding mappings that require field enumeration. */
  field?: EnumSpecIndexTuple<string>[];

  /** List of indice tuples of encoding mappings that require type enumeration. */
  type?: EnumSpecIndexTuple<Type>[];
}

function getDefaultName(prop: Property) {
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
    case Property.TIMEUNIT:
      return 'tu';
    case Property.FIELD:
      return 'f';
    case Property.TYPE:
      return 't';
  }
  throw new Error('Default name undefined');
}

export function getDefaultEnumValues(prop: Property, schema: Schema, opt: QueryConfig) {
  switch (prop) {
    case Property.FIELD:       // For field, by default enumerate all fields
      return schema.fields();

    case Property.BIN:         // True, False for boolean values
    case Property.AUTOCOUNT:
      return [false, true];


    case Property.MARK:
    case Property.CHANNEL:
    case Property.AGGREGATE:
    case Property.TIMEUNIT:
    case Property.TYPE:
    // For other properties, take default enumValues from config.
    // The config name for each prop is a plural form of the prop.
    return opt[prop+'s'] || [];
  }
  throw new Error('No default enumValues for ' + prop);
}

/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
export class SpecQueryModel {
  private _spec: SpecQuery;

  /** channel => EncodingQuery */
  private _encodingMap: Dict<EncodingQuery>;
  private _enumSpecIndex: EnumSpecIndex;
  private _enumSpecAssignment: Dict<any>;
  private _schema: Schema;

  /**
   * Build an enumSpecIndex by detecting enumeration specifiers
   * in the input specQuery and replace short enum specs with
   * full ones that includes both names and enumValues.
   *
   * @return a SpecQueryModel that wraps the specQuery and the enumSpecIndex.
   */
  public static build(specQ: SpecQuery, schema: Schema, opt: QueryConfig): SpecQueryModel {
    specQ = duplicate(specQ); // preventing side-effect

    let enumSpecIndex: EnumSpecIndex = {};

    // mark
    if (isEnumSpec(specQ.mark)) {
      const name = getDefaultName(Property.MARK);
      specQ.mark = initEnumSpec(specQ.mark, name, opt.marks);
      enumSpecIndex.mark = { enumSpec: specQ.mark };
    }

    // TODO: transform

    // encodings
    specQ.encodings.forEach((encQ, index) => {
      if (encQ.autoCount !== undefined) {
        // This is only for testing purpose
        console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
      }

      // For each property of the encodingQuery, enumerate
      ENCODING_PROPERTIES.forEach((prop) => {
        if(isEnumSpec(encQ[prop])) {
          // Assign default enum spec name and enum values.
          const defaultEnumSpecName = getDefaultName(prop) + index;
          const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
          encQ[prop] = initEnumSpec(encQ[prop], defaultEnumSpecName, defaultEnumValues);

          // Add index of the encoding mapping to the property's enum job.
          (enumSpecIndex[prop] = enumSpecIndex[prop] || []).push({
            enumSpec: encQ[prop],
            index: index
          } as EnumSpecIndexTuple<any>);
        }
      });
    });

    // AUTO COUNT
    // Add Auto Count Field
    if (opt.autoAddCount) {
      const countEncQ = {
        channel: {
          name: getDefaultName(Property.CHANNEL) + specQ.encodings.length,
          enumValues: getDefaultEnumValues(Property.CHANNEL, schema, opt)
        },
        autoCount: {
          name: getDefaultName(Property.AUTOCOUNT) + specQ.encodings.length,
          enumValues: [false, true]
        },
        type: Type.QUANTITATIVE
      };
      specQ.encodings.push(countEncQ);

      const index = specQ.encodings.length - 1;
      [Property.CHANNEL, Property.AUTOCOUNT].forEach((prop) => {
        (enumSpecIndex[prop] = enumSpecIndex[prop] || []).push({
            enumSpec: countEncQ[prop],
            index: index
          } as EnumSpecIndexTuple<any>);
      });
    }

    return new SpecQueryModel(specQ, enumSpecIndex, schema);
  }

  constructor(spec: SpecQuery, enumSpecIndex: EnumSpecIndex, schema: Schema, enumSpecAssignment: Dict<any> = {}) {
    this._spec = spec;
    this._encodingMap = spec.encodings.reduce((m, encQ) => {
      if (!isEnumSpec(encQ.channel)) {
        m[encQ.channel as string] = encQ;
      }
      return m;
    }, {} as Dict<EncodingQuery>);

    this._enumSpecIndex = enumSpecIndex;
    this._enumSpecAssignment = enumSpecAssignment;

    this._schema = schema;
  }

  public get enumSpecIndex() {
    return this._enumSpecIndex;
  }

  public get schema() {
    return this._schema;
  }

  public get specQuery() {
    return this._spec;
  }

  public duplicate(): SpecQueryModel {
    return new SpecQueryModel(duplicate(this._spec), this._enumSpecIndex, this._schema, duplicate(this._enumSpecAssignment));
  }

  public setMark(mark: Mark) {
    const name = (this._spec.mark as EnumSpec<Mark>).name;
    this._enumSpecAssignment[name] = this._spec.mark = mark;
  }

  public resetMark() {
    const enumSpec = this._spec.mark = this._enumSpecIndex.mark.enumSpec;
    delete this._enumSpecAssignment[enumSpec.name];
  }

  public getMark() {
    return this._spec.mark;
  }

  public getEncodingProperty(index: number, prop: Property) {
    return this._spec.encodings[index][prop];
  }

  public setEncodingProperty(index: number, prop: Property, value: any, enumSpec: EnumSpec<any>) {
    const encQ = this._spec.encodings[index];
    if (prop === Property.CHANNEL && encQ.channel && !isEnumSpec(encQ.channel)) {
      // If there is an old channel
      delete this._encodingMap[encQ.channel as Channel];
    }

    encQ[prop] = value;
    this._enumSpecAssignment[enumSpec.name] = value;

    if (prop === Property.CHANNEL) {
      // If there is a new channel
      this._encodingMap[value] = encQ;
    }
  }

  public resetEncodingProperty(index: number, prop: Property, enumSpec: EnumSpec<any>) {
    const encQ = this._spec.encodings[index];
    if (prop === Property.CHANNEL) {
      delete this._encodingMap[encQ.channel as Channel];
    }
    // reset it to enumSpec
    encQ[prop] = enumSpec;
    // add remove value that is reset from the assignment map
    delete this._enumSpecAssignment[enumSpec.name];
  }

  public channelUsed(channel: Channel) {
    return !!this._encodingMap[channel];
  }

  public getEncodings() {
    return this._spec.encodings;
  }

  public getEncodingQueryByChannel(channel: Channel) {
    return this._encodingMap[channel];
  }

  public getEncodingQueryByIndex(i: number) {
    return this._spec.encodings[i];
  }

  public isDimension(channel: Channel) {
    const encQ = this._encodingMap[channel];
    return encQ && isDimension(encQ);
  }

  public isMeasure(channel: Channel) {
    const encQ = this._encodingMap[channel];
    return encQ && isMeasure(encQ);
  }

  public isAggregate() {
    return some(this._spec.encodings, (encQ: EncodingQuery) => {
      return (!isEnumSpec(encQ.aggregate) && !!encQ.aggregate) || encQ.autoCount === true;
    });
  }

  public toShorthand(): string {
    return stringifySpecQuery(this._spec);
  }

  /**
   * Convert a query to a Vega-Lite spec if it is completed.
   * @return a Vega-Lite spec if completed, null otherwise.
   */
  public toSpec(data?: Data): Spec {
    if (isEnumSpec(this._spec.mark)) return null;

    let encoding: Encoding = {};

    for (let i = 0; i < this._spec.encodings.length; i++) {
      const encQ = this._spec.encodings[i];

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

      // For count field that is automatically added, convert to correct vega-lite fieldDef
      if (encQ.autoCount === true) {
        fieldDef.aggregate = AggregateOp.COUNT;
        fieldDef.field = '*';
        fieldDef.type = Type.QUANTITATIVE;
      } else if (encQ.autoCount === false) {
        continue; // Do not include this in the output.
      }

      encoding[encQ.channel as Channel] = fieldDef;
    }
    return extend(
      data ? { data: data } : {},
      {
      // TODO: transform, config
      mark: this._spec.mark as Mark,
      encoding: encoding
      }
    );
  }
}
