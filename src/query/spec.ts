import {Channel, X, Y, NONPOSITION_CHANNELS} from 'vega-lite/build/src/channel';
import {Config} from 'vega-lite/build/src/config';
import {Data} from 'vega-lite/build/src/data';
import {Mark} from 'vega-lite/build/src/mark';
import {TitleParams} from 'vega-lite/build/src/title';
import {stack, StackOffset, StackProperties} from 'vega-lite/build/src/stack';

import {isWildcard, WildcardProperty} from '../wildcard';
import {isEncodingTopLevelProperty, Property, toKey} from '../property';
import {contains, extend, keys, some} from '../util';

import {TransformQuery} from './transform';
import {EncodingQuery, isFieldQuery, isEnabledAutoCountQuery, isDisabledAutoCountQuery, toEncoding} from './encoding';
import {TopLevel, FacetedCompositeUnitSpec} from 'vega-lite/build/src/spec';
import {toMap} from 'datalib/src/util';


/**
 * A "query" version of a [Vega-Lite](https://github.com/vega/vega-lite)'s `UnitSpec` (single view specification).
 * This interface and most of  its children have `Query` suffixes to hint that their instanced are queries that
 * can contain wildcards to describe a collection of specifications.
 */
export interface SpecQuery {
  data?: Data;

  // TODO: support mark definition object
  mark: WildcardProperty<Mark>;
  transform?: TransformQuery[];

  /**
   * Array of encoding query mappings.
   * Note: Vega-Lite's `encoding` is an object whose keys are unique encoding channels.
   * However, for CompassQL, the `channel` property of encoding query mappings can be wildcards.
   * Thus the `encoding` object in Vega-Lite is flatten as the `encodings` array in CompassQL.
   */
  encodings: EncodingQuery[];

  /**
   * The width of the resulting encodings.
   * __NOTE:__ Does not support wildcards.
   */
  width?: number;

  /**
   * The height of the resulting encodings.
   * __NOTE:__ Does not support wildcards.
   */
  height?: number;

  /**
   * CSS color property to use as the background of visualization.
   * __NOTE:__ Does not support wildcards.
   */
  background?: string;

  /**
   * The default visualization padding, in pixels, from the edge of the
   * visualization canvas to the data rectangle. If a number, specifies
   * padding for all sides. If an object, the value should have the
   * format {"left": 5, "top": 5, "right": 5, "bottom": 5}
   * to specify padding for each side of the visualization.
   *
   * __NOTE:__ Does not support wildcards.
   */
  padding?: number | Object;

  /**
   * Title for the plot.
   * __NOTE:__ Does not support wildcards.
   */
  title?: string | TitleParams;

  // TODO: make config query (not important at all, only for the sake of completeness.)
  /**
   * Vega-Lite Configuration
   */
  config?: Config;
}

/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
export function fromSpec(spec: TopLevel<FacetedCompositeUnitSpec>): SpecQuery {
  return extend(
    spec.data ? { data: spec.data} : {},
    spec.transform ? { transform: spec.transform } : {},
    spec.width ? { width: spec.width } : {},
    spec.height ? { height: spec.height } : {},
    spec.background ? { background: spec.background } : {},
    spec.padding ? { padding: spec.padding } : {},
    spec.title ? { title: spec.title } : {},
    {
      mark: spec.mark,
      encodings: keys(spec.encoding).map((channel: Channel) => {
          let encQ: EncodingQuery = { channel: channel };
          let channelDef = spec.encoding[channel];

          for (const prop in channelDef) {
            if (isEncodingTopLevelProperty(prop as Property) && channelDef[prop] !== undefined) {
              // Currently bin, scale, axis, legend only support boolean, but not null.
              // Therefore convert null to false.
              if (contains(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
                encQ[prop] = false;
              } else {
                encQ[prop] = channelDef[prop];
              }
            }
          }

          if (isFieldQuery(encQ) && encQ.aggregate === 'count' && !encQ.field) {
            encQ.field = '*';
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
    return (isFieldQuery(encQ) && !isWildcard(encQ.aggregate) && !!encQ.aggregate) || isEnabledAutoCountQuery(encQ);
  });
}

/**
 * @return The Vega-Lite `StackProperties` object that describes the stack
 * configuration of `specQ`. Returns `null` if this is not stackable.
 */
export function getVlStack(specQ: SpecQuery): StackProperties {
  if (!hasRequiredStackProperties(specQ)) {
    return null;
  }

  const encoding = toEncoding(specQ.encodings, {schema: null, wildcardMode: 'null'});
  const mark = specQ.mark as Mark;

  return stack(mark, encoding, getStackOffset(specQ));
}

/**
 * @return The `StackOffset` specified in `specQ`, `undefined` if none
 * is specified.
 */
export function getStackOffset(specQ: SpecQuery): StackOffset {
  for (const encQ of specQ.encodings) {
    if (typeof encQ[Property.STACK] !== 'undefined' && !isWildcard(encQ[Property.STACK])) {
      return encQ[Property.STACK];
    }
  }
  return undefined;
}

/**
 * @return The `Channel` in which `stack` is specified in `specQ`, or
 * `null` if none is specified.
 */
export function getStackChannel(specQ: SpecQuery): Channel {
  for (const encQ of specQ.encodings) {
    if (typeof encQ[Property.STACK] !== 'undefined' && !isWildcard(encQ.channel)) {
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
export function hasRequiredStackProperties(specQ: SpecQuery) {
  const requiredProps = [specQ.mark, specQ.encodings.filter(encQ => !isDisabledAutoCountQuery(encQ))];
  for (const prop of requiredProps) {
    if (isWildcard(prop) || containsWildcard(prop)) {
      return false;
    }
  }
  return true;
}

/**
 * Returns true iff the given property does not contain a nested wildcard.
 * @param prop The property in question.
 * @param opt With optional `exclude` property, which defines properties to
 * ignore when testing for wildcards.
 */
function containsWildcard(prop: any, opt: {exclude?: {[key: string]: 1}} = {}) {
  if (prop !== Object(prop)) {
    return false;
  }

  for (const childProp in prop) {
    if (prop.hasOwnProperty(childProp)) {
      const wildcard = isWildcard(prop[childProp]);
      if ((wildcard && (!opt.exclude || !opt.exclude[childProp])) ||
          containsWildcard(prop[childProp], opt)) {
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
export function hasWildcard(specQ: SpecQuery, opt: {exclude?: Property[]} = {}) {
  const exclude = opt.exclude ? toMap(opt.exclude.map(toKey)) : {};
  if (isWildcard(specQ.mark) && !exclude['mark']) {
    return true;
  }

  for (const encQ of specQ.encodings) {
    if (containsWildcard(encQ, exclude)) {
      return true;
    }
  }
  return false;
}
