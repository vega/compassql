import {hasDiscreteDomain} from 'vega-lite/build/src/scale';
import {Type} from 'vega-lite/build/src/type';

import {FieldQuery, scaleType} from '../../query/encoding';
/**
 * Finer grained data types that takes binning and timeUnit into account.
 */
export enum ExtendedType {
  Q = Type.QUANTITATIVE as any,
  BIN_Q = 'bin_' + Type.QUANTITATIVE as any,
  T = Type.TEMPORAL as any,

  /**
   * Time Unit Temporal Field with time scale.
   */
  TIMEUNIT_T = 'timeUnit_time' as any,
  /**
   * Time Unit Temporal Field with ordinal scale.
   */
  TIMEUNIT_O = 'timeUnit_' + Type.ORDINAL as any,
  O = Type.ORDINAL as any,
  N = Type.NOMINAL as any,
  NONE = '-' as any
}

export const Q = ExtendedType.Q;
export const BIN_Q = ExtendedType.BIN_Q;
export const T = ExtendedType.T;
export const TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
export const TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
export const O = ExtendedType.O;
export const N = ExtendedType.N;
export const NONE = ExtendedType.NONE;

export function getExtendedType(fieldQ: FieldQuery): ExtendedType {
  if (fieldQ.bin) {
    return ExtendedType.BIN_Q;
  } else if (fieldQ.timeUnit) {
    const sType = scaleType(fieldQ);
    return hasDiscreteDomain(sType) ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
  }
  return fieldQ.type as ExtendedType;
}