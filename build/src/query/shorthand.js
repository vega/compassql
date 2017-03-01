"use strict";
var aggregate_1 = require("vega-lite/build/src/aggregate");
var channel_1 = require("vega-lite/build/src/channel");
var timeunit_1 = require("vega-lite/build/src/timeunit");
var type_1 = require("vega-lite/build/src/type");
var util_1 = require("datalib/src/util");
var encoding_1 = require("./encoding");
var spec_1 = require("./spec");
var wildcard_1 = require("../wildcard");
var property_1 = require("../property");
var propindex_1 = require("../propindex");
var util_2 = require("../util");
function getReplacerIndex(replaceIndex) {
    return replaceIndex.map(function (r) { return getReplacer(r); });
}
exports.getReplacerIndex = getReplacerIndex;
function getReplacer(replace) {
    return function (s) {
        if (replace[s] !== undefined) {
            return replace[s];
        }
        return s;
    };
}
exports.getReplacer = getReplacer;
function value(v, replacer) {
    if (wildcard_1.isWildcard(v)) {
        // Return the enum array if it's a full wildcard, or just return SHORT_WILDCARD for short ones.
        if (!wildcard_1.isShortWildcard(v) && v.enum) {
            return wildcard_1.SHORT_WILDCARD + JSON.stringify(v.enum);
        }
        else {
            return wildcard_1.SHORT_WILDCARD;
        }
    }
    if (replacer) {
        return replacer(v);
    }
    return v;
}
exports.value = value;
function replace(v, replacer) {
    if (replacer) {
        return replacer(v);
    }
    return v;
}
exports.replace = replace;
exports.REPLACE_NONE = new propindex_1.PropIndex();
exports.INCLUDE_ALL = 
// FIXME: remove manual STACK, FILTER, CALCULATE concat once we really support enumerating it.
property_1.DEFAULT_PROP_PRECEDENCE
    .concat(property_1.SORT_PROPS, [property_1.Property.CALCULATE, property_1.Property.FILTER, property_1.Property.FILTERINVALID, property_1.Property.STACK])
    .reduce(function (pi, prop) { return pi.set(prop, true); }, new propindex_1.PropIndex());
