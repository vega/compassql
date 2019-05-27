import { toMap } from 'datalib/src/util';
import { stack } from 'vega-lite/build/src/stack';
import { ALL_ENCODING_PROPS, getEncodingNestedProp, isEncodingTopLevelProperty, Property, toKey } from '../property';
import { contains, extend, isObject, keys, some, without } from '../util';
import { isWildcard } from '../wildcard';
import { isDisabledAutoCountQuery, isEnabledAutoCountQuery, isFieldQuery, toEncoding } from './encoding';
/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
export function fromSpec(spec) {
    return extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, spec.width ? { width: spec.width } : {}, spec.height ? { height: spec.height } : {}, spec.background ? { background: spec.background } : {}, spec.padding ? { padding: spec.padding } : {}, spec.title ? { title: spec.title } : {}, {
        mark: spec.mark,
        encodings: keys(spec.encoding).map((channel) => {
            let encQ = { channel: channel };
            let channelDef = spec.encoding[channel];
            for (const prop in channelDef) {
                if (isEncodingTopLevelProperty(prop) && channelDef[prop] !== undefined) {
                    // Currently bin, scale, axis, legend only support boolean, but not null.
                    // Therefore convert null to false.
                    if (contains(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
                        encQ[prop] = false;
                    }
                    else {
                        encQ[prop] = channelDef[prop];
                    }
                }
            }
            if (isFieldQuery(encQ) && encQ.aggregate === 'count' && !encQ.field) {
                encQ.field = '*';
            }
            return encQ;
        })
    }, spec.config ? { config: spec.config } : {});
}
export function isAggregate(specQ) {
    return some(specQ.encodings, (encQ) => {
        return (isFieldQuery(encQ) && !isWildcard(encQ.aggregate) && !!encQ.aggregate) || isEnabledAutoCountQuery(encQ);
    });
}
/**
 * @return The Vega-Lite `StackProperties` object that describes the stack
 * configuration of `specQ`. Returns `null` if this is not stackable.
 */
export function getVlStack(specQ) {
    if (!hasRequiredStackProperties(specQ)) {
        return null;
    }
    const encoding = toEncoding(specQ.encodings, { schema: null, wildcardMode: 'null' });
    const mark = specQ.mark;
    return stack(mark, encoding, undefined, { disallowNonLinearStack: true });
}
/**
 * @return The `StackOffset` specified in `specQ`, `undefined` if none
 * is specified.
 */
export function getStackOffset(specQ) {
    for (const encQ of specQ.encodings) {
        if (encQ[Property.STACK] !== undefined && !isWildcard(encQ[Property.STACK])) {
            return encQ[Property.STACK];
        }
    }
    return undefined;
}
/**
 * @return The `Channel` in which `stack` is specified in `specQ`, or
 * `null` if none is specified.
 */
export function getStackChannel(specQ) {
    for (const encQ of specQ.encodings) {
        if (encQ[Property.STACK] !== undefined && !isWildcard(encQ.channel)) {
            return encQ.channel;
        }
    }
    return null;
}
/**
 * Returns true iff the given SpecQuery has the properties defined
 * to be a potential Stack spec.
 * @param specQ The SpecQuery in question.
 */
export function hasRequiredStackProperties(specQ) {
    // TODO(haldenl): make this leaner, a lot of encQ properties aren't required for stack.
    // TODO(haldenl): check mark, then encodings
    if (isWildcard(specQ.mark)) {
        return false;
    }
    const requiredEncodingProps = [
        Property.STACK,
        Property.CHANNEL,
        Property.MARK,
        Property.FIELD,
        Property.AGGREGATE,
        Property.AUTOCOUNT,
        Property.SCALE,
        getEncodingNestedProp('scale', 'type'),
        Property.TYPE
    ];
    const exclude = toMap(without(ALL_ENCODING_PROPS, requiredEncodingProps));
    const encodings = specQ.encodings.filter(encQ => !isDisabledAutoCountQuery(encQ));
    for (const encQ of encodings) {
        if (objectContainsWildcard(encQ, { exclude: exclude })) {
            return false;
        }
    }
    return true;
}
/**
 * Returns true iff the given object does not contain a nested wildcard.
 * @param obj The object in question.
 * @param opt With optional `exclude` property, which defines properties to
 * ignore when testing for wildcards.
 */
// TODO(haldenl): rename to objectHasWildcard, rename prop to obj
function objectContainsWildcard(obj, opt = {}) {
    if (!isObject(obj)) {
        return false;
    }
    for (const childProp in obj) {
        if (obj.hasOwnProperty(childProp)) {
            const wildcard = isWildcard(obj[childProp]);
            if ((wildcard && (!opt.exclude || !opt.exclude[childProp])) || objectContainsWildcard(obj[childProp], opt)) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Returns true iff the given `specQ` contains a wildcard.
 * @param specQ The `SpecQuery` in question.
 * @param opt With optional `exclude` property, which defines properties to
 * ignore when testing for wildcards.
 */
export function hasWildcard(specQ, opt = {}) {
    const exclude = opt.exclude ? toMap(opt.exclude.map(toKey)) : {};
    if (isWildcard(specQ.mark) && !exclude['mark']) {
        return true;
    }
    for (const encQ of specQ.encodings) {
        if (objectContainsWildcard(encQ, exclude)) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=spec.js.map