export interface Dict<T> {
  [key: string]: T;
}

export let isArray = Array.isArray || function (obj) {
  return {}.toString.call(obj) === '[object Array]';
};

export function isin(item: any, array: any[]) {
    return array.indexOf(item) !== -1;
};

export function json(s, sp) {
  return JSON.stringify(s, null, sp);
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

export function forEach(obj, f, thisArg?) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (var k in obj) {
      f.call(thisArg, obj[k], k, obj);
    }
  }
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

export function some(arr, f) {
    var i = 0, k;
    for (k in arr) {
      if (f(arr[k], k, i++)) {
        return true;
      }
    }
    return false;
};

export function nestedMap(collection, f, level, filter?) {
  return level === 0 ?
    collection.map(f) :
    collection.map(function(v) {
      var r = nestedMap(v, f, level - 1);
      return filter ? r.filter(nonEmpty) : r;
    });
};

export function nestedReduce(collection, f, level, filter?) {
  return level === 0 ?
    collection.reduce(f, []) :
    collection.map(function(v) {
      var r = nestedReduce(v, f, level - 1);
      return filter ? r.filter(nonEmpty) : r;
    });
};

export function nonEmpty(grp) {
  return !isArray(grp) || grp.length > 0;
};


export function traverse(node, arr) {
  if (node.value !== undefined) {
    arr.push(node.value);
  } else {
    if (node.left) {
      traverse(node.left, arr);
    }
    if (node.right) {
      traverse(node.right, arr);
    }

  }
  return arr;
};

export function extend(obj, b, ...rest) {
  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (name in x) { obj[name] = x[name]; }
  }
  return obj;
};

export function union(a, b) {
  var o = {};
  a.forEach(function(x) { o[x] = true;});
  b.forEach(function(x) { o[x] = true;});
  return keys(o);
};

export namespace gen {
  export function getOpt(opt) {
    // merge with default
    return (opt ? keys(opt) : []).reduce(function(c, k) {
      c[k] = opt[k];
      return c;
    }, Object.create({})); // FIXME check if {} is correct
  };
}

/**
 * powerset code from http://rosettacode.org/wiki/Power_Set#JavaScript
 *
 *   var res = powerset([1,2,3,4]);
 *
 * returns
 *
 * [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3],[4],[1,4],
 * [2,4],[1,2,4],[3,4],[1,3,4],[2,3,4],[1,2,3,4]]
 */

export function powerset(list) {
  var ps = [
    []
  ];
  for (var i = 0; i < list.length; i++) {
    for (var j = 0, len = ps.length; j < len; j++) {
      ps.push(ps[j].concat(list[i]));
    }
  }
  return ps;
};

export function chooseKorLess(list, k) {
  var subset = [[]];
  for (var i = 0; i < list.length; i++) {
    for (var j = 0, len = subset.length; j < len; j++) {
      var sub = subset[j].concat(list[i]);
      if(sub.length <= k) {
        subset.push(sub);
      }
    }
  }
  return subset;
};

export function chooseK(list, k) {
  var subset = [[]];
  var kArray =[];
  for (var i = 0; i < list.length; i++) {
    for (var j = 0, len = subset.length; j < len; j++) {
      var sub = subset[j].concat(list[i]);
      if (sub.length < k) {
        subset.push(sub);
      } else if (sub.length === k) {
        kArray.push(sub);
      }
    }
  }
  return kArray;
};

export function cross(a,b) {
  var x = [];
  for(var i=0; i< a.length; i++) {
    for(var j=0;j< b.length; j++) {
      x.push(a[i].concat(b[j]));
    }
  }
  return x;
};
