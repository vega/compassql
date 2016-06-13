export interface Dict<T> {
  [key: string]: T;
}

export function contains(array: any[], item: any) {
  return array.indexOf(item) !== -1;
};

export function keys(obj) {
  var k = [], x;
  for (x in obj) {
    k.push(x);
  }
  return k;
};

export function duplicate(obj) {
  return JSON.parse(JSON.stringify(obj));
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

export function extend(obj, b, ...rest) {
  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (name in x) { obj[name] = x[name]; }
  }
  return obj;
};