function vlSpec(vlspec, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = exports.REPLACE_NONE; }
    var specQ = spec_1.fromSpec(vlspec);
    return spec(specQ, include, replace);
}
exports.vlSpec = vlSpec;
exports.PROPERTY_SUPPORTED_CHANNELS = {
    axis: { x: true, y: true, row: true, column: true },
    legend: { color: true, opacity: true, size: true, shape: true },
    scale: { x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true },
    sort: { x: true, y: true, path: true, order: true }
};
/**
 * Returns a shorthand for a spec query
 * @param specQ a spec query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function spec(specQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = exports.REPLACE_NONE; }
    var parts = [];
    if (include.get(property_1.Property.MARK)) {
        parts.push(value(specQ.mark, replace.get(property_1.Property.MARK)));
    }
    if (specQ.transform) {
        if (include.get(property_1.Property.CALCULATE)) {
            if (specQ.transform.calculate !== undefined) {
                parts.push('calculate:' + calculate(specQ.transform.calculate));
            }
        }
        if (include.get(property_1.Property.FILTER)) {
            if (specQ.transform.filter !== undefined) {
                parts.push('filter:' + JSON.stringify(specQ.transform.filter));
            }
        }
        if (include.get(property_1.Property.FILTERINVALID)) {
            if (specQ.transform.filterInvalid !== undefined) {
                parts.push('filterInvalid:' + specQ.transform.filterInvalid);
            }
        }
    }
    // TODO: extract this to its own stack method
    if (include.get(property_1.Property.STACK)) {
        var _stack = spec_1.stack(specQ);
        if (_stack) {
            // TODO: Refactor this once we have child stack property.
            // Exclude type since we don't care about type in stack
            var includeExceptType = include.duplicate().set('type', false);
            var field = fieldDef(_stack.fieldEncQ, includeExceptType, replace);
            var groupby = fieldDef(_stack.groupByEncQ, includeExceptType, replace);
            parts.push('stack={field:' + field + ',' +
                (groupby ? 'by:' + groupby + ',' : '') +
                'offset:' + _stack.offset + '}');
        }
    }
    if (specQ.encodings) {
        var encodings = specQ.encodings.reduce(function (encQs, encQ) {
            // Exclude encoding mapping with autoCount=false as they are basically disabled.
            if (encoding_1.isFieldQuery(encQ) && encQ.autoCount !== false) {
                var str = encoding(encQ, include, replace);
                if (str) {
                    encQs.push(str);
                }
            }
            return encQs;
        }, [])
            .sort() // sort at the end to ignore order
            .join('|');
        if (encodings) {
            parts.push(encodings);
        }
    }
    return parts.join('|');
}
exports.spec = spec;
function calculate(formulaArr) {
    return JSON.stringify(formulaArr.reduce(function (m, calculateItem) {
        m[calculateItem.as] = calculateItem.expr;
        return m;
    }, {}));
}
exports.calculate = calculate;
/**
 * Returns a shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function encoding(encQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = exports.REPLACE_NONE; }
    var parts = [];
    if (include.get(property_1.Property.CHANNEL)) {
        parts.push(value(encQ.channel, replace.get(property_1.Property.CHANNEL)));
    }
    if (encoding_1.isFieldQuery(encQ)) {
        var fieldDefStr = fieldDef(encQ, include, replace);
        if (fieldDefStr) {
            parts.push(fieldDefStr);
        }
    }
    else if (encoding_1.isValueQuery(encQ)) {
        parts.push(encQ.value);
    }
    return parts.join(':');
}
exports.encoding = encoding;
/**
 * Returns a field definition shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function fieldDef(fieldQ, include, replacer) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replacer === void 0) { replacer = exports.REPLACE_NONE; }
    if (include.get(property_1.Property.AGGREGATE) && fieldQ.autoCount === false) {
        return '-';
    }
    var fn = func(fieldQ, include, replacer);
    var props = fieldDefProps(fieldQ, include, replacer);
    // field
    var fieldAndParams = include.get('field') ? value(fieldQ.field || '*', replacer.get('field')) : '...';
    // type
    if (include.get(property_1.Property.TYPE)) {
        if (wildcard_1.isWildcard(fieldQ.type)) {
            fieldAndParams += ',' + value(fieldQ.type, replacer.get(property_1.Property.TYPE));
        }
        else {
            var typeShort = ((fieldQ.type || type_1.Type.QUANTITATIVE) + '').substr(0, 1);
            fieldAndParams += ',' + value(typeShort, replacer.get(property_1.Property.TYPE));
        }
    }
    // encoding properties
    fieldAndParams += props.map(function (p) {
        var val = p.value instanceof Array ? '[' + p.value + ']' : p.value;
        return ',' + p.key + '=' + val;
    }).join('');
    if (fn) {
        var fnPrefix = util_1.isString(fn) ? fn : wildcard_1.SHORT_WILDCARD +
            (util_2.keys(fn).length > 0 ? JSON.stringify(fn) : '');
        return fnPrefix + '(' + fieldAndParams + ')';
    }
    return fieldAndParams;
}
exports.fieldDef = fieldDef;
/**
 * Return function part of
 */
