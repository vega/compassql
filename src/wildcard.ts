import {extend, isArray} from './util';
export const SHORT_WILDCARD: SHORT_WILDCARD = "?";

export type SHORT_WILDCARD = "?";

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
