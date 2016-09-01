import {AGGREGATE_OPS} from 'vega-lite/src/aggregate';
import {Channel, CHANNELS} from 'vega-lite/src/channel';
import {Formula} from 'vega-lite/src/transform';
import {ExtendedUnitSpec} from 'vega-lite/src/spec';
import {SINGLE_TIMEUNITS, MULTI_TIMEUNITS} from 'vega-lite/src/timeunit';
import {Type, TYPE_FROM_SHORT_TYPE} from 'vega-lite/src/type';
import {toMap, isString} from 'datalib/src/util';

import {EncodingQuery} from './encoding';
import {SpecQuery, stack, fromSpec} from './spec';
import {TransformQuery} from './transform';

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

export function value(v: any, replace: Replacer): any {
  if (isEnumSpec(v)) {
    return SHORT_ENUM_SPEC;
  }
  if (replace) {
    return replace(v);
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
    // TODO(https://github.com/uwdata/compassql/issues/260)
    // This should be in the form {field1:expr1,field2:expr2, ... ,fieldN:exprN}
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
 * Returns a field definition shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
export function fieldDef(encQ: EncodingQuery,
    include: Dict<boolean> = INCLUDE_ALL,
    replace: Dict<Replacer> = {}): string {

  let fn = null, fnEnumIndex = null;

  /** Encoding properties e.g., Scale, Axis, Legend */
  const props: {key: string, value: boolean | Object}[] = [];

  if (include[Property.AGGREGATE] && encQ.autoCount === false) {
    return '-';
  } else if (include[Property.AGGREGATE] && encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
    fn = value(encQ.aggregate, replace[Property.AGGREGATE]);
  } else if (include[Property.AGGREGATE] && encQ.autoCount && !isEnumSpec(encQ.autoCount)) {
    fn = value('count', replace[Property.AGGREGATE]);;
  } else if (include[Property.TIMEUNIT] && encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
    fn = value(encQ.timeUnit, replace[Property.TIMEUNIT]);
  } else if (include[Property.BIN] && encQ.bin && !isEnumSpec(encQ.bin)) {
    fn = 'bin';

    // TODO(https://github.com/uwdata/compassql/issues/97):
    // extract this as a method that support other bin properties
    if (include[Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
      props.push({
        key: 'maxbins',
        value: value(encQ.bin['maxbins'], replace[Property.BIN_MAXBINS])
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
              value: value(encQ.bin['maxbins'], replace[Property.BIN_MAXBINS])
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
              p[nestedProp.child] = value(encQ[nestedPropParent][nestedProp.child], replace[nestedProp.property]);
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
  let fieldAndParams = include[Property.FIELD] ? value(encQ.field || '*', replace[Property.FIELD]) : '...';
  // type
  if (include[Property.TYPE]) {
    const typeShort = ((encQ.type || Type.QUANTITATIVE)+'').substr(0,1);
    fieldAndParams += ',' + value(typeShort, replace[Property.TYPE]);
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
      shorthandParser.encoding(specQ, splitPartKey, splitPartValue);
      continue;
    }

    if (splitPartKey === 'calculate') {
      shorthandParser.calculate(specQ, splitPartValue);
      continue;
    }

    if (splitPartKey === 'filter') {
      shorthandParser.filter(specQ, splitPartValue);
      continue;
    }

    if (splitPartKey === 'filterInvalid') {
      shorthandParser.filterInvalid(specQ, splitPartValue);
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
export function splitWithTail(str: string, delim: string, count: number) {
  let parts = str.split(delim);
  let tail = parts.slice(count).join(delim);
  let result = parts.slice(0, count);
  result.push(tail);
  return result;
}

export namespace shorthandParser {
  export function encoding(specQ: SpecQuery, channel: string, fieldDefShorthand: string) {
    let encQ: EncodingQuery = {channel: channel};

    if (fieldDefShorthand.indexOf('(') !== -1) {
      encQ = fn(encQ, fieldDefShorthand);
    } else {
      encQ = rawFieldDef(encQ, splitWithTail(fieldDefShorthand, ',', 2));
    }

    specQ.encodings.push(encQ);
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
    // Aggregate, Bin, TimeUnit as enum spec case
    if (fieldDefShorthand[0] === '?') {
      let closingBraceIndex = getClosingBraceIndex(1, fieldDefShorthand);
      let enumFnString = fieldDefShorthand.substring(2, closingBraceIndex);
      let enumFnValuePairs = enumFnString.split(',');

      for (let enumFnValuePair of enumFnValuePairs) {
        let fnValue = enumFnValuePair.split(':');
        encQ[JSON.parse(fnValue[0])] = JSON.parse(fnValue[1]);
      }

      return rawFieldDef(encQ,
        splitWithTail(fieldDefShorthand.substring(closingBraceIndex + 2, fieldDefShorthand.length), ',', 2)
      );
    } else {
      let func = fieldDefShorthand.substring(0, fieldDefShorthand.indexOf('('));
      let insideFn = fieldDefShorthand.substring(func.length + 1, fieldDefShorthand.length - 1);
      let insideFnParts = splitWithTail(insideFn, ',', 2);

      if (AGGREGATE_OP_INDEX[func]) {
        return aggregate(encQ, func, insideFnParts);
      } else if (MULTI_TIMEUNIT_INDEX[func] || SINGLE_TIMEUNIT_INDEX[func]) {
        return timeUnit(encQ, func, insideFnParts);
      } else if (func === 'bin') {
        return bin(encQ, func, insideFnParts);
      }
    }
  }

  export function aggregate(encQ: EncodingQuery, aggregate: string, insideFnParts: string[]): EncodingQuery {
    encQ.aggregate = aggregate;
    return rawFieldDef(encQ, insideFnParts);
  }

  export function timeUnit(encQ: EncodingQuery, timeUnit: string, insideFnParts: string[]): EncodingQuery {
    encQ.timeUnit = timeUnit;
    return rawFieldDef(encQ, insideFnParts);
  }

  export function bin(encQ: EncodingQuery, bin: string, insideFnParts: string[]): EncodingQuery {
    encQ.bin = {};
    return rawFieldDef(encQ, insideFnParts);
  }

  export function calculate(specQ: SpecQuery, splitPartValue: string) {
    let transformQ: TransformQuery = specQ.transform || {};

    let calculate = [];
    let formulas = splitPartValue.split(',');

    for (let formulaString of formulas) {
      let formula: Formula = {} as Formula;
      // FIXME(https://github.com/uwdata/compassql/issues/260)
      let formulaParts = formulaString.split(':');
      formula.field = formulaParts[0].substr(1);
      formula.expr = formulaParts[1].slice(0, -1);
      calculate.push(formula);
    }

    transformQ.calculate = calculate;
    specQ.transform = transformQ;
  }

  export function filter(specQ: SpecQuery, splitPartValue: string) {
    let transformQ: TransformQuery = specQ.transform || {};
    transformQ.filter = JSON.parse(splitPartValue);
    specQ.transform = transformQ;
  }

  export function filterInvalid(specQ: SpecQuery, invalid: string) {
    let transformQ: TransformQuery = specQ.transform || {};
    transformQ.filterInvalid = JSON.parse(invalid);
    specQ.transform = transformQ;
  }
}
