"use strict";
var vlFieldDef = require("vega-lite/build/src/fielddef");
var type_1 = require("vega-lite/build/src/compile/scale/type");
var wildcard_1 = require("../wildcard");
function isValueQuery(encQ) {
    return encQ !== null && encQ !== undefined && encQ['value'];
}
exports.isValueQuery = isValueQuery;
function isFieldQuery(encQ) {
    return encQ !== null && encQ !== undefined && (encQ['field'] || 'autoCount' in encQ);
}
exports.isFieldQuery = isFieldQuery;
function toFieldDef(fieldQ, props) {
    if (props === void 0) { props = ['aggregate', 'autoCount', 'bin', 'timeUnit', 'field', 'type']; }
    return props.reduce(function (fieldDef, prop) {
        if (wildcard_1.isWildcard(fieldQ[prop])) {
            throw new Error("Cannot convert " + JSON.stringify(fieldQ) + " to fielddef: " + prop + " is wildcard");
        }
        else if (fieldQ[prop] !== undefined) {
            if (prop === 'autoCount') {
                if (fieldQ[prop]) {
                    fieldDef.aggregate = 'count';
                }
                else {
                    throw new Error("Cannot convert {autoCount: false} into a field def");
                }
            }
            else {
                fieldDef[prop] = fieldQ[prop];
            }
        }
        return fieldDef;
    }, {});
}
exports.toFieldDef = toFieldDef;
/**
 * Is a field query continuous field?
 * This method is applicable only for fieldQuery without wildcard
 */
function isContinuous(fieldQ) {
    return vlFieldDef.isContinuous(toFieldDef(fieldQ, ['bin', 'timeUnit', 'field', 'type']));
}
exports.isContinuous = isContinuous;
/**
 * Is a field query discrete field?
 * This method is applicable only for fieldQuery without wildcard
 */
function isDiscrete(fieldQ) {
    return vlFieldDef.isDiscrete(toFieldDef(fieldQ, ['bin', 'timeUnit', 'field', 'type']));
}
exports.isDiscrete = isDiscrete;
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */
function scaleType(fieldQ) {
    var scale = fieldQ.scale === true || fieldQ.scale === wildcard_1.SHORT_WILDCARD ? {} : fieldQ.scale || {};
    var type = fieldQ.type, channel = fieldQ.channel, timeUnit = fieldQ.timeUnit, bin = fieldQ.bin;
    // HACK: All of markType, hasTopLevelSize, and scaleConfig only affect
    // sub-type of ordinal to quantitative scales (point or band)
    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
    // Thus, instead of making this method requiring the global mark and topLevelSize,
    // we will just call it with mark = undefined and hasTopLevelSize = false.
    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
    var markType = undefined;
    var hasTopLevelSize = false;
    var scaleConfig = {};
    if (wildcard_1.isWildcard(scale.type) || wildcard_1.isWildcard(type) || wildcard_1.isWildcard(channel) || wildcard_1.isWildcard(bin)) {
        return undefined;
    }
    var rangeStep = undefined;
    // Note: Range step currently does not matter as we don't pass mark into compileScaleType anyway.
    // However, if we pass mark, we could use a rule like the following.
    // I also have few test cases listed in encoding.test.ts
    // if (channel === 'x' || channel === 'y') {
    //   if (isWildcard(scale.rangeStep)) {
    //     if (isShortWildcard(scale.rangeStep)) {
    //       return undefined;
    //     } else if (scale.rangeStep.enum) {
    //       const e = scale.rangeStep.enum;
    //       // if enumerated value contains enum then we can't be sure
    //       if (contains(e, undefined) || contains(e, null)) {
    //         return undefined;
    //       }
    //       rangeStep = e[0];
    //     }
    //   }
    // }
    // if type is fixed and it's not temporal, we can ignore time unit.
    if (type === 'temporal' && wildcard_1.isWildcard(timeUnit)) {
        return undefined;
    }
    // if type is fixed and it's not quantitative, we can ignore bin
    if (type === 'quantitative' && wildcard_1.isWildcard(bin)) {
        return undefined;
    }
    return type_1.default(scale.type, channel, { type: type, timeUnit: timeUnit, bin: bin }, markType, hasTopLevelSize, rangeStep, scaleConfig);
}
exports.scaleType = scaleType;
//# sourceMappingURL=encoding.js.map