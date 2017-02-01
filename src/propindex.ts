import { Dict, keys } from './util';
import {
  Property, toKey,
} from './property';

export interface PropIndexReader<T> {
  has(p: Property): boolean;
  get(p: Property): T;
}

/**
 * Dictionary that takes property as a key.
 */
export class PropIndex<T> implements PropIndexReader<T> {
  private index: Dict<T>;

  constructor(i: Dict<T> = null) {
    this.index = i ? { ...i } : {};
  }

  public has(p: Property) {
    return toKey(p) in this.index;
  }

  public get(p: Property) {
    return this.index[toKey(p)];
  }

  public set(p: Property, value: T) {
    this.index[toKey(p)] = value;
    return this;
  }

  public setByKey(key: string, value: T) {
    this.index[key] = value;
  }

  public map<U>(f: (t: T) => U): PropIndex<U> {
    const i = new PropIndex<U>();
    for (const k in this.index) {
      i.index[k] = f(this.index[k]);
    }
    return i;
  }

  public size() {
    return keys(this.index).length;
  }

  public duplicate(): PropIndex<T> {
    return new PropIndex<T>(this.index);
  }
}
