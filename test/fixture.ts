import {Type} from 'vega-lite/build/src/type';

import {Schema, FieldSchema, DataType} from '../src/schema';

const fixtures: FieldSchema[] = [{
  name: 'Q',
  vlType: Type.QUANTITATIVE,
  type: DataType.NUMBER,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  name: 'Q1',
  vlType: Type.QUANTITATIVE,
  type: DataType.NUMBER,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  name: 'Q2',
  vlType: Type.QUANTITATIVE,
  type: DataType.NUMBER,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  name: 'T',
  vlType: Type.TEMPORAL,
  type: DataType.DATETIME,
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
},{
  name: 'T1',
  vlType: Type.TEMPORAL,
  type: DataType.DATETIME,
  stats: {distinct: 100} as any, // HACK so that we don't have to define all summary properties
  timeStats: {year: {distinct: 5}, month: {distinct: 12}, day: {distinct: 5}} as any
},{
  name: 'O',
  vlType: Type.ORDINAL,
  type: DataType.STRING,
  stats: {distinct: 6} as any // HACK so that we don't have to define all summary properties
},{
  name: 'O_10',
  vlType: Type.ORDINAL,
  type: DataType.STRING,
  stats: {distinct: 10} as any // HACK so that we don't have to define all summary properties
},{
  name: 'O_20',
  vlType: Type.ORDINAL,
  type: DataType.STRING,
  stats: {distinct: 20} as any // HACK so that we don't have to define all summary properties
},{
  name: 'O_100',
  vlType: Type.ORDINAL,
  type: DataType.STRING,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  name: 'N',
  vlType: Type.NOMINAL,
  type: DataType.STRING,
  stats: {distinct: 6} as any // HACK so that we don't have to define all summary properties
},{
  name: 'N20',
  vlType: Type.NOMINAL,
  type: DataType.STRING,
  stats: {distinct: 20} as any // HACK so that we don't have to define all summary properties
}];

// make sure binStats isn't undefined
for (let fieldSchema of fixtures) {
  fieldSchema.binStats = {};
}

export const schema = new Schema(fixtures);
