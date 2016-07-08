export const version = '__VERSION__';

import {extend} from './util';

export import constraint = require('./constraint/constraint');

export import enumerate = require('./enumerator');
export {generate} from './generate';
export import model = require('./model');
export import modelgroup = require('./modelgroup');
export import nest = require('./nest');
export import property = require('./property');

// Make it so that we can call cql.query() as method, or access other methods inside cql.query
import * as cqlQuery from './query';
import {query as queryFn} from './query';
export const query = extend(queryFn, cqlQuery);

// TODO(https://github.com/uwdata/compassql/issues/112): properly extract enumSpec from query
export const enumSpec = {
  isEnumSpec: cqlQuery.isEnumSpec
};

export import ranking = require('./ranking/ranking');
export import schema = require('./schema');
export import util = require('./util');
