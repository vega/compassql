import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {EnumSpec} from './enumspec';
import {Property, isEncodingProperty} from './property';
import {Dict, keys} from './util';


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

export interface EncodingsEnumSpecIndex {
  [index: number]: EncodingEnumSpecIndex;
}

export class EnumSpecIndex {
  private _mark: EnumSpec<Mark>;
  // TODO: transform

  /**
   * Dictionary mapping encoding index to an encoding enum spec index.
   */

  private _encodings: EncodingsEnumSpecIndex;
  private _encodingIndicesByProperty: Dict<number[]>;

  constructor() {
    this._mark = undefined;
    this._encodings = {};
    this._encodingIndicesByProperty = {};
  }

  public setEncodingProperty(index: number, prop: Property, enumSpec: EnumSpec<any>) {
    const encodingsIndex = this._encodings;

    // Init encoding index and set prop
    const encIndex = encodingsIndex[index] = encodingsIndex[index] || {};
    encIndex[prop] = enumSpec;

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
