import {Type} from 'vega-lite/src/type';

import {EncodingQuery} from './encoding';
import {SpecQuery, stack} from './spec';
import {enumSpecShort, isEnumSpec, SHORT_ENUM_SPEC} from '../enumspec';

import {getNestedEncodingPropertyChild, Property} from '../property';
import {keys} from '../util';

export function spec(specQ: SpecQuery): string {
  const mark = enumSpecShort(specQ.mark);
  const encodings = specQ.encodings.map(encoding)
                        .sort()
                        .join('|');  // sort at the end to ignore order
  const _stack = stack(specQ);

  return mark + '|' +
      // TODO: transform
      (_stack ? 'stack=' + _stack.offset + '|' : '') +
      encodings;
}

export function encoding(encQ: EncodingQuery): string {
  return enumSpecShort(encQ.channel) + ':' + fieldDef(encQ);
}

export function fieldDef(encQ: EncodingQuery): string {
  let fn = null;
  const params: {key: string, value: any}[]=  [];

  if (encQ.autoCount === false) {
    return '-';
  }

  if (encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
    fn = encQ.aggregate;
  } else if (encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
    fn = encQ.timeUnit;
  } else if (encQ.bin && !isEnumSpec(encQ.bin)) {
    fn = 'bin';
    if (encQ.bin['maxbins']) {
      params.push({key: 'maxbins', value: encQ.bin['maxbins']});
    }
  } else if (encQ.autoCount && !isEnumSpec(encQ.autoCount)) {
    fn = 'count';
  } else if (
      (encQ.aggregate && isEnumSpec(encQ.aggregate)) ||
      (encQ.autoCount && isEnumSpec(encQ.autoCount)) ||
      (encQ.timeUnit && isEnumSpec(encQ.timeUnit)) ||
      (encQ.bin && isEnumSpec(encQ.bin))
    ) {
    fn = SHORT_ENUM_SPEC + '';
  }

  // Scale
  // TODO: convert this chunk into a loop of scale, axis, legend
  if (encQ.scale && !isEnumSpec(encQ.scale)) {
      if (encQ.scale && !isEnumSpec(encQ.scale)) {

        const scaleParamsArr = getNestedEncodingPropertyChild(Property.SCALE);
        var scaleParams = scaleParamsArr.reduce((scaleParamsObj, param: any) => {
            if (encQ.scale[param]) {
              scaleParamsObj[param] = encQ.scale[param];
            }
            return scaleParamsObj;
        }, {});

         if(keys(scaleParams).length > 0) {
          params.push({
            key: 'scale',
            value: JSON.stringify(scaleParams)
          });
        }
    }
  } else if (encQ.scale === false || encQ.scale === null) {
    params.push({
      key: 'scale',
      value: false
    });
  }



  const fieldType = enumSpecShort(encQ.field || '*') + ',' +
    enumSpecShort(encQ.type || Type.QUANTITATIVE).substr(0,1) +
    params.map((p) => ',' + p.key + '=' + p.value).join('');
  return (fn ? fn + '(' + fieldType + ')' : fieldType);
}
