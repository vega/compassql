import {Channel} from 'vega-lite/src/channel';
import {isArray} from 'datalib/src/util';

import {SpecQueryModel, SpecQueryModelGroup} from './model';
import {Property} from './property';
import {Dict, duplicate} from './util';

import {parse as parseGroupBy, ExtendedGroupBy} from './query/groupby';
import {Query} from './query/query';
import {fieldDef as fieldDefShorthand, spec as specShorthand, Replacer} from './query/shorthand';
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
  if (query.nest) {
    const rootGroup: SpecQueryModelGroup = new SpecQueryModelGroup();
    let groupIndex: Dict<SpecQueryModelGroup> = {};

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
        var parsedGroupBy = parseGroupBy(groupBy, includes[l], replaces[l]);
        replacers.push(parsedGroupBy.replacer);
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
          groupIndex[path] = new SpecQueryModelGroup(key, path, []);

          group.items.push(groupIndex[path]);
        }
        group = groupIndex[path];
      }
      group.items.push(specM);
    });
    return rootGroup;
  } else {
    // no nesting, just return a flat group
    return new SpecQueryModelGroup('', '', specModels);
  }
}

// TODO: move this to groupBy, rename properly, and export
const GROUP_BY_FIELD = [Property.FIELD];
const PARSED_GROUP_BY_FIELD = parseGroupBy(GROUP_BY_FIELD, {}, {});

registerKeyFn(FIELD, (specM: SpecQueryModel) => {
  return specShorthand(specM.specQuery,
    PARSED_GROUP_BY_FIELD.include,
    PARSED_GROUP_BY_FIELD.replacer
  );
});

// TODO: move this to groupBy, rename properly, and export
const GROUP_BY_FIELD_TRANSFORM = [
  Property.FIELD, Property.TYPE,
  Property.AGGREGATE, Property.BIN, Property.TIMEUNIT, Property.STACK
];
const PARSED_GROUP_BY_FIELD_TRANSFORM = parseGroupBy(GROUP_BY_FIELD_TRANSFORM, {}, {});

registerKeyFn(FIELD_TRANSFORM, (specM: SpecQueryModel) => {
  return specShorthand(specM.specQuery,
    PARSED_GROUP_BY_FIELD_TRANSFORM.include,
    PARSED_GROUP_BY_FIELD_TRANSFORM.replacer
  );
});

// TODO: move this to groupBy, rename properly, and export
const GROUP_BY_ENCODING = (GROUP_BY_FIELD_TRANSFORM as Array<Property | ExtendedGroupBy>).concat([
  {
    property: Property.CHANNEL,
    replace: {
      'x': 'xy', 'y': 'xy',
      'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
      'row': 'facet', 'column': 'facet'
    }
  }
]);
const PARSED_GROUP_BY_ENCODING = parseGroupBy(GROUP_BY_ENCODING, {}, {});


function stringifyStack(specM: SpecQueryModel) {
  const _stack = stack(specM.specQuery);
  return (!!_stack ? 'stack=' + _stack.offset + '|' : '');
}

registerKeyFn(ENCODING, (specM: SpecQueryModel) => {
  return specShorthand(specM.specQuery,
    PARSED_GROUP_BY_ENCODING.include,
    PARSED_GROUP_BY_ENCODING.replacer
  );
});

// TODO: rename, provide similar format
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
