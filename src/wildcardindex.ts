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
  /** Wildcard for channel enumeration. */
  channel?: Wildcard<Channel>;

  /** Wildcard for aggregate enumeration. */
  aggregate?: Wildcard<AggregateOp>;

  /** Wildcard for autoCount enumeration. */
  autoCount?: Wildcard<AggregateOp>;

  /** Wildcard for bin enumeration. */
  bin?: Wildcard<boolean>;

  /** Wildcard for bin.maxbins enumeration */
  maxbin?: Wildcard<number>;

  /** Wildcard for scale enumeration. */
  scale?: Wildcard<boolean>;

  /** Wildcard for scale.bandSize enumeration */
  scaleBandSize?: Wildcard<number>;

  /** Wildcard for scale.clamp enumeration */
  scaleClamp?: Wildcard<boolean>;

  /** Wildcard for scale.domain enumeration */
  scaleDomain?: Wildcard<string | string[] | number[]>;

  /** Wildcard for scale.exponent enumeration */
  scaleExponent?: Wildcard<number>;

  /** Wildcard for scale.nice enumeration */
  scaleNice?: Wildcard<boolean>;

  /** Wildcard for scale.range enumeration */
  scaleRange?: Wildcard<string | string[] | number[]>;

  /** Wildcard for scale.round enumeration */
  scaleRound?: Wildcard<boolean>;

  /** Wildcard for scale.type enumeration */
  scaleType?: Wildcard<ScaleType>;

  /** Wildcard for scale.useRawDomain enumeration */
  scaleUseRawDomain?: Wildcard<boolean>;

  /** Wildcard for scale.zero enumeration */
  scaleZero?: Wildcard<boolean>;

  /** Wildcard for timeUnit enumeration. */
  timeUnit?: Wildcard<TimeUnit>;

  /** Wildcard for field enumeration. */
  field?: Wildcard<string>;

  /** Wildcard for type enumeration. */
  type?: Wildcard<Type>;
}

export interface EncodingsWildcardIndex {
  [index: number]: EncodingWildcardIndex;
}

export class WildcardIndex {
  private _mark: Wildcard<Mark>;
  // TODO: transform

  /**
   * Dictionary mapping encoding index to an encoding wildcard index.
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
