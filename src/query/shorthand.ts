import {Type} from 'vega-lite/src/type';

import {EncodingQuery} from './encoding';
import {SpecQuery, stack} from './spec';
import {isEnumSpec, SHORT_ENUM_SPEC} from '../enumspec';

import {getNestedEncodingPropertyChildren, Property, DEFAULT_PROPERTY_PRECEDENCE} from '../property';
import {Dict, keys} from '../util';

export function enumSpecShort(value: any): any {
  return (isEnumSpec(value) ? SHORT_ENUM_SPEC : value);
}

const INCLUDE_ALL: Dict<boolean> = DEFAULT_PROPERTY_PRECEDENCE.reduce((m, prop) => {
  m[prop] = true;
  return m;
}, {} as Dict<boolean>);

export function spec(specQ: SpecQuery, include: Dict<boolean> = INCLUDE_ALL): string {
  const parts = [];

  if (include[Property.MARK]) {
    parts.push(enumSpecShort(specQ.mark));
  }

  // TODO: transform

  // TODO: stack Property
  const _stack = stack(specQ);
  if (_stack) {
    parts.push('stack=' + _stack.offset);
  }

  parts.push(specQ.encodings.map((encQ) => encoding(encQ))
                        .sort()
                        .join('|'));  // sort at the end to ignore order

  return parts.join('|');
}

export function encoding(encQ: EncodingQuery, include: Dict<boolean> = INCLUDE_ALL): string {
  const parts = [];
  if (include[Property.CHANNEL]) {
    parts.push(enumSpecShort(encQ.channel));
  }

  parts.push(fieldDef(encQ, include)); // fieldDef is never empty
  return parts.join(':');
}

export function fieldDef(encQ: EncodingQuery, include: Dict<boolean> = INCLUDE_ALL): string {
  let fn = null;

  /** Encoding properties e.g., Scale, Axis, Legend */
  const props: {key: string, value: boolean | Object}[] = [];

  if (encQ.autoCount === false) {
    return '-';
  }

  if (include[Property.AGGREGATE] && encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
    fn = encQ.aggregate;
  } else if (include[Property.TIMEUNIT] && encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
    fn = encQ.timeUnit;
  } else if (include[Property.BIN] && encQ.bin && !isEnumSpec(encQ.bin)) {
    fn = 'bin';

    if (include[Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
      props.push({key: 'maxbins', value: encQ.bin['maxbins']});
    }
  } else if (include[Property.AGGREGATE] && encQ.autoCount && !isEnumSpec(encQ.autoCount)) {
    fn = 'count';
  } else {
    for (const prop of [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN]) {
      if (include[prop] && encQ[prop] && isEnumSpec(encQ[prop])) {
        fn = SHORT_ENUM_SPEC + '';
        break;
      }
    }
  }

  // Scale
  // TODO: axis, legend
  for (const nestedPropParent of [Property.SCALE]) {
    if (include[nestedPropParent]) {
      if (encQ[nestedPropParent] && !isEnumSpec(encQ[nestedPropParent])) {
        const nestedProps = getNestedEncodingPropertyChildren(nestedPropParent);
        const nestedPropChildren = nestedProps.reduce((p, nestedProp) => {
          if (include[nestedProp.property] && encQ[nestedPropParent][nestedProp.child] !== undefined) {
            p[nestedProp.child] = enumSpecShort(encQ[nestedPropParent][nestedProp.child]);
          }
          return p;
        }, {});

        if(keys(nestedPropChildren).length > 0) {
          props.push({
            key: nestedPropParent + '',
            value: JSON.stringify(nestedPropChildren)
          });
        }
      } else if (encQ[nestedPropParent] === false || encQ[nestedPropParent] === null) {
        props.push({
          key: nestedPropParent + '',
          value: false
        });
      }
    }
  }

  // field
  let fieldAndParams = include[Property.FIELD] ? enumSpecShort(encQ.field || '*') : '...';
  // type
  if (include[Property.TYPE]) {
    fieldAndParams += ',' + enumSpecShort(encQ.type || Type.QUANTITATIVE).substr(0,1);
  }
  // encoding properties
  fieldAndParams += props.map((p) => ',' + p.key + '=' + p.value).join('');
  return (fn ? fn + '(' + fieldAndParams + ')' : fieldAndParams);
}
