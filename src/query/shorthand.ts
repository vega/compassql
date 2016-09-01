import {Channel} from 'vega-lite/src/channel';
import {Formula} from 'vega-lite/src/transform';
import {ExtendedUnitSpec} from 'vega-lite/src/spec';
import {Type} from 'vega-lite/src/type';
import {isString} from 'datalib/src/util';

import {EncodingQuery} from './encoding';
import {SpecQuery, stack, fromSpec} from './spec';
import {isEnumSpec, SHORT_ENUM_SPEC} from '../enumspec';

import {getNestedEncodingPropertyChildren, Property, DEFAULT_PROPERTY_PRECEDENCE} from '../property';
import {Dict, extend, keys} from '../util';

export type Replacer = (s: string) => string;

export function getReplacerIndex(replaceIndex: Dict<Dict<string>>): Dict<Replacer> {
  return keys(replaceIndex).reduce((fnIndex, prop: string) => {
    fnIndex[prop] = getReplacer(replaceIndex[prop]);
    return fnIndex;
  }, {});
}

export function getReplacer(replace: Dict<string>): Replacer {
  return (s: string) => {
    if (replace[s] !== undefined) {
      return replace[s];
    }
    return s;
  };
}

export function value(v: any, replacer: Replacer): any {
  if (isEnumSpec(v)) {
    // Return the enum array if it's a full enum spec, or just return SHORT_ENUM_SPEC for short ones.
    if (v.enum) {
      return SHORT_ENUM_SPEC + JSON.stringify(v.enum);
    } else {
      return SHORT_ENUM_SPEC;
    }
  }
  if (replacer) {
    return replacer(v);
  }
  return v;
}

export function replace(v: any, replacer: Replacer): any {
  if (replacer) {
    return replacer(v);
  }
  return v;
}

export const INCLUDE_ALL: Dict<boolean> =
  // TODO: remove manual STACK, FILTER, CALCULATE concat once we really support enumerating it.
  DEFAULT_PROPERTY_PRECEDENCE.concat([Property.CALCULATE, Property.FILTER, Property.FILTERINVALID, Property.STACK])
    .reduce((m, prop) => {
      m[prop] = true;
      return m;
    }, {} as Dict<boolean>);


export function vlSpec(vlspec: ExtendedUnitSpec,
    include: Dict<boolean> = INCLUDE_ALL,
    replace: Dict<Replacer> = {}) {
  const specQ = fromSpec(vlspec);
  return spec(specQ);
}

export const PROPERTY_SUPPORTED_CHANNELS = {
  axis: {x: true, y: true, row: true, column: true},
  legend: {color: true, opacity: true, size: true, shape: true},
  scale: {x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true},
  sort: {x: true, y: true, path: true, order: true}
};