function func(fieldQ, include, replacer) {
    if (include.get(property_1.Property.AGGREGATE) && fieldQ.aggregate && !wildcard_1.isWildcard(fieldQ.aggregate)) {
        return replace(fieldQ.aggregate, replacer.get(property_1.Property.AGGREGATE));
    }
    else if (include.get(property_1.Property.AGGREGATE) && fieldQ.autoCount && !wildcard_1.isWildcard(fieldQ.autoCount)) {
        // autoCount is considered a part of aggregate
        return replace('count', replacer.get(property_1.Property.AGGREGATE));
        ;
    }
    else if (include.get(property_1.Property.TIMEUNIT) && fieldQ.timeUnit && !wildcard_1.isWildcard(fieldQ.timeUnit)) {
        return replace(fieldQ.timeUnit, replacer.get(property_1.Property.TIMEUNIT));
    }
    else if (include.get(property_1.Property.BIN) && fieldQ.bin && !wildcard_1.isWildcard(fieldQ.bin)) {
        return 'bin';
    }
    else {
        var fn = null;
        for (var _i = 0, _a = [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN]; _i < _a.length; _i++) {
            var prop = _a[_i];
            var val = fieldQ[prop];
            if (include.get(prop) && fieldQ[prop] && wildcard_1.isWildcard(val)) {
                // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_WILDCARD
                fn = fn || {};
                fn[prop] = wildcard_1.isShortWildcard(val) ? val : val.enum;
            }
        }
        if (fn && fieldQ.hasFn) {
            fn.hasFn = true;
        }
        return fn;
    }
}
/**
 * Return key-value of parameters of field defs
 */
function fieldDefProps(fieldQ, include, replacer) {
    /** Encoding properties e.g., Scale, Axis, Legend */
    var props = [];
    // Parameters of function such as bin will be just top-level properties
    if (!util_2.isBoolean(fieldQ.bin) && !wildcard_1.isShortWildcard(fieldQ.bin)) {
        var bin = fieldQ.bin;
        for (var child in bin) {
            var prop = property_1.getEncodingNestedProp('bin', child);
            if (prop && include.get(prop) && bin[child] !== undefined) {
                props.push({
                    key: child,
                    value: value(bin[child], replacer.get(prop))
                });
            }
        }
        // Sort to make sure that parameter are ordered consistently
        props.sort(function (a, b) { return a.key.localeCompare(b.key); });
    }
    for (var _i = 0, _a = [property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND]; _i < _a.length; _i++) {
        var parent_1 = _a[_i];
        if (!wildcard_1.isWildcard(fieldQ.channel) && !exports.PROPERTY_SUPPORTED_CHANNELS[parent_1][fieldQ.channel]) {
            continue;
        }
        if (include.get(parent_1) && fieldQ[parent_1] !== undefined) {
            var parentValue = fieldQ[parent_1];
            if (util_2.isBoolean(parentValue) || parentValue === null) {
                // `scale`, `axis`, `legend` can be false/null.
                props.push({
                    key: parent_1 + '',
                    value: parentValue || false // return true or false (false if null)
                });
            }
            else if (util_1.isString(parentValue)) {
                // `sort` can be a string (ascending/descending).
                props.push({
                    key: parent_1 + '',
                    value: replace(JSON.stringify(parentValue), replacer.get(parent_1))
                });
            }
            else {
                var nestedPropChildren = [];
                for (var child in parentValue) {
                    var nestedProp = property_1.getEncodingNestedProp(parent_1, child);
                    if (nestedProp && include.get(nestedProp) && parentValue[child] !== undefined) {
                        nestedPropChildren.push({
                            key: child,
                            value: value(parentValue[child], replacer.get(nestedProp))
                        });
                    }
                }
                if (nestedPropChildren.length > 0) {
                    var nestedPropObject = nestedPropChildren.sort(function (a, b) { return a.key.localeCompare(b.key); })
                        .reduce(function (o, item) {
                        o[item.key] = item.value;
                        return o;
                    }, {});
                    // Sort to make sure that parameter are ordered consistently
                    props.push({
                        key: parent_1 + '',
                        value: JSON.stringify(nestedPropObject)
                    });
                }
            }
        }
    }
    return props;
}
var CHANNEL_INDEX = util_1.toMap(channel_1.CHANNELS);
var AGGREGATE_OP_INDEX = util_1.toMap(aggregate_1.AGGREGATE_OPS);
var SINGLE_TIMEUNIT_INDEX = util_1.toMap(timeunit_1.SINGLE_TIMEUNITS);
var MULTI_TIMEUNIT_INDEX = util_1.toMap(timeunit_1.MULTI_TIMEUNITS);
function parse(shorthand) {
    // TODO(https://github.com/uwdata/compassql/issues/259):
    // Do not split directly, but use an upgraded version of `getClosingBraceIndex()`
    var splitShorthand = shorthand.split('|');
    var specQ = { mark: splitShorthand[0], encodings: [] };
    for (var i = 1; i < splitShorthand.length; i++) {
        var part = splitShorthand[i];
        var splitPart = splitWithTail(part, ':', 1);
        var splitPartKey = splitPart[0];
        var splitPartValue = splitPart[1];
        if (CHANNEL_INDEX[splitPartKey] || splitPartKey === '?') {
            var encQ = shorthandParser.encoding(splitPartKey, splitPartValue);
            specQ.encodings.push(encQ);
            continue;
        }
        if (splitPartKey === 'calculate') {
            specQ.transform = specQ.transform || {};
            var calculate_1 = [];
            var fieldExprMapping = JSON.parse(splitPartValue);
            for (var field in fieldExprMapping) {
                calculate_1.push({ expr: fieldExprMapping[field], as: field });
            }
            specQ.transform.calculate = calculate_1;
            continue;
        }
        if (splitPartKey === 'filter') {
            specQ.transform = specQ.transform || {};
            specQ.transform.filter = JSON.parse(splitPartValue);
            continue;
        }
        if (splitPartKey === 'filterInvalid') {
            specQ.transform = specQ.transform || {};
            specQ.transform.filterInvalid = JSON.parse(splitPartValue);
            continue;
        }
    }
    return specQ;
}
exports.parse = parse;
/**
 * Split a string n times into substrings with the specified delimiter and return them as an array.
 * @param str The string to be split
 * @param delim The delimiter string used to separate the string
 * @param number The value used to determine how many times the string is split
 */
