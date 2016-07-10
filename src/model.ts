import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Data} from 'vega-lite/src/data';
import {Encoding} from 'vega-lite/src/encoding';
import {FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';
import {ExtendedUnitSpec} from 'vega-lite/src/spec';



import {QueryConfig} from './config';
import {Property, ENCODING_PROPERTIES, NESTED_ENCODING_PROPERTIES, hasNestedProperty, getNestedEncodingProperty} from './property';
import {SHORT_ENUM_SPEC, SpecQuery, EnumSpec} from './query';
import {initEnumSpec, isAggregate, isEnumSpec, isDimension, isMeasure, stack, stringifySpecQuery} from './query';
import {RankingScore} from './ranking/ranking';
import {Schema} from './schema';
import {Dict, duplicate, extend} from './util';

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

  /** List of indice tuple for encoding mappings that require enumerating bin.maxbins */
  maxbin?: EnumSpecIndexTuple<number>[];

  /** List of indice tuples of encoding mappings that require scale enumeration. */
  scale?: EnumSpecIndexTuple<boolean>[];

  /** List of indice tuple for encoding mappings that require enumerating scale.scale_type */
  scaleType?: EnumSpecIndexTuple<ScaleType>[];

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
    case Property.BIN_MAXBINS:
      return 'b-mb';
    case Property.SCALE:
      return 's';
    case Property.SCALE_TYPE:
      return 's-t';
    case Property.TIMEUNIT:
      return 'tu';
    case Property.FIELD:
      return 'f';
    case Property.TYPE:
      return 't';
  }
  /* istanbul ignore next */
  throw new Error('Default name undefined');
}

export function getDefaultEnumValues(prop: Property, schema: Schema, opt: QueryConfig) {
  switch (prop) {
    case Property.FIELD:       // For field, by default enumerate all fields
      return schema.fields();

    case Property.BIN:         // True, False for boolean values
    case Property.SCALE:
    case Property.AUTOCOUNT:
      return [false, true];

    case Property.BIN_MAXBINS:
      return opt.maxBinsList;

    case Property.SCALE_TYPE:
      return opt.scaleTypes;

    case Property.MARK:
    case Property.CHANNEL:
    case Property.AGGREGATE:
    case Property.TIMEUNIT:
    case Property.TYPE:
      // For other properties, take default enumValues from config.
      // The config name for each prop is a plural form of the prop.
      return opt[prop+'s'] || [];
  }
  /* istanbul ignore next */
  throw new Error('No default enumValues for ' + prop);
}

/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
export class SpecQueryModel {
  private _spec: SpecQuery;

  /** channel => EncodingQuery */
  private _channelCount: Dict<number>;
  private _enumSpecIndex: EnumSpecIndex;
  private _enumSpecAssignment: Dict<any>;
  private _schema: Schema;
  private _opt: QueryConfig;

  private _rankingScore: Dict<RankingScore> = {};

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
      if (encQ.autoCount !== undefined) {
        // This is only for testing purpose
        console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');

        encQ.type = Type.QUANTITATIVE; // autoCount is always quantitative
      }