/**
 * Returns a shorthand for a spec query
 * @param specQ a spec query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
export function spec(specQ: SpecQuery,
    include: Dict<boolean> = INCLUDE_ALL,
    replace: Dict<Replacer> = {}
    ): string {
  const parts = [];

  if (include[Property.MARK]) {
    parts.push(value(specQ.mark, replace[Property.MARK]));
  }

  if (specQ.transform) {
    if (include[Property.CALCULATE]) {
      if (specQ.transform.calculate !== undefined) {
        parts.push('calculate:' + calculate(specQ.transform.calculate));
      }
    }

    if (include[Property.FILTER]) {
      if (specQ.transform.filter !== undefined) {
        parts.push('filter:' + JSON.stringify(specQ.transform.filter));
      }
    }

    if (include[Property.FILTERINVALID]) {
      if (specQ.transform.filterInvalid !== undefined) {
        parts.push('filterInvalid:' + specQ.transform.filterInvalid);
      }
    }
  }

  // TODO: extract this to its own stack method
  if (include[Property.STACK]) {
    const _stack = stack(specQ);
    if (_stack) {
      // TODO: Refactor this once we have child stack property.

      // Exclude type since we don't care about type in stack
      const includeExceptType = extend({}, include, {type: false});

      const field = fieldDef(_stack.fieldEncQ, includeExceptType, replace);
      const groupby = fieldDef(_stack.groupByEncQ, includeExceptType, replace);

      parts.push(
        'stack={field:' + field + ',' +
        (groupby ? 'by:' + groupby + ',' : '') +
        'offset:' + _stack.offset + '}'
      );
    }
  }

  parts.push(
    specQ.encodings.reduce((encQs, encQ) => {
        // Exclude encoding mapping with autoCount=false as they are basically disabled.
        if (encQ.autoCount !== false) {
          const str = encoding(encQ, include, replace);
          if (str) { // only add if the shorthand isn't an empty string.
            encQs.push(str);
          }
        }
        return encQs;
      }, [])
      .sort() // sort at the end to ignore order
      .join('|')
  );

  return parts.join('|');
}

export function calculate(formulaArr: Formula[]): string {
  return formulaArr.map(function(calculateItem) {
    return `{${calculateItem.field}:${calculateItem.expr}}`;
  }).join(',');
}

/**
 * Returns a shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
export function encoding(encQ: EncodingQuery,
    include: Dict<boolean> = INCLUDE_ALL,
    replace: Dict<Replacer> = {}
    ): string {

  const parts = [];
  if (include[Property.CHANNEL]) {
    parts.push(value(encQ.channel, replace[Property.CHANNEL]));
  }
  const fieldDefStr = fieldDef(encQ, include, replace);
  if (fieldDefStr) {
    parts.push(fieldDefStr);
  }
  return parts.join(':');
}

/**
 * Returns a field definiton shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
export function fieldDef(encQ: EncodingQuery,
    include: Dict<boolean> = INCLUDE_ALL,
    replacer: Dict<Replacer> = {}): string {

  let fn = null, fnEnumIndex = null;

  /** Encoding properties e.g., Scale, Axis, Legend */
  const props: {key: string, value: boolean | Object}[] = [];

  if (include[Property.AGGREGATE] && encQ.autoCount === false) {
    return '-';
  } else if (include[Property.AGGREGATE] && encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
    fn = replace(encQ.aggregate, replacer[Property.AGGREGATE]);
  } else if (include[Property.AGGREGATE] && encQ.autoCount && !isEnumSpec(encQ.autoCount)) {
    fn = replace('count', replacer[Property.AGGREGATE]);;
  } else if (include[Property.TIMEUNIT] && encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
    fn = replace(encQ.timeUnit, replacer[Property.TIMEUNIT]);
  } else if (include[Property.BIN] && encQ.bin && !isEnumSpec(encQ.bin)) {
    fn = 'bin';

    // TODO(https://github.com/uwdata/compassql/issues/97):
    // extract this as a method that support other bin properties
    if (include[Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
      props.push({
        key: 'maxbins',
        value: value(encQ.bin['maxbins'], replacer[Property.BIN_MAXBINS])
      });
    }
  } else {
    for (const prop of [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN]) {
      if (include[prop] && encQ[prop] && isEnumSpec(encQ[prop])) {
        fn = SHORT_ENUM_SPEC + '';

        // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_ENUM_SPEC
        fnEnumIndex = fnEnumIndex || {};
        fnEnumIndex[prop] = encQ[prop].enum || encQ[prop];

        if (prop === Property.BIN) {
          // TODO(https://github.com/uwdata/compassql/issues/97):
          // extract this as a method that support other bin properties
          if (include[Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
            props.push({
              key: 'maxbins',
              value: value(encQ.bin['maxbins'], replacer[Property.BIN_MAXBINS])
            });
          }
        }
      }
    }
    if (fnEnumIndex && encQ.hasFn) {
      fnEnumIndex.hasFn = true;
    }
  }

  for (const nestedPropParent of [Property.SCALE, Property.SORT, Property.AXIS, Property.LEGEND]) {
    if (!isEnumSpec(encQ.channel) && !PROPERTY_SUPPORTED_CHANNELS[nestedPropParent][encQ.channel as Channel]) {
      continue;
    }

    if (include[nestedPropParent]) {
      if (encQ[nestedPropParent] && !isEnumSpec(encQ[nestedPropParent])) {
        // `sort` can be a string (ascending/descending).
        if (isString(encQ[nestedPropParent])) {
          props.push({
            key: nestedPropParent + '',
            value: JSON.stringify(encQ[nestedPropParent])
          });
        } else {
          const nestedProps = getNestedEncodingPropertyChildren(nestedPropParent);
          const nestedPropChildren = nestedProps.reduce((p, nestedProp) => {
            if (include[nestedProp.property] && encQ[nestedPropParent][nestedProp.child] !== undefined) {
              p[nestedProp.child] = replace(encQ[nestedPropParent][nestedProp.child], replacer[nestedProp.property]);
            }
            return p;
          }, {});

          if(keys(nestedPropChildren).length > 0) {
            props.push({
              key: nestedPropParent + '',
              value: JSON.stringify(nestedPropChildren)
            });
          }
        }
      } else if (encQ[nestedPropParent] === false || encQ[nestedPropParent] === null) {
        // `scale`, `axis`, `legend` can be false/null.
        props.push({
          key: nestedPropParent + '',
          value: false
        });
      }
    }
  }

  // field
  let fieldAndParams = include[Property.FIELD] ? value(encQ.field || '*', replacer[Property.FIELD]) : '...';
  // type
  if (include[Property.TYPE]) {
    if (isEnumSpec(encQ.type)) {
      fieldAndParams += ',' + value(encQ.type, replacer[Property.TYPE]);
    } else {
      const typeShort = ((encQ.type || Type.QUANTITATIVE)+'').substr(0,1);
      fieldAndParams += ',' + value(typeShort, replacer[Property.TYPE]);
    }
  }
  // encoding properties
  fieldAndParams += props.map((p) => ',' + p.key + '=' + p.value).join('');
  if (fn) {
    return fn + (fnEnumIndex ? JSON.stringify(fnEnumIndex) : '') + '(' + fieldAndParams + ')';
  }
  return fieldAndParams;
}
