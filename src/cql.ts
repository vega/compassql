export const version = '__VERSION__';
import * as cqlGenerate from './generate';
import * as cqlGroup from './group';
import * as cqlModel from './model';
import * as cqlProperty from './property';
import * as cqlQuery from './query';
import * as cqlSchema from './schema';
import * as cqlStats from './stats';
import * as cqlUtil from './util';

export const generate = cqlGenerate.generate;
export const group = cqlGroup;
export const model = cqlModel;
export const property = cqlProperty;
export const query = cqlQuery;
export const schema = cqlSchema;
export const stats = cqlStats;
export const util = cqlUtil;
