import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {Wildcard} from './wildcard';
import {Property, isEncodingProperty} from './property';
import {Dict, keys} from './util';


export interface EncodingWildcardIndex {
  /** Enum spec for channel enumeration. */
  channel?: Wildcard<Channel>;

  /** Enum spec for aggregate enumeration. */
  aggregate?: Wildcard<AggregateOp>;

  /** Enum spec for autoCount enumeration. */
  autoCount?: Wildcard<AggregateOp>;

  /** Enum spec for bin enumeration. */
  bin?: Wildcard<boolean>;

  /** Enum spec for bin.maxbins enumeration */
  maxbin?: Wildcard<number>;

  /** Enum spec for scale enumeration. */
  scale?: Wildcard<boolean>;

  /** Enum spec for scale.bandSize enumeration */
  scaleBandSize?: Wildcard<number>;

  /** Enum spec for scale.clamp enumeration */
  scaleClamp?: Wildcard<boolean>;

  /** Enum spec for scale.domain enumeration */
  scaleDomain?: Wildcard<string | string[] | number[]>;

  /** Enum spec for scale.exponent enumeration */
  scaleExponent?: Wildcard<number>;

  /** Enum spec for scale.nice enumeration */
  scaleNice?: Wildcard<boolean>;

  /** Enum spec for scale.range enumeration */
  scaleRange?: Wildcard<string | string[] | number[]>;

  /** Enum spec for scale.round enumeration */
  scaleRound?: Wildcard<boolean>;

  /** Enum spec for scale.type enumeration */
  scaleType?: Wildcard<ScaleType>;

  /** Enum spec for scale.useRawDomain enumeration */
  scaleUseRawDomain?: Wildcard<boolean>;

  /** Enum spec for scale.zero enumeration */
  scaleZero?: Wildcard<boolean>;

  /** Enum spec for timeUnit enumeration. */
  timeUnit?: Wildcard<TimeUnit>;

  /** Enum spec for field enumeration. */
  field?: Wildcard<string>;

  /** Enum spec for type enumeration. */
  type?: Wildcard<Type>;
}

export interface EncodingsWildcardIndex {
  [index: number]: EncodingWildcardIndex;
}

export class WildcardIndex {
  private _mark: Wildcard<Mark>;
  // TODO: transform

  /**
   * Dictionary mapping encoding index to an encoding enum spec index.
   */

  private _encodings: EncodingsWildcardIndex;
  private _encodingIndicesByProperty: Dict<number[]>;

  constructor() {
    this._mark = undefined;
    this._encodings = {};
    this._encodingIndicesByProperty = {};
  }

  public setEncodingProperty(index: number, prop: Property, wildcard: Wildcard<any>) {
    const encodingsIndex = this._encodings;

    // Init encoding index and set prop
    const encIndex = encodingsIndex[index] = encodingsIndex[index] || {};
    encIndex[prop] = wildcard;

    // Initialize indicesByProperty[prop] and add index
    const encodingIndicesByProperty = this._encodingIndicesByProperty;
    (encodingIndicesByProperty[prop] = encodingIndicesByProperty[prop] || []).push(index);

    return this;
  }

  public hasEncodingProperty(index: number, prop: Property) {
    return !!(this._encodings[index] || {})[prop];
  }

  public hasProperty(prop: Property) {
    if (isEncodingProperty(prop)) {
      return !!this.encodingIndicesByProperty[prop];
    } if (prop === Property.MARK) {
      return !!this.mark;
    }
    /* istanbul ignore next */
    throw new Error('Unimplemented for property ' + prop);
  }

  public isEmpty() {
    return !this.mark && keys(this.encodingIndicesByProperty).length === 0;
  }

  public setMark(mark) {
    this._mark = mark;
    return this;
  }

  public get mark() {
    return this._mark;
  }

  public get encodings() {
    return this._encodings;
  }

  public get encodingIndicesByProperty() {
    return this._encodingIndicesByProperty;
  }
}
