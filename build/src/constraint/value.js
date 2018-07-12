"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var property_1 = require("../property");
var propindex_1 = require("../propindex");
var util_1 = require("../util");
var base_1 = require("./base");
exports.VALUE_CONSTRAINTS = [
    {
        name: 'doesNotSupportConstantValue',
        description: 'row, column, x, y, order, and detail should not work with constant values.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (valueQ, _, __, ___) {
            return !(util_1.contains(['row', 'column', 'x', 'y', 'detail', 'order'], valueQ.channel));
        }
    }
].map(function (ec) { return new base_1.EncodingConstraintModel(ec); });
exports.VALUE_CONSTRAINT_INDEX = exports.VALUE_CONSTRAINTS.reduce(function (m, ec) {
    m[ec.name()] = ec;
    return m;
}, {});
exports.VALUE_CONSTRAINTS_BY_PROPERTY = exports.VALUE_CONSTRAINTS.reduce(function (index, c) {
    for (var _i = 0, _a = c.properties(); _i < _a.length; _i++) {
        var prop = _a[_i];
        index.set(prop, index.get(prop) || []);
        index.get(prop).push(c);
    }
    return index;
}, new propindex_1.PropIndex());
//# sourceMappingURL=value.js.map