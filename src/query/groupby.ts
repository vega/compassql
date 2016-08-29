import {isArray, isObject} from 'datalib/src/util';

import {Property} from '../property';
import {Dict,keys} from '../util';

export interface ExtendedGroupBy {
  property: Property;
  replace?: Dict<string>;
}

export const REPLACE_BLANK_FIELDS: Dict<string> = {'*': ''};
export const REPLACE_XY_CHANNELS: Dict<string> = {x: 'xy', y: 'xy'};
export const REPLACE_FACET_CHANNELS: Dict<string> = {row: 'facet', column: 'facet'};
export const REPLACE_MARK_STYLE_CHANNELS: Dict<string> = {color: 'style', opacity: 'style', shape: 'style', size: 'style'};

export function isExtendedGroupBy(g: Property | ExtendedGroupBy): g is ExtendedGroupBy {
  return isObject(g) && !!g['property'];
}

export type GroupBy = string | Array<Property | ExtendedGroupBy>;

export function parse(groupBy: Array<Property | ExtendedGroupBy>, include: Dict<boolean>, replaceIndex: Dict<Dict<string>>) {
  groupBy.forEach((grpBy: Property | ExtendedGroupBy) => {
    if (isExtendedGroupBy(grpBy)) {
      include[grpBy.property] = true;
      replaceIndex[grpBy.property] = grpBy.replace;
    } else {
      include[grpBy] = true;
    }
  });
}

export function toString(groupBy: GroupBy): string {
  if (isArray(groupBy)) {
    return groupBy.map((g: Property | ExtendedGroupBy) => {
      if (isExtendedGroupBy(g)) {
        if (g.replace) {
          var replaceIndex = keys(g.replace).reduce((index, valFrom) => {
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
  } else {
    return groupBy;
  }
}
