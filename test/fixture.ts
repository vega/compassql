import {Type} from 'vega-lite/src/type';

import {Schema, FieldSchema, PrimitiveType} from '../src/schema';
import {Stats, FieldStats} from '../src/stats';

type Fixture = FieldSchema & FieldStats;

const fixtures: Fixture[] = [{
  field: 'Q',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  cardinality: 100
},{
  field: 'Q1',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  cardinality: 100
},{
  field: 'Q2',
  type: Type.QUANTITATIVE,
  primitiveType: PrimitiveType.NUMBER,
  cardinality: 100
},{
  field: 'O',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  cardinality: 6
},{
  field: 'O_10',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  cardinality: 10
},{
  field: 'O_20',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  cardinality: 20
},{
  field: 'O_100',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  cardinality: 100
},{
  field: 'N',
  type: Type.ORDINAL,
  primitiveType: PrimitiveType.STRING,
  cardinality: 6
}];

export const schema = new Schema(fixtures);

export const stats = new Stats(fixtures);
