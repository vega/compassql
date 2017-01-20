import {extend, isArray} from './util';


/** Enum for a short form of the enumeration spec. */
export enum ShortWildcard {
  WILDCARD = '?' as any
}

export const SHORT_WILDCARD = ShortWildcard.WILDCARD;

export interface Wildcard<T> {
  name?: string;
  enum?: T[];
}

export interface ExtendedWildcard<T> extends Wildcard<T> {
  [prop: string]: any;
}

export function isWildcard(prop: any) {
  return prop === SHORT_WILDCARD || (prop !== undefined && (!!prop.enum || !!prop.name) && !isArray(prop));
}

export function initWildcard(prop: any, defaultName: string, defaultEnumValues: any[]): ExtendedWildcard<any> {
  return extend({}, {
      name: defaultName,
      enum: defaultEnumValues
    }, prop === SHORT_WILDCARD ? {} : prop);
}
