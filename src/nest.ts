import {Channel} from 'vega-lite/src/channel';
import {isArray} from 'datalib/src/util';

import {EnumSpec, isEnumSpec, SHORT_ENUM_SPEC} from './enumspec';
import {SpecQueryModel} from './model';
import {SpecQueryModelGroup} from './modelgroup';
import {Property} from './property';
import {Dict, duplicate, keys} from './util';

import {ExtendedGroupBy, isExtendedGroupBy} from './query/groupby';
import {Query} from './query/query';
import {fieldDef as fieldDefShorthand, spec as specShorthand, Replacer, getReplacer} from './query/shorthand';
import {stack} from './query/spec';


/**
 * Registry for all possible grouping key functions.
 */
let groupRegistry: Dict<(specM: SpecQueryModel) => string> = {};

/**
 * Add a grouping function to the registry.
 */
export function registerKeyFn(name: string, keyFn: (specM: SpecQueryModel) => string) {
  groupRegistry[name] = keyFn;
}

export const FIELD = 'field';
export const FIELD_TRANSFORM = 'fieldTransform';
export const ENCODING = 'encoding';
export const TRANSPOSE = 'transpose';

export const SPEC = 'spec';

/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
export function nest(specModels: SpecQueryModel[], query: Query): SpecQueryModelGroup {

  const rootGroup: SpecQueryModelGroup = { name: '', path: '', items: []};
  let groupIndex: Dict<SpecQueryModelGroup> = {};

  if (query.nest) {
    // global `includes` and `replaces` will get augmented by each level's groupBy.
    // Upper level's `groupBy` will get cascaded to lower-level groupBy.
    // `replace` can be overriden in a lower-level to support different grouping.
    let includes: Array<Dict<boolean>> = [];
    let replaces: Array<Dict<Dict<string>>> = [];
    let replacers: Array<Dict<Replacer>> = [];

    for (let l = 0 ; l < query.nest.length; l++) {
      includes.push( l > 0 ? duplicate(includes[l-1]) : {} );
      replaces.push( l > 0 ? duplicate(replaces[l-1]) : {} );

      const groupBy = query.nest[l].groupBy;
      if (isArray(groupBy)) {
        groupBy.forEach((grpBy: Property | ExtendedGroupBy) => {
          if (isExtendedGroupBy(grpBy)) {
            includes[l][grpBy.property] = true;
            replaces[l][grpBy.property] = grpBy.replace;
          } else {
            includes[l][grpBy] = true;
          }
        });
        const replaceFnIndex = keys(replaces[l]).reduce((fnIndex, prop: string) => {
          fnIndex[prop] = getReplacer(replaces[l][prop]);
          return fnIndex;
        }, {});
        replacers.push(replaceFnIndex);
      }
    }

    // With includes and replacers, now we can construct the nesting tree
    specModels.forEach((specM) => {
      let path = '';
      let group: SpecQueryModelGroup = rootGroup;
      for (let l = 0 ; l < query.nest.length; l++) {
        const groupBy = group.groupBy = query.nest[l].groupBy;
        group.orderGroupBy = query.nest[l].orderGroupBy;

        const key = isArray(groupBy) ?
          specShorthand(specM.specQuery, includes[l], replacers[l]) :
          groupRegistry[groupBy](specM);

        path += '/' + key;
        if (!groupIndex[path]) { // this item already exists on the path
          groupIndex[path] = {
            name: key,
            path: path,
            items: []
          };
          group.items.push(groupIndex[path]);
        }
        group = groupIndex[path];
      }
      group.items.push(specM);
    });
  } else {
    rootGroup.items = specModels;
  }
  return rootGroup;
}


registerKeyFn(FIELD, (specM: SpecQueryModel) => {
  return specM.getEncodings().map((encQ) => { return encQ.field; })
              .filter((field) => field && field !== '*')
              .sort()
              .join('|');
});

registerKeyFn(FIELD_TRANSFORM, (specM: SpecQueryModel) => {
  return specM.getEncodings().map((encQ) => fieldDefShorthand(encQ))
              .sort()
              .join('|');
});

function channelType(channel: Channel | EnumSpec<Channel>) {
  if (isEnumSpec(channel)) {
    return SHORT_ENUM_SPEC + '';
  }
  const c = channel as Channel;
  switch (c) {
    case Channel.X:
    case Channel.Y:
      return 'xy';
    case Channel.ROW:
    case Channel.COLUMN:
      return 'facet';
    case Channel.COLOR:
    case Channel.SIZE:
    case Channel.SHAPE:
    case Channel.OPACITY:
      return 'non-xy';
    case Channel.TEXT:
    case Channel.DETAIL:
    case Channel.PATH:
    case Channel.ORDER:
      return c + '';
    /* istanbul ignore next */
    default:
      console.warn('channel type not implemented for ' + c);
      return c + '';
  }
}

function stringifyStack(specM: SpecQueryModel) {
  const _stack = stack(specM.specQuery);
  return (!!_stack ? 'stack=' + _stack.offset + '|' : '');
}

registerKeyFn(ENCODING, (specM: SpecQueryModel) => {
  // mark does not matter
  return stringifyStack(specM)  +
    specM.getEncodings().map((encQ) => {
      const fieldDef = fieldDefShorthand(encQ);
      return channelType(encQ.channel) + ':' + fieldDef;
    })
    .sort()
    .join('|');
});

registerKeyFn(TRANSPOSE, (specM: SpecQueryModel) => {
  return specM.getMark() + '|' +
    stringifyStack(specM) +
    specM.getEncodings().map((encQ) => {
      const fieldDef = fieldDefShorthand(encQ);
      const channel = (encQ.channel === Channel.X || encQ.channel === Channel.Y) ? 'xy' :
        (encQ.channel === Channel.ROW || encQ.channel === Channel.COLUMN) ? 'facet' :
        encQ.channel;
      return channel + ':' + fieldDef;
    })
    .sort()
    .join('|');
});

registerKeyFn(SPEC, (specM: SpecQueryModel) => JSON.stringify(specM.specQuery));