function splitWithTail(str, delim, count) {
    var result = [];
    var lastIndex = 0;
    for (var i = 0; i < count; i++) {
        var indexOfDelim = str.indexOf(delim, lastIndex);
        if (indexOfDelim !== -1) {
            result.push(str.substring(lastIndex, indexOfDelim));
            lastIndex = indexOfDelim + 1;
        }
        else {
            break;
        }
    }
    result.push(str.substr(lastIndex));
    // If the specified count is greater than the number of delimiters that exist in the string,
    // an empty string will be pushed count minus number of delimiter occurence times.
    if (result.length !== count + 1) {
        while (result.length !== count + 1) {
            result.push('');
        }
    }
    return result;
}
exports.splitWithTail = splitWithTail;
var shorthandParser;
(function (shorthandParser) {
    function encoding(channel, fieldDefShorthand) {
        var encQ = { channel: channel };
        if (fieldDefShorthand.indexOf('(') !== -1) {
            encQ = fn(encQ, fieldDefShorthand);
        }
        else {
            encQ = rawFieldDef(encQ, splitWithTail(fieldDefShorthand, ',', 2));
        }
        return encQ;
    }
    shorthandParser.encoding = encoding;
    function rawFieldDef(fieldQ, fieldDefPart) {
        fieldQ.field = fieldDefPart[0];
        fieldQ.type = type_1.getFullName(fieldDefPart[1].toUpperCase()) || '?';
        var partParams = fieldDefPart[2];
        var closingBraceIndex = 0;
        var i = 0;
        while (i < partParams.length) {
            var propEqualSignIndex = partParams.indexOf('=', i);
            var parsedValue = void 0;
            if (propEqualSignIndex !== -1) {
                var prop = partParams.substring(i, propEqualSignIndex);
                if (partParams[i + prop.length + 1] === '{') {
                    var openingBraceIndex = i + prop.length + 1;
                    closingBraceIndex = getClosingIndex(openingBraceIndex, partParams, '}');
                    var value_1 = partParams.substring(openingBraceIndex, closingBraceIndex + 1);
                    parsedValue = JSON.parse(value_1);
                    // index after next comma
                    i = closingBraceIndex + 2;
                }
                else if (partParams[i + prop.length + 1] === '[') {
                    // find closing square bracket
                    var openingBracketIndex = i + prop.length + 1;
                    var closingBracketIndex = getClosingIndex(openingBracketIndex, partParams, ']');
                    var value_2 = partParams.substring(openingBracketIndex, closingBracketIndex + 1);
                    parsedValue = JSON.parse(value_2);
                    // index after next comma
                    i = closingBracketIndex + 2;
                }
                else {
                    var propIndex = i;
                    // Substring until the next comma (or end of the string)
                    var nextCommaIndex = partParams.indexOf(',', i + prop.length);
                    if (nextCommaIndex === -1) {
                        nextCommaIndex = partParams.length;
                    }
                    // index after next comma
                    i = nextCommaIndex + 1;
                    parsedValue = JSON.parse(partParams.substring(propIndex + prop.length + 1, nextCommaIndex));
                }
                if (property_1.hasNestedProperty(prop)) {
                    fieldQ[prop] = parsedValue;
                }
                else {
                    // prop is a property of the aggregation function such as bin
                    fieldQ.bin[prop] = parsedValue;
                }
            }
            else {
                // something is wrong with the format of the partParams
                // exits loop if don't have then infintie loop
                break;
            }
        }
        return fieldQ;
    }
    shorthandParser.rawFieldDef = rawFieldDef;
    function getClosingIndex(openingBraceIndex, str, closingChar) {
        for (var i = openingBraceIndex; i < str.length; i++) {
            if (str[i] === closingChar) {
                return i;
            }
        }
    }
    shorthandParser.getClosingIndex = getClosingIndex;
    function fn(fieldQ, fieldDefShorthand) {
        // Aggregate, Bin, TimeUnit as wildcard case
        if (fieldDefShorthand[0] === '?') {
            var closingBraceIndex = getClosingIndex(1, fieldDefShorthand, '}');
            var fnEnumIndex = JSON.parse(fieldDefShorthand.substring(1, closingBraceIndex + 1));
            for (var encodingProperty in fnEnumIndex) {
                if (util_2.isArray(fnEnumIndex[encodingProperty])) {
                    fieldQ[encodingProperty] = { enum: fnEnumIndex[encodingProperty] };
                }
                else {
                    fieldQ[encodingProperty] = fnEnumIndex[encodingProperty];
                }
            }
            return rawFieldDef(fieldQ, splitWithTail(fieldDefShorthand.substring(closingBraceIndex + 2, fieldDefShorthand.length - 1), ',', 2));
        }
        else {
            var func_1 = fieldDefShorthand.substring(0, fieldDefShorthand.indexOf('('));
            var insideFn = fieldDefShorthand.substring(func_1.length + 1, fieldDefShorthand.length - 1);
            var insideFnParts = splitWithTail(insideFn, ',', 2);
            if (AGGREGATE_OP_INDEX[func_1]) {
                fieldQ.aggregate = func_1;
                return rawFieldDef(fieldQ, insideFnParts);
            }
            else if (MULTI_TIMEUNIT_INDEX[func_1] || SINGLE_TIMEUNIT_INDEX[func_1]) {
                fieldQ.timeUnit = func_1;
                return rawFieldDef(fieldQ, insideFnParts);
            }
            else if (func_1 === 'bin') {
                fieldQ.bin = {};
                return rawFieldDef(fieldQ, insideFnParts);
            }
        }
    }
    shorthandParser.fn = fn;
})(shorthandParser = exports.shorthandParser || (exports.shorthandParser = {}));
//# sourceMappingURL=shorthand.js.map