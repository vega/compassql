declare module 'datalib/src/import/load' {
  function load(param:any, callback:any): void;
  export = load;
}


declare module 'datalib/src/import/readers' {
  export function json(param:any): any;
}

declare module 'datalib/src/stats' {
  export function summary(data:any): any[];
}

declare module 'datalib/src/import/type' {
  export function inferAll(data: any[], fields?: any[]): {[field: string]: string};
}
