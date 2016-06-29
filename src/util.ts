import {isArray} from 'datalib/src/util';
export {keys, duplicate, extend} from 'datalib/src/util';

export interface Dict<T> {
  [key: string]: T;
}

export function contains(array: any[], item: any) {
  return array.indexOf(item) !== -1;
};

export function every(arr, f) {
    var i = 0, k;
    for (k in arr) {
      if (!f(arr[k], k, i++)) {
        return false;
      }
    }
    return true;
};

export function forEach(obj, f, thisArg?) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (var k in obj) {
      f.call(thisArg, obj[k], k, obj);
    }
  }
};

export function some(arr, f) {
    var i = 0, k;
    for (k in arr) {
      if (f(arr[k], k, i++)) {
        return true;
      }
    }
    return false;
};

export function nestedMap(array: any[], f): any[] {
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
