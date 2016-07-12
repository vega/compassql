import {Channel, X, Y, STACK_GROUP_CHANNELS} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {Data} from 'vega-lite/src/data';
import {Mark, BAR, AREA} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {ExtendedUnitSpec} from 'vega-lite/src/spec';
import {StackOffset, StackProperties} from 'vega-lite/src/stack';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {QueryConfig, DEFAULT_QUERY_CONFIG} from './config';
import {generate} from './generate';
import {nest} from './nest';
import {Property, ENCODING_PROPERTIES, isNestedEncodingProperty} from './property';
import {rank} from './ranking/ranking';
import {Schema} from './schema';
import {contains, duplicate, extend, keys, some} from './util';

export function query(q: Query, schema: Schema, config?: Config) {
  // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
  //    and merge config with the following precedence
  //    query.config > config > DEFAULT_QUERY_CONFIG
  q = extend({}, normalize(q), {
    config: extend({}, DEFAULT_QUERY_CONFIG, config, q.config)
  });

  // 2. Generate
  const answerSet = generate(q.spec, schema, q.config);
  const nestedAnswerSet = nest(answerSet, q);
  const result = rank(nestedAnswerSet, q, schema, 0);

  return {
    query: q,
    result: result
  };
}

/**
 * Normalize the non-nested version of the query to a standardize nested
 */
export function normalize(q: Query): Query {
  if (q.groupBy) {
    let nest: Nest = {
      groupBy: q.groupBy
    };

    if (q.orderBy) {
      nest.orderGroupBy = q.orderBy;
    }

    let normalizedQ: Query = {
      spec: duplicate(q.spec), // We will cause side effect to q.spec in SpecQueryModel.build
      nest: [nest],
    };

    if (q.chooseBy) {
      normalizedQ.chooseBy = q.chooseBy;
    }

    if (q.config) {
      normalizedQ.config = q.config;
    }

    return normalizedQ;
  }
  return duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
}


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

function enumSpecShort(value: any): string {
  return (isEnumSpec(value) ? SHORT_ENUM_SPEC : value) + '';
}

export interface Query {
  spec: SpecQuery;
  nest?: Nest[];
  groupBy?: string;
  orderBy?: string;
  chooseBy?: string;
  config?: QueryConfig;
}

export interface Nest {
  groupBy: string;
  orderGroupBy?: string;
}

export interface SpecQuery {
  data?: Data;
  mark: Mark | EnumSpec<Mark> | ShortEnumSpec;
  transform?: TransformQuery;
  encodings: EncodingQuery[];

  // TODO: make config query (not important at all, only for the sake of completeness.)
  config?: Config;
}

/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
export function fromSpec(spec: ExtendedUnitSpec) {
  return extend(
    spec.data ? { data: spec.data} : {},
    spec.transform ? { transform: spec.transform } : {},
    {
      mark: spec.mark,
      encodings: keys(spec.encoding).map((channel) => {
          let encQ: EncodingQuery = { channel: channel };
          let channelDef = spec.encoding[channel];

          for (const prop of ENCODING_PROPERTIES) {
            if (!isNestedEncodingProperty(prop) && channelDef[prop] !== undefined) {
              encQ[prop] = channelDef[prop];
            }
            // Currently scale, axis, legend only support boolean, but not null.
            // Therefore convert null to false.
            if (contains([Property.SCALE, Property.AXIS, Property.LEGEND], prop) && encQ[prop] === null) {
              encQ[prop] = false;
            }
          }
          return encQ;
        }
      )
    },
    spec.config ? { config: spec.config } : {}
  );
}

export function isAggregate(specQ: SpecQuery) {
  return some(specQ.encodings, (encQ: EncodingQuery) => {
    return (!isEnumSpec(encQ.aggregate) && !!encQ.aggregate) || encQ.autoCount === true;
  });
}

export function stringifySpecQuery (specQ: SpecQuery): string {
  const mark = enumSpecShort(specQ.mark);
  const encodings = specQ.encodings.map(stringifyEncodingQuery)
                        .sort()
                        .join('|');  // sort at the end to ignore order
  const _stack = stack(specQ);

  return mark + '|' +
      // TODO: transform
      (_stack ? 'stack=' + _stack.offset + '|' : '') +
      encodings;
}

/**
 * @return the stack offset type for the specQuery
 */
