declare module 'datalib/src/import/load' {
  function load(param:any, callback:any): void;
  export = load;
}

declare module 'datalib/src/import/type' {
  export function inferAll(data: any[], fields?: any[]): {[field: string]: string};
}
