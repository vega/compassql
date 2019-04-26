import * as TYPE from 'vega-lite/build/src/type';
import {Type} from 'vega-lite/build/src/type';

export namespace ExpandedType {
  export const QUANTITATIVE = TYPE.QUANTITATIVE;
  export const ORDINAL = TYPE.ORDINAL;
  export const TEMPORAL = TYPE.TEMPORAL;
  export const NOMINAL = TYPE.NOMINAL;
  export const KEY: 'key' = 'key';
}

export type ExpandedType = Type | typeof ExpandedType.KEY;

export function isDiscrete(fieldType: any) {
  return fieldType === TYPE.ORDINAL || fieldType === TYPE.NOMINAL || fieldType === ExpandedType.KEY;
}
