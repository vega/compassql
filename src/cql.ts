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
import * as cqlQuery from './query/query';
import {query as queryFn} from './query/query';

import * as cqlEncodingQuery from './query/encoding';
import * as cqlStringifyQuery from './query/shorthand';
import * as cqlSpecQuery from './query/spec';
import * as cqlTransformQuery from './query/transform';

export const query = extend(queryFn, cqlQuery, cqlEncodingQuery, cqlStringifyQuery, cqlSpecQuery, cqlTransformQuery);

import * as enumspec from './enumspec';
export const enumSpec = {
  isEnumSpec: enumspec.isEnumSpec
};

export import ranking = require('./ranking/ranking');
export import schema = require('./schema');
export import util = require('./util');
