
import {isArray} from 'datalib/src/util';

import { SpecQueryModel, SpecQueryModelGroup } from './model';
import {Property} from './property';
import {PropIndex} from './propindex';
import {Dict} from './util';

import {parseGroupBy, GROUP_BY_FIELD_TRANSFORM, GROUP_BY_ENCODING} from './query/groupby';
import {spec as specShorthand, Replacer} from './query/shorthand';
import {SpecQuery} from './query/spec';
import {Nest} from './query/groupby';


/**
 * Registry for all possible grouping key functions.
 */
let groupRegistry: Dict<(specM: SpecQuery) => string> = {};

/**
 * Add a grouping function to the registry.
 */
export function registerKeyFn(name: string, keyFn: (specM: SpecQuery) => string) {
  groupRegistry[name] = keyFn;
}

export const FIELD = 'field';
export const FIELD_TRANSFORM = 'fieldTransform';
export const ENCODING = 'encoding';
export const SPEC = 'spec';

/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
export function nest(specModels: SpecQueryModel[], queryNest: Nest[]): SpecQueryModelGroup {
  if (queryNest) {
    const rootGroup: SpecQueryModelGroup = {
      name: '',
      path: '',
      items: [],
    };
    let groupIndex: Dict<SpecQueryModelGroup> = {};

    // global `includes` and `replaces` will get augmented by each level's groupBy.
    // Upper level's `groupBy` will get cascaded to lower-level groupBy.
    // `replace` can be overriden in a lower-level to support different grouping.
    let includes: Array<PropIndex<boolean>> = [];
    let replaces: Array<PropIndex<Dict<string>>> = [];
    let replacers: Array<PropIndex<Replacer>> = [];

    for (let l = 0 ; l < queryNest.length; l++) {
      includes.push(l > 0 ? includes[l-1].duplicate() : new PropIndex<boolean>());
      replaces.push(l > 0 ? replaces[l-1].duplicate() : new PropIndex<Dict<string>>());

      const groupBy = queryNest[l].groupBy;
      if (isArray(groupBy)) {
        // If group is array, it's an array of extended group by that need to be parsed
        let parsedGroupBy = parseGroupBy(groupBy, includes[l], replaces[l]);
        replacers.push(parsedGroupBy.replacer);
      }
    }

    // With includes and replacers, now we can construct the nesting tree

    specModels.forEach((specM) => {
      let path = '';
      let group: SpecQueryModelGroup = rootGroup;
      for (let l = 0 ; l < queryNest.length; l++) {
        const groupBy = group.groupBy = queryNest[l].groupBy;
        group.orderGroupBy = queryNest[l].orderGroupBy;

        const key = isArray(groupBy) ?
          specShorthand(specM.specQuery, includes[l], replacers[l]) :
          groupRegistry[groupBy](specM.specQuery);

        path += '/' + key;
        if (!groupIndex[path]) { // this item already exists on the path
          groupIndex[path] = {
            name: key,
            path: path,
            items: [],
          };

          group.items.push(groupIndex[path]);
        }
        group = groupIndex[path];
      }
      group.items.push(specM);
    });
    return rootGroup;
  } else {
    // no nesting, just return a flat group
    return {
      name: '',
      path: '',
      items: specModels,
    };
  }
}

// TODO: move this to groupBy, rename properly, and export
const GROUP_BY_FIELD = [Property.FIELD];
const PARSED_GROUP_BY_FIELD = parseGroupBy(GROUP_BY_FIELD);

export function getGroupByKey(specM: SpecQuery, groupBy: string) {
  return groupRegistry[groupBy](specM);
}

registerKeyFn(FIELD, (specQ: SpecQuery) => {
  return specShorthand(specQ,
    PARSED_GROUP_BY_FIELD.include,
    PARSED_GROUP_BY_FIELD.replacer
  );
});

export const PARSED_GROUP_BY_FIELD_TRANSFORM = parseGroupBy(GROUP_BY_FIELD_TRANSFORM);

registerKeyFn(FIELD_TRANSFORM, (specQ: SpecQuery) => {
  return specShorthand(specQ,
    PARSED_GROUP_BY_FIELD_TRANSFORM.include,
    PARSED_GROUP_BY_FIELD_TRANSFORM.replacer
  );
});


export const PARSED_GROUP_BY_ENCODING = parseGroupBy(GROUP_BY_ENCODING);

registerKeyFn(ENCODING, (specQ: SpecQuery) => {
  return specShorthand(specQ,
    PARSED_GROUP_BY_ENCODING.include,
    PARSED_GROUP_BY_ENCODING.replacer
  );
});

registerKeyFn(SPEC, (specQ: SpecQuery) => JSON.stringify(specQ));
