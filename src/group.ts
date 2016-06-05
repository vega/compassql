import {Channel} from 'vega-lite/src/channel';

import {SpecQueryModel} from './model';
import {SHORT_ENUM_SPEC, EnumSpec, isEnumSpec, stringifyEncodingQueryFieldDef} from './query';

/**
 * Registry for all possible grouping key functions.
 */
let groupRegistry = {};

/**
 * Add a grouping function to the registry.
 */
export function registerKeyFn(name: string, keyFn: (specQ: SpecQueryModel) => string) {
  groupRegistry[name] = keyFn;
}

export const DATA = 'data';
export const ENCODING = 'encoding';
export const SPEC = 'spec';

export interface SpecQueryModelGroup {
  name: string;
  items: SpecQueryModel[];
}

/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
export function group(specQueries: SpecQueryModel[], keyFnName: string): SpecQueryModelGroup[] {
  const keyFn: (specQ: SpecQueryModel) => string = groupRegistry[keyFnName || SPEC];
  const groups: SpecQueryModelGroup[] = [];
  let groupIndex = {}; // Dict<SpecQueryModel[]>
  specQueries.forEach((specQ) => {
    const name = keyFn(specQ);
    if (groupIndex[name]) {
      groupIndex[name].items.push(specQ);
    } else {
      groupIndex[name] = {
        name: name,
        items: [specQ]
      };
      groups.push(groupIndex[name]);
    }
  });
  return groups;
}

registerKeyFn(DATA, (specQ: SpecQueryModel) => {
  return specQ.getEncodings().map(stringifyEncodingQueryFieldDef)
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
  }
  console.warn('channel type not implemented for ' + c);
  return c + '';
}

registerKeyFn(ENCODING, (specQ: SpecQueryModel) => {
  // mark does not matter
  return specQ.getEncodings().map((encQ) => {
      const fieldDef = stringifyEncodingQueryFieldDef(encQ);
      return channelType(encQ.channel) + ':' + fieldDef;
    })
    .sort()
    .join('|');
});

registerKeyFn(SPEC, (specQ: SpecQueryModel) => JSON.stringify(specQ.specQuery));
