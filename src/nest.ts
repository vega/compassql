import {Channel} from 'vega-lite/src/channel';

import {SpecQueryModel} from './model';
import {SHORT_ENUM_SPEC, EnumSpec, isEnumSpec, stringifyEncodingQueryFieldDef, Query} from './query';
import {Stats} from './stats';
import {Dict} from './util';


/**
 * Registry for all possible grouping key functions.
 */
let groupRegistry = {};

/**
 * Add a grouping function to the registry.
 */
export function registerKeyFn(name: string, keyFn: (specM: SpecQueryModel) => string) {
  groupRegistry[name] = keyFn;
}

export const DATA = 'data';
export const ENCODING = 'encoding';
export const TRANSPOSE = 'transpose';

export const SPEC = 'spec';

export interface SpecQueryModelGroup {
  groupBy?: string;
  name: string;
  path: string;
  items: (SpecQueryModel | SpecQueryModelGroup)[];
}

export function isSpecQueryModelGroup(item: SpecQueryModel | SpecQueryModelGroup): item is SpecQueryModelGroup {
  return item.hasOwnProperty('items');
}

/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
export function nest(specModels: SpecQueryModel[], query: Query, stats: Stats): SpecQueryModelGroup {

  const rootGroup: SpecQueryModelGroup = { name: '', path: '', items: []};
  let groupIndex: Dict<SpecQueryModelGroup> = {};

  specModels.forEach((specM) => {
    let path = '';
    let group: SpecQueryModelGroup = rootGroup;
    for (let l = 0 ; l < query.nest.length; l++) {
      group.groupBy = query.nest[l].groupBy;
      const keyFn: (specM: SpecQueryModel) => string = groupRegistry[query.nest[l].groupBy];
      const key = keyFn(specM);

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
  return rootGroup;
}



registerKeyFn(DATA, (specM: SpecQueryModel) => {
  return specM.getEncodings().map(stringifyEncodingQueryFieldDef)
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

registerKeyFn(ENCODING, (specM: SpecQueryModel) => {
  // mark does not matter
  return specM.getEncodings().map((encQ) => {
      const fieldDef = stringifyEncodingQueryFieldDef(encQ);
      return channelType(encQ.channel) + ':' + fieldDef;
    })
    .sort()
    .join('|');
});

registerKeyFn(TRANSPOSE, (specM: SpecQueryModel) => {
  return specM.getMark() + '|' + specM.getEncodings().map((encQ) => {
      const fieldDef = stringifyEncodingQueryFieldDef(encQ);
      const channel = (encQ.channel === Channel.X || encQ.channel === Channel.Y) ? 'xy' :
        (encQ.channel === Channel.ROW || encQ.channel === Channel.COLUMN) ? 'facet' :
        encQ.channel;
      return channel + ':' + fieldDef;
    })
    .sort()
    .join('|');
});

registerKeyFn(SPEC, (specM: SpecQueryModel) => JSON.stringify(specM.specQuery));
