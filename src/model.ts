import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Encoding} from 'vega-lite/src/encoding';
import {FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/TimeUnit';
import {Type} from 'vega-lite/src/type';
import {Spec} from 'vega-lite/src/Spec';

import {Property, ENCODING_PROPERTIES} from './property';
import {SpecQuery, EncodingQuery, EnumSpec, QueryConfig, initEnumSpec, isEnumSpec} from './query';
import {Schema} from './schema';
import {Dict, isin, duplicate, keys, some} from './util';

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

  /** List of indice tuples of encoding mappings that require bin enumeration. */
  bin?: EnumSpecIndexTuple<boolean>[];

  /** List of indice tuples of encoding mappings that require timeUnit enumeration. */
  timeunit?: EnumSpecIndexTuple<TimeUnit>[];

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

/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
export class SpecQueryModel {
  private _spec: SpecQuery;
  private _encodingMap: Dict<EncodingQuery>;
  private _enumSpecIndex: EnumSpecIndex;
  private _enumSpecAssignment: Dict<any>;

  /**
   * Build an enumSpecIndex by detecting enumeration specifiers
   * in the input specQuery and replace short enum specs with
   * full ones that includes both names and enumValues.
   *
   * @return a SpecQueryModel that wraps the specQuery and the enumSpecIndex.
   */
  public static build(specQ: SpecQuery, schema: Schema, opt: QueryConfig): SpecQueryModel {
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
      // For each property of the encodingQuery, enumerate
      ENCODING_PROPERTIES.forEach((property) => {
        if(isEnumSpec(encQ[property])) {
          // Assign default enum spec name and enum values.
          const defaultEnumSpecName = getDefaultName(property) + index;
          const defaultEnumValues = property === Property.FIELD ?
            // For field, by default enumerate all fields
            schema.fields():
            // For other properties, take default enumValues from config.
            // The config name for each property is a plural form of the property.
            opt[property+'s'];
          encQ[property] = initEnumSpec(encQ[property], defaultEnumSpecName, defaultEnumValues);

          // Add index of the encoding mapping to the property's enum job.
          (enumSpecIndex[property] = enumSpecIndex[property] || []).push({
            enumSpec: encQ[property],
            index: index
          } as EnumSpecIndexTuple<any>);
        }
      });
    });
    return new SpecQueryModel(specQ, enumSpecIndex);
  }

  public constructor(spec: SpecQuery, enumSpecIndex: EnumSpecIndex, enumSpecAssignment: Dict<any> = {}) {
    this._spec = spec;
    this._encodingMap = spec.encodings.reduce((m, encodingQuery) => {
      if (!isEnumSpec(encodingQuery.channel)) {
        m[encodingQuery.channel as string] = encodingQuery;
      }
      return m;
    }, {} as Dict<EncodingQuery>);

    this._enumSpecIndex = enumSpecIndex;
    this._enumSpecAssignment = enumSpecAssignment;
  }


  public get enumSpecIndex() {
    return this._enumSpecIndex;
  }

  public duplicate(): SpecQueryModel {
    return new SpecQueryModel(duplicate(this._spec), this._enumSpecIndex, duplicate(this._enumSpecAssignment));
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

  public getEncodingProperty(index: number, property: Property) {
    return this._spec.encodings[index][property];
  }

  public setEncodingProperty(index: number, property: Property, value: any, enumSpec: EnumSpec<any>) {
    const encodingQuery = this._spec.encodings[index];
    if (property === Property.CHANNEL && encodingQuery.channel && !isEnumSpec(encodingQuery.channel)) {
      // If there is an old channel
      delete this._encodingMap[encodingQuery.channel as Channel];
    }

    encodingQuery[property] = value;
    this._enumSpecAssignment[enumSpec.name] = value;

    if (property === Property.CHANNEL) {
      // If there is a new channel
      this._encodingMap[value] = encodingQuery;
    }
  }

  public resetEncodingProperty(index: number, property: Property, enumSpec: EnumSpec<any>) {
    const encodingQuery = this._spec.encodings[index];
    if (property === Property.CHANNEL) {
      delete this._encodingMap[encodingQuery.channel as Channel];
    }
    // reset it to enumSpec
    encodingQuery[property] = enumSpec;
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

  public hasAllChannelAssigned() {
    return keys(this._encodingMap).length === this._spec.encodings.length;
  }

  public isDimension(channel: Channel) {
    const encQ = this._encodingMap[channel];

    if (!encQ) {
      return false;
    }

    return isin(encQ.type, [Type.NOMINAL, Type.ORDINAL]) ||
      (!isEnumSpec(encQ.bin) && !!encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit);
  }

  public isAggregate() {
    return some(this._spec.encodings, (encQ: EncodingQuery) => (!isEnumSpec(encQ.aggregate) && !!encQ.aggregate));
  }

  /**
   * Convert a query to a Vega-Lite spec if it is completed.
   * @return a Vega-Lite spec if completed, null otherwise.
   */
  public toSpec(): Spec {
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

      encoding[encQ.channel as Channel] = fieldDef;
    }
    return {
      // TODO: transform, config
      mark: this._spec.mark as Mark,
      encoding: encoding
    };
  }
}
