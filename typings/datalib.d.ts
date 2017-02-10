declare module 'datalib/src/import/load' {
  function load(param:any, callback:any): void;
  export = load;
}

declare module 'datalib/src/bins/bins' {
  function bins(param: any): any;
  namespace bins {} // https://github.com/Microsoft/TypeScript/issues/5073
  export = bins;
}

declare module 'datalib/src/util' {
  export function cmp(a: any, b: any): number;
  export function keys(a: any): Array<string>;
  export function extend(a: any, b: any, ...rest: any[]): any;
  export function duplicate<T>(a: T): T;
  export function isArray(a: any | any[]): a is any[];
  export function vals(a: any): any[];
  export function truncate(a: string, length: number): string;
  export function toMap(a: any): {[key: string]: 1};
  export function isObject(a: any): a is any;
  export function isString(a: any): a is string;
  export function isNumber(a: any): a is number;
  export function isBoolean(a: any): a is boolean;
}

declare module 'datalib/src/import/readers' {
  export function json(param:any): any;
}

interface DLFieldProfile {
  field: string;
  type: string;
  unique: { [value: string] : number };
  count: number;
  valid: number;
  missing: number;
  distinct: number;
  min: number | Date;
  max: number | Date;
  mean: number;
  stdev: number;
  median: number;
  q1: number;
  q3: number;
  modeskew: number;
}

declare module 'datalib/src/stats' {
  export function summary(data:any): DLFieldProfile[];
}

declare module 'datalib/src/import/type' {
  export function inferAll(data: any[], fields?: any[]): {[field: string]: string};
}
