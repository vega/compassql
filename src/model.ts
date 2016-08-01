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
import {EnumSpec, SHORT_ENUM_SPEC, initEnumSpec, isEnumSpec} from './enumspec';
import {isEncodingProperty} from './property';
import {SpecQuery, isAggregate, stack} from './query/spec';
import {isDimension, isMeasure, EncodingQuery} from './query/encoding';
import {spec as specShorthand} from './query/shorthand';
import {RankingScore} from './ranking/ranking';
import {Schema} from './schema';
import {Dict, duplicate, extend} from './util';

export interface EncodingsEnumSpecIndex {
  [index: number]: EncodingEnumSpecIndex;
}

export interface EncodingEnumSpecIndex {
  /** Enum spec for channel enumeration. */
  channel?: EnumSpec<Channel>;

  /** Enum spec for aggregate enumeration. */
  aggregate?: EnumSpec<AggregateOp>;

  /** Enum spec for autoCount enumeration. */
  autoCount?: EnumSpec<AggregateOp>;

  /** Enum spec for bin enumeration. */
  bin?: EnumSpec<boolean>;

  /** Enum spec for bin.maxbins enumeration */
  maxbin?: EnumSpec<number>;

  /** Enum spec for scale enumeration. */
  scale?: EnumSpec<boolean>;

  /** Enum spec for scale.bandSize enumeration */
  scaleBandSize?: EnumSpec<number>;

  /** Enum spec for scale.clamp enumeration */
  scaleClamp?: EnumSpec<boolean>;

  /** Enum spec for scale.domain enumeration */
  scaleDomain?: EnumSpec<string | string[] | number[]>;

  /** Enum spec for scale.exponent enumeration */
  scaleExponent?: EnumSpec<number>;

  /** Enum spec for scale.nice enumeration */
  scaleNice?: EnumSpec<boolean>;

  /** Enum spec for scale.range enumeration */
  scaleRange?: EnumSpec<string | string[] | number[]>;

  /** Enum spec for scale.round enumeration */
  scaleRound?: EnumSpec<boolean>;

  /** Enum spec for scale.type enumeration */
  scaleType?: EnumSpec<ScaleType>;

  /** Enum spec for scale.useRawDomain enumeration */
  scaleUseRawDomain?: EnumSpec<boolean>;

  /** Enum spec for scale.zero enumeration */
  scaleZero?: EnumSpec<boolean>;

  /** Enum spec for timeUnit enumeration. */
  timeUnit?: EnumSpec<TimeUnit>;

  /** Enum spec for field enumeration. */
  field?: EnumSpec<string>;

  /** Enum spec for type enumeration. */
  type?: EnumSpec<Type>;
}

/**
 * Object that stores different types of EnumSpecIndexTuple
 */
export interface EnumSpecIndex {
  /** Index tuple for the mark (if mark requires enumeration). */
  // TODO: replace with just EnumSpec<Mark>.
  mark?: EnumSpec<Mark>;

  // TODO: transform

  /**
   * Dictionary mapping encoding index to an encoding enum spec index.
   */
  encodings: EncodingsEnumSpecIndex;

  encodingIndicesByProperty: Dict<number[]>;
}

export function hasPropertyIndex(enumSpecIndex: EnumSpecIndex, prop: Property) {
  if (isEncodingProperty(prop)) {
    return !!enumSpecIndex.encodingIndicesByProperty[prop];
  } if (prop === Property.MARK) {
    return !!enumSpecIndex.mark;
  }
  /* istanbul ignore next */
  throw new Error('Unimplemented for property ' + prop);
}

