import {Type} from 'vega-lite/build/src/type';
export namespace ExpandedType {
  export const QUANTITATIVE = Type.QUANTITATIVE;
  export const ORDINAL = Type.ORDINAL;
  export const TEMPORAL = Type.TEMPORAL;
  export const NOMINAL = Type.NOMINAL;
  export const KEY: 'key' = 'key';
}

export type ExpandedType = Type | typeof ExpandedType.KEY;
