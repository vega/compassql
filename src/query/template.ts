import {AggregateOp} from 'vega-lite/src/aggregate';
import {Type} from 'vega-lite/src/type';

import {GroupBy} from './groupby';
import {Query} from './query';

import {isEnumSpec, SHORT_ENUM_SPEC} from '../enumspec';
import {Property} from '../property';
import {Dict, duplicate} from '../util';

function makeEnumSpec(val) {
  return isEnumSpec(val) ? val : SHORT_ENUM_SPEC;
}

const GROUP_BY_SIMILAR_ENCODINGS: GroupBy = [
  Property.FIELD,
  Property.AGGREGATE,
  Property.BIN,
  Property.TIMEUNIT,
  Property.TYPE,
  {
    property: Property.CHANNEL,
    replace: {
      'x': 'xy', 'y': 'xy',
      'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
      'row': 'facet', 'column': 'facet'
    } as Dict<string>
  }
];

const GROUP_BY_SIMILAR_DATA_AND_TRANSFORM: GroupBy = [
  Property.FIELD,
  Property.AGGREGATE,
  Property.BIN,
  Property.TIMEUNIT,
  Property.TYPE,
];

/**
 * Namespace for template methods for making a new SpecQuery
 */
export function alternativeEncodings(query: Query): Query {
  let newSpecQ = duplicate(query.spec);
  newSpecQ.mark = makeEnumSpec(newSpecQ.mark);
  newSpecQ.encodings.forEach((encQ) => {
    encQ.channel = makeEnumSpec(encQ.channel);
  });

  // TODO: extend config
  return {
    spec: newSpecQ,
    groupBy: GROUP_BY_SIMILAR_ENCODINGS,
    orderBy: 'effectiveness'
  };
}

export function summarize(query: Query): Query {
  let newSpecQ = duplicate(query.spec);

  newSpecQ.encodings.forEach((encQ) => {
    if (isEnumSpec(encQ.type)) {
      encQ.aggregate = makeEnumSpec(encQ.aggregate);
      encQ.bin = makeEnumSpec(encQ.bin);
      encQ.timeUnit = makeEnumSpec(encQ.timeUnit);
    } else {
      switch (encQ.type) {
        case Type.QUANTITATIVE:
          encQ.aggregate = makeEnumSpec(encQ.aggregate);
          encQ.bin = makeEnumSpec(encQ.bin);
          break;
        case Type.TEMPORAL:
          // TODO: only year and periodic timeUnit
          encQ.timeUnit = makeEnumSpec(encQ.timeUnit);
          break;
      }
    }
  });

  // TODO: extend config
  return {
    spec: newSpecQ,
    groupBy: GROUP_BY_SIMILAR_DATA_AND_TRANSFORM,
    chooseBy: 'effectiveness',
    config: {autoAddCount: true}
  };
}

export function disaggregate(query: Query): Query {
  let newSpecQ = duplicate(query.spec);
  newSpecQ.encodings.forEach((encQ) => {
    if (isEnumSpec(encQ.type) || encQ.type === Type.QUANTITATIVE) {
      delete encQ.aggregate;
      delete encQ.bin;
    }
  });

  return {
    spec: newSpecQ,
    groupBy: GROUP_BY_SIMILAR_DATA_AND_TRANSFORM,
    chooseBy: 'effectiveness',
    config: {autoAddCount: false}
  };
}

export function addCategoricalField(query: Query): Query {
  let newSpecQ = duplicate(query.spec);
  newSpecQ.encodings.push({
    channel: SHORT_ENUM_SPEC,
    field: SHORT_ENUM_SPEC,
    type: {
      values: [Type.NOMINAL, Type.ORDINAL]
    }
  });

  return {
    spec: newSpecQ,
    groupBy: GROUP_BY_SIMILAR_DATA_AND_TRANSFORM,
    chooseBy: 'effectiveness',
    config: {autoAddCount: false}
  };
}

export function addQuantitativeField(query: Query): Query {
  let newSpecQ = duplicate(query.spec);
  newSpecQ.encodings.push({
    channel: SHORT_ENUM_SPEC,
    bin: SHORT_ENUM_SPEC,
    aggregate: SHORT_ENUM_SPEC,
    field: SHORT_ENUM_SPEC,
    type: Type.QUANTITATIVE
  });

  return {
    spec: newSpecQ,
    groupBy: GROUP_BY_SIMILAR_DATA_AND_TRANSFORM,
    chooseBy: 'effectiveness',
    config: {autoAddCount: false}
  };
}

export function histograms(query: Query): Query {
  return {
    spec: {
      data: query.spec.data,
      mark: SHORT_ENUM_SPEC,
      encodings: [
        {channel: SHORT_ENUM_SPEC, field: SHORT_ENUM_SPEC, bin: SHORT_ENUM_SPEC, type: SHORT_ENUM_SPEC},
        {channel: SHORT_ENUM_SPEC, field: '*', aggregate: AggregateOp.COUNT, type: Type.QUANTITATIVE}
      ]
    },
    groupBy: GROUP_BY_SIMILAR_DATA_AND_TRANSFORM,
    chooseBy: 'effectiveness',
    config: {autoAddCount: false}
  };
}