export function getDefaultName(prop: Property) {
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
    case Property.SCALE_BANDSIZE:
      return 's-bs';
    case Property.SCALE_CLAMP:
      return 's-c';
    case Property.SCALE_DOMAIN:
      return 's-d';
    case Property.SCALE_EXPONENT:
      return 's-e';
    case Property.SCALE_NICE:
      return 's-n';
    case Property.SCALE_RANGE:
      return 's-ra';
    case Property.SCALE_ROUND:
      return 's-r';
    case Property.SCALE_TYPE:
      return 's-t';
    case Property.SCALE_USERAWDOMAIN:
      return 's-u';
    case Property.SCALE_ZERO:
      return 's-z';
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

export function getDefaultEnumValues(prop: Property, schema: Schema, opt: QueryConfig): any[] {
  switch (prop) {
    case Property.FIELD:       // For field, by default enumerate all fields
      return schema.fields();

    // True, False for boolean values
    case Property.BIN:
    case Property.SCALE:
    case Property.SCALE_CLAMP:
    case Property.SCALE_NICE:
    case Property.SCALE_ROUND:
    case Property.SCALE_USERAWDOMAIN:
    case Property.SCALE_ZERO:
    case Property.AUTOCOUNT:
      return [false, true];


    // For other properties, take default enumValues from config.
    // The config name for each prop is a plural form of the prop.
    case Property.AGGREGATE:
      return opt.aggregates;

    case Property.BIN_MAXBINS:
      return opt.maxBinsList;

    case Property.CHANNEL:
      return opt.channels;

    case Property.MARK:
      return opt.marks;

    case Property.SCALE_BANDSIZE:
      return opt.scaleBandSizes;

    case Property.SCALE_DOMAIN:
      return opt.scaleDomains;

    case Property.SCALE_EXPONENT:
      return opt.scaleExponents;

    case Property.SCALE_RANGE:
      return opt.scaleRanges;

    case Property.SCALE_TYPE:
      return opt.scaleTypes;

    case Property.TIMEUNIT:
      return opt.timeUnits;

    case Property.TYPE:
      return opt.types;
  }
  /* istanbul ignore next */
  throw new Error('No default enumValues for ' + prop);
}

function setEnumSpecIndex(enumSpecIndex: EnumSpecIndex, index: number, prop: Property, enumSpec: EnumSpec<any>) {
  const encodingsIndex = enumSpecIndex.encodings;

  // Init encoding index and set prop
  const encIndex = encodingsIndex[index] = encodingsIndex[index] || {};
  encIndex[prop] = enumSpec;

  // Initialize indicesByProperty[prop] and add index
  const encodingIndicesByProperty = enumSpecIndex.encodingIndicesByProperty;
  (encodingIndicesByProperty[prop] = encodingIndicesByProperty[prop] || []).push(index);
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
    let enumSpecIndex: EnumSpecIndex = {encodings: {}, encodingIndicesByProperty: {}};

    // mark
    if (isEnumSpec(specQ.mark)) {
      const name = getDefaultName(Property.MARK);
      specQ.mark = initEnumSpec(specQ.mark, name, opt.marks);
      enumSpecIndex.mark = specQ.mark;
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
          const enumSpec = encQ[prop] = initEnumSpec(encQ[prop], defaultEnumSpecName, defaultEnumValues);

          // Add index of the encoding mapping to the property's enum spec index.
          setEnumSpecIndex(enumSpecIndex, index, prop, enumSpec);
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
            const enumSpec = propObj[child] = initEnumSpec(propObj[child], defaultEnumSpecName, defaultEnumValues);

            // Add index of the encoding mapping to the property's enum spec index.
            setEnumSpecIndex(enumSpecIndex, index, prop, enumSpec);
          }
        }
      });
    });

    // AUTO COUNT
    // Add Auto Count Field
    if (opt.autoAddCount) {
      const countEncQ: EncodingQuery = {
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

      // Add index of the encoding mapping to the property's enum spec index.
      setEnumSpecIndex(enumSpecIndex, index, Property.CHANNEL, countEncQ.channel);
      setEnumSpecIndex(enumSpecIndex, index, Property.AUTOCOUNT, countEncQ.autoCount);
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
    const enumSpec = this._spec.mark = this._enumSpecIndex.mark;
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
    return specShorthand(this._spec);
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

    if (this._spec.transform) {
      spec.transform = this._spec.transform;
    }

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
