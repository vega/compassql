"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vlFieldDef = require("vega-lite/build/src/fielddef");
var type_1 = require("vega-lite/build/src/type");
var expandedtype_1 = require("./expandedtype");
var type_2 = require("vega-lite/build/src/compile/scale/type");
var wildcard_1 = require("../wildcard");
var property_1 = require("../property");
var shorthand_1 = require("./shorthand");
var util_1 = require("datalib/src/util");
function isValueQuery(encQ) {
    return encQ !== null && encQ !== undefined && encQ['value'] !== undefined;
}
exports.isValueQuery = isValueQuery;
function isFieldQuery(encQ) {
    return encQ !== null && encQ !== undefined && (encQ['field'] || encQ['aggregate'] === 'count');
}
exports.isFieldQuery = isFieldQuery;
function isAutoCountQuery(encQ) {
    return encQ !== null && encQ !== undefined && 'autoCount' in encQ;
}
exports.isAutoCountQuery = isAutoCountQuery;
function isDisabledAutoCountQuery(encQ) {
    return isAutoCountQuery(encQ) && encQ.autoCount === false;
}
exports.isDisabledAutoCountQuery = isDisabledAutoCountQuery;
function isEnabledAutoCountQuery(encQ) {
    return isAutoCountQuery(encQ) && encQ.autoCount === true;
}
exports.isEnabledAutoCountQuery = isEnabledAutoCountQuery;
var DEFAULT_PROPS = [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.FIELD, property_1.Property.TYPE, property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND, property_1.Property.STACK, property_1.Property.FORMAT];
function toEncoding(encQs, params) {
    var _a = params.wildcardMode, wildcardMode = _a === void 0 ? 'skip' : _a;
    var encoding = {};
    for (var _i = 0, encQs_1 = encQs; _i < encQs_1.length; _i++) {
        var encQ = encQs_1[_i];
        if (isDisabledAutoCountQuery(encQ)) {
            continue; // Do not include this in the output.
        }
        var channel = encQ.channel;
        // if channel is a wildcard, return null
        if (wildcard_1.isWildcard(channel)) {
            throw new Error('Cannot convert wildcard channel to a fixed channel');
        }
        var channelDef = isValueQuery(encQ) ? toValueDef(encQ) : toFieldDef(encQ, params);
        if (channelDef === null) {
            if (params.wildcardMode === 'null') {
                // contains invalid property (e.g., wildcard, thus cannot return a proper spec.)
                return null;
            }
            continue;
        }
        // Otherwise, we can set the channelDef
        encoding[channel] = channelDef;
    }
    return encoding;
}
exports.toEncoding = toEncoding;
function toValueDef(valueQ) {
    var value = valueQ.value;
    if (wildcard_1.isWildcard(value)) {
        return null;
    }
    return { value: value };
}
exports.toValueDef = toValueDef;
function toFieldDef(encQ, params) {
    if (params === void 0) { params = {}; }
    var _a = params.props, props = _a === void 0 ? DEFAULT_PROPS : _a, schema = params.schema, _b = params.wildcardMode, wildcardMode = _b === void 0 ? 'skip' : _b;
    if (isFieldQuery(encQ)) {
        var fieldDef = {};
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            var encodingProperty = encQ[prop];
            if (wildcard_1.isWildcard(encodingProperty)) {
                if (wildcardMode === 'skip')
                    continue;
                return null;
            }
            if (encodingProperty !== undefined) {
                // if the channel supports this prop
                var isSupportedByChannel = (!shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop] || shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel]);
                if (!isSupportedByChannel) {
                    continue;
                }
                if (property_1.isEncodingNestedParent(prop) && util_1.isObject(encodingProperty)) {
                    encodingProperty = __assign({}, encodingProperty); // Make a shallow copy first
                    for (var childProp in encodingProperty) {
                        // ensure nested properties are not wildcard before assigning to field def
                        if (wildcard_1.isWildcard(encodingProperty[childProp])) {
                            if (wildcardMode === 'null') {
                                return null;
                            }
                            delete encodingProperty[childProp]; // skip
                        }
                    }
                }
                if (prop === 'bin' && encodingProperty === false) {
                    continue;
                }
                else if (prop === 'type' && encodingProperty === 'key') {
                    fieldDef.type = 'nominal';
                }
                else {
                    fieldDef[prop] = encodingProperty;
                }
            }
            if (prop === property_1.Property.SCALE && schema && encQ.type === type_1.Type.ORDINAL) {
                var scale = encQ.scale;
                var ordinalDomain = schema.fieldSchema(encQ.field).ordinalDomain;
                if (scale !== null && ordinalDomain) {
                    fieldDef[property_1.Property.SCALE] = __assign({ domain: ordinalDomain }, (util_1.isObject(scale) ? scale : {}));
                }
            }
        }
        return fieldDef;
    }
    else {
        if (encQ.autoCount === false) {
            throw new Error("Cannot convert {autoCount: false} into a field def");
        }
        else {
            return {
                aggregate: 'count',
                field: '*',
                type: 'quantitative'
            };
        }
    }
}
exports.toFieldDef = toFieldDef;
/**
 * Is a field query continuous field?
 * This method is applicable only for fieldQuery without wildcard
 */