export function stack(specQ: SpecQuery): StackProperties {
  const config = specQ.config;
  const stacked = (config && config.mark) ? config.mark.stacked : undefined;

  // Should not have stack explicitly disabled
  if (contains([StackOffset.NONE, null, false], stacked)) {
    return null;
  }

  // Should have stackable mark
  if (!contains([BAR, AREA], specQ.mark)) {
    return null;
  }

  // Should be aggregate plot
  if (!isAggregate(specQ)) {
    return null;
  }

  const stackByChannels = specQ.encodings.reduce((sc, encQ: EncodingQuery) => {
    if (contains(STACK_GROUP_CHANNELS, encQ.channel) && !encQ.aggregate) {
      sc.push(encQ.channel);
    }
    return sc;
  }, []);

  if (stackByChannels.length === 0) {
    return null;
  }

  // Has only one aggregate axis
  const xEncQ = specQ.encodings.reduce((f, encQ: EncodingQuery) => {
    return f || (encQ.channel === Channel.X ? encQ : null);
  }, null);
  const yEncQ = specQ.encodings.reduce((f, encQ: EncodingQuery) => {
    return f || (encQ.channel === Channel.Y ? encQ : null);
  }, null);
  const xIsAggregate = !!xEncQ && (!!xEncQ.aggregate || !!xEncQ.autoCount);
  const yIsAggregate = !!yEncQ && (!!yEncQ.aggregate || !!yEncQ.autoCount);

  if (xIsAggregate !== yIsAggregate) {
    return {
      groupbyChannel: xIsAggregate ? (!!yEncQ ? Y : null) : (!!xEncQ ? X : null),
      fieldChannel: xIsAggregate ? X : Y,
      stackByChannels: stackByChannels,
      offset: stacked || StackOffset.ZERO
    };
  }
  return null;
}

export interface TransformQuery {
  filter: FilterQuery[];
}

export interface FilterQuery {
  field: Field | EnumSpec<Field> | ShortEnumSpec;
  operator: string;
  operand: any | EnumSpec<any> | ShortEnumSpec;
}

type Field = string;

export interface EncodingQuery {
  channel: Channel | EnumSpec<Channel> | ShortEnumSpec;

  // FieldDef
  aggregate?: AggregateOp | EnumSpec<AggregateOp> | ShortEnumSpec;
  /** Internal flag for representing automatic count that are added to plots with only ordinal or binned fields. */
  autoCount?: boolean | EnumSpec<boolean> | ShortEnumSpec;
  timeUnit?: TimeUnit | EnumSpec<TimeUnit> | ShortEnumSpec;

  bin?: boolean | BinQuery | ShortEnumSpec;
  scale?: boolean | ScaleQuery | ShortEnumSpec;

  field?: Field | EnumSpec<Field> | ShortEnumSpec;
  type?: Type | EnumSpec<Type> | ShortEnumSpec;
  // TODO: value

  // TODO: scaleQuery, axisQuery, legendQuery
}

export interface BinQuery extends EnumSpec<boolean> {
  maxbins?: number | EnumSpec<number> | ShortEnumSpec;
}

export interface ScaleQuery extends EnumSpec<boolean> {
  // TODO: add other properties from vegalite/src/scale
  type?: ScaleType | EnumSpec<ScaleType> | ShortEnumSpec;
}

export function isDimension(encQ: EncodingQuery) {
  return contains([Type.NOMINAL, Type.ORDINAL], encQ.type) ||
      (!isEnumSpec(encQ.bin) && !!encQ.bin) ||          // surely Q type
      (!isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit);  // surely T type
}

export function isMeasure(encQ: EncodingQuery) {
  return (encQ.type === Type.QUANTITATIVE && !encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !encQ.timeUnit);
}

export function stringifyEncodingQuery(encQ: EncodingQuery): string {
  return enumSpecShort(encQ.channel) + ':' + stringifyEncodingQueryFieldDef(encQ);
}

export function stringifyEncodingQueryFieldDef(encQ: EncodingQuery): string {
  let fn = null;
  const params: {key: string, value: any}[]=  [];

  if (encQ.autoCount === false) {
    return '-';
  }

  if (encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
    fn = encQ.aggregate;
  } else if (encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
    fn = encQ.timeUnit;
  } else if (encQ.bin && !isEnumSpec(encQ.bin)) {
    fn = 'bin';
    if (encQ.bin['maxbins']) {
      params.push({key: 'maxbins', value: encQ.bin['maxbins']});
    }
  } else if (encQ.autoCount && !isEnumSpec(encQ.autoCount)) {
    fn = 'count';
  } else if (
      (encQ.aggregate && isEnumSpec(encQ.aggregate)) ||
      (encQ.autoCount && isEnumSpec(encQ.autoCount)) ||
      (encQ.timeUnit && isEnumSpec(encQ.timeUnit)) ||
      (encQ.bin && isEnumSpec(encQ.bin))
    ) {
    fn = SHORT_ENUM_SPEC + '';
  }

  // Scale
  // TODO: convert this chunk into a loop of scale, axis, legend
  if (encQ.scale && !isEnumSpec(encQ.scale)) {
      if (encQ.scale && !isEnumSpec(encQ.scale)) {
      var scaleParams = {};

      if (encQ.scale['type']) {
        scaleParams = {type: encQ.scale['type']};
      }
      // TODO: push other scale properties to scaleParams.

      if (keys(scaleParams).length > 0) {
        params.push({
          key: 'scale',
          value: JSON.stringify(scaleParams)
        });
      }
    }
  } else if (encQ.scale === false || encQ.scale === null) {
    params.push({
      key: 'scale',
      value: false
    });
  }



  const fieldType = enumSpecShort(encQ.field || '*') + ',' +
    enumSpecShort(encQ.type || Type.QUANTITATIVE).substr(0,1) +
    params.map((p) => ',' + p.key + '=' + p.value).join('');
  return (fn ? fn + '(' + fieldType + ')' : fieldType);
}
