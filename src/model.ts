import {Channel} from 'vega-lite/build/src/channel';
import {Data} from 'vega-lite/build/src/data';
import {Mark} from 'vega-lite/build/src/mark';
import {Type} from 'vega-lite/build/src/type';
import {FacetedCompositeUnitSpec} from 'vega-lite/build/src/spec';
import {StackProperties} from 'vega-lite/build/src/stack';

import {QueryConfig} from './config';
import {Property, ENCODING_TOPLEVEL_PROPS, ENCODING_NESTED_PROPS, isEncodingNestedProp, isEncodingNestedParent} from './property';
import {Wildcard, SHORT_WILDCARD, initWildcard, isWildcard, getDefaultName, getDefaultEnumValues} from './wildcard';
import {WildcardIndex} from './wildcardindex';
import {SpecQuery, isAggregate, stack} from './query/spec';
import {AutoCountQuery, isFieldQuery, isAutoCountQuery, isDisabledAutoCountQuery, EncodingQuery, toEncoding} from './query/encoding';
import {GroupBy, ExtendedGroupBy, parseGroupBy} from './query/groupby';
import {spec as specShorthand} from './query/shorthand';
import {RankingScore} from './ranking/ranking';
import {Schema} from './schema';
import {Dict, duplicate, extend} from './util';
import {isString} from 'datalib/src/util';
import {getGroupByKey} from './nest';

/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
export class SpecQueryModel {
  private _spec: SpecQuery;

  /** channel => EncodingQuery */
  private _channelFieldCount: Dict<number>;
  private _wildcardIndex: WildcardIndex;
  private _assignedWildcardIndex: Dict<any>;
  private _schema: Schema;
  private _opt: QueryConfig;

  private _rankingScore: Dict<RankingScore> = {};


  /**
   * Build an WildcardIndex by detecting wildcards
   * in the input specQuery and replace short wildcards ("?")
   * with full ones (objects with `name` and `enum` values).
   *
   * @return a SpecQueryModel that wraps the specQuery and the WildcardIndex.
   */
  public static build(specQ: SpecQuery, schema: Schema, opt: QueryConfig): SpecQueryModel {
    let wildcardIndex: WildcardIndex = new WildcardIndex();
    // mark
    if (isWildcard(specQ.mark)) {
      const name = getDefaultName(Property.MARK);
      specQ.mark = initWildcard(specQ.mark, name, opt.enum.mark);
      wildcardIndex.setMark(specQ.mark);
    }

    // TODO: transform

    // encodings
    specQ.encodings.forEach((encQ, index) => {
      if (isAutoCountQuery(encQ)) {
        // This is only for testing purpose
        console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');

        encQ.type = Type.QUANTITATIVE; // autoCount is always quantitative
      }

      if (isFieldQuery(encQ) && encQ.type === undefined) {
        // type is optional -- we automatically augment wildcard if not specified
        encQ.type = SHORT_WILDCARD;
      }

      // For each property of the encodingQuery, enumerate
      ENCODING_TOPLEVEL_PROPS.forEach((prop) => {
        if(isWildcard(encQ[prop])) {
          // Assign default wildcard name and enum values.
          const defaultWildcardName = getDefaultName(prop) + index;
          const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
          const wildcard = encQ[prop] = initWildcard(encQ[prop], defaultWildcardName, defaultEnumValues);

          // Add index of the encoding mapping to the property's wildcard index.
          wildcardIndex.setEncodingProperty(index, prop, wildcard);
        }
      });

      // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
      ENCODING_NESTED_PROPS.forEach((prop) => {
        const propObj = encQ[prop.parent]; // the property object e.g., encQ.bin
        if (propObj) {
          const child = prop.child;
          if (isWildcard(propObj[child])) {

            // Assign default wildcard name and enum values.
            const defaultWildcardName = getDefaultName(prop) + index;
            const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
            const wildcard = propObj[child] = initWildcard(propObj[child], defaultWildcardName, defaultEnumValues);

            // Add index of the encoding mapping to the property's wildcard index.
            wildcardIndex.setEncodingProperty(index, prop, wildcard);
          }
        }
      });
    });

    // AUTO COUNT
    // Add Auto Count Field
    if (opt.autoAddCount) {
      const channel: Wildcard<Channel> = {
        name: getDefaultName(Property.CHANNEL) + specQ.encodings.length,
        enum: getDefaultEnumValues(Property.CHANNEL, schema, opt)
      };
      const autoCount: Wildcard<boolean> = {
        name: getDefaultName(Property.AUTOCOUNT) + specQ.encodings.length,
        enum: [false, true]
      };
      const countEncQ: AutoCountQuery = {
        channel,
        autoCount,
        type: Type.QUANTITATIVE
      };
      specQ.encodings.push(countEncQ);

      const index = specQ.encodings.length - 1;

      // Add index of the encoding mapping to the property's wildcard index.
      wildcardIndex.setEncodingProperty(index, Property.CHANNEL, channel);
      wildcardIndex.setEncodingProperty(index, Property.AUTOCOUNT, autoCount);
    }

    return new SpecQueryModel(specQ, wildcardIndex, schema, opt, {});
  }

  constructor(spec: SpecQuery, wildcardIndex: WildcardIndex, schema: Schema, opt: QueryConfig, wildcardAssignment: Dict<any>) {
    this._spec = spec;
    this._channelFieldCount = spec.encodings.reduce((m, encQ) => {
      if (!isWildcard(encQ.channel) && (!isAutoCountQuery(encQ) || encQ.autoCount !== false)) {
        m[encQ.channel + ''] = 1;
      }
      return m;
    }, {} as Dict<number>);

    this._wildcardIndex = wildcardIndex;
    this._assignedWildcardIndex = wildcardAssignment;
    this._opt = opt;
    this._schema = schema;
  }

