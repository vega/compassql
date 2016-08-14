import {Type} from 'vega-lite/src/type';

import {Schema, FieldSchema, PrimitiveType} from '../src/schema';

const fixtures: FieldSchema[] = [{
  field: 'Q',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  field: 'Q1',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  field: 'Q2',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  field: 'T',
  type: Type.TEMPORAL,
  primitiveType: PrimitiveType.DATE,
  stats: {distinct: 100} as any, // HACK so that we don't have to define all summary properties
  timeStats: {year: {distinct: 5}, month: {distinct: 12}, day: {distinct: 5}} as any
},{
  field: 'T1',
  type: Type.TEMPORAL,
  primitiveType: PrimitiveType.DATE,
  stats: {distinct: 100} as any, // HACK so that we don't have to define all summary properties
  timeStats: {year: {distinct: 5}, month: {distinct: 12}, day: {distinct: 5}} as any
},{
  field: 'O',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  stats: {distinct: 6} as any // HACK so that we don't have to define all summary properties
},{
  field: 'O_10',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  stats: {distinct: 10} as any // HACK so that we don't have to define all summary properties
},{
  field: 'O_20',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  stats: {distinct: 20} as any // HACK so that we don't have to define all summary properties
},{
  field: 'O_100',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  stats: {distinct: 100} as any // HACK so that we don't have to define all summary properties
},{
  field: 'N',
  type: Type.NOMINAL,
  primitiveType: PrimitiveType.STRING,
  stats: {distinct: 6} as any // HACK so that we don't have to define all summary properties
},{
  field: 'N20',
  type: Type.NOMINAL,
  primitiveType: PrimitiveType.STRING,
  stats: {distinct: 20} as any // HACK so that we don't have to define all summary properties
}];

// make sure binStats isn't undefined
for (let fieldSchema of fixtures) {
  fieldSchema.binStats = {};
}

export const schema = new Schema(fixtures);
