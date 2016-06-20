export const version = '__VERSION__';

import * as cqlQuery from './query';
import queryFn from './query';
import {extend} from './util';

export import constraint = require('./constraint/constraint');
export import enumerate = require('./enumerator');
export import generate = require('./generate');
export import model = require('./model');
export import nest = require('./nest');
export import property = require('./property');
// we can call cql.query() as method, or access other methods inside cql.query
export const query = extend(queryFn, cqlQuery);
export import ranking = require('./ranking/ranking');
export import schema = require('./schema');
export import stats = require('./stats');
export import util = require('./util');
