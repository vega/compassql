import {isArray, isObject} from 'datalib/src/util';

import {getReplacerIndex} from './shorthand';
import {Property} from '../property';
import {PropIndex} from '../propindex';
import {Dict,keys} from '../util';


export interface ExtendedGroupBy {
  property: string;
  replace?: Dict<string>;
}

export const REPLACE_BLANK_FIELDS: Dict<string> = {'*': ''};
export const REPLACE_XY_CHANNELS: Dict<string> = {x: 'xy', y: 'xy'};
export const REPLACE_FACET_CHANNELS: Dict<string> = {row: 'facet', column: 'facet'};
export const REPLACE_MARK_STYLE_CHANNELS: Dict<string> = {color: 'style', opacity: 'style', shape: 'style', size: 'style'};

export function isExtendedGroupBy(g: string | ExtendedGroupBy): g is ExtendedGroupBy {
  return isObject(g) && !!g['property'];
}

export type GroupBy = string | Array<string | ExtendedGroupBy>;

export interface Nest {
  groupBy: GroupBy;
  orderGroupBy?: string | string[];
}


export function parseGroupBy(groupBy: Array<string | ExtendedGroupBy>,
    include?: PropIndex<boolean>,
    replaceIndex?: PropIndex<Dict<string>>
  ) {

  include = include || new PropIndex<boolean>();
  replaceIndex = replaceIndex || new PropIndex<Dict<string>>();

  groupBy.forEach((grpBy: string | ExtendedGroupBy) => {
    if (isExtendedGroupBy(grpBy)) {
      include.setByKey(grpBy.property, true);
      replaceIndex.setByKey(grpBy.property, grpBy.replace);
    } else {
      include.setByKey(grpBy, true);
    }
  });

  return {
    include: include,
    replaceIndex: replaceIndex,
    replacer: getReplacerIndex(replaceIndex)
  };
}

export function toString(groupBy: GroupBy): string {
  if (isArray(groupBy)) {
    return groupBy.map((g: string | ExtendedGroupBy) => {
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
  } else {
    return groupBy;
  }
}

export const GROUP_BY_FIELD_TRANSFORM = [
  Property.FIELD, Property.TYPE,
  Property.AGGREGATE, Property.BIN, Property.TIMEUNIT, Property.STACK
];

export const GROUP_BY_ENCODING = (GROUP_BY_FIELD_TRANSFORM as Array<string | ExtendedGroupBy>).concat([
  {
    property: Property.CHANNEL,
    replace: {
      'x': 'xy', 'y': 'xy',
      'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
      'row': 'facet', 'column': 'facet'
    }
  }
]);

