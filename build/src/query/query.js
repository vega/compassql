"use strict";
var config_1 = require("../config");
var generate_1 = require("../generate");
var nest_1 = require("../nest");
var ranking_1 = require("../ranking/ranking");
var util_1 = require("../util");
exports.encoding = require("./encoding");
exports.groupBy = require("./groupby");
exports.shorthand = require("./shorthand");
exports.spec = require("./spec");
exports.transform = require("./transform");
function query(q, schema, config) {
    // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
    //    and merge config with the following precedence
    //    query.config > config > DEFAULT_QUERY_CONFIG
    q = util_1.extend({}, normalize(q), {
        config: util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, config, q.config)
    });
    // 2. Generate
    var answerSet = generate_1.generate(q.spec, schema, q.config);
    var nestedAnswerSet = nest_1.nest(answerSet, q);
    var result = ranking_1.rank(nestedAnswerSet, q, schema, 0);
    return {
        query: q,
        result: result
    };
}
exports.query = query;
/**
 * Normalize the non-nested version of the query to a standardize nested
 */
function normalize(q) {
    if (q.groupBy) {
        var nest_2 = {
            groupBy: q.groupBy
        };
        if (q.orderBy) {
            nest_2.orderGroupBy = q.orderBy;
        }
        var normalizedQ = {
            spec: util_1.duplicate(q.spec),
            nest: [nest_2],
        };
        if (q.chooseBy) {
            normalizedQ.chooseBy = q.chooseBy;
        }
        if (q.config) {
            normalizedQ.config = q.config;
        }
        return normalizedQ;
    }
    return util_1.duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
}
exports.normalize = normalize;
//# sourceMappingURL=query.js.map