export const version = '__VERSION__';

import {extend} from './util';

export import config = require('./config');
export import constraint = require('./constraint/constraint');

export import enumerate = require('./enumerator');
export import enumSpec = require('./enumspec');
export {generate} from './generate';
export import model = require('./model');
export import nest = require('./nest');
export import property = require('./property');

// Make it so that we can call cql.query() as method, or access other methods inside cql.query
import * as cqlQuery from './query/query';
import {query as queryFn} from './query/query';

export const query = extend(queryFn, cqlQuery);

export import ranking = require('./ranking/ranking');
export import schema = require('./schema');
export import util = require('./util');
