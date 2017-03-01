import {Mark} from 'vega-lite/build/src/mark';

import {Wildcard} from './wildcard';
import {Property, isEncodingProperty} from './property';
import {PropIndex} from './propindex';


export interface EncodingsWildcardIndex {
  [index: number]: PropIndex<Wildcard<any>>;
}

export class WildcardIndex {
  private _mark: Wildcard<Mark>;
  // TODO: transform

  /**
   * Dictionary mapping encoding index to an encoding wildcard index.
   */

  private _encodings: EncodingsWildcardIndex;
  private _encodingIndicesByProperty: PropIndex<number[]>;

  constructor() {
    this._mark = undefined;
    this._encodings = {};
    this._encodingIndicesByProperty = new PropIndex<number[]>();
  }

  public setEncodingProperty(index: number, prop: Property, wildcard: Wildcard<any>) {
    const encodingsIndex = this._encodings;

    // Init encoding index and set prop
    const encIndex = encodingsIndex[index] = encodingsIndex[index] || new PropIndex<Wildcard<any>>();
    encIndex.set(prop, wildcard);

    // Initialize indicesByProperty[prop] and add index
    const indicesByProp = this._encodingIndicesByProperty;
    indicesByProp.set(prop, (indicesByProp.get(prop) || []));
    indicesByProp.get(prop).push(index);

    return this;
  }

  public hasEncodingProperty(index: number, prop: Property) {
    return !!this._encodings[index] && this._encodings[index].has(prop);
  }

  public hasProperty(prop: Property) {
    if (isEncodingProperty(prop)) {
      return this.encodingIndicesByProperty.has(prop);
    } if (prop === 'mark') {
      return !!this.mark;
    }
    /* istanbul ignore next */
    throw new Error('Unimplemented for property ' + prop);
  }

  public isEmpty() {
    return !this.mark && this.encodingIndicesByProperty.size() === 0;
  }

  public setMark(mark: Wildcard<Mark>) {
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
