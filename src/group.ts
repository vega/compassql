import {Channel} from 'vega-lite/src/channel';

import {SpecQueryModel} from './model';
import {SHORT_ENUM_SPEC, EnumSpec, isEnumSpec, stringifyEncodingQueryFieldDef} from './query';

export function group(specQueries: SpecQueryModel[], keyFn: (specQ: SpecQueryModel) => string) {
  return specQueries.reduce((groups, specQ) => {
    const name = keyFn(specQ);
    groups[name] = groups[name] || [];
    groups[name].push(specQ);
    return groups;
  }, {});
}

export function dataKey(specQ: SpecQueryModel)  {

  return specQ.getEncodings().map(stringifyEncodingQueryFieldDef)
              .sort()
              .join('|');
}

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

export function encodingKey(specQ: SpecQueryModel) {
  // mark does not matter
  return specQ.getEncodings().map((encQ) => {
      const fieldDef = stringifyEncodingQueryFieldDef(encQ);
      return channelType(encQ.channel) + ':' + fieldDef;
    })
    .sort()
    .join('|');
}