  public get wildcardIndex() {
    return this._wildcardIndex;
  }

  public get schema() {
    return this._schema;
  }

  public get specQuery() {
    return this._spec;
  }

  public duplicate(): SpecQueryModel {
    return new SpecQueryModel(duplicate(this._spec), this._wildcardIndex, this._schema, this._opt, duplicate(this._assignedWildcardIndex));
  }

  public setMark(mark: Mark) {
    const name = this._wildcardIndex.mark.name;
    this._assignedWildcardIndex[name] = this._spec.mark = mark;
  }

  public resetMark() {
    const wildcard = this._spec.mark = this._wildcardIndex.mark;
    delete this._assignedWildcardIndex[wildcard.name];
  }

  public getMark() {
    return this._spec.mark;
  }

  public getEncodingProperty(index: number, prop: Property) {
    const encQ = this._spec.encodings[index];
    if (isEncodingNestedProp(prop)) { // nested encoding property
      return encQ[prop.parent][prop.child];
    }
    return encQ[prop]; // encoding property (non-nested)
  }

  public setEncodingProperty(index: number, prop: Property, value: any, wildcard: Wildcard<any>) {
    const encQ = this._spec.encodings[index];

    if (prop === Property.CHANNEL && encQ.channel && !isWildcard(encQ.channel)) {
      // If there is an old channel
      this._channelFieldCount[encQ.channel as Channel]--;
    }


    if (isEncodingNestedProp(prop)) { // nested encoding property
      encQ[prop.parent][prop.child] = value;
    } else if (isEncodingNestedParent(prop) && value === true) {
      encQ[prop] = extend({},
        encQ[prop], // copy all existing properties
        {enum: undefined, name: undefined} // except name and values to it no longer an wildcard
      );
    } else { // encoding property (non-nested)
      encQ[prop] = value;
    }

    this._assignedWildcardIndex[wildcard.name] = value;

    if (prop === Property.CHANNEL) {
      // If there is a new channel, make sure it exists and add it to the count.
      this._channelFieldCount[value] = (this._channelFieldCount[value] || 0) + 1;
    }
  }

  public resetEncodingProperty(index: number, prop: Property, wildcard: Wildcard<any>) {
    const encQ = this._spec.encodings[index];
    if (prop === Property.CHANNEL) {
      this._channelFieldCount[encQ.channel as Channel]--;
    }

    // reset it to wildcard
    if (isEncodingNestedProp(prop)) { // nested encoding property
      encQ[prop.parent][prop.child] = wildcard;
    } else { // encoding property (non-nested)
      encQ[prop] = wildcard;
    }

    // add remove value that is reset from the assignment map
    delete this._assignedWildcardIndex[wildcard.name];
  }

  public channelUsed(channel: Channel) {
    // do not include encoding that has autoCount = false because it is not a part of the output spec.
    return this._channelFieldCount[channel] > 0;
  }

  public stack(): StackProperties {
    return stack(this._spec);
  }

  public getEncodings(): EncodingQuery[] {
    // do not include encoding that has autoCount = false because it is not a part of the output spec.
    return this._spec.encodings.filter(encQ => !isDisabledAutoCountQuery(encQ));
  }

  public getEncodingQueryByChannel(channel: Channel) {
    for (let specEncoding of this._spec.encodings) {
      if (specEncoding.channel === channel) {
        return specEncoding;
      }
    }
    return undefined;
  }

  public getEncodingQueryByIndex(i: number) {
    return this._spec.encodings[i];
  }

  public isAggregate() {
    return isAggregate(this._spec);
  }

  public toShorthand(groupBy?: string | (string | ExtendedGroupBy)[]): string {
    if (groupBy) {
      if (isString(groupBy)) {
        return getGroupByKey(this.specQuery, groupBy);
      }
      const parsedGroupBy = parseGroupBy(groupBy);
      return specShorthand(this._spec, parsedGroupBy.include, parsedGroupBy.replacer);
    }
    return specShorthand(this._spec);
  }

  /**
   * Convert a query to a Vega-Lite spec if it is completed.
   * @return a Vega-Lite spec if completed, null otherwise.
   */
  public toSpec(data?: Data): FacetedCompositeUnitSpec {
    if (isWildcard(this._spec.mark)) return null;

    let spec: any = {};
    data = data || this._spec.data;
    if (data) {
      spec.data = data;
    }

    if (this._spec.transform) {
      spec.transform = this._spec.transform;
    }

    spec.mark = this._spec.mark as Mark;
    spec.encoding = toEncoding(this.specQuery.encodings, {schema: this._schema, wildcardMode: 'null'});
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

export interface SpecQueryGroup<T> {
  name: string;
  path: string;
  items: (SpecQueryGroup<T> | T)[];
  groupBy?: GroupBy;
  orderGroupBy?: string | string[];
}

export function getTopSpecQueryItem<T>(specQuery: SpecQueryGroup<T>): T {
    let topItem = specQuery.items[0];
    while (topItem && isSpecQueryGroup(topItem)) {
      topItem = topItem.items[0];
    }
    return <T>topItem;
}

export function isSpecQueryGroup<T>(item: SpecQueryGroup<T> | T): item is SpecQueryGroup<T> {
  return (<SpecQueryGroup<T>>item).items !== undefined;
}

export type SpecQueryModelGroup = SpecQueryGroup<SpecQueryModel>;