      if (encQ.type === undefined) {
        // type is optional -- we automatically augment enum spec if not specified
        encQ.type = SHORT_ENUM_SPEC;
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

      // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
      NESTED_ENCODING_PROPERTIES.forEach((nestedProp) => {
        const propObj = encQ[nestedProp.parent]; // the property object e.g., encQ.bin
        if (propObj) {
          const prop = nestedProp.property;
          const child = nestedProp.child;
          if (isEnumSpec(propObj[child])) {
            // Assign default enum spec name and enum values.
            const defaultEnumSpecName = getDefaultName(prop) + index;
            const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
            propObj[child] = initEnumSpec(propObj[child], defaultEnumSpecName, defaultEnumValues);

            // Add index of the encoding mapping to the property's enum job.
            (enumSpecIndex[prop] = enumSpecIndex[prop] || []).push({
              enumSpec: propObj[child],
              index: index
            } as EnumSpecIndexTuple<any>);
          }
        }
      });
    });

    // AUTO COUNT
    // Add Auto Count Field
    if (opt.autoAddCount) {
      const countEncQ = {
        channel: {
          name: getDefaultName(Property.CHANNEL) + specQ.encodings.length,
          values: getDefaultEnumValues(Property.CHANNEL, schema, opt)
        },
        autoCount: {
          name: getDefaultName(Property.AUTOCOUNT) + specQ.encodings.length,
          values: [false, true]
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

    return new SpecQueryModel(specQ, enumSpecIndex, schema, opt, {});
  }

  constructor(spec: SpecQuery, enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig, enumSpecAssignment: Dict<any>) {
    this._spec = spec;
    this._channelCount = spec.encodings.reduce((m, encQ) => {
      if (!isEnumSpec(encQ.channel) && encQ.autoCount !== false) {
        m[encQ.channel as string] = 1;
      }
      return m;
    }, {} as Dict<number>);

    this._enumSpecIndex = enumSpecIndex;
    this._enumSpecAssignment = enumSpecAssignment;
    this._opt = opt;
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
    return new SpecQueryModel(duplicate(this._spec), this._enumSpecIndex, this._schema, this._opt, duplicate(this._enumSpecAssignment));
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
    const encQ = this._spec.encodings[index];
    const nestedProp = getNestedEncodingProperty(prop);
    if (nestedProp) { // nested encoding property
      return encQ[nestedProp.parent][nestedProp.child];
    }
    return encQ[prop]; // encoding property (non-nested)
  }

  public setEncodingProperty(index: number, prop: Property, value: any, enumSpec: EnumSpec<any>) {
    const encQ = this._spec.encodings[index];
    const nestedProp = getNestedEncodingProperty(prop);
    if (prop === Property.CHANNEL && encQ.channel && !isEnumSpec(encQ.channel)) {
      // If there is an old channel
      this._channelCount[encQ.channel as Channel]--;
    }

    if (nestedProp) { // nested encoding property
      encQ[nestedProp.parent][nestedProp.child] = value;
    } else if (hasNestedProperty(prop) && value === true) {
      encQ[prop] = extend({},
        encQ[prop], // copy all existing properties
        {values: undefined, name: undefined} // except name and values to it no longer an enumSpec
      );
    } else { // encoding property (non-nested)
      encQ[prop] = value;
    }

    this._enumSpecAssignment[enumSpec.name] = value;

    if (prop === Property.CHANNEL) {
      // If there is a new channel, make sure it exists and add it to the count.
      this._channelCount[value] = (this._channelCount[value] || 0) + 1;
    }
  }

  public resetEncodingProperty(index: number, prop: Property, enumSpec: EnumSpec<any>) {
    const encQ = this._spec.encodings[index];
    const nestedProp = getNestedEncodingProperty(prop);
    if (prop === Property.CHANNEL) {
      this._channelCount[encQ.channel as Channel]--;
    }

    // reset it to enumSpec
    if (nestedProp) { // nested encoding property
      encQ[nestedProp.parent][nestedProp.child] = enumSpec;
    } else { // encoding property (non-nested)
      encQ[prop] = enumSpec;
    }

    // add remove value that is reset from the assignment map
    delete this._enumSpecAssignment[enumSpec.name];
  }

  public channelUsed(channel: Channel) {
    // do not include encoding that has autoCount = false because it is not a part of the output spec.
    return this._channelCount[channel] > 0;
  }

  public stack() {
    return stack(this._spec);
  }

  public getEncodings() {
    // do not include encoding that has autoCount = false because it is not a part of the output spec.
    return this._spec.encodings.filter((encQ) => encQ.autoCount !== false);
  }

  public getEncodingQueryByChannel(channel: Channel) {
    for (let i = 0; i < this._spec.encodings.length; i++) {
      if (this._spec.encodings[i].channel === channel) {
        return this._spec.encodings[i];
      }
    }
    return undefined;
  }

  public getEncodingQueryByIndex(i: number) {
    return this._spec.encodings[i];
  }

  public isDimension(channel: Channel) {
    const encQ = this.getEncodingQueryByChannel(channel);
    return encQ && isDimension(encQ);
  }

  public isMeasure(channel: Channel) {
    const encQ = this.getEncodingQueryByChannel(channel);
    return encQ && isMeasure(encQ);
  }

  public isAggregate() {
    return isAggregate(this._spec);
  }

  public toShorthand(): string {
    return stringifySpecQuery(this._spec);
  }

  private _encoding(): Encoding {
    let encoding: Encoding = {};

    for (let i = 0; i < this._spec.encodings.length; i++) {
      const encQ = this._spec.encodings[i];
      let fieldDef: FieldDef = {};

      // For count field that is automatically added, convert to correct vega-lite fieldDef
      if (encQ.autoCount === true) {
        fieldDef.aggregate = AggregateOp.COUNT;
        fieldDef.field = '*';
        fieldDef.type = Type.QUANTITATIVE;
      } else if (encQ.autoCount === false) {
        continue; // Do not include this in the output.
      }

      // if channel is an enum spec, return null
      if (isEnumSpec(encQ.channel)) return null;

      // assemble other property into a field def.
      const PROPERTIES = [Property.AGGREGATE, Property.BIN, Property.SCALE, Property.TIMEUNIT, Property.FIELD, Property.TYPE];
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
    return encoding;
  }
  /**
   * Convert a query to a Vega-Lite spec if it is completed.
   * @return a Vega-Lite spec if completed, null otherwise.
   */
  public toSpec(data?: Data): ExtendedUnitSpec {
    if (isEnumSpec(this._spec.mark)) return null;

    let spec: any = {};
    data = data || this._spec.data;
    if (data) {
      spec.data = data;
    }
    // TODO: transform
    spec.mark = this._spec.mark as Mark;
    spec.encoding = this._encoding();
    if (spec.encoding === null) {
      return null;
    }
    if (this._spec.config || this._opt.defaultSpecConfig)
    spec.config = extend({}, this._opt.defaultSpecConfig, this._spec.config);

    return spec;
  }

  public getRankingScore(rankingName: string) {
    return this._rankingScore[rankingName];
  }

  public setRankingScore(rankingName: string, score: RankingScore) {
    this._rankingScore[rankingName] = score;
  }
}
