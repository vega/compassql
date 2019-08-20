(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.cql = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var clone_1 = createCommonjsModule(function (module) {
    var clone = (function() {

    function _instanceof(obj, type) {
      return type != null && obj instanceof type;
    }

    var nativeMap;
    try {
      nativeMap = Map;
    } catch(_) {
      // maybe a reference error because no `Map`. Give it a dummy value that no
      // value will ever be an instanceof.
      nativeMap = function() {};
    }

    var nativeSet;
    try {
      nativeSet = Set;
    } catch(_) {
      nativeSet = function() {};
    }

    var nativePromise;
    try {
      nativePromise = Promise;
    } catch(_) {
      nativePromise = function() {};
    }

    /**
     * Clones (copies) an Object using deep copying.
     *
     * This function supports circular references by default, but if you are certain
     * there are no circular references in your object, you can save some CPU time
     * by calling clone(obj, false).
     *
     * Caution: if `circular` is false and `parent` contains circular references,
     * your program may enter an infinite loop and crash.
     *
     * @param `parent` - the object to be cloned
     * @param `circular` - set to true if the object to be cloned may contain
     *    circular references. (optional - true by default)
     * @param `depth` - set to a number if the object is only to be cloned to
     *    a particular depth. (optional - defaults to Infinity)
     * @param `prototype` - sets the prototype to be used when cloning an object.
     *    (optional - defaults to parent prototype).
     * @param `includeNonEnumerable` - set to true if the non-enumerable properties
     *    should be cloned as well. Non-enumerable properties on the prototype
     *    chain will be ignored. (optional - false by default)
    */
    function clone(parent, circular, depth, prototype, includeNonEnumerable) {
      if (typeof circular === 'object') {
        depth = circular.depth;
        prototype = circular.prototype;
        includeNonEnumerable = circular.includeNonEnumerable;
        circular = circular.circular;
      }
      // maintain two arrays for circular references, where corresponding parents
      // and children have the same index
      var allParents = [];
      var allChildren = [];

      var useBuffer = typeof Buffer != 'undefined';

      if (typeof circular == 'undefined')
        circular = true;

      if (typeof depth == 'undefined')
        depth = Infinity;

      // recurse this function so we don't reset allParents and allChildren
      function _clone(parent, depth) {
        // cloning null always returns null
        if (parent === null)
          return null;

        if (depth === 0)
          return parent;

        var child;
        var proto;
        if (typeof parent != 'object') {
          return parent;
        }

        if (_instanceof(parent, nativeMap)) {
          child = new nativeMap();
        } else if (_instanceof(parent, nativeSet)) {
          child = new nativeSet();
        } else if (_instanceof(parent, nativePromise)) {
          child = new nativePromise(function (resolve, reject) {
            parent.then(function(value) {
              resolve(_clone(value, depth - 1));
            }, function(err) {
              reject(_clone(err, depth - 1));
            });
          });
        } else if (clone.__isArray(parent)) {
          child = [];
        } else if (clone.__isRegExp(parent)) {
          child = new RegExp(parent.source, __getRegExpFlags(parent));
          if (parent.lastIndex) child.lastIndex = parent.lastIndex;
        } else if (clone.__isDate(parent)) {
          child = new Date(parent.getTime());
        } else if (useBuffer && Buffer.isBuffer(parent)) {
          if (Buffer.allocUnsafe) {
            // Node.js >= 4.5.0
            child = Buffer.allocUnsafe(parent.length);
          } else {
            // Older Node.js versions
            child = new Buffer(parent.length);
          }
          parent.copy(child);
          return child;
        } else if (_instanceof(parent, Error)) {
          child = Object.create(parent);
        } else {
          if (typeof prototype == 'undefined') {
            proto = Object.getPrototypeOf(parent);
            child = Object.create(proto);
          }
          else {
            child = Object.create(prototype);
            proto = prototype;
          }
        }

        if (circular) {
          var index = allParents.indexOf(parent);

          if (index != -1) {
            return allChildren[index];
          }
          allParents.push(parent);
          allChildren.push(child);
        }

        if (_instanceof(parent, nativeMap)) {
          parent.forEach(function(value, key) {
            var keyChild = _clone(key, depth - 1);
            var valueChild = _clone(value, depth - 1);
            child.set(keyChild, valueChild);
          });
        }
        if (_instanceof(parent, nativeSet)) {
          parent.forEach(function(value) {
            var entryChild = _clone(value, depth - 1);
            child.add(entryChild);
          });
        }

        for (var i in parent) {
          var attrs;
          if (proto) {
            attrs = Object.getOwnPropertyDescriptor(proto, i);
          }

          if (attrs && attrs.set == null) {
            continue;
          }
          child[i] = _clone(parent[i], depth - 1);
        }

        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(parent);
          for (var i = 0; i < symbols.length; i++) {
            // Don't need to worry about cloning a symbol because it is a primitive,
            // like a number or string.
            var symbol = symbols[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
            if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
              continue;
            }
            child[symbol] = _clone(parent[symbol], depth - 1);
            if (!descriptor.enumerable) {
              Object.defineProperty(child, symbol, {
                enumerable: false
              });
            }
          }
        }

        if (includeNonEnumerable) {
          var allPropertyNames = Object.getOwnPropertyNames(parent);
          for (var i = 0; i < allPropertyNames.length; i++) {
            var propertyName = allPropertyNames[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
            if (descriptor && descriptor.enumerable) {
              continue;
            }
            child[propertyName] = _clone(parent[propertyName], depth - 1);
            Object.defineProperty(child, propertyName, {
              enumerable: false
            });
          }
        }

        return child;
      }

      return _clone(parent, depth);
    }

    /**
     * Simple flat clone using prototype, accepts only objects, usefull for property
     * override on FLAT configuration object (no nested props).
     *
     * USE WITH CAUTION! This may not behave as you wish if you do not know how this
     * works.
     */
    clone.clonePrototype = function clonePrototype(parent) {
      if (parent === null)
        return null;

      var c = function () {};
      c.prototype = parent;
      return new c();
    };

    // private utility functions

    function __objToStr(o) {
      return Object.prototype.toString.call(o);
    }
    clone.__objToStr = __objToStr;

    function __isDate(o) {
      return typeof o === 'object' && __objToStr(o) === '[object Date]';
    }
    clone.__isDate = __isDate;

    function __isArray(o) {
      return typeof o === 'object' && __objToStr(o) === '[object Array]';
    }
    clone.__isArray = __isArray;

    function __isRegExp(o) {
      return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
    }
    clone.__isRegExp = __isRegExp;

    function __getRegExpFlags(re) {
      var flags = '';
      if (re.global) flags += 'g';
      if (re.ignoreCase) flags += 'i';
      if (re.multiline) flags += 'm';
      return flags;
    }
    clone.__getRegExpFlags = __getRegExpFlags;

    return clone;
    })();

    if (module.exports) {
      module.exports = clone;
    }
    });

    var fastJsonStableStringify = function (data, opts) {
        if (!opts) opts = {};
        if (typeof opts === 'function') opts = { cmp: opts };
        var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

        var cmp = opts.cmp && (function (f) {
            return function (node) {
                return function (a, b) {
                    var aobj = { key: a, value: node[a] };
                    var bobj = { key: b, value: node[b] };
                    return f(aobj, bobj);
                };
            };
        })(opts.cmp);

        var seen = [];
        return (function stringify (node) {
            if (node && node.toJSON && typeof node.toJSON === 'function') {
                node = node.toJSON();
            }

            if (node === undefined) return;
            if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
            if (typeof node !== 'object') return JSON.stringify(node);

            var i, out;
            if (Array.isArray(node)) {
                out = '[';
                for (i = 0; i < node.length; i++) {
                    if (i) out += ',';
                    out += stringify(node[i]) || 'null';
                }
                return out + ']';
            }

            if (node === null) return 'null';

            if (seen.indexOf(node) !== -1) {
                if (cycles) return JSON.stringify('__cycle__');
                throw new TypeError('Converting circular structure to JSON');
            }

            var seenIndex = seen.push(node) - 1;
            var keys = Object.keys(node).sort(cmp && cmp(node));
            out = '';
            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = stringify(node[key]);

                if (!value) continue;
                if (out) out += ',';
                out += JSON.stringify(key) + ':' + value;
            }
            seen.splice(seenIndex, 1);
            return '{' + out + '}';
        })(data);
    };

    function accessor(fn, fields, name) {
      fn.fields = fields || [];
      fn.fname = name;
      return fn;
    }

    function error(message) {
      throw Error(message);
    }

    function splitAccessPath(p) {
      var path = [],
          q = null,
          b = 0,
          n = p.length,
          s = '',
          i, j, c;

      p = p + '';

      function push() {
        path.push(s + p.substring(i, j));
        s = '';
        i = j + 1;
      }

      for (i=j=0; j<n; ++j) {
        c = p[j];
        if (c === '\\') {
          s += p.substring(i, j);
          i = ++j;
        } else if (c === q) {
          push();
          q = null;
          b = -1;
        } else if (q) {
          continue;
        } else if (i === b && c === '"') {
          i = j + 1;
          q = c;
        } else if (i === b && c === "'") {
          i = j + 1;
          q = c;
        } else if (c === '.' && !b) {
          if (j > i) {
            push();
          } else {
            i = j + 1;
          }
        } else if (c === '[') {
          if (j > i) push();
          b = i = j + 1;
        } else if (c === ']') {
          if (!b) error('Access path missing open bracket: ' + p);
          if (b > 0) push();
          b = 0;
          i = j + 1;
        }
      }

      if (b) error('Access path missing closing bracket: ' + p);
      if (q) error('Access path missing closing quote: ' + p);

      if (j > i) {
        j++;
        push();
      }

      return path;
    }

    var isArray = Array.isArray;

    function isObject(_) {
      return _ === Object(_);
    }

    function isString(_) {
      return typeof _ === 'string';
    }

    function $(x) {
      return isArray(x) ? '[' + x.map($) + ']'
        : isObject(x) || isString(x) ?
          // Output valid JSON and JS source strings.
          // See http://timelessrepo.com/json-isnt-a-javascript-subset
          JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
        : x;
    }

    function field(field, name) {
      var path = splitAccessPath(field),
          code = 'return _[' + path.map($).join('][') + '];';

      return accessor(
        Function('_', code),
        [(field = path.length===1 ? path[0] : field)],
        name || field
      );
    }

    var empty = [];

    var id = field('id');

    var identity = accessor(function(_) { return _; }, empty, 'identity');

    var zero = accessor(function() { return 0; }, empty, 'zero');

    var one = accessor(function() { return 1; }, empty, 'one');

    var truthy = accessor(function() { return true; }, empty, 'true');

    var falsy = accessor(function() { return false; }, empty, 'false');

    function log(method, level, input) {
      var msg = [level].concat([].slice.call(input));
      console[method](...msg); // eslint-disable-line no-console
    }

    var None  = 0;
    var Error$1 = 1;
    var Warn  = 2;
    var Info  = 3;
    var Debug = 4;

    function logger(_, method) {
      var level = _ || None;
      return {
        level: function(_) {
          if (arguments.length) {
            level = +_;
            return this;
          } else {
            return level;
          }
        },
        error: function() {
          if (level >= Error$1) log(method || 'error', 'ERROR', arguments);
          return this;
        },
        warn: function() {
          if (level >= Warn) log(method || 'warn', 'WARN', arguments);
          return this;
        },
        info: function() {
          if (level >= Info) log(method || 'log', 'INFO', arguments);
          return this;
        },
        debug: function() {
          if (level >= Debug) log(method || 'log', 'DEBUG', arguments);
          return this;
        }
      }
    }

    /**
     * Span-preserving range clamp. If the span of the input range is less
     * than (max - min) and an endpoint exceeds either the min or max value,
     * the range is translated such that the span is preserved and one
     * endpoint touches the boundary of the min/max range.
     * If the span exceeds (max - min), the range [min, max] is returned.
     */

    /**
     * Return an array with minimum and maximum values, in the
     * form [min, max]. Ignores null, undefined, and NaN values.
     */

    /**
     * Predicate that returns true if the value lies within the span
     * of the given range. The left and right flags control the use
     * of inclusive (true) or exclusive (false) comparisons.
     */

    function isBoolean(_) {
      return typeof _ === 'boolean';
    }

    function isNumber(_) {
      return typeof _ === 'number';
    }

    function toSet(_) {
      for (var s={}, i=0, n=_.length; i<n; ++i) s[_[i]] = true;
      return s;
    }

    const duplicate = clone_1;
    /**
     * Monkey patch Set so that `stringify` produces a string representation of sets.
     */
    Set.prototype['toJSON'] = function () {
        return `Set(${[...this].map(x => fastJsonStableStringify(x)).join(',')})`;
    };
    /**
     * Converts any object to a string representation that can be consumed by humans.
     */
    const stringify = fastJsonStableStringify;
    function contains(array, item) {
        return array.indexOf(item) > -1;
    }
    /**
     * Returns true if any item returns true.
     */
    function some(arr, f) {
        let i = 0;
        for (const [k, a] of arr.entries()) {
            if (f(a, k, i++)) {
                return true;
            }
        }
        return false;
    }
    // This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
    const keys = Object.keys;
    function flagKeys(f) {
        return keys(f);
    }
    /**
     * Convert a string into a valid variable name
     */
    function varName(s) {
        // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
        const alphanumericS = s.replace(/\W/g, '_');
        // Add _ if the string has leading numbers.
        return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
    }
    function titlecase(s) {
        return s.charAt(0).toUpperCase() + s.substr(1);
    }
    /**
     * Return access with datum to the flattened field.
     *
     * @param path The field name.
     * @param datum The string to use for `datum`.
     */
    function flatAccessWithDatum(path, datum = 'datum') {
        return `${datum}[${$(splitAccessPath(path).join('.'))}]`;
    }
    /**
     * Replaces path accesses with access to non-nested field.
     * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
     */
    function replacePathInField(path) {
        return `${splitAccessPath(path)
        .map(p => p.replace('.', '\\.'))
        .join('\\.')}`;
    }
    /**
     * This is a replacement for chained || for numeric properties or properties that respect null so that 0 will be included.
     */
    function getFirstDefined(...args) {
        for (const arg of args) {
            if (arg !== undefined) {
                return arg;
            }
        }
        return undefined;
    }
    function internalField(name) {
        return isInternalField(name) ? name : `__${name}`;
    }
    function isInternalField(name) {
        return name.indexOf('__') === 0;
    }

    /*
     * Constants and utilities for encoding channels (Visual variables)
     * such as 'x', 'y', 'color'.
     */
    // Facet
    const ROW = 'row';
    const COLUMN = 'column';
    const FACET = 'facet';
    // Position
    const X = 'x';
    const Y = 'y';
    const X2 = 'x2';
    const Y2 = 'y2';
    // Geo Position
    const LATITUDE = 'latitude';
    const LONGITUDE = 'longitude';
    const LATITUDE2 = 'latitude2';
    const LONGITUDE2 = 'longitude2';
    // Mark property with scale
    const COLOR = 'color';
    const FILL = 'fill';
    const STROKE = 'stroke';
    const SHAPE = 'shape';
    const SIZE = 'size';
    const OPACITY = 'opacity';
    const FILLOPACITY = 'fillOpacity';
    const STROKEOPACITY = 'strokeOpacity';
    const STROKEWIDTH = 'strokeWidth';
    // Non-scale channel
    const TEXT = 'text';
    const ORDER = 'order';
    const DETAIL = 'detail';
    const KEY = 'key';
    const TOOLTIP = 'tooltip';
    const HREF = 'href';
    const GEOPOSITION_CHANNEL_INDEX = {
        longitude: 1,
        longitude2: 1,
        latitude: 1,
        latitude2: 1
    };
    const UNIT_CHANNEL_INDEX = Object.assign({ 
        // position
        x: 1, y: 1, x2: 1, y2: 1 }, GEOPOSITION_CHANNEL_INDEX, { 
        // color
        color: 1, fill: 1, stroke: 1, 
        // other non-position with scale
        opacity: 1, fillOpacity: 1, strokeOpacity: 1, strokeWidth: 1, size: 1, shape: 1, 
        // channels without scales
        order: 1, text: 1, detail: 1, key: 1, tooltip: 1, href: 1 });
    function isColorChannel(channel) {
        return channel === 'color' || channel === 'fill' || channel === 'stroke';
    }
    const FACET_CHANNEL_INDEX = {
        row: 1,
        column: 1,
        facet: 1
    };
    const CHANNEL_INDEX = Object.assign({}, UNIT_CHANNEL_INDEX, FACET_CHANNEL_INDEX);
    const CHANNELS = flagKeys(CHANNEL_INDEX);
    const SINGLE_DEF_CHANNEL_INDEX = __rest(CHANNEL_INDEX, ["order", "detail"]);
    const SINGLE_DEF_UNIT_CHANNEL_INDEX = __rest(CHANNEL_INDEX, ["order", "detail", "row", "column", "facet"]);
    function isChannel(str) {
        return !!CHANNEL_INDEX[str];
    }
    function isSecondaryRangeChannel(c) {
        const main = getMainRangeChannel(c);
        return main !== c;
    }
    function getMainRangeChannel(channel) {
        switch (channel) {
            case 'x2':
                return 'x';
            case 'y2':
                return 'y';
            case 'latitude2':
                return 'latitude';
            case 'longitude2':
                return 'longitude';
        }
        return channel;
    }
    // NONPOSITION_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
    const // The rest of unit channels then have scale
    NONPOSITION_CHANNEL_INDEX = __rest(UNIT_CHANNEL_INDEX, ["x", "y", "x2", "y2", "latitude", "longitude", "latitude2", "longitude2"]);
    const NONPOSITION_CHANNELS = flagKeys(NONPOSITION_CHANNEL_INDEX);
    // POSITION_SCALE_CHANNELS = X and Y;
    const POSITION_SCALE_CHANNEL_INDEX = { x: 1, y: 1 };
    const POSITION_SCALE_CHANNELS = flagKeys(POSITION_SCALE_CHANNEL_INDEX);
    // NON_POSITION_SCALE_CHANNEL = SCALE_CHANNELS without X, Y
    const NONPOSITION_SCALE_CHANNEL_INDEX = __rest(NONPOSITION_CHANNEL_INDEX, ["text", "tooltip", "href", "detail", "key", "order"]);
    // Declare SCALE_CHANNEL_INDEX
    const SCALE_CHANNEL_INDEX = Object.assign({}, POSITION_SCALE_CHANNEL_INDEX, NONPOSITION_SCALE_CHANNEL_INDEX);
    function isScaleChannel(channel) {
        return !!SCALE_CHANNEL_INDEX[channel];
    }
    /**
     * Return whether a channel supports a particular mark type.
     * @param channel  channel name
     * @param mark the mark type
     * @return whether the mark supports the channel
     */
    function supportMark(channel, mark) {
        return getSupportedMark(channel)[mark];
    }
    /**
     * Return a dictionary showing whether a channel supports mark type.
     * @param channel
     * @return A dictionary mapping mark types to 'always', 'binned', or undefined
     */
    function getSupportedMark(channel) {
        switch (channel) {
            case COLOR:
            case FILL:
            case STROKE:
            // falls through
            case DETAIL:
            case KEY:
            case TOOLTIP:
            case HREF:
            case ORDER: // TODO: revise (order might not support rect, which is not stackable?)
            case OPACITY:
            case FILLOPACITY:
            case STROKEOPACITY:
            case STROKEWIDTH:
            // falls through
            case FACET:
            case ROW: // falls through
            case COLUMN:
                return {
                    // all marks
                    point: 'always',
                    tick: 'always',
                    rule: 'always',
                    circle: 'always',
                    square: 'always',
                    bar: 'always',
                    rect: 'always',
                    line: 'always',
                    trail: 'always',
                    area: 'always',
                    text: 'always',
                    geoshape: 'always'
                };
            case X:
            case Y:
            case LATITUDE:
            case LONGITUDE:
                return {
                    // all marks except geoshape. geoshape does not use X, Y -- it uses a projection
                    point: 'always',
                    tick: 'always',
                    rule: 'always',
                    circle: 'always',
                    square: 'always',
                    bar: 'always',
                    rect: 'always',
                    line: 'always',
                    trail: 'always',
                    area: 'always',
                    text: 'always'
                };
            case X2:
            case Y2:
            case LATITUDE2:
            case LONGITUDE2:
                return {
                    rule: 'always',
                    bar: 'always',
                    rect: 'always',
                    area: 'always',
                    circle: 'binned',
                    point: 'binned',
                    square: 'binned',
                    tick: 'binned'
                };
            case SIZE:
                return {
                    point: 'always',
                    tick: 'always',
                    rule: 'always',
                    circle: 'always',
                    square: 'always',
                    bar: 'always',
                    text: 'always',
                    line: 'always',
                    trail: 'always'
                };
            case SHAPE:
                return { point: 'always', geoshape: 'always' };
            case TEXT:
                return { text: 'always' };
        }
    }
    function rangeType(channel) {
        switch (channel) {
            case X:
            case Y:
            case SIZE:
            case STROKEWIDTH:
            case OPACITY:
            case FILLOPACITY:
            case STROKEOPACITY:
            // X2 and Y2 use X and Y scales, so they similarly have continuous range. [falls through]
            case X2:
            case Y2:
                return undefined;
            case FACET:
            case ROW:
            case COLUMN:
            case SHAPE:
            // TEXT, TOOLTIP, and HREF have no scale but have discrete output [falls through]
            case TEXT:
            case TOOLTIP:
            case HREF:
                return 'discrete';
            // Color can be either continuous or discrete, depending on scale type.
            case COLOR:
            case FILL:
            case STROKE:
                return 'flexible';
            // No scale, no range type.
            case LATITUDE:
            case LONGITUDE:
            case LATITUDE2:
            case LONGITUDE2:
            case DETAIL:
            case KEY:
            case ORDER:
                return undefined;
        }
        /* istanbul ignore next: should never reach here. */
        throw new Error('rangeType not implemented for ' + channel);
    }

    const COMMON_AXIS_PROPERTIES_INDEX = {
        orient: 1,
        bandPosition: 1,
        domain: 1,
        domainColor: 1,
        domainDash: 1,
        domainDashOffset: 1,
        domainOpacity: 1,
        domainWidth: 1,
        format: 1,
        formatType: 1,
        grid: 1,
        gridColor: 1,
        gridDash: 1,
        gridDashOffset: 1,
        gridOpacity: 1,
        gridWidth: 1,
        labelAlign: 1,
        labelAngle: 1,
        labelBaseline: 1,
        labelBound: 1,
        labelColor: 1,
        labelFlush: 1,
        labelFlushOffset: 1,
        labelFont: 1,
        labelFontSize: 1,
        labelFontStyle: 1,
        labelFontWeight: 1,
        labelLimit: 1,
        labelOpacity: 1,
        labelOverlap: 1,
        labelPadding: 1,
        labels: 1,
        labelSeparation: 1,
        maxExtent: 1,
        minExtent: 1,
        offset: 1,
        position: 1,
        tickColor: 1,
        tickCount: 1,
        tickDash: 1,
        tickDashOffset: 1,
        tickExtra: 1,
        tickMinStep: 1,
        tickOffset: 1,
        tickOpacity: 1,
        tickRound: 1,
        ticks: 1,
        tickSize: 1,
        tickWidth: 1,
        title: 1,
        titleAlign: 1,
        titleAnchor: 1,
        titleAngle: 1,
        titleBaseline: 1,
        titleColor: 1,
        titleFont: 1,
        titleFontSize: 1,
        titleFontStyle: 1,
        titleFontWeight: 1,
        titleLimit: 1,
        titleOpacity: 1,
        titlePadding: 1,
        titleX: 1,
        titleY: 1,
        values: 1,
        zindex: 1
    };
    const AXIS_PROPERTIES_INDEX = Object.assign({}, COMMON_AXIS_PROPERTIES_INDEX, { encoding: 1 });
    const VG_AXIS_PROPERTIES_INDEX = Object.assign({ gridScale: 1, scale: 1 }, COMMON_AXIS_PROPERTIES_INDEX, { encode: 1 });
    // Export for dependent projects
    const AXIS_PROPERTIES = flagKeys(AXIS_PROPERTIES_INDEX);

    const COMMON_LEGEND_PROPERTY_INDEX = {
        clipHeight: 1,
        columnPadding: 1,
        columns: 1,
        cornerRadius: 1,
        direction: 1,
        fillColor: 1,
        format: 1,
        formatType: 1,
        gradientLength: 1,
        gradientOpacity: 1,
        gradientStrokeColor: 1,
        gradientStrokeWidth: 1,
        gradientThickness: 1,
        gridAlign: 1,
        labelAlign: 1,
        labelBaseline: 1,
        labelColor: 1,
        labelFont: 1,
        labelFontSize: 1,
        labelFontStyle: 1,
        labelFontWeight: 1,
        labelLimit: 1,
        labelOffset: 1,
        labelOpacity: 1,
        labelOverlap: 1,
        labelPadding: 1,
        labelSeparation: 1,
        legendX: 1,
        legendY: 1,
        offset: 1,
        orient: 1,
        padding: 1,
        rowPadding: 1,
        strokeColor: 1,
        symbolDash: 1,
        symbolDashOffset: 1,
        symbolFillColor: 1,
        symbolOffset: 1,
        symbolOpacity: 1,
        symbolSize: 1,
        symbolStrokeColor: 1,
        symbolStrokeWidth: 1,
        symbolType: 1,
        tickCount: 1,
        tickMinStep: 1,
        title: 1,
        titleAlign: 1,
        titleAnchor: 1,
        titleBaseline: 1,
        titleColor: 1,
        titleFont: 1,
        titleFontSize: 1,
        titleFontStyle: 1,
        titleFontWeight: 1,
        titleLimit: 1,
        titleOpacity: 1,
        titleOrient: 1,
        titlePadding: 1,
        type: 1,
        values: 1,
        zindex: 1
    };
    const VG_LEGEND_PROPERTY_INDEX = Object.assign({}, COMMON_LEGEND_PROPERTY_INDEX, { 
        // channel scales
        opacity: 1, shape: 1, stroke: 1, fill: 1, size: 1, strokeWidth: 1, 
        // encode
        encode: 1 });
    const LEGEND_PROPERTIES = flagKeys(COMMON_LEGEND_PROPERTY_INDEX);

    /**
     * Collection of all Vega-Lite Error Messages
     */
    const INVALID_SPEC = 'Invalid spec';
    // FIT
    const FIT_NON_SINGLE = 'Autosize "fit" only works for single views and layered views.';
    const CANNOT_FIX_RANGE_STEP_WITH_FIT = 'Cannot use a fixed value of "rangeStep" when "autosize" is "fit".';
    // SELECTION
    function cannotProjectOnChannelWithoutField(channel) {
        return `Cannot project a selection on encoding channel "${channel}", which has no field.`;
    }
    function nearestNotSupportForContinuous(mark) {
        return `The "nearest" transform is not supported for ${mark} marks.`;
    }
    function selectionNotSupported(mark) {
        return `Selection not supported for ${mark} yet`;
    }
    function selectionNotFound(name) {
        return `Cannot find a selection named "${name}"`;
    }
    const SCALE_BINDINGS_CONTINUOUS = 'Scale bindings are currently only supported for scales with unbinned, continuous domains.';
    const NO_INIT_SCALE_BINDINGS = 'Selections bound to scales cannot be separately initialized.';
    // REPEAT
    function noSuchRepeatedValue(field) {
        return `Unknown repeated value "${field}".`;
    }
    function columnsNotSupportByRowCol(type) {
        return `The "columns" property cannot be used when "${type}" has nested row/column.`;
    }
    // CONCAT
    const CONCAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in concatenated views yet (https://github.com/vega/vega-lite/issues/2415).';
    // REPEAT
    const REPEAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in repeated views yet (https://github.com/vega/vega-lite/issues/2415).';
    // DATA
    function unrecognizedParse(p) {
        return `Unrecognized parse "${p}".`;
    }
    function differentParse(field, local, ancestor) {
        return `An ancestor parsed field "${field}" as ${ancestor} but a child wants to parse the field as ${local}.`;
    }
    // TRANSFORMS
    function invalidTransformIgnored(transform) {
        return `Ignoring an invalid transform: ${stringify(transform)}.`;
    }
    const NO_FIELDS_NEEDS_AS = 'If "from.fields" is not specified, "as" has to be a string that specifies the key to be used for the data from the secondary source.';
    // ENCODING & FACET
    function encodingOverridden(channels) {
        return `Layer's shared ${channels.join(',')} channel ${channels.length === 1 ? 'is' : 'are'} overriden`;
    }
    function projectionOverridden(opt) {
        const { parentProjection, projection } = opt;
        return `Layer's shared projection ${stringify(parentProjection)} is overridden by a child projection ${stringify(projection)}.`;
    }
    function primitiveChannelDef(channel, type, value) {
        return `Channel ${channel} is a ${type}. Converted to {value: ${stringify(value)}}.`;
    }
    function invalidFieldType(type) {
        return `Invalid field type "${type}"`;
    }
    function nonZeroScaleUsedWithLengthMark(mark, channel, opt) {
        const scaleText = opt.scaleType
            ? `${opt.scaleType} scale`
            : opt.zeroFalse
                ? 'scale with zero=false'
                : 'scale with custom domain that excludes zero';
        return `A ${scaleText} is used to encode ${mark}'s ${channel}. This can be misleading as the ${channel === 'x' ? 'width' : 'height'} of the ${mark} can be arbitrary based on the scale domain. You may want to use point mark instead.`;
    }
    function invalidFieldTypeForCountAggregate(type, aggregate) {
        return `Invalid field type "${type}" for aggregate: "${aggregate}", using "quantitative" instead.`;
    }
    function invalidAggregate(aggregate) {
        return `Invalid aggregation operator "${aggregate}"`;
    }
    function missingFieldType(channel, newType) {
        return `Missing type for channel "${channel}", using "${newType}" instead.`;
    }
    function droppingColor(type, opt) {
        const { fill, stroke } = opt;
        return (`Dropping color ${type} as the plot also has ` + (fill && stroke ? 'fill and stroke' : fill ? 'fill' : 'stroke'));
    }
    function emptyFieldDef(fieldDef, channel) {
        return `Dropping ${stringify(fieldDef)} from channel "${channel}" since it does not contain data field or value.`;
    }
    function latLongDeprecated(channel, type, newChannel) {
        return `${channel}-encoding with type ${type} is deprecated. Replacing with ${newChannel}-encoding.`;
    }
    const LINE_WITH_VARYING_SIZE = 'Line marks cannot encode size with a non-groupby field. You may want to use trail marks instead.';
    function incompatibleChannel(channel, markOrFacet, when) {
        return `${channel} dropped as it is incompatible with "${markOrFacet}"${when ? ` when ${when}` : ''}.`;
    }
    function invalidEncodingChannel(channel) {
        return `${channel}-encoding is dropped as ${channel} is not a valid encoding channel.`;
    }
    function facetChannelShouldBeDiscrete(channel) {
        return `${channel} encoding should be discrete (ordinal / nominal / binned).`;
    }
    function facetChannelDropped(channels) {
        return `Facet encoding dropped as ${channels.join(' and ')} ${channels.length > 1 ? 'are' : 'is'} also specified.`;
    }
    function discreteChannelCannotEncode(channel, type) {
        return `Using discrete channel "${channel}" to encode "${type}" field can be misleading as it does not encode ${type === 'ordinal' ? 'order' : 'magnitude'}.`;
    }
    // Mark
    const BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';
    function lineWithRange(hasX2, hasY2) {
        const channels = hasX2 && hasY2 ? 'x2 and y2' : hasX2 ? 'x2' : 'y2';
        return `Line mark is for continuous lines and thus cannot be used with ${channels}. We will use the rule mark (line segments) instead.`;
    }
    function orientOverridden(original, actual) {
        return `Specified orient "${original}" overridden with "${actual}"`;
    }
    // SCALE
    const CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';
    function cannotUseScalePropertyWithNonColor(prop) {
        return `Cannot use the scale property "${prop}" with non-color channel.`;
    }
    function unaggregateDomainHasNoEffectForRawField(fieldDef) {
        return `Using unaggregated domain with raw field has no effect (${stringify(fieldDef)}).`;
    }
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return `Unaggregated domain not applicable for "${aggregate}" since it produces values outside the origin domain of the source data.`;
    }
    function unaggregatedDomainWithLogScale(fieldDef) {
        return `Unaggregated domain is currently unsupported for log scale (${stringify(fieldDef)}).`;
    }
    function cannotApplySizeToNonOrientedMark(mark) {
        return `Cannot apply size to non-oriented mark "${mark}".`;
    }
    function rangeStepDropped(channel) {
        return `rangeStep for "${channel}" is dropped as top-level ${channel === 'x' ? 'width' : 'height'} is provided.`;
    }
    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
        return `Channel "${channel}" does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
    }
    function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
        return `FieldDef does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
    }
    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
        return `${channel}-scale's "${propName}" is dropped as it does not work with ${scaleType} scale.`;
    }
    function scaleTypeNotWorkWithMark(mark, scaleType) {
        return `Scale type "${scaleType}" does not work with mark "${mark}".`;
    }
    function mergeConflictingProperty(property, propertyOf, v1, v2) {
        return `Conflicting ${propertyOf.toString()} property "${property.toString()}" (${stringify(v1)} and ${stringify(v2)}).  Using ${stringify(v1)}.`;
    }
    function independentScaleMeansIndependentGuide(channel) {
        return `Setting the scale to be independent for "${channel}" means we also have to set the guide (axis or legend) to be independent.`;
    }
    function domainSortDropped(sort) {
        return `Dropping sort property ${stringify(sort)} as unioned domains only support boolean or op 'count'.`;
    }
    const UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
    const MORE_THAN_ONE_SORT = 'Domains that should be unioned has conflicting sort properties. Sort will be set to true.';
    // AXIS
    const INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
    // STACK
    function cannotStackRangedMark(channel) {
        return `Cannot stack "${channel}" if there is already "${channel}2"`;
    }
    function cannotStackNonLinearScale(scaleType) {
        return `Cannot stack non-linear scale (${scaleType})`;
    }
    function stackNonSummativeAggregate(aggregate) {
        return `Stacking is applied even though the aggregate function is non-summative ("${aggregate}")`;
    }
    // TIMEUNIT
    function invalidTimeUnit(unitName, value) {
        return `Invalid ${unitName}: ${stringify(value)}`;
    }
    function dayReplacedWithDate(fullTimeUnit) {
        return `Time unit "${fullTimeUnit}" is not supported. We are replacing it with ${fullTimeUnit.replace('day', 'date')}.`;
    }
    function droppedDay(d) {
        return `Dropping day from datetime ${stringify(d)} as day cannot be combined with other units.`;
    }
    function errorBarCenterAndExtentAreNotNeeded(center, extent) {
        return `${extent ? 'extent ' : ''}${extent && center ? 'and ' : ''}${center ? 'center ' : ''}${extent && center ? 'are ' : 'is '}not needed when data are aggregated.`;
    }
    function errorBarCenterIsUsedWithWrongExtent(center, extent, mark) {
        return `${center} is not usually used with ${extent} for ${mark}.`;
    }
    function errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark) {
        return `Continuous axis should not have customized aggregation function ${aggregate}; ${compositeMark} already agregates the axis.`;
    }
    function errorBarCenterIsNotNeeded(extent, mark) {
        return `Center is not needed to be specified in ${mark} when extent is ${extent}.`;
    }
    function errorBand1DNotSupport(property) {
        return `1D error band does not support ${property}`;
    }
    // CHANNEL
    function channelRequiredForBinned(channel) {
        return `Channel ${channel} is required for "binned" bin`;
    }
    function domainRequiredForThresholdScale(channel) {
        return `Domain for ${channel} is required for threshold scale`;
    }

    var message_ = /*#__PURE__*/Object.freeze({
        INVALID_SPEC: INVALID_SPEC,
        FIT_NON_SINGLE: FIT_NON_SINGLE,
        CANNOT_FIX_RANGE_STEP_WITH_FIT: CANNOT_FIX_RANGE_STEP_WITH_FIT,
        cannotProjectOnChannelWithoutField: cannotProjectOnChannelWithoutField,
        nearestNotSupportForContinuous: nearestNotSupportForContinuous,
        selectionNotSupported: selectionNotSupported,
        selectionNotFound: selectionNotFound,
        SCALE_BINDINGS_CONTINUOUS: SCALE_BINDINGS_CONTINUOUS,
        NO_INIT_SCALE_BINDINGS: NO_INIT_SCALE_BINDINGS,
        noSuchRepeatedValue: noSuchRepeatedValue,
        columnsNotSupportByRowCol: columnsNotSupportByRowCol,
        CONCAT_CANNOT_SHARE_AXIS: CONCAT_CANNOT_SHARE_AXIS,
        REPEAT_CANNOT_SHARE_AXIS: REPEAT_CANNOT_SHARE_AXIS,
        unrecognizedParse: unrecognizedParse,
        differentParse: differentParse,
        invalidTransformIgnored: invalidTransformIgnored,
        NO_FIELDS_NEEDS_AS: NO_FIELDS_NEEDS_AS,
        encodingOverridden: encodingOverridden,
        projectionOverridden: projectionOverridden,
        primitiveChannelDef: primitiveChannelDef,
        invalidFieldType: invalidFieldType,
        nonZeroScaleUsedWithLengthMark: nonZeroScaleUsedWithLengthMark,
        invalidFieldTypeForCountAggregate: invalidFieldTypeForCountAggregate,
        invalidAggregate: invalidAggregate,
        missingFieldType: missingFieldType,
        droppingColor: droppingColor,
        emptyFieldDef: emptyFieldDef,
        latLongDeprecated: latLongDeprecated,
        LINE_WITH_VARYING_SIZE: LINE_WITH_VARYING_SIZE,
        incompatibleChannel: incompatibleChannel,
        invalidEncodingChannel: invalidEncodingChannel,
        facetChannelShouldBeDiscrete: facetChannelShouldBeDiscrete,
        facetChannelDropped: facetChannelDropped,
        discreteChannelCannotEncode: discreteChannelCannotEncode,
        BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL: BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL,
        lineWithRange: lineWithRange,
        orientOverridden: orientOverridden,
        CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN: CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN,
        cannotUseScalePropertyWithNonColor: cannotUseScalePropertyWithNonColor,
        unaggregateDomainHasNoEffectForRawField: unaggregateDomainHasNoEffectForRawField,
        unaggregateDomainWithNonSharedDomainOp: unaggregateDomainWithNonSharedDomainOp,
        unaggregatedDomainWithLogScale: unaggregatedDomainWithLogScale,
        cannotApplySizeToNonOrientedMark: cannotApplySizeToNonOrientedMark,
        rangeStepDropped: rangeStepDropped,
        scaleTypeNotWorkWithChannel: scaleTypeNotWorkWithChannel,
        scaleTypeNotWorkWithFieldDef: scaleTypeNotWorkWithFieldDef,
        scalePropertyNotWorkWithScaleType: scalePropertyNotWorkWithScaleType,
        scaleTypeNotWorkWithMark: scaleTypeNotWorkWithMark,
        mergeConflictingProperty: mergeConflictingProperty,
        independentScaleMeansIndependentGuide: independentScaleMeansIndependentGuide,
        domainSortDropped: domainSortDropped,
        UNABLE_TO_MERGE_DOMAINS: UNABLE_TO_MERGE_DOMAINS,
        MORE_THAN_ONE_SORT: MORE_THAN_ONE_SORT,
        INVALID_CHANNEL_FOR_AXIS: INVALID_CHANNEL_FOR_AXIS,
        cannotStackRangedMark: cannotStackRangedMark,
        cannotStackNonLinearScale: cannotStackNonLinearScale,
        stackNonSummativeAggregate: stackNonSummativeAggregate,
        invalidTimeUnit: invalidTimeUnit,
        dayReplacedWithDate: dayReplacedWithDate,
        droppedDay: droppedDay,
        errorBarCenterAndExtentAreNotNeeded: errorBarCenterAndExtentAreNotNeeded,
        errorBarCenterIsUsedWithWrongExtent: errorBarCenterIsUsedWithWrongExtent,
        errorBarContinuousAxisHasCustomizedAggregate: errorBarContinuousAxisHasCustomizedAggregate,
        errorBarCenterIsNotNeeded: errorBarCenterIsNotNeeded,
        errorBand1DNotSupport: errorBand1DNotSupport,
        channelRequiredForBinned: channelRequiredForBinned,
        domainRequiredForThresholdScale: domainRequiredForThresholdScale
    });

    /**
     * Vega-Lite's singleton logger utility.
     */
    const message = message_;
    /**
     * Main (default) Vega Logger instance for Vega-Lite
     */
    const main = logger(Warn);
    let current = main;
    /**
     * Logger tool for checking if the code throws correct warning
     */
    class LocalLogger {
        constructor() {
            this.warns = [];
            this.infos = [];
            this.debugs = [];
        }
        level() {
            return this;
        }
        warn(...args) {
            this.warns.push(...args);
            return this;
        }
        info(...args) {
            this.infos.push(...args);
            return this;
        }
        debug(...args) {
            this.debugs.push(...args);
            return this;
        }
        error(...args) {
            throw Error(...args);
            return this; // @ts-ignore
        }
    }
    function wrap(f) {
        return () => {
            current = new LocalLogger();
            f(current);
            reset();
        };
    }
    /**
     * Set the singleton logger to be a custom logger
     */
    function set(newLogger) {
        current = newLogger;
        return current;
    }
    /**
     * Reset the main logger to use the default Vega Logger
     */
    function reset() {
        current = main;
        return current;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function warn(..._) {
        current.warn.apply(current, arguments);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function info(..._) {
        current.info.apply(current, arguments);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function debug(..._) {
        current.debug.apply(current, arguments);
    }

    var log$1 = /*#__PURE__*/Object.freeze({
        message: message,
        LocalLogger: LocalLogger,
        wrap: wrap,
        set: set,
        reset: reset,
        warn: warn,
        info: info,
        debug: debug
    });

    /** Constants and utilities for data type */
    /** Data type based on level of measurement */
    const TYPE_INDEX = {
        quantitative: 1,
        ordinal: 1,
        temporal: 1,
        nominal: 1,
        geojson: 1
    };
    const QUANTITATIVE = 'quantitative';
    const ORDINAL = 'ordinal';
    const TEMPORAL = 'temporal';
    const NOMINAL = 'nominal';
    const GEOJSON = 'geojson';
    /**
     * Get full, lowercase type name for a given type.
     * @param  type
     * @return Full type name.
     */
    function getFullName(type) {
        if (type) {
            type = type.toLowerCase();
            switch (type) {
                case 'q':
                case QUANTITATIVE:
                    return 'quantitative';
                case 't':
                case TEMPORAL:
                    return 'temporal';
                case 'o':
                case ORDINAL:
                    return 'ordinal';
                case 'n':
                case NOMINAL:
                    return 'nominal';
                case GEOJSON:
                    return 'geojson';
            }
        }
        // If we get invalid input, return undefined type.
        return undefined;
    }

    var ScaleType;
    (function (ScaleType) {
        // Continuous - Quantitative
        ScaleType.LINEAR = 'linear';
        ScaleType.LOG = 'log';
        ScaleType.POW = 'pow';
        ScaleType.SQRT = 'sqrt';
        ScaleType.SYMLOG = 'symlog';
        // Continuous - Time
        ScaleType.TIME = 'time';
        ScaleType.UTC = 'utc';
        // Discretizing scales
        ScaleType.QUANTILE = 'quantile';
        ScaleType.QUANTIZE = 'quantize';
        ScaleType.THRESHOLD = 'threshold';
        ScaleType.BIN_ORDINAL = 'bin-ordinal';
        // Discrete scales
        ScaleType.ORDINAL = 'ordinal';
        ScaleType.POINT = 'point';
        ScaleType.BAND = 'band';
    })(ScaleType || (ScaleType = {}));
    /**
     * Index for scale categories -- only scale of the same categories can be merged together.
     * Current implementation is trying to be conservative and avoid merging scale type that might not work together
     */
    const SCALE_CATEGORY_INDEX = {
        linear: 'numeric',
        log: 'numeric',
        pow: 'numeric',
        sqrt: 'numeric',
        symlog: 'numeric',
        time: 'time',
        utc: 'time',
        ordinal: 'ordinal',
        'bin-ordinal': 'bin-ordinal',
        point: 'ordinal-position',
        band: 'ordinal-position',
        quantile: 'discretizing',
        quantize: 'discretizing',
        threshold: 'discretizing'
    };
    const SCALE_TYPES = keys(SCALE_CATEGORY_INDEX);
    const CONTINUOUS_TO_CONTINUOUS_SCALES = ['linear', 'log', 'pow', 'sqrt', 'symlog', 'time', 'utc'];
    const CONTINUOUS_TO_CONTINUOUS_INDEX = toSet(CONTINUOUS_TO_CONTINUOUS_SCALES);
    const CONTINUOUS_TO_DISCRETE_SCALES = ['quantile', 'quantize', 'threshold'];
    const CONTINUOUS_TO_DISCRETE_INDEX = toSet(CONTINUOUS_TO_DISCRETE_SCALES);
    const CONTINUOUS_DOMAIN_SCALES = CONTINUOUS_TO_CONTINUOUS_SCALES.concat([
        'quantile',
        'quantize',
        'threshold'
    ]);
    const CONTINUOUS_DOMAIN_INDEX = toSet(CONTINUOUS_DOMAIN_SCALES);
    const DISCRETE_DOMAIN_SCALES = ['ordinal', 'bin-ordinal', 'point', 'band'];
    const DISCRETE_DOMAIN_INDEX = toSet(DISCRETE_DOMAIN_SCALES);
    function hasDiscreteDomain(type) {
        return type in DISCRETE_DOMAIN_INDEX;
    }
    function hasContinuousDomain(type) {
        return type in CONTINUOUS_DOMAIN_INDEX;
    }
    function isContinuousToContinuous(type) {
        return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
    }
    function isContinuousToDiscrete(type) {
        return type in CONTINUOUS_TO_DISCRETE_INDEX;
    }
    const SCALE_PROPERTY_INDEX = {
        type: 1,
        domain: 1,
        range: 1,
        rangeStep: 1,
        scheme: 1,
        bins: 1,
        // Other properties
        reverse: 1,
        round: 1,
        // quantitative / time
        clamp: 1,
        nice: 1,
        // quantitative
        base: 1,
        exponent: 1,
        constant: 1,
        interpolate: 1,
        zero: 1,
        // band/point
        padding: 1,
        paddingInner: 1,
        paddingOuter: 1
    };
    const SCALE_PROPERTIES = flagKeys(SCALE_PROPERTY_INDEX);
    const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX = __rest(SCALE_PROPERTY_INDEX, ["type", "domain", "range", "rangeStep", "scheme"]);
    const SCALE_TYPE_INDEX = generateScaleTypeIndex();
    function scaleTypeSupportProperty(scaleType, propName) {
        switch (propName) {
            case 'type':
            case 'domain':
            case 'reverse':
            case 'range':
                return true;
            case 'scheme':
            case 'interpolate':
                return !contains(['point', 'band', 'identity'], scaleType);
            case 'bins':
                return !contains(['point', 'band', 'identity', 'ordinal'], scaleType);
            case 'round':
                return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
            case 'padding':
                return isContinuousToContinuous(scaleType) || contains(['point', 'band'], scaleType);
            case 'paddingOuter':
            case 'rangeStep':
                return contains(['point', 'band'], scaleType);
            case 'paddingInner':
                return scaleType === 'band';
            case 'clamp':
                return isContinuousToContinuous(scaleType);
            case 'nice':
                return isContinuousToContinuous(scaleType) || scaleType === 'quantize' || scaleType === 'threshold';
            case 'exponent':
                return scaleType === 'pow';
            case 'base':
                return scaleType === 'log';
            case 'constant':
                return scaleType === 'symlog';
            case 'zero':
                return (hasContinuousDomain(scaleType) &&
                    !contains([
                        'log',
                        'time',
                        'utc',
                        'threshold',
                        'quantile' // quantile depends on distribution so zero does not matter
                    ], scaleType));
        }
        /* istanbul ignore next: should never reach here*/
        throw new Error(`Invalid scale property ${propName}.`);
    }
    /**
     * Returns undefined if the input channel supports the input scale property name
     */
    function channelScalePropertyIncompatability(channel, propName) {
        switch (propName) {
            case 'interpolate':
            case 'scheme':
                if (!isColorChannel(channel)) {
                    return message.cannotUseScalePropertyWithNonColor(channel);
                }
                return undefined;
            case 'type':
            case 'bins':
            case 'domain':
            case 'range':
            case 'base':
            case 'exponent':
            case 'constant':
            case 'nice':
            case 'padding':
            case 'paddingInner':
            case 'paddingOuter':
            case 'rangeStep':
            case 'reverse':
            case 'round':
            case 'clamp':
            case 'zero':
                return undefined; // GOOD!
        }
        /* istanbul ignore next: it should never reach here */
        throw new Error(`Invalid scale property "${propName}".`);
    }
    function scaleTypeSupportDataType(specifiedType, fieldDefType) {
        if (contains([ORDINAL, NOMINAL], fieldDefType)) {
            return specifiedType === undefined || hasDiscreteDomain(specifiedType);
        }
        else if (fieldDefType === TEMPORAL) {
            return contains([ScaleType.TIME, ScaleType.UTC, undefined], specifiedType);
        }
        else if (fieldDefType === QUANTITATIVE) {
            return contains([
                ScaleType.LOG,
                ScaleType.POW,
                ScaleType.SQRT,
                ScaleType.SYMLOG,
                ScaleType.QUANTILE,
                ScaleType.QUANTIZE,
                ScaleType.THRESHOLD,
                ScaleType.LINEAR,
                undefined
            ], specifiedType);
        }
        return true;
    }
    function channelSupportScaleType(channel, scaleType) {
        switch (channel) {
            case X:
            case Y:
                return isContinuousToContinuous(scaleType) || contains(['band', 'point'], scaleType);
            case SIZE: // TODO: size and opacity can support ordinal with more modification
            case STROKEWIDTH:
            case OPACITY:
            case FILLOPACITY:
            case STROKEOPACITY:
                // Although it generally doesn't make sense to use band with size and opacity,
                // it can also work since we use band: 0.5 to get midpoint.
                return (isContinuousToContinuous(scaleType) ||
                    isContinuousToDiscrete(scaleType) ||
                    contains(['band', 'point'], scaleType));
            case COLOR:
            case FILL:
            case STROKE:
                return scaleType !== 'band'; // band does not make sense with color
            case SHAPE:
                return scaleType === 'ordinal'; // shape = lookup only
        }
        /* istanbul ignore next: it should never reach here */
        return false;
    }
    // generates ScaleTypeIndex where keys are encoding channels and values are list of valid ScaleTypes
    function generateScaleTypeIndex() {
        const index = {};
        for (const channel of CHANNELS) {
            for (const fieldDefType of keys(TYPE_INDEX)) {
                for (const scaleType of SCALE_TYPES) {
                    const key = generateScaleTypeIndexKey(channel, fieldDefType);
                    if (channelSupportScaleType(channel, scaleType) && scaleTypeSupportDataType(scaleType, fieldDefType)) {
                        index[key] = index[key] || [];
                        index[key].push(scaleType);
                    }
                }
            }
        }
        return index;
    }
    function generateScaleTypeIndexKey(channel, fieldDefType) {
        return channel + '_' + fieldDefType;
    }

    var util = createCommonjsModule(function (module) {
    var u = module.exports;

    // utility functions

    var FNAME = '__name__';

    u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };

    u.name = function(f) { return f==null ? null : f[FNAME]; };

    u.identity = function(x) { return x; };

    u.true = u.namedfunc('true', function() { return true; });

    u.false = u.namedfunc('false', function() { return false; });

    u.duplicate = function(obj) {
      return JSON.parse(JSON.stringify(obj));
    };

    u.equal = function(a, b) {
      return JSON.stringify(a) === JSON.stringify(b);
    };

    u.extend = function(obj) {
      for (var x, name, i=1, len=arguments.length; i<len; ++i) {
        x = arguments[i];
        for (name in x) { obj[name] = x[name]; }
      }
      return obj;
    };

    u.length = function(x) {
      return x != null && x.length != null ? x.length : null;
    };

    u.keys = function(x) {
      var keys = [], k;
      for (k in x) keys.push(k);
      return keys;
    };

    u.vals = function(x) {
      var vals = [], k;
      for (k in x) vals.push(x[k]);
      return vals;
    };

    u.toMap = function(list, f) {
      return (f = u.$(f)) ?
        list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
        list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
    };

    u.keystr = function(values) {
      // use to ensure consistent key generation across modules
      var n = values.length;
      if (!n) return '';
      for (var s=String(values[0]), i=1; i<n; ++i) {
        s += '|' + String(values[i]);
      }
      return s;
    };

    // type checking functions

    var toString = Object.prototype.toString;

    u.isObject = function(obj) {
      return obj === Object(obj);
    };

    u.isFunction = function(obj) {
      return toString.call(obj) === '[object Function]';
    };

    u.isString = function(obj) {
      return typeof value === 'string' || toString.call(obj) === '[object String]';
    };

    u.isArray = Array.isArray || function(obj) {
      return toString.call(obj) === '[object Array]';
    };

    u.isNumber = function(obj) {
      return typeof obj === 'number' || toString.call(obj) === '[object Number]';
    };

    u.isBoolean = function(obj) {
      return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };

    u.isDate = function(obj) {
      return toString.call(obj) === '[object Date]';
    };

    u.isValid = function(obj) {
      return obj != null && obj === obj;
    };

    u.isBuffer = (typeof Buffer === 'function' && Buffer.isBuffer) || u.false;

    // type coercion functions

    u.number = function(s) {
      return s == null || s === '' ? null : +s;
    };

    u.boolean = function(s) {
      return s == null || s === '' ? null : s==='false' ? false : !!s;
    };

    // parse a date with optional d3.time-format format
    u.date = function(s, format) {
      var d = format ? format : Date;
      return s == null || s === '' ? null : d.parse(s);
    };

    u.array = function(x) {
      return x != null ? (u.isArray(x) ? x : [x]) : [];
    };

    u.str = function(x) {
      return u.isArray(x) ? '[' + x.map(u.str) + ']'
        : u.isObject(x) || u.isString(x) ?
          // Output valid JSON and JS source strings.
          // See http://timelessrepo.com/json-isnt-a-javascript-subset
          JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
        : x;
    };

    // data access functions

    var field_re = /\[(.*?)\]|[^.\[]+/g;

    u.field = function(f) {
      return String(f).match(field_re).map(function(d) {
        return d[0] !== '[' ? d :
          d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
          d.slice(2, -2).replace(/\\(["'])/g, '$1');
      });
    };

    u.accessor = function(f) {
      /* jshint evil: true */
      return f==null || u.isFunction(f) ? f :
        u.namedfunc(f, Function('x', 'return x[' + u.field(f).map(u.str).join('][') + '];'));
    };

    // short-cut for accessor
    u.$ = u.accessor;

    u.mutator = function(f) {
      var s;
      return u.isString(f) && (s=u.field(f)).length > 1 ?
        function(x, v) {
          for (var i=0; i<s.length-1; ++i) x = x[s[i]];
          x[s[i]] = v;
        } :
        function(x, v) { x[f] = v; };
    };


    u.$func = function(name, op) {
      return function(f) {
        f = u.$(f) || u.identity;
        var n = name + (u.name(f) ? '_'+u.name(f) : '');
        return u.namedfunc(n, function(d) { return op(f(d)); });
      };
    };

    u.$valid  = u.$func('valid', u.isValid);
    u.$length = u.$func('length', u.length);

    u.$in = function(f, values) {
      f = u.$(f);
      var map = u.isArray(values) ? u.toMap(values) : values;
      return function(d) { return !!map[f(d)]; };
    };

    // comparison / sorting functions

    u.comparator = function(sort) {
      var sign = [];
      if (sort === undefined) sort = [];
      sort = u.array(sort).map(function(f) {
        var s = 1;
        if      (f[0] === '-') { s = -1; f = f.slice(1); }
        else if (f[0] === '+') { s = +1; f = f.slice(1); }
        sign.push(s);
        return u.accessor(f);
      });
      return function(a, b) {
        var i, n, f, c;
        for (i=0, n=sort.length; i<n; ++i) {
          f = sort[i];
          c = u.cmp(f(a), f(b));
          if (c) return c * sign[i];
        }
        return 0;
      };
    };

    u.cmp = function(a, b) {
      return (a < b || a == null) && b != null ? -1 :
        (a > b || b == null) && a != null ? 1 :
        ((b = b instanceof Date ? +b : b),
         (a = a instanceof Date ? +a : a)) !== a && b === b ? -1 :
        b !== b && a === a ? 1 : 0;
    };

    u.numcmp = function(a, b) { return a - b; };

    u.stablesort = function(array, sortBy, keyFn) {
      var indices = array.reduce(function(idx, v, i) {
        return (idx[keyFn(v)] = i, idx);
      }, {});

      array.sort(function(a, b) {
        var sa = sortBy(a),
            sb = sortBy(b);
        return sa < sb ? -1 : sa > sb ? 1
             : (indices[keyFn(a)] - indices[keyFn(b)]);
      });

      return array;
    };

    // permutes an array using a Knuth shuffle
    u.permute = function(a) {
      var m = a.length,
          swap,
          i;

      while (m) {
        i = Math.floor(Math.random() * m--);
        swap = a[m];
        a[m] = a[i];
        a[i] = swap;
      }
    };

    // string functions

    u.pad = function(s, length, pos, padchar) {
      padchar = padchar || " ";
      var d = length - s.length;
      if (d <= 0) return s;
      switch (pos) {
        case 'left':
          return strrep(d, padchar) + s;
        case 'middle':
        case 'center':
          return strrep(Math.floor(d/2), padchar) +
             s + strrep(Math.ceil(d/2), padchar);
        default:
          return s + strrep(d, padchar);
      }
    };

    function strrep(n, str) {
      var s = "", i;
      for (i=0; i<n; ++i) s += str;
      return s;
    }

    u.truncate = function(s, length, pos, word, ellipsis) {
      var len = s.length;
      if (len <= length) return s;
      ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
      var l = Math.max(0, length - ellipsis.length);

      switch (pos) {
        case 'left':
          return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
        case 'middle':
        case 'center':
          var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
          return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
            ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
        default:
          return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
      }
    };

    function truncateOnWord(s, len, rev) {
      var cnt = 0, tok = s.split(truncate_word_re);
      if (rev) {
        s = (tok = tok.reverse())
          .filter(function(w) { cnt += w.length; return cnt <= len; })
          .reverse();
      } else {
        s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
      }
      return s.length ? s.join('').trim() : tok[0].slice(0, len);
    }

    var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;
    });
    var util_1 = util.isArray;
    var util_2 = util.cmp;
    var util_3 = util.keys;
    var util_4 = util.duplicate;
    var util_5 = util.extend;
    var util_6 = util.isObject;
    var util_7 = util.isBoolean;
    var util_8 = util.toMap;
    var util_9 = util.isString;

    function contains$1(array, item) {
        return array.indexOf(item) !== -1;
    }
    function every(arr, f) {
        for (let i = 0; i < arr.length; i++) {
            if (!f(arr[i], i)) {
                return false;
            }
        }
        return true;
    }
    function forEach(obj, f, thisArg) {
        if (obj.forEach) {
            obj.forEach.call(thisArg, f);
        }
        else {
            for (let k in obj) {
                f.call(thisArg, obj[k], k, obj);
            }
        }
    }
    function some$1(arr, f) {
        let i = 0, k;
        for (k in arr) {
            if (f(arr[k], k, i++)) {
                return true;
            }
        }
        return false;
    }
    function nestedMap(array, f) {
        return array.map((a) => {
            if (util_1(a)) {
                return nestedMap(a, f);
            }
            return f(a);
        });
    }
    /** Returns the array without the elements in item */
    function without(array, excludedItems) {
        return array.filter(function (item) {
            return !contains$1(excludedItems, item);
        });
    }
    function flagKeys$1(f) {
        return Object.keys(f);
    }

    var util$1 = /*#__PURE__*/Object.freeze({
        isArray: util_1,
        contains: contains$1,
        every: every,
        forEach: forEach,
        some: some$1,
        nestedMap: nestedMap,
        without: without,
        flagKeys: flagKeys$1,
        cmp: util_2,
        keys: util_3,
        duplicate: util_4,
        extend: util_5,
        isObject: util_6,
        isBoolean: util_7,
        toMap: util_8
    });

    function isEncodingNestedProp(p) {
        return !!p['parent'];
    }
    const ENCODING_TOPLEVEL_PROP_INDEX = {
        channel: 1,
        aggregate: 1,
        autoCount: 1,
        bin: 1,
        timeUnit: 1,
        hasFn: 1,
        sort: 1,
        stack: 1,
        field: 1,
        type: 1,
        format: 1,
        scale: 1,
        axis: 1,
        legend: 1,
        value: 1
    };
    const ENCODING_TOPLEVEL_PROPS = flagKeys$1(ENCODING_TOPLEVEL_PROP_INDEX);
    function isEncodingTopLevelProperty(p) {
        return p in ENCODING_TOPLEVEL_PROP_INDEX;
    }
    const ENCODING_NESTED_PROP_PARENT_INDEX = {
        bin: 1,
        scale: 1,
        sort: 1,
        axis: 1,
        legend: 1
    };
    function isEncodingNestedParent(prop) {
        return ENCODING_NESTED_PROP_PARENT_INDEX[prop];
    }
    // FIXME -- we should not have to manually specify these
    const BIN_CHILD_PROPS = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
    const SORT_CHILD_PROPS = ['field', 'op', 'order'];
    const BIN_PROPS = BIN_CHILD_PROPS.map((c) => {
        return { parent: 'bin', child: c };
    });
    const SORT_PROPS = SORT_CHILD_PROPS.map((c) => {
        return { parent: 'sort', child: c };
    });
    const SCALE_PROPS = SCALE_PROPERTIES.map((c) => {
        return { parent: 'scale', child: c };
    });
    const AXIS_PROPS = AXIS_PROPERTIES.map((c) => {
        return { parent: 'axis', child: c };
    });
    const LEGEND_PROPS = LEGEND_PROPERTIES.map((c) => {
        return { parent: 'legend', child: c };
    });
    const ENCODING_NESTED_PROPS = [].concat(BIN_PROPS, SORT_PROPS, SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS);
    const VIEW_PROPS = ['width', 'height', 'background', 'padding', 'title'];
    const PROP_KEY_DELIMITER = '.';
    function toKey(p) {
        if (isEncodingNestedProp(p)) {
            return p.parent + PROP_KEY_DELIMITER + p.child;
        }
        return p;
    }
    function fromKey(k) {
        const split = k.split(PROP_KEY_DELIMITER);
        /* istanbul ignore else */
        if (split.length === 1) {
            return k;
        }
        else if (split.length === 2) {
            return {
                parent: split[0],
                child: split[1]
            };
        }
        else {
            throw 'Invalid property key with ' + split.length + ' dots: ' + k;
        }
    }
    const ENCODING_NESTED_PROP_INDEX = ENCODING_NESTED_PROPS.reduce((i, prop) => {
        i[prop.parent] = i[prop.parent] || [];
        i[prop.parent][prop.child] = prop;
        return i;
    }, {});
    // FIXME consider using a more general method
    function getEncodingNestedProp(parent, child) {
        return (ENCODING_NESTED_PROP_INDEX[parent] || {})[child];
    }
    function isEncodingProperty(p) {
        return isEncodingTopLevelProperty(p) || isEncodingNestedProp(p);
    }
    const ALL_ENCODING_PROPS = [].concat(ENCODING_TOPLEVEL_PROPS, ENCODING_NESTED_PROPS);
    const DEFAULT_PROP_PRECEDENCE = [
        'type',
        'field',
        // Field Transform
        'bin',
        'timeUnit',
        'aggregate',
        'autoCount',
        // Encoding
        'channel',
        // Mark
        'mark',
        'stack',
        'scale',
        'sort',
        'axis',
        'legend'
    ].concat(BIN_PROPS, SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS, SORT_PROPS);
    var Property;
    (function (Property) {
        Property.MARK = 'mark';
        Property.TRANSFORM = 'transform';
        // Layout
        Property.STACK = 'stack';
        Property.FORMAT = 'format';
        // TODO: sub parts of stack
        // Encoding Properties
        Property.CHANNEL = 'channel';
        Property.AGGREGATE = 'aggregate';
        Property.AUTOCOUNT = 'autoCount';
        Property.BIN = 'bin';
        Property.HAS_FN = 'hasFn';
        Property.TIMEUNIT = 'timeUnit';
        Property.FIELD = 'field';
        Property.TYPE = 'type';
        Property.SORT = 'sort';
        Property.SCALE = 'scale';
        Property.AXIS = 'axis';
        Property.LEGEND = 'legend';
        Property.WIDTH = 'width';
        Property.HEIGHT = 'height';
        Property.BACKGROUND = 'background';
        Property.PADDING = 'padding';
        Property.TITLE = 'title';
    })(Property || (Property = {}));

    var property = /*#__PURE__*/Object.freeze({
        isEncodingNestedProp: isEncodingNestedProp,
        ENCODING_TOPLEVEL_PROPS: ENCODING_TOPLEVEL_PROPS,
        isEncodingTopLevelProperty: isEncodingTopLevelProperty,
        isEncodingNestedParent: isEncodingNestedParent,
        BIN_CHILD_PROPS: BIN_CHILD_PROPS,
        SORT_CHILD_PROPS: SORT_CHILD_PROPS,
        SORT_PROPS: SORT_PROPS,
        SCALE_PROPS: SCALE_PROPS,
        ENCODING_NESTED_PROPS: ENCODING_NESTED_PROPS,
        VIEW_PROPS: VIEW_PROPS,
        toKey: toKey,
        fromKey: fromKey,
        getEncodingNestedProp: getEncodingNestedProp,
        isEncodingProperty: isEncodingProperty,
        ALL_ENCODING_PROPS: ALL_ENCODING_PROPS,
        DEFAULT_PROP_PRECEDENCE: DEFAULT_PROP_PRECEDENCE,
        get Property () { return Property; }
    });

    const AREA = 'area';
    const BAR = 'bar';
    const LINE = 'line';
    const POINT = 'point';
    const RECT = 'rect';
    const RULE = 'rule';
    const TEXT$1 = 'text';
    const TICK = 'tick';
    const CIRCLE = 'circle';
    const SQUARE = 'square';
    // Using mapped type to declare index, ensuring we always have all marks when we add more.
    const MARK_INDEX = {
        area: 1,
        bar: 1,
        line: 1,
        point: 1,
        text: 1,
        tick: 1,
        trail: 1,
        rect: 1,
        geoshape: 1,
        rule: 1,
        circle: 1,
        square: 1
    };
    function isPathMark(m) {
        return contains(['line', 'area', 'trail'], m);
    }
    const PRIMITIVE_MARKS = flagKeys(MARK_INDEX);
    function isMarkDef(mark) {
        return mark['type'];
    }
    const PRIMITIVE_MARK_INDEX = toSet(PRIMITIVE_MARKS);

    // DateTime definition object
    /*
     * A designated year that starts on Sunday.
     */
    const SUNDAY_YEAR = 2006;
    function isDateTime(o) {
        return (!!o &&
            (!!o.year ||
                !!o.quarter ||
                !!o.month ||
                !!o.date ||
                !!o.day ||
                !!o.hours ||
                !!o.minutes ||
                !!o.seconds ||
                !!o.milliseconds));
    }
    const MONTHS = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
    ];
    const SHORT_MONTHS = MONTHS.map(m => m.substr(0, 3));
    const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const SHORT_DAYS = DAYS.map(d => d.substr(0, 3));
    function normalizeQuarter(q) {
        if (isNumber(q)) {
            if (q > 4) {
                warn(message.invalidTimeUnit('quarter', q));
            }
            // We accept 1-based quarter, so need to readjust to 0-based quarter
            return (q - 1).toString();
        }
        else {
            // Invalid quarter
            throw new Error(message.invalidTimeUnit('quarter', q));
        }
    }
    function normalizeMonth(m) {
        if (isNumber(m)) {
            // We accept 1-based month, so need to readjust to 0-based month
            return (m - 1).toString();
        }
        else {
            const lowerM = m.toLowerCase();
            const monthIndex = MONTHS.indexOf(lowerM);
            if (monthIndex !== -1) {
                return monthIndex + ''; // 0 for january, ...
            }
            const shortM = lowerM.substr(0, 3);
            const shortMonthIndex = SHORT_MONTHS.indexOf(shortM);
            if (shortMonthIndex !== -1) {
                return shortMonthIndex + '';
            }
            // Invalid month
            throw new Error(message.invalidTimeUnit('month', m));
        }
    }
    function normalizeDay(d) {
        if (isNumber(d)) {
            // mod so that this can be both 0-based where 0 = sunday
            // and 1-based where 7=sunday
            return (d % 7) + '';
        }
        else {
            const lowerD = d.toLowerCase();
            const dayIndex = DAYS.indexOf(lowerD);
            if (dayIndex !== -1) {
                return dayIndex + ''; // 0 for january, ...
            }
            const shortD = lowerD.substr(0, 3);
            const shortDayIndex = SHORT_DAYS.indexOf(shortD);
            if (shortDayIndex !== -1) {
                return shortDayIndex + '';
            }
            // Invalid day
            throw new Error(message.invalidTimeUnit('day', d));
        }
    }
    /**
     * Return Vega Expression for a particular date time.
     * @param d
     * @param normalize whether to normalize quarter, month, day.
     */
    function dateTimeExpr(d, normalize = false) {
        const units = [];
        if (normalize && d.day !== undefined) {
            if (keys(d).length > 1) {
                warn(message.droppedDay(d));
                d = duplicate(d);
                delete d.day;
            }
        }
        if (d.year !== undefined) {
            units.push(d.year);
        }
        else if (d.day !== undefined) {
            // Set year to 2006 for working with day since January 1 2006 is a Sunday
            units.push(SUNDAY_YEAR);
        }
        else {
            units.push(0);
        }
        if (d.month !== undefined) {
            const month = normalize ? normalizeMonth(d.month) : d.month;
            units.push(month);
        }
        else if (d.quarter !== undefined) {
            const quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
            units.push(quarter + '*3');
        }
        else {
            units.push(0); // months start at zero in JS
        }
        if (d.date !== undefined) {
            units.push(d.date);
        }
        else if (d.day !== undefined) {
            // HACK: Day only works as a standalone unit
            // This is only correct because we always set year to 2006 for day
            const day = normalize ? normalizeDay(d.day) : d.day;
            units.push(day + '+1');
        }
        else {
            units.push(1); // Date starts at 1 in JS
        }
        // Note: can't use TimeUnit enum here as importing it will create
        // circular dependency problem!
        for (const timeUnit of ['hours', 'minutes', 'seconds', 'milliseconds']) {
            if (d[timeUnit] !== undefined) {
                units.push(d[timeUnit]);
            }
            else {
                units.push(0);
            }
        }
        if (d.utc) {
            return `utc(${units.join(', ')})`;
        }
        else {
            return `datetime(${units.join(', ')})`;
        }
    }

    var TimeUnit;
    (function (TimeUnit) {
        TimeUnit.YEAR = 'year';
        TimeUnit.MONTH = 'month';
        TimeUnit.DAY = 'day';
        TimeUnit.DATE = 'date';
        TimeUnit.HOURS = 'hours';
        TimeUnit.MINUTES = 'minutes';
        TimeUnit.SECONDS = 'seconds';
        TimeUnit.MILLISECONDS = 'milliseconds';
        TimeUnit.YEARMONTH = 'yearmonth';
        TimeUnit.YEARMONTHDATE = 'yearmonthdate';
        TimeUnit.YEARMONTHDATEHOURS = 'yearmonthdatehours';
        TimeUnit.YEARMONTHDATEHOURSMINUTES = 'yearmonthdatehoursminutes';
        TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS = 'yearmonthdatehoursminutesseconds';
        // MONTHDATE and MONTHDATEHOURS always include 29 February since we use year 0th (which is a leap year);
        TimeUnit.MONTHDATE = 'monthdate';
        TimeUnit.MONTHDATEHOURS = 'monthdatehours';
        TimeUnit.HOURSMINUTES = 'hoursminutes';
        TimeUnit.HOURSMINUTESSECONDS = 'hoursminutesseconds';
        TimeUnit.MINUTESSECONDS = 'minutesseconds';
        TimeUnit.SECONDSMILLISECONDS = 'secondsmilliseconds';
        TimeUnit.QUARTER = 'quarter';
        TimeUnit.YEARQUARTER = 'yearquarter';
        TimeUnit.QUARTERMONTH = 'quartermonth';
        TimeUnit.YEARQUARTERMONTH = 'yearquartermonth';
        TimeUnit.UTCYEAR = 'utcyear';
        TimeUnit.UTCMONTH = 'utcmonth';
        TimeUnit.UTCDAY = 'utcday';
        TimeUnit.UTCDATE = 'utcdate';
        TimeUnit.UTCHOURS = 'utchours';
        TimeUnit.UTCMINUTES = 'utcminutes';
        TimeUnit.UTCSECONDS = 'utcseconds';
        TimeUnit.UTCMILLISECONDS = 'utcmilliseconds';
        TimeUnit.UTCYEARMONTH = 'utcyearmonth';
        TimeUnit.UTCYEARMONTHDATE = 'utcyearmonthdate';
        TimeUnit.UTCYEARMONTHDATEHOURS = 'utcyearmonthdatehours';
        TimeUnit.UTCYEARMONTHDATEHOURSMINUTES = 'utcyearmonthdatehoursminutes';
        TimeUnit.UTCYEARMONTHDATEHOURSMINUTESSECONDS = 'utcyearmonthdatehoursminutesseconds';
        // UTCMONTHDATE and UTCMONTHDATEHOURS always include 29 February since we use year 0th (which is a leap year);
        TimeUnit.UTCMONTHDATE = 'utcmonthdate';
        TimeUnit.UTCMONTHDATEHOURS = 'utcmonthdatehours';
        TimeUnit.UTCHOURSMINUTES = 'utchoursminutes';
        TimeUnit.UTCHOURSMINUTESSECONDS = 'utchoursminutesseconds';
        TimeUnit.UTCMINUTESSECONDS = 'utcminutesseconds';
        TimeUnit.UTCSECONDSMILLISECONDS = 'utcsecondsmilliseconds';
        TimeUnit.UTCQUARTER = 'utcquarter';
        TimeUnit.UTCYEARQUARTER = 'utcyearquarter';
        TimeUnit.UTCQUARTERMONTH = 'utcquartermonth';
        TimeUnit.UTCYEARQUARTERMONTH = 'utcyearquartermonth';
    })(TimeUnit || (TimeUnit = {}));
    /** Time Unit that only corresponds to only one part of Date objects. */
    const LOCAL_SINGLE_TIMEUNIT_INDEX = {
        year: 1,
        quarter: 1,
        month: 1,
        day: 1,
        date: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        milliseconds: 1
    };
    const TIMEUNIT_PARTS = flagKeys(LOCAL_SINGLE_TIMEUNIT_INDEX);
    function isLocalSingleTimeUnit(timeUnit) {
        return !!LOCAL_SINGLE_TIMEUNIT_INDEX[timeUnit];
    }
    const UTC_SINGLE_TIMEUNIT_INDEX = {
        utcyear: 1,
        utcquarter: 1,
        utcmonth: 1,
        utcday: 1,
        utcdate: 1,
        utchours: 1,
        utcminutes: 1,
        utcseconds: 1,
        utcmilliseconds: 1
    };
    function isUtcSingleTimeUnit(timeUnit) {
        return !!UTC_SINGLE_TIMEUNIT_INDEX[timeUnit];
    }
    const LOCAL_MULTI_TIMEUNIT_INDEX = {
        yearquarter: 1,
        yearquartermonth: 1,
        yearmonth: 1,
        yearmonthdate: 1,
        yearmonthdatehours: 1,
        yearmonthdatehoursminutes: 1,
        yearmonthdatehoursminutesseconds: 1,
        quartermonth: 1,
        monthdate: 1,
        monthdatehours: 1,
        hoursminutes: 1,
        hoursminutesseconds: 1,
        minutesseconds: 1,
        secondsmilliseconds: 1
    };
    const UTC_MULTI_TIMEUNIT_INDEX = {
        utcyearquarter: 1,
        utcyearquartermonth: 1,
        utcyearmonth: 1,
        utcyearmonthdate: 1,
        utcyearmonthdatehours: 1,
        utcyearmonthdatehoursminutes: 1,
        utcyearmonthdatehoursminutesseconds: 1,
        utcquartermonth: 1,
        utcmonthdate: 1,
        utcmonthdatehours: 1,
        utchoursminutes: 1,
        utchoursminutesseconds: 1,
        utcminutesseconds: 1,
        utcsecondsmilliseconds: 1
    };
    const UTC_TIMEUNIT_INDEX = Object.assign({}, UTC_SINGLE_TIMEUNIT_INDEX, UTC_MULTI_TIMEUNIT_INDEX);
    function isUTCTimeUnit(t) {
        return !!UTC_TIMEUNIT_INDEX[t];
    }
    function getLocalTimeUnit(t) {
        return t.substr(3);
    }
    const TIMEUNIT_INDEX = Object.assign({}, LOCAL_SINGLE_TIMEUNIT_INDEX, UTC_SINGLE_TIMEUNIT_INDEX, LOCAL_MULTI_TIMEUNIT_INDEX, UTC_MULTI_TIMEUNIT_INDEX);
    function isTimeUnit(t) {
        return !!TIMEUNIT_INDEX[t];
    }
    const SET_DATE_METHOD = {
        year: 'setFullYear',
        month: 'setMonth',
        date: 'setDate',
        hours: 'setHours',
        minutes: 'setMinutes',
        seconds: 'setSeconds',
        milliseconds: 'setMilliseconds',
        // Day and quarter have their own special cases
        quarter: null,
        day: null
    };
    /**
     * Converts a date to only have the measurements relevant to the specified unit
     * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
     * Note: the base date is Jan 01 1900 00:00:00
     */
    function convert(unit, date) {
        const isUTC = isUTCTimeUnit(unit);
        const result = isUTC
            ? // start with uniform date
                new Date(Date.UTC(1972, 0, 1, 0, 0, 0, 0)) // 1972 is the first leap year after 1970, the start of unix time
            : new Date(1972, 0, 1, 0, 0, 0, 0);
        for (const timeUnitPart of TIMEUNIT_PARTS) {
            if (containsTimeUnit(unit, timeUnitPart)) {
                switch (timeUnitPart) {
                    case TimeUnit.DAY:
                        throw new Error("Cannot convert to TimeUnits containing 'day'");
                    case TimeUnit.QUARTER: {
                        const { getDateMethod, setDateMethod } = dateMethods('month', isUTC);
                        // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
                        result[setDateMethod](Math.floor(date[getDateMethod]() / 3) * 3);
                        break;
                    }
                    default: {
                        const { getDateMethod, setDateMethod } = dateMethods(timeUnitPart, isUTC);
                        result[setDateMethod](date[getDateMethod]());
                    }
                }
            }
        }
        return result;
    }
    function dateMethods(singleUnit, isUtc) {
        const rawSetDateMethod = SET_DATE_METHOD[singleUnit];
        const setDateMethod = isUtc ? 'setUTC' + rawSetDateMethod.substr(3) : rawSetDateMethod;
        const getDateMethod = 'get' + (isUtc ? 'UTC' : '') + rawSetDateMethod.substr(3);
        return { setDateMethod, getDateMethod };
    }
    function getTimeUnitParts(timeUnit) {
        return TIMEUNIT_PARTS.reduce((parts, part) => {
            if (containsTimeUnit(timeUnit, part)) {
                return [...parts, part];
            }
            return parts;
        }, []);
    }
    /** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
    function containsTimeUnit(fullTimeUnit, timeUnit) {
        const index = fullTimeUnit.indexOf(timeUnit);
        return (index > -1 && (timeUnit !== TimeUnit.SECONDS || index === 0 || fullTimeUnit.charAt(index - 1) !== 'i') // exclude milliseconds
        );
    }
    function normalizeTimeUnit(timeUnit) {
        if (timeUnit !== 'day' && timeUnit.indexOf('day') >= 0) {
            warn(message.dayReplacedWithDate(timeUnit));
            return timeUnit.replace('day', 'date');
        }
        return timeUnit;
    }

    const SHORT_WILDCARD = '?';
    function isWildcard(prop) {
        return isShortWildcard(prop) || isWildcardDef(prop);
    }
    function isShortWildcard(prop) {
        return prop === SHORT_WILDCARD;
    }
    function isWildcardDef(prop) {
        return prop !== undefined && prop != null && (!!prop.enum || !!prop.name) && !util_1(prop);
    }
    function initWildcard(prop, defaultName, defaultEnumValues) {
        return util_5({}, {
            name: defaultName,
            enum: defaultEnumValues
        }, prop === SHORT_WILDCARD ? {} : prop);
    }
    /**
     * Initial short names from list of full camelCaseNames.
     * For each camelCaseNames, return unique short names based on initial (e.g., `ccn`)
     */
    function initNestedPropName(fullNames) {
        let index = {};
        let has = {};
        for (const fullName of fullNames) {
            const initialIndices = [0];
            for (let i = 0; i < fullName.length; i++) {
                if (fullName.charAt(i).toUpperCase() === fullName.charAt(i)) {
                    initialIndices.push(i);
                }
            }
            let shortName = initialIndices
                .map(i => fullName.charAt(i))
                .join('')
                .toLowerCase();
            if (!has[shortName]) {
                index[fullName] = shortName;
                has[shortName] = true;
                continue;
            }
            // If duplicate, add last character and try again!
            if (initialIndices[initialIndices.length - 1] !== fullName.length - 1) {
                shortName = initialIndices
                    .concat([fullName.length - 1])
                    .map(i => fullName.charAt(i))
                    .join('')
                    .toLowerCase();
                if (!has[shortName]) {
                    index[fullName] = shortName;
                    has[shortName] = true;
                    continue;
                }
            }
            for (let i = 1; !index[fullName]; i++) {
                let shortNameWithNo = shortName + '_' + i;
                if (!has[shortNameWithNo]) {
                    index[fullName] = shortNameWithNo;
                    has[shortNameWithNo] = true;
                    break;
                }
            }
        }
        return index;
    }
    const DEFAULT_NAME = {
        mark: 'm',
        channel: 'c',
        aggregate: 'a',
        autoCount: '#',
        hasFn: 'h',
        bin: 'b',
        sort: 'so',
        stack: 'st',
        scale: 's',
        format: 'f',
        axis: 'ax',
        legend: 'l',
        value: 'v',
        timeUnit: 'tu',
        field: 'f',
        type: 't',
        binProps: {
            maxbins: 'mb',
            min: 'mi',
            max: 'ma',
            base: 'b',
            step: 's',
            steps: 'ss',
            minstep: 'ms',
            divide: 'd'
        },
        sortProps: {
            field: 'f',
            op: 'o',
            order: 'or'
        },
        scaleProps: initNestedPropName(SCALE_PROPERTIES),
        axisProps: initNestedPropName(AXIS_PROPERTIES),
        legendProps: initNestedPropName(LEGEND_PROPERTIES)
    };
    function getDefaultName(prop) {
        if (isEncodingNestedProp(prop)) {
            return DEFAULT_NAME[prop.parent] + '-' + DEFAULT_NAME[prop.parent + 'Props'][prop.child];
        }
        if (DEFAULT_NAME[prop]) {
            return DEFAULT_NAME[prop];
        }
        /* istanbul ignore next */
        throw new Error('Default name undefined for ' + prop);
    }
    const DEFAULT_BOOLEAN_ENUM = [false, true];
    const DEFAULT_BIN_PROPS_ENUM = {
        maxbins: [5, 10, 20],
        extent: [undefined],
        base: [10],
        step: [undefined],
        steps: [undefined],
        minstep: [undefined],
        divide: [[5, 2]],
        binned: [false],
        anchor: [undefined],
        nice: [true]
    };
    const DEFAULT_SORT_PROPS = {
        field: [undefined],
        op: ['min', 'mean'],
        order: ['ascending', 'descending']
    };
    const DEFAULT_SCALE_PROPS_ENUM = {
        type: [undefined, ScaleType.LOG],
        domain: [undefined],
        base: [undefined],
        exponent: [1, 2],
        constant: [undefined],
        bins: [undefined],
        clamp: DEFAULT_BOOLEAN_ENUM,
        nice: DEFAULT_BOOLEAN_ENUM,
        reverse: DEFAULT_BOOLEAN_ENUM,
        round: DEFAULT_BOOLEAN_ENUM,
        zero: DEFAULT_BOOLEAN_ENUM,
        padding: [undefined],
        paddingInner: [undefined],
        paddingOuter: [undefined],
        interpolate: [undefined],
        range: [undefined],
        rangeStep: [17, 21],
        scheme: [undefined]
    };
    const DEFAULT_AXIS_PROPS_ENUM = {
        zindex: [1, 0],
        offset: [undefined],
        orient: [undefined],
        values: [undefined],
        bandPosition: [undefined],
        encoding: [undefined],
        domain: DEFAULT_BOOLEAN_ENUM,
        domainColor: [undefined],
        domainDash: [undefined],
        domainDashOffset: [undefined],
        domainOpacity: [undefined],
        domainWidth: [undefined],
        formatType: [undefined],
        grid: DEFAULT_BOOLEAN_ENUM,
        gridColor: [undefined],
        gridDash: [undefined],
        gridDashOffset: [undefined],
        gridOpacity: [undefined],
        gridWidth: [undefined],
        format: [undefined],
        labels: DEFAULT_BOOLEAN_ENUM,
        labelAlign: [undefined],
        labelAngle: [undefined],
        labelBaseline: [undefined],
        labelColor: [undefined],
        labelFlushOffset: [undefined],
        labelFont: [undefined],
        labelFontSize: [undefined],
        labelFontStyle: [undefined],
        labelFontWeight: [undefined],
        labelLimit: [undefined],
        labelOpacity: [undefined],
        labelSeparation: [undefined],
        labelOverlap: [undefined],
        labelPadding: [undefined],
        labelBound: [undefined],
        labelFlush: [undefined],
        maxExtent: [undefined],
        minExtent: [undefined],
        position: [undefined],
        ticks: DEFAULT_BOOLEAN_ENUM,
        tickColor: [undefined],
        tickCount: [undefined],
        tickDash: [undefined],
        tickExtra: [undefined],
        tickDashOffset: [undefined],
        tickMinStep: [undefined],
        tickOffset: [undefined],
        tickOpacity: [undefined],
        tickRound: [undefined],
        tickSize: [undefined],
        tickWidth: [undefined],
        title: [undefined],
        titleAlign: [undefined],
        titleAnchor: [undefined],
        titleAngle: [undefined],
        titleBaseline: [undefined],
        titleColor: [undefined],
        titleFont: [undefined],
        titleFontSize: [undefined],
        titleFontStyle: [undefined],
        titleFontWeight: [undefined],
        titleLimit: [undefined],
        titleOpacity: [undefined],
        titlePadding: [undefined],
        titleX: [undefined],
        titleY: [undefined]
    };
    const DEFAULT_LEGEND_PROPS_ENUM = {
        orient: ['left', 'right'],
        format: [undefined],
        type: [undefined],
        values: [undefined],
        zindex: [undefined],
        clipHeight: [undefined],
        columnPadding: [undefined],
        columns: [undefined],
        cornerRadius: [undefined],
        direction: [undefined],
        encoding: [undefined],
        fillColor: [undefined],
        formatType: [undefined],
        gridAlign: [undefined],
        offset: [undefined],
        padding: [undefined],
        rowPadding: [undefined],
        strokeColor: [undefined],
        labelAlign: [undefined],
        labelBaseline: [undefined],
        labelColor: [undefined],
        labelFont: [undefined],
        labelFontSize: [undefined],
        labelFontStyle: [undefined],
        labelFontWeight: [undefined],
        labelLimit: [undefined],
        labelOffset: [undefined],
        labelOpacity: [undefined],
        labelOverlap: [undefined],
        labelPadding: [undefined],
        labelSeparation: [undefined],
        legendX: [undefined],
        legendY: [undefined],
        gradientLength: [undefined],
        gradientOpacity: [undefined],
        gradientStrokeColor: [undefined],
        gradientStrokeWidth: [undefined],
        gradientThickness: [undefined],
        symbolDash: [undefined],
        symbolDashOffset: [undefined],
        symbolFillColor: [undefined],
        symbolOffset: [undefined],
        symbolOpacity: [undefined],
        symbolSize: [undefined],
        symbolStrokeColor: [undefined],
        symbolStrokeWidth: [undefined],
        symbolType: [undefined],
        tickCount: [undefined],
        tickMinStep: [undefined],
        title: [undefined],
        titleAnchor: [undefined],
        titleAlign: [undefined],
        titleBaseline: [undefined],
        titleColor: [undefined],
        titleFont: [undefined],
        titleFontSize: [undefined],
        titleFontStyle: [undefined],
        titleFontWeight: [undefined],
        titleLimit: [undefined],
        titleOpacity: [undefined],
        titleOrient: [undefined],
        titlePadding: [undefined]
    };
    // Use FullEnumIndex to make sure we have all properties specified here!
    const DEFAULT_ENUM_INDEX = {
        mark: [POINT, BAR, LINE, AREA, RECT, TICK, TEXT$1],
        channel: [X, Y, ROW, COLUMN, SIZE, COLOR],
        aggregate: [undefined, 'mean'],
        autoCount: DEFAULT_BOOLEAN_ENUM,
        bin: DEFAULT_BOOLEAN_ENUM,
        hasFn: DEFAULT_BOOLEAN_ENUM,
        timeUnit: [undefined, TimeUnit.YEAR, TimeUnit.MONTH, TimeUnit.MINUTES, TimeUnit.SECONDS],
        field: [undefined],
        type: [NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL],
        sort: ['ascending', 'descending'],
        stack: ['zero', 'normalize', 'center', null],
        value: [undefined],
        format: [undefined],
        title: [undefined],
        scale: [true],
        axis: DEFAULT_BOOLEAN_ENUM,
        legend: DEFAULT_BOOLEAN_ENUM,
        binProps: DEFAULT_BIN_PROPS_ENUM,
        sortProps: DEFAULT_SORT_PROPS,
        scaleProps: DEFAULT_SCALE_PROPS_ENUM,
        axisProps: DEFAULT_AXIS_PROPS_ENUM,
        legendProps: DEFAULT_LEGEND_PROPS_ENUM
    };
    // TODO: rename this to getDefaultEnum
    function getDefaultEnumValues(prop, schema, opt) {
        if (prop === 'field' || (isEncodingNestedProp(prop) && prop.parent === 'sort' && prop.child === 'field')) {
            // For field, by default enumerate all fields
            return schema.fieldNames();
        }
        let val;
        if (isEncodingNestedProp(prop)) {
            val = opt.enum[prop.parent + 'Props'][prop.child];
        }
        else {
            val = opt.enum[prop];
        }
        if (val !== undefined) {
            return val;
        }
        /* istanbul ignore next */
        throw new Error('No default enumValues for ' + JSON.stringify(prop));
    }

    var wildcard = /*#__PURE__*/Object.freeze({
        SHORT_WILDCARD: SHORT_WILDCARD,
        isWildcard: isWildcard,
        isShortWildcard: isShortWildcard,
        isWildcardDef: isWildcardDef,
        initWildcard: initWildcard,
        DEFAULT_NAME: DEFAULT_NAME,
        getDefaultName: getDefaultName,
        DEFAULT_ENUM_INDEX: DEFAULT_ENUM_INDEX,
        getDefaultEnumValues: getDefaultEnumValues
    });

    const DEFAULT_QUERY_CONFIG = {
        verbose: false,
        defaultSpecConfig: {
            line: { point: true },
            scale: { useUnaggregatedDomain: true }
        },
        propertyPrecedence: DEFAULT_PROP_PRECEDENCE.map(toKey),
        enum: DEFAULT_ENUM_INDEX,
        numberNominalProportion: 0.05,
        numberNominalLimit: 40,
        // CONSTRAINTS
        constraintManuallySpecifiedValue: false,
        // Spec Constraints -- See description inside src/constraints/spec.ts
        autoAddCount: false,
        hasAppropriateGraphicTypeForMark: true,
        omitAggregate: false,
        omitAggregatePlotWithDimensionOnlyOnFacet: true,
        omitAggregatePlotWithoutDimension: false,
        omitBarLineAreaWithOcclusion: true,
        omitBarTickWithSize: true,
        omitMultipleNonPositionalChannels: true,
        omitRaw: false,
        omitRawContinuousFieldForAggregatePlot: true,
        omitRepeatedField: true,
        omitNonPositionalOrFacetOverPositionalChannels: true,
        omitTableWithOcclusionIfAutoAddCount: true,
        omitVerticalDotPlot: false,
        omitInvalidStackSpec: true,
        omitNonSumStack: true,
        preferredBinAxis: X,
        preferredTemporalAxis: X,
        preferredOrdinalAxis: Y,
        preferredNominalAxis: Y,
        preferredFacet: ROW,
        // Field Encoding Constraints -- See description inside src/constraint/field.ts
        minCardinalityForBin: 15,
        maxCardinalityForCategoricalColor: 20,
        maxCardinalityForFacet: 20,
        maxCardinalityForShape: 6,
        timeUnitShouldHaveVariation: true,
        typeMatchesSchemaType: true,
        // STYLIZE
        stylize: true,
        smallRangeStepForHighCardinalityOrFacet: { maxCardinality: 10, rangeStep: 12 },
        nominalColorScaleForHighCardinality: { maxCardinality: 10, palette: 'category20' },
        xAxisOnTopForHighYCardinalityWithoutColumn: { maxCardinality: 30 },
        // RANKING PREFERENCE
        maxGoodCardinalityForFacet: 5,
        maxGoodCardinalityForColor: 7,
        // HIGH CARDINALITY STRINGS
        minPercentUniqueForKey: 0.8,
        minCardinalityForKey: 50
    };
    function extendConfig(opt) {
        return Object.assign({}, DEFAULT_QUERY_CONFIG, opt, { enum: extendEnumIndex(opt.enum) });
    }
    function extendEnumIndex(enumIndex) {
        const enumOpt = Object.assign({}, DEFAULT_ENUM_INDEX, enumIndex, { binProps: extendNestedEnumIndex(enumIndex, 'bin'), scaleProps: extendNestedEnumIndex(enumIndex, 'scale'), axisProps: extendNestedEnumIndex(enumIndex, 'axis'), legendProps: extendNestedEnumIndex(enumIndex, 'legend') });
        return enumOpt;
    }
    function extendNestedEnumIndex(enumIndex, prop) {
        return Object.assign({}, DEFAULT_ENUM_INDEX[prop + 'Props'], enumIndex[prop + 'Props']);
    }

    var config = /*#__PURE__*/Object.freeze({
        DEFAULT_QUERY_CONFIG: DEFAULT_QUERY_CONFIG,
        extendConfig: extendConfig
    });

    const AGGREGATE_OP_INDEX = {
        argmax: 1,
        argmin: 1,
        average: 1,
        count: 1,
        distinct: 1,
        max: 1,
        mean: 1,
        median: 1,
        min: 1,
        missing: 1,
        q1: 1,
        q3: 1,
        ci0: 1,
        ci1: 1,
        stderr: 1,
        stdev: 1,
        stdevp: 1,
        sum: 1,
        valid: 1,
        values: 1,
        variance: 1,
        variancep: 1
    };
    function isArgminDef(a) {
        return !!a && !!a['argmin'];
    }
    function isArgmaxDef(a) {
        return !!a && !!a['argmax'];
    }
    function isAggregateOp(a) {
        return isString(a) && !!AGGREGATE_OP_INDEX[a];
    }
    const COUNTING_OPS = ['count', 'valid', 'missing', 'distinct'];
    function isCountingAggregateOp(aggregate) {
        return aggregate && isString(aggregate) && contains(COUNTING_OPS, aggregate);
    }
    /** Additive-based aggregation operations.  These can be applied to stack. */
    const SUM_OPS = ['count', 'sum', 'distinct', 'valid', 'missing'];
    /**
     * Aggregation operators that always produce values within the range [domainMin, domainMax].
     */
    const SHARED_DOMAIN_OPS = ['mean', 'average', 'median', 'q1', 'q3', 'min', 'max'];
    const SHARED_DOMAIN_OP_INDEX = toSet(SHARED_DOMAIN_OPS);

    /**
     * Create a key for the bin configuration. Not for prebinned bin.
     */
    function binToString(bin) {
        if (isBoolean(bin)) {
            bin = normalizeBin(bin, undefined);
        }
        return ('bin' +
            keys(bin)
                .map(p => varName(`_${p}_${bin[p]}`))
                .join(''));
    }
    /**
     * Vega-Lite should bin the data.
     */
    function isBinning(bin) {
        return bin === true || (isBinParams(bin) && !bin.binned);
    }
    /**
     * The data is already binned and so Vega-Lite should not bin it again.
     */
    function isBinned(bin) {
        return bin === 'binned' || (isBinParams(bin) && bin.binned);
    }
    function isBinParams(bin) {
        return isObject(bin);
    }
    function autoMaxBins(channel) {
        switch (channel) {
            case ROW:
            case COLUMN:
            case SIZE:
            case COLOR:
            case FILL:
            case STROKE:
            case STROKEWIDTH:
            case OPACITY:
            case FILLOPACITY:
            case STROKEOPACITY:
            // Facets and Size shouldn't have too many bins
            // We choose 6 like shape to simplify the rule [falls through]
            case SHAPE:
                return 6; // Vega's "shape" has 6 distinct values
            default:
                return 10;
        }
    }

    function isFacetFieldDef(channelDef) {
        return !!channelDef && !!channelDef['header'];
    }

    function isConditionalSelection(c) {
        return c['selection'];
    }
    function isRepeatRef(field) {
        return field && !isString(field) && 'repeat' in field;
    }
    function toFieldDefBase(fieldDef) {
        const { field, timeUnit, bin, aggregate } = fieldDef;
        return Object.assign({}, (timeUnit ? { timeUnit } : {}), (bin ? { bin } : {}), (aggregate ? { aggregate } : {}), { field });
    }
    function isSortableFieldDef(fieldDef) {
        return isTypedFieldDef(fieldDef) && !!fieldDef['sort'];
    }
    function isConditionalDef(channelDef) {
        return !!channelDef && !!channelDef.condition;
    }
    /**
     * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
     */
    function hasConditionalFieldDef(channelDef) {
        return !!channelDef && !!channelDef.condition && !isArray(channelDef.condition) && isFieldDef(channelDef.condition);
    }
    function hasConditionalValueDef(channelDef) {
        return !!channelDef && !!channelDef.condition && (isArray(channelDef.condition) || isValueDef(channelDef.condition));
    }
    function isFieldDef(channelDef) {
        return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
    }
    function isTypedFieldDef(channelDef) {
        return !!channelDef && ((!!channelDef['field'] && !!channelDef['type']) || channelDef['aggregate'] === 'count');
    }
    function isStringFieldDef(channelDef) {
        return isFieldDef(channelDef) && isString(channelDef.field);
    }
    function isValueDef(channelDef) {
        return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
    }
    function isScaleFieldDef(channelDef) {
        return !!channelDef && (!!channelDef['scale'] || !!channelDef['sort']);
    }
    function isPositionFieldDef(channelDef) {
        return !!channelDef && (!!channelDef['axis'] || !!channelDef['stack'] || !!channelDef['impute']);
    }
    function isMarkPropFieldDef(channelDef) {
        return !!channelDef && !!channelDef['legend'];
    }
    function isTextFieldDef(channelDef) {
        return !!channelDef && !!channelDef['format'];
    }
    function isOpFieldDef(fieldDef) {
        return !!fieldDef['op'];
    }
    /**
     * Get a Vega field reference from a Vega-Lite field def.
     */
    function vgField(fieldDef, opt = {}) {
        let field = fieldDef.field;
        const prefix = opt.prefix;
        let suffix = opt.suffix;
        let argAccessor = ''; // for accessing argmin/argmax field at the end without getting escaped
        if (isCount(fieldDef)) {
            field = internalField('count');
        }
        else {
            let fn;
            if (!opt.nofn) {
                if (isOpFieldDef(fieldDef)) {
                    fn = fieldDef.op;
                }
                else {
                    const { bin, aggregate, timeUnit } = fieldDef;
                    if (isBinning(bin)) {
                        fn = binToString(bin);
                        suffix = (opt.binSuffix || '') + (opt.suffix || '');
                    }
                    else if (aggregate) {
                        if (isArgmaxDef(aggregate)) {
                            argAccessor = `.${field}`;
                            field = `argmax_${aggregate.argmax}`;
                        }
                        else if (isArgminDef(aggregate)) {
                            argAccessor = `.${field}`;
                            field = `argmin_${aggregate.argmin}`;
                        }
                        else {
                            fn = String(aggregate);
                        }
                    }
                    else if (timeUnit) {
                        fn = String(timeUnit);
                    }
                }
            }
            if (fn) {
                field = field ? `${fn}_${field}` : fn;
            }
        }
        if (suffix) {
            field = `${field}_${suffix}`;
        }
        if (prefix) {
            field = `${prefix}_${field}`;
        }
        if (opt.forAs) {
            return field;
        }
        else if (opt.expr) {
            // Expression to access flattened field. No need to escape dots.
            return flatAccessWithDatum(field, opt.expr) + argAccessor;
        }
        else {
            // We flattened all fields so paths should have become dot.
            return replacePathInField(field) + argAccessor;
        }
    }
    function isDiscrete(fieldDef) {
        switch (fieldDef.type) {
            case 'nominal':
            case 'ordinal':
            case 'geojson':
                return true;
            case 'quantitative':
                return !!fieldDef.bin;
            case 'temporal':
                return false;
        }
        throw new Error(message.invalidFieldType(fieldDef.type));
    }
    function isContinuous(fieldDef) {
        return !isDiscrete(fieldDef);
    }
    function isCount(fieldDef) {
        return fieldDef.aggregate === 'count';
    }
    function verbalTitleFormatter(fieldDef, config) {
        const { field, bin, timeUnit, aggregate } = fieldDef;
        if (aggregate === 'count') {
            return config.countTitle;
        }
        else if (isBinning(bin)) {
            return `${field} (binned)`;
        }
        else if (timeUnit) {
            const units = getTimeUnitParts(timeUnit).join('-');
            return `${field} (${units})`;
        }
        else if (aggregate) {
            if (isArgmaxDef(aggregate)) {
                return `${field} for max ${aggregate.argmax}`;
            }
            else if (isArgminDef(aggregate)) {
                return `${field} for min ${aggregate.argmin}`;
            }
            else {
                return `${titlecase(aggregate)} of ${field}`;
            }
        }
        return field;
    }
    function functionalTitleFormatter(fieldDef) {
        const { aggregate, bin, timeUnit, field } = fieldDef;
        if (isArgmaxDef(aggregate)) {
            return `${field} for argmax(${aggregate.argmax})`;
        }
        else if (isArgminDef(aggregate)) {
            return `${field} for argmin(${aggregate.argmin})`;
        }
        const fn = aggregate || timeUnit || (isBinning(bin) && 'bin');
        if (fn) {
            return fn.toUpperCase() + '(' + field + ')';
        }
        else {
            return field;
        }
    }
    const defaultTitleFormatter = (fieldDef, config) => {
        switch (config.fieldTitle) {
            case 'plain':
                return fieldDef.field;
            case 'functional':
                return functionalTitleFormatter(fieldDef);
            default:
                return verbalTitleFormatter(fieldDef, config);
        }
    };
    let titleFormatter = defaultTitleFormatter;
    function setTitleFormatter(formatter) {
        titleFormatter = formatter;
    }
    function resetTitleFormatter() {
        setTitleFormatter(defaultTitleFormatter);
    }
    function title(fieldDef, config, { allowDisabling, includeDefault = true }) {
        const guide = getGuide(fieldDef) || {};
        const guideTitle = guide.title;
        const def = includeDefault ? defaultTitle(fieldDef, config) : undefined;
        if (allowDisabling) {
            return getFirstDefined(guideTitle, fieldDef.title, def);
        }
        else {
            return guideTitle || fieldDef.title || def;
        }
    }
    function getGuide(fieldDef) {
        if (isPositionFieldDef(fieldDef) && fieldDef.axis) {
            return fieldDef.axis;
        }
        else if (isMarkPropFieldDef(fieldDef) && fieldDef.legend) {
            return fieldDef.legend;
        }
        else if (isFacetFieldDef(fieldDef) && fieldDef.header) {
            return fieldDef.header;
        }
        return undefined;
    }
    function defaultTitle(fieldDef, config) {
        return titleFormatter(fieldDef, config);
    }
    function format(fieldDef) {
        if (isTextFieldDef(fieldDef) && fieldDef.format) {
            return fieldDef.format;
        }
        else {
            const guide = getGuide(fieldDef) || {};
            return guide.format;
        }
    }
    function defaultType(fieldDef, channel) {
        if (fieldDef.timeUnit) {
            return 'temporal';
        }
        if (isBinning(fieldDef.bin)) {
            return 'quantitative';
        }
        switch (rangeType(channel)) {
            case 'continuous':
                return 'quantitative';
            case 'discrete':
                return 'nominal';
            case 'flexible': // color
                return 'nominal';
            default:
                return 'quantitative';
        }
    }
    /**
     * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
     * @param channelDef
     */
    function getFieldDef(channelDef) {
        if (isFieldDef(channelDef)) {
            return channelDef;
        }
        else if (hasConditionalFieldDef(channelDef)) {
            return channelDef.condition;
        }
        return undefined;
    }
    function getTypedFieldDef(channelDef) {
        if (isFieldDef(channelDef)) {
            return channelDef;
        }
        else if (hasConditionalFieldDef(channelDef)) {
            return channelDef.condition;
        }
        return undefined;
    }
    /**
     * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
     */
    function normalize(channelDef, channel) {
        if (isString(channelDef) || isNumber(channelDef) || isBoolean(channelDef)) {
            const primitiveType = isString(channelDef) ? 'string' : isNumber(channelDef) ? 'number' : 'boolean';
            warn(message.primitiveChannelDef(channel, primitiveType, channelDef));
            return { value: channelDef };
        }
        // If a fieldDef contains a field, we need type.
        if (isFieldDef(channelDef)) {
            return normalizeFieldDef(channelDef, channel);
        }
        else if (hasConditionalFieldDef(channelDef)) {
            return Object.assign({}, channelDef, { 
                // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
                condition: normalizeFieldDef(channelDef.condition, channel) });
        }
        return channelDef;
    }
    function normalizeFieldDef(fieldDef, channel) {
        const { aggregate, timeUnit, bin } = fieldDef;
        // Drop invalid aggregate
        if (aggregate && !isAggregateOp(aggregate) && !isArgmaxDef(aggregate) && !isArgminDef(aggregate)) {
            const fieldDefWithoutAggregate = __rest(fieldDef, ["aggregate"]);
            warn(message.invalidAggregate(aggregate));
            fieldDef = fieldDefWithoutAggregate;
        }
        // Normalize Time Unit
        if (timeUnit) {
            fieldDef = Object.assign({}, fieldDef, { timeUnit: normalizeTimeUnit(timeUnit) });
        }
        // Normalize bin
        if (isBinning(bin)) {
            fieldDef = Object.assign({}, fieldDef, { bin: normalizeBin(bin, channel) });
        }
        if (isBinned(bin) && !contains(POSITION_SCALE_CHANNELS, channel)) {
            warn(`Channel ${channel} should not be used with "binned" bin`);
        }
        // Normalize Type
        if (isTypedFieldDef(fieldDef)) {
            const { type } = fieldDef;
            const fullType = getFullName(type);
            if (type !== fullType) {
                // convert short type to full type
                fieldDef = Object.assign({}, fieldDef, { type: fullType });
            }
            if (type !== 'quantitative') {
                if (isCountingAggregateOp(aggregate)) {
                    warn(message.invalidFieldTypeForCountAggregate(type, aggregate));
                    fieldDef = Object.assign({}, fieldDef, { type: 'quantitative' });
                }
            }
        }
        else if (!isSecondaryRangeChannel(channel)) {
            // If type is empty / invalid, then augment with default type
            const newType = defaultType(fieldDef, channel);
            warn(message.missingFieldType(channel, newType));
            fieldDef = Object.assign({}, fieldDef, { type: newType });
        }
        if (isTypedFieldDef(fieldDef)) {
            const { compatible, warning } = channelCompatibility(fieldDef, channel);
            if (!compatible) {
                warn(warning);
            }
        }
        return fieldDef;
    }
    function normalizeBin(bin, channel) {
        if (isBoolean(bin)) {
            return { maxbins: autoMaxBins(channel) };
        }
        else if (bin === 'binned') {
            return {
                binned: true
            };
        }
        else if (!bin.maxbins && !bin.step) {
            return Object.assign({}, bin, { maxbins: autoMaxBins(channel) });
        }
        else {
            return bin;
        }
    }
    const COMPATIBLE = { compatible: true };
    function channelCompatibility(fieldDef, channel) {
        const type = fieldDef.type;
        if (type === 'geojson' && channel !== 'shape') {
            return {
                compatible: false,
                warning: `Channel ${channel} should not be used with a geojson data.`
            };
        }
        switch (channel) {
            case 'row':
            case 'column':
            case 'facet':
                if (isContinuous(fieldDef)) {
                    return {
                        compatible: false,
                        warning: message.facetChannelShouldBeDiscrete(channel)
                    };
                }
                return COMPATIBLE;
            case 'x':
            case 'y':
            case 'color':
            case 'fill':
            case 'stroke':
            case 'text':
            case 'detail':
            case 'key':
            case 'tooltip':
            case 'href':
                return COMPATIBLE;
            case 'longitude':
            case 'longitude2':
            case 'latitude':
            case 'latitude2':
                if (type !== QUANTITATIVE) {
                    return {
                        compatible: false,
                        warning: `Channel ${channel} should be used with a quantitative field only, not ${fieldDef.type} field.`
                    };
                }
                return COMPATIBLE;
            case 'opacity':
            case 'fillOpacity':
            case 'strokeOpacity':
            case 'strokeWidth':
            case 'size':
            case 'x2':
            case 'y2':
                if (type === 'nominal' && !fieldDef['sort']) {
                    return {
                        compatible: false,
                        warning: `Channel ${channel} should not be used with an unsorted discrete field.`
                    };
                }
                return COMPATIBLE;
            case 'shape':
                if (!contains(['ordinal', 'nominal', 'geojson'], fieldDef.type)) {
                    return {
                        compatible: false,
                        warning: 'Shape channel should be used with only either discrete or geojson data.'
                    };
                }
                return COMPATIBLE;
            case 'order':
                if (fieldDef.type === 'nominal' && !('sort' in fieldDef)) {
                    return {
                        compatible: false,
                        warning: `Channel order is inappropriate for nominal field, which has no inherent order.`
                    };
                }
                return COMPATIBLE;
        }
        throw new Error('channelCompatability not implemented for channel ' + channel);
    }
    function isNumberFieldDef(fieldDef) {
        return fieldDef.type === 'quantitative' || isBinning(fieldDef.bin);
    }
    /**
     * Check if the field def uses a time format or does not use any format but is temporal (this does not cover field defs that are temporal but use a number format).
     */
    function isTimeFormatFieldDef(fieldDef) {
        const formatType = (isPositionFieldDef(fieldDef) && fieldDef.axis && fieldDef.axis.formatType) ||
            (isMarkPropFieldDef(fieldDef) && fieldDef.legend && fieldDef.legend.formatType) ||
            (isTextFieldDef(fieldDef) && fieldDef.formatType);
        return formatType === 'time' || (!formatType && isTimeFieldDef(fieldDef));
    }
    /**
     * Check if field def has tye `temporal`. If you want to also cover field defs that use a time format, use `isTimeFormatFieldDef`.
     */
    function isTimeFieldDef(fieldDef) {
        return fieldDef.type === 'temporal' || !!fieldDef.timeUnit;
    }
    /**
     * Getting a value associated with a fielddef.
     * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
     */
    function valueExpr(v, { timeUnit, type, time, undefinedIfExprNotRequired }) {
        let expr;
        if (isDateTime(v)) {
            expr = dateTimeExpr(v, true);
        }
        else if (isString(v) || isNumber(v)) {
            if (timeUnit || type === 'temporal') {
                if (isLocalSingleTimeUnit(timeUnit)) {
                    expr = dateTimeExpr({ [timeUnit]: v }, true);
                }
                else if (isUtcSingleTimeUnit(timeUnit)) {
                    // FIXME is this really correct?
                    expr = valueExpr(v, { timeUnit: getLocalTimeUnit(timeUnit) });
                }
                else {
                    // just pass the string to date function (which will call JS Date.parse())
                    expr = `datetime(${JSON.stringify(v)})`;
                }
            }
        }
        if (expr) {
            return time ? `time(${expr})` : expr;
        }
        // number or boolean or normal string
        return undefinedIfExprNotRequired ? undefined : JSON.stringify(v);
    }
    /**
     * Standardize value array -- convert each value to Vega expression if applicable
     */
    function valueArray(fieldDef, values) {
        const { timeUnit, type } = fieldDef;
        return values.map(v => {
            const expr = valueExpr(v, { timeUnit, type, undefinedIfExprNotRequired: true });
            // return signal for the expression if we need an expression
            if (expr !== undefined) {
                return { signal: expr };
            }
            // otherwise just return the original value
            return v;
        });
    }
    /**
     * Checks whether a fieldDef for a particular channel requires a computed bin range.
     */
    function binRequiresRange(fieldDef, channel) {
        if (!isBinning(fieldDef.bin)) {
            console.warn('Only use this method with binned field defs');
            return false;
        }
        // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
        // We could check whether the axis or legend exists (not disabled) but that seems overkill.
        return isScaleChannel(channel) && contains(['ordinal', 'nominal'], fieldDef.type);
    }

    var vlChannelDef = /*#__PURE__*/Object.freeze({
        isConditionalSelection: isConditionalSelection,
        isRepeatRef: isRepeatRef,
        toFieldDefBase: toFieldDefBase,
        isSortableFieldDef: isSortableFieldDef,
        isConditionalDef: isConditionalDef,
        hasConditionalFieldDef: hasConditionalFieldDef,
        hasConditionalValueDef: hasConditionalValueDef,
        isFieldDef: isFieldDef,
        isTypedFieldDef: isTypedFieldDef,
        isStringFieldDef: isStringFieldDef,
        isValueDef: isValueDef,
        isScaleFieldDef: isScaleFieldDef,
        isPositionFieldDef: isPositionFieldDef,
        isMarkPropFieldDef: isMarkPropFieldDef,
        isTextFieldDef: isTextFieldDef,
        vgField: vgField,
        isDiscrete: isDiscrete,
        isContinuous: isContinuous,
        isCount: isCount,
        verbalTitleFormatter: verbalTitleFormatter,
        functionalTitleFormatter: functionalTitleFormatter,
        defaultTitleFormatter: defaultTitleFormatter,
        setTitleFormatter: setTitleFormatter,
        resetTitleFormatter: resetTitleFormatter,
        title: title,
        getGuide: getGuide,
        defaultTitle: defaultTitle,
        format: format,
        defaultType: defaultType,
        getFieldDef: getFieldDef,
        getTypedFieldDef: getTypedFieldDef,
        normalize: normalize,
        normalizeFieldDef: normalizeFieldDef,
        normalizeBin: normalizeBin,
        channelCompatibility: channelCompatibility,
        isNumberFieldDef: isNumberFieldDef,
        isTimeFormatFieldDef: isTimeFormatFieldDef,
        isTimeFieldDef: isTimeFieldDef,
        valueExpr: valueExpr,
        valueArray: valueArray,
        binRequiresRange: binRequiresRange
    });

    /**
     * Determine if there is a specified scale type and if it is appropriate,
     * or determine default type if type is unspecified or inappropriate.
     */
    // NOTE: CompassQL uses this method.
    function scaleType(specifiedScale, channel, fieldDef, mark) {
        const defaultScaleType = defaultType$1(channel, fieldDef, mark);
        const { type } = specifiedScale;
        if (!isScaleChannel(channel)) {
            // There is no scale for these channels
            return null;
        }
        if (type !== undefined) {
            // Check if explicitly specified scale type is supported by the channel
            if (!channelSupportScaleType(channel, type)) {
                warn(message.scaleTypeNotWorkWithChannel(channel, type, defaultScaleType));
                return defaultScaleType;
            }
            // Check if explicitly specified scale type is supported by the data type
            if (!scaleTypeSupportDataType(type, fieldDef.type)) {
                warn(message.scaleTypeNotWorkWithFieldDef(type, defaultScaleType));
                return defaultScaleType;
            }
            return type;
        }
        return defaultScaleType;
    }
    /**
     * Determine appropriate default scale type.
     */
    // NOTE: Voyager uses this method.
    function defaultType$1(channel, fieldDef, mark) {
        switch (fieldDef.type) {
            case 'nominal':
            case 'ordinal':
                if (isColorChannel(channel) || rangeType(channel) === 'discrete') {
                    if (channel === 'shape' && fieldDef.type === 'ordinal') {
                        warn(message.discreteChannelCannotEncode(channel, 'ordinal'));
                    }
                    return 'ordinal';
                }
                if (contains(['x', 'y'], channel)) {
                    if (contains(['rect', 'bar', 'rule'], mark)) {
                        // The rect/bar mark should fit into a band.
                        // For rule, using band scale to make rule align with axis ticks better https://github.com/vega/vega-lite/issues/3429
                        return 'band';
                    }
                    if (mark === 'bar') {
                        return 'band';
                    }
                }
                // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
                return 'point';
            case 'temporal':
                if (isColorChannel(channel)) {
                    return 'time';
                }
                else if (rangeType(channel) === 'discrete') {
                    warn(message.discreteChannelCannotEncode(channel, 'temporal'));
                    // TODO: consider using quantize (equivalent to binning) once we have it
                    return 'ordinal';
                }
                return 'time';
            case 'quantitative':
                if (isColorChannel(channel)) {
                    if (isBinning(fieldDef.bin)) {
                        return 'bin-ordinal';
                    }
                    return 'linear';
                }
                else if (rangeType(channel) === 'discrete') {
                    warn(message.discreteChannelCannotEncode(channel, 'quantitative'));
                    // TODO: consider using quantize (equivalent to binning) once we have it
                    return 'ordinal';
                }
                return 'linear';
            case 'geojson':
                return undefined;
        }
        /* istanbul ignore next: should never reach this */
        throw new Error(message.invalidFieldType(fieldDef.type));
    }

    var ExpandedType;
    (function (ExpandedType) {
        ExpandedType.QUANTITATIVE = QUANTITATIVE;
        ExpandedType.ORDINAL = ORDINAL;
        ExpandedType.TEMPORAL = TEMPORAL;
        ExpandedType.NOMINAL = NOMINAL;
        ExpandedType.KEY = 'key';
    })(ExpandedType || (ExpandedType = {}));
    function isDiscrete$1(fieldType) {
        return fieldType === ORDINAL || fieldType === NOMINAL || fieldType === ExpandedType.KEY;
    }

    /**
     * Dictionary that takes property as a key.
     */
    class PropIndex {
        constructor(i = null) {
            this.index = i ? Object.assign({}, i) : {};
        }
        has(p) {
            return toKey(p) in this.index;
        }
        get(p) {
            return this.index[toKey(p)];
        }
        set(p, value) {
            this.index[toKey(p)] = value;
            return this;
        }
        setByKey(key, value) {
            this.index[key] = value;
        }
        map(f) {
            const i = new PropIndex();
            for (const k in this.index) {
                i.index[k] = f(this.index[k]);
            }
            return i;
        }
        size() {
            return util_3(this.index).length;
        }
        duplicate() {
            return new PropIndex(this.index);
        }
    }

    function channelHasField(encoding, channel) {
        const channelDef = encoding && encoding[channel];
        if (channelDef) {
            if (isArray(channelDef)) {
                return some(channelDef, fieldDef => !!fieldDef.field);
            }
            else {
                return isFieldDef(channelDef) || hasConditionalFieldDef(channelDef);
            }
        }
        return false;
    }

    const STACK_OFFSET_INDEX = {
        zero: 1,
        center: 1,
        normalize: 1
    };
    function isStackOffset(s) {
        return !!STACK_OFFSET_INDEX[s];
    }
    const STACKABLE_MARKS = [BAR, AREA, RULE, POINT, CIRCLE, SQUARE, LINE, TEXT$1, TICK];
    const STACK_BY_DEFAULT_MARKS = [BAR, AREA];
    function potentialStackedChannel(encoding) {
        const xDef = encoding.x;
        const yDef = encoding.y;
        if (isFieldDef(xDef) && isFieldDef(yDef)) {
            if (xDef.type === 'quantitative' && yDef.type === 'quantitative') {
                if (xDef.stack) {
                    return 'x';
                }
                else if (yDef.stack) {
                    return 'y';
                }
                // if there is no explicit stacking, only apply stack if there is only one aggregate for x or y
                if (!!xDef.aggregate !== !!yDef.aggregate) {
                    return xDef.aggregate ? 'x' : 'y';
                }
            }
            else if (xDef.type === 'quantitative') {
                return 'x';
            }
            else if (yDef.type === 'quantitative') {
                return 'y';
            }
        }
        else if (isFieldDef(xDef) && xDef.type === 'quantitative') {
            return 'x';
        }
        else if (isFieldDef(yDef) && yDef.type === 'quantitative') {
            return 'y';
        }
        return undefined;
    }
    // Note: CompassQL uses this method and only pass in required properties of each argument object.
    // If required properties change, make sure to update CompassQL.
    function stack(m, encoding, stackConfig, opt = {}) {
        const mark = isMarkDef(m) ? m.type : m;
        // Should have stackable mark
        if (!contains(STACKABLE_MARKS, mark)) {
            return null;
        }
        const fieldChannel = potentialStackedChannel(encoding);
        if (!fieldChannel) {
            return null;
        }
        const stackedFieldDef = encoding[fieldChannel];
        const stackedField = isStringFieldDef(stackedFieldDef) ? vgField(stackedFieldDef, {}) : undefined;
        const dimensionChannel = fieldChannel === 'x' ? 'y' : 'x';
        const dimensionDef = encoding[dimensionChannel];
        const dimensionField = isStringFieldDef(dimensionDef) ? vgField(dimensionDef, {}) : undefined;
        // Should have grouping level of detail that is different from the dimension field
        const stackBy = NONPOSITION_CHANNELS.reduce((sc, channel) => {
            // Ignore tooltip in stackBy (https://github.com/vega/vega-lite/issues/4001)
            if (channel !== 'tooltip' && channelHasField(encoding, channel)) {
                const channelDef = encoding[channel];
                (isArray(channelDef) ? channelDef : [channelDef]).forEach(cDef => {
                    const fieldDef = getTypedFieldDef(cDef);
                    if (fieldDef.aggregate) {
                        return;
                    }
                    // Check whether the channel's field is identical to x/y's field or if the channel is a repeat
                    const f = isStringFieldDef(fieldDef) ? vgField(fieldDef, {}) : undefined;
                    if (
                    // if fielddef is a repeat, just include it in the stack by
                    !f ||
                        // otherwise, the field must be different from x and y fields.
                        (f !== dimensionField && f !== stackedField)) {
                        sc.push({ channel, fieldDef });
                    }
                });
            }
            return sc;
        }, []);
        if (stackBy.length === 0) {
            return null;
        }
        // Automatically determine offset
        let offset;
        if (stackedFieldDef.stack !== undefined) {
            if (isBoolean(stackedFieldDef.stack)) {
                offset = stackedFieldDef.stack ? 'zero' : null;
            }
            else {
                offset = stackedFieldDef.stack;
            }
        }
        else if (contains(STACK_BY_DEFAULT_MARKS, mark)) {
            // Bar and Area with sum ops are automatically stacked by default
            offset = getFirstDefined(stackConfig, 'zero');
        }
        else {
            offset = stackConfig;
        }
        if (!offset || !isStackOffset(offset)) {
            return null;
        }
        // warn when stacking non-linear
        if (stackedFieldDef.scale && stackedFieldDef.scale.type && stackedFieldDef.scale.type !== ScaleType.LINEAR) {
            if (opt.disallowNonLinearStack) {
                return null;
            }
            else {
                warn(message.cannotStackNonLinearScale(stackedFieldDef.scale.type));
            }
        }
        // Check if it is a ranged mark
        if (channelHasField(encoding, fieldChannel === X ? X2 : Y2)) {
            if (stackedFieldDef.stack !== undefined) {
                warn(message.cannotStackRangedMark(fieldChannel));
            }
            return null;
        }
        // Warn if stacking summative aggregate
        if (stackedFieldDef.aggregate && !contains(SUM_OPS, stackedFieldDef.aggregate)) {
            warn(message.stackNonSummativeAggregate(stackedFieldDef.aggregate));
        }
        return {
            groupbyChannel: dimensionDef ? dimensionChannel : undefined,
            fieldChannel,
            impute: isPathMark(mark),
            stackBy,
            offset
        };
    }

    /**
     * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
     * @param {ExtendedUnitSpec} spec
     * @returns
     */
    function fromSpec(spec) {
        return util_5(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, spec.width ? { width: spec.width } : {}, spec.height ? { height: spec.height } : {}, spec.background ? { background: spec.background } : {}, spec.padding ? { padding: spec.padding } : {}, spec.title ? { title: spec.title } : {}, {
            mark: spec.mark,
            encodings: util_3(spec.encoding).map((channel) => {
                let encQ = { channel: channel };
                let channelDef = spec.encoding[channel];
                for (const prop in channelDef) {
                    if (isEncodingTopLevelProperty(prop) && channelDef[prop] !== undefined) {
                        // Currently bin, scale, axis, legend only support boolean, but not null.
                        // Therefore convert null to false.
                        if (contains$1(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
                            encQ[prop] = false;
                        }
                        else {
                            encQ[prop] = channelDef[prop];
                        }
                    }
                }
                if (isFieldQuery(encQ) && encQ.aggregate === 'count' && !encQ.field) {
                    encQ.field = '*';
                }
                return encQ;
            })
        }, spec.config ? { config: spec.config } : {});
    }
    function isAggregate(specQ) {
        return some$1(specQ.encodings, (encQ) => {
            return (isFieldQuery(encQ) && !isWildcard(encQ.aggregate) && !!encQ.aggregate) || isEnabledAutoCountQuery(encQ);
        });
    }
    /**
     * @return The Vega-Lite `StackProperties` object that describes the stack
     * configuration of `specQ`. Returns `null` if this is not stackable.
     */
    function getVlStack(specQ) {
        if (!hasRequiredStackProperties(specQ)) {
            return null;
        }
        const encoding = toEncoding(specQ.encodings, { schema: null, wildcardMode: 'null' });
        const mark = specQ.mark;
        return stack(mark, encoding, undefined, { disallowNonLinearStack: true });
    }
    /**
     * @return The `StackOffset` specified in `specQ`, `undefined` if none
     * is specified.
     */
    function getStackOffset(specQ) {
        for (const encQ of specQ.encodings) {
            if (encQ[Property.STACK] !== undefined && !isWildcard(encQ[Property.STACK])) {
                return encQ[Property.STACK];
            }
        }
        return undefined;
    }
    /**
     * @return The `Channel` in which `stack` is specified in `specQ`, or
     * `null` if none is specified.
     */
    function getStackChannel(specQ) {
        for (const encQ of specQ.encodings) {
            if (encQ[Property.STACK] !== undefined && !isWildcard(encQ.channel)) {
                return encQ.channel;
            }
        }
        return null;
    }
    /**
     * Returns true iff the given SpecQuery has the properties defined
     * to be a potential Stack spec.
     * @param specQ The SpecQuery in question.
     */
    function hasRequiredStackProperties(specQ) {
        // TODO(haldenl): make this leaner, a lot of encQ properties aren't required for stack.
        // TODO(haldenl): check mark, then encodings
        if (isWildcard(specQ.mark)) {
            return false;
        }
        const requiredEncodingProps = [
            Property.STACK,
            Property.CHANNEL,
            Property.MARK,
            Property.FIELD,
            Property.AGGREGATE,
            Property.AUTOCOUNT,
            Property.SCALE,
            getEncodingNestedProp('scale', 'type'),
            Property.TYPE
        ];
        const exclude = util_8(without(ALL_ENCODING_PROPS, requiredEncodingProps));
        const encodings = specQ.encodings.filter(encQ => !isDisabledAutoCountQuery(encQ));
        for (const encQ of encodings) {
            if (objectContainsWildcard(encQ, { exclude: exclude })) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns true iff the given object does not contain a nested wildcard.
     * @param obj The object in question.
     * @param opt With optional `exclude` property, which defines properties to
     * ignore when testing for wildcards.
     */
    // TODO(haldenl): rename to objectHasWildcard, rename prop to obj
    function objectContainsWildcard(obj, opt = {}) {
        if (!util_6(obj)) {
            return false;
        }
        for (const childProp in obj) {
            if (obj.hasOwnProperty(childProp)) {
                const wildcard = isWildcard(obj[childProp]);
                if ((wildcard && (!opt.exclude || !opt.exclude[childProp])) || objectContainsWildcard(obj[childProp], opt)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Returns true iff the given `specQ` contains a wildcard.
     * @param specQ The `SpecQuery` in question.
     * @param opt With optional `exclude` property, which defines properties to
     * ignore when testing for wildcards.
     */
    function hasWildcard(specQ, opt = {}) {
        const exclude = opt.exclude ? util_8(opt.exclude.map(toKey)) : {};
        if (isWildcard(specQ.mark) && !exclude['mark']) {
            return true;
        }
        for (const encQ of specQ.encodings) {
            if (objectContainsWildcard(encQ, exclude)) {
                return true;
            }
        }
        return false;
    }

    var spec = /*#__PURE__*/Object.freeze({
        fromSpec: fromSpec,
        isAggregate: isAggregate,
        getVlStack: getVlStack,
        getStackOffset: getStackOffset,
        getStackChannel: getStackChannel,
        hasRequiredStackProperties: hasRequiredStackProperties,
        hasWildcard: hasWildcard
    });

    function getReplacerIndex(replaceIndex) {
        return replaceIndex.map(r => getReplacer(r));
    }
    function getReplacer(replace) {
        return (s) => {
            if (replace[s] !== undefined) {
                return replace[s];
            }
            return s;
        };
    }
    function value$1(v, replacer) {
        if (isWildcard(v)) {
            // Return the enum array if it's a full wildcard, or just return SHORT_WILDCARD for short ones.
            if (!isShortWildcard(v) && v.enum) {
                return SHORT_WILDCARD + JSON.stringify(v.enum);
            }
            else {
                return SHORT_WILDCARD;
            }
        }
        if (replacer) {
            return replacer(v);
        }
        return v;
    }
    function replace(v, replacer) {
        if (replacer) {
            return replacer(v);
        }
        return v;
    }
    const REPLACE_NONE = new PropIndex();
    const INCLUDE_ALL = 
    // FIXME: remove manual TRANSFORM concat once we really support enumerating transform.
    []
        .concat(DEFAULT_PROP_PRECEDENCE, SORT_PROPS, [Property.TRANSFORM, Property.STACK], VIEW_PROPS)
        .reduce((pi, prop) => pi.set(prop, true), new PropIndex());
    function vlSpec(vlspec, include = INCLUDE_ALL, replace = REPLACE_NONE) {
        const specQ = fromSpec(vlspec);
        return spec$1(specQ, include, replace);
    }
    const PROPERTY_SUPPORTED_CHANNELS = {
        axis: { x: true, y: true, row: true, column: true },
        legend: { color: true, opacity: true, size: true, shape: true },
        scale: { x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true },
        sort: { x: true, y: true, path: true, order: true },
        stack: { x: true, y: true }
    };
    /**
     * Returns a shorthand for a spec query
     * @param specQ a spec query
     * @param include Dict Set listing property types (key) to be included in the shorthand
     * @param replace Dictionary of replace function for values of a particular property type (key)
     */
    function spec$1(specQ, include = INCLUDE_ALL, replace = REPLACE_NONE) {
        const parts = [];
        if (include.get(Property.MARK)) {
            parts.push(value$1(specQ.mark, replace.get(Property.MARK)));
        }
        if (specQ.transform && specQ.transform.length > 0) {
            parts.push('transform:' + JSON.stringify(specQ.transform));
        }
        let stack;
        if (include.get(Property.STACK)) {
            stack = getVlStack(specQ);
        }
        if (specQ.encodings) {
            const encodings = specQ.encodings
                .reduce((encQs, encQ) => {
                // Exclude encoding mapping with autoCount=false as they are basically disabled.
                if (!isDisabledAutoCountQuery(encQ)) {
                    let str;
                    if (!!stack && encQ.channel === stack.fieldChannel) {
                        str = encoding(Object.assign({}, encQ, { stack: stack.offset }), include, replace);
                    }
                    else {
                        str = encoding(encQ, include, replace);
                    }
                    if (str) {
                        // only add if the shorthand isn't an empty string.
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
        for (let viewProp of VIEW_PROPS) {
            const propString = viewProp.toString();
            if (include.get(viewProp) && !!specQ[propString]) {
                const value = specQ[propString];
                parts.push(`${propString}=${JSON.stringify(value)}`);
            }
        }
        return parts.join('|');
    }
    /**
     * Returns a shorthand for an encoding query
     * @param encQ an encoding query
     * @param include Dict Set listing property types (key) to be included in the shorthand
     * @param replace Dictionary of replace function for values of a particular property type (key)
     */
    function encoding(encQ, include = INCLUDE_ALL, replace = REPLACE_NONE) {
        const parts = [];
        if (include.get(Property.CHANNEL)) {
            parts.push(value$1(encQ.channel, replace.get(Property.CHANNEL)));
        }
        if (isFieldQuery(encQ)) {
            const fieldDefStr = fieldDef(encQ, include, replace);
            if (fieldDefStr) {
                parts.push(fieldDefStr);
            }
        }
        else if (isValueQuery(encQ)) {
            parts.push(encQ.value);
        }
        else if (isAutoCountQuery(encQ)) {
            parts.push('autocount()');
        }
        return parts.join(':');
    }
    /**
     * Returns a field definition shorthand for an encoding query
     * @param encQ an encoding query
     * @param include Dict Set listing property types (key) to be included in the shorthand
     * @param replace Dictionary of replace function for values of a particular property type (key)
     */
    function fieldDef(encQ, include = INCLUDE_ALL, replacer = REPLACE_NONE) {
        if (include.get(Property.AGGREGATE) && isDisabledAutoCountQuery(encQ)) {
            return '-';
        }
        const fn = func(encQ, include, replacer);
        const props = fieldDefProps(encQ, include, replacer);
        let fieldAndParams;
        if (isFieldQuery(encQ)) {
            // field
            fieldAndParams = include.get('field') ? value$1(encQ.field, replacer.get('field')) : '...';
            // type
            if (include.get(Property.TYPE)) {
                if (isWildcard(encQ.type)) {
                    fieldAndParams += ',' + value$1(encQ.type, replacer.get(Property.TYPE));
                }
                else {
                    const typeShort = ((encQ.type || QUANTITATIVE) + '').substr(0, 1);
                    fieldAndParams += ',' + value$1(typeShort, replacer.get(Property.TYPE));
                }
            }
            // encoding properties
            fieldAndParams += props
                .map(p => {
                let val = p.value instanceof Array ? '[' + p.value + ']' : p.value;
                return ',' + p.key + '=' + val;
            })
                .join('');
        }
        else if (isAutoCountQuery(encQ)) {
            fieldAndParams = '*,q';
        }
        if (!fieldAndParams) {
            return null;
        }
        if (fn) {
            let fnPrefix = util_9(fn) ? fn : SHORT_WILDCARD + (util_3(fn).length > 0 ? JSON.stringify(fn) : '');
            return fnPrefix + '(' + fieldAndParams + ')';
        }
        return fieldAndParams;
    }
    /**
     * Return function part of
     */
    function func(fieldQ, include, replacer) {
        if (include.get(Property.AGGREGATE) && fieldQ.aggregate && !isWildcard(fieldQ.aggregate)) {
            return replace(fieldQ.aggregate, replacer.get(Property.AGGREGATE));
        }
        else if (include.get(Property.AGGREGATE) && isEnabledAutoCountQuery(fieldQ)) {
            // autoCount is considered a part of aggregate
            return replace('count', replacer.get(Property.AGGREGATE));
        }
        else if (include.get(Property.TIMEUNIT) && fieldQ.timeUnit && !isWildcard(fieldQ.timeUnit)) {
            return replace(fieldQ.timeUnit, replacer.get(Property.TIMEUNIT));
        }
        else if (include.get(Property.BIN) && fieldQ.bin && !isWildcard(fieldQ.bin)) {
            return 'bin';
        }
        else {
            let fn = null;
            for (const prop of [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN]) {
                const val = fieldQ[prop];
                if (include.get(prop) && fieldQ[prop] && isWildcard(val)) {
                    // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_WILDCARD
                    fn = fn || {};
                    fn[prop] = isShortWildcard(val) ? val : val.enum;
                }
            }
            if (fn && fieldQ.hasFn) {
                fn.hasFn = true;
            }
            return fn;
        }
    }
    /**
     * Return key-value of parameters of field defs
     */
    function fieldDefProps(fieldQ, include, replacer) {
        /** Encoding properties e.g., Scale, Axis, Legend */
        const props = [];
        // Parameters of function such as bin will be just top-level properties
        if (!util_7(fieldQ.bin) && !isShortWildcard(fieldQ.bin)) {
            const bin = fieldQ.bin;
            for (const child in bin) {
                const prop = getEncodingNestedProp('bin', child);
                if (prop && include.get(prop) && bin[child] !== undefined) {
                    props.push({
                        key: child,
                        value: value$1(bin[child], replacer.get(prop))
                    });
                }
            }
            // Sort to make sure that parameter are ordered consistently
            props.sort((a, b) => a.key.localeCompare(b.key));
        }
        for (const parent of [Property.SCALE, Property.SORT, Property.STACK, Property.AXIS, Property.LEGEND]) {
            if (!isWildcard(fieldQ.channel) && !PROPERTY_SUPPORTED_CHANNELS[parent][fieldQ.channel]) {
                continue;
            }
            if (include.get(parent) && fieldQ[parent] !== undefined) {
                const parentValue = fieldQ[parent];
                if (util_7(parentValue) || parentValue === null) {
                    // `scale`, `axis`, `legend` can be false/null.
                    props.push({
                        key: parent + '',
                        value: parentValue || false // return true or false (false if null)
                    });
                }
                else if (util_9(parentValue)) {
                    // `sort` can be a string (ascending/descending).
                    props.push({
                        key: parent + '',
                        value: replace(JSON.stringify(parentValue), replacer.get(parent))
                    });
                }
                else {
                    let nestedPropChildren = [];
                    for (const child in parentValue) {
                        const nestedProp = getEncodingNestedProp(parent, child);
                        if (nestedProp && include.get(nestedProp) && parentValue[child] !== undefined) {
                            nestedPropChildren.push({
                                key: child,
                                value: value$1(parentValue[child], replacer.get(nestedProp))
                            });
                        }
                    }
                    if (nestedPropChildren.length > 0) {
                        const nestedPropObject = nestedPropChildren
                            .sort((a, b) => a.key.localeCompare(b.key))
                            .reduce((o, item) => {
                            o[item.key] = item.value;
                            return o;
                        }, {});
                        // Sort to make sure that parameter are ordered consistently
                        props.push({
                            key: parent + '',
                            value: JSON.stringify(nestedPropObject)
                        });
                    }
                }
            }
        }
        return props;
    }
    function parse(shorthand) {
        // TODO(https://github.com/uwdata/compassql/issues/259):
        // Do not split directly, but use an upgraded version of `getClosingBraceIndex()`
        let splitShorthand = shorthand.split('|');
        let specQ = {
            mark: splitShorthand[0],
            encodings: []
        };
        for (let i = 1; i < splitShorthand.length; i++) {
            let part = splitShorthand[i];
            const splitPart = splitWithTail(part, ':', 1);
            const splitPartKey = splitPart[0];
            const splitPartValue = splitPart[1];
            if (isChannel(splitPartKey) || splitPartKey === '?') {
                const encQ = shorthandParser.encoding(splitPartKey, splitPartValue);
                specQ.encodings.push(encQ);
                continue;
            }
            if (splitPartKey === 'transform') {
                specQ.transform = JSON.parse(splitPartValue);
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
    function splitWithTail(str, delim, count) {
        let result = [];
        let lastIndex = 0;
        for (let i = 0; i < count; i++) {
            let indexOfDelim = str.indexOf(delim, lastIndex);
            if (indexOfDelim !== -1) {
                result.push(str.substring(lastIndex, indexOfDelim));
                lastIndex = indexOfDelim + 1;
            }
            else {
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
    var shorthandParser;
    (function (shorthandParser) {
        function encoding(channel, fieldDefShorthand) {
            let encQMixins = fieldDefShorthand.indexOf('(') !== -1
                ? fn(fieldDefShorthand)
                : rawFieldDef(splitWithTail(fieldDefShorthand, ',', 2));
            return Object.assign({ channel }, encQMixins);
        }
        shorthandParser.encoding = encoding;
        function rawFieldDef(fieldDefPart) {
            const fieldQ = {};
            fieldQ.field = fieldDefPart[0];
            fieldQ.type = getFullName(fieldDefPart[1].toUpperCase()) || '?';
            let partParams = fieldDefPart[2];
            let closingBraceIndex = 0;
            let i = 0;
            while (i < partParams.length) {
                let propEqualSignIndex = partParams.indexOf('=', i);
                let parsedValue;
                if (propEqualSignIndex !== -1) {
                    let prop = partParams.substring(i, propEqualSignIndex);
                    if (partParams[i + prop.length + 1] === '{') {
                        let openingBraceIndex = i + prop.length + 1;
                        closingBraceIndex = getClosingIndex(openingBraceIndex, partParams, '}');
                        const value = partParams.substring(openingBraceIndex, closingBraceIndex + 1);
                        parsedValue = JSON.parse(value);
                        // index after next comma
                        i = closingBraceIndex + 2;
                    }
                    else if (partParams[i + prop.length + 1] === '[') {
                        // find closing square bracket
                        let openingBracketIndex = i + prop.length + 1;
                        let closingBracketIndex = getClosingIndex(openingBracketIndex, partParams, ']');
                        const value = partParams.substring(openingBracketIndex, closingBracketIndex + 1);
                        parsedValue = JSON.parse(value);
                        // index after next comma
                        i = closingBracketIndex + 2;
                    }
                    else {
                        let propIndex = i;
                        // Substring until the next comma (or end of the string)
                        let nextCommaIndex = partParams.indexOf(',', i + prop.length);
                        if (nextCommaIndex === -1) {
                            nextCommaIndex = partParams.length;
                        }
                        // index after next comma
                        i = nextCommaIndex + 1;
                        parsedValue = JSON.parse(partParams.substring(propIndex + prop.length + 1, nextCommaIndex));
                    }
                    if (isEncodingNestedParent(prop)) {
                        fieldQ[prop] = parsedValue;
                    }
                    else {
                        // prop is a property of the aggregation function such as bin
                        fieldQ.bin = fieldQ.bin || {};
                        fieldQ.bin[prop] = parsedValue;
                    }
                }
                else {
                    // something is wrong with the format of the partParams
                    // exits loop if don't have then infintie loop
                    break;
                }
            }
            return fieldQ;
        }
        shorthandParser.rawFieldDef = rawFieldDef;
        function getClosingIndex(openingBraceIndex, str, closingChar) {
            for (let i = openingBraceIndex; i < str.length; i++) {
                if (str[i] === closingChar) {
                    return i;
                }
            }
        }
        shorthandParser.getClosingIndex = getClosingIndex;
        function fn(fieldDefShorthand) {
            const fieldQ = {};
            // Aggregate, Bin, TimeUnit as wildcard case
            if (fieldDefShorthand[0] === '?') {
                let closingBraceIndex = getClosingIndex(1, fieldDefShorthand, '}');
                let fnEnumIndex = JSON.parse(fieldDefShorthand.substring(1, closingBraceIndex + 1));
                for (let encodingProperty in fnEnumIndex) {
                    if (util_1(fnEnumIndex[encodingProperty])) {
                        fieldQ[encodingProperty] = { enum: fnEnumIndex[encodingProperty] };
                    }
                    else {
                        // Definitely a `SHORT_WILDCARD`
                        fieldQ[encodingProperty] = fnEnumIndex[encodingProperty];
                    }
                }
                return Object.assign({}, fieldQ, rawFieldDef(splitWithTail(fieldDefShorthand.substring(closingBraceIndex + 2, fieldDefShorthand.length - 1), ',', 2)));
            }
            else {
                let func = fieldDefShorthand.substring(0, fieldDefShorthand.indexOf('('));
                let insideFn = fieldDefShorthand.substring(func.length + 1, fieldDefShorthand.length - 1);
                let insideFnParts = splitWithTail(insideFn, ',', 2);
                if (isAggregateOp(func)) {
                    return Object.assign({ aggregate: func }, rawFieldDef(insideFnParts));
                }
                else if (isTimeUnit(func)) {
                    return Object.assign({ timeUnit: func }, rawFieldDef(insideFnParts));
                }
                else if (func === 'bin') {
                    return Object.assign({ bin: {} }, rawFieldDef(insideFnParts));
                }
            }
        }
        shorthandParser.fn = fn;
    })(shorthandParser || (shorthandParser = {}));

    var shorthand = /*#__PURE__*/Object.freeze({
        getReplacerIndex: getReplacerIndex,
        getReplacer: getReplacer,
        value: value$1,
        replace: replace,
        REPLACE_NONE: REPLACE_NONE,
        INCLUDE_ALL: INCLUDE_ALL,
        vlSpec: vlSpec,
        PROPERTY_SUPPORTED_CHANNELS: PROPERTY_SUPPORTED_CHANNELS,
        spec: spec$1,
        encoding: encoding,
        fieldDef: fieldDef,
        parse: parse,
        splitWithTail: splitWithTail,
        get shorthandParser () { return shorthandParser; }
    });

    function isValueQuery(encQ) {
        return encQ !== null && encQ !== undefined && encQ['value'] !== undefined;
    }
    function isFieldQuery(encQ) {
        return encQ !== null && encQ !== undefined && (encQ['field'] || encQ['aggregate'] === 'count');
    }
    function isAutoCountQuery(encQ) {
        return encQ !== null && encQ !== undefined && 'autoCount' in encQ;
    }
    function isDisabledAutoCountQuery(encQ) {
        return isAutoCountQuery(encQ) && encQ.autoCount === false;
    }
    function isEnabledAutoCountQuery(encQ) {
        return isAutoCountQuery(encQ) && encQ.autoCount === true;
    }
    const DEFAULT_PROPS = [
        Property.AGGREGATE,
        Property.BIN,
        Property.TIMEUNIT,
        Property.FIELD,
        Property.TYPE,
        Property.SCALE,
        Property.SORT,
        Property.AXIS,
        Property.LEGEND,
        Property.STACK,
        Property.FORMAT
    ];
    function toEncoding(encQs, params) {
        let encoding = {};
        for (const encQ of encQs) {
            if (isDisabledAutoCountQuery(encQ)) {
                continue; // Do not include this in the output.
            }
            const { channel } = encQ;
            // if channel is a wildcard, return null
            if (isWildcard(channel)) {
                throw new Error('Cannot convert wildcard channel to a fixed channel');
            }
            const channelDef = isValueQuery(encQ) ? toValueDef(encQ) : toFieldDef(encQ, params);
            if (channelDef === null) {
                if (params.wildcardMode === 'null') {
                    // contains invalid property (e.g., wildcard, thus cannot return a proper spec.)
                    return null;
                }
                continue;
            }
            // Otherwise, we can set the channelDef
            encoding[channel] = channelDef;
        }
        return encoding;
    }
    function toValueDef(valueQ) {
        const { value } = valueQ;
        if (isWildcard(value)) {
            return null;
        }
        return { value };
    }
    function toFieldDef(encQ, params = {}) {
        const { props = DEFAULT_PROPS, schema, wildcardMode = 'skip' } = params;
        if (isFieldQuery(encQ)) {
            const fieldDef = {};
            for (const prop of props) {
                let encodingProperty = encQ[prop];
                if (isWildcard(encodingProperty)) {
                    if (wildcardMode === 'skip')
                        continue;
                    return null;
                }
                if (encodingProperty !== undefined) {
                    // if the channel supports this prop
                    const isSupportedByChannel = !PROPERTY_SUPPORTED_CHANNELS[prop] || PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel];
                    if (!isSupportedByChannel) {
                        continue;
                    }
                    if (isEncodingNestedParent(prop) && util_6(encodingProperty)) {
                        encodingProperty = Object.assign({}, encodingProperty); // Make a shallow copy first
                        for (const childProp in encodingProperty) {
                            // ensure nested properties are not wildcard before assigning to field def
                            if (isWildcard(encodingProperty[childProp])) {
                                if (wildcardMode === 'null') {
                                    return null;
                                }
                                delete encodingProperty[childProp]; // skip
                            }
                        }
                    }
                    if (prop === 'bin' && encodingProperty === false) {
                        continue;
                    }
                    else if (prop === 'type' && encodingProperty === 'key') {
                        fieldDef.type = 'nominal';
                    }
                    else {
                        fieldDef[prop] = encodingProperty;
                    }
                }
                if (prop === Property.SCALE && schema && encQ.type === ORDINAL) {
                    const scale = encQ.scale;
                    const { ordinalDomain } = schema.fieldSchema(encQ.field);
                    if (scale !== null && ordinalDomain) {
                        fieldDef[Property.SCALE] = Object.assign({ domain: ordinalDomain }, (util_6(scale) ? scale : {}));
                    }
                }
            }
            return fieldDef;
        }
        else {
            if (encQ.autoCount === false) {
                throw new Error(`Cannot convert {autoCount: false} into a field def`);
            }
            else {
                return {
                    aggregate: 'count',
                    field: '*',
                    type: 'quantitative'
                };
            }
        }
    }
    /**
     * Is a field query continuous field?
     * This method is applicable only for fieldQuery without wildcard
     */
    function isContinuous$1(encQ) {
        if (isFieldQuery(encQ)) {
            return isContinuous(toFieldDef(encQ, { props: ['bin', 'timeUnit', 'field', 'type'] }));
        }
        return isAutoCountQuery(encQ);
    }
    function isMeasure(encQ) {
        if (isFieldQuery(encQ)) {
            return !isDimension(encQ) && encQ.type !== 'temporal';
        }
        return isAutoCountQuery(encQ);
    }
    /**
     * Is a field query discrete field?
     * This method is applicable only for fieldQuery without wildcard
     */
    function isDimension(encQ) {
        if (isFieldQuery(encQ)) {
            const fieldDef = toFieldDef(encQ, { props: ['bin', 'timeUnit', 'type'] });
            return isDiscrete(fieldDef) || !!fieldDef.timeUnit;
        }
        return false;
    }
    /**
     *  Returns the true scale type of an encoding.
     *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's TYPE.
     *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
     */
    function scaleType$1(fieldQ) {
        const scale = fieldQ.scale === true || fieldQ.scale === SHORT_WILDCARD ? {} : fieldQ.scale || {};
        const { type, channel, timeUnit, bin } = fieldQ;
        // HACK: All of markType, and scaleConfig only affect
        // sub-type of ordinal to quantitative scales (point or band)
        // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
        // Thus, instead of making this method requiring the global mark,
        // we will just call it with mark = undefined .
        // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
        const markType = undefined;
        if (isWildcard(scale.type) || isWildcard(type) || isWildcard(channel) || isWildcard(bin)) {
            return undefined;
        }
        // If scale type is specified, then use scale.type
        if (scale.type) {
            return scale.type;
        }
        // if type is fixed and it's not temporal, we can ignore time unit.
        if (type === 'temporal' && isWildcard(timeUnit)) {
            return undefined;
        }
        // if type is fixed and it's not quantitative, we can ignore bin
        if (type === 'quantitative' && isWildcard(bin)) {
            return undefined;
        }
        let vegaLiteType = type === ExpandedType.KEY ? 'nominal' : type;
        const fieldDef = {
            type: vegaLiteType,
            timeUnit: timeUnit,
            bin: bin
        };
        return scaleType({ type: scale.type }, channel, fieldDef, markType);
    }

    var encoding$1 = /*#__PURE__*/Object.freeze({
        isValueQuery: isValueQuery,
        isFieldQuery: isFieldQuery,
        isAutoCountQuery: isAutoCountQuery,
        isDisabledAutoCountQuery: isDisabledAutoCountQuery,
        isEnabledAutoCountQuery: isEnabledAutoCountQuery,
        toEncoding: toEncoding,
        toValueDef: toValueDef,
        toFieldDef: toFieldDef,
        isContinuous: isContinuous$1,
        isMeasure: isMeasure,
        isDimension: isDimension,
        scaleType: scaleType$1
    });

    var d3Time = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      factory(exports);
    }(commonjsGlobal, function (exports) {
      var t0 = new Date;
      var t1 = new Date;
      function newInterval(floori, offseti, count, field) {

        function interval(date) {
          return floori(date = new Date(+date)), date;
        }

        interval.floor = interval;

        interval.round = function(date) {
          var d0 = new Date(+date),
              d1 = new Date(date - 1);
          floori(d0), floori(d1), offseti(d1, 1);
          return date - d0 < d1 - date ? d0 : d1;
        };

        interval.ceil = function(date) {
          return floori(date = new Date(date - 1)), offseti(date, 1), date;
        };

        interval.offset = function(date, step) {
          return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
        };

        interval.range = function(start, stop, step) {
          var range = [];
          start = new Date(start - 1);
          stop = new Date(+stop);
          step = step == null ? 1 : Math.floor(step);
          if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
          offseti(start, 1), floori(start);
          if (start < stop) range.push(new Date(+start));
          while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
          return range;
        };

        interval.filter = function(test) {
          return newInterval(function(date) {
            while (floori(date), !test(date)) date.setTime(date - 1);
          }, function(date, step) {
            while (--step >= 0) while (offseti(date, 1), !test(date));
          });
        };

        if (count) {
          interval.count = function(start, end) {
            t0.setTime(+start), t1.setTime(+end);
            floori(t0), floori(t1);
            return Math.floor(count(t0, t1));
          };

          interval.every = function(step) {
            step = Math.floor(step);
            return !isFinite(step) || !(step > 0) ? null
                : !(step > 1) ? interval
                : interval.filter(field
                    ? function(d) { return field(d) % step === 0; }
                    : function(d) { return interval.count(0, d) % step === 0; });
          };
        }

        return interval;
      }
      var millisecond = newInterval(function() {
        // noop
      }, function(date, step) {
        date.setTime(+date + step);
      }, function(start, end) {
        return end - start;
      });

      // An optimized implementation for this simple case.
      millisecond.every = function(k) {
        k = Math.floor(k);
        if (!isFinite(k) || !(k > 0)) return null;
        if (!(k > 1)) return millisecond;
        return newInterval(function(date) {
          date.setTime(Math.floor(date / k) * k);
        }, function(date, step) {
          date.setTime(+date + step * k);
        }, function(start, end) {
          return (end - start) / k;
        });
      };

      var second = newInterval(function(date) {
        date.setMilliseconds(0);
      }, function(date, step) {
        date.setTime(+date + step * 1e3);
      }, function(start, end) {
        return (end - start) / 1e3;
      }, function(date) {
        return date.getSeconds();
      });

      var minute = newInterval(function(date) {
        date.setSeconds(0, 0);
      }, function(date, step) {
        date.setTime(+date + step * 6e4);
      }, function(start, end) {
        return (end - start) / 6e4;
      }, function(date) {
        return date.getMinutes();
      });

      var hour = newInterval(function(date) {
        date.setMinutes(0, 0, 0);
      }, function(date, step) {
        date.setTime(+date + step * 36e5);
      }, function(start, end) {
        return (end - start) / 36e5;
      }, function(date) {
        return date.getHours();
      });

      var day = newInterval(function(date) {
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setDate(date.getDate() + step);
      }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
      }, function(date) {
        return date.getDate() - 1;
      });

      function weekday(i) {
        return newInterval(function(date) {
          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        }, function(date, step) {
          date.setDate(date.getDate() + step * 7);
        }, function(start, end) {
          return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
        });
      }

      var sunday = weekday(0);
      var monday = weekday(1);
      var tuesday = weekday(2);
      var wednesday = weekday(3);
      var thursday = weekday(4);
      var friday = weekday(5);
      var saturday = weekday(6);

      var month = newInterval(function(date) {
        date.setHours(0, 0, 0, 0);
        date.setDate(1);
      }, function(date, step) {
        date.setMonth(date.getMonth() + step);
      }, function(start, end) {
        return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
      }, function(date) {
        return date.getMonth();
      });

      var year = newInterval(function(date) {
        date.setHours(0, 0, 0, 0);
        date.setMonth(0, 1);
      }, function(date, step) {
        date.setFullYear(date.getFullYear() + step);
      }, function(start, end) {
        return end.getFullYear() - start.getFullYear();
      }, function(date) {
        return date.getFullYear();
      });

      var utcSecond = newInterval(function(date) {
        date.setUTCMilliseconds(0);
      }, function(date, step) {
        date.setTime(+date + step * 1e3);
      }, function(start, end) {
        return (end - start) / 1e3;
      }, function(date) {
        return date.getUTCSeconds();
      });

      var utcMinute = newInterval(function(date) {
        date.setUTCSeconds(0, 0);
      }, function(date, step) {
        date.setTime(+date + step * 6e4);
      }, function(start, end) {
        return (end - start) / 6e4;
      }, function(date) {
        return date.getUTCMinutes();
      });

      var utcHour = newInterval(function(date) {
        date.setUTCMinutes(0, 0, 0);
      }, function(date, step) {
        date.setTime(+date + step * 36e5);
      }, function(start, end) {
        return (end - start) / 36e5;
      }, function(date) {
        return date.getUTCHours();
      });

      var utcDay = newInterval(function(date) {
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step);
      }, function(start, end) {
        return (end - start) / 864e5;
      }, function(date) {
        return date.getUTCDate() - 1;
      });

      function utcWeekday(i) {
        return newInterval(function(date) {
          date.setUTCHours(0, 0, 0, 0);
          date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        }, function(date, step) {
          date.setUTCDate(date.getUTCDate() + step * 7);
        }, function(start, end) {
          return (end - start) / 6048e5;
        });
      }

      var utcSunday = utcWeekday(0);
      var utcMonday = utcWeekday(1);
      var utcTuesday = utcWeekday(2);
      var utcWednesday = utcWeekday(3);
      var utcThursday = utcWeekday(4);
      var utcFriday = utcWeekday(5);
      var utcSaturday = utcWeekday(6);

      var utcMonth = newInterval(function(date) {
        date.setUTCHours(0, 0, 0, 0);
        date.setUTCDate(1);
      }, function(date, step) {
        date.setUTCMonth(date.getUTCMonth() + step);
      }, function(start, end) {
        return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
      }, function(date) {
        return date.getUTCMonth();
      });

      var utcYear = newInterval(function(date) {
        date.setUTCHours(0, 0, 0, 0);
        date.setUTCMonth(0, 1);
      }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step);
      }, function(start, end) {
        return end.getUTCFullYear() - start.getUTCFullYear();
      }, function(date) {
        return date.getUTCFullYear();
      });

      var milliseconds = millisecond.range;
      var seconds = second.range;
      var minutes = minute.range;
      var hours = hour.range;
      var days = day.range;
      var sundays = sunday.range;
      var mondays = monday.range;
      var tuesdays = tuesday.range;
      var wednesdays = wednesday.range;
      var thursdays = thursday.range;
      var fridays = friday.range;
      var saturdays = saturday.range;
      var weeks = sunday.range;
      var months = month.range;
      var years = year.range;

      var utcMillisecond = millisecond;
      var utcMilliseconds = milliseconds;
      var utcSeconds = utcSecond.range;
      var utcMinutes = utcMinute.range;
      var utcHours = utcHour.range;
      var utcDays = utcDay.range;
      var utcSundays = utcSunday.range;
      var utcMondays = utcMonday.range;
      var utcTuesdays = utcTuesday.range;
      var utcWednesdays = utcWednesday.range;
      var utcThursdays = utcThursday.range;
      var utcFridays = utcFriday.range;
      var utcSaturdays = utcSaturday.range;
      var utcWeeks = utcSunday.range;
      var utcMonths = utcMonth.range;
      var utcYears = utcYear.range;

      var version = "0.1.1";

      exports.version = version;
      exports.milliseconds = milliseconds;
      exports.seconds = seconds;
      exports.minutes = minutes;
      exports.hours = hours;
      exports.days = days;
      exports.sundays = sundays;
      exports.mondays = mondays;
      exports.tuesdays = tuesdays;
      exports.wednesdays = wednesdays;
      exports.thursdays = thursdays;
      exports.fridays = fridays;
      exports.saturdays = saturdays;
      exports.weeks = weeks;
      exports.months = months;
      exports.years = years;
      exports.utcMillisecond = utcMillisecond;
      exports.utcMilliseconds = utcMilliseconds;
      exports.utcSeconds = utcSeconds;
      exports.utcMinutes = utcMinutes;
      exports.utcHours = utcHours;
      exports.utcDays = utcDays;
      exports.utcSundays = utcSundays;
      exports.utcMondays = utcMondays;
      exports.utcTuesdays = utcTuesdays;
      exports.utcWednesdays = utcWednesdays;
      exports.utcThursdays = utcThursdays;
      exports.utcFridays = utcFridays;
      exports.utcSaturdays = utcSaturdays;
      exports.utcWeeks = utcWeeks;
      exports.utcMonths = utcMonths;
      exports.utcYears = utcYears;
      exports.millisecond = millisecond;
      exports.second = second;
      exports.minute = minute;
      exports.hour = hour;
      exports.day = day;
      exports.sunday = sunday;
      exports.monday = monday;
      exports.tuesday = tuesday;
      exports.wednesday = wednesday;
      exports.thursday = thursday;
      exports.friday = friday;
      exports.saturday = saturday;
      exports.week = sunday;
      exports.month = month;
      exports.year = year;
      exports.utcSecond = utcSecond;
      exports.utcMinute = utcMinute;
      exports.utcHour = utcHour;
      exports.utcDay = utcDay;
      exports.utcSunday = utcSunday;
      exports.utcMonday = utcMonday;
      exports.utcTuesday = utcTuesday;
      exports.utcWednesday = utcWednesday;
      exports.utcThursday = utcThursday;
      exports.utcFriday = utcFriday;
      exports.utcSaturday = utcSaturday;
      exports.utcWeek = utcSunday;
      exports.utcMonth = utcMonth;
      exports.utcYear = utcYear;
      exports.interval = newInterval;

    }));
    });

    var tempDate = new Date(),
        baseDate = new Date(0, 0, 1).setFullYear(0), // Jan 1, 0 AD
        utcBaseDate = new Date(Date.UTC(0, 0, 1)).setUTCFullYear(0);

    function date(d) {
      return (tempDate.setTime(+d), tempDate);
    }

    // create a time unit entry
    function entry(type, date, unit, step, min, max) {
      var e = {
        type: type,
        date: date,
        unit: unit
      };
      if (step) {
        e.step = step;
      } else {
        e.minstep = 1;
      }
      if (min != null) e.min = min;
      if (max != null) e.max = max;
      return e;
    }

    function create(type, unit, base, step, min, max) {
      return entry(type,
        function(d) { return unit.offset(base, d); },
        function(d) { return unit.count(base, d); },
        step, min, max);
    }

    var locale = [
      create('second', d3Time.second, baseDate),
      create('minute', d3Time.minute, baseDate),
      create('hour',   d3Time.hour,   baseDate),
      create('day',    d3Time.day,    baseDate, [1, 7]),
      create('month',  d3Time.month,  baseDate, [1, 3, 6]),
      create('year',   d3Time.year,   baseDate),

      // periodic units
      entry('seconds',
        function(d) { return new Date(1970, 0, 1, 0, 0, d); },
        function(d) { return date(d).getSeconds(); },
        null, 0, 59
      ),
      entry('minutes',
        function(d) { return new Date(1970, 0, 1, 0, d); },
        function(d) { return date(d).getMinutes(); },
        null, 0, 59
      ),
      entry('hours',
        function(d) { return new Date(1970, 0, 1, d); },
        function(d) { return date(d).getHours(); },
        null, 0, 23
      ),
      entry('weekdays',
        function(d) { return new Date(1970, 0, 4+d); },
        function(d) { return date(d).getDay(); },
        [1], 0, 6
      ),
      entry('dates',
        function(d) { return new Date(1970, 0, d); },
        function(d) { return date(d).getDate(); },
        [1], 1, 31
      ),
      entry('months',
        function(d) { return new Date(1970, d % 12, 1); },
        function(d) { return date(d).getMonth(); },
        [1], 0, 11
      )
    ];

    var utc = [
      create('second', d3Time.utcSecond, utcBaseDate),
      create('minute', d3Time.utcMinute, utcBaseDate),
      create('hour',   d3Time.utcHour,   utcBaseDate),
      create('day',    d3Time.utcDay,    utcBaseDate, [1, 7]),
      create('month',  d3Time.utcMonth,  utcBaseDate, [1, 3, 6]),
      create('year',   d3Time.utcYear,   utcBaseDate),

      // periodic units
      entry('seconds',
        function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
        function(d) { return date(d).getUTCSeconds(); },
        null, 0, 59
      ),
      entry('minutes',
        function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
        function(d) { return date(d).getUTCMinutes(); },
        null, 0, 59
      ),
      entry('hours',
        function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
        function(d) { return date(d).getUTCHours(); },
        null, 0, 23
      ),
      entry('weekdays',
        function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
        function(d) { return date(d).getUTCDay(); },
        [1], 0, 6
      ),
      entry('dates',
        function(d) { return new Date(Date.UTC(1970, 0, d)); },
        function(d) { return date(d).getUTCDate(); },
        [1], 1, 31
      ),
      entry('months',
        function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
        function(d) { return date(d).getUTCMonth(); },
        [1], 0, 11
      )
    ];

    var STEPS = [
      [31536e6, 5],  // 1-year
      [7776e6, 4],   // 3-month
      [2592e6, 4],   // 1-month
      [12096e5, 3],  // 2-week
      [6048e5, 3],   // 1-week
      [1728e5, 3],   // 2-day
      [864e5, 3],    // 1-day
      [432e5, 2],    // 12-hour
      [216e5, 2],    // 6-hour
      [108e5, 2],    // 3-hour
      [36e5, 2],     // 1-hour
      [18e5, 1],     // 30-minute
      [9e5, 1],      // 15-minute
      [3e5, 1],      // 5-minute
      [6e4, 1],      // 1-minute
      [3e4, 0],      // 30-second
      [15e3, 0],     // 15-second
      [5e3, 0],      // 5-second
      [1e3, 0]       // 1-second
    ];

    function find(units, span, minb, maxb) {
      var step = STEPS[0], i, n, bins;

      for (i=1, n=STEPS.length; i<n; ++i) {
        step = STEPS[i];
        if (span > step[0]) {
          bins = span / step[0];
          if (bins > maxb) {
            return units[STEPS[i-1][1]];
          }
          if (bins >= minb) {
            return units[step[1]];
          }
        }
      }
      return units[STEPS[n-1][1]];
    }

    function toUnitMap(units) {
      var map = {}, i, n;
      for (i=0, n=units.length; i<n; ++i) {
        map[units[i].type] = units[i];
      }
      map.find = function(span, minb, maxb) {
        return find(units, span, minb, maxb);
      };
      return map;
    }

    var time = toUnitMap(locale);
    var utc_1 = toUnitMap(utc);
    time.utc = utc_1;

    var EPSILON = 1e-15;

    function bins(opt) {
      if (!opt) { throw Error("Missing binning options."); }

      // determine range
      var maxb = opt.maxbins || 15,
          base = opt.base || 10,
          logb = Math.log(base),
          div = opt.div || [5, 2],
          min = opt.min,
          max = opt.max,
          span = max - min,
          step, level, minstep, precision, v, i, eps;

      if (opt.step) {
        // if step size is explicitly given, use that
        step = opt.step;
      } else if (opt.steps) {
        // if provided, limit choice to acceptable step sizes
        step = opt.steps[Math.min(
          opt.steps.length - 1,
          bisect(opt.steps, span/maxb, 0, opt.steps.length)
        )];
      } else {
        // else use span to determine step size
        level = Math.ceil(Math.log(maxb) / logb);
        minstep = opt.minstep || 0;
        step = Math.max(
          minstep,
          Math.pow(base, Math.round(Math.log(span) / logb) - level)
        );

        // increase step size if too many bins
        while (Math.ceil(span/step) > maxb) { step *= base; }

        // decrease step size if allowed
        for (i=0; i<div.length; ++i) {
          v = step / div[i];
          if (v >= minstep && span / v <= maxb) step = v;
        }
      }

      // update precision, min and max
      v = Math.log(step);
      precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
      eps = Math.pow(base, -precision - 1);
      min = Math.min(min, Math.floor(min / step + eps) * step);
      max = Math.ceil(max / step) * step;

      return {
        start: min,
        stop:  max,
        step:  step,
        unit:  {precision: precision},
        value: value$2,
        index: index
      };
    }

    function bisect(a, x, lo, hi) {
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
        else { hi = mid; }
      }
      return lo;
    }

    function value$2(v) {
      return this.step * Math.floor(v / this.step + EPSILON);
    }

    function index(v) {
      return Math.floor((v - this.start) / this.step + EPSILON);
    }

    function date_value(v) {
      return this.unit.date(value$2.call(this, v));
    }

    function date_index(v) {
      return index.call(this, this.unit.unit(v));
    }

    bins.date = function(opt) {
      if (!opt) { throw Error("Missing date binning options."); }

      // find time step, then bin
      var units = opt.utc ? time.utc : time,
          dmin = opt.min,
          dmax = opt.max,
          maxb = opt.maxbins || 20,
          minb = opt.minbins || 4,
          span = (+dmax) - (+dmin),
          unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
          spec = bins({
            min:     unit.min != null ? unit.min : unit.unit(dmin),
            max:     unit.max != null ? unit.max : unit.unit(dmax),
            maxbins: maxb,
            minstep: unit.minstep,
            steps:   unit.step
          });

      spec.unit = unit;
      spec.index = date_index;
      if (!opt.raw) spec.value = date_value;
      return spec;
    };

    var bins_1 = bins;

    var TYPES = '__types__';

    var PARSERS = {
      boolean: util.boolean,
      integer: util.number,
      number:  util.number,
      date:    util.date,
      string:  function(x) { return x == null || x === '' ? null : x + ''; }
    };

    var TESTS = {
      boolean: function(x) { return x==='true' || x==='false' || util.isBoolean(x); },
      integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
      number: function(x) { return !isNaN(+x) && !util.isDate(x); },
      date: function(x) { return !isNaN(Date.parse(x)); }
    };

    function annotation(data, types) {
      if (!types) return data && data[TYPES] || null;
      data[TYPES] = types;
    }

    function fieldNames(datum) {
      return util.keys(datum);
    }

    function bracket(fieldName) {
      return '[' + fieldName + ']';
    }

    function type(values, f) {
      values = util.array(values);
      f = util.$(f);
      var v, i, n;

      // if data array has type annotations, use them
      if (values[TYPES]) {
        v = f(values[TYPES]);
        if (util.isString(v)) return v;
      }

      for (i=0, n=values.length; !util.isValid(v) && i<n; ++i) {
        v = f ? f(values[i]) : values[i];
      }

      return util.isDate(v) ? 'date' :
        util.isNumber(v)    ? 'number' :
        util.isBoolean(v)   ? 'boolean' :
        util.isString(v)    ? 'string' : null;
    }

    function typeAll(data, fields) {
      if (!data.length) return;
      var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
      return fields.reduce(function(types, f) {
        return (types[f] = type(data, get(f)), types);
      }, {});
    }

    function infer(values, f) {
      values = util.array(values);
      f = util.$(f);
      var i, j, v;

      // types to test for, in precedence order
      var types = ['boolean', 'integer', 'number', 'date'];

      for (i=0; i<values.length; ++i) {
        // get next value to test
        v = f ? f(values[i]) : values[i];
        // test value against remaining types
        for (j=0; j<types.length; ++j) {
          if (util.isValid(v) && !TESTS[types[j]](v)) {
            types.splice(j, 1);
            j -= 1;
          }
        }
        // if no types left, return 'string'
        if (types.length === 0) return 'string';
      }

      return types[0];
    }

    function inferAll(data, fields) {
      var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
      return fields.reduce(function(types, f) {
        types[f] = infer(data, get(f));
        return types;
      }, {});
    }

    type.annotation = annotation;
    type.all = typeAll;
    type.infer = infer;
    type.inferAll = inferAll;
    type.parsers = PARSERS;
    var type_1 = type;
    var type_2 = type_1.inferAll;

    var generate = createCommonjsModule(function (module) {
    var gen = module.exports;

    gen.repeat = function(val, n) {
      var a = Array(n), i;
      for (i=0; i<n; ++i) a[i] = val;
      return a;
    };

    gen.zeros = function(n) {
      return gen.repeat(0, n);
    };

    gen.range = function(start, stop, step) {
      if (arguments.length < 3) {
        step = 1;
        if (arguments.length < 2) {
          stop = start;
          start = 0;
        }
      }
      if ((stop - start) / step == Infinity) throw new Error('Infinite range');
      var range = [], i = -1, j;
      if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
      else while ((j = start + step * ++i) < stop) range.push(j);
      return range;
    };

    gen.random = {};

    gen.random.uniform = function(min, max) {
      if (max === undefined) {
        max = min === undefined ? 1 : min;
        min = 0;
      }
      var d = max - min;
      var f = function() {
        return min + d * Math.random();
      };
      f.samples = function(n) {
        return gen.zeros(n).map(f);
      };
      f.pdf = function(x) {
        return (x >= min && x <= max) ? 1/d : 0;
      };
      f.cdf = function(x) {
        return x < min ? 0 : x > max ? 1 : (x - min) / d;
      };
      f.icdf = function(p) {
        return (p >= 0 && p <= 1) ? min + p*d : NaN;
      };
      return f;
    };

    gen.random.integer = function(a, b) {
      if (b === undefined) {
        b = a;
        a = 0;
      }
      var d = b - a;
      var f = function() {
        return a + Math.floor(d * Math.random());
      };
      f.samples = function(n) {
        return gen.zeros(n).map(f);
      };
      f.pdf = function(x) {
        return (x === Math.floor(x) && x >= a && x < b) ? 1/d : 0;
      };
      f.cdf = function(x) {
        var v = Math.floor(x);
        return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
      };
      f.icdf = function(p) {
        return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p*d) : NaN;
      };
      return f;
    };

    gen.random.normal = function(mean, stdev) {
      mean = mean || 0;
      stdev = stdev || 1;
      var next;
      var f = function() {
        var x = 0, y = 0, rds, c;
        if (next !== undefined) {
          x = next;
          next = undefined;
          return x;
        }
        do {
          x = Math.random()*2-1;
          y = Math.random()*2-1;
          rds = x*x + y*y;
        } while (rds === 0 || rds > 1);
        c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
        next = mean + y*c*stdev;
        return mean + x*c*stdev;
      };
      f.samples = function(n) {
        return gen.zeros(n).map(f);
      };
      f.pdf = function(x) {
        var exp = Math.exp(Math.pow(x-mean, 2) / (-2 * Math.pow(stdev, 2)));
        return (1 / (stdev * Math.sqrt(2*Math.PI))) * exp;
      };
      f.cdf = function(x) {
        // Approximation from West (2009)
        // Better Approximations to Cumulative Normal Functions
        var cd,
            z = (x - mean) / stdev,
            Z = Math.abs(z);
        if (Z > 37) {
          cd = 0;
        } else {
          var sum, exp = Math.exp(-Z*Z/2);
          if (Z < 7.07106781186547) {
            sum = 3.52624965998911e-02 * Z + 0.700383064443688;
            sum = sum * Z + 6.37396220353165;
            sum = sum * Z + 33.912866078383;
            sum = sum * Z + 112.079291497871;
            sum = sum * Z + 221.213596169931;
            sum = sum * Z + 220.206867912376;
            cd = exp * sum;
            sum = 8.83883476483184e-02 * Z + 1.75566716318264;
            sum = sum * Z + 16.064177579207;
            sum = sum * Z + 86.7807322029461;
            sum = sum * Z + 296.564248779674;
            sum = sum * Z + 637.333633378831;
            sum = sum * Z + 793.826512519948;
            sum = sum * Z + 440.413735824752;
            cd = cd / sum;
          } else {
            sum = Z + 0.65;
            sum = Z + 4 / sum;
            sum = Z + 3 / sum;
            sum = Z + 2 / sum;
            sum = Z + 1 / sum;
            cd = exp / sum / 2.506628274631;
          }
        }
        return z > 0 ? 1 - cd : cd;
      };
      f.icdf = function(p) {
        // Approximation of Probit function using inverse error function.
        if (p <= 0 || p >= 1) return NaN;
        var x = 2*p - 1,
            v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
            a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
            b = Math.log(1 - (x*x)) / v,
            s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
        return mean + stdev * Math.SQRT2 * s;
      };
      return f;
    };

    gen.random.bootstrap = function(domain, smooth) {
      // Generates a bootstrap sample from a set of observations.
      // Smooth bootstrapping adds random zero-centered noise to the samples.
      var val = domain.filter(util.isValid),
          len = val.length,
          err = smooth ? gen.random.normal(0, smooth) : null;
      var f = function() {
        return val[~~(Math.random()*len)] + (err ? err() : 0);
      };
      f.samples = function(n) {
        return gen.zeros(n).map(f);
      };
      return f;
    };
    });

    var stats_1 = createCommonjsModule(function (module) {
    var stats = module.exports;

    // Collect unique values.
    // Output: an array of unique values, in first-observed order
    stats.unique = function(values, f, results) {
      f = util.$(f);
      results = results || [];
      var u = {}, v, i, n;
      for (i=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (v in u) continue;
        u[v] = 1;
        results.push(v);
      }
      return results;
    };

    // Return the length of the input array.
    stats.count = function(values) {
      return values && values.length || 0;
    };

    // Count the number of non-null, non-undefined, non-NaN values.
    stats.count.valid = function(values, f) {
      f = util.$(f);
      var v, i, n, valid = 0;
      for (i=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) valid += 1;
      }
      return valid;
    };

    // Count the number of null or undefined values.
    stats.count.missing = function(values, f) {
      f = util.$(f);
      var v, i, n, count = 0;
      for (i=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (v == null) count += 1;
      }
      return count;
    };

    // Count the number of distinct values.
    // Null, undefined and NaN are each considered distinct values.
    stats.count.distinct = function(values, f) {
      f = util.$(f);
      var u = {}, v, i, n, count = 0;
      for (i=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (v in u) continue;
        u[v] = 1;
        count += 1;
      }
      return count;
    };

    // Construct a map from distinct values to occurrence counts.
    stats.count.map = function(values, f) {
      f = util.$(f);
      var map = {}, v, i, n;
      for (i=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        map[v] = (v in map) ? map[v] + 1 : 1;
      }
      return map;
    };

    // Compute the median of an array of numbers.
    stats.median = function(values, f) {
      if (f) values = values.map(util.$(f));
      values = values.filter(util.isValid).sort(util.cmp);
      return stats.quantile(values, 0.5);
    };

    // Computes the quartile boundaries of an array of numbers.
    stats.quartile = function(values, f) {
      if (f) values = values.map(util.$(f));
      values = values.filter(util.isValid).sort(util.cmp);
      var q = stats.quantile;
      return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
    };

    // Compute the quantile of a sorted array of numbers.
    // Adapted from the D3.js implementation.
    stats.quantile = function(values, f, p) {
      if (p === undefined) { p = f; f = util.identity; }
      f = util.$(f);
      var H = (values.length - 1) * p + 1,
          h = Math.floor(H),
          v = +f(values[h - 1]),
          e = H - h;
      return e ? v + e * (f(values[h]) - v) : v;
    };

    // Compute the sum of an array of numbers.
    stats.sum = function(values, f) {
      f = util.$(f);
      for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) sum += v;
      }
      return sum;
    };

    // Compute the mean (average) of an array of numbers.
    stats.mean = function(values, f) {
      f = util.$(f);
      var mean = 0, delta, i, n, c, v;
      for (i=0, c=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) {
          delta = v - mean;
          mean = mean + delta / (++c);
        }
      }
      return mean;
    };

    // Compute the geometric mean of an array of numbers.
    stats.mean.geometric = function(values, f) {
      f = util.$(f);
      var mean = 1, c, n, v, i;
      for (i=0, c=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) {
          if (v <= 0) {
            throw Error("Geometric mean only defined for positive values.");
          }
          mean *= v;
          ++c;
        }
      }
      mean = c > 0 ? Math.pow(mean, 1/c) : 0;
      return mean;
    };

    // Compute the harmonic mean of an array of numbers.
    stats.mean.harmonic = function(values, f) {
      f = util.$(f);
      var mean = 0, c, n, v, i;
      for (i=0, c=0, n=values.length; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) {
          mean += 1/v;
          ++c;
        }
      }
      return c / mean;
    };

    // Compute the sample variance of an array of numbers.
    stats.variance = function(values, f) {
      f = util.$(f);
      if (!util.isArray(values) || values.length < 2) return 0;
      var mean = 0, M2 = 0, delta, i, c, v;
      for (i=0, c=0; i<values.length; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) {
          delta = v - mean;
          mean = mean + delta / (++c);
          M2 = M2 + delta * (v - mean);
        }
      }
      M2 = M2 / (c - 1);
      return M2;
    };

    // Compute the sample standard deviation of an array of numbers.
    stats.stdev = function(values, f) {
      return Math.sqrt(stats.variance(values, f));
    };

    // Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
    stats.modeskew = function(values, f) {
      var avg = stats.mean(values, f),
          med = stats.median(values, f),
          std = stats.stdev(values, f);
      return std === 0 ? 0 : (avg - med) / std;
    };

    // Find the minimum value in an array.
    stats.min = function(values, f) {
      return stats.extent(values, f)[0];
    };

    // Find the maximum value in an array.
    stats.max = function(values, f) {
      return stats.extent(values, f)[1];
    };

    // Find the minimum and maximum of an array of values.
    stats.extent = function(values, f) {
      f = util.$(f);
      var a, b, v, i, n = values.length;
      for (i=0; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) { a = b = v; break; }
      }
      for (; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) {
          if (v < a) a = v;
          if (v > b) b = v;
        }
      }
      return [a, b];
    };

    // Find the integer indices of the minimum and maximum values.
    stats.extent.index = function(values, f) {
      f = util.$(f);
      var x = -1, y = -1, a, b, v, i, n = values.length;
      for (i=0; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) { a = b = v; x = y = i; break; }
      }
      for (; i<n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (util.isValid(v)) {
          if (v < a) { a = v; x = i; }
          if (v > b) { b = v; y = i; }
        }
      }
      return [x, y];
    };

    // Compute the dot product of two arrays of numbers.
    stats.dot = function(values, a, b) {
      var sum = 0, i, v;
      if (!b) {
        if (values.length !== a.length) {
          throw Error('Array lengths must match.');
        }
        for (i=0; i<values.length; ++i) {
          v = values[i] * a[i];
          if (v === v) sum += v;
        }
      } else {
        a = util.$(a);
        b = util.$(b);
        for (i=0; i<values.length; ++i) {
          v = a(values[i]) * b(values[i]);
          if (v === v) sum += v;
        }
      }
      return sum;
    };

    // Compute the vector distance between two arrays of numbers.
    // Default is Euclidean (exp=2) distance, configurable via exp argument.
    stats.dist = function(values, a, b, exp) {
      var f = util.isFunction(b) || util.isString(b),
          X = values,
          Y = f ? values : a,
          e = f ? exp : b,
          L2 = e === 2 || e == null,
          n = values.length, s = 0, d, i;
      if (f) {
        a = util.$(a);
        b = util.$(b);
      }
      for (i=0; i<n; ++i) {
        d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
        s += L2 ? d*d : Math.pow(Math.abs(d), e);
      }
      return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
    };

    // Compute the Cohen's d effect size between two arrays of numbers.
    stats.cohensd = function(values, a, b) {
      var X = b ? values.map(util.$(a)) : values,
          Y = b ? values.map(util.$(b)) : a,
          x1 = stats.mean(X),
          x2 = stats.mean(Y),
          n1 = stats.count.valid(X),
          n2 = stats.count.valid(Y);

      if ((n1+n2-2) <= 0) {
        // if both arrays are size 1, or one is empty, there's no effect size
        return 0;
      }
      // pool standard deviation
      var s1 = stats.variance(X),
          s2 = stats.variance(Y),
          s = Math.sqrt((((n1-1)*s1) + ((n2-1)*s2)) / (n1+n2-2));
      // if there is no variance, there's no effect size
      return s===0 ? 0 : (x1 - x2) / s;
    };

    // Computes the covariance between two arrays of numbers
    stats.covariance = function(values, a, b) {
      var X = b ? values.map(util.$(a)) : values,
          Y = b ? values.map(util.$(b)) : a,
          n = X.length,
          xm = stats.mean(X),
          ym = stats.mean(Y),
          sum = 0, c = 0, i, x, y, vx, vy;

      if (n !== Y.length) {
        throw Error('Input lengths must match.');
      }

      for (i=0; i<n; ++i) {
        x = X[i]; vx = util.isValid(x);
        y = Y[i]; vy = util.isValid(y);
        if (vx && vy) {
          sum += (x-xm) * (y-ym);
          ++c;
        } else if (vx || vy) {
          throw Error('Valid values must align.');
        }
      }
      return sum / (c-1);
    };

    // Compute ascending rank scores for an array of values.
    // Ties are assigned their collective mean rank.
    stats.rank = function(values, f) {
      f = util.$(f) || util.identity;
      var a = values.map(function(v, i) {
          return {idx: i, val: f(v)};
        })
        .sort(util.comparator('val'));

      var n = values.length,
          r = Array(n),
          tie = -1, p = {}, i, v, mu;

      for (i=0; i<n; ++i) {
        v = a[i].val;
        if (tie < 0 && p === v) {
          tie = i - 1;
        } else if (tie > -1 && p !== v) {
          mu = 1 + (i-1 + tie) / 2;
          for (; tie<i; ++tie) r[a[tie].idx] = mu;
          tie = -1;
        }
        r[a[i].idx] = i + 1;
        p = v;
      }

      if (tie > -1) {
        mu = 1 + (n-1 + tie) / 2;
        for (; tie<n; ++tie) r[a[tie].idx] = mu;
      }

      return r;
    };

    // Compute the sample Pearson product-moment correlation of two arrays of numbers.
    stats.cor = function(values, a, b) {
      var fn = b;
      b = fn ? values.map(util.$(b)) : a;
      a = fn ? values.map(util.$(a)) : values;

      var dot = stats.dot(a, b),
          mua = stats.mean(a),
          mub = stats.mean(b),
          sda = stats.stdev(a),
          sdb = stats.stdev(b),
          n = values.length;

      return (dot - n*mua*mub) / ((n-1) * sda * sdb);
    };

    // Compute the Spearman rank correlation of two arrays of values.
    stats.cor.rank = function(values, a, b) {
      var ra = b ? stats.rank(values, a) : stats.rank(values),
          rb = b ? stats.rank(values, b) : stats.rank(a),
          n = values.length, i, s, d;

      for (i=0, s=0; i<n; ++i) {
        d = ra[i] - rb[i];
        s += d * d;
      }

      return 1 - 6*s / (n * (n*n-1));
    };

    // Compute the distance correlation of two arrays of numbers.
    // http://en.wikipedia.org/wiki/Distance_correlation
    stats.cor.dist = function(values, a, b) {
      var X = b ? values.map(util.$(a)) : values,
          Y = b ? values.map(util.$(b)) : a;

      var A = stats.dist.mat(X),
          B = stats.dist.mat(Y),
          n = A.length,
          i, aa, bb, ab;

      for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
        aa += A[i]*A[i];
        bb += B[i]*B[i];
        ab += A[i]*B[i];
      }

      return Math.sqrt(ab / Math.sqrt(aa*bb));
    };

    // Simple linear regression.
    // Returns a "fit" object with slope (m), intercept (b),
    // r value (R), and sum-squared residual error (rss).
    stats.linearRegression = function(values, a, b) {
      var X = b ? values.map(util.$(a)) : values,
          Y = b ? values.map(util.$(b)) : a,
          n = X.length,
          xy = stats.covariance(X, Y), // will throw err if valid vals don't align
          sx = stats.stdev(X),
          sy = stats.stdev(Y),
          slope = xy / (sx*sx),
          icept = stats.mean(Y) - slope * stats.mean(X),
          fit = {slope: slope, intercept: icept, R: xy / (sx*sy), rss: 0},
          res, i;

      for (i=0; i<n; ++i) {
        if (util.isValid(X[i]) && util.isValid(Y[i])) {
          res = (slope*X[i] + icept) - Y[i];
          fit.rss += res * res;
        }
      }

      return fit;
    };

    // Namespace for bootstrap
    stats.bootstrap = {};

    // Construct a bootstrapped confidence interval at a given percentile level
    // Arguments are an array, an optional n (defaults to 1000),
    //  an optional alpha (defaults to 0.05), and an optional smoothing parameter
    stats.bootstrap.ci = function(values, a, b, c, d) {
      var X, N, alpha, smooth, bs, means, i;
      if (util.isFunction(a) || util.isString(a)) {
        X = values.map(util.$(a));
        N = b;
        alpha = c;
        smooth = d;
      } else {
        X = values;
        N = a;
        alpha = b;
        smooth = c;
      }
      N = N ? +N : 1000;
      alpha = alpha || 0.05;

      bs = generate.random.bootstrap(X, smooth);
      for (i=0, means = Array(N); i<N; ++i) {
        means[i] = stats.mean(bs.samples(X.length));
      }
      means.sort(util.numcmp);
      return [
        stats.quantile(means, alpha/2),
        stats.quantile(means, 1-(alpha/2))
      ];
    };

    // Namespace for z-tests
    stats.z = {};

    // Construct a z-confidence interval at a given significance level
    // Arguments are an array and an optional alpha (defaults to 0.05).
    stats.z.ci = function(values, a, b) {
      var X = values, alpha = a;
      if (util.isFunction(a) || util.isString(a)) {
        X = values.map(util.$(a));
        alpha = b;
      }
      alpha = alpha || 0.05;

      var z = alpha===0.05 ? 1.96 : generate.random.normal(0, 1).icdf(1-(alpha/2)),
          mu = stats.mean(X),
          SE = stats.stdev(X) / Math.sqrt(stats.count.valid(X));
      return [mu - (z*SE), mu + (z*SE)];
    };

    // Perform a z-test of means. Returns the p-value.
    // If a single array is provided, performs a one-sample location test.
    // If two arrays or a table and two accessors are provided, performs
    // a two-sample location test. A paired test is performed if specified
    // by the options hash.
    // The options hash format is: {paired: boolean, nullh: number}.
    // http://en.wikipedia.org/wiki/Z-test
    // http://en.wikipedia.org/wiki/Paired_difference_test
    stats.z.test = function(values, a, b, opt) {
      if (util.isFunction(b) || util.isString(b)) { // table and accessors
        return (opt && opt.paired ? ztestP : ztest2)(opt, values, a, b);
      } else if (util.isArray(a)) { // two arrays
        return (b && b.paired ? ztestP : ztest2)(b, values, a);
      } else if (util.isFunction(a) || util.isString(a)) {
        return ztest1(b, values, a); // table and accessor
      } else {
        return ztest1(a, values); // one array
      }
    };

    // Perform a z-test of means. Returns the p-value.
    // Assuming we have a list of values, and a null hypothesis. If no null
    // hypothesis, assume our null hypothesis is mu=0.
    function ztest1(opt, X, f) {
      var nullH = opt && opt.nullh || 0,
          gaussian = generate.random.normal(0, 1),
          mu = stats.mean(X,f),
          SE = stats.stdev(X,f) / Math.sqrt(stats.count.valid(X,f));

      if (SE===0) {
        // Test not well defined when standard error is 0.
        return (mu - nullH) === 0 ? 1 : 0;
      }
      // Two-sided, so twice the one-sided cdf.
      var z = (mu - nullH) / SE;
      return 2 * gaussian.cdf(-Math.abs(z));
    }

    // Perform a two sample paired z-test of means. Returns the p-value.
    function ztestP(opt, values, a, b) {
      var X = b ? values.map(util.$(a)) : values,
          Y = b ? values.map(util.$(b)) : a,
          n1 = stats.count(X),
          n2 = stats.count(Y),
          diffs = Array(), i;

      if (n1 !== n2) {
        throw Error('Array lengths must match.');
      }
      for (i=0; i<n1; ++i) {
        // Only valid differences should contribute to the test statistic
        if (util.isValid(X[i]) && util.isValid(Y[i])) {
          diffs.push(X[i] - Y[i]);
        }
      }
      return stats.z.test(diffs, opt && opt.nullh || 0);
    }

    // Perform a two sample z-test of means. Returns the p-value.
    function ztest2(opt, values, a, b) {
      var X = b ? values.map(util.$(a)) : values,
          Y = b ? values.map(util.$(b)) : a,
          n1 = stats.count.valid(X),
          n2 = stats.count.valid(Y),
          gaussian = generate.random.normal(0, 1),
          meanDiff = stats.mean(X) - stats.mean(Y) - (opt && opt.nullh || 0),
          SE = Math.sqrt(stats.variance(X)/n1 + stats.variance(Y)/n2);

      if (SE===0) {
        // Not well defined when pooled standard error is 0.
        return meanDiff===0 ? 1 : 0;
      }
      // Two-tailed, so twice the one-sided cdf.
      var z = meanDiff / SE;
      return 2 * gaussian.cdf(-Math.abs(z));
    }

    // Construct a mean-centered distance matrix for an array of numbers.
    stats.dist.mat = function(X) {
      var n = X.length,
          m = n*n,
          A = Array(m),
          R = generate.zeros(n),
          M = 0, v, i, j;

      for (i=0; i<n; ++i) {
        A[i*n+i] = 0;
        for (j=i+1; j<n; ++j) {
          A[i*n+j] = (v = Math.abs(X[i] - X[j]));
          A[j*n+i] = v;
          R[i] += v;
          R[j] += v;
        }
      }

      for (i=0; i<n; ++i) {
        M += R[i];
        R[i] /= n;
      }
      M /= m;

      for (i=0; i<n; ++i) {
        for (j=i; j<n; ++j) {
          A[i*n+j] += M - R[i] - R[j];
          A[j*n+i] = A[i*n+j];
        }
      }

      return A;
    };

    // Compute the Shannon entropy (log base 2) of an array of counts.
    stats.entropy = function(counts, f) {
      f = util.$(f);
      var i, p, s = 0, H = 0, n = counts.length;
      for (i=0; i<n; ++i) {
        s += (f ? f(counts[i]) : counts[i]);
      }
      if (s === 0) return 0;
      for (i=0; i<n; ++i) {
        p = (f ? f(counts[i]) : counts[i]) / s;
        if (p) H += p * Math.log(p);
      }
      return -H / Math.LN2;
    };

    // Compute the mutual information between two discrete variables.
    // Returns an array of the form [MI, MI_distance]
    // MI_distance is defined as 1 - I(a,b) / H(a,b).
    // http://en.wikipedia.org/wiki/Mutual_information
    stats.mutual = function(values, a, b, counts) {
      var x = counts ? values.map(util.$(a)) : values,
          y = counts ? values.map(util.$(b)) : a,
          z = counts ? values.map(util.$(counts)) : b;

      var px = {},
          py = {},
          n = z.length,
          s = 0, I = 0, H = 0, p, t, i;

      for (i=0; i<n; ++i) {
        px[x[i]] = 0;
        py[y[i]] = 0;
      }

      for (i=0; i<n; ++i) {
        px[x[i]] += z[i];
        py[y[i]] += z[i];
        s += z[i];
      }

      t = 1 / (s * Math.LN2);
      for (i=0; i<n; ++i) {
        if (z[i] === 0) continue;
        p = (s * z[i]) / (px[x[i]] * py[y[i]]);
        I += z[i] * t * Math.log(p);
        H += z[i] * t * Math.log(z[i]/s);
      }

      return [I, 1 + I/H];
    };

    // Compute the mutual information between two discrete variables.
    stats.mutual.info = function(values, a, b, counts) {
      return stats.mutual(values, a, b, counts)[0];
    };

    // Compute the mutual information distance between two discrete variables.
    // MI_distance is defined as 1 - I(a,b) / H(a,b).
    stats.mutual.dist = function(values, a, b, counts) {
      return stats.mutual(values, a, b, counts)[1];
    };

    // Compute a profile of summary statistics for a variable.
    stats.profile = function(values, f) {
      var mean = 0,
          valid = 0,
          missing = 0,
          distinct = 0,
          min = null,
          max = null,
          M2 = 0,
          vals = [],
          u = {}, delta, sd, i, v, x;

      // compute summary stats
      for (i=0; i<values.length; ++i) {
        v = f ? f(values[i]) : values[i];

        // update unique values
        u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);

        if (v == null) {
          ++missing;
        } else if (util.isValid(v)) {
          // update stats
          x = (typeof v === 'string') ? v.length : v;
          if (min===null || x < min) min = x;
          if (max===null || x > max) max = x;
          delta = x - mean;
          mean = mean + delta / (++valid);
          M2 = M2 + delta * (x - mean);
          vals.push(x);
        }
      }
      M2 = M2 / (valid - 1);
      sd = Math.sqrt(M2);

      // sort values for median and iqr
      vals.sort(util.cmp);

      return {
        type:     type_1(values, f),
        unique:   u,
        count:    values.length,
        valid:    valid,
        missing:  missing,
        distinct: distinct,
        min:      min,
        max:      max,
        mean:     mean,
        stdev:    sd,
        median:   (v = stats.quantile(vals, 0.5)),
        q1:       stats.quantile(vals, 0.25),
        q3:       stats.quantile(vals, 0.75),
        modeskew: sd === 0 ? 0 : (mean - v) / sd
      };
    };

    // Compute profiles for all variables in a data set.
    stats.summary = function(data, fields) {
      fields = fields || util.keys(data[0]);
      var s = fields.map(function(f) {
        var p = stats.profile(data, util.$(f));
        return (p.field = f, p);
      });
      return (s.__summary__ = true, s);
    };
    });
    var stats_2 = stats_1.summary;

    const dlBin = bins_1;
    /**
     * Build a Schema object.
     *
     * @param data - a set of raw data in the same format that Vega-Lite / Vega takes
     * Basically, it's an array in the form of:
     *
     * [
     *   {a: 1, b:2},
     *   {a: 2, b:3},
     *   ...
     * ]
     *
     * @return a Schema object
     */
    function build(data, opt = {}, tableSchema = { fields: [] }) {
        opt = util_5({}, DEFAULT_QUERY_CONFIG, opt);
        // create profiles for each variable
        let summaries = stats_2(data);
        let types = type_2(data); // inferAll does stronger type inference than summary
        let tableSchemaFieldIndex = tableSchema.fields.reduce((m, field) => {
            m[field.name] = field;
            return m;
        }, {});
        let fieldSchemas = summaries.map(function (fieldProfile, index) {
            const name = fieldProfile.field;
            // In Table schema, 'date' doesn't include time so use 'datetime'
            const type = types[name] === 'date' ? PrimitiveType.DATETIME : types[name];
            let distinct = fieldProfile.distinct;
            let vlType;
            if (type === PrimitiveType.NUMBER) {
                vlType = QUANTITATIVE;
            }
            else if (type === PrimitiveType.INTEGER) {
                // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
                if (distinct < opt.numberNominalLimit && distinct / fieldProfile.count < opt.numberNominalProportion) {
                    vlType = NOMINAL;
                }
                else {
                    vlType = QUANTITATIVE;
                }
            }
            else if (type === PrimitiveType.DATETIME) {
                vlType = TEMPORAL;
                // need to get correct min/max of date data because datalib's summary method does not
                // calculate this correctly for date types.
                fieldProfile.min = new Date(data[0][name]);
                fieldProfile.max = new Date(data[0][name]);
                for (const dataEntry of data) {
                    const time = new Date(dataEntry[name]).getTime();
                    if (time < fieldProfile.min.getTime()) {
                        fieldProfile.min = new Date(time);
                    }
                    if (time > fieldProfile.max.getTime()) {
                        fieldProfile.max = new Date(time);
                    }
                }
            }
            else {
                vlType = NOMINAL;
            }
            if (vlType === NOMINAL &&
                distinct / fieldProfile.count > opt.minPercentUniqueForKey &&
                fieldProfile.count > opt.minCardinalityForKey) {
                vlType = ExpandedType.KEY;
            }
            let fieldSchema = {
                name: name,
                // Need to keep original index for re-exporting TableSchema
                originalIndex: index,
                vlType: vlType,
                type: type,
                stats: fieldProfile,
                timeStats: {},
                binStats: {}
            };
            // extend field schema with table schema field - if present
            const orgFieldSchema = tableSchemaFieldIndex[fieldSchema.name];
            fieldSchema = util_5(fieldSchema, orgFieldSchema);
            return fieldSchema;
        });
        // calculate preset bins for quantitative and temporal data
        for (let fieldSchema of fieldSchemas) {
            if (fieldSchema.vlType === QUANTITATIVE) {
                for (let maxbins of opt.enum.binProps.maxbins) {
                    fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
                }
            }
            else if (fieldSchema.vlType === TEMPORAL) {
                for (let unit of opt.enum.timeUnit) {
                    if (unit !== undefined) {
                        fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
                    }
                }
            }
        }
        const derivedTableSchema = Object.assign({}, tableSchema, { fields: fieldSchemas });
        return new Schema(derivedTableSchema);
    }
    // order the field schema when we construct a new Schema
    // this orders the fields in the UI
    const order = {
        nominal: 0,
        key: 1,
        ordinal: 2,
        temporal: 3,
        quantitative: 4
    };
    class Schema {
        constructor(tableSchema) {
            this._tableSchema = tableSchema;
            tableSchema.fields.sort(function (a, b) {
                // first order by vlType: nominal < temporal < quantitative < ordinal
                if (order[a.vlType] < order[b.vlType]) {
                    return -1;
                }
                else if (order[a.vlType] > order[b.vlType]) {
                    return 1;
                }
                else {
                    // then order by field (alphabetically)
                    return a.name.localeCompare(b.name);
                }
            });
            // Add index for sorting
            tableSchema.fields.forEach((fieldSchema, index) => (fieldSchema.index = index));
            this._fieldSchemaIndex = tableSchema.fields.reduce((m, fieldSchema) => {
                m[fieldSchema.name] = fieldSchema;
                return m;
            }, {});
        }
        /** @return a list of the field names (for enumerating). */
        fieldNames() {
            return this._tableSchema.fields.map(fieldSchema => fieldSchema.name);
        }
        /** @return a list of FieldSchemas */
        get fieldSchemas() {
            return this._tableSchema.fields;
        }
        fieldSchema(fieldName) {
            return this._fieldSchemaIndex[fieldName];
        }
        tableSchema() {
            // the fieldschemas are re-arranged
            // but this is not allowed in table schema.
            // so we will re-order based on original index.
            const tableSchema = util_4(this._tableSchema);
            tableSchema.fields.sort((a, b) => a.originalIndex - b.originalIndex);
            return tableSchema;
        }
        /**
         * @return primitive type of the field if exist, otherwise return null
         */
        primitiveType(fieldName) {
            return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].type : null;
        }
        /**
         * @return vlType of measturement of the field if exist, otherwise return null
         */
        vlType(fieldName) {
            return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].vlType : null;
        }
        /** @return cardinality of the field associated with encQ, null if it doesn't exist.
         *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
         */
        cardinality(fieldQ, augmentTimeUnitDomain = true, excludeInvalid = false) {
            const fieldSchema = this._fieldSchemaIndex[fieldQ.field];
            if (fieldQ.aggregate || (isAutoCountQuery(fieldQ) && fieldQ.autoCount)) {
                return 1;
            }
            else if (fieldQ.bin) {
                // encQ.bin will either be a boolean or a BinQuery
                let bin;
                if (typeof fieldQ.bin === 'boolean') {
                    // autoMaxBins defaults to 10 if channel is Wildcard
                    bin = {
                        maxbins: autoMaxBins(fieldQ.channel)
                    };
                }
                else if (fieldQ.bin === '?') {
                    bin = {
                        enum: [true, false]
                    };
                }
                else {
                    bin = fieldQ.bin;
                }
                const maxbins = bin.maxbins;
                if (!fieldSchema.binStats[maxbins]) {
                    // need to calculate
                    fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
                }
                // don't need to worry about excludeInvalid here because invalid values don't affect linearly binned field's cardinality
                return fieldSchema.binStats[maxbins].distinct;
            }
            else if (fieldQ.timeUnit) {
                if (augmentTimeUnitDomain) {
                    switch (fieldQ.timeUnit) {
                        // TODO: this should not always be the case once Vega-Lite supports turning off domain augmenting (VL issue #1385)
                        case TimeUnit.SECONDS:
                            return 60;
                        case TimeUnit.MINUTES:
                            return 60;
                        case TimeUnit.HOURS:
                            return 24;
                        case TimeUnit.DAY:
                            return 7;
                        case TimeUnit.DATE:
                            return 31;
                        case TimeUnit.MONTH:
                            return 12;
                        case TimeUnit.QUARTER:
                            return 4;
                        case TimeUnit.MILLISECONDS:
                            return 1000;
                    }
                }
                let unit = fieldQ.timeUnit;
                let timeStats = fieldSchema.timeStats;
                // if the cardinality for the timeUnit is not cached, calculate it
                if (!timeStats || !timeStats[unit]) {
                    timeStats = Object.assign({}, timeStats, { [unit]: timeSummary(fieldQ.timeUnit, fieldSchema.stats) });
                }
                if (excludeInvalid) {
                    return timeStats[unit].distinct - invalidCount(timeStats[unit].unique, ['Invalid Date', null]);
                }
                else {
                    return timeStats[unit].distinct;
                }
            }
            else {
                if (fieldSchema) {
                    if (excludeInvalid) {
                        return fieldSchema.stats.distinct - invalidCount(fieldSchema.stats.unique, [NaN, null]);
                    }
                    else {
                        return fieldSchema.stats.distinct;
                    }
                }
                else {
                    return null;
                }
            }
        }
        /**
         * Given an EncodingQuery with a timeUnit, returns true if the date field
         * has multiple distinct values for all parts of the timeUnit. Returns undefined
         * if the timeUnit is undefined.
         * i.e.
         * ('yearmonth', [Jan 1 2000, Feb 2 2000] returns false)
         * ('yearmonth', [Jan 1 2000, Feb 2 2001] returns true)
         */
        timeUnitHasVariation(fieldQ) {
            if (!fieldQ.timeUnit) {
                return;
            }
            // if there is no variation in `date`, there should not be variation in `day`
            if (fieldQ.timeUnit === TimeUnit.DAY) {
                const dateEncQ = util_5({}, fieldQ, { timeUnit: TimeUnit.DATE });
                if (this.cardinality(dateEncQ, false, true) <= 1) {
                    return false;
                }
            }
            let fullTimeUnit = fieldQ.timeUnit;
            for (let timeUnitPart of TIMEUNIT_PARTS) {
                if (containsTimeUnit(fullTimeUnit, timeUnitPart)) {
                    // Create a clone of encQ, but with singleTimeUnit
                    const singleUnitEncQ = util_5({}, fieldQ, { timeUnit: timeUnitPart });
                    if (this.cardinality(singleUnitEncQ, false, true) <= 1) {
                        return false;
                    }
                }
            }
            return true;
        }
        domain(fieldQueryParts) {
            // TODO: differentiate for field with bin / timeUnit
            const fieldSchema = this._fieldSchemaIndex[fieldQueryParts.field];
            let domain = util_3(fieldSchema.stats.unique);
            if (fieldSchema.vlType === QUANTITATIVE) {
                // return [min, max], coerced into number types
                return [+fieldSchema.stats.min, +fieldSchema.stats.max];
            }
            else if (fieldSchema.type === PrimitiveType.DATETIME) {
                // return [min, max] dates
                return [fieldSchema.stats.min, fieldSchema.stats.max];
            }
            else if (fieldSchema.type === PrimitiveType.INTEGER || fieldSchema.type === PrimitiveType.NUMBER) {
                // coerce non-quantitative numerical data into number type
                domain = domain.map(x => +x);
                return domain.sort(util_2);
            }
            else if (fieldSchema.vlType === ORDINAL && fieldSchema.ordinalDomain) {
                return fieldSchema.ordinalDomain;
            }
            return domain
                .map(x => {
                // Convert 'null' to null as it is encoded similarly in datalib.
                // This is wrong when it is a string 'null' but that rarely happens.
                return x === 'null' ? null : x;
            })
                .sort(util_2);
        }
        /**
         * @return a Summary corresponding to the field of the given EncodingQuery
         */
        stats(fieldQ) {
            // TODO: differentiate for field with bin / timeUnit vs without
            const fieldSchema = this._fieldSchemaIndex[fieldQ.field];
            return fieldSchema ? fieldSchema.stats : null;
        }
    }
    /**
     * @return a summary of the binning scheme determined from the given max number of bins
     */
    function binSummary(maxbins, summary) {
        const bin = dlBin({
            min: summary.min,
            max: summary.max,
            maxbins: maxbins
        });
        // start with summary, pre-binning
        const result = util_5({}, summary);
        result.unique = binUnique(bin, summary.unique);
        result.distinct = (bin.stop - bin.start) / bin.step;
        result.min = bin.start;
        result.max = bin.stop;
        return result;
    }
    /** @return a modified version of the passed summary with unique and distinct set according to the timeunit.
     *  Maps 'null' (string) keys to the null value and invalid dates to 'Invalid Date' in the unique dictionary.
     */
    function timeSummary(timeunit, summary) {
        const result = util_5({}, summary);
        let unique = {};
        util_3(summary.unique).forEach(function (dateString) {
            // don't convert null value because the Date constructor will actually convert it to a date
            let date = dateString === 'null' ? null : new Date(dateString);
            // at this point, `date` is either the null value, a valid Date object, or "Invalid Date" which is a Date
            let key;
            if (date === null) {
                key = null;
            }
            else if (isNaN(date.getTime())) {
                key = 'Invalid Date';
            }
            else {
                key = (timeunit === TimeUnit.DAY ? date.getDay() : convert(timeunit, date)).toString();
            }
            unique[key] = (unique[key] || 0) + summary.unique[dateString];
        });
        result.unique = unique;
        result.distinct = util_3(unique).length;
        return result;
    }
    /**
     * @return a new unique object based off of the old unique count and a binning scheme
     */
    function binUnique(bin, oldUnique) {
        const newUnique = {};
        for (let value in oldUnique) {
            let bucket;
            if (value === null) {
                bucket = null;
            }
            else if (isNaN(Number(value))) {
                bucket = NaN;
            }
            else {
                bucket = bin.value(Number(value));
            }
            newUnique[bucket] = (newUnique[bucket] || 0) + oldUnique[value];
        }
        return newUnique;
    }
    /** @return the number of items in list that occur as keys of unique */
    function invalidCount(unique, list) {
        return list.reduce(function (prev, cur) {
            return unique[cur] ? prev + 1 : prev;
        }, 0);
    }
    var PrimitiveType;
    (function (PrimitiveType) {
        PrimitiveType[PrimitiveType["STRING"] = 'string'] = "STRING";
        PrimitiveType[PrimitiveType["NUMBER"] = 'number'] = "NUMBER";
        PrimitiveType[PrimitiveType["INTEGER"] = 'integer'] = "INTEGER";
        PrimitiveType[PrimitiveType["BOOLEAN"] = 'boolean'] = "BOOLEAN";
        PrimitiveType[PrimitiveType["DATETIME"] = 'datetime'] = "DATETIME";
    })(PrimitiveType || (PrimitiveType = {}));

    var schema = /*#__PURE__*/Object.freeze({
        build: build,
        Schema: Schema,
        get PrimitiveType () { return PrimitiveType; }
    });

    /**
     * Abstract model for a constraint.
     */
    class AbstractConstraintModel {
        constructor(constraint) {
            this.constraint = constraint;
        }
        name() {
            return this.constraint.name;
        }
        description() {
            return this.constraint.description;
        }
        properties() {
            return this.constraint.properties;
        }
        strict() {
            return this.constraint.strict;
        }
    }
    class EncodingConstraintModel extends AbstractConstraintModel {
        constructor(constraint) {
            super(constraint);
        }
        hasAllRequiredPropertiesSpecific(encQ) {
            return every(this.constraint.properties, (prop) => {
                if (isEncodingNestedProp(prop)) {
                    let parent = prop.parent;
                    let child = prop.child;
                    if (!encQ[parent]) {
                        return true;
                    }
                    return !isWildcard(encQ[parent][child]);
                }
                if (!encQ[prop]) {
                    return true;
                }
                return !isWildcard(encQ[prop]);
            });
        }
        satisfy(encQ, schema, encWildcardIndex, opt) {
            // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
            if (!this.constraint.allowWildcardForProperties) {
                // TODO: extract as a method and do unit test
                if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
                    return true;
                }
            }
            return this.constraint.satisfy(encQ, schema, encWildcardIndex, opt);
        }
    }

    const FIELD_CONSTRAINTS = [
        {
            name: 'aggregateOpSupportedByType',
            description: 'Aggregate function should be supported by data type.',
            properties: [Property.TYPE, Property.AGGREGATE],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ.aggregate) {
                    return !isDiscrete$1(fieldQ.type);
                }
                // TODO: some aggregate function are actually supported by ordinal
                return true; // no aggregate is okay with any type.
            }
        },
        {
            name: 'asteriskFieldWithCountOnly',
            description: 'Field="*" should be disallowed except aggregate="count"',
            properties: [Property.FIELD, Property.AGGREGATE],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                return (fieldQ.field === '*') === (fieldQ.aggregate === 'count');
            }
        },
        {
            name: 'minCardinalityForBin',
            description: 'binned quantitative field should not have too low cardinality',
            properties: [Property.BIN, Property.FIELD, Property.TYPE],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, schema, _, opt) => {
                if (fieldQ.bin && fieldQ.type === QUANTITATIVE) {
                    // We remove bin so schema can infer the raw unbinned cardinality.
                    let fieldQwithoutBin = {
                        channel: fieldQ.channel,
                        field: fieldQ.field,
                        type: fieldQ.type
                    };
                    return schema.cardinality(fieldQwithoutBin) >= opt.minCardinalityForBin;
                }
                return true;
            }
        },
        {
            name: 'binAppliedForQuantitative',
            description: 'bin should be applied to quantitative field only.',
            properties: [Property.TYPE, Property.BIN],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ.bin) {
                    // If binned, the type must be quantitative
                    return fieldQ.type === QUANTITATIVE;
                }
                return true;
            }
        },
        {
            name: 'channelFieldCompatible',
            description: `encoding channel's range type be compatible with channel type.`,
            properties: [Property.CHANNEL, Property.TYPE, Property.BIN, Property.TIMEUNIT],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
                const fieldDef = Object.assign({ field: 'f' }, toFieldDef(fieldQ, { schema, props: ['bin', 'timeUnit', 'type'] }));
                const { compatible } = channelCompatibility(fieldDef, fieldQ.channel);
                if (compatible) {
                    return true;
                }
                else {
                    // In VL, facet's field def must be discrete (O/N), but in CompassQL we can relax this a bit.
                    const isFacet = fieldQ.channel === 'row' || fieldQ.channel === 'column';
                    if (isFacet && (isLocalSingleTimeUnit(fieldDef.timeUnit) || isUtcSingleTimeUnit(fieldDef.timeUnit))) {
                        return true;
                    }
                    return false;
                }
            }
        },
        {
            name: 'hasFn',
            description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
            properties: [Property.AGGREGATE, Property.BIN, Property.TIMEUNIT],
            allowWildcardForProperties: true,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ.hasFn) {
                    return !!fieldQ.aggregate || !!fieldQ.bin || !!fieldQ.timeUnit;
                }
                return true;
            }
        },
        {
            name: 'omitScaleZeroWithBinnedField',
            description: 'Do not use scale zero with binned field',
            properties: [Property.SCALE, getEncodingNestedProp('scale', 'zero'), Property.BIN],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ.bin && fieldQ.scale) {
                    if (fieldQ.scale.zero === true) {
                        return false;
                    }
                }
                return true;
            }
        },
        {
            name: 'onlyOneTypeOfFunction',
            description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
            properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN],
            allowWildcardForProperties: true,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (isFieldQuery(fieldQ)) {
                    const numFn = (!isWildcard(fieldQ.aggregate) && !!fieldQ.aggregate ? 1 : 0) +
                        (!isWildcard(fieldQ.bin) && !!fieldQ.bin ? 1 : 0) +
                        (!isWildcard(fieldQ.timeUnit) && !!fieldQ.timeUnit ? 1 : 0);
                    return numFn <= 1;
                }
                // For autoCount there is always only one type of function
                return true;
            }
        },
        {
            name: 'timeUnitAppliedForTemporal',
            description: 'Time unit should be applied to temporal field only.',
            properties: [Property.TYPE, Property.TIMEUNIT],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ.timeUnit && fieldQ.type !== TEMPORAL) {
                    return false;
                }
                return true;
            }
        },
        {
            name: 'timeUnitShouldHaveVariation',
            description: 'A particular time unit should be applied only if they produce unique values.',
            properties: [Property.TIMEUNIT, Property.TYPE],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
                if (fieldQ.timeUnit && fieldQ.type === TEMPORAL) {
                    if (!encWildcardIndex.has('timeUnit') && !opt.constraintManuallySpecifiedValue) {
                        // Do not have to check this as this is manually specified by users.
                        return true;
                    }
                    return schema.timeUnitHasVariation(fieldQ);
                }
                return true;
            }
        },
        {
            name: 'scalePropertiesSupportedByScaleType',
            description: 'Scale properties must be supported by correct scale type',
            properties: [].concat(SCALE_PROPS, [Property.SCALE, Property.TYPE]),
            allowWildcardForProperties: true,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ.scale) {
                    const scale = fieldQ.scale;
                    //  If fieldQ.type is an Wildcard and scale.type is undefined, it is equivalent
                    //  to scale type is Wildcard. If scale type is an Wildcard, we do not yet know
                    //  what the scale type is, and thus can ignore the constraint.
                    const sType = scaleType$1(fieldQ);
                    if (sType === undefined || sType === null) {
                        // If still ambiguous, doesn't check the constraint
                        return true;
                    }
                    for (let scaleProp in scale) {
                        if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
                            // ignore type and properties of wildcards
                            continue;
                        }
                        const sProp = scaleProp;
                        if (sType === 'point') {
                            // HACK: our current implementation of scaleType() can return point
                            // when the scaleType is a band since we didn't pass all parameter to Vega-Lite's scale type method.
                            if (!scaleTypeSupportProperty('point', sProp) && !scaleTypeSupportProperty('band', sProp)) {
                                return false;
                            }
                        }
                        else if (!scaleTypeSupportProperty(sType, sProp)) {
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'scalePropertiesSupportedByChannel',
            description: 'Not all scale properties are supported by all encoding channels',
            properties: [].concat(SCALE_PROPS, [Property.SCALE, Property.CHANNEL]),
            allowWildcardForProperties: true,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ) {
                    let channel = fieldQ.channel;
                    let scale = fieldQ.scale;
                    if (channel && !isWildcard(channel) && scale) {
                        if (channel === 'row' || channel === 'column') {
                            // row / column do not have scale
                            return false;
                        }
                        for (let scaleProp in scale) {
                            if (!scale.hasOwnProperty(scaleProp))
                                continue;
                            if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
                                // ignore type and properties of wildcards
                                continue;
                            }
                            let isSupported = channelScalePropertyIncompatability(channel, scaleProp) === undefined;
                            if (!isSupported) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'typeMatchesPrimitiveType',
            description: "Data type should be supported by field's primitive type.",
            properties: [Property.FIELD, Property.TYPE],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
                if (fieldQ.field === '*') {
                    return true;
                }
                const primitiveType = schema.primitiveType(fieldQ.field);
                const type = fieldQ.type;
                if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
                    // Do not have to check this as this is manually specified by users.
                    return true;
                }
                switch (primitiveType) {
                    case PrimitiveType.BOOLEAN:
                    case PrimitiveType.STRING:
                        return type !== QUANTITATIVE && type !== TEMPORAL;
                    case PrimitiveType.NUMBER:
                    case PrimitiveType.INTEGER:
                        return type !== TEMPORAL;
                    case PrimitiveType.DATETIME:
                        // TODO: add NOMINAL, ORDINAL support after we support this in Vega-Lite
                        return type === TEMPORAL;
                    case null:
                        // field does not exist in the schema
                        return false;
                }
                throw new Error('Not implemented');
            }
        },
        {
            name: 'typeMatchesSchemaType',
            description: "Enumerated data type of a field should match the field's type in the schema.",
            properties: [Property.FIELD, Property.TYPE],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (fieldQ, schema, encWildcardIndex, opt) => {
                if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
                    // Do not have to check this as this is manually specified by users.
                    return true;
                }
                if (fieldQ.field === '*') {
                    return fieldQ.type === QUANTITATIVE;
                }
                return schema.vlType(fieldQ.field) === fieldQ.type;
            }
        },
        {
            name: 'maxCardinalityForCategoricalColor',
            description: 'Categorical channel should not have too high cardinality',
            properties: [Property.CHANNEL, Property.FIELD],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (fieldQ, schema, _, opt) => {
                // TODO: missing case where ordinal / temporal use categorical color
                // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
                if (fieldQ.channel === COLOR && (fieldQ.type === NOMINAL || fieldQ.type === ExpandedType.KEY)) {
                    return schema.cardinality(fieldQ) <= opt.maxCardinalityForCategoricalColor;
                }
                return true; // other channel is irrelevant to this constraint
            }
        },
        {
            name: 'maxCardinalityForFacet',
            description: 'Row/column channel should not have too high cardinality',
            properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (fieldQ, schema, _, opt) => {
                if (fieldQ.channel === ROW || fieldQ.channel === COLUMN) {
                    return schema.cardinality(fieldQ) <= opt.maxCardinalityForFacet;
                }
                return true; // other channel is irrelevant to this constraint
            }
        },
        {
            name: 'maxCardinalityForShape',
            description: 'Shape channel should not have too high cardinality',
            properties: [Property.CHANNEL, Property.FIELD, Property.BIN, Property.TIMEUNIT],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (fieldQ, schema, _, opt) => {
                if (fieldQ.channel === SHAPE) {
                    return schema.cardinality(fieldQ) <= opt.maxCardinalityForShape;
                }
                return true; // other channel is irrelevant to this constraint
            }
        },
        {
            name: 'dataTypeAndFunctionMatchScaleType',
            description: 'Scale type must match data type',
            properties: [
                Property.TYPE,
                Property.SCALE,
                getEncodingNestedProp('scale', 'type'),
                Property.TIMEUNIT,
                Property.BIN
            ],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (fieldQ.scale) {
                    const type = fieldQ.type;
                    const sType = scaleType$1(fieldQ);
                    if (isDiscrete$1(type)) {
                        return sType === undefined || hasDiscreteDomain(sType);
                    }
                    else if (type === TEMPORAL) {
                        if (!fieldQ.timeUnit) {
                            return contains$1([ScaleType.TIME, ScaleType.UTC, undefined], sType);
                        }
                        else {
                            return contains$1([ScaleType.TIME, ScaleType.UTC, undefined], sType) || hasDiscreteDomain(sType);
                        }
                    }
                    else if (type === QUANTITATIVE) {
                        if (fieldQ.bin) {
                            return contains$1([ScaleType.LINEAR, undefined], sType);
                        }
                        else {
                            return contains$1([
                                ScaleType.LOG,
                                ScaleType.POW,
                                ScaleType.SQRT,
                                ScaleType.QUANTILE,
                                ScaleType.QUANTIZE,
                                ScaleType.LINEAR,
                                undefined
                            ], sType);
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'stackIsOnlyUsedWithXY',
            description: 'stack should only be allowed for x and y channels',
            properties: [Property.STACK, Property.CHANNEL],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (fieldQ, _, __, ___) => {
                if (!!fieldQ.stack) {
                    return fieldQ.channel === X || fieldQ.channel === Y;
                }
                return true;
            }
        }
    ].map((ec) => new EncodingConstraintModel(ec));
    const FIELD_CONSTRAINT_INDEX = FIELD_CONSTRAINTS.reduce((m, ec) => {
        m[ec.name()] = ec;
        return m;
    }, {});
    const FIELD_CONSTRAINTS_BY_PROPERTY = FIELD_CONSTRAINTS.reduce((index, c) => {
        for (const prop of c.properties()) {
            // Initialize array and use it
            index.set(prop, index.get(prop) || []);
            index.get(prop).push(c);
        }
        return index;
    }, new PropIndex());

    const VALUE_CONSTRAINTS = [
        {
            name: 'doesNotSupportConstantValue',
            description: 'row, column, x, y, order, and detail should not work with constant values.',
            properties: [Property.TYPE, Property.AGGREGATE],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (valueQ, _, __, ___) => {
                return !(contains$1(['row', 'column', 'x', 'y', 'detail', 'order'], valueQ.channel));
            }
        }
    ].map((ec) => new EncodingConstraintModel(ec));
    const VALUE_CONSTRAINT_INDEX = VALUE_CONSTRAINTS.reduce((m, ec) => {
        m[ec.name()] = ec;
        return m;
    }, {});
    const VALUE_CONSTRAINTS_BY_PROPERTY = VALUE_CONSTRAINTS.reduce((index, c) => {
        for (const prop of c.properties()) {
            index.set(prop, index.get(prop) || []);
            index.get(prop).push(c);
        }
        return index;
    }, new PropIndex());

    /**
     * Check all encoding constraints for a particular property and index tuple
     */
    function checkEncoding(prop, wildcard, index, specM, schema, opt) {
        // Check encoding constraint
        const encodingConstraints = FIELD_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
        const encQ = specM.getEncodingQueryByIndex(index);
        for (const c of encodingConstraints) {
            // Check if the constraint is enabled
            if (c.strict() || !!opt[c.name()]) {
                // For strict constraint, or enabled non-strict, check the constraints
                const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
                if (!satisfy) {
                    let violatedConstraint = '(enc) ' + c.name();
                    /* istanbul ignore if */
                    if (opt.verbose) {
                        console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
                    }
                    return violatedConstraint;
                }
            }
        }
        const valueContraints = VALUE_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
        for (const c of valueContraints) {
            // Check if the constraint is enabled
            if ((c.strict() || !!opt[c.name()]) && isValueQuery(encQ)) {
                // For strict constraint, or enabled non-strict, check the constraints
                const satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
                if (!satisfy) {
                    let violatedConstraint = '(enc) ' + c.name();
                    /* istanbul ignore if */
                    if (opt.verbose) {
                        console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
                    }
                    return violatedConstraint;
                }
            }
        }
        return null;
    }

    var encoding$2 = /*#__PURE__*/Object.freeze({
        checkEncoding: checkEncoding
    });

    const NONPOSITION_CHANNELS_INDEX = NONPOSITION_CHANNELS.reduce((m, channel) => {
        m[channel] = true;
        return m;
    }, {});
    class SpecConstraintModel extends AbstractConstraintModel {
        constructor(specConstraint) {
            super(specConstraint);
        }
        hasAllRequiredPropertiesSpecific(specM) {
            return every(this.constraint.properties, prop => {
                if (prop === Property.MARK) {
                    return !isWildcard(specM.getMark());
                }
                // TODO: transform
                if (isEncodingNestedProp(prop)) {
                    let parent = prop.parent;
                    let child = prop.child;
                    return every(specM.getEncodings(), encQ => {
                        if (!encQ[parent]) {
                            return true;
                        }
                        return !isWildcard(encQ[parent][child]);
                    });
                }
                if (!isEncodingProperty(prop)) {
                    throw new Error('UNIMPLEMENTED');
                }
                return every(specM.getEncodings(), encQ => {
                    if (!encQ[prop]) {
                        return true;
                    }
                    return !isWildcard(encQ[prop]);
                });
            });
        }
        satisfy(specM, schema, opt) {
            // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
            if (!this.constraint.allowWildcardForProperties) {
                if (!this.hasAllRequiredPropertiesSpecific(specM)) {
                    return true;
                }
            }
            return this.constraint.satisfy(specM, schema, opt);
        }
    }
    const SPEC_CONSTRAINTS = [
        {
            name: 'noRepeatedChannel',
            description: 'Each encoding channel should only be used once.',
            properties: [Property.CHANNEL],
            allowWildcardForProperties: true,
            strict: true,
            satisfy: (specM, _, __) => {
                let usedChannel = {};
                // channel for all encodings should be valid
                return every(specM.getEncodings(), encQ => {
                    if (!isWildcard(encQ.channel)) {
                        // If channel is specified, it should no be used already
                        if (usedChannel[encQ.channel]) {
                            return false;
                        }
                        usedChannel[encQ.channel] = true;
                        return true;
                    }
                    return true; // unspecified channel is valid
                });
            }
        },
        {
            name: 'alwaysIncludeZeroInScaleWithBarMark',
            description: 'Do not recommend bar mark if scale does not start at zero',
            properties: [
                Property.MARK,
                Property.SCALE,
                getEncodingNestedProp('scale', 'zero'),
                Property.CHANNEL,
                Property.TYPE
            ],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (specM, _, __) => {
                const mark = specM.getMark();
                const encodings = specM.getEncodings();
                if (mark === BAR) {
                    for (let encQ of encodings) {
                        if (isFieldQuery(encQ) &&
                            (encQ.channel === X || encQ.channel === Y) &&
                            encQ.type === QUANTITATIVE &&
                            (encQ.scale && encQ.scale.zero === false)) {
                            // TODO: zero shouldn't be manually specified
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'autoAddCount',
            description: 'Automatically adding count only for plots with only ordinal, binned quantitative, or temporal with timeunit fields.',
            properties: [Property.BIN, Property.TIMEUNIT, Property.TYPE, Property.AUTOCOUNT],
            allowWildcardForProperties: true,
            strict: false,
            satisfy: (specM, _, __) => {
                const hasAutoCount = some$1(specM.getEncodings(), (encQ) => isEnabledAutoCountQuery(encQ));
                if (hasAutoCount) {
                    // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
                    return every(specM.getEncodings(), (encQ) => {
                        if (isValueQuery(encQ)) {
                            return true;
                        }
                        if (isAutoCountQuery(encQ)) {
                            return true;
                        }
                        switch (encQ.type) {
                            case QUANTITATIVE:
                                return !!encQ.bin;
                            case TEMPORAL:
                                return !!encQ.timeUnit;
                            case ORDINAL:
                            case ExpandedType.KEY:
                            case NOMINAL:
                                return true;
                        }
                        /* istanbul ignore next */
                        throw new Error('Unsupported Type');
                    });
                }
                else {
                    const autoCountEncIndex = specM.wildcardIndex.encodingIndicesByProperty.get('autoCount') || [];
                    const neverHaveAutoCount = every(autoCountEncIndex, (index) => {
                        let encQ = specM.getEncodingQueryByIndex(index);
                        return isAutoCountQuery(encQ) && !isWildcard(encQ.autoCount);
                    });
                    if (neverHaveAutoCount) {
                        // If the query surely does not have autoCount
                        // then one of the field should be
                        // (1) unbinned quantitative
                        // (2) temporal without time unit
                        // (3) nominal or ordinal field
                        // or at least have potential to be (still ambiguous).
                        return some$1(specM.getEncodings(), (encQ) => {
                            if ((isFieldQuery(encQ) || isAutoCountQuery(encQ)) && encQ.type === QUANTITATIVE) {
                                if (isDisabledAutoCountQuery(encQ)) {
                                    return false;
                                }
                                else {
                                    return isFieldQuery(encQ) && (!encQ.bin || isWildcard(encQ.bin));
                                }
                            }
                            else if (isFieldQuery(encQ) && encQ.type === TEMPORAL) {
                                return !encQ.timeUnit || isWildcard(encQ.timeUnit);
                            }
                            return false; // nominal or ordinal
                        });
                    }
                }
                return true; // no auto count, no constraint
            }
        },
        {
            name: 'channelPermittedByMarkType',
            description: 'Each encoding channel should be supported by the mark type',
            properties: [Property.CHANNEL, Property.MARK],
            allowWildcardForProperties: true,
            strict: true,
            satisfy: (specM, _, __) => {
                const mark = specM.getMark();
                // if mark is unspecified, no need to check
                if (isWildcard(mark))
                    return true;
                // TODO: can optimize this to detect only what's the changed property if needed.
                return every(specM.getEncodings(), encQ => {
                    // channel unspecified, no need to check
                    if (isWildcard(encQ.channel))
                        return true;
                    return !!supportMark(encQ.channel, mark);
                });
            }
        },
        {
            name: 'hasAllRequiredChannelsForMark',
            description: 'All required channels for the specified mark should be specified',
            properties: [Property.CHANNEL, Property.MARK],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (specM, _, __) => {
                const mark = specM.getMark();
                switch (mark) {
                    case AREA:
                    case LINE:
                        return specM.channelUsed(X) && specM.channelUsed(Y);
                    case TEXT$1:
                        return specM.channelUsed(TEXT);
                    case BAR:
                    case CIRCLE:
                    case SQUARE:
                    case TICK:
                    case RULE:
                    case RECT:
                        return specM.channelUsed(X) || specM.channelUsed(Y);
                    case POINT:
                        // This allows generating a point plot if channel was not a wildcard.
                        return (!specM.wildcardIndex.hasProperty(Property.CHANNEL) ||
                            specM.channelUsed(X) ||
                            specM.channelUsed(Y));
                }
                /* istanbul ignore next */
                throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + JSON.stringify(mark));
            }
        },
        {
            name: 'omitAggregate',
            description: 'Omit aggregate plots.',
            properties: [Property.AGGREGATE, Property.AUTOCOUNT],
            allowWildcardForProperties: true,
            strict: false,
            satisfy: (specM, _, __) => {
                if (specM.isAggregate()) {
                    return false;
                }
                return true;
            }
        },
        {
            name: 'omitAggregatePlotWithDimensionOnlyOnFacet',
            description: 'Omit aggregate plots with dimensions only on facets as that leads to inefficient use of space.',
            properties: [Property.CHANNEL, Property.AGGREGATE, Property.AUTOCOUNT],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (specM, _, opt) => {
                if (specM.isAggregate()) {
                    let hasNonFacetDim = false, hasDim = false, hasEnumeratedFacetDim = false;
                    specM.specQuery.encodings.forEach((encQ, index) => {
                        if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ))
                            return; // skip unused field
                        // FieldQuery & !encQ.aggregate
                        if (isFieldQuery(encQ) && !encQ.aggregate) {
                            // isDimension
                            hasDim = true;
                            if (contains$1([ROW, COLUMN], encQ.channel)) {
                                if (specM.wildcardIndex.hasEncodingProperty(index, Property.CHANNEL)) {
                                    hasEnumeratedFacetDim = true;
                                }
                            }
                            else {
                                hasNonFacetDim = true;
                            }
                        }
                    });
                    if (hasDim && !hasNonFacetDim) {
                        if (hasEnumeratedFacetDim || opt.constraintManuallySpecifiedValue) {
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'omitAggregatePlotWithoutDimension',
            description: 'Aggregate plots without dimension should be omitted',
            properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.BIN, Property.TIMEUNIT, Property.TYPE],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (specM, _, __) => {
                if (specM.isAggregate()) {
                    // TODO relax
                    return some$1(specM.getEncodings(), (encQ) => {
                        if (isDimension(encQ) || (isFieldQuery(encQ) && encQ.type === 'temporal')) {
                            return true;
                        }
                        return false;
                    });
                }
                return true;
            }
        },
        {
            // TODO: we can be smarter and check if bar has occlusion based on profiling statistics
            name: 'omitBarLineAreaWithOcclusion',
            description: "Don't use bar, line or area to visualize raw plot as they often lead to occlusion.",
            properties: [Property.MARK, Property.AGGREGATE, Property.AUTOCOUNT],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (specM, _, __) => {
                if (contains$1([BAR, LINE, AREA], specM.getMark())) {
                    return specM.isAggregate();
                }
                return true;
            }
        },
        {
            name: 'omitBarTickWithSize',
            description: 'Do not map field to size channel with bar and tick mark',
            properties: [Property.CHANNEL, Property.MARK],
            allowWildcardForProperties: true,
            strict: false,
            satisfy: (specM, _, opt) => {
                const mark = specM.getMark();
                if (contains$1([TICK, BAR], mark)) {
                    if (specM.channelEncodingField(SIZE)) {
                        if (opt.constraintManuallySpecifiedValue) {
                            // If size is used and we constraintManuallySpecifiedValue,
                            // then the spec violates this constraint.
                            return false;
                        }
                        else {
                            // Otherwise have to search for the size channel and check if it is enumerated
                            const encodings = specM.specQuery.encodings;
                            for (let i = 0; i < encodings.length; i++) {
                                const encQ = encodings[i];
                                if (encQ.channel === SIZE) {
                                    if (specM.wildcardIndex.hasEncodingProperty(i, Property.CHANNEL)) {
                                        // If enumerated, then this is bad
                                        return false;
                                    }
                                    else {
                                        // If it's manually specified, no need to continue searching, just return.
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
                return true; // skip
            }
        },
        {
            name: 'omitBarAreaForLogScale',
            description: "Do not use bar and area mark for x and y's log scale",
            properties: [
                Property.MARK,
                Property.CHANNEL,
                Property.SCALE,
                getEncodingNestedProp('scale', 'type'),
                Property.TYPE
            ],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (specM, _, __) => {
                const mark = specM.getMark();
                const encodings = specM.getEncodings();
                // TODO: mark or scale type should be enumerated
                if (mark === AREA || mark === BAR) {
                    for (let encQ of encodings) {
                        if (isFieldQuery(encQ) && ((encQ.channel === X || encQ.channel === Y) && encQ.scale)) {
                            let sType = scaleType$1(encQ);
                            if (sType === ScaleType.LOG) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'omitMultipleNonPositionalChannels',
            description: 'Unless manually specified, do not use multiple non-positional encoding channel to avoid over-encoding.',
            properties: [Property.CHANNEL],
            allowWildcardForProperties: true,
            strict: false,
            satisfy: (specM, _, opt) => {
                // have to use specM.specQuery.encodings insetad of specM.getEncodings()
                // since specM.getEncodings() remove encQ with autoCount===false from the array
                // and thus might shift the index
                const encodings = specM.specQuery.encodings;
                let nonPositionChannelCount = 0;
                let hasEnumeratedNonPositionChannel = false;
                for (let i = 0; i < encodings.length; i++) {
                    const encQ = encodings[i];
                    if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ)) {
                        continue; // ignore skipped encoding
                    }
                    const channel = encQ.channel;
                    if (!isWildcard(channel)) {
                        if (NONPOSITION_CHANNELS_INDEX[channel + '']) {
                            nonPositionChannelCount += 1;
                            if (specM.wildcardIndex.hasEncodingProperty(i, Property.CHANNEL)) {
                                hasEnumeratedNonPositionChannel = true;
                            }
                            if (nonPositionChannelCount > 1 &&
                                (hasEnumeratedNonPositionChannel || opt.constraintManuallySpecifiedValue)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'omitNonPositionalOrFacetOverPositionalChannels',
            description: 'Do not use non-positional channels unless all positional channels are used',
            properties: [Property.CHANNEL],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (specM, _, opt) => {
                const encodings = specM.specQuery.encodings;
                let hasNonPositionalChannelOrFacet = false;
                let hasEnumeratedNonPositionOrFacetChannel = false;
                let hasX = false, hasY = false;
                for (let i = 0; i < encodings.length; i++) {
                    const encQ = encodings[i];
                    if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ)) {
                        continue; // ignore skipped encoding
                    }
                    const channel = encQ.channel;
                    if (channel === X) {
                        hasX = true;
                    }
                    else if (channel === Y) {
                        hasY = true;
                    }
                    else if (!isWildcard(channel)) {
                        // All non positional channel / Facet
                        hasNonPositionalChannelOrFacet = true;
                        if (specM.wildcardIndex.hasEncodingProperty(i, Property.CHANNEL)) {
                            hasEnumeratedNonPositionOrFacetChannel = true;
                        }
                    }
                }
                if (hasEnumeratedNonPositionOrFacetChannel ||
                    (opt.constraintManuallySpecifiedValue && hasNonPositionalChannelOrFacet)) {
                    return hasX && hasY;
                }
                return true;
            }
        },
        {
            name: 'omitRaw',
            description: 'Omit raw plots.',
            properties: [Property.AGGREGATE, Property.AUTOCOUNT],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (specM, _, __) => {
                if (!specM.isAggregate()) {
                    return false;
                }
                return true;
            }
        },
        {
            name: 'omitRawContinuousFieldForAggregatePlot',
            description: 'Aggregate plot should not use raw continuous field as group by values. ' +
                '(Quantitative should be binned. Temporal should have time unit.)',
            properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN, Property.TYPE],
            allowWildcardForProperties: true,
            strict: false,
            satisfy: (specM, _, opt) => {
                if (specM.isAggregate()) {
                    const encodings = specM.specQuery.encodings;
                    for (let i = 0; i < encodings.length; i++) {
                        const encQ = encodings[i];
                        if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ))
                            continue; // skip unused encoding
                        // TODO: aggregate for ordinal and temporal
                        if (isFieldQuery(encQ) && encQ.type === TEMPORAL) {
                            // Temporal fields should have timeUnit or is still a wildcard
                            if (!encQ.timeUnit &&
                                (specM.wildcardIndex.hasEncodingProperty(i, Property.TIMEUNIT) || opt.constraintManuallySpecifiedValue)) {
                                return false;
                            }
                        }
                        if (encQ.type === QUANTITATIVE) {
                            if (isFieldQuery(encQ) && !encQ.bin && !encQ.aggregate) {
                                // If Raw Q
                                if (specM.wildcardIndex.hasEncodingProperty(i, Property.BIN) ||
                                    specM.wildcardIndex.hasEncodingProperty(i, Property.AGGREGATE) ||
                                    specM.wildcardIndex.hasEncodingProperty(i, Property.AUTOCOUNT)) {
                                    // and it's raw from enumeration
                                    return false;
                                }
                                if (opt.constraintManuallySpecifiedValue) {
                                    // or if we constraintManuallySpecifiedValue
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            }
        },
        {
            name: 'omitRawDetail',
            description: 'Do not use detail channel with raw plot.',
            properties: [Property.CHANNEL, Property.AGGREGATE, Property.AUTOCOUNT],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (specM, _, opt) => {
                if (specM.isAggregate()) {
                    return true;
                }
                return every(specM.specQuery.encodings, (encQ, index) => {
                    if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ))
                        return true; // ignore autoCount field
                    if (encQ.channel === DETAIL) {
                        // Detail channel for raw plot is not good, except when its enumerated
                        // or when it's manually specified but we constraintManuallySpecifiedValue.
                        if (specM.wildcardIndex.hasEncodingProperty(index, Property.CHANNEL) ||
                            opt.constraintManuallySpecifiedValue) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        },
        {
            name: 'omitRepeatedField',
            description: 'Each field should be mapped to only one channel',
            properties: [Property.FIELD],
            allowWildcardForProperties: true,
            strict: false,
            satisfy: (specM, _, opt) => {
                let fieldUsed = {};
                let fieldEnumerated = {};
                const encodings = specM.specQuery.encodings;
                for (let i = 0; i < encodings.length; i++) {
                    const encQ = encodings[i];
                    if (isValueQuery(encQ) || isAutoCountQuery(encQ))
                        continue;
                    let field;
                    if (encQ.field && !isWildcard(encQ.field)) {
                        field = encQ.field;
                    }
                    if (isAutoCountQuery(encQ) && !isWildcard(encQ.autoCount)) {
                        field = 'count_*';
                    }
                    if (field) {
                        if (specM.wildcardIndex.hasEncodingProperty(i, Property.FIELD)) {
                            fieldEnumerated[field] = true;
                        }
                        // When the field is specified previously,
                        // if it is enumerated (either previously or in this encQ)
                        // or if the opt.constraintManuallySpecifiedValue is true,
                        // then it violates the constraint.
                        if (fieldUsed[field]) {
                            if (fieldEnumerated[field] || opt.constraintManuallySpecifiedValue) {
                                return false;
                            }
                        }
                        fieldUsed[field] = true;
                    }
                }
                return true;
            }
        },
        // TODO: omitShapeWithBin
        {
            name: 'omitVerticalDotPlot',
            description: 'Do not output vertical dot plot.',
            properties: [Property.CHANNEL],
            allowWildcardForProperties: true,
            strict: false,
            satisfy: (specM, _, __) => {
                const encodings = specM.getEncodings();
                if (encodings.length === 1 && encodings[0].channel === Y) {
                    return false;
                }
                return true;
            }
        },
        // EXPENSIVE CONSTRAINTS -- check them later!
        {
            name: 'hasAppropriateGraphicTypeForMark',
            description: 'Has appropriate graphic type for mark',
            properties: [
                Property.CHANNEL,
                Property.MARK,
                Property.TYPE,
                Property.TIMEUNIT,
                Property.BIN,
                Property.AGGREGATE,
                Property.AUTOCOUNT
            ],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (specM, _, __) => {
                const mark = specM.getMark();
                switch (mark) {
                    case AREA:
                    case LINE:
                        if (specM.isAggregate()) {
                            // TODO: refactor based on profiling statistics
                            const xEncQ = specM.getEncodingQueryByChannel(X);
                            const yEncQ = specM.getEncodingQueryByChannel(Y);
                            const xIsMeasure = isMeasure(xEncQ);
                            const yIsMeasure = isMeasure(yEncQ);
                            // for aggregate line / area, we need at least one group-by axis and one measure axis.
                            return (xEncQ &&
                                yEncQ &&
                                xIsMeasure !== yIsMeasure &&
                                // and the dimension axis should not be nominal
                                // TODO: make this clause optional
                                !(isFieldQuery(xEncQ) && !xIsMeasure && contains$1(['nominal', 'key'], xEncQ.type)) &&
                                !(isFieldQuery(yEncQ) && !yIsMeasure && contains$1(['nominal', 'key'], yEncQ.type)));
                            // TODO: allow connected scatterplot
                        }
                        return true;
                    case TEXT$1:
                        // FIXME correctly when we add text
                        return true;
                    case BAR:
                    case TICK:
                        // Bar and tick should not use size.
                        if (specM.channelEncodingField(SIZE)) {
                            return false;
                        }
                        else {
                            // Tick and Bar should have one and only one measure
                            const xEncQ = specM.getEncodingQueryByChannel(X);
                            const yEncQ = specM.getEncodingQueryByChannel(Y);
                            const xIsMeasure = isMeasure(xEncQ);
                            const yIsMeasure = isMeasure(yEncQ);
                            if (xIsMeasure !== yIsMeasure) {
                                return true;
                            }
                            return false;
                        }
                    case RECT:
                        // Until CompassQL supports layering, it only makes sense for
                        // rect to encode DxD or 1xD (otherwise just use bar).
                        // Furthermore, color should only be used in a 'heatmap' fashion
                        // (with a measure field).
                        const xEncQ = specM.getEncodingQueryByChannel(X);
                        const yEncQ = specM.getEncodingQueryByChannel(Y);
                        const xIsDimension = isDimension(xEncQ);
                        const yIsDimension = isDimension(yEncQ);
                        const colorEncQ = specM.getEncodingQueryByChannel(COLOR);
                        const colorIsQuantitative = isMeasure(colorEncQ);
                        const colorIsOrdinal = isFieldQuery(colorEncQ) ? colorEncQ.type === ORDINAL : false;
                        const correctChannels = (xIsDimension && yIsDimension) ||
                            (xIsDimension && !specM.channelUsed(Y)) ||
                            (yIsDimension && !specM.channelUsed(X));
                        const correctColor = !colorEncQ || (colorEncQ && (colorIsQuantitative || colorIsOrdinal));
                        return correctChannels && correctColor;
                    case CIRCLE:
                    case POINT:
                    case SQUARE:
                    case RULE:
                        return true;
                }
                /* istanbul ignore next */
                throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
            }
        },
        {
            name: 'omitInvalidStackSpec',
            description: 'If stack is specified, must follow Vega-Lite stack rules',
            properties: [
                Property.STACK,
                Property.FIELD,
                Property.CHANNEL,
                Property.MARK,
                Property.AGGREGATE,
                Property.AUTOCOUNT,
                Property.SCALE,
                getEncodingNestedProp('scale', 'type'),
                Property.TYPE
            ],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (specM, _, __) => {
                if (!specM.wildcardIndex.hasProperty(Property.STACK)) {
                    return true;
                }
                const stackProps = specM.getVlStack();
                if (stackProps === null && specM.getStackOffset() !== null) {
                    return false;
                }
                if (stackProps.fieldChannel !== specM.getStackChannel()) {
                    return false;
                }
                return true;
            }
        },
        {
            name: 'omitNonSumStack',
            description: 'Stack specifications that use non-summative aggregates should be omitted (even implicit ones)',
            properties: [
                Property.CHANNEL,
                Property.MARK,
                Property.AGGREGATE,
                Property.AUTOCOUNT,
                Property.SCALE,
                getEncodingNestedProp('scale', 'type'),
                Property.TYPE
            ],
            allowWildcardForProperties: false,
            strict: true,
            satisfy: (specM, _, __) => {
                const specStack = specM.getVlStack();
                if (specStack != null) {
                    const stackParentEncQ = specM.getEncodingQueryByChannel(specStack.fieldChannel);
                    if (!contains$1(SUM_OPS, stackParentEncQ.aggregate)) {
                        return false;
                    }
                }
                return true;
            }
        },
        {
            name: 'omitTableWithOcclusionIfAutoAddCount',
            description: 'Plots without aggregation or autocount where x and y are both discrete should be omitted if autoAddCount is enabled as they often lead to occlusion',
            properties: [
                Property.CHANNEL,
                Property.TYPE,
                Property.TIMEUNIT,
                Property.BIN,
                Property.AGGREGATE,
                Property.AUTOCOUNT
            ],
            allowWildcardForProperties: false,
            strict: false,
            satisfy: (specM, _, opt) => {
                if (opt.autoAddCount) {
                    const xEncQ = specM.getEncodingQueryByChannel('x');
                    const yEncQ = specM.getEncodingQueryByChannel('y');
                    if ((!isFieldQuery(xEncQ) || isDimension(xEncQ)) && (!isFieldQuery(yEncQ) || isDimension(yEncQ))) {
                        if (!specM.isAggregate()) {
                            return false;
                        }
                        else {
                            return every(specM.getEncodings(), encQ => {
                                let channel = encQ.channel;
                                if (channel !== X &&
                                    channel !== Y &&
                                    channel !== ROW &&
                                    channel !== COLUMN) {
                                    // Non-position fields should not be unaggreated fields
                                    if (isFieldQuery(encQ) && !encQ.aggregate) {
                                        return false;
                                    }
                                }
                                return true;
                            });
                        }
                    }
                }
                return true;
            }
        }
    ].map(sc => new SpecConstraintModel(sc));
    // For testing
    const SPEC_CONSTRAINT_INDEX = SPEC_CONSTRAINTS.reduce((m, c) => {
        m[c.name()] = c;
        return m;
    }, {});
    const SPEC_CONSTRAINTS_BY_PROPERTY = SPEC_CONSTRAINTS.reduce((index, c) => {
        for (const prop of c.properties()) {
            // Initialize array and use it
            index.set(prop, index.get(prop) || []);
            index.get(prop).push(c);
        }
        return index;
    }, new PropIndex());
    /**
     * Check all encoding constraints for a particular property and index tuple
     */
    function checkSpec(prop, wildcard, specM, schema, opt) {
        // Check encoding constraint
        const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
        for (const c of specConstraints) {
            // Check if the constraint is enabled
            if (c.strict() || !!opt[c.name()]) {
                // For strict constraint, or enabled non-strict, check the constraints
                const satisfy = c.satisfy(specM, schema, opt);
                if (!satisfy) {
                    let violatedConstraint = '(spec) ' + c.name();
                    /* istanbul ignore if */
                    if (opt.verbose) {
                        console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
                    }
                    return violatedConstraint;
                }
            }
        }
        return null;
    }

    var spec$2 = /*#__PURE__*/Object.freeze({
        SpecConstraintModel: SpecConstraintModel,
        SPEC_CONSTRAINTS: SPEC_CONSTRAINTS,
        SPEC_CONSTRAINT_INDEX: SPEC_CONSTRAINT_INDEX,
        checkSpec: checkSpec
    });



    var index$1 = /*#__PURE__*/Object.freeze({
        encoding: encoding$2,
        spec: spec$2
    });

    const ENUMERATOR_INDEX = new PropIndex();
    function getEnumerator(prop) {
        return ENUMERATOR_INDEX.get(prop);
    }
    ENUMERATOR_INDEX.set('mark', (wildcardIndex, schema, opt) => {
        return (answerSet, specM) => {
            const markWildcard = specM.getMark();
            // enumerate the value
            markWildcard.enum.forEach((mark) => {
                specM.setMark(mark);
                // Check spec constraint
                const violatedSpecConstraint = checkSpec('mark', wildcardIndex.mark, specM, schema, opt);
                if (!violatedSpecConstraint) {
                    // emit
                    answerSet.push(specM.duplicate());
                }
            });
            // Reset to avoid side effect
            specM.resetMark();
            return answerSet;
        };
    });
    ENCODING_TOPLEVEL_PROPS.forEach((prop) => {
        ENUMERATOR_INDEX.set(prop, EncodingPropertyGeneratorFactory(prop));
    });
    ENCODING_NESTED_PROPS.forEach((nestedProp) => {
        ENUMERATOR_INDEX.set(nestedProp, EncodingPropertyGeneratorFactory(nestedProp));
    });
    /**
     * @param prop property type.
     * @return an answer set reducer factory for the given prop.
     */
    function EncodingPropertyGeneratorFactory(prop) {
        /**
         * @return as reducer that takes a specQueryModel as input and output an answer set array.
         */
        return (wildcardIndex, schema, opt) => {
            return (answerSet, specM) => {
                // index of encoding mappings that require enumeration
                const indices = wildcardIndex.encodingIndicesByProperty.get(prop);
                function enumerate(jobIndex) {
                    if (jobIndex === indices.length) {
                        // emit and terminate
                        answerSet.push(specM.duplicate());
                        return;
                    }
                    const index = indices[jobIndex];
                    const wildcard = wildcardIndex.encodings[index].get(prop);
                    const encQ = specM.getEncodingQueryByIndex(index);
                    const propWildcard = specM.getEncodingProperty(index, prop);
                    if (isValueQuery(encQ) || (
                    // TODO: encQ.exclude
                    // If this encoding query is an excluded autoCount, there is no point enumerating other properties
                    // for this encoding query because they will be excluded anyway.
                    // Thus, we can just move on to the next encoding to enumerate.
                    (isDisabledAutoCountQuery(encQ)) ||
                        // nested encoding property might have its parent set to false
                        // therefore, we no longer have to enumerate them
                        !propWildcard)) { // TODO: encQ.excluded
                        enumerate(jobIndex + 1);
                    }
                    else {
                        wildcard.enum.forEach((propVal) => {
                            if (propVal === null) {
                                // our duplicate() method use JSON.stringify, parse and thus can accidentally
                                // convert undefined in an array into null
                                propVal = undefined;
                            }
                            specM.setEncodingProperty(index, prop, propVal, wildcard);
                            // Check encoding constraint
                            const violatedEncodingConstraint = checkEncoding(prop, wildcard, index, specM, schema, opt);
                            if (violatedEncodingConstraint) {
                                return; // do not keep searching
                            }
                            // Check spec constraint
                            const violatedSpecConstraint = checkSpec(prop, wildcard, specM, schema, opt);
                            if (violatedSpecConstraint) {
                                return; // do not keep searching
                            }
                            // If qualify all of the constraints, keep enumerating
                            enumerate(jobIndex + 1);
                        });
                        // Reset to avoid side effect
                        specM.resetEncodingProperty(index, prop, wildcard);
                    }
                }
                // start enumerating from 0
                enumerate(0);
                return answerSet;
            };
        };
    }

    var enumerator = /*#__PURE__*/Object.freeze({
        getEnumerator: getEnumerator,
        EncodingPropertyGeneratorFactory: EncodingPropertyGeneratorFactory
    });

    const REPLACE_BLANK_FIELDS = { '*': '' };
    const REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
    const REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
    const REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
    function isExtendedGroupBy(g) {
        return util_6(g) && !!g['property'];
    }
    function parseGroupBy(groupBy, include, replaceIndex) {
        include = include || new PropIndex();
        replaceIndex = replaceIndex || new PropIndex();
        groupBy.forEach((grpBy) => {
            if (isExtendedGroupBy(grpBy)) {
                include.setByKey(grpBy.property, true);
                replaceIndex.setByKey(grpBy.property, grpBy.replace);
            }
            else {
                include.setByKey(grpBy, true);
            }
        });
        return {
            include: include,
            replaceIndex: replaceIndex,
            replacer: getReplacerIndex(replaceIndex)
        };
    }
    function toString(groupBy) {
        if (util_1(groupBy)) {
            return groupBy.map((g) => {
                if (isExtendedGroupBy(g)) {
                    if (g.replace) {
                        let replaceIndex = util_3(g.replace).reduce((index, valFrom) => {
                            const valTo = g.replace[valFrom];
                            (index[valTo] = index[valTo] || []).push(valFrom);
                            return index;
                        }, {});
                        return g.property + '[' + util_3(replaceIndex).map((valTo) => {
                            const valsFrom = replaceIndex[valTo].sort();
                            return valsFrom.join(',') + '=>' + valTo;
                        }).join(';') + ']';
                    }
                    return g.property;
                }
                return g;
            }).join(',');
        }
        else {
            return groupBy;
        }
    }
    const GROUP_BY_FIELD_TRANSFORM = [
        Property.FIELD, Property.TYPE,
        Property.AGGREGATE, Property.BIN, Property.TIMEUNIT, Property.STACK
    ];
    const GROUP_BY_ENCODING = GROUP_BY_FIELD_TRANSFORM.concat([
        {
            property: Property.CHANNEL,
            replace: {
                'x': 'xy', 'y': 'xy',
                'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
                'row': 'facet', 'column': 'facet'
            }
        }
    ]);

    var groupby = /*#__PURE__*/Object.freeze({
        REPLACE_BLANK_FIELDS: REPLACE_BLANK_FIELDS,
        REPLACE_XY_CHANNELS: REPLACE_XY_CHANNELS,
        REPLACE_FACET_CHANNELS: REPLACE_FACET_CHANNELS,
        REPLACE_MARK_STYLE_CHANNELS: REPLACE_MARK_STYLE_CHANNELS,
        isExtendedGroupBy: isExtendedGroupBy,
        parseGroupBy: parseGroupBy,
        toString: toString,
        GROUP_BY_FIELD_TRANSFORM: GROUP_BY_FIELD_TRANSFORM,
        GROUP_BY_ENCODING: GROUP_BY_ENCODING
    });

    /**
     * Registry for all possible grouping key functions.
     */
    let groupRegistry = {};
    /**
     * Add a grouping function to the registry.
     */
    function registerKeyFn(name, keyFn) {
        groupRegistry[name] = keyFn;
    }
    const FIELD = 'field';
    const FIELD_TRANSFORM = 'fieldTransform';
    const ENCODING = 'encoding';
    const SPEC = 'spec';
    /**
     * Group the input spec query model by a key function registered in the group registry
     * @return
     */
    function nest(specModels, queryNest) {
        if (queryNest) {
            const rootGroup = {
                name: '',
                path: '',
                items: []
            };
            let groupIndex = {};
            // global `includes` and `replaces` will get augmented by each level's groupBy.
            // Upper level's `groupBy` will get cascaded to lower-level groupBy.
            // `replace` can be overriden in a lower-level to support different grouping.
            let includes = [];
            let replaces = [];
            let replacers = [];
            for (let l = 0; l < queryNest.length; l++) {
                includes.push(l > 0 ? includes[l - 1].duplicate() : new PropIndex());
                replaces.push(l > 0 ? replaces[l - 1].duplicate() : new PropIndex());
                const groupBy = queryNest[l].groupBy;
                if (util_1(groupBy)) {
                    // If group is array, it's an array of extended group by that need to be parsed
                    let parsedGroupBy = parseGroupBy(groupBy, includes[l], replaces[l]);
                    replacers.push(parsedGroupBy.replacer);
                }
            }
            // With includes and replacers, now we can construct the nesting tree
            specModels.forEach(specM => {
                let path = '';
                let group = rootGroup;
                for (let l = 0; l < queryNest.length; l++) {
                    const groupBy = (group.groupBy = queryNest[l].groupBy);
                    group.orderGroupBy = queryNest[l].orderGroupBy;
                    const key = util_1(groupBy)
                        ? spec$1(specM.specQuery, includes[l], replacers[l])
                        : groupRegistry[groupBy](specM.specQuery);
                    path += '/' + key;
                    if (!groupIndex[path]) {
                        // this item already exists on the path
                        groupIndex[path] = {
                            name: key,
                            path: path,
                            items: []
                        };
                        group.items.push(groupIndex[path]);
                    }
                    group = groupIndex[path];
                }
                group.items.push(specM);
            });
            return rootGroup;
        }
        else {
            // no nesting, just return a flat group
            return {
                name: '',
                path: '',
                items: specModels
            };
        }
    }
    // TODO: move this to groupBy, rename properly, and export
    const GROUP_BY_FIELD = [Property.FIELD];
    const PARSED_GROUP_BY_FIELD = parseGroupBy(GROUP_BY_FIELD);
    function getGroupByKey(specM, groupBy) {
        return groupRegistry[groupBy](specM);
    }
    registerKeyFn(FIELD, (specQ) => {
        return spec$1(specQ, PARSED_GROUP_BY_FIELD.include, PARSED_GROUP_BY_FIELD.replacer);
    });
    const PARSED_GROUP_BY_FIELD_TRANSFORM = parseGroupBy(GROUP_BY_FIELD_TRANSFORM);
    registerKeyFn(FIELD_TRANSFORM, (specQ) => {
        return spec$1(specQ, PARSED_GROUP_BY_FIELD_TRANSFORM.include, PARSED_GROUP_BY_FIELD_TRANSFORM.replacer);
    });
    const PARSED_GROUP_BY_ENCODING = parseGroupBy(GROUP_BY_ENCODING);
    registerKeyFn(ENCODING, (specQ) => {
        return spec$1(specQ, PARSED_GROUP_BY_ENCODING.include, PARSED_GROUP_BY_ENCODING.replacer);
    });
    registerKeyFn(SPEC, (specQ) => JSON.stringify(specQ));

    var nest$1 = /*#__PURE__*/Object.freeze({
        registerKeyFn: registerKeyFn,
        FIELD: FIELD,
        FIELD_TRANSFORM: FIELD_TRANSFORM,
        ENCODING: ENCODING,
        SPEC: SPEC,
        nest: nest,
        getGroupByKey: getGroupByKey,
        PARSED_GROUP_BY_FIELD_TRANSFORM: PARSED_GROUP_BY_FIELD_TRANSFORM,
        PARSED_GROUP_BY_ENCODING: PARSED_GROUP_BY_ENCODING
    });

    class WildcardIndex {
        constructor() {
            this._mark = undefined;
            this._encodings = {};
            this._encodingIndicesByProperty = new PropIndex();
        }
        setEncodingProperty(index, prop, wildcard) {
            const encodingsIndex = this._encodings;
            // Init encoding index and set prop
            const encIndex = encodingsIndex[index] = encodingsIndex[index] || new PropIndex();
            encIndex.set(prop, wildcard);
            // Initialize indicesByProperty[prop] and add index
            const indicesByProp = this._encodingIndicesByProperty;
            indicesByProp.set(prop, (indicesByProp.get(prop) || []));
            indicesByProp.get(prop).push(index);
            return this;
        }
        hasEncodingProperty(index, prop) {
            return !!this._encodings[index] && this._encodings[index].has(prop);
        }
        hasProperty(prop) {
            if (isEncodingProperty(prop)) {
                return this.encodingIndicesByProperty.has(prop);
            }
            else if (prop === 'mark') {
                return !!this.mark;
            }
            /* istanbul ignore next */
            throw new Error('Unimplemented for property ' + prop);
        }
        isEmpty() {
            return !this.mark && this.encodingIndicesByProperty.size() === 0;
        }
        setMark(mark) {
            this._mark = mark;
            return this;
        }
        get mark() {
            return this._mark;
        }
        get encodings() {
            return this._encodings;
        }
        get encodingIndicesByProperty() {
            return this._encodingIndicesByProperty;
        }
    }

    /**
     * Internal class for specQuery that provides helper for the enumeration process.
     */
    class SpecQueryModel {
        constructor(spec, wildcardIndex, schema, opt, wildcardAssignment) {
            this._rankingScore = {};
            this._spec = spec;
            this._channelFieldCount = spec.encodings.reduce((m, encQ) => {
                if (!isWildcard(encQ.channel) && (!isAutoCountQuery(encQ) || encQ.autoCount !== false)) {
                    m[encQ.channel + ''] = 1;
                }
                return m;
            }, {});
            this._wildcardIndex = wildcardIndex;
            this._assignedWildcardIndex = wildcardAssignment;
            this._opt = opt;
            this._schema = schema;
        }
        /**
         * Build a WildcardIndex by detecting wildcards
         * in the input specQuery and replacing short wildcards ("?")
         * with full ones (objects with `name` and `enum` values).
         *
         * @return a SpecQueryModel that wraps the specQuery and the WildcardIndex.
         */
        static build(specQ, schema, opt) {
            let wildcardIndex = new WildcardIndex();
            // mark
            if (isWildcard(specQ.mark)) {
                const name = getDefaultName(Property.MARK);
                specQ.mark = initWildcard(specQ.mark, name, opt.enum.mark);
                wildcardIndex.setMark(specQ.mark);
            }
            // TODO: transform
            // encodings
            specQ.encodings.forEach((encQ, index) => {
                if (isAutoCountQuery(encQ)) {
                    // This is only for testing purpose
                    console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
                    encQ.type = QUANTITATIVE; // autoCount is always quantitative
                }
                if (isFieldQuery(encQ) && encQ.type === undefined) {
                    // type is optional -- we automatically augment wildcard if not specified
                    encQ.type = SHORT_WILDCARD;
                }
                // For each property of the encodingQuery, enumerate
                ENCODING_TOPLEVEL_PROPS.forEach(prop => {
                    if (isWildcard(encQ[prop])) {
                        // Assign default wildcard name and enum values.
                        const defaultWildcardName = getDefaultName(prop) + index;
                        const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                        const wildcard = (encQ[prop] = initWildcard(encQ[prop], defaultWildcardName, defaultEnumValues));
                        // Add index of the encoding mapping to the property's wildcard index.
                        wildcardIndex.setEncodingProperty(index, prop, wildcard);
                    }
                });
                // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
                ENCODING_NESTED_PROPS.forEach(prop => {
                    const propObj = encQ[prop.parent]; // the property object e.g., encQ.bin
                    if (propObj) {
                        const child = prop.child;
                        if (isWildcard(propObj[child])) {
                            // Assign default wildcard name and enum values.
                            const defaultWildcardName = getDefaultName(prop) + index;
                            const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                            const wildcard = (propObj[child] = initWildcard(propObj[child], defaultWildcardName, defaultEnumValues));
                            // Add index of the encoding mapping to the property's wildcard index.
                            wildcardIndex.setEncodingProperty(index, prop, wildcard);
                        }
                    }
                });
            });
            // AUTO COUNT
            // Add Auto Count Field
            if (opt.autoAddCount) {
                const channel = {
                    name: getDefaultName(Property.CHANNEL) + specQ.encodings.length,
                    enum: getDefaultEnumValues(Property.CHANNEL, schema, opt)
                };
                const autoCount = {
                    name: getDefaultName(Property.AUTOCOUNT) + specQ.encodings.length,
                    enum: [false, true]
                };
                const countEncQ = {
                    channel,
                    autoCount,
                    type: QUANTITATIVE
                };
                specQ.encodings.push(countEncQ);
                const index = specQ.encodings.length - 1;
                // Add index of the encoding mapping to the property's wildcard index.
                wildcardIndex.setEncodingProperty(index, Property.CHANNEL, channel);
                wildcardIndex.setEncodingProperty(index, Property.AUTOCOUNT, autoCount);
            }
            return new SpecQueryModel(specQ, wildcardIndex, schema, opt, {});
        }
        get wildcardIndex() {
            return this._wildcardIndex;
        }
        get schema() {
            return this._schema;
        }
        get specQuery() {
            return this._spec;
        }
        duplicate() {
            return new SpecQueryModel(util_4(this._spec), this._wildcardIndex, this._schema, this._opt, util_4(this._assignedWildcardIndex));
        }
        setMark(mark) {
            const name = this._wildcardIndex.mark.name;
            this._assignedWildcardIndex[name] = this._spec.mark = mark;
        }
        resetMark() {
            const wildcard = (this._spec.mark = this._wildcardIndex.mark);
            delete this._assignedWildcardIndex[wildcard.name];
        }
        getMark() {
            return this._spec.mark;
        }
        getEncodingProperty(index, prop) {
            const encQ = this._spec.encodings[index];
            if (isEncodingNestedProp(prop)) {
                // nested encoding property
                return encQ[prop.parent][prop.child];
            }
            return encQ[prop]; // encoding property (non-nested)
        }
        setEncodingProperty(index, prop, value, wildcard) {
            const encQ = this._spec.encodings[index];
            if (prop === Property.CHANNEL && encQ.channel && !isWildcard(encQ.channel)) {
                // If there is an old channel
                this._channelFieldCount[encQ.channel]--;
            }
            if (isEncodingNestedProp(prop)) {
                // nested encoding property
                encQ[prop.parent][prop.child] = value;
            }
            else if (isEncodingNestedParent(prop) && value === true) {
                encQ[prop] = util_5({}, encQ[prop], // copy all existing properties
                { enum: undefined, name: undefined } // except name and values to it no longer an wildcard
                );
            }
            else {
                // encoding property (non-nested)
                encQ[prop] = value;
            }
            this._assignedWildcardIndex[wildcard.name] = value;
            if (prop === Property.CHANNEL) {
                // If there is a new channel, make sure it exists and add it to the count.
                this._channelFieldCount[value] = (this._channelFieldCount[value] || 0) + 1;
            }
        }
        resetEncodingProperty(index, prop, wildcard) {
            const encQ = this._spec.encodings[index];
            if (prop === Property.CHANNEL) {
                this._channelFieldCount[encQ.channel]--;
            }
            // reset it to wildcard
            if (isEncodingNestedProp(prop)) {
                // nested encoding property
                encQ[prop.parent][prop.child] = wildcard;
            }
            else {
                // encoding property (non-nested)
                encQ[prop] = wildcard;
            }
            // add remove value that is reset from the assignment map
            delete this._assignedWildcardIndex[wildcard.name];
        }
        channelUsed(channel) {
            // do not include encoding that has autoCount = false because it is not a part of the output spec.
            return this._channelFieldCount[channel] > 0;
        }
        channelEncodingField(channel) {
            const encodingQuery = this.getEncodingQueryByChannel(channel);
            return isFieldQuery(encodingQuery);
        }
        getEncodings() {
            // do not include encoding that has autoCount = false because it is not a part of the output spec.
            return this._spec.encodings.filter(encQ => !isDisabledAutoCountQuery(encQ));
        }
        getEncodingQueryByChannel(channel) {
            for (let specEncoding of this._spec.encodings) {
                if (specEncoding.channel === channel) {
                    return specEncoding;
                }
            }
            return undefined;
        }
        getEncodingQueryByIndex(i) {
            return this._spec.encodings[i];
        }
        isAggregate() {
            return isAggregate(this._spec);
        }
        /**
         * @return The Vega-Lite `StackProperties` object that describes the stack
         * configuration of `this`. Returns `null` if this is not stackable.
         */
        getVlStack() {
            return getVlStack(this._spec);
        }
        /**
         * @return The `StackOffset` specified in `this`, `undefined` if none
         * is specified.
         */
        getStackOffset() {
            return getStackOffset(this._spec);
        }
        /**
         * @return The `Channel` in which `stack` is specified in `this`, or
         * `null` if none is specified.
         */
        getStackChannel() {
            return getStackChannel(this._spec);
        }
        toShorthand(groupBy) {
            if (groupBy) {
                if (util_9(groupBy)) {
                    return getGroupByKey(this.specQuery, groupBy);
                }
                const parsedGroupBy = parseGroupBy(groupBy);
                return spec$1(this._spec, parsedGroupBy.include, parsedGroupBy.replacer);
            }
            return spec$1(this._spec);
        }
        /**
         * Convert a query to a Vega-Lite spec if it is completed.
         * @return a Vega-Lite spec if completed, null otherwise.
         */
        toSpec(data) {
            if (isWildcard(this._spec.mark))
                return null;
            let spec = {};
            data = data || this._spec.data;
            if (data) {
                spec.data = data;
            }
            if (this._spec.transform) {
                spec.transform = this._spec.transform;
            }
            spec.mark = this._spec.mark;
            spec.encoding = toEncoding(this.specQuery.encodings, { schema: this._schema, wildcardMode: 'null' });
            if (this._spec.width) {
                spec.width = this._spec.width;
            }
            if (this._spec.height) {
                spec.height = this._spec.height;
            }
            if (this._spec.background) {
                spec.background = this._spec.background;
            }
            if (this._spec.padding) {
                spec.padding = this._spec.padding;
            }
            if (this._spec.title) {
                spec.title = this._spec.title;
            }
            if (spec.encoding === null) {
                return null;
            }
            if (this._spec.config || this._opt.defaultSpecConfig)
                spec.config = util_5({}, this._opt.defaultSpecConfig, this._spec.config);
            return spec;
        }
        getRankingScore(rankingName) {
            return this._rankingScore[rankingName];
        }
        setRankingScore(rankingName, score) {
            this._rankingScore[rankingName] = score;
        }
    }

    var model = /*#__PURE__*/Object.freeze({
        SpecQueryModel: SpecQueryModel
    });



    var transform = /*#__PURE__*/Object.freeze({

    });

    /**
     * Normalize the non-nested version of the query
     * (basically when you have a `groupBy`)
     * to a standardize nested.
     */
    function normalize$1(q) {
        if (q.groupBy) {
            let nest = {
                groupBy: q.groupBy
            };
            if (q.orderBy) {
                nest.orderGroupBy = q.orderBy;
            }
            let normalizedQ = {
                spec: util_4(q.spec),
                nest: [nest],
            };
            if (q.chooseBy) {
                normalizedQ.chooseBy = q.chooseBy;
            }
            if (q.config) {
                normalizedQ.config = q.config;
            }
            return normalizedQ;
        }
        return util_4(q); // We will cause side effect to q.spec in SpecQueryModel.build
    }



    var index$2 = /*#__PURE__*/Object.freeze({
        encoding: encoding$1,
        groupBy: groupby,
        shorthand: shorthand,
        spec: spec,
        transform: transform,
        normalize: normalize$1
    });

    function isResultTree(item) {
        return item.items !== undefined;
    }
    function getTopResultTreeItem(specQuery) {
        let topItem = specQuery.items[0];
        while (topItem && isResultTree(topItem)) {
            topItem = topItem.items[0];
        }
        return topItem;
    }
    function mapLeaves(group, f) {
        return Object.assign({}, group, { items: group.items.map(item => (isResultTree(item) ? mapLeaves(item, f) : f(item))) });
    }

    var result = /*#__PURE__*/Object.freeze({
        isResultTree: isResultTree,
        getTopResultTreeItem: getTopResultTreeItem,
        mapLeaves: mapLeaves
    });

    class Scorer {
        constructor(type) {
            this.type = type;
            this.scoreIndex = this.initScore();
        }
        getFeatureScore(feature) {
            const type = this.type;
            const score = this.scoreIndex[feature];
            if (score !== undefined) {
                return { type, feature, score };
            }
            return undefined;
        }
    }

    /**
     * Finer grained data types that takes binning and timeUnit into account.
     */
    var ExtendedType;
    (function (ExtendedType) {
        ExtendedType[ExtendedType["Q"] = QUANTITATIVE] = "Q";
        ExtendedType[ExtendedType["BIN_Q"] = ('bin_' + QUANTITATIVE)] = "BIN_Q";
        ExtendedType[ExtendedType["T"] = TEMPORAL] = "T";
        /**
         * Time Unit Temporal Field with time scale.
         */
        ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
        /**
         * Time Unit Temporal Field with ordinal scale.
         */
        ExtendedType[ExtendedType["TIMEUNIT_O"] = ('timeUnit_' + ORDINAL)] = "TIMEUNIT_O";
        ExtendedType[ExtendedType["O"] = ORDINAL] = "O";
        ExtendedType[ExtendedType["N"] = NOMINAL] = "N";
        ExtendedType[ExtendedType["K"] = ExpandedType.KEY] = "K";
        ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
    })(ExtendedType || (ExtendedType = {}));
    const Q = ExtendedType.Q;
    const BIN_Q = ExtendedType.BIN_Q;
    const T = ExtendedType.T;
    const TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
    const TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
    const O = ExtendedType.O;
    const N = ExtendedType.N;
    const K = ExtendedType.K;
    const NONE = ExtendedType.NONE;
    function getExtendedType(fieldQ) {
        if (fieldQ.bin) {
            return ExtendedType.BIN_Q;
        }
        else if (fieldQ.timeUnit) {
            const sType = scaleType$1(fieldQ);
            return hasDiscreteDomain(sType) ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
        }
        return fieldQ.type;
    }

    /**
     * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
     */
    /**
     * Effectiveness Score for preferred axis.
     */
    class AxisScorer extends Scorer {
        constructor() {
            super('Axis');
        }
        initScore(opt = {}) {
            opt = Object.assign({}, DEFAULT_QUERY_CONFIG, opt);
            let score = {};
            const preferredAxes = [
                {
                    feature: BIN_Q,
                    opt: 'preferredBinAxis'
                },
                {
                    feature: T,
                    opt: 'preferredTemporalAxis'
                },
                {
                    feature: TIMEUNIT_T,
                    opt: 'preferredTemporalAxis'
                },
                {
                    feature: TIMEUNIT_O,
                    opt: 'preferredTemporalAxis'
                },
                {
                    feature: O,
                    opt: 'preferredOrdinalAxis'
                },
                {
                    feature: N,
                    opt: 'preferredNominalAxis'
                }
            ];
            preferredAxes.forEach(pAxis => {
                if (opt[pAxis.opt] === X) {
                    // penalize the other axis
                    score[pAxis.feature + '_' + Y] = -0.01;
                }
                else if (opt[pAxis.opt] === Y) {
                    // penalize the other axis
                    score[pAxis.feature + '_' + X] = -0.01;
                }
            });
            return score;
        }
        featurize(type, channel) {
            return type + '_' + channel;
        }
        getScore(specM, _, __) {
            return specM.getEncodings().reduce((features, encQ) => {
                if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                    const type = getExtendedType(encQ);
                    const feature = this.featurize(type, encQ.channel);
                    const featureScore = this.getFeatureScore(feature);
                    if (featureScore) {
                        features.push(featureScore);
                    }
                }
                return features;
            }, []);
        }
    }

    /**
     * Penalize if facet channels are the only dimensions
     */
    class DimensionScorer extends Scorer {
        constructor() {
            super('Dimension');
        }
        initScore() {
            return {
                row: -2,
                column: -2,
                color: 0,
                opacity: 0,
                size: 0,
                shape: 0
            };
        }
        getScore(specM, _, __) {
            if (specM.isAggregate()) {
                specM.getEncodings().reduce((maxFScore, encQ) => {
                    if (isAutoCountQuery(encQ) || (isFieldQuery(encQ) && !encQ.aggregate)) { // isDimension
                        const featureScore = this.getFeatureScore(encQ.channel + '');
                        if (featureScore && featureScore.score > maxFScore.score) {
                            return featureScore;
                        }
                    }
                    return maxFScore;
                }, { type: 'Dimension', feature: 'No Dimension', score: -5 });
            }
            return [];
        }
    }

    /**
     * Effective Score for preferred facet
     */
    class FacetScorer extends Scorer {
        constructor() {
            super('Facet');
        }
        initScore(opt) {
            opt = Object.assign({}, DEFAULT_QUERY_CONFIG, opt);
            let score = {};
            if (opt.preferredFacet === ROW) {
                // penalize the other axis
                score[COLUMN] = -0.01;
            }
            else if (opt.preferredFacet === COLUMN) {
                // penalize the other axis
                score[ROW] = -0.01;
            }
            return score;
        }
        getScore(specM, _, __) {
            return specM.getEncodings().reduce((features, encQ) => {
                if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                    const featureScore = this.getFeatureScore(encQ.channel);
                    if (featureScore) {
                        features.push(featureScore);
                    }
                }
                return features;
            }, []);
        }
    }

    /**
     * Effectivenss score that penalize size for bar and tick
     */
    class SizeChannelScorer extends Scorer {
        constructor() {
            super('SizeChannel');
        }
        initScore() {
            return {
                bar_size: -2,
                tick_size: -2
            };
        }
        getScore(specM, _, __) {
            const mark = specM.getMark();
            return specM.getEncodings().reduce((featureScores, encQ) => {
                if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                    const feature = mark + '_' + encQ.channel;
                    const featureScore = this.getFeatureScore(feature);
                    if (featureScore) {
                        featureScores.push(featureScore);
                    }
                }
                return featureScores;
            }, []);
        }
    }

    const TERRIBLE = -10;
    /**
     * Effectiveness score for relationship between
     * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
     */
    class TypeChannelScorer extends Scorer {
        constructor() {
            super('TypeChannel');
        }
        initScore() {
            let SCORE = {};
            // Continuous Quantitative / Temporal Fields
            const CONTINUOUS_TYPE_CHANNEL_SCORE = {
                x: 0,
                y: 0,
                size: -0.575,
                color: -0.725,
                text: -2,
                opacity: -3,
                shape: TERRIBLE,
                row: TERRIBLE,
                column: TERRIBLE,
                detail: 2 * TERRIBLE
            };
            [Q, T, TIMEUNIT_T].forEach((type) => {
                util_3(CONTINUOUS_TYPE_CHANNEL_SCORE).forEach((channel) => {
                    SCORE[this.featurize(type, channel)] = CONTINUOUS_TYPE_CHANNEL_SCORE[channel];
                });
            });
            // Discretized Quantitative / Temporal Fields / Ordinal
            const ORDERED_TYPE_CHANNEL_SCORE = util_5({}, CONTINUOUS_TYPE_CHANNEL_SCORE, {
                row: -0.75,
                column: -0.75,
                shape: -3.1,
                text: -3.2,
                detail: -4
            });
            [BIN_Q, TIMEUNIT_O, O].forEach((type) => {
                util_3(ORDERED_TYPE_CHANNEL_SCORE).forEach((channel) => {
                    SCORE[this.featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
                });
            });
            const NOMINAL_TYPE_CHANNEL_SCORE = {
                x: 0,
                y: 0,
                color: -0.6,
                shape: -0.65,
                row: -0.7,
                column: -0.7,
                text: -0.8,
                detail: -2,
                size: -3,
                opacity: -3.1,
            };
            util_3(NOMINAL_TYPE_CHANNEL_SCORE).forEach((channel) => {
                SCORE[this.featurize(N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
                SCORE[this.featurize(K, channel)] =
                    // Putting key on position or detail isn't terrible
                    contains$1(['x', 'y', 'detail'], channel) ? -1 :
                        NOMINAL_TYPE_CHANNEL_SCORE[channel] - 2;
            });
            return SCORE;
        }
        featurize(type, channel) {
            return type + '_' + channel;
        }
        getScore(specM, schema, opt) {
            const encodingQueryByField = specM.getEncodings().reduce((m, encQ) => {
                if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                    const fieldKey = fieldDef(encQ);
                    (m[fieldKey] = m[fieldKey] || []).push(encQ);
                }
                return m;
            }, {});
            const features = [];
            forEach(encodingQueryByField, (encQs) => {
                const bestFieldFeature = encQs.reduce((best, encQ) => {
                    if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                        const type = getExtendedType(encQ);
                        const feature = this.featurize(type, encQ.channel);
                        const featureScore = this.getFeatureScore(feature);
                        if (best === null || featureScore.score > best.score) {
                            return featureScore;
                        }
                    }
                    return best;
                }, null);
                features.push(bestFieldFeature);
                // TODO: add plus for over-encoding of one field
            });
            return features;
        }
    }

    class MarkScorer extends Scorer {
        constructor() {
            super('Mark');
        }
        initScore() {
            return init();
        }
        getScore(specM, _, __) {
            let mark = specM.getMark();
            if (mark === CIRCLE || mark === SQUARE) {
                mark = POINT;
            }
            const xEncQ = specM.getEncodingQueryByChannel(X);
            const xType = xEncQ ? getExtendedType(xEncQ) : NONE;
            const yEncQ = specM.getEncodingQueryByChannel(Y);
            const yType = yEncQ ? getExtendedType(yEncQ) : NONE;
            const isOccluded = !specM.isAggregate(); // FIXME
            const feature = xType + '_' + yType + '_' + isOccluded + '_' + mark;
            const featureScore = this.getFeatureScore(feature);
            if (featureScore) {
                return [featureScore];
            }
            console.error('feature score missing for', feature);
            return [];
        }
    }
    function featurize(xType, yType, hasOcclusion, mark) {
        return xType + '_' + yType + '_' + hasOcclusion + '_' + mark;
    }
    function init() {
        const MEASURES = [Q, T];
        const DISCRETE = [BIN_Q, TIMEUNIT_O, O, N, K];
        const DISCRETE_OR_NONE = DISCRETE.concat([NONE]);
        let SCORE = {};
        // QxQ
        MEASURES.forEach(xType => {
            MEASURES.forEach(yType => {
                // has occlusion
                const occludedQQMark = {
                    point: 0,
                    text: -0.2,
                    tick: -0.5,
                    rect: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                forEach(occludedQQMark, (score, mark) => {
                    const feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                // no occlusion
                // TODO: possible to use connected scatter plot
                const noOccludedQQMark = {
                    point: 0,
                    text: -0.2,
                    tick: -0.5,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                forEach(noOccludedQQMark, (score, mark) => {
                    const feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
            });
        });
        // DxQ, QxD
        MEASURES.forEach(xType => {
            // HAS OCCLUSION
            DISCRETE_OR_NONE.forEach(yType => {
                const occludedDimensionMeasureMark = {
                    tick: 0,
                    point: -0.2,
                    text: -0.5,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                forEach(occludedDimensionMeasureMark, (score, mark) => {
                    const feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    const feature2 = featurize(yType, xType, true, mark);
                    SCORE[feature2] = score;
                });
            });
            [TIMEUNIT_T].forEach(yType => {
                const occludedDimensionMeasureMark = {
                    // For Time Dimension with time scale, tick is not good
                    point: 0,
                    text: -0.5,
                    tick: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                forEach(occludedDimensionMeasureMark, (score, mark) => {
                    const feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    const feature2 = featurize(yType, xType, true, mark);
                    SCORE[feature2] = score;
                });
            });
            // NO OCCLUSION
            [NONE, N, O, K].forEach(yType => {
                const noOccludedQxN = {
                    bar: 0,
                    point: -0.2,
                    tick: -0.25,
                    text: -0.3,
                    // Line / Area can mislead trend for N
                    line: -2,
                    area: -2,
                    // Non-sense to use rule here
                    rule: -2.5
                };
                forEach(noOccludedQxN, (score, mark) => {
                    const feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    const feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
            [BIN_Q].forEach(yType => {
                const noOccludedQxBinQ = {
                    bar: 0,
                    point: -0.2,
                    tick: -0.25,
                    text: -0.3,
                    // Line / Area isn't the best fit for bin
                    line: -0.5,
                    area: -0.5,
                    // Non-sense to use rule here
                    rule: -2.5
                };
                forEach(noOccludedQxBinQ, (score, mark) => {
                    const feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    const feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
            [TIMEUNIT_T, TIMEUNIT_O].forEach(yType => {
                // For aggregate / surely no occlusion plot, Temporal with time or ordinal
                // are not that different.
                const noOccludedQxBinQ = {
                    line: 0,
                    area: -0.1,
                    bar: -0.2,
                    point: -0.3,
                    tick: -0.35,
                    text: -0.4,
                    // Non-sense to use rule here
                    rule: -2.5
                };
                forEach(noOccludedQxBinQ, (score, mark) => {
                    const feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    const feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
        });
        [TIMEUNIT_T].forEach(xType => {
            [TIMEUNIT_T].forEach(yType => {
                // has occlusion
                const ttMark = {
                    point: 0,
                    rect: -0.1,
                    text: -0.5,
                    tick: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                // No difference between has occlusion and no occlusion
                // as most of the time, it will be the occluded case.
                forEach(ttMark, (score, mark) => {
                    const feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                forEach(ttMark, (score, mark) => {
                    const feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
            });
            DISCRETE_OR_NONE.forEach(yType => {
                // has occlusion
                const tdMark = {
                    tick: 0,
                    point: -0.2,
                    text: -0.5,
                    rect: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                // No difference between has occlusion and no occlusion
                // as most of the time, it will be the occluded case.
                forEach(tdMark, (score, mark) => {
                    const feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                forEach(tdMark, (score, mark) => {
                    const feature = featurize(yType, xType, true, mark);
                    SCORE[feature] = score;
                });
                forEach(tdMark, (score, mark) => {
                    const feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
                forEach(tdMark, (score, mark) => {
                    const feature = featurize(yType, xType, false, mark);
                    SCORE[feature] = score;
                });
            });
        });
        // DxD
        // Note: We use for loop here because using forEach sometimes leads to a mysterious bug
        for (const xType of DISCRETE_OR_NONE) {
            for (const yType of DISCRETE_OR_NONE) {
                // has occlusion
                const ddMark = {
                    point: 0,
                    rect: 0,
                    text: -0.1,
                    tick: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                forEach(ddMark, (score, mark) => {
                    const feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                // same for no occlusion.
                forEach(ddMark, (score, mark) => {
                    const feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
            }
        }
        return SCORE;
    }

    const SCORERS = [
        new AxisScorer(),
        new DimensionScorer(),
        new FacetScorer(),
        new MarkScorer(),
        new SizeChannelScorer(),
        new TypeChannelScorer()
    ];
    // TODO: x/y, row/column preference
    // TODO: stacking
    // TODO: Channel, Cardinality
    // TODO: Penalize over encoding
    function effectiveness(specM, schema, opt) {
        const features = SCORERS.reduce((f, scorer) => {
            const scores = scorer.getScore(specM, schema, opt);
            return f.concat(scores);
        }, []);
        return {
            score: features.reduce((s, f) => {
                return s + f.score;
            }, 0),
            features: features
        };
    }

    const name = 'aggregationQuality';
    function score(specM, schema, opt) {
        const feature = aggregationQualityFeature(specM, schema, opt);
        return {
            score: feature.score,
            features: [feature]
        };
    }
    function aggregationQualityFeature(specM, _, __) {
        const encodings = specM.getEncodings();
        if (specM.isAggregate()) {
            const isRawContinuous = (encQ) => {
                return (isFieldQuery(encQ) &&
                    ((encQ.type === QUANTITATIVE && !encQ.bin && !encQ.aggregate) ||
                        (encQ.type === TEMPORAL && !encQ.timeUnit)));
            };
            if (some$1(encodings, isRawContinuous)) {
                // These are plots that pollute continuous fields as dimension.
                // They are often intermediate visualizations rather than what users actually want.
                return {
                    type: name,
                    score: 0.1,
                    feature: 'Aggregate with raw continuous'
                };
            }
            if (some$1(encodings, encQ => isFieldQuery(encQ) && isDimension(encQ))) {
                let hasCount = some$1(encodings, (encQ) => {
                    return (isFieldQuery(encQ) && encQ.aggregate === 'count') || isEnabledAutoCountQuery(encQ);
                });
                let hasBin = some$1(encodings, (encQ) => {
                    return isFieldQuery(encQ) && !!encQ.bin;
                });
                if (hasCount) {
                    // If there is count, we might add additional count field, making it a little less simple
                    // then when we just apply aggregate to Q field
                    return {
                        type: name,
                        score: 0.8,
                        feature: 'Aggregate with count'
                    };
                }
                else if (hasBin) {
                    // This is not as good as binning all the Q and show heatmap
                    return {
                        type: name,
                        score: 0.7,
                        feature: 'Aggregate with bin but without count'
                    };
                }
                else {
                    return {
                        type: name,
                        score: 0.9,
                        feature: 'Aggregate without count and without bin'
                    };
                }
            }
            // no dimension -- often not very useful
            return {
                type: name,
                score: 0.3,
                feature: 'Aggregate without dimension'
            };
        }
        else {
            if (some$1(encodings, encQ => isFieldQuery(encQ) && !isDimension(encQ))) {
                // raw plots with measure -- simplest of all!
                return {
                    type: name,
                    score: 1,
                    feature: 'Raw with measure'
                };
            }
            // raw plots with no measure -- often a lot of occlusion
            return {
                type: name,
                score: 0.2,
                feature: 'Raw without measure'
            };
        }
    }

    var aggregation = /*#__PURE__*/Object.freeze({
        name: name,
        score: score
    });

    const name$1 = 'fieldOrder';
    /**
     * Return ranking score based on indices of encoded fields in the schema.
     * If there are multiple fields, prioritize field on the lower indices of encodings.
     *
     * For example, to compare two specs with two encodings each,
     * first we compare the field on the 0-th index
     * and only compare the field on the 1-th index only if the fields on the 0-th index are the same.
     */
    function score$1(specM, schema, _) {
        const fieldWildcardIndices = specM.wildcardIndex.encodingIndicesByProperty.get('field');
        if (!fieldWildcardIndices) {
            return {
                score: 0,
                features: []
            };
        }
        const encodings = specM.specQuery.encodings;
        const numFields = schema.fieldSchemas.length;
        const features = [];
        let totalScore = 0, base = 1;
        for (let i = fieldWildcardIndices.length - 1; i >= 0; i--) {
            const index = fieldWildcardIndices[i];
            const encoding = encodings[index];
            // Skip ValueQuery as we only care about order of fields.
            let field;
            if (isFieldQuery(encoding)) {
                field = encoding.field;
            }
            else { // ignore ValueQuery / AutoCountQuery
                continue;
            }
            const fieldWildcard = specM.wildcardIndex.encodings[index].get('field');
            const fieldIndex = schema.fieldSchema(field).index;
            // reverse order field with lower index should get higher score and come first
            const score = -fieldIndex * base;
            totalScore += score;
            features.push({
                score: score,
                type: 'fieldOrder',
                feature: `field ${fieldWildcard.name} is ${field} (#${fieldIndex} in the schema)`
            });
            base *= numFields;
        }
        return {
            score: totalScore,
            features: features
        };
    }

    var fieldorder = /*#__PURE__*/Object.freeze({
        name: name$1,
        score: score$1
    });

    /**
     * Registry for all encoding ranking functions
     */
    let rankingRegistry = {};
    /**
     * Add an ordering function to the registry.
     */
    function register(name, keyFn) {
        rankingRegistry[name] = keyFn;
    }
    function get(name) {
        return rankingRegistry[name];
    }
    function rank(group, query, schema, level) {
        if (!query.nest || level === query.nest.length) {
            if (query.orderBy || query.chooseBy) {
                group.items.sort(comparatorFactory(query.orderBy || query.chooseBy, schema, query.config));
                if (query.chooseBy) {
                    if (group.items.length > 0) {
                        // for chooseBy -- only keep the top-item
                        group.items.splice(1);
                    }
                }
            }
        }
        else {
            // sort lower-level nodes first because our ranking takes top-item in the subgroup
            group.items.forEach((subgroup) => {
                rank(subgroup, query, schema, level + 1);
            });
            if (query.nest[level].orderGroupBy) {
                group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
            }
        }
        return group;
    }
    function comparatorFactory(name, schema, opt) {
        return (m1, m2) => {
            if (name instanceof Array) {
                return getScoreDifference(name, m1, m2, schema, opt);
            }
            else {
                return getScoreDifference([name], m1, m2, schema, opt);
            }
        };
    }
    function groupComparatorFactory(name, schema, opt) {
        return (g1, g2) => {
            const m1 = getTopResultTreeItem(g1);
            const m2 = getTopResultTreeItem(g2);
            if (name instanceof Array) {
                return getScoreDifference(name, m1, m2, schema, opt);
            }
            else {
                return getScoreDifference([name], m1, m2, schema, opt);
            }
        };
    }
    function getScoreDifference(name, m1, m2, schema, opt) {
        for (let rankingName of name) {
            let scoreDifference = getScore(m2, rankingName, schema, opt).score - getScore(m1, rankingName, schema, opt).score;
            if (scoreDifference !== 0) {
                return scoreDifference;
            }
        }
        return 0;
    }
    function getScore(model, rankingName, schema, opt) {
        if (model.getRankingScore(rankingName) !== undefined) {
            return model.getRankingScore(rankingName);
        }
        const fn = get(rankingName);
        const score = fn(model, schema, opt);
        model.setRankingScore(rankingName, score);
        return score;
    }
    const EFFECTIVENESS = 'effectiveness';
    register(EFFECTIVENESS, effectiveness);
    register(name, score);
    register(name$1, score$1);

    var ranking = /*#__PURE__*/Object.freeze({
        aggregation: aggregation,
        fieldOrder: fieldorder,
        register: register,
        get: get,
        rank: rank,
        comparatorFactory: comparatorFactory,
        groupComparatorFactory: groupComparatorFactory,
        getScore: getScore,
        EFFECTIVENESS: EFFECTIVENESS,
        effectiveness: effectiveness
    });

    function stylize(answerSet, schema, opt) {
        let encQIndex = {};
        answerSet = answerSet.map(function (specM) {
            if (opt.smallRangeStepForHighCardinalityOrFacet) {
                specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
            }
            if (opt.nominalColorScaleForHighCardinality) {
                specM = nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt);
            }
            if (opt.xAxisOnTopForHighYCardinalityWithoutColumn) {
                specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt);
            }
            return specM;
        });
        return answerSet;
    }
    function smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
        [ROW, Y, COLUMN, X].forEach(channel => {
            encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
        });
        const yEncQ = encQIndex[Y];
        if (yEncQ !== undefined && isFieldQuery(yEncQ)) {
            if (encQIndex[ROW] ||
                schema.cardinality(yEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
                // We check for undefined rather than
                // yEncQ.scale = yEncQ.scale || {} to cover the case where
                // yEncQ.scale has been set to false/null.
                // This prevents us from incorrectly overriding scale and
                // assigning a rangeStep when scale is set to false.
                if (yEncQ.scale === undefined) {
                    yEncQ.scale = {};
                }
                // We do not want to assign a rangeStep if scale is set to false
                // and we only apply this if the scale is (or can be) an ordinal scale.
                const yScaleType = scaleType$1(yEncQ);
                if (yEncQ.scale && (yScaleType === undefined || hasDiscreteDomain(yScaleType))) {
                    if (!yEncQ.scale.rangeStep) {
                        yEncQ.scale.rangeStep = 12;
                    }
                }
            }
        }
        const xEncQ = encQIndex[X];
        if (isFieldQuery(xEncQ)) {
            if (encQIndex[COLUMN] ||
                schema.cardinality(xEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
                // Just like y, we don't want to do this if scale is null/false
                if (xEncQ.scale === undefined) {
                    xEncQ.scale = {};
                }
                // We do not want to assign a rangeStep if scale is set to false
                // and we only apply this if the scale is (or can be) an ordinal scale.
                const xScaleType = scaleType$1(xEncQ);
                if (xEncQ.scale && (xScaleType === undefined || hasDiscreteDomain(xScaleType))) {
                    if (!xEncQ.scale.rangeStep) {
                        xEncQ.scale.rangeStep = 12;
                    }
                }
            }
        }
        return specM;
    }
    function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
        encQIndex[COLOR] = specM.getEncodingQueryByChannel(COLOR);
        const colorEncQ = encQIndex[COLOR];
        if (isFieldQuery(colorEncQ) &&
            colorEncQ !== undefined &&
            (colorEncQ.type === NOMINAL || colorEncQ.type === ExpandedType.KEY) &&
            schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality) {
            if (colorEncQ.scale === undefined) {
                colorEncQ.scale = {};
            }
            if (colorEncQ.scale) {
                if (!colorEncQ.scale.range) {
                    colorEncQ.scale.scheme = opt.nominalColorScaleForHighCardinality.palette;
                }
            }
        }
        return specM;
    }
    function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
        [COLUMN, X, Y].forEach(channel => {
            encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
        });
        if (encQIndex[COLUMN] === undefined) {
            const xEncQ = encQIndex[X];
            const yEncQ = encQIndex[Y];
            if (isFieldQuery(xEncQ) &&
                isFieldQuery(yEncQ) &&
                yEncQ !== undefined &&
                yEncQ.field &&
                hasDiscreteDomain(scaleType$1(yEncQ))) {
                if (xEncQ !== undefined) {
                    if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
                        if (xEncQ.axis === undefined) {
                            xEncQ.axis = {};
                        }
                        if (xEncQ.axis && !xEncQ.axis.orient) {
                            xEncQ.axis.orient = 'top';
                        }
                    }
                }
            }
        }
        return specM;
    }

    function generate$1(specQ, schema, opt = DEFAULT_QUERY_CONFIG) {
        // 1. Build a SpecQueryModel, which also contains wildcardIndex
        const specM = SpecQueryModel.build(specQ, schema, opt);
        const wildcardIndex = specM.wildcardIndex;
        // 2. Enumerate each of the properties based on propPrecedence.
        let answerSet = [specM]; // Initialize Answer Set with only the input spec query.
        opt.propertyPrecedence.forEach((propKey) => {
            const prop = fromKey(propKey);
            // If the original specQuery contains wildcard for this prop
            if (wildcardIndex.hasProperty(prop)) {
                // update answerset
                const enumerator = getEnumerator(prop);
                const reducer = enumerator(wildcardIndex, schema, opt);
                answerSet = answerSet.reduce(reducer, []);
            }
        });
        if (opt.stylize) {
            if ((opt.nominalColorScaleForHighCardinality !== null) ||
                (opt.smallRangeStepForHighCardinalityOrFacet !== null) ||
                (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
                return stylize(answerSet, schema, opt);
            }
        }
        return answerSet;
    }

    function recommend(q, schema, config) {
        // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
        //    and merge config with the following precedence
        //    query.config > config > DEFAULT_QUERY_CONFIG
        q = Object.assign({}, normalize$1(q), { config: Object.assign({}, DEFAULT_QUERY_CONFIG, config, q.config) });
        // 2. Generate
        const answerSet = generate$1(q.spec, schema, q.config);
        const nestedAnswerSet = nest(answerSet, q.nest);
        const result = rank(nestedAnswerSet, q, schema, 0);
        return {
            query: q,
            result: result
        };
    }

    var version = "0.21.2";

    /// <reference path="../typings/json.d.ts" />

    exports.config = config;
    exports.constraint = index$1;
    exports.enumerate = enumerator;
    exports.generate = generate$1;
    exports.model = model;
    exports.nest = nest$1;
    exports.property = property;
    exports.query = index$2;
    exports.ranking = ranking;
    exports.recommend = recommend;
    exports.result = result;
    exports.schema = schema;
    exports.util = util$1;
    exports.version = version;
    exports.wildcard = wildcard;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=compassql.js.map
