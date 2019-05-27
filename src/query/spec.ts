import {toMap} from 'datalib/src/util';
import {Channel} from 'vega-lite/build/src/channel';
import {Config} from 'vega-lite/build/src/config';
import {Data} from 'vega-lite/build/src/data';
import {Mark} from 'vega-lite/build/src/mark';
import {FacetedUnitSpec, TopLevel} from 'vega-lite/build/src/spec';
import {stack, StackOffset, StackProperties} from 'vega-lite/build/src/stack';
import {TitleParams} from 'vega-lite/build/src/title';
import {ALL_ENCODING_PROPS, getEncodingNestedProp, isEncodingTopLevelProperty, Property, toKey} from '../property';
import {contains, extend, isObject, keys, some, without} from '../util';
import {isWildcard, WildcardProperty} from '../wildcard';
import {EncodingQuery, isDisabledAutoCountQuery, isEnabledAutoCountQuery, isFieldQuery, toEncoding} from './encoding';
import {TransformQuery} from './transform';

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
export function fromSpec(spec: TopLevel<FacetedUnitSpec>): SpecQuery {
  return extend(
    spec.data ? {data: spec.data} : {},
    spec.transform ? {transform: spec.transform} : {},
    spec.width ? {width: spec.width} : {},
    spec.height ? {height: spec.height} : {},
    spec.background ? {background: spec.background} : {},
    spec.padding ? {padding: spec.padding} : {},
    spec.title ? {title: spec.title} : {},
    {
      mark: spec.mark,
      encodings: keys(spec.encoding).map((channel: Channel) => {
        let encQ: EncodingQuery = {channel: channel};
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
      })
    },
    spec.config ? {config: spec.config} : {}
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

  return stack(mark, encoding, undefined, {disallowNonLinearStack: true});
}

/**
 * @return The `StackOffset` specified in `specQ`, `undefined` if none
 * is specified.
 */
export function getStackOffset(specQ: SpecQuery): StackOffset {
  for (const encQ of specQ.encodings) {
    if (encQ[Property.STACK] !== undefined && !isWildcard(encQ[Property.STACK])) {
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
    if (encQ[Property.STACK] !== undefined && !isWildcard(encQ.channel)) {
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
  // TODO(haldenl): make this leaner, a lot of encQ properties aren't required for stack.
  // TODO(haldenl): check mark, then encodings
  if (isWildcard(specQ.mark)) {
    return false;
  }

  const requiredEncodingProps = [
    Property.STACK,
    Property.CHANNEL,
    Property.MARK,
    Property.FIELD,
    Property.AGGREGATE,
    Property.AUTOCOUNT,
    Property.SCALE,
    getEncodingNestedProp('scale', 'type'),
    Property.TYPE
  ];
  const exclude = toMap(without(ALL_ENCODING_PROPS, requiredEncodingProps));

  const encodings = specQ.encodings.filter(encQ => !isDisabledAutoCountQuery(encQ));
  for (const encQ of encodings) {
    if (objectContainsWildcard(encQ, {exclude: exclude})) {
      return false;
    }
  }
  return true;
}

/**
 * Returns true iff the given object does not contain a nested wildcard.
 * @param obj The object in question.
 * @param opt With optional `exclude` property, which defines properties to
 * ignore when testing for wildcards.
 */
// TODO(haldenl): rename to objectHasWildcard, rename prop to obj
function objectContainsWildcard(obj: any, opt: {exclude?: {[key: string]: 1}} = {}) {
  if (!isObject(obj)) {
    return false;
  }

  for (const childProp in obj) {
    if (obj.hasOwnProperty(childProp)) {
      const wildcard = isWildcard(obj[childProp]);
      if ((wildcard && (!opt.exclude || !opt.exclude[childProp])) || objectContainsWildcard(obj[childProp], opt)) {
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
    if (objectContainsWildcard(encQ, exclude)) {
      return true;
    }
  }
  return false;
}
