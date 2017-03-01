"use strict";
var util_1 = require("../util");
/**
 * Normalize the non-nested version of the query to a standardize nested
 */
function normalize(q) {
    if (q.groupBy) {
        var nest = {
            groupBy: q.groupBy
        };
        if (q.orderBy) {
            nest.orderGroupBy = q.orderBy;
        }
        var normalizedQ = {
            spec: util_1.duplicate(q.spec),
            nest: [nest],
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
//# sourceMappingURL=normalize.js.map