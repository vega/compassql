import {Channel, X, Y, NONPOSITION_CHANNELS} from 'vega-lite/build/src/channel';
import {Config} from 'vega-lite/build/src/config';
import {Data} from 'vega-lite/build/src/data';
import {Mark} from 'vega-lite/build/src/mark';
import {StackProperties} from 'vega-lite/build/src/stack';
import {TitleParams} from 'vega-lite/build/src/title';

import {isWildcard, WildcardProperty, Wildcard} from '../wildcard';
import {isEncodingTopLevelProperty, Property, toKey, FlatProp, EncodingNestedProp} from '../property';
import {contains, extend, keys, some} from '../util';

import {TransformQuery} from './transform';
import {EncodingQuery, isFieldQuery, isValueQuery, isAutoCountQuery, isEnabledAutoCountQuery} from './encoding';
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
 * @return the stack offset type for the specQuery
 */
export function stack(specQ: SpecQuery): StackProperties & {fieldEncQ: EncodingQuery, groupByEncQ: EncodingQuery} {
  const config = specQ.config;
  const stacked = config ? config.stack : undefined;

  // Should not have stack explicitly disabled
  if (contains(['none', null, false], stacked)) {
    return null;
  }

  // Should have stackable mark
  if (!contains(['bar', 'area'], specQ.mark)) {
    return null;
  }

  // Should be aggregate plot
  if (!isAggregate(specQ)) {
    return null;
  }

  const stackBy = specQ.encodings.reduce((sc, encQ: EncodingQuery) => {
    if (contains(NONPOSITION_CHANNELS, encQ.channel) && (isValueQuery(encQ) || (isFieldQuery(encQ) &&!encQ.aggregate))) {
      sc.push({
        channel: encQ.channel,
        fieldDef: encQ
      });
    }
    return sc;
  }, []);

  if (stackBy.length === 0) {
    return null;
  }

  // Has only one aggregate axis
  const xEncQ = specQ.encodings.reduce((f, encQ: EncodingQuery) => {
    return f || (encQ.channel === Channel.X ? encQ : null);
  }, null);
  const yEncQ = specQ.encodings.reduce((f, encQ: EncodingQuery) => {
    return f || (encQ.channel === Channel.Y ? encQ : null);
  }, null);

  // TODO(akshatsh): Check if autoCount undef is ok
  const xIsAggregate = (isFieldQuery(xEncQ) && !!xEncQ.aggregate) || (isAutoCountQuery(xEncQ) &&!!xEncQ.autoCount);
  const yIsAggregate = (isFieldQuery(yEncQ) && !!yEncQ.aggregate) || (isAutoCountQuery(yEncQ) &&!!yEncQ.autoCount);

  if (xIsAggregate !== yIsAggregate) {
    return {
      groupbyChannel: xIsAggregate ? (!!yEncQ ? Y : null) : (!!xEncQ ? X : null),
      groupByEncQ: xIsAggregate ? yEncQ : xEncQ,
      fieldChannel: xIsAggregate ? X : Y,
      fieldEncQ: xIsAggregate ? xEncQ : yEncQ,
      impute: contains(['area', 'line'], specQ.mark),
      stackBy: stackBy,
      offset: stacked || 'zero'
    };
  }
  return null;
}

export function hasWildcard(specQ: SpecQuery, opt: {exclude?: Property[]} = {}) {
  const exclude = opt.exclude ? toMap(opt.exclude.map(toKey)) : {};
  if (isWildcard(specQ.mark) && !exclude['mark']) {
    return true;
  }

  for (const encQ of specQ.encodings) {
    // TODO: implement more efficiently, just check only properties of encQ
    for (const key in encQ) {
      const parentProp = key as FlatProp;
      if (encQ.hasOwnProperty(parentProp) && isEncodingTopLevelProperty(parentProp)) {

        if(isWildcard(encQ[parentProp]) && !exclude[parentProp]) {
          return true;
        }

        const propObj = encQ[parentProp];
        for (const childProp in propObj) {
          if (propObj.hasOwnProperty(childProp) && !contains(['enum', 'name'] as (keyof Wildcard<any>)[], childProp)) {
            const prop: EncodingNestedProp = {
              parent: parentProp,
              child: childProp
            } as EncodingNestedProp;

            if (isWildcard(propObj[childProp]) && !exclude[toKey(prop)]) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}
