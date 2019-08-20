import { isArray, isObject } from 'datalib/src/util';
import { getReplacerIndex } from './shorthand';
import { Property } from '../property';
import { PropIndex } from '../propindex';
import { keys } from '../util';
export const REPLACE_BLANK_FIELDS = { '*': '' };
export const REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
export const REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
export const REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
export function isExtendedGroupBy(g) {
    return isObject(g) && !!g['property'];
}
export function parseGroupBy(groupBy, include, replaceIndex) {
    include = include || new PropIndex();
    replaceIndex = replaceIndex || new PropIndex();
    groupBy.forEach((grpBy) => {
        if (isExtendedGroupBy(grpBy)) {
            include.setByKey(grpBy.property, true);
            replaceIndex.setByKey(grpBy.property, grpBy.replace);
        }
        else {
            include.setByKey(grpBy, true);
        }
    });
    return {
        include: include,
        replaceIndex: replaceIndex,
        replacer: getReplacerIndex(replaceIndex)
    };
}
export function toString(groupBy) {
    if (isArray(groupBy)) {
        return groupBy.map((g) => {
            if (isExtendedGroupBy(g)) {
                if (g.replace) {
                    let replaceIndex = keys(g.replace).reduce((index, valFrom) => {
                        const valTo = g.replace[valFrom];
                        (index[valTo] = index[valTo] || []).push(valFrom);
                        return index;
                    }, {});
                    return g.property + '[' + keys(replaceIndex).map((valTo) => {
                        const valsFrom = replaceIndex[valTo].sort();
                        return valsFrom.join(',') + '=>' + valTo;
                    }).join(';') + ']';
                }
                return g.property;
            }
            return g;
        }).join(',');
    }
    else {
        return groupBy;
    }
}
export const GROUP_BY_FIELD_TRANSFORM = [
    Property.FIELD, Property.TYPE,
    Property.AGGREGATE, Property.BIN, Property.TIMEUNIT, Property.STACK
];
export const GROUP_BY_ENCODING = GROUP_BY_FIELD_TRANSFORM.concat([
    {
        property: Property.CHANNEL,
        replace: {
            'x': 'xy', 'y': 'xy',
            'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
            'row': 'facet', 'column': 'facet'
        }
    }
]);
//# sourceMappingURL=groupby.js.map