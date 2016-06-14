import {Type} from 'vega-lite/src/type';

/**
 * Finer grained data types that takes binning and timeUnit into account.
 */
export enum ExtendedType {
  Q = Type.QUANTITATIVE as any,
  BIN_Q = 'bin_' + Type.QUANTITATIVE as any,
  T = Type.TEMPORAL as any,
  TIMEUNIT_T = 'timeUnit_' + Type.TEMPORAL as any,
  O = Type.ORDINAL as any,
  N = Type.NOMINAL as any,
  NONE = '-' as any
}

export const Q = ExtendedType.Q;
export const BIN_Q = ExtendedType.BIN_Q;
export const T = ExtendedType.T;
export const TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
export const O = ExtendedType.O;
export const N = ExtendedType.N;
export const NONE = ExtendedType.NONE;