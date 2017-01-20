import {Channel, X, Y, STACK_GROUP_CHANNELS} from 'vega-lite/src/channel';
import {Config} from 'vega-lite/src/config';
import {Data} from 'vega-lite/src/data';
import {ExtendedUnitSpec} from 'vega-lite/src/spec';
import {Mark, BAR, AREA} from 'vega-lite/src/mark';
import {StackOffset, StackProperties} from 'vega-lite/src/stack';

import {EnumSpec, ShortEnumSpec, isEnumSpec} from '../enumspec';
import {ENCODING_PROPERTIES, isNestedEncodingProperty, Property} from '../property';
import {contains, extend, keys, some} from '../util';

import {TransformQuery} from './transform';
import {EncodingQuery} from './encoding';



export interface SpecQuery {
  data?: Data;
  mark: Mark | EnumSpec<Mark> | ShortEnumSpec;
  transform?: TransformQuery;
  encodings: EncodingQuery[];

  // TODO: make config query (not important at all, only for the sake of completeness.)
  config?: Config;
}

/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
export function fromSpec(spec: ExtendedUnitSpec): SpecQuery {
  return extend(
    spec.data ? { data: spec.data} : {},
    spec.transform ? { transform: spec.transform } : {},
    {
      mark: spec.mark,
      encodings: keys(spec.encoding).map((channel) => {
          let encQ: EncodingQuery = { channel: channel };
          let channelDef = spec.encoding[channel];

          for (const prop of ENCODING_PROPERTIES) {
            if (!isNestedEncodingProperty(prop) && channelDef[prop] !== undefined) {
              encQ[prop] = channelDef[prop];
            }
            // Currently scale, axis, legend only support boolean, but not null.
            // Therefore convert null to false.
            if (contains([Property.SCALE, Property.AXIS, Property.LEGEND], prop) && encQ[prop] === null) {
              encQ[prop] = false;
            }
          }
          return encQ;
        }
      )
    },
    spec.config ? { config: spec.config } : {}
  );
}

export function isAggregate(specQ: SpecQuery) {
  return some(specQ.encodings, (encQ: EncodingQuery) => {
    return (!isEnumSpec(encQ.aggregate) && !!encQ.aggregate) || encQ.autoCount === true;
  });
}

/**
 * @return the stack offset type for the specQuery
 */
export function stack(specQ: SpecQuery): StackProperties & {fieldEncQ: EncodingQuery, groupByEncQ: EncodingQuery} {
  const config = specQ.config;
  const stacked = (config && config.mark) ? config.mark.stacked : undefined;

  // Should not have stack explicitly disabled
  if (contains([StackOffset.NONE, null, false], stacked)) {
    return null;
  }

  // Should have stackable mark
  if (!contains([BAR, AREA], specQ.mark)) {
    return null;
  }

  // Should be aggregate plot
  if (!isAggregate(specQ)) {
    return null;
  }

  const stackByChannels = specQ.encodings.reduce((sc, encQ: EncodingQuery) => {
    if (contains(STACK_GROUP_CHANNELS, encQ.channel) && !encQ.aggregate) {
      sc.push(encQ.channel);
    }
    return sc;
  }, []);

  if (stackByChannels.length === 0) {
    return null;
  }

  // Has only one aggregate axis
  const xEncQ = specQ.encodings.reduce((f, encQ: EncodingQuery) => {
    return f || (encQ.channel === Channel.X ? encQ : null);
  }, null);
  const yEncQ = specQ.encodings.reduce((f, encQ: EncodingQuery) => {
    return f || (encQ.channel === Channel.Y ? encQ : null);
  }, null);
  const xIsAggregate = !!xEncQ && (!!xEncQ.aggregate || !!xEncQ.autoCount);
  const yIsAggregate = !!yEncQ && (!!yEncQ.aggregate || !!yEncQ.autoCount);

  if (xIsAggregate !== yIsAggregate) {
    return {
      groupbyChannel: xIsAggregate ? (!!yEncQ ? Y : null) : (!!xEncQ ? X : null),
      groupByEncQ: xIsAggregate ? yEncQ : xEncQ,
      fieldChannel: xIsAggregate ? X : Y,
      fieldEncQ: xIsAggregate ? xEncQ : yEncQ,
      stackByChannels: stackByChannels,
      offset: stacked || StackOffset.ZERO
    };
  }
  return null;
}
