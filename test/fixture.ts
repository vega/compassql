import * as TYPE from 'vega-lite/build/src/type';
import {FieldSchema, PrimitiveType, Schema} from '../src/schema';

const fixtures: FieldSchema[] = [
  {
    name: 'Q',
    vlType: TYPE.QUANTITATIVE,
    type: PrimitiveType.NUMBER,
    stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'Q1',
    vlType: TYPE.QUANTITATIVE,
    type: PrimitiveType.NUMBER,
    stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'Q2',
    vlType: TYPE.QUANTITATIVE,
    type: PrimitiveType.NUMBER,
    stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'Q5',
    vlType: TYPE.QUANTITATIVE,
    type: PrimitiveType.NUMBER,
    stats: {distinct: 5} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'Q10',
    vlType: TYPE.QUANTITATIVE,
    type: PrimitiveType.NUMBER,
    stats: {distinct: 10} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'Q15',
    vlType: TYPE.QUANTITATIVE,
    type: PrimitiveType.NUMBER,
    stats: {distinct: 15} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'Q20',
    vlType: TYPE.QUANTITATIVE,
    type: PrimitiveType.NUMBER,
    stats: {distinct: 20} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'T',
    vlType: TYPE.TEMPORAL,
    type: PrimitiveType.DATETIME,
    stats: {
      distinct: 100,
      unique: {'2000/1/1': 1, '2000/1/2': 1}
    } as any, // HACK so that we don't have to define all summary properties
    timeStats: {
      year: {
        distinct: 2,
        unique: {'2000/1/1': 1, '2000/1/2': 1}
      },
      month: {
        distinct: 2,
        unique: {'2000/1/1': 1, '2000/1/2': 1}
      },
      day: {
        distinct: 2,
        unique: {'2000/1/1': 1, '2000/1/2': 1}
      }
    } as any
  },
  {
    name: 'T1',
    vlType: TYPE.TEMPORAL,
    type: PrimitiveType.DATETIME,
    stats: {distinct: 100} as any, // HACK so that we don't have to define all summary properties
    timeStats: {year: {distinct: 5}, month: {distinct: 12}, day: {distinct: 5}} as any
  },
  {
    name: 'O',
    vlType: TYPE.ORDINAL,
    type: PrimitiveType.STRING,
    stats: {distinct: 6} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'O_10',
    vlType: TYPE.ORDINAL,
    type: PrimitiveType.STRING,
    stats: {distinct: 10} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'O_20',
    vlType: TYPE.ORDINAL,
    type: PrimitiveType.STRING,
    stats: {distinct: 20} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'O_100',
    vlType: TYPE.ORDINAL,
    type: PrimitiveType.STRING,
    stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'N',
    vlType: TYPE.NOMINAL,
    type: PrimitiveType.STRING,
    stats: {distinct: 6} as any // HACK so that we don't have to define all summary properties
  },
  {
    name: 'N20',
    vlType: TYPE.NOMINAL,
    type: PrimitiveType.STRING,
    stats: {distinct: 20} as any // HACK so that we don't have to define all summary properties
  }
];

// make sure binStats isn't undefined
for (const fieldSchema of fixtures) {
  fieldSchema.binStats = {};
}

export const schema = new Schema({fields: fixtures});