function isContinuous(encQ) {
    if (isFieldQuery(encQ)) {
        return vlFieldDef.isContinuous(toFieldDef(encQ, { props: ['bin', 'timeUnit', 'field', 'type'] }));
    }
    return isAutoCountQuery(encQ);
}
exports.isContinuous = isContinuous;
function isMeasure(encQ) {
    if (isFieldQuery(encQ)) {
        return !isDimension(encQ) && encQ.type !== 'temporal';
    }
    return isAutoCountQuery(encQ);
}
exports.isMeasure = isMeasure;
/**
 * Is a field query discrete field?
 * This method is applicable only for fieldQuery without wildcard
 */
function isDimension(encQ) {
    if (isFieldQuery(encQ)) {
        var fieldDef = toFieldDef(encQ, { props: ['bin', 'timeUnit', 'type'] });
        return vlFieldDef.isDiscrete(fieldDef) || !!fieldDef.timeUnit;
    }
    return false;
}
exports.isDimension = isDimension;
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */
function scaleType(fieldQ) {
    var scale = fieldQ.scale === true || fieldQ.scale === wildcard_1.SHORT_WILDCARD ? {} : fieldQ.scale || {};
    var type = fieldQ.type, channel = fieldQ.channel, timeUnit = fieldQ.timeUnit, bin = fieldQ.bin;
    // HACK: All of markType, and scaleConfig only affect
    // sub-type of ordinal to quantitative scales (point or band)
    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
    // Thus, instead of making this method requiring the global mark,
    // we will just call it with mark = undefined .
    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
    var markType = undefined;
    var scaleConfig = {};
    if (wildcard_1.isWildcard(scale.type) || wildcard_1.isWildcard(type) || wildcard_1.isWildcard(channel) || wildcard_1.isWildcard(bin)) {
        return undefined;
    }
    // If scale type is specified, then use scale.type
    if (scale.type) {
        return scale.type;
    }
    // if type is fixed and it's not temporal, we can ignore time unit.
    if (type === 'temporal' && wildcard_1.isWildcard(timeUnit)) {
        return undefined;
    }
    // if type is fixed and it's not quantitative, we can ignore bin
    if (type === 'quantitative' && wildcard_1.isWildcard(bin)) {
        return undefined;
    }
    var vegaLiteType = type === expandedtype_1.ExpandedType.KEY ? 'nominal' : type;
    var fieldDef = { type: vegaLiteType, timeUnit: timeUnit, bin: bin };
    return type_2.scaleType(scale.type, channel, fieldDef, markType, scaleConfig);
}
exports.scaleType = scaleType;
//# sourceMappingURL=encoding.js.map