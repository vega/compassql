import {Type} from 'vega-lite/src/type';

import {Schema, FieldSchema, PrimitiveType} from '../src/schema';
import {Stats, FieldStats} from '../src/stats';

type Fixture = FieldSchema & FieldStats;

const fixtures: Fixture[] = [{
  field: 'Q',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  distinct: 100
},{
  field: 'Q1',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  distinct: 100
},{
  field: 'Q2',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  distinct: 100
},{
  field: 'T',
  type: Type.TEMPORAL,
  primitiveType: PrimitiveType.DATE,
  distinct: 100
},{
  field: 'O',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  distinct: 6
},{
  field: 'O_10',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  distinct: 10
},{
  field: 'O_20',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  distinct: 20
},{
  field: 'O_100',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  distinct: 100
},{
  field: 'N',
  type: Type.NOMINAL,
  primitiveType: PrimitiveType.STRING,
  distinct: 6
},{
  field: 'N20',
  type: Type.NOMINAL,
  primitiveType: PrimitiveType.STRING,
  distinct: 20
}];

export const schema = new Schema(fixtures);

export const stats = new Stats(fixtures);
