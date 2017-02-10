import {isArray} from 'datalib/src/util';
export {cmp, keys, duplicate, extend, isObject, isArray, isBoolean, toMap} from 'datalib/src/util';

export interface Dict<T> {
  [key: string]: T;
}

export function contains(array: any[], item: any) {
  return array.indexOf(item) !== -1;
};

export function every<T>(arr: T[], f: (item: T, key: number) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    if (!f(arr[i], i)) {
      return false;
    }
  }
  return true;
};

export function forEach(obj: any, f: (item: any, key: number|string, i: number)=>void, thisArg?: any) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (let k in obj) {
      f.call(thisArg, obj[k], k, obj);
    }
  }
};

export function some<T>(arr: T[], f: (item: T, key: number|string, i: number)=>boolean) {
  let i = 0, k;
  for (k in arr) {
    if (f(arr[k], k, i++)) {
      return true;
    }
  }
  return false;
};

export function nestedMap(array: any[], f: (item: any)=>any): any[] {
  return array.map((a) => {
    if (isArray(a)) {
      return nestedMap(a, f);
    }
    return f(a);
  });
}

/** Returns the array without the elements in item */
export function without<T>(array: Array<T>, excludedItems: Array<T>) {
  return array.filter(function(item) {
    return !contains(excludedItems, item);
  });
}
