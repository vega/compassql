import { isObject } from 'datalib/src/util';
import * as vlChannelDef from 'vega-lite/build/src/channeldef';
import { scaleType as compileScaleType } from 'vega-lite/build/src/compile/scale/type';
import * as TYPE from 'vega-lite/build/src/type';
import { isEncodingNestedParent, Property } from '../property';
import { isWildcard, SHORT_WILDCARD } from '../wildcard';
import { ExpandedType } from './expandedtype';
import { PROPERTY_SUPPORTED_CHANNELS } from './shorthand';
export function isValueQuery(encQ) {
    return encQ !== null && encQ !== undefined && encQ['value'] !== undefined;
}
export function isFieldQuery(encQ) {
    return encQ !== null && encQ !== undefined && (encQ['field'] || encQ['aggregate'] === 'count');
}
export function isAutoCountQuery(encQ) {
    return encQ !== null && encQ !== undefined && 'autoCount' in encQ;
}
export function isDisabledAutoCountQuery(encQ) {
    return isAutoCountQuery(encQ) && encQ.autoCount === false;
}
export function isEnabledAutoCountQuery(encQ) {
    return isAutoCountQuery(encQ) && encQ.autoCount === true;
}
const DEFAULT_PROPS = [
    Property.AGGREGATE,
    Property.BIN,
    Property.TIMEUNIT,
    Property.FIELD,
    Property.TYPE,
    Property.SCALE,
    Property.SORT,
    Property.AXIS,
    Property.LEGEND,
    Property.STACK,
    Property.FORMAT
];
export function toEncoding(encQs, params) {
    const { wildcardMode = 'skip' } = params;
    let encoding = {};
    for (const encQ of encQs) {
        if (isDisabledAutoCountQuery(encQ)) {
            continue; // Do not include this in the output.
        }
        const { channel } = encQ;
        // if channel is a wildcard, return null
        if (isWildcard(channel)) {
            throw new Error('Cannot convert wildcard channel to a fixed channel');
        }
        const channelDef = isValueQuery(encQ) ? toValueDef(encQ) : toFieldDef(encQ, params);
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
export function toValueDef(valueQ) {
    const { value } = valueQ;
    if (isWildcard(value)) {
        return null;
    }
    return { value };
}
export function toFieldDef(encQ, params = {}) {
    const { props = DEFAULT_PROPS, schema, wildcardMode = 'skip' } = params;
    if (isFieldQuery(encQ)) {
        const fieldDef = {};
        for (const prop of props) {
            let encodingProperty = encQ[prop];
            if (isWildcard(encodingProperty)) {
                if (wildcardMode === 'skip')
                    continue;
                return null;
            }
            if (encodingProperty !== undefined) {
                // if the channel supports this prop
                const isSupportedByChannel = !PROPERTY_SUPPORTED_CHANNELS[prop] || PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel];
                if (!isSupportedByChannel) {
                    continue;
                }
                if (isEncodingNestedParent(prop) && isObject(encodingProperty)) {
                    encodingProperty = Object.assign({}, encodingProperty); // Make a shallow copy first
                    for (const childProp in encodingProperty) {
                        // ensure nested properties are not wildcard before assigning to field def
                        if (isWildcard(encodingProperty[childProp])) {
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
            if (prop === Property.SCALE && schema && encQ.type === TYPE.ORDINAL) {
                const scale = encQ.scale;
                const { ordinalDomain } = schema.fieldSchema(encQ.field);
                if (scale !== null && ordinalDomain) {
                    fieldDef[Property.SCALE] = Object.assign({ domain: ordinalDomain }, (isObject(scale) ? scale : {}));
                }
            }
        }
        return fieldDef;
    }
    else {
        if (encQ.autoCount === false) {
            throw new Error(`Cannot convert {autoCount: false} into a field def`);
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
/**
 * Is a field query continuous field?
 * This method is applicable only for fieldQuery without wildcard
 */
export function isContinuous(encQ) {
    if (isFieldQuery(encQ)) {
        return vlChannelDef.isContinuous(toFieldDef(encQ, { props: ['bin', 'timeUnit', 'field', 'type'] }));
    }
    return isAutoCountQuery(encQ);
}
export function isMeasure(encQ) {
    if (isFieldQuery(encQ)) {
        return !isDimension(encQ) && encQ.type !== 'temporal';
    }
    return isAutoCountQuery(encQ);
}
/**
 * Is a field query discrete field?
 * This method is applicable only for fieldQuery without wildcard
 */
export function isDimension(encQ) {
    if (isFieldQuery(encQ)) {
        const fieldDef = toFieldDef(encQ, { props: ['bin', 'timeUnit', 'type'] });
        return vlChannelDef.isDiscrete(fieldDef) || !!fieldDef.timeUnit;
    }
    return false;
}
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's TYPE.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */
export function scaleType(fieldQ) {
    const scale = fieldQ.scale === true || fieldQ.scale === SHORT_WILDCARD ? {} : fieldQ.scale || {};
    const { type, channel, timeUnit, bin } = fieldQ;
    // HACK: All of markType, and scaleConfig only affect
    // sub-type of ordinal to quantitative scales (point or band)
    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
    // Thus, instead of making this method requiring the global mark,
    // we will just call it with mark = undefined .
    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
    const markType = undefined;
    if (isWildcard(scale.type) || isWildcard(type) || isWildcard(channel) || isWildcard(bin)) {
        return undefined;
    }
    // If scale type is specified, then use scale.type
    if (scale.type) {
        return scale.type;
    }
    // if type is fixed and it's not temporal, we can ignore time unit.
    if (type === 'temporal' && isWildcard(timeUnit)) {
        return undefined;
    }
    // if type is fixed and it's not quantitative, we can ignore bin
    if (type === 'quantitative' && isWildcard(bin)) {
        return undefined;
    }
    let vegaLiteType = type === ExpandedType.KEY ? 'nominal' : type;
    const fieldDef = {
        type: vegaLiteType,
        timeUnit: timeUnit,
        bin: bin
    };
    return compileScaleType({ type: scale.type }, channel, fieldDef, markType);
}
//# sourceMappingURL=encoding.js.map