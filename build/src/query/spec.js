"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("vega-lite/build/src/channel");
var wildcard_1 = require("../wildcard");
var property_1 = require("../property");
var util_1 = require("../util");
var encoding_1 = require("./encoding");
var util_2 = require("datalib/src/util");
/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
function fromSpec(spec) {
    return util_1.extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, {
        mark: spec.mark,
        encodings: util_1.keys(spec.encoding).map(function (channel) {
            var encQ = { channel: channel };
            var channelDef = spec.encoding[channel];
            for (var prop in channelDef) {
                if (property_1.isEncodingTopLevelProperty(prop) && channelDef[prop] !== undefined) {
                    // Currently bin, scale, axis, legend only support boolean, but not null.
                    // Therefore convert null to false.
                    if (util_1.contains(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
                        encQ[prop] = false;
                    }
                    else {
                        encQ[prop] = channelDef[prop];
                    }
                }
            }
            if (encoding_1.isFieldQuery(encQ) && encQ.aggregate === 'count' && !encQ.field) {
                encQ.field = '*';
            }
            return encQ;
        })
    }, spec.config ? { config: spec.config } : {});
}
exports.fromSpec = fromSpec;
function isAggregate(specQ) {
    return util_1.some(specQ.encodings, function (encQ) {
        return (encoding_1.isFieldQuery(encQ) && !wildcard_1.isWildcard(encQ.aggregate) && !!encQ.aggregate) || encoding_1.isEnabledAutoCountQuery(encQ);
    });
}
exports.isAggregate = isAggregate;
/**
 * @return the stack offset type for the specQuery
 */
function stack(specQ) {
    var config = specQ.config;
    var stacked = config ? config.stack : undefined;
    // Should not have stack explicitly disabled
    if (util_1.contains(['none', null, false], stacked)) {
        return null;
    }
    // Should have stackable mark
    if (!util_1.contains(['bar', 'area'], specQ.mark)) {
        return null;
    }
    // Should be aggregate plot
    if (!isAggregate(specQ)) {
        return null;
    }
    var stackBy = specQ.encodings.reduce(function (sc, encQ) {
        if (util_1.contains(channel_1.NONSPATIAL_CHANNELS, encQ.channel) && (encoding_1.isValueQuery(encQ) || (encoding_1.isFieldQuery(encQ) && !encQ.aggregate))) {
            sc.push({
                channel: encQ.channel,
                fieldDef: encQ
            });
        }
        return sc;
    }, []);
    if (stackBy.length === 0) {
        return null;
    }
    // Has only one aggregate axis
    var xEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.X ? encQ : null);
    }, null);
    var yEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.Y ? encQ : null);
    }, null);
    // TODO(akshatsh): Check if autoCount undef is ok
    var xIsAggregate = (encoding_1.isFieldQuery(xEncQ) && !!xEncQ.aggregate) || (encoding_1.isAutoCountQuery(xEncQ) && !!xEncQ.autoCount);
    var yIsAggregate = (encoding_1.isFieldQuery(yEncQ) && !!yEncQ.aggregate) || (encoding_1.isAutoCountQuery(yEncQ) && !!yEncQ.autoCount);
    if (xIsAggregate !== yIsAggregate) {
        return {
            groupbyChannel: xIsAggregate ? (!!yEncQ ? channel_1.Y : null) : (!!xEncQ ? channel_1.X : null),
            groupByEncQ: xIsAggregate ? yEncQ : xEncQ,
            fieldChannel: xIsAggregate ? channel_1.X : channel_1.Y,
            fieldEncQ: xIsAggregate ? xEncQ : yEncQ,
            impute: util_1.contains(['area', 'line'], specQ.mark),
            stackBy: stackBy,
            offset: stacked || 'zero'
        };
    }
    return null;
}
exports.stack = stack;
function hasWildcard(specQ, opt) {
    if (opt === void 0) { opt = {}; }
    var exclude = opt.exclude ? util_2.toMap(opt.exclude.map(property_1.toKey)) : {};
    if (wildcard_1.isWildcard(specQ.mark) && !exclude['mark']) {
        return true;
    }
    for (var _i = 0, _a = specQ.encodings; _i < _a.length; _i++) {
        var encQ = _a[_i];
        // TODO: implement more efficiently, just check only properties of encQ
        for (var key in encQ) {
            var parentProp = key;
            if (encQ.hasOwnProperty(parentProp) && property_1.isEncodingTopLevelProperty(parentProp)) {
                if (wildcard_1.isWildcard(encQ[parentProp]) && !exclude[parentProp]) {
                    return true;
                }
                var propObj = encQ[parentProp];
                for (var childProp in propObj) {
                    if (propObj.hasOwnProperty(childProp) && !util_1.contains(['enum', 'name'], childProp)) {
                        var prop = {
                            parent: parentProp,
                            child: childProp
                        };
                        if (wildcard_1.isWildcard(propObj[childProp]) && !exclude[property_1.toKey(prop)]) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}
exports.hasWildcard = hasWildcard;
//# sourceMappingURL=spec.js.map