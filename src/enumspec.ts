import {extend} from './util';


/** Enum for a short form of the enumeration spec. */
export enum ShortEnumSpec {
  ENUMSPEC = '?' as any
}

export const SHORT_ENUM_SPEC = ShortEnumSpec.ENUMSPEC;

export interface EnumSpec<T> {
  name?: string;
  values?: T[];
}

export function isEnumSpec(prop: any) {
  return prop === SHORT_ENUM_SPEC || (prop !== undefined && !!prop.values);
}

export function initEnumSpec(prop: any, defaultName: string, defaultEnumValues: any[]): EnumSpec<any> & any {
  return extend({}, {
      name: defaultName,
      values: defaultEnumValues
    }, prop);
}

export function enumSpecShort(value: any): string {
  return (isEnumSpec(value) ? SHORT_ENUM_SPEC : value) + '';
}
