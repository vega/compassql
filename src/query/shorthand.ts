import {AGGREGATE_OPS} from 'vega-lite/src/aggregate';
import {Channel, CHANNELS} from 'vega-lite/src/channel';
import {Formula} from 'vega-lite/src/transform';
import {ExtendedUnitSpec} from 'vega-lite/src/spec';
import {SINGLE_TIMEUNITS, MULTI_TIMEUNITS} from 'vega-lite/src/timeunit';
import {Type, TYPE_FROM_SHORT_TYPE} from 'vega-lite/src/type';
import {toMap, isString} from 'datalib/src/util';

import {EncodingQuery} from './encoding';
import {SpecQuery, stack, fromSpec} from './spec';

import {isWildcard, SHORT_WILDCARD} from '../wildcard';
import {getNestedEncodingPropertyChildren, Property, DEFAULT_PROPERTY_PRECEDENCE} from '../property';
import {Dict, extend, keys, isArray} from '../util';

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
  if (isWildcard(v)) {
    // Return the enum array if it's a full enum spec, or just return SHORT_WILDCARD for short ones.
    if (v.enum) {
      return SHORT_WILDCARD + JSON.stringify(v.enum);
    } else {
      return SHORT_WILDCARD;
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

  if (specQ.encodings) {
    const encodings = specQ.encodings.reduce((encQs, encQ) => {
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
        .join('|');

    if (encodings) {
      parts.push(encodings);
    }
  }

  return parts.join('|');
}

export function calculate(formulaArr: Formula[]): string {
  return JSON.stringify(
    formulaArr.reduce((m, calculateItem) => {
      m[calculateItem.field] = calculateItem.expr;
      return m;
    }, {})
  );
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
 * Returns a field definition shorthand for an encoding query
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
  } else if (include[Property.AGGREGATE] && encQ.aggregate && !isWildcard(encQ.aggregate)) {
    fn = replace(encQ.aggregate, replacer[Property.AGGREGATE]);
  } else if (include[Property.AGGREGATE] && encQ.autoCount && !isWildcard(encQ.autoCount)) {
    fn = replace('count', replacer[Property.AGGREGATE]);;
  } else if (include[Property.TIMEUNIT] && encQ.timeUnit && !isWildcard(encQ.timeUnit)) {
    fn = replace(encQ.timeUnit, replacer[Property.TIMEUNIT]);
  } else if (include[Property.BIN] && encQ.bin && !isWildcard(encQ.bin)) {
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
      if (include[prop] && encQ[prop] && isWildcard(encQ[prop])) {
        fn = SHORT_WILDCARD + '';

        // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_WILDCARD
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
    if (!isWildcard(encQ.channel) && !PROPERTY_SUPPORTED_CHANNELS[nestedPropParent][encQ.channel as Channel]) {
      continue;
    }

    if (include[nestedPropParent]) {
      if (encQ[nestedPropParent] && !isWildcard(encQ[nestedPropParent])) {
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
    if (isWildcard(encQ.type)) {
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

const CHANNEL_INDEX = toMap(CHANNELS);
const AGGREGATE_OP_INDEX = toMap(AGGREGATE_OPS);
const SINGLE_TIMEUNIT_INDEX = toMap(SINGLE_TIMEUNITS);
const MULTI_TIMEUNIT_INDEX = toMap(MULTI_TIMEUNITS);

export function parse(shorthand: string): SpecQuery {
  // TODO(https://github.com/uwdata/compassql/issues/259):
  // Do not split directly, but use an upgraded version of `getClosingBraceIndex()`
  let splitShorthand = shorthand.split('|');

  let specQ: SpecQuery = {mark: splitShorthand[0], encodings: [] as EncodingQuery[]};

  for (let i = 1; i < splitShorthand.length; i++) {
    let part = splitShorthand[i];
    const splitPart = splitWithTail(part, ':', 1);
    const splitPartKey = splitPart[0];
    const splitPartValue = splitPart[1];

    if (CHANNEL_INDEX[splitPartKey] || splitPartKey === '?') {
      const encQ = shorthandParser.encoding(splitPartKey, splitPartValue);
      specQ.encodings.push(encQ);
      continue;
    }

    if (splitPartKey === 'calculate') {
      specQ.transform = specQ.transform || {};
      let calculate: Formula[] = [];
      let fieldExprMapping = JSON.parse(splitPartValue);

      for (let field in fieldExprMapping) {
        calculate.push({field: field, expr: fieldExprMapping[field]});
      }

      specQ.transform.calculate = calculate;
      continue;
    }

    if (splitPartKey === 'filter') {
      specQ.transform = specQ.transform || {};
      specQ.transform.filter = JSON.parse(splitPartValue);
      continue;
    }

    if (splitPartKey === 'filterInvalid') {
      specQ.transform = specQ.transform || {};
      specQ.transform.filterInvalid = JSON.parse(splitPartValue);
      continue;
    }
  }

  return specQ;
}

/**
 * Split a string n times into substrings with the specified delimiter and return them as an array.
 * @param str The string to be split
 * @param delim The delimiter string used to separate the string
 * @param number The value used to determine how many times the string is split
 */
export function splitWithTail(str: string, delim: string, count: number): string[] {
  let result = [];
  let lastIndex = 0;

  for (let i = 0; i < count; i++) {
    let indexOfDelim = str.indexOf(delim, lastIndex);

    if (indexOfDelim !== -1) {
      result.push(str.substring(lastIndex, indexOfDelim));
      lastIndex = indexOfDelim + 1;
    } else {
      break;
    }
  }

  result.push(str.substr(lastIndex));

  // If the specified count is greater than the number of delimiters that exist in the string,
  // an empty string will be pushed count minus number of delimiter occurence times.
  if (result.length !== count + 1) {
    while (result.length !== count + 1) {
      result.push('');
    }
  }

  return result;
}

export namespace shorthandParser {
  export function encoding(channel: string, fieldDefShorthand: string): EncodingQuery {
    let encQ: EncodingQuery = {channel: channel};

    if (fieldDefShorthand.indexOf('(') !== -1) {
      encQ = fn(encQ, fieldDefShorthand);
    } else {
      encQ = rawFieldDef(encQ, splitWithTail(fieldDefShorthand, ',', 2));
    }

    return encQ;
  }

  export function rawFieldDef(encQ: EncodingQuery, fieldDefPart: string[]): EncodingQuery {
    encQ.field = fieldDefPart[0];
    encQ.type = TYPE_FROM_SHORT_TYPE[fieldDefPart[1].toUpperCase()] || '?';

    let partParams = fieldDefPart[2];
    let closingBraceIndex = 0;

    // FIXME: don't use a loop
    // FIXME: separate maxbins from nestedPropertyParent and support other bin properties
    for (let nestedPropertyParent of ['maxbins', 'scale', 'sort', 'axis', 'legend']) {
      let nestedPropertyParentIndex = partParams.indexOf(nestedPropertyParent, closingBraceIndex);
      if (nestedPropertyParentIndex !== -1) {
        if (partParams[nestedPropertyParentIndex + nestedPropertyParent.length + 1] === '{') {
          let openingBraceIndex = nestedPropertyParentIndex + nestedPropertyParent.length + 1;
          closingBraceIndex = getClosingBraceIndex(openingBraceIndex, partParams);
          encQ[nestedPropertyParent] = JSON.parse(partParams.substring(openingBraceIndex, closingBraceIndex + 1));

        } else {
          // Substring until the next comma (or end of the string)
          let nextCommaIndex = partParams.indexOf(',', nestedPropertyParentIndex + nestedPropertyParent.length);
          if (nextCommaIndex === -1) {
            nextCommaIndex = partParams.length;
          }

          let parsedValue = JSON.parse(
            partParams.substring(
              nestedPropertyParentIndex + nestedPropertyParent.length + 1,
              nextCommaIndex
            )
          );

          // TODO(https://github.com/uwdata/compassql/issues/97): Make this generalized for other bin properties.
          if (nestedPropertyParent === 'maxbins') {
            encQ.bin['maxbins'] = parsedValue;
          } else {
            encQ[nestedPropertyParent] = parsedValue;
          }
        }
      }
    }

    return encQ;
  }

  // TODO(https://github.com/uwdata/compassql/issues/259):
  // Extend this to support nested braces and brackets
  export function getClosingBraceIndex(openingBraceIndex: number, str: string): number {
    for (let i = openingBraceIndex; i < str.length; i++) {
      if (str[i] === '}') {
        return i;
      }
    }
  }

  export function fn(encQ: EncodingQuery, fieldDefShorthand: string): EncodingQuery {
    // Aggregate, Bin, TimeUnit as wildcard case
    if (fieldDefShorthand[0] === '?') {
      let closingBraceIndex = getClosingBraceIndex(1, fieldDefShorthand);

      let fnEnumIndex = JSON.parse(fieldDefShorthand.substring(1, closingBraceIndex + 1));

      for (let encodingProperty in fnEnumIndex) {
        if (isArray(fnEnumIndex[encodingProperty])) {
          encQ[encodingProperty] = {enum: fnEnumIndex[encodingProperty]};
        } else { // Definitely a `SHORT_WILDCARD`
          encQ[encodingProperty] = fnEnumIndex[encodingProperty];
        }
      }

      return rawFieldDef(encQ,
        splitWithTail(fieldDefShorthand.substring(closingBraceIndex + 2, fieldDefShorthand.length - 1), ',', 2)
      );
    } else {
      let func = fieldDefShorthand.substring(0, fieldDefShorthand.indexOf('('));
      let insideFn = fieldDefShorthand.substring(func.length + 1, fieldDefShorthand.length - 1);
      let insideFnParts = splitWithTail(insideFn, ',', 2);

      if (AGGREGATE_OP_INDEX[func]) {
        encQ.aggregate = func;
        return rawFieldDef(encQ, insideFnParts);
      } else if (MULTI_TIMEUNIT_INDEX[func] || SINGLE_TIMEUNIT_INDEX[func]) {
        encQ.timeUnit = func;
        return rawFieldDef(encQ, insideFnParts);
      } else if (func === 'bin') {
        encQ.bin = {};
        return rawFieldDef(encQ, insideFnParts);
      }
    }
  }
}
