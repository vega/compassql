export enum Property {
  MARK = 'mark' as any,
  CHANNEL = 'channel' as any,
  AGGREGATE = 'aggregate' as any,
  BIN = 'bin' as any,
  TIMEUNIT = 'timeUnit' as any,
  FIELD = 'field' as any,
  TYPE = 'type' as any,

  // TODO: Filter (Field, Value?)
  // TODO: SORT, SCALE_TYPE, AXIS, LEGEND
}

export const ENCODING_PROPERTIES = [
  Property.CHANNEL,
  Property.AGGREGATE,
  Property.BIN,
  Property.TIMEUNIT,
  Property.FIELD,
  Property.TYPE
];
