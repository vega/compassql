export const version = '__VERSION__';
import * as cqlGenerate from './generate';
import * as cqlModel from './model';
import * as cqlNest from './nest';
import * as cqlProperty from './property';
import * as cqlQuery from './query';
import queryFn from './query';
import * as cqlRanking from './ranking/ranking';
import * as cqlSchema from './schema';
import * as cqlStats from './stats';
import * as cqlUtil from './util';
import {extend} from './util';

export const generate = cqlGenerate.generate;
export const model = cqlModel;
export const nest = cqlNest;
export const property = cqlProperty;
// we can call cql.query() as method, or access other methods inside cql.query
export const query = extend(queryFn, cqlQuery);
export const ranking = cqlRanking;
export const schema = cqlSchema;
export const stats = cqlStats;
export const util = cqlUtil;
