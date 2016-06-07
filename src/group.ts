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
export function registerKeyFn(name: string, keyFn: (specM: SpecQueryModel) => string) {
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
export function group(specModels: SpecQueryModel[], keyFnName: string): SpecQueryModelGroup[] {
  const keyFn: (specM: SpecQueryModel) => string = groupRegistry[keyFnName || SPEC];
  const groups: SpecQueryModelGroup[] = [];
  let groupIndex = {}; // Dict<SpecQueryModel[]>
  specModels.forEach((specM) => {
    const name = keyFn(specM);
    if (groupIndex[name]) {
      groupIndex[name].items.push(specM);
    } else {
      groupIndex[name] = {
        name: name,
        items: [specM]
      };
      groups.push(groupIndex[name]);
    }
  });
  return groups;
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
  }
  console.warn('channel type not implemented for ' + c);
  return c + '';
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

registerKeyFn(SPEC, (specM: SpecQueryModel) => JSON.stringify(specM.specQuery));
