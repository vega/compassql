"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vlFieldDef = require("vega-lite/build/src/fielddef");
var expandedtype_1 = require("./expandedtype");
var type_1 = require("vega-lite/build/src/compile/scale/type");
var wildcard_1 = require("../wildcard");
function isValueQuery(encQ) {
    return encQ !== null && encQ !== undefined && encQ['value'];
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
function toFieldDef(encQ, props) {
    if (props === void 0) { props = ['aggregate', 'bin', 'timeUnit', 'field', 'type']; }
    if (isFieldQuery(encQ)) {
        return props.reduce(function (fieldDef, prop) {
            var propValue = encQ[prop];
            if (wildcard_1.isWildcard(propValue)) {
                throw new Error("Cannot convert " + JSON.stringify(encQ) + " to fielddef: " + prop + " is wildcard");
            }
            else if (propValue !== undefined) {
                if (prop === 'type') {
                    fieldDef.type = propValue;
                }
                else {
                    fieldDef[prop] = propValue;
                }
            }
            return fieldDef;
        }, {});
    }
    else {
        if (encQ.autoCount === false) {
            throw new Error("Cannot convert {autoCount: false} into a field def");
        }
        else {
            return props.reduce(function (fieldDef, prop) {
                if (wildcard_1.isWildcard(encQ[prop])) {
                    throw new Error("Cannot convert " + JSON.stringify(encQ) + " to fielddef: " + prop + " is wildcard");
                }
                switch (prop) {
                    case 'type':
                        fieldDef.type = 'quantitative';
                        break;
                    case 'aggregate':
                        fieldDef.aggregate = 'count';
                        break;
                }
                return fieldDef;
            }, {});
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
        return vlFieldDef.isContinuous(toFieldDef(encQ, ['bin', 'timeUnit', 'field', 'type']));
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
        var fieldDef = toFieldDef(encQ, ['bin', 'timeUnit', 'field', 'type']);
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
    return type_1.scaleType(scale.type, channel, fieldDef, markType, scaleConfig);
}
exports.scaleType = scaleType;
//# sourceMappingURL=encoding.js.map