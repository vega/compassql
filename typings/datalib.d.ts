declare module 'datalib/src/import/load' {
  function load(param:any, callback:any): void;
  export = load;
}

declare module 'datalib/src/util' {
  export function keys(a): Array<string>;
  export function extend(a, b, ...rest);
  export function duplicate<T>(a: T): T;
  export function isArray(a: any | any[]): a is any[];
  export function vals(a);
  export function truncate(a: string, length: number): string;
  export function toMap(a);
  export function isObject(a): a is any;
  export function isString(a): a is string;
  export function isNumber(a): a is number;
  export function isBoolean(a): a is boolean;
}

declare module 'datalib/src/import/readers' {
  export function json(param:any): any;
}

interface Summary {
  field: string;
  type: string;
  unique: { [value: string] : number };
  count: number;
  valid: number;
  missing: number;
  distinct: number;
  min: number;
  max: number;
  mean: number;
  stdev: number;
  median: number;
  q1: number;
  q3: number;
  modeskew: number;
}

declare module 'datalib/src/stats' {
  export function summary(data:any): Summary[];
}

declare module 'datalib/src/import/type' {
  export function inferAll(data: any[], fields?: any[]): {[field: string]: string};
}
