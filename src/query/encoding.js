"use strict";
var type_1 = require("vega-lite/src/type");
var type_2 = require("vega-lite/src/compile/scale/type");
var wildcard_1 = require("../wildcard");
var util_1 = require("../util");
function isDimension(encQ) {
    return util_1.contains([type_1.Type.NOMINAL, type_1.Type.ORDINAL], encQ.type) ||
        (!wildcard_1.isWildcard(encQ.bin) && !!encQ.bin) ||
        (!wildcard_1.isWildcard(encQ.timeUnit) && !!encQ.timeUnit); // surely T type
}
exports.isDimension = isDimension;
function isMeasure(encQ) {
    return (encQ.type === type_1.Type.QUANTITATIVE && !encQ.bin) ||
        (encQ.type === type_1.Type.TEMPORAL && !encQ.timeUnit);
}
exports.isMeasure = isMeasure;
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */
function scaleType(encQ) {
    var scale = encQ.scale === true || encQ.scale === wildcard_1.SHORT_WILDCARD ? {} : encQ.scale || {};
    var type = encQ.type;
    var channel = encQ.channel;
    var timeUnit = encQ.timeUnit;
    // HACK: All of markType, hasTopLevelSize, and scaleConfig only affect
    // sub-type of ordinal to quantitative scales (point or band)
    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
    // Thus, instead of making this method requiring the global mark and topLevelSize,
    // we will just call it with mark = undefined and hasTopLevelSize = false.
    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
    var markType = undefined;
    var hasTopLevelSize = false;
    var scaleConfig = {};
    if (wildcard_1.isWildcard(scale.type) || wildcard_1.isWildcard(type) || wildcard_1.isWildcard(channel)) {
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
    return type_2.default(scale.type, type, channel, timeUnit, markType, hasTopLevelSize, rangeStep, scaleConfig);
}
exports.scaleType = scaleType;
//# sourceMappingURL=encoding.js.map