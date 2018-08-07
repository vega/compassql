(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.cql = {})));
}(this, (function (exports) { 'use strict';

	var encoding$5 = /*#__PURE__*/Object.freeze({
		get default () { return encoding$4; },
		get __moduleExports () { return encoding$3; },
		get isValueQuery () { return encoding_1$3; },
		get isFieldQuery () { return encoding_2$1; },
		get isAutoCountQuery () { return encoding_3$1; },
		get isDisabledAutoCountQuery () { return encoding_4$1; },
		get isEnabledAutoCountQuery () { return encoding_5$1; },
		get toEncoding () { return encoding_6$1; },
		get toValueDef () { return encoding_7$1; },
		get toFieldDef () { return encoding_8; },
		get isContinuous () { return encoding_9; },
		get isMeasure () { return encoding_10; },
		get isDimension () { return encoding_11; },
		get scaleType () { return encoding_12; }
	});

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

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
	/* global Reflect, Promise */

	var extendStatics = Object.setPrototypeOf ||
	    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = Object.assign || function __assign(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }
	    return t;
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
	            t[p[i]] = s[p[i]];
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	function __exportStar(m, exports) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	function __await(v) {
	    return this instanceof __await ? (this.v = v, this) : new __await(v);
	}

	function __asyncGenerator(thisArg, _arguments, generator) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var g = generator.apply(thisArg, _arguments || []), i, q = [];
	    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
	    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
	    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
	    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
	    function fulfill(value) { resume("next", value); }
	    function reject(value) { resume("throw", value); }
	    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
	}

	function __asyncDelegator(o) {
	    var i, p;
	    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
	    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
	}

	function __asyncValues(o) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var m = o[Symbol.asyncIterator];
	    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
	}

	function __makeTemplateObject(cooked, raw) {
	    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
	    return cooked;
	}
	function __importStar(mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result.default = mod;
	    return result;
	}

	function __importDefault(mod) {
	    return (mod && mod.__esModule) ? mod : { default: mod };
	}

	var tslib_es6 = /*#__PURE__*/Object.freeze({
		__extends: __extends,
		__assign: __assign,
		__rest: __rest,
		__decorate: __decorate,
		__param: __param,
		__metadata: __metadata,
		__awaiter: __awaiter,
		__generator: __generator,
		__exportStar: __exportStar,
		__values: __values,
		__read: __read,
		__spread: __spread,
		__await: __await,
		__asyncGenerator: __asyncGenerator,
		__asyncDelegator: __asyncDelegator,
		__asyncValues: __asyncValues,
		__makeTemplateObject: __makeTemplateObject,
		__importStar: __importStar,
		__importDefault: __importDefault
	});

	var at, // The index of the current character
	    ch, // The current character
	    escapee = {
	        '"':  '"',
	        '\\': '\\',
	        '/':  '/',
	        b:    '\b',
	        f:    '\f',
	        n:    '\n',
	        r:    '\r',
	        t:    '\t'
	    },
	    text,

	    error = function (m) {
	        // Call error when something is wrong.
	        throw {
	            name:    'SyntaxError',
	            message: m,
	            at:      at,
	            text:    text
	        };
	    },
	    
	    next = function (c) {
	        // If a c parameter is provided, verify that it matches the current character.
	        if (c && c !== ch) {
	            error("Expected '" + c + "' instead of '" + ch + "'");
	        }
	        
	        // Get the next character. When there are no more characters,
	        // return the empty string.
	        
	        ch = text.charAt(at);
	        at += 1;
	        return ch;
	    },
	    
	    number = function () {
	        // Parse a number value.
	        var number,
	            string = '';
	        
	        if (ch === '-') {
	            string = '-';
	            next('-');
	        }
	        while (ch >= '0' && ch <= '9') {
	            string += ch;
	            next();
	        }
	        if (ch === '.') {
	            string += '.';
	            while (next() && ch >= '0' && ch <= '9') {
	                string += ch;
	            }
	        }
	        if (ch === 'e' || ch === 'E') {
	            string += ch;
	            next();
	            if (ch === '-' || ch === '+') {
	                string += ch;
	                next();
	            }
	            while (ch >= '0' && ch <= '9') {
	                string += ch;
	                next();
	            }
	        }
	        number = +string;
	        if (!isFinite(number)) {
	            error("Bad number");
	        } else {
	            return number;
	        }
	    },
	    
	    string = function () {
	        // Parse a string value.
	        var hex,
	            i,
	            string = '',
	            uffff;
	        
	        // When parsing for string values, we must look for " and \ characters.
	        if (ch === '"') {
	            while (next()) {
	                if (ch === '"') {
	                    next();
	                    return string;
	                } else if (ch === '\\') {
	                    next();
	                    if (ch === 'u') {
	                        uffff = 0;
	                        for (i = 0; i < 4; i += 1) {
	                            hex = parseInt(next(), 16);
	                            if (!isFinite(hex)) {
	                                break;
	                            }
	                            uffff = uffff * 16 + hex;
	                        }
	                        string += String.fromCharCode(uffff);
	                    } else if (typeof escapee[ch] === 'string') {
	                        string += escapee[ch];
	                    } else {
	                        break;
	                    }
	                } else {
	                    string += ch;
	                }
	            }
	        }
	        error("Bad string");
	    },

	    white = function () {

	// Skip whitespace.

	        while (ch && ch <= ' ') {
	            next();
	        }
	    },

	    word = function () {

	// true, false, or null.

	        switch (ch) {
	        case 't':
	            next('t');
	            next('r');
	            next('u');
	            next('e');
	            return true;
	        case 'f':
	            next('f');
	            next('a');
	            next('l');
	            next('s');
	            next('e');
	            return false;
	        case 'n':
	            next('n');
	            next('u');
	            next('l');
	            next('l');
	            return null;
	        }
	        error("Unexpected '" + ch + "'");
	    },

	    value$1,  // Place holder for the value function.

	    array = function () {

	// Parse an array value.

	        var array = [];

	        if (ch === '[') {
	            next('[');
	            white();
	            if (ch === ']') {
	                next(']');
	                return array;   // empty array
	            }
	            while (ch) {
	                array.push(value$1());
	                white();
	                if (ch === ']') {
	                    next(']');
	                    return array;
	                }
	                next(',');
	                white();
	            }
	        }
	        error("Bad array");
	    },

	    object = function () {

	// Parse an object value.

	        var key,
	            object = {};

	        if (ch === '{') {
	            next('{');
	            white();
	            if (ch === '}') {
	                next('}');
	                return object;   // empty object
	            }
	            while (ch) {
	                key = string();
	                white();
	                next(':');
	                if (Object.hasOwnProperty.call(object, key)) {
	                    error('Duplicate key "' + key + '"');
	                }
	                object[key] = value$1();
	                white();
	                if (ch === '}') {
	                    next('}');
	                    return object;
	                }
	                next(',');
	                white();
	            }
	        }
	        error("Bad object");
	    };

	value$1 = function () {

	// Parse a JSON value. It could be an object, an array, a string, a number,
	// or a word.

	    white();
	    switch (ch) {
	    case '{':
	        return object();
	    case '[':
	        return array();
	    case '"':
	        return string();
	    case '-':
	        return number();
	    default:
	        return ch >= '0' && ch <= '9' ? number() : word();
	    }
	};

	// Return the json_parse function. It will have access to all of the above
	// functions and variables.

	var parse = function (source, reviver) {
	    var result;
	    
	    text = source;
	    at = 0;
	    ch = ' ';
	    result = value$1();
	    white();
	    if (ch) {
	        error("Syntax error");
	    }

	    // If there is a reviver function, we recursively walk the new structure,
	    // passing each name/value pair to the reviver function for possible
	    // transformation, starting with a temporary root object that holds the result
	    // in an empty key. If there is not a reviver function, we simply return the
	    // result.

	    return typeof reviver === 'function' ? (function walk(holder, key) {
	        var k, v, value = holder[key];
	        if (value && typeof value === 'object') {
	            for (k in value) {
	                if (Object.prototype.hasOwnProperty.call(value, k)) {
	                    v = walk(value, k);
	                    if (v !== undefined) {
	                        value[k] = v;
	                    } else {
	                        delete value[k];
	                    }
	                }
	            }
	        }
	        return reviver.call(holder, key, value);
	    }({'': result}, '')) : result;
	};

	var parse$1 = /*#__PURE__*/Object.freeze({
		default: parse,
		__moduleExports: parse
	});

	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	    gap,
	    indent,
	    meta = {    // table of character substitutions
	        '\b': '\\b',
	        '\t': '\\t',
	        '\n': '\\n',
	        '\f': '\\f',
	        '\r': '\\r',
	        '"' : '\\"',
	        '\\': '\\\\'
	    },
	    rep;

	function quote(string) {
	    // If the string contains no control characters, no quote characters, and no
	    // backslash characters, then we can safely slap some quotes around it.
	    // Otherwise we must also replace the offending characters with safe escape
	    // sequences.
	    
	    escapable.lastIndex = 0;
	    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	        var c = meta[a];
	        return typeof c === 'string' ? c :
	            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    }) + '"' : '"' + string + '"';
	}

	function str(key, holder) {
	    // Produce a string from holder[key].
	    var i,          // The loop counter.
	        k,          // The member key.
	        v,          // The member value.
	        length,
	        mind = gap,
	        partial,
	        value = holder[key];
	    
	    // If the value has a toJSON method, call it to obtain a replacement value.
	    if (value && typeof value === 'object' &&
	            typeof value.toJSON === 'function') {
	        value = value.toJSON(key);
	    }
	    
	    // If we were called with a replacer function, then call the replacer to
	    // obtain a replacement value.
	    if (typeof rep === 'function') {
	        value = rep.call(holder, key, value);
	    }
	    
	    // What happens next depends on the value's type.
	    switch (typeof value) {
	        case 'string':
	            return quote(value);
	        
	        case 'number':
	            // JSON numbers must be finite. Encode non-finite numbers as null.
	            return isFinite(value) ? String(value) : 'null';
	        
	        case 'boolean':
	        case 'null':
	            // If the value is a boolean or null, convert it to a string. Note:
	            // typeof null does not produce 'null'. The case is included here in
	            // the remote chance that this gets fixed someday.
	            return String(value);
	            
	        case 'object':
	            if (!value) return 'null';
	            gap += indent;
	            partial = [];
	            
	            // Array.isArray
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	                
	                // Join all of the elements together, separated with commas, and
	                // wrap them in brackets.
	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	            
	            // If the replacer is an array, use it to select the members to be
	            // stringified.
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    k = rep[i];
	                    if (typeof k === 'string') {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	            else {
	                // Otherwise, iterate through all of the keys in the object.
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	            
	        // Join all of the member texts together, separated with commas,
	        // and wrap them in braces.

	        v = partial.length === 0 ? '{}' : gap ?
	            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	            '{' + partial.join(',') + '}';
	        gap = mind;
	        return v;
	    }
	}

	var stringify = function (value, replacer, space) {
	    var i;
	    gap = '';
	    indent = '';
	    
	    // If the space parameter is a number, make an indent string containing that
	    // many spaces.
	    if (typeof space === 'number') {
	        for (i = 0; i < space; i += 1) {
	            indent += ' ';
	        }
	    }
	    // If the space parameter is a string, it will be used as the indent string.
	    else if (typeof space === 'string') {
	        indent = space;
	    }

	    // If there is a replacer, it must be a function or an array.
	    // Otherwise, throw an error.
	    rep = replacer;
	    if (replacer && typeof replacer !== 'function'
	    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
	        throw new Error('JSON.stringify');
	    }
	    
	    // Make a fake root object containing our value under the key of ''.
	    // Return the result of stringifying the value.
	    return str('', {'': value});
	};

	var stringify$1 = /*#__PURE__*/Object.freeze({
		default: stringify,
		__moduleExports: stringify
	});

	var require$$0 = ( parse$1 && parse ) || parse$1;

	var require$$1 = ( stringify$1 && stringify ) || stringify$1;

	var parse$2 = require$$0;
	var stringify$2 = require$$1;

	var jsonify = {
		parse: parse$2,
		stringify: stringify$2
	};

	var jsonify$1 = /*#__PURE__*/Object.freeze({
		default: jsonify,
		__moduleExports: jsonify,
		parse: parse$2,
		stringify: stringify$2
	});

	var require$$0$1 = ( jsonify$1 && jsonify ) || jsonify$1;

	var json = typeof JSON !== 'undefined' ? JSON : require$$0$1;

	var jsonStableStringify = function (obj, opts) {
	    if (!opts) opts = {};
	    if (typeof opts === 'function') opts = { cmp: opts };
	    var space = opts.space || '';
	    if (typeof space === 'number') space = Array(space+1).join(' ');
	    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
	    var replacer = opts.replacer || function(key, value) { return value; };

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
	    return (function stringify (parent, key, node, level) {
	        var indent = space ? ('\n' + new Array(level + 1).join(space)) : '';
	        var colonSeparator = space ? ': ' : ':';

	        if (node && node.toJSON && typeof node.toJSON === 'function') {
	            node = node.toJSON();
	        }

	        node = replacer.call(parent, key, node);

	        if (node === undefined) {
	            return;
	        }
	        if (typeof node !== 'object' || node === null) {
	            return json.stringify(node);
	        }
	        if (isArray(node)) {
	            var out = [];
	            for (var i = 0; i < node.length; i++) {
	                var item = stringify(node, i, node[i], level+1) || json.stringify(null);
	                out.push(indent + space + item);
	            }
	            return '[' + out.join(',') + indent + ']';
	        }
	        else {
	            if (seen.indexOf(node) !== -1) {
	                if (cycles) return json.stringify('__cycle__');
	                throw new TypeError('Converting circular structure to JSON');
	            }
	            else seen.push(node);

	            var keys = objectKeys(node).sort(cmp && cmp(node));
	            var out = [];
	            for (var i = 0; i < keys.length; i++) {
	                var key = keys[i];
	                var value = stringify(node, key, node[key], level+1);

	                if(!value) continue;

	                var keyValue = json.stringify(key)
	                    + colonSeparator
	                    + value;
	                out.push(indent + space + keyValue);
	            }
	            seen.splice(seen.indexOf(node), 1);
	            return '{' + out.join(',') + indent + '}';
	        }
	    })({ '': obj }, '', obj, 0);
	};

	var isArray = Array.isArray || function (x) {
	    return {}.toString.call(x) === '[object Array]';
	};

	var objectKeys = Object.keys || function (obj) {
	    var has = Object.prototype.hasOwnProperty || function () { return true };
	    var keys = [];
	    for (var key in obj) {
	        if (has.call(obj, key)) keys.push(key);
	    }
	    return keys;
	};

	var jsonStableStringify$1 = /*#__PURE__*/Object.freeze({
		default: jsonStableStringify,
		__moduleExports: jsonStableStringify
	});

	function accessor(fn, fields, name) {
	  fn.fields = fields || [];
	  fn.fname = name;
	  return fn;
	}

	function accessorName(fn) {
	  return fn == null ? null : fn.fname;
	}

	function accessorFields(fn) {
	  return fn == null ? null : fn.fields;
	}

	function error$1(message) {
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
	      if (!b) error$1('Access path missing open bracket: ' + p);
	      if (b > 0) push();
	      b = 0;
	      i = j + 1;
	    }
	  }

	  if (b) error$1('Access path missing closing bracket: ' + p);
	  if (q) error$1('Access path missing closing quote: ' + p);

	  if (j > i) {
	    j++;
	    push();
	  }

	  return path;
	}

	var isArray$1 = Array.isArray;

	function isObject(_) {
	  return _ === Object(_);
	}

	function isString(_) {
	  return typeof _ === 'string';
	}

	function $(x) {
	  return isArray$1(x) ? '[' + x.map($) + ']'
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
	  var args = [level].concat([].slice.call(input));
	  console[method].apply(console, args); // eslint-disable-line no-console
	}

	var None  = 0;
	var Error$1 = 1;
	var Warn  = 2;
	var Info  = 3;
	var Debug = 4;

	function logger(_) {
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
	      if (level >= Error$1) log('error', 'ERROR', arguments);
	      return this;
	    },
	    warn: function() {
	      if (level >= Warn) log('warn', 'WARN', arguments);
	      return this;
	    },
	    info: function() {
	      if (level >= Info) log('log', 'INFO', arguments);
	      return this;
	    },
	    debug: function() {
	      if (level >= Debug) log('log', 'DEBUG', arguments);
	      return this;
	    }
	  }
	}

	function peek(array) {
	  return array[array.length - 1];
	}

	function toNumber(_) {
	  return _ == null || _ === '' ? null : +_;
	}

	function exp(sign) {
	  return function(x) { return sign * Math.exp(x); };
	}

	function log$1(sign) {
	  return function(x) { return Math.log(sign * x); };
	}

	function pow(exponent) {
	  return function(x) {
	    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
	  };
	}

	function pan(domain, delta, lift, ground) {
	  var d0 = lift(domain[0]),
	      d1 = lift(peek(domain)),
	      dd = (d1 - d0) * delta;

	  return [
	    ground(d0 - dd),
	    ground(d1 - dd)
	  ];
	}

	function panLinear(domain, delta) {
	  return pan(domain, delta, toNumber, identity);
	}

	function panLog(domain, delta) {
	  var sign = Math.sign(domain[0]);
	  return pan(domain, delta, log$1(sign), exp(sign));
	}

	function panPow(domain, delta, exponent) {
	  return pan(domain, delta, pow(exponent), pow(1/exponent));
	}

	function zoom(domain, anchor, scale, lift, ground) {
	  var d0 = lift(domain[0]),
	      d1 = lift(peek(domain)),
	      da = anchor != null ? lift(anchor) : (d0 + d1) / 2;

	  return [
	    ground(da + (d0 - da) * scale),
	    ground(da + (d1 - da) * scale)
	  ];
	}

	function zoomLinear(domain, anchor, scale) {
	  return zoom(domain, anchor, scale, toNumber, identity);
	}

	function zoomLog(domain, anchor, scale) {
	  var sign = Math.sign(domain[0]);
	  return zoom(domain, anchor, scale, log$1(sign), exp(sign));
	}

	function zoomPow(domain, anchor, scale, exponent) {
	  return zoom(domain, anchor, scale, pow(exponent), pow(1/exponent));
	}

	function array$1(_) {
	  return _ != null ? (isArray$1(_) ? _ : [_]) : [];
	}

	function isFunction(_) {
	  return typeof _ === 'function';
	}

	function compare(fields, orders) {
	  var idx = [],
	      cmp = (fields = array$1(fields)).map(function(f, i) {
	        if (f == null) {
	          return null;
	        } else {
	          idx.push(i);
	          return isFunction(f) ? f
	            : splitAccessPath(f).map($).join('][');
	        }
	      }),
	      n = idx.length - 1,
	      ord = array$1(orders),
	      code = 'var u,v;return ',
	      i, j, f, u, v, d, t, lt, gt;

	  if (n < 0) return null;

	  for (j=0; j<=n; ++j) {
	    i = idx[j];
	    f = cmp[i];

	    if (isFunction(f)) {
	      d = 'f' + i;
	      u = '(u=this.' + d + '(a))';
	      v = '(v=this.' + d + '(b))';
	      (t = t || {})[d] = f;
	    } else {
	      u = '(u=a['+f+'])';
	      v = '(v=b['+f+'])';
	    }

	    d = '((v=v instanceof Date?+v:v),(u=u instanceof Date?+u:u))';

	    if (ord[i] !== 'descending') {
	      gt = 1;
	      lt = -1;
	    } else {
	      gt = -1;
	      lt = 1;
	    }

	    code += '(' + u+'<'+v+'||u==null)&&v!=null?' + lt
	      + ':(u>v||v==null)&&u!=null?' + gt
	      + ':'+d+'!==u&&v===v?' + lt
	      + ':v!==v&&u===u?' + gt
	      + (i < n ? ':' : ':0');
	  }

	  f = Function('a', 'b', code + ';');
	  if (t) f = f.bind(t);

	  fields = fields.reduce(function(map, field) {
	    if (isFunction(field)) {
	      (accessorFields(field) || []).forEach(function(_) { map[_] = 1; });
	    } else if (field != null) {
	      map[field + ''] = 1;
	    }
	    return map;
	  }, {});

	  return accessor(f, Object.keys(fields));
	}

	function constant(_) {
	  return isFunction(_) ? _ : function() { return _; };
	}

	function debounce(delay, handler) {
	  var tid, evt;

	  function callback() {
	    handler(evt);
	    tid = evt = null;
	  }

	  return function(e) {
	    evt = e;
	    if (tid) clearTimeout(tid);
	    tid = setTimeout(callback, delay);
	  };
	}

	function extend(_) {
	  for (var x, k, i=1, len=arguments.length; i<len; ++i) {
	    x = arguments[i];
	    for (k in x) { _[k] = x[k]; }
	  }
	  return _;
	}

	function extentIndex(array, f) {
	  var i = -1,
	      n = array.length,
	      a, b, c, u, v;

	  if (f == null) {
	    while (++i < n) {
	      b = array[i];
	      if (b != null && b >= b) {
	        a = c = b;
	        break;
	      }
	    }
	    u = v = i;
	    while (++i < n) {
	      b = array[i];
	      if (b != null) {
	        if (a > b) {
	          a = b;
	          u = i;
	        }
	        if (c < b) {
	          c = b;
	          v = i;
	        }
	      }
	    }
	  } else {
	    while (++i < n) {
	      b = f(array[i], i, array);
	      if (b != null && b >= b) {
	        a = c = b;
	        break;
	      }
	    }
	    u = v = i;
	    while (++i < n) {
	      b = f(array[i], i, array);
	      if (b != null) {
	        if (a > b) {
	          a = b;
	          u = i;
	        }
	        if (c < b) {
	          c = b;
	          v = i;
	        }
	      }
	    }
	  }

	  return [u, v];
	}

	var NULL = {};

	function fastmap(input) {
	  var obj = {},
	      map,
	      test;

	  function has(key) {
	    return obj.hasOwnProperty(key) && obj[key] !== NULL;
	  }

	  map = {
	    size: 0,
	    empty: 0,
	    object: obj,
	    has: has,
	    get: function(key) {
	      return has(key) ? obj[key] : undefined;
	    },
	    set: function(key, value) {
	      if (!has(key)) {
	        ++map.size;
	        if (obj[key] === NULL) --map.empty;
	      }
	      obj[key] = value;
	      return this;
	    },
	    delete: function(key) {
	      if (has(key)) {
	        --map.size;
	        ++map.empty;
	        obj[key] = NULL;
	      }
	      return this;
	    },
	    clear: function() {
	      map.size = map.empty = 0;
	      map.object = obj = {};
	    },
	    test: function(_) {
	      if (arguments.length) {
	        test = _;
	        return map;
	      } else {
	        return test;
	      }
	    },
	    clean: function() {
	      var next = {},
	          size = 0,
	          key, value;
	      for (key in obj) {
	        value = obj[key];
	        if (value !== NULL && (!test || !test(value))) {
	          next[key] = value;
	          ++size;
	        }
	      }
	      map.size = size;
	      map.empty = 0;
	      map.object = (obj = next);
	    }
	  };

	  if (input) Object.keys(input).forEach(function(key) {
	    map.set(key, input[key]);
	  });

	  return map;
	}

	function inherits(child, parent) {
	  var proto = (child.prototype = Object.create(parent.prototype));
	  proto.constructor = child;
	  return proto;
	}

	function isBoolean(_) {
	  return typeof _ === 'boolean';
	}

	function isDate(_) {
	  return Object.prototype.toString.call(_) === '[object Date]';
	}

	function isNumber(_) {
	  return typeof _ === 'number';
	}

	function isRegExp(_) {
	  return Object.prototype.toString.call(_) === '[object RegExp]';
	}

	function key(fields, flat) {
	  if (fields) {
	    fields = flat
	      ? array$1(fields).map(function(f) { return f.replace(/\\(.)/g, '$1'); })
	      : array$1(fields);
	  }

	  var fn = !(fields && fields.length)
	    ? function() { return ''; }
	    : Function('_', 'return \'\'+' +
	        fields.map(function(f) {
	          return '_[' + (flat
	              ? $(f)
	              : splitAccessPath(f).map($).join('][')
	            ) + ']';
	        }).join('+\'|\'+') + ';');

	  return accessor(fn, fields, 'key');
	}

	function merge(compare, array0, array1, output) {
	  var n0 = array0.length,
	      n1 = array1.length;

	  if (!n1) return array0;
	  if (!n0) return array1;

	  var merged = output || new array0.constructor(n0 + n1),
	      i0 = 0, i1 = 0, i = 0;

	  for (; i0<n0 && i1<n1; ++i) {
	    merged[i] = compare(array0[i0], array1[i1]) > 0
	       ? array1[i1++]
	       : array0[i0++];
	  }

	  for (; i0<n0; ++i0, ++i) {
	    merged[i] = array0[i0];
	  }

	  for (; i1<n1; ++i1, ++i) {
	    merged[i] = array1[i1];
	  }

	  return merged;
	}

	function repeat(str, reps) {
	  var s = '';
	  while (--reps >= 0) s += str;
	  return s;
	}

	function pad(str, length, padchar, align) {
	  var c = padchar || ' ',
	      s = str + '',
	      n = length - s.length;

	  return n <= 0 ? s
	    : align === 'left' ? repeat(c, n) + s
	    : align === 'center' ? repeat(c, ~~(n/2)) + s + repeat(c, Math.ceil(n/2))
	    : s + repeat(c, n);
	}

	function toBoolean(_) {
	  return _ == null || _ === '' ? null : !_ || _ === 'false' || _ === '0' ? false : !!_;
	}

	function defaultParser(_) {
	  return isNumber(_) ? _ : isDate(_) ? _ : Date.parse(_);
	}

	function toDate(_, parser) {
	  parser = parser || defaultParser;
	  return _ == null || _ === '' ? null : parser(_);
	}

	function toString(_) {
	  return _ == null || _ === '' ? null : _ + '';
	}

	function toSet(_) {
	  for (var s={}, i=0, n=_.length; i<n; ++i) s[_[i]] = true;
	  return s;
	}

	function truncate(str, length, align, ellipsis) {
	  var e = ellipsis != null ? ellipsis : '\u2026',
	      s = str + '',
	      n = s.length,
	      l = Math.max(0, length - e.length);

	  return n <= length ? s
	    : align === 'left' ? e + s.slice(n - l)
	    : align === 'center' ? s.slice(0, Math.ceil(l/2)) + e + s.slice(n - ~~(l/2))
	    : s.slice(0, l) + e;
	}

	function visitArray(array, filter, visitor) {
	  if (array) {
	    var i = 0, n = array.length, t;
	    if (filter) {
	      for (; i<n; ++i) {
	        if (t = filter(array[i])) visitor(t, i, array);
	      }
	    } else {
	      array.forEach(visitor);
	    }
	  }
	}



	var vegaUtil = /*#__PURE__*/Object.freeze({
		accessor: accessor,
		accessorName: accessorName,
		accessorFields: accessorFields,
		id: id,
		identity: identity,
		zero: zero,
		one: one,
		truthy: truthy,
		falsy: falsy,
		logger: logger,
		None: None,
		Error: Error$1,
		Warn: Warn,
		Info: Info,
		Debug: Debug,
		panLinear: panLinear,
		panLog: panLog,
		panPow: panPow,
		zoomLinear: zoomLinear,
		zoomLog: zoomLog,
		zoomPow: zoomPow,
		array: array$1,
		compare: compare,
		constant: constant,
		debounce: debounce,
		error: error$1,
		extend: extend,
		extentIndex: extentIndex,
		fastmap: fastmap,
		field: field,
		inherits: inherits,
		isArray: isArray$1,
		isBoolean: isBoolean,
		isDate: isDate,
		isFunction: isFunction,
		isNumber: isNumber,
		isObject: isObject,
		isRegExp: isRegExp,
		isString: isString,
		key: key,
		merge: merge,
		pad: pad,
		peek: peek,
		repeat: repeat,
		splitAccessPath: splitAccessPath,
		stringValue: $,
		toBoolean: toBoolean,
		toDate: toDate,
		toNumber: toNumber,
		toString: toString,
		toSet: toSet,
		truncate: truncate,
		visitArray: visitArray
	});

	var logical = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	function isLogicalOr(op) {
	    return !!op.or;
	}
	exports.isLogicalOr = isLogicalOr;
	function isLogicalAnd(op) {
	    return !!op.and;
	}
	exports.isLogicalAnd = isLogicalAnd;
	function isLogicalNot(op) {
	    return !!op.not;
	}
	exports.isLogicalNot = isLogicalNot;
	function forEachLeave(op, fn) {
	    if (isLogicalNot(op)) {
	        forEachLeave(op.not, fn);
	    }
	    else if (isLogicalAnd(op)) {
	        for (var _i = 0, _a = op.and; _i < _a.length; _i++) {
	            var subop = _a[_i];
	            forEachLeave(subop, fn);
	        }
	    }
	    else if (isLogicalOr(op)) {
	        for (var _b = 0, _c = op.or; _b < _c.length; _b++) {
	            var subop = _c[_b];
	            forEachLeave(subop, fn);
	        }
	    }
	    else {
	        fn(op);
	    }
	}
	exports.forEachLeave = forEachLeave;
	function normalizeLogicalOperand(op, normalizer) {
	    if (isLogicalNot(op)) {
	        return { not: normalizeLogicalOperand(op.not, normalizer) };
	    }
	    else if (isLogicalAnd(op)) {
	        return { and: op.and.map(function (o) { return normalizeLogicalOperand(o, normalizer); }) };
	    }
	    else if (isLogicalOr(op)) {
	        return { or: op.or.map(function (o) { return normalizeLogicalOperand(o, normalizer); }) };
	    }
	    else {
	        return normalizer(op);
	    }
	}
	exports.normalizeLogicalOperand = normalizeLogicalOperand;

	});

	var logical$1 = unwrapExports(logical);
	var logical_1 = logical.isLogicalOr;
	var logical_2 = logical.isLogicalAnd;
	var logical_3 = logical.isLogicalNot;
	var logical_4 = logical.forEachLeave;
	var logical_5 = logical.normalizeLogicalOperand;

	var logical$2 = /*#__PURE__*/Object.freeze({
		default: logical$1,
		__moduleExports: logical,
		isLogicalOr: logical_1,
		isLogicalAnd: logical_2,
		isLogicalNot: logical_3,
		forEachLeave: logical_4,
		normalizeLogicalOperand: logical_5
	});

	var stableStringify_ = ( jsonStableStringify$1 && jsonStableStringify ) || jsonStableStringify$1;

	var vega_util_1 = ( vegaUtil && undefined ) || vegaUtil;

	var logical_1$1 = ( logical$2 && logical$1 ) || logical$2;

	var util = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	var stableStringify = stableStringify_['default'] || stableStringify_;
	/**
	 * Creates an object composed of the picked object properties.
	 *
	 * Example:  (from lodash)
	 *
	 * var object = {'a': 1, 'b': '2', 'c': 3};
	 * pick(object, ['a', 'c']);
	 * // → {'a': 1, 'c': 3}
	 *
	 */
	function pick(obj, props) {
	    var copy = {};
	    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
	        var prop = props_1[_i];
	        if (obj.hasOwnProperty(prop)) {
	            copy[prop] = obj[prop];
	        }
	    }
	    return copy;
	}
	exports.pick = pick;
	/**
	 * The opposite of _.pick; this method creates an object composed of the own
	 * and inherited enumerable string keyed properties of object that are not omitted.
	 */
	function omit(obj, props) {
	    var copy = duplicate(obj);
	    for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
	        var prop = props_2[_i];
	        delete copy[prop];
	    }
	    return copy;
	}
	exports.omit = omit;
	/**
	 * Converts any object into a string representation that can be consumed by humans.
	 */
	exports.stringify = stableStringify;
	/**
	 * Converts any object into a string of limited size, or a number.
	 */
	function hash(a) {
	    if (vega_util_1.isNumber(a)) {
	        return a;
	    }
	    var str = vega_util_1.isString(a) ? a : stableStringify(a);
	    // short strings can be used as hash directly, longer strings are hashed to reduce memory usage
	    if (str.length < 100) {
	        return str;
	    }
	    // from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
	    var h = 0;
	    for (var i = 0; i < str.length; i++) {
	        var char = str.charCodeAt(i);
	        h = ((h << 5) - h) + char;
	        h = h & h; // Convert to 32bit integer
	    }
	    return h;
	}
	exports.hash = hash;
	function contains(array, item) {
	    return array.indexOf(item) > -1;
	}
	exports.contains = contains;
	/** Returns the array without the elements in item */
	function without(array, excludedItems) {
	    return array.filter(function (item) { return !contains(excludedItems, item); });
	}
	exports.without = without;
	function union(array, other) {
	    return array.concat(without(other, array));
	}
	exports.union = union;
	/**
	 * Returns true if any item returns true.
	 */
	function some(arr, f) {
	    var i = 0;
	    for (var k = 0; k < arr.length; k++) {
	        if (f(arr[k], k, i++)) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.some = some;
	/**
	 * Returns true if all items return true.
	 */
	function every(arr, f) {
	    var i = 0;
	    for (var k = 0; k < arr.length; k++) {
	        if (!f(arr[k], k, i++)) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.every = every;
	function flatten(arrays) {
	    return [].concat.apply([], arrays);
	}
	exports.flatten = flatten;
	/**
	 * recursively merges src into dest
	 */
	function mergeDeep(dest) {
	    var src = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        src[_i - 1] = arguments[_i];
	    }
	    for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
	        var s = src_1[_a];
	        dest = deepMerge_(dest, s);
	    }
	    return dest;
	}
	exports.mergeDeep = mergeDeep;
	// recursively merges src into dest
	function deepMerge_(dest, src) {
	    if (typeof src !== 'object' || src === null) {
	        return dest;
	    }
	    for (var p in src) {
	        if (!src.hasOwnProperty(p)) {
	            continue;
	        }
	        if (src[p] === undefined) {
	            continue;
	        }
	        if (typeof src[p] !== 'object' || vega_util_1.isArray(src[p]) || src[p] === null) {
	            dest[p] = src[p];
	        }
	        else if (typeof dest[p] !== 'object' || dest[p] === null) {
	            dest[p] = mergeDeep(vega_util_1.isArray(src[p].constructor) ? [] : {}, src[p]);
	        }
	        else {
	            mergeDeep(dest[p], src[p]);
	        }
	    }
	    return dest;
	}
	function unique(values, f) {
	    var results = [];
	    var u = {};
	    var v;
	    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
	        var val = values_1[_i];
	        v = f(val);
	        if (v in u) {
	            continue;
	        }
	        u[v] = 1;
	        results.push(val);
	    }
	    return results;
	}
	exports.unique = unique;
	/**
	 * Returns true if the two dictionaries disagree. Applies only to defined values.
	 */
	function differ(dict, other) {
	    for (var key in dict) {
	        if (dict.hasOwnProperty(key)) {
	            if (other[key] && dict[key] && other[key] !== dict[key]) {
	                return true;
	            }
	        }
	    }
	    return false;
	}
	exports.differ = differ;
	function hasIntersection(a, b) {
	    for (var key in a) {
	        if (key in b) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.hasIntersection = hasIntersection;
	function isNumeric(num) {
	    return !isNaN(num);
	}
	exports.isNumeric = isNumeric;
	function differArray(array, other) {
	    if (array.length !== other.length) {
	        return true;
	    }
	    array.sort();
	    other.sort();
	    for (var i = 0; i < array.length; i++) {
	        if (other[i] !== array[i]) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.differArray = differArray;
	// This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
	exports.keys = Object.keys;
	function vals(x) {
	    var _vals = [];
	    for (var k in x) {
	        if (x.hasOwnProperty(k)) {
	            _vals.push(x[k]);
	        }
	    }
	    return _vals;
	}
	exports.vals = vals;
	function flagKeys(f) {
	    return exports.keys(f);
	}
	exports.flagKeys = flagKeys;
	function duplicate(obj) {
	    return JSON.parse(JSON.stringify(obj));
	}
	exports.duplicate = duplicate;
	function isBoolean(b) {
	    return b === true || b === false;
	}
	exports.isBoolean = isBoolean;
	/**
	 * Convert a string into a valid variable name
	 */
	function varName(s) {
	    // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
	    var alphanumericS = s.replace(/\W/g, '_');
	    // Add _ if the string has leading numbers.
	    return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
	}
	exports.varName = varName;
	function logicalExpr(op, cb) {
	    if (logical_1$1.isLogicalNot(op)) {
	        return '!(' + logicalExpr(op.not, cb) + ')';
	    }
	    else if (logical_1$1.isLogicalAnd(op)) {
	        return '(' + op.and.map(function (and) { return logicalExpr(and, cb); }).join(') && (') + ')';
	    }
	    else if (logical_1$1.isLogicalOr(op)) {
	        return '(' + op.or.map(function (or) { return logicalExpr(or, cb); }).join(') || (') + ')';
	    }
	    else {
	        return cb(op);
	    }
	}
	exports.logicalExpr = logicalExpr;
	/**
	 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
	 */
	function deleteNestedProperty(obj, orderedProps) {
	    if (orderedProps.length === 0) {
	        return true;
	    }
	    var prop = orderedProps.shift();
	    if (deleteNestedProperty(obj[prop], orderedProps)) {
	        delete obj[prop];
	    }
	    return Object.keys(obj).length === 0;
	}
	exports.deleteNestedProperty = deleteNestedProperty;
	function titlecase(s) {
	    return s.charAt(0).toUpperCase() + s.substr(1);
	}
	exports.titlecase = titlecase;
	/**
	 * Converts a path to an access path.
	 */
	function accessPath(path) {
	    return "[" + vega_util_1.splitAccessPath(path).map(vega_util_1.stringValue).join('][') + "]";
	}
	exports.accessPath = accessPath;

	});

	var util$1 = unwrapExports(util);
	var util_1 = util.pick;
	var util_2 = util.omit;
	var util_3 = util.stringify;
	var util_4 = util.hash;
	var util_5 = util.contains;
	var util_6 = util.without;
	var util_7 = util.union;
	var util_8 = util.some;
	var util_9 = util.every;
	var util_10 = util.flatten;
	var util_11 = util.mergeDeep;
	var util_12 = util.unique;
	var util_13 = util.differ;
	var util_14 = util.hasIntersection;
	var util_15 = util.isNumeric;
	var util_16 = util.differArray;
	var util_17 = util.keys;
	var util_18 = util.vals;
	var util_19 = util.flagKeys;
	var util_20 = util.duplicate;
	var util_21 = util.isBoolean;
	var util_22 = util.varName;
	var util_23 = util.logicalExpr;
	var util_24 = util.deleteNestedProperty;
	var util_25 = util.titlecase;
	var util_26 = util.accessPath;

	var util$2 = /*#__PURE__*/Object.freeze({
		default: util$1,
		__moduleExports: util,
		pick: util_1,
		omit: util_2,
		stringify: util_3,
		hash: util_4,
		contains: util_5,
		without: util_6,
		union: util_7,
		some: util_8,
		every: util_9,
		flatten: util_10,
		mergeDeep: util_11,
		unique: util_12,
		differ: util_13,
		hasIntersection: util_14,
		isNumeric: util_15,
		differArray: util_16,
		keys: util_17,
		vals: util_18,
		flagKeys: util_19,
		duplicate: util_20,
		isBoolean: util_21,
		varName: util_22,
		logicalExpr: util_23,
		deleteNestedProperty: util_24,
		titlecase: util_25,
		accessPath: util_26
	});

	var tslib_1 = ( tslib_es6 && undefined ) || tslib_es6;

	var util$3 = ( util$2 && util$1 ) || util$2;

	var channel = createCommonjsModule(function (module, exports) {
	/*
	 * Constants and utilities for encoding channels (Visual variables)
	 * such as 'x', 'y', 'color'.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });


	var Channel;
	(function (Channel) {
	    // Facet
	    Channel.ROW = 'row';
	    Channel.COLUMN = 'column';
	    // Position
	    Channel.X = 'x';
	    Channel.Y = 'y';
	    Channel.X2 = 'x2';
	    Channel.Y2 = 'y2';
	    // Geo Position
	    Channel.LATITUDE = 'latitude';
	    Channel.LONGITUDE = 'longitude';
	    Channel.LATITUDE2 = 'latitude2';
	    Channel.LONGITUDE2 = 'longitude2';
	    // Mark property with scale
	    Channel.COLOR = 'color';
	    Channel.FILL = 'fill';
	    Channel.STROKE = 'stroke';
	    Channel.SHAPE = 'shape';
	    Channel.SIZE = 'size';
	    Channel.OPACITY = 'opacity';
	    // Non-scale channel
	    Channel.TEXT = 'text';
	    Channel.ORDER = 'order';
	    Channel.DETAIL = 'detail';
	    Channel.KEY = 'key';
	    Channel.TOOLTIP = 'tooltip';
	    Channel.HREF = 'href';
	})(Channel = exports.Channel || (exports.Channel = {}));
	exports.X = Channel.X;
	exports.Y = Channel.Y;
	exports.X2 = Channel.X2;
	exports.Y2 = Channel.Y2;
	exports.LATITUDE = Channel.LATITUDE;
	exports.LATITUDE2 = Channel.LATITUDE2;
	exports.LONGITUDE = Channel.LONGITUDE;
	exports.LONGITUDE2 = Channel.LONGITUDE2;
	exports.ROW = Channel.ROW;
	exports.COLUMN = Channel.COLUMN;
	exports.SHAPE = Channel.SHAPE;
	exports.SIZE = Channel.SIZE;
	exports.COLOR = Channel.COLOR;
	exports.FILL = Channel.FILL;
	exports.STROKE = Channel.STROKE;
	exports.TEXT = Channel.TEXT;
	exports.DETAIL = Channel.DETAIL;
	exports.KEY = Channel.KEY;
	exports.ORDER = Channel.ORDER;
	exports.OPACITY = Channel.OPACITY;
	exports.TOOLTIP = Channel.TOOLTIP;
	exports.HREF = Channel.HREF;
	exports.GEOPOSITION_CHANNEL_INDEX = {
	    longitude: 1,
	    longitude2: 1,
	    latitude: 1,
	    latitude2: 1,
	};
	exports.GEOPOSITION_CHANNELS = util$3.flagKeys(exports.GEOPOSITION_CHANNEL_INDEX);
	var UNIT_CHANNEL_INDEX = tslib_1.__assign({ 
	    // position
	    x: 1, y: 1, x2: 1, y2: 1 }, exports.GEOPOSITION_CHANNEL_INDEX, { 
	    // color
	    color: 1, fill: 1, stroke: 1, 
	    // other non-position with scale
	    opacity: 1, size: 1, shape: 1, 
	    // channels without scales
	    order: 1, text: 1, detail: 1, key: 1, tooltip: 1, href: 1 });
	function isColorChannel(channel) {
	    return channel === 'color' || channel === 'fill' || channel === 'stroke';
	}
	exports.isColorChannel = isColorChannel;
	var FACET_CHANNEL_INDEX = {
	    row: 1,
	    column: 1
	};
	var CHANNEL_INDEX = tslib_1.__assign({}, UNIT_CHANNEL_INDEX, FACET_CHANNEL_INDEX);
	exports.CHANNELS = util$3.flagKeys(CHANNEL_INDEX);
	var _o = CHANNEL_INDEX.order, _d = CHANNEL_INDEX.detail, SINGLE_DEF_CHANNEL_INDEX = tslib_1.__rest(CHANNEL_INDEX, ["order", "detail"]);
	/**
	 * Channels that cannot have an array of channelDef.
	 * model.fieldDef, getFieldDef only work for these channels.
	 *
	 * (The only two channels that can have an array of channelDefs are "detail" and "order".
	 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
	 * are not applicable for them.  Similarly, selection projection won't work with "detail" and "order".)
	 */
	exports.SINGLE_DEF_CHANNELS = util$3.flagKeys(SINGLE_DEF_CHANNEL_INDEX);
	function isChannel(str) {
	    return !!CHANNEL_INDEX[str];
	}
	exports.isChannel = isChannel;
	// CHANNELS without COLUMN, ROW
	exports.UNIT_CHANNELS = util$3.flagKeys(UNIT_CHANNEL_INDEX);
	// NONPOSITION_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
	var _x = UNIT_CHANNEL_INDEX.x, _y = UNIT_CHANNEL_INDEX.y, 
	// x2 and y2 share the same scale as x and y
	_x2 = UNIT_CHANNEL_INDEX.x2, _y2 = UNIT_CHANNEL_INDEX.y2, _latitude = UNIT_CHANNEL_INDEX.latitude, _longitude = UNIT_CHANNEL_INDEX.longitude, _latitude2 = UNIT_CHANNEL_INDEX.latitude2, _longitude2 = UNIT_CHANNEL_INDEX.longitude2, 
	// The rest of unit channels then have scale
	NONPOSITION_CHANNEL_INDEX = tslib_1.__rest(UNIT_CHANNEL_INDEX, ["x", "y", "x2", "y2", "latitude", "longitude", "latitude2", "longitude2"]);
	exports.NONPOSITION_CHANNELS = util$3.flagKeys(NONPOSITION_CHANNEL_INDEX);
	// POSITION_SCALE_CHANNELS = X and Y;
	var POSITION_SCALE_CHANNEL_INDEX = { x: 1, y: 1 };
	exports.POSITION_SCALE_CHANNELS = util$3.flagKeys(POSITION_SCALE_CHANNEL_INDEX);
	// NON_POSITION_SCALE_CHANNEL = SCALE_CHANNELS without X, Y
	var 
	// x2 and y2 share the same scale as x and y
	// text and tooltip have format instead of scale,
	// href has neither format, nor scale
	_t = NONPOSITION_CHANNEL_INDEX.text, _tt = NONPOSITION_CHANNEL_INDEX.tooltip, _hr = NONPOSITION_CHANNEL_INDEX.href, 
	// detail and order have no scale
	_dd = NONPOSITION_CHANNEL_INDEX.detail, _k = NONPOSITION_CHANNEL_INDEX.key, _oo = NONPOSITION_CHANNEL_INDEX.order, NONPOSITION_SCALE_CHANNEL_INDEX = tslib_1.__rest(NONPOSITION_CHANNEL_INDEX, ["text", "tooltip", "href", "detail", "key", "order"]);
	exports.NONPOSITION_SCALE_CHANNELS = util$3.flagKeys(NONPOSITION_SCALE_CHANNEL_INDEX);
	// Declare SCALE_CHANNEL_INDEX
	var SCALE_CHANNEL_INDEX = tslib_1.__assign({}, POSITION_SCALE_CHANNEL_INDEX, NONPOSITION_SCALE_CHANNEL_INDEX);
	/** List of channels with scales */
	exports.SCALE_CHANNELS = util$3.flagKeys(SCALE_CHANNEL_INDEX);
	function isScaleChannel(channel) {
	    return !!SCALE_CHANNEL_INDEX[channel];
	}
	exports.isScaleChannel = isScaleChannel;
	/**
	 * Return whether a channel supports a particular mark type.
	 * @param channel  channel name
	 * @param mark the mark type
	 * @return whether the mark supports the channel
	 */
	function supportMark(channel, mark) {
	    return mark in getSupportedMark(channel);
	}
	exports.supportMark = supportMark;
	/**
	 * Return a dictionary showing whether a channel supports mark type.
	 * @param channel
	 * @return A dictionary mapping mark types to boolean values.
	 */
	function getSupportedMark(channel) {
	    switch (channel) {
	        case exports.COLOR:
	        case exports.FILL:
	        case exports.STROKE:
	        case exports.DETAIL:
	        case exports.KEY:
	        case exports.TOOLTIP:
	        case exports.HREF:
	        case exports.ORDER: // TODO: revise (order might not support rect, which is not stackable?)
	        case exports.OPACITY:
	        case exports.ROW:
	        case exports.COLUMN:
	            return {
	                point: true, tick: true, rule: true, circle: true, square: true,
	                bar: true, rect: true, line: true, trail: true, area: true, text: true, geoshape: true
	            };
	        case exports.X:
	        case exports.Y:
	        case exports.LATITUDE:
	        case exports.LONGITUDE:
	            return {
	                point: true, tick: true, rule: true, circle: true, square: true,
	                bar: true, rect: true, line: true, trail: true, area: true, text: true
	            };
	        case exports.X2:
	        case exports.Y2:
	        case exports.LATITUDE2:
	        case exports.LONGITUDE2:
	            return {
	                rule: true, bar: true, rect: true, area: true
	            };
	        case exports.SIZE:
	            return {
	                point: true, tick: true, rule: true, circle: true, square: true,
	                bar: true, text: true, line: true, trail: true
	            };
	        case exports.SHAPE:
	            return { point: true, geoshape: true };
	        case exports.TEXT:
	            return { text: true };
	    }
	}
	exports.getSupportedMark = getSupportedMark;
	function rangeType(channel) {
	    switch (channel) {
	        case exports.X:
	        case exports.Y:
	        case exports.SIZE:
	        case exports.OPACITY:
	        // X2 and Y2 use X and Y scales, so they similarly have continuous range.
	        case exports.X2:
	        case exports.Y2:
	            return 'continuous';
	        case exports.ROW:
	        case exports.COLUMN:
	        case exports.SHAPE:
	        // TEXT, TOOLTIP, and HREF have no scale but have discrete output
	        case exports.TEXT:
	        case exports.TOOLTIP:
	        case exports.HREF:
	            return 'discrete';
	        // Color can be either continuous or discrete, depending on scale type.
	        case exports.COLOR:
	        case exports.FILL:
	        case exports.STROKE:
	            return 'flexible';
	        // No scale, no range type.
	        case exports.LATITUDE:
	        case exports.LONGITUDE:
	        case exports.LATITUDE2:
	        case exports.LONGITUDE2:
	        case exports.DETAIL:
	        case exports.KEY:
	        case exports.ORDER:
	            return undefined;
	    }
	    /* istanbul ignore next: should never reach here. */
	    throw new Error('rangeType not implemented for ' + channel);
	}
	exports.rangeType = rangeType;

	});

	var channel$1 = unwrapExports(channel);
	var channel_1 = channel.Channel;
	var channel_2 = channel.X;
	var channel_3 = channel.Y;
	var channel_4 = channel.X2;
	var channel_5 = channel.Y2;
	var channel_6 = channel.LATITUDE;
	var channel_7 = channel.LATITUDE2;
	var channel_8 = channel.LONGITUDE;
	var channel_9 = channel.LONGITUDE2;
	var channel_10 = channel.ROW;
	var channel_11 = channel.COLUMN;
	var channel_12 = channel.SHAPE;
	var channel_13 = channel.SIZE;
	var channel_14 = channel.COLOR;
	var channel_15 = channel.FILL;
	var channel_16 = channel.STROKE;
	var channel_17 = channel.TEXT;
	var channel_18 = channel.DETAIL;
	var channel_19 = channel.KEY;
	var channel_20 = channel.ORDER;
	var channel_21 = channel.OPACITY;
	var channel_22 = channel.TOOLTIP;
	var channel_23 = channel.HREF;
	var channel_24 = channel.GEOPOSITION_CHANNEL_INDEX;
	var channel_25 = channel.GEOPOSITION_CHANNELS;
	var channel_26 = channel.isColorChannel;
	var channel_27 = channel.CHANNELS;
	var channel_28 = channel.SINGLE_DEF_CHANNELS;
	var channel_29 = channel.isChannel;
	var channel_30 = channel.UNIT_CHANNELS;
	var channel_31 = channel.NONPOSITION_CHANNELS;
	var channel_32 = channel.POSITION_SCALE_CHANNELS;
	var channel_33 = channel.NONPOSITION_SCALE_CHANNELS;
	var channel_34 = channel.SCALE_CHANNELS;
	var channel_35 = channel.isScaleChannel;
	var channel_36 = channel.supportMark;
	var channel_37 = channel.getSupportedMark;
	var channel_38 = channel.rangeType;

	var channel$2 = /*#__PURE__*/Object.freeze({
		default: channel$1,
		__moduleExports: channel,
		Channel: channel_1,
		X: channel_2,
		Y: channel_3,
		X2: channel_4,
		Y2: channel_5,
		LATITUDE: channel_6,
		LATITUDE2: channel_7,
		LONGITUDE: channel_8,
		LONGITUDE2: channel_9,
		ROW: channel_10,
		COLUMN: channel_11,
		SHAPE: channel_12,
		SIZE: channel_13,
		COLOR: channel_14,
		FILL: channel_15,
		STROKE: channel_16,
		TEXT: channel_17,
		DETAIL: channel_18,
		KEY: channel_19,
		ORDER: channel_20,
		OPACITY: channel_21,
		TOOLTIP: channel_22,
		HREF: channel_23,
		GEOPOSITION_CHANNEL_INDEX: channel_24,
		GEOPOSITION_CHANNELS: channel_25,
		isColorChannel: channel_26,
		CHANNELS: channel_27,
		SINGLE_DEF_CHANNELS: channel_28,
		isChannel: channel_29,
		UNIT_CHANNELS: channel_30,
		NONPOSITION_CHANNELS: channel_31,
		POSITION_SCALE_CHANNELS: channel_32,
		NONPOSITION_SCALE_CHANNELS: channel_33,
		SCALE_CHANNELS: channel_34,
		isScaleChannel: channel_35,
		supportMark: channel_36,
		getSupportedMark: channel_37,
		rangeType: channel_38
	});

	var axis = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	exports.AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
	/**
	 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
	 * (Properties not listed are applicable for both)
	 */
	exports.AXIS_PROPERTY_TYPE = {
	    grid: 'grid',
	    gridScale: 'grid',
	    domain: 'main',
	    labels: 'main',
	    labelFlush: 'main',
	    labelOverlap: 'main',
	    minExtent: 'main',
	    maxExtent: 'main',
	    offset: 'main',
	    ticks: 'main',
	    title: 'main',
	    values: 'both',
	    scale: 'both',
	    zindex: 'both' // this is actually set afterward, so it doesn't matter
	};
	var COMMON_AXIS_PROPERTIES_INDEX = {
	    orient: 1,
	    domain: 1,
	    format: 1,
	    grid: 1,
	    labelBound: 1,
	    labelFlush: 1,
	    labelPadding: 1,
	    labels: 1,
	    labelOverlap: 1,
	    maxExtent: 1,
	    minExtent: 1,
	    offset: 1,
	    position: 1,
	    tickCount: 1,
	    ticks: 1,
	    tickSize: 1,
	    title: 1,
	    titlePadding: 1,
	    values: 1,
	    zindex: 1,
	};
	var AXIS_PROPERTIES_INDEX = tslib_1.__assign({}, COMMON_AXIS_PROPERTIES_INDEX, { encoding: 1, labelAngle: 1, titleMaxLength: 1 });
	var VG_AXIS_PROPERTIES_INDEX = tslib_1.__assign({ scale: 1 }, COMMON_AXIS_PROPERTIES_INDEX, { gridScale: 1, encode: 1 });
	function isAxisProperty(prop) {
	    return !!AXIS_PROPERTIES_INDEX[prop];
	}
	exports.isAxisProperty = isAxisProperty;
	exports.VG_AXIS_PROPERTIES = util$3.flagKeys(VG_AXIS_PROPERTIES_INDEX);
	// Export for dependent projects
	exports.AXIS_PROPERTIES = util$3.flagKeys(AXIS_PROPERTIES_INDEX);

	});

	var axis$1 = unwrapExports(axis);
	var axis_1 = axis.AXIS_PARTS;
	var axis_2 = axis.AXIS_PROPERTY_TYPE;
	var axis_3 = axis.isAxisProperty;
	var axis_4 = axis.VG_AXIS_PROPERTIES;
	var axis_5 = axis.AXIS_PROPERTIES;

	var axis$2 = /*#__PURE__*/Object.freeze({
		default: axis$1,
		__moduleExports: axis,
		AXIS_PARTS: axis_1,
		AXIS_PROPERTY_TYPE: axis_2,
		isAxisProperty: axis_3,
		VG_AXIS_PROPERTIES: axis_4,
		AXIS_PROPERTIES: axis_5
	});

	var log$2 = createCommonjsModule(function (module, exports) {
	/**
	 * Vega-Lite's singleton logger utility.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * Main (default) Vega Logger instance for Vega-Lite
	 */
	var main = vega_util_1.logger(vega_util_1.Warn);
	var current = main;
	/**
	 * Logger tool for checking if the code throws correct warning
	 */
	var LocalLogger = /** @class */ (function () {
	    function LocalLogger() {
	        this.warns = [];
	        this.infos = [];
	        this.debugs = [];
	    }
	    LocalLogger.prototype.level = function () {
	        return this;
	    };
	    LocalLogger.prototype.warn = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        (_a = this.warns).push.apply(_a, args);
	        return this;
	        var _a;
	    };
	    LocalLogger.prototype.info = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        (_a = this.infos).push.apply(_a, args);
	        return this;
	        var _a;
	    };
	    LocalLogger.prototype.debug = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        (_a = this.debugs).push.apply(_a, args);
	        return this;
	        var _a;
	    };
	    return LocalLogger;
	}());
	exports.LocalLogger = LocalLogger;
	function wrap(f) {
	    return function () {
	        current = new LocalLogger();
	        f(current);
	        reset();
	    };
	}
	exports.wrap = wrap;
	/**
	 * Set the singleton logger to be a custom logger
	 */
	function set(newLogger) {
	    current = newLogger;
	    return current;
	}
	exports.set = set;
	/**
	 * Reset the main logger to use the default Vega Logger
	 */
	function reset() {
	    current = main;
	    return current;
	}
	exports.reset = reset;
	function warn() {
	    var _ = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        _[_i] = arguments[_i];
	    }
	    current.warn.apply(current, arguments);
	}
	exports.warn = warn;
	function info() {
	    var _ = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        _[_i] = arguments[_i];
	    }
	    current.info.apply(current, arguments);
	}
	exports.info = info;
	function debug() {
	    var _ = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        _[_i] = arguments[_i];
	    }
	    current.debug.apply(current, arguments);
	}
	exports.debug = debug;
	/**
	 * Collection of all Vega-Lite Error Messages
	 */
	var message;
	(function (message) {
	    message.INVALID_SPEC = 'Invalid spec';
	    // FIT
	    message.FIT_NON_SINGLE = 'Autosize "fit" only works for single views and layered views.';
	    message.CANNOT_FIX_RANGE_STEP_WITH_FIT = 'Cannot use a fixed value of "rangeStep" when "autosize" is "fit".';
	    // SELECTION
	    function cannotProjectOnChannelWithoutField(channel) {
	        return "Cannot project a selection on encoding channel \"" + channel + "\", which has no field.";
	    }
	    message.cannotProjectOnChannelWithoutField = cannotProjectOnChannelWithoutField;
	    function nearestNotSupportForContinuous(mark) {
	        return "The \"nearest\" transform is not supported for " + mark + " marks.";
	    }
	    message.nearestNotSupportForContinuous = nearestNotSupportForContinuous;
	    function selectionNotFound(name) {
	        return "Cannot find a selection named \"" + name + "\"";
	    }
	    message.selectionNotFound = selectionNotFound;
	    message.SCALE_BINDINGS_CONTINUOUS = 'Scale bindings are currently only supported for scales with unbinned, continuous domains.';
	    // REPEAT
	    function noSuchRepeatedValue(field) {
	        return "Unknown repeated value \"" + field + "\".";
	    }
	    message.noSuchRepeatedValue = noSuchRepeatedValue;
	    // CONCAT
	    message.CONCAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in concatenated views.';
	    // REPEAT
	    message.REPEAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in repeated views.';
	    // TITLE
	    function cannotSetTitleAnchor(type) {
	        return "Cannot set title \"anchor\" for a " + type + " spec";
	    }
	    message.cannotSetTitleAnchor = cannotSetTitleAnchor;
	    // DATA
	    function unrecognizedParse(p) {
	        return "Unrecognized parse \"" + p + "\".";
	    }
	    message.unrecognizedParse = unrecognizedParse;
	    function differentParse(field, local, ancestor) {
	        return "An ancestor parsed field \"" + field + "\" as " + ancestor + " but a child wants to parse the field as " + local + ".";
	    }
	    message.differentParse = differentParse;
	    // TRANSFORMS
	    function invalidTransformIgnored(transform) {
	        return "Ignoring an invalid transform: " + util$3.stringify(transform) + ".";
	    }
	    message.invalidTransformIgnored = invalidTransformIgnored;
	    message.NO_FIELDS_NEEDS_AS = 'If "from.fields" is not specified, "as" has to be a string that specifies the key to be used for the data from the secondary source.';
	    // ENCODING & FACET
	    function encodingOverridden(channels) {
	        return "Layer's shared " + channels.join(',') + " channel " + (channels.length === 1 ? 'is' : 'are') + " overriden";
	    }
	    message.encodingOverridden = encodingOverridden;
	    function projectionOverridden(opt) {
	        var parentProjection = opt.parentProjection, projection = opt.projection;
	        return "Layer's shared projection " + util$3.stringify(parentProjection) + " is overridden by a child projection " + util$3.stringify(projection) + ".";
	    }
	    message.projectionOverridden = projectionOverridden;
	    function primitiveChannelDef(channel, type, value) {
	        return "Channel " + channel + " is a " + type + ". Converted to {value: " + util$3.stringify(value) + "}.";
	    }
	    message.primitiveChannelDef = primitiveChannelDef;
	    function invalidFieldType(type) {
	        return "Invalid field type \"" + type + "\"";
	    }
	    message.invalidFieldType = invalidFieldType;
	    function nonZeroScaleUsedWithLengthMark(mark, channel, opt) {
	        var scaleText = opt.scaleType ? opt.scaleType + " scale" :
	            opt.zeroFalse ? 'scale with zero=false' :
	                'scale with custom domain that excludes zero';
	        return "A " + scaleText + " is used with " + mark + " mark. This can be misleading as the " + (channel === 'x' ? 'width' : 'height') + " of the " + mark + " can be arbitrary based on the scale domain. You may want to use point mark instead.";
	    }
	    message.nonZeroScaleUsedWithLengthMark = nonZeroScaleUsedWithLengthMark;
	    function invalidFieldTypeForCountAggregate(type, aggregate) {
	        return "Invalid field type \"" + type + "\" for aggregate: \"" + aggregate + "\", using \"quantitative\" instead.";
	    }
	    message.invalidFieldTypeForCountAggregate = invalidFieldTypeForCountAggregate;
	    function invalidAggregate(aggregate) {
	        return "Invalid aggregation operator \"" + aggregate + "\"";
	    }
	    message.invalidAggregate = invalidAggregate;
	    function emptyOrInvalidFieldType(type, channel, newType) {
	        return "Invalid field type \"" + type + "\" for channel \"" + channel + "\", using \"" + newType + "\" instead.";
	    }
	    message.emptyOrInvalidFieldType = emptyOrInvalidFieldType;
	    function droppingColor(type, opt) {
	        var fill = opt.fill, stroke = opt.stroke;
	        return "Dropping color " + type + " as the plot also has " + (fill && stroke ? 'fill and stroke' : fill ? 'fill' : 'stroke');
	    }
	    message.droppingColor = droppingColor;
	    function emptyFieldDef(fieldDef, channel) {
	        return "Dropping " + util$3.stringify(fieldDef) + " from channel \"" + channel + "\" since it does not contain data field or value.";
	    }
	    message.emptyFieldDef = emptyFieldDef;
	    function latLongDeprecated(channel, type, newChannel) {
	        return channel + "-encoding with type " + type + " is deprecated. Replacing with " + newChannel + "-encoding.";
	    }
	    message.latLongDeprecated = latLongDeprecated;
	    message.LINE_WITH_VARYING_SIZE = 'Line marks cannot encode size with a non-groupby field. You may want to use trail marks instead.';
	    function incompatibleChannel(channel, markOrFacet, when) {
	        return channel + " dropped as it is incompatible with \"" + markOrFacet + "\"" + (when ? " when " + when : '') + ".";
	    }
	    message.incompatibleChannel = incompatibleChannel;
	    function invalidEncodingChannel(channel) {
	        return channel + "-encoding is dropped as " + channel + " is not a valid encoding channel.";
	    }
	    message.invalidEncodingChannel = invalidEncodingChannel;
	    function facetChannelShouldBeDiscrete(channel) {
	        return channel + " encoding should be discrete (ordinal / nominal / binned).";
	    }
	    message.facetChannelShouldBeDiscrete = facetChannelShouldBeDiscrete;
	    function discreteChannelCannotEncode(channel, type) {
	        return "Using discrete channel \"" + channel + "\" to encode \"" + type + "\" field can be misleading as it does not encode " + (type === 'ordinal' ? 'order' : 'magnitude') + ".";
	    }
	    message.discreteChannelCannotEncode = discreteChannelCannotEncode;
	    // Mark
	    message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';
	    function lineWithRange(hasX2, hasY2) {
	        var channels = hasX2 && hasY2 ? 'x2 and y2' : hasX2 ? 'x2' : 'y2';
	        return "Line mark is for continuous lines and thus cannot be used with " + channels + ". We will use the rule mark (line segments) instead.";
	    }
	    message.lineWithRange = lineWithRange;
	    function unclearOrientContinuous(mark) {
	        return "Cannot clearly determine orientation for \"" + mark + "\" since both x and y channel encode continuous fields. In this case, we use vertical by default";
	    }
	    message.unclearOrientContinuous = unclearOrientContinuous;
	    function unclearOrientDiscreteOrEmpty(mark) {
	        return "Cannot clearly determine orientation for \"" + mark + "\" since both x and y channel encode discrete or empty fields.";
	    }
	    message.unclearOrientDiscreteOrEmpty = unclearOrientDiscreteOrEmpty;
	    function orientOverridden(original, actual) {
	        return "Specified orient \"" + original + "\" overridden with \"" + actual + "\"";
	    }
	    message.orientOverridden = orientOverridden;
	    // SCALE
	    message.CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';
	    function cannotUseScalePropertyWithNonColor(prop) {
	        return "Cannot use the scale property \"" + prop + "\" with non-color channel.";
	    }
	    message.cannotUseScalePropertyWithNonColor = cannotUseScalePropertyWithNonColor;
	    function unaggregateDomainHasNoEffectForRawField(fieldDef) {
	        return "Using unaggregated domain with raw field has no effect (" + util$3.stringify(fieldDef) + ").";
	    }
	    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
	    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
	        return "Unaggregated domain not applicable for \"" + aggregate + "\" since it produces values outside the origin domain of the source data.";
	    }
	    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
	    function unaggregatedDomainWithLogScale(fieldDef) {
	        return "Unaggregated domain is currently unsupported for log scale (" + util$3.stringify(fieldDef) + ").";
	    }
	    message.unaggregatedDomainWithLogScale = unaggregatedDomainWithLogScale;
	    function cannotUseSizeFieldWithBandSize(positionChannel) {
	        return "Using size field when " + positionChannel + "-channel has a band scale is not supported.";
	    }
	    message.cannotUseSizeFieldWithBandSize = cannotUseSizeFieldWithBandSize;
	    function cannotApplySizeToNonOrientedMark(mark) {
	        return "Cannot apply size to non-oriented mark \"" + mark + "\".";
	    }
	    message.cannotApplySizeToNonOrientedMark = cannotApplySizeToNonOrientedMark;
	    function rangeStepDropped(channel) {
	        return "rangeStep for \"" + channel + "\" is dropped as top-level " + (channel === 'x' ? 'width' : 'height') + " is provided.";
	    }
	    message.rangeStepDropped = rangeStepDropped;
	    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
	        return "Channel \"" + channel + "\" does not work with \"" + scaleType + "\" scale. We are using \"" + defaultScaleType + "\" scale instead.";
	    }
	    message.scaleTypeNotWorkWithChannel = scaleTypeNotWorkWithChannel;
	    function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
	        return "FieldDef does not work with \"" + scaleType + "\" scale. We are using \"" + defaultScaleType + "\" scale instead.";
	    }
	    message.scaleTypeNotWorkWithFieldDef = scaleTypeNotWorkWithFieldDef;
	    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
	        return channel + "-scale's \"" + propName + "\" is dropped as it does not work with " + scaleType + " scale.";
	    }
	    message.scalePropertyNotWorkWithScaleType = scalePropertyNotWorkWithScaleType;
	    function scaleTypeNotWorkWithMark(mark, scaleType) {
	        return "Scale type \"" + scaleType + "\" does not work with mark \"" + mark + "\".";
	    }
	    message.scaleTypeNotWorkWithMark = scaleTypeNotWorkWithMark;
	    function mergeConflictingProperty(property, propertyOf, v1, v2) {
	        return "Conflicting " + propertyOf + " property \"" + property + "\" (" + util$3.stringify(v1) + " and " + util$3.stringify(v2) + ").  Using " + util$3.stringify(v1) + ".";
	    }
	    message.mergeConflictingProperty = mergeConflictingProperty;
	    function independentScaleMeansIndependentGuide(channel) {
	        return "Setting the scale to be independent for \"" + channel + "\" means we also have to set the guide (axis or legend) to be independent.";
	    }
	    message.independentScaleMeansIndependentGuide = independentScaleMeansIndependentGuide;
	    function conflictedDomain(channel) {
	        return "Cannot set " + channel + "-scale's \"domain\" as it is binned. Please use \"bin\"'s \"extent\" instead.";
	    }
	    message.conflictedDomain = conflictedDomain;
	    function domainSortDropped(sort) {
	        return "Dropping sort property " + util$3.stringify(sort) + " as unioned domains only support boolean or op 'count'.";
	    }
	    message.domainSortDropped = domainSortDropped;
	    message.UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
	    message.MORE_THAN_ONE_SORT = 'Domains that should be unioned has conflicting sort properties. Sort will be set to true.';
	    // AXIS
	    message.INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
	    // STACK
	    function cannotStackRangedMark(channel) {
	        return "Cannot stack \"" + channel + "\" if there is already \"" + channel + "2\"";
	    }
	    message.cannotStackRangedMark = cannotStackRangedMark;
	    function cannotStackNonLinearScale(scaleType) {
	        return "Cannot stack non-linear scale (" + scaleType + ")";
	    }
	    message.cannotStackNonLinearScale = cannotStackNonLinearScale;
	    function stackNonSummativeAggregate(aggregate) {
	        return "Stacking is applied even though the aggregate function is non-summative (\"" + aggregate + "\")";
	    }
	    message.stackNonSummativeAggregate = stackNonSummativeAggregate;
	    // TIMEUNIT
	    function invalidTimeUnit(unitName, value) {
	        return "Invalid " + unitName + ": " + util$3.stringify(value);
	    }
	    message.invalidTimeUnit = invalidTimeUnit;
	    function dayReplacedWithDate(fullTimeUnit) {
	        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " + fullTimeUnit.replace('day', 'date') + ".";
	    }
	    message.dayReplacedWithDate = dayReplacedWithDate;
	    function droppedDay(d) {
	        return "Dropping day from datetime " + util$3.stringify(d) + " as day cannot be combined with other units.";
	    }
	    message.droppedDay = droppedDay;
	})(message = exports.message || (exports.message = {}));

	});

	var log$3 = unwrapExports(log$2);
	var log_1 = log$2.LocalLogger;
	var log_2 = log$2.wrap;
	var log_3 = log$2.set;
	var log_4 = log$2.reset;
	var log_5 = log$2.warn;
	var log_6 = log$2.info;
	var log_7 = log$2.debug;
	var log_8 = log$2.message;

	var log$4 = /*#__PURE__*/Object.freeze({
		default: log$3,
		__moduleExports: log$2,
		LocalLogger: log_1,
		wrap: log_2,
		set: log_3,
		reset: log_4,
		warn: log_5,
		info: log_6,
		debug: log_7,
		message: log_8
	});

	var channel_1$1 = ( channel$2 && channel$1 ) || channel$2;

	var log$5 = ( log$4 && log$3 ) || log$4;

	var scale = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });





	var ScaleType;
	(function (ScaleType) {
	    // Continuous - Quantitative
	    ScaleType.LINEAR = 'linear';
	    ScaleType.BIN_LINEAR = 'bin-linear';
	    ScaleType.LOG = 'log';
	    ScaleType.POW = 'pow';
	    ScaleType.SQRT = 'sqrt';
	    // Continuous - Time
	    ScaleType.TIME = 'time';
	    ScaleType.UTC = 'utc';
	    // sequential
	    ScaleType.SEQUENTIAL = 'sequential';
	    // Quantile, Quantize, threshold
	    ScaleType.QUANTILE = 'quantile';
	    ScaleType.QUANTIZE = 'quantize';
	    ScaleType.THRESHOLD = 'threshold';
	    ScaleType.ORDINAL = 'ordinal';
	    ScaleType.BIN_ORDINAL = 'bin-ordinal';
	    ScaleType.POINT = 'point';
	    ScaleType.BAND = 'band';
	})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
	/**
	 * Index for scale categories -- only scale of the same categories can be merged together.
	 * Current implementation is trying to be conservative and avoid merging scale type that might not work together
	 */
	var SCALE_CATEGORY_INDEX = {
	    linear: 'numeric',
	    log: 'numeric',
	    pow: 'numeric',
	    sqrt: 'numeric',
	    'bin-linear': 'bin-linear',
	    time: 'time',
	    utc: 'time',
	    sequential: 'sequential',
	    ordinal: 'ordinal',
	    'bin-ordinal': 'bin-ordinal',
	    point: 'ordinal-position',
	    band: 'ordinal-position'
	};
	exports.SCALE_TYPES = util$3.keys(SCALE_CATEGORY_INDEX);
	/**
	 * Whether the two given scale types can be merged together.
	 */
	function scaleCompatible(scaleType1, scaleType2) {
	    var scaleCategory1 = SCALE_CATEGORY_INDEX[scaleType1];
	    var scaleCategory2 = SCALE_CATEGORY_INDEX[scaleType2];
	    return scaleCategory1 === scaleCategory2 ||
	        (scaleCategory1 === 'ordinal-position' && scaleCategory2 === 'time') ||
	        (scaleCategory2 === 'ordinal-position' && scaleCategory1 === 'time');
	}
	exports.scaleCompatible = scaleCompatible;
	/**
	 * Index for scale precedence -- high score = higher priority for merging.
	 */
	var SCALE_PRECEDENCE_INDEX = {
	    // numeric
	    linear: 0,
	    log: 1,
	    pow: 1,
	    sqrt: 1,
	    // time
	    time: 0,
	    utc: 0,
	    // ordinal-position -- these have higher precedence than continuous scales as they support more types of data
	    point: 10,
	    band: 11,
	    // non grouped types
	    'bin-linear': 0,
	    sequential: 0,
	    ordinal: 0,
	    'bin-ordinal': 0,
	};
	/**
	 * Return scale categories -- only scale of the same categories can be merged together.
	 */
	function scaleTypePrecedence(scaleType) {
	    return SCALE_PRECEDENCE_INDEX[scaleType];
	}
	exports.scaleTypePrecedence = scaleTypePrecedence;
	exports.CONTINUOUS_TO_CONTINUOUS_SCALES = ['linear', 'bin-linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
	var CONTINUOUS_TO_CONTINUOUS_INDEX = vega_util_1.toSet(exports.CONTINUOUS_TO_CONTINUOUS_SCALES);
	exports.CONTINUOUS_DOMAIN_SCALES = exports.CONTINUOUS_TO_CONTINUOUS_SCALES.concat(['sequential' /* TODO add 'quantile', 'quantize', 'threshold'*/]);
	var CONTINUOUS_DOMAIN_INDEX = vega_util_1.toSet(exports.CONTINUOUS_DOMAIN_SCALES);
	exports.DISCRETE_DOMAIN_SCALES = ['ordinal', 'bin-ordinal', 'point', 'band'];
	var DISCRETE_DOMAIN_INDEX = vega_util_1.toSet(exports.DISCRETE_DOMAIN_SCALES);
	var BIN_SCALES_INDEX = vega_util_1.toSet(['bin-linear', 'bin-ordinal']);
	exports.TIME_SCALE_TYPES = ['time', 'utc'];
	function hasDiscreteDomain(type) {
	    return type in DISCRETE_DOMAIN_INDEX;
	}
	exports.hasDiscreteDomain = hasDiscreteDomain;
	function isBinScale(type) {
	    return type in BIN_SCALES_INDEX;
	}
	exports.isBinScale = isBinScale;
	function hasContinuousDomain(type) {
	    return type in CONTINUOUS_DOMAIN_INDEX;
	}
	exports.hasContinuousDomain = hasContinuousDomain;
	function isContinuousToContinuous(type) {
	    return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
	}
	exports.isContinuousToContinuous = isContinuousToContinuous;
	exports.defaultScaleConfig = {
	    textXRangeStep: 90,
	    rangeStep: 21,
	    pointPadding: 0.5,
	    bandPaddingInner: 0.1,
	    facetSpacing: 16,
	    minBandSize: 2,
	    minFontSize: 8,
	    maxFontSize: 40,
	    minOpacity: 0.3,
	    maxOpacity: 0.8,
	    // FIXME: revise if these *can* become ratios of rangeStep
	    minSize: 9,
	    minStrokeWidth: 1,
	    maxStrokeWidth: 4
	};
	function isExtendedScheme(scheme) {
	    return scheme && !!scheme['name'];
	}
	exports.isExtendedScheme = isExtendedScheme;
	function isSelectionDomain(domain) {
	    return domain && domain['selection'];
	}
	exports.isSelectionDomain = isSelectionDomain;
	var SCALE_PROPERTY_INDEX = {
	    type: 1,
	    domain: 1,
	    range: 1,
	    rangeStep: 1,
	    scheme: 1,
	    // Other properties
	    reverse: 1,
	    round: 1,
	    // quantitative / time
	    clamp: 1,
	    nice: 1,
	    // quantitative
	    base: 1,
	    exponent: 1,
	    interpolate: 1,
	    zero: 1,
	    // band/point
	    padding: 1,
	    paddingInner: 1,
	    paddingOuter: 1
	};
	exports.SCALE_PROPERTIES = util$3.flagKeys(SCALE_PROPERTY_INDEX);
	var NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX = tslib_1.__rest(SCALE_PROPERTY_INDEX, ["type", "domain", "range", "rangeStep", "scheme"]);
	exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = util$3.flagKeys(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX);
	function scaleTypeSupportProperty(scaleType, propName) {
	    switch (propName) {
	        case 'type':
	        case 'domain':
	        case 'reverse':
	        case 'range':
	            return true;
	        case 'scheme':
	            return util$3.contains(['sequential', 'ordinal', 'bin-ordinal', 'quantile', 'quantize'], scaleType);
	        case 'interpolate':
	            // FIXME(https://github.com/vega/vega-lite/issues/2902) how about ordinal?
	            return util$3.contains(['linear', 'bin-linear', 'pow', 'log', 'sqrt', 'utc', 'time'], scaleType);
	        case 'round':
	            return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
	        case 'padding':
	            return isContinuousToContinuous(scaleType) || util$3.contains(['point', 'band'], scaleType);
	        case 'paddingOuter':
	        case 'rangeStep':
	            return util$3.contains(['point', 'band'], scaleType);
	        case 'paddingInner':
	            return scaleType === 'band';
	        case 'clamp':
	            return isContinuousToContinuous(scaleType) || scaleType === 'sequential';
	        case 'nice':
	            return isContinuousToContinuous(scaleType) || scaleType === 'sequential' || scaleType === 'quantize';
	        case 'exponent':
	            return scaleType === 'pow';
	        case 'base':
	            return scaleType === 'log';
	        case 'zero':
	            return hasContinuousDomain(scaleType) && !util$3.contains([
	                'log',
	                'time', 'utc',
	                'bin-linear',
	                'threshold',
	                'quantile' // quantile depends on distribution so zero does not matter
	            ], scaleType);
	    }
	    /* istanbul ignore next: should never reach here*/
	    throw new Error("Invalid scale property " + propName + ".");
	}
	exports.scaleTypeSupportProperty = scaleTypeSupportProperty;
	/**
	 * Returns undefined if the input channel supports the input scale property name
	 */
	function channelScalePropertyIncompatability(channel, propName) {
	    switch (propName) {
	        case 'interpolate':
	        case 'scheme':
	            if (!channel_1$1.isColorChannel(channel)) {
	                return log$5.message.cannotUseScalePropertyWithNonColor(channel);
	            }
	            return undefined;
	        case 'type':
	        case 'domain':
	        case 'range':
	        case 'base':
	        case 'exponent':
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
	    throw new Error("Invalid scale property \"" + propName + "\".");
	}
	exports.channelScalePropertyIncompatability = channelScalePropertyIncompatability;
	function channelSupportScaleType(channel, scaleType) {
	    switch (channel) {
	        case channel_1$1.Channel.X:
	        case channel_1$1.Channel.Y:
	        case channel_1$1.Channel.SIZE: // TODO: size and opacity can support ordinal with more modification
	        case channel_1$1.Channel.OPACITY:
	            // Although it generally doesn't make sense to use band with size and opacity,
	            // it can also work since we use band: 0.5 to get midpoint.
	            return isContinuousToContinuous(scaleType) || util$3.contains(['band', 'point'], scaleType);
	        case channel_1$1.Channel.COLOR:
	        case channel_1$1.Channel.FILL:
	        case channel_1$1.Channel.STROKE:
	            return scaleType !== 'band'; // band does not make sense with color
	        case channel_1$1.Channel.SHAPE:
	            return scaleType === 'ordinal'; // shape = lookup only
	    }
	    /* istanbul ignore next: it should never reach here */
	    return false;
	}
	exports.channelSupportScaleType = channelSupportScaleType;

	});

	var scale$1 = unwrapExports(scale);
	var scale_1 = scale.ScaleType;
	var scale_2 = scale.SCALE_TYPES;
	var scale_3 = scale.scaleCompatible;
	var scale_4 = scale.scaleTypePrecedence;
	var scale_5 = scale.CONTINUOUS_TO_CONTINUOUS_SCALES;
	var scale_6 = scale.CONTINUOUS_DOMAIN_SCALES;
	var scale_7 = scale.DISCRETE_DOMAIN_SCALES;
	var scale_8 = scale.TIME_SCALE_TYPES;
	var scale_9 = scale.hasDiscreteDomain;
	var scale_10 = scale.isBinScale;
	var scale_11 = scale.hasContinuousDomain;
	var scale_12 = scale.isContinuousToContinuous;
	var scale_13 = scale.defaultScaleConfig;
	var scale_14 = scale.isExtendedScheme;
	var scale_15 = scale.isSelectionDomain;
	var scale_16 = scale.SCALE_PROPERTIES;
	var scale_17 = scale.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES;
	var scale_18 = scale.scaleTypeSupportProperty;
	var scale_19 = scale.channelScalePropertyIncompatability;
	var scale_20 = scale.channelSupportScaleType;

	var scale$2 = /*#__PURE__*/Object.freeze({
		default: scale$1,
		__moduleExports: scale,
		ScaleType: scale_1,
		SCALE_TYPES: scale_2,
		scaleCompatible: scale_3,
		scaleTypePrecedence: scale_4,
		CONTINUOUS_TO_CONTINUOUS_SCALES: scale_5,
		CONTINUOUS_DOMAIN_SCALES: scale_6,
		DISCRETE_DOMAIN_SCALES: scale_7,
		TIME_SCALE_TYPES: scale_8,
		hasDiscreteDomain: scale_9,
		isBinScale: scale_10,
		hasContinuousDomain: scale_11,
		isContinuousToContinuous: scale_12,
		defaultScaleConfig: scale_13,
		isExtendedScheme: scale_14,
		isSelectionDomain: scale_15,
		SCALE_PROPERTIES: scale_16,
		NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: scale_17,
		scaleTypeSupportProperty: scale_18,
		channelScalePropertyIncompatability: scale_19,
		channelSupportScaleType: scale_20
	});

	var legend = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	exports.defaultLegendConfig = {};
	var COMMON_LEGEND_PROPERTY_INDEX = {
	    entryPadding: 1,
	    format: 1,
	    offset: 1,
	    orient: 1,
	    padding: 1,
	    tickCount: 1,
	    title: 1,
	    type: 1,
	    values: 1,
	    zindex: 1
	};
	var VG_LEGEND_PROPERTY_INDEX = tslib_1.__assign({}, COMMON_LEGEND_PROPERTY_INDEX, { 
	    // channel scales
	    opacity: 1, shape: 1, stroke: 1, fill: 1, size: 1, 
	    // encode
	    encode: 1 });
	exports.LEGEND_PROPERTIES = util$3.flagKeys(COMMON_LEGEND_PROPERTY_INDEX);
	exports.VG_LEGEND_PROPERTIES = util$3.flagKeys(VG_LEGEND_PROPERTY_INDEX);

	});

	var legend$1 = unwrapExports(legend);
	var legend_1 = legend.defaultLegendConfig;
	var legend_2 = legend.LEGEND_PROPERTIES;
	var legend_3 = legend.VG_LEGEND_PROPERTIES;

	var legend$2 = /*#__PURE__*/Object.freeze({
		default: legend$1,
		__moduleExports: legend,
		defaultLegendConfig: legend_1,
		LEGEND_PROPERTIES: legend_2,
		VG_LEGEND_PROPERTIES: legend_3
	});

	var axis_1$1 = ( axis$2 && axis$1 ) || axis$2;

	var scale_1$1 = ( scale$2 && scale$1 ) || scale$2;

	var legend_1$1 = ( legend$2 && legend$1 ) || legend$2;

	var property = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });




	function isEncodingNestedProp(p) {
	    return !!p['parent'];
	}
	exports.isEncodingNestedProp = isEncodingNestedProp;
	var ENCODING_TOPLEVEL_PROP_INDEX = {
	    channel: 1,
	    aggregate: 1, autoCount: 1, bin: 1, timeUnit: 1, hasFn: 1,
	    sort: 1, stack: 1,
	    field: 1, type: 1,
	    format: 1, scale: 1, axis: 1, legend: 1,
	    value: 1
	};
	exports.ENCODING_TOPLEVEL_PROPS = util$3.flagKeys(ENCODING_TOPLEVEL_PROP_INDEX);
	function isEncodingTopLevelProperty(p) {
	    return p in ENCODING_TOPLEVEL_PROP_INDEX;
	}
	exports.isEncodingTopLevelProperty = isEncodingTopLevelProperty;
	var ENCODING_NESTED_PROP_PARENT_INDEX = {
	    bin: 1,
	    scale: 1,
	    sort: 1,
	    axis: 1,
	    legend: 1
	};
	function isEncodingNestedParent(prop) {
	    return ENCODING_NESTED_PROP_PARENT_INDEX[prop];
	}
	exports.isEncodingNestedParent = isEncodingNestedParent;
	// FIXME -- we should not have to manually specify these
	exports.BIN_CHILD_PROPS = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
	exports.SORT_CHILD_PROPS = ['field', 'op', 'order'];
	var BIN_PROPS = exports.BIN_CHILD_PROPS.map(function (c) {
	    return { parent: 'bin', child: c };
	});
	exports.SORT_PROPS = exports.SORT_CHILD_PROPS.map(function (c) {
	    return { parent: 'sort', child: c };
	});
	exports.SCALE_PROPS = scale_1$1.SCALE_PROPERTIES.map(function (c) {
	    return { parent: 'scale', child: c };
	});
	var AXIS_PROPS = axis_1$1.AXIS_PROPERTIES.map(function (c) {
	    return { parent: 'axis', child: c };
	});
	var LEGEND_PROPS = legend_1$1.LEGEND_PROPERTIES.map(function (c) {
	    return { parent: 'legend', child: c };
	});
	exports.ENCODING_NESTED_PROPS = [].concat(BIN_PROPS, exports.SORT_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS);
	exports.VIEW_PROPS = ['width', 'height', 'background', 'padding', 'title'];
	var PROP_KEY_DELIMITER = '.';
	function toKey(p) {
	    if (isEncodingNestedProp(p)) {
	        return p.parent + PROP_KEY_DELIMITER + p.child;
	    }
	    return p;
	}
	exports.toKey = toKey;
	function fromKey(k) {
	    var split = k.split(PROP_KEY_DELIMITER);
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
	exports.fromKey = fromKey;
	var ENCODING_NESTED_PROP_INDEX = exports.ENCODING_NESTED_PROPS.reduce(function (i, prop) {
	    i[prop.parent] = i[prop.parent] || [];
	    i[prop.parent][prop.child] = prop;
	    return i;
	}, {});
	// FIXME consider using a more general method
	function getEncodingNestedProp(parent, child) {
	    return (ENCODING_NESTED_PROP_INDEX[parent] || {})[child];
	}
	exports.getEncodingNestedProp = getEncodingNestedProp;
	function isEncodingProperty(p) {
	    return isEncodingTopLevelProperty(p) || isEncodingNestedProp(p);
	}
	exports.isEncodingProperty = isEncodingProperty;
	exports.ALL_ENCODING_PROPS = [].concat(exports.ENCODING_TOPLEVEL_PROPS, exports.ENCODING_NESTED_PROPS);
	exports.DEFAULT_PROP_PRECEDENCE = [
	    'type',
	    'field',
	    // Field Transform
	    'bin', 'timeUnit', 'aggregate', 'autoCount',
	    // Encoding
	    'channel',
	    // Mark
	    'mark', 'stack',
	    'scale', 'sort',
	    'axis', 'legend',
	].concat(BIN_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS, exports.SORT_PROPS);
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
	})(Property = exports.Property || (exports.Property = {}));

	});

	var property$1 = unwrapExports(property);
	var property_1 = property.isEncodingNestedProp;
	var property_2 = property.ENCODING_TOPLEVEL_PROPS;
	var property_3 = property.isEncodingTopLevelProperty;
	var property_4 = property.isEncodingNestedParent;
	var property_5 = property.BIN_CHILD_PROPS;
	var property_6 = property.SORT_CHILD_PROPS;
	var property_7 = property.SORT_PROPS;
	var property_8 = property.SCALE_PROPS;
	var property_9 = property.ENCODING_NESTED_PROPS;
	var property_10 = property.VIEW_PROPS;
	var property_11 = property.toKey;
	var property_12 = property.fromKey;
	var property_13 = property.getEncodingNestedProp;
	var property_14 = property.isEncodingProperty;
	var property_15 = property.ALL_ENCODING_PROPS;
	var property_16 = property.DEFAULT_PROP_PRECEDENCE;
	var property_17 = property.Property;

	var property$2 = /*#__PURE__*/Object.freeze({
		default: property$1,
		__moduleExports: property,
		isEncodingNestedProp: property_1,
		ENCODING_TOPLEVEL_PROPS: property_2,
		isEncodingTopLevelProperty: property_3,
		isEncodingNestedParent: property_4,
		BIN_CHILD_PROPS: property_5,
		SORT_CHILD_PROPS: property_6,
		SORT_PROPS: property_7,
		SCALE_PROPS: property_8,
		ENCODING_NESTED_PROPS: property_9,
		VIEW_PROPS: property_10,
		toKey: property_11,
		fromKey: property_12,
		getEncodingNestedProp: property_13,
		isEncodingProperty: property_14,
		ALL_ENCODING_PROPS: property_15,
		DEFAULT_PROP_PRECEDENCE: property_16,
		Property: property_17
	});

	var util$4 = createCommonjsModule(function (module) {
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
	var util_1$1 = util$4.isArray;
	var util_2$1 = util$4.cmp;
	var util_3$1 = util$4.keys;
	var util_4$1 = util$4.duplicate;
	var util_5$1 = util$4.extend;
	var util_6$1 = util$4.isObject;
	var util_7$1 = util$4.isBoolean;
	var util_8$1 = util$4.toMap;
	var util_9$1 = util$4.isString;

	var util$5 = /*#__PURE__*/Object.freeze({
		default: util$4,
		__moduleExports: util$4,
		isArray: util_1$1,
		cmp: util_2$1,
		keys: util_3$1,
		duplicate: util_4$1,
		extend: util_5$1,
		isObject: util_6$1,
		isBoolean: util_7$1,
		toMap: util_8$1,
		isString: util_9$1
	});

	var util$6 = ( util$5 && util$4 ) || util$5;

	var util$7 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.isArray = util$6.isArray;
	var util_2 = util$6;
	exports.cmp = util_2.cmp;
	exports.keys = util_2.keys;
	exports.duplicate = util_2.duplicate;
	exports.extend = util_2.extend;
	exports.isObject = util_2.isObject;
	exports.isBoolean = util_2.isBoolean;
	exports.toMap = util_2.toMap;
	function contains(array, item) {
	    return array.indexOf(item) !== -1;
	}
	exports.contains = contains;
	function every(arr, f) {
	    for (var i = 0; i < arr.length; i++) {
	        if (!f(arr[i], i)) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.every = every;
	function forEach(obj, f, thisArg) {
	    if (obj.forEach) {
	        obj.forEach.call(thisArg, f);
	    }
	    else {
	        for (var k in obj) {
	            f.call(thisArg, obj[k], k, obj);
	        }
	    }
	}
	exports.forEach = forEach;
	function some(arr, f) {
	    var i = 0, k;
	    for (k in arr) {
	        if (f(arr[k], k, i++)) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.some = some;
	function nestedMap(array, f) {
	    return array.map(function (a) {
	        if (util$6.isArray(a)) {
	            return nestedMap(a, f);
	        }
	        return f(a);
	    });
	}
	exports.nestedMap = nestedMap;
	/** Returns the array without the elements in item */
	function without(array, excludedItems) {
	    return array.filter(function (item) {
	        return !contains(excludedItems, item);
	    });
	}
	exports.without = without;

	});

	var util$8 = unwrapExports(util$7);
	var util_3$2 = util$7.isArray;
	var util_4$2 = util$7.cmp;
	var util_5$2 = util$7.keys;
	var util_6$2 = util$7.duplicate;
	var util_7$2 = util$7.extend;
	var util_8$2 = util$7.isObject;
	var util_9$2 = util$7.isBoolean;
	var util_10$1 = util$7.toMap;
	var util_11$1 = util$7.contains;
	var util_12$1 = util$7.every;
	var util_13$1 = util$7.forEach;
	var util_14$1 = util$7.some;
	var util_15$1 = util$7.nestedMap;
	var util_16$1 = util$7.without;

	var util$9 = /*#__PURE__*/Object.freeze({
		default: util$8,
		__moduleExports: util$7,
		isArray: util_3$2,
		cmp: util_4$2,
		keys: util_5$2,
		duplicate: util_6$2,
		extend: util_7$2,
		isObject: util_8$2,
		isBoolean: util_9$2,
		toMap: util_10$1,
		contains: util_11$1,
		every: util_12$1,
		forEach: util_13$1,
		some: util_14$1,
		nestedMap: util_15$1,
		without: util_16$1
	});

	var mark = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	var Mark;
	(function (Mark) {
	    Mark.AREA = 'area';
	    Mark.BAR = 'bar';
	    Mark.LINE = 'line';
	    Mark.POINT = 'point';
	    Mark.RECT = 'rect';
	    Mark.RULE = 'rule';
	    Mark.TEXT = 'text';
	    Mark.TICK = 'tick';
	    Mark.TRAIL = 'trail';
	    Mark.CIRCLE = 'circle';
	    Mark.SQUARE = 'square';
	    Mark.GEOSHAPE = 'geoshape';
	})(Mark = exports.Mark || (exports.Mark = {}));
	exports.AREA = Mark.AREA;
	exports.BAR = Mark.BAR;
	exports.LINE = Mark.LINE;
	exports.POINT = Mark.POINT;
	exports.TEXT = Mark.TEXT;
	exports.TICK = Mark.TICK;
	exports.TRAIL = Mark.TRAIL;
	exports.RECT = Mark.RECT;
	exports.RULE = Mark.RULE;
	exports.GEOSHAPE = Mark.GEOSHAPE;
	exports.CIRCLE = Mark.CIRCLE;
	exports.SQUARE = Mark.SQUARE;
	// Using mapped type to declare index, ensuring we always have all marks when we add more.
	var MARK_INDEX = {
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
	function isMark(m) {
	    return !!MARK_INDEX[m];
	}
	exports.isMark = isMark;
	function isPathMark(m) {
	    return util$3.contains(['line', 'area', 'trail'], m);
	}
	exports.isPathMark = isPathMark;
	exports.PRIMITIVE_MARKS = util$3.flagKeys(MARK_INDEX);
	function isMarkDef(mark) {
	    return mark['type'];
	}
	exports.isMarkDef = isMarkDef;
	var PRIMITIVE_MARK_INDEX = vega_util_1.toSet(exports.PRIMITIVE_MARKS);
	function isPrimitiveMark(mark) {
	    var markType = isMarkDef(mark) ? mark.type : mark;
	    return markType in PRIMITIVE_MARK_INDEX;
	}
	exports.isPrimitiveMark = isPrimitiveMark;
	exports.STROKE_CONFIG = ['stroke', 'strokeWidth',
	    'strokeDash', 'strokeDashOffset', 'strokeOpacity'];
	exports.FILL_CONFIG = ['fill', 'fillOpacity'];
	exports.FILL_STROKE_CONFIG = [].concat(exports.STROKE_CONFIG, exports.FILL_CONFIG);
	exports.VL_ONLY_MARK_CONFIG_PROPERTIES = ['filled', 'color'];
	exports.VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
	    area: ['line', 'point'],
	    bar: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
	    line: ['point'],
	    text: ['shortTimeLabels'],
	    tick: ['bandSize', 'thickness']
	};
	exports.defaultMarkConfig = {
	    color: '#4c78a8',
	};
	exports.defaultBarConfig = {
	    binSpacing: 1,
	    continuousBandSize: 5
	};
	exports.defaultTickConfig = {
	    thickness: 1
	};

	});

	var mark$1 = unwrapExports(mark);
	var mark_1 = mark.Mark;
	var mark_2 = mark.AREA;
	var mark_3 = mark.BAR;
	var mark_4 = mark.LINE;
	var mark_5 = mark.POINT;
	var mark_6 = mark.TEXT;
	var mark_7 = mark.TICK;
	var mark_8 = mark.TRAIL;
	var mark_9 = mark.RECT;
	var mark_10 = mark.RULE;
	var mark_11 = mark.GEOSHAPE;
	var mark_12 = mark.CIRCLE;
	var mark_13 = mark.SQUARE;
	var mark_14 = mark.isMark;
	var mark_15 = mark.isPathMark;
	var mark_16 = mark.PRIMITIVE_MARKS;
	var mark_17 = mark.isMarkDef;
	var mark_18 = mark.isPrimitiveMark;
	var mark_19 = mark.STROKE_CONFIG;
	var mark_20 = mark.FILL_CONFIG;
	var mark_21 = mark.FILL_STROKE_CONFIG;
	var mark_22 = mark.VL_ONLY_MARK_CONFIG_PROPERTIES;
	var mark_23 = mark.VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX;
	var mark_24 = mark.defaultMarkConfig;
	var mark_25 = mark.defaultBarConfig;
	var mark_26 = mark.defaultTickConfig;

	var mark$2 = /*#__PURE__*/Object.freeze({
		default: mark$1,
		__moduleExports: mark,
		Mark: mark_1,
		AREA: mark_2,
		BAR: mark_3,
		LINE: mark_4,
		POINT: mark_5,
		TEXT: mark_6,
		TICK: mark_7,
		TRAIL: mark_8,
		RECT: mark_9,
		RULE: mark_10,
		GEOSHAPE: mark_11,
		CIRCLE: mark_12,
		SQUARE: mark_13,
		isMark: mark_14,
		isPathMark: mark_15,
		PRIMITIVE_MARKS: mark_16,
		isMarkDef: mark_17,
		isPrimitiveMark: mark_18,
		STROKE_CONFIG: mark_19,
		FILL_CONFIG: mark_20,
		FILL_STROKE_CONFIG: mark_21,
		VL_ONLY_MARK_CONFIG_PROPERTIES: mark_22,
		VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: mark_23,
		defaultMarkConfig: mark_24,
		defaultBarConfig: mark_25,
		defaultTickConfig: mark_26
	});

	var datetime = createCommonjsModule(function (module, exports) {
	// DateTime definition object
	Object.defineProperty(exports, "__esModule", { value: true });



	/*
	 * A designated year that starts on Sunday.
	 */
	var SUNDAY_YEAR = 2006;
	function isDateTime(o) {
	    return !!o && (!!o.year || !!o.quarter || !!o.month || !!o.date || !!o.day ||
	        !!o.hours || !!o.minutes || !!o.seconds || !!o.milliseconds);
	}
	exports.isDateTime = isDateTime;
	exports.MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	exports.SHORT_MONTHS = exports.MONTHS.map(function (m) { return m.substr(0, 3); });
	exports.DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	exports.SHORT_DAYS = exports.DAYS.map(function (d) { return d.substr(0, 3); });
	function normalizeQuarter(q) {
	    if (vega_util_1.isNumber(q)) {
	        if (q > 4) {
	            log$5.warn(log$5.message.invalidTimeUnit('quarter', q));
	        }
	        // We accept 1-based quarter, so need to readjust to 0-based quarter
	        return (q - 1) + '';
	    }
	    else {
	        // Invalid quarter
	        throw new Error(log$5.message.invalidTimeUnit('quarter', q));
	    }
	}
	function normalizeMonth(m) {
	    if (vega_util_1.isNumber(m)) {
	        // We accept 1-based month, so need to readjust to 0-based month
	        return (m - 1) + '';
	    }
	    else {
	        var lowerM = m.toLowerCase();
	        var monthIndex = exports.MONTHS.indexOf(lowerM);
	        if (monthIndex !== -1) {
	            return monthIndex + ''; // 0 for january, ...
	        }
	        var shortM = lowerM.substr(0, 3);
	        var shortMonthIndex = exports.SHORT_MONTHS.indexOf(shortM);
	        if (shortMonthIndex !== -1) {
	            return shortMonthIndex + '';
	        }
	        // Invalid month
	        throw new Error(log$5.message.invalidTimeUnit('month', m));
	    }
	}
	function normalizeDay(d) {
	    if (vega_util_1.isNumber(d)) {
	        // mod so that this can be both 0-based where 0 = sunday
	        // and 1-based where 7=sunday
	        return (d % 7) + '';
	    }
	    else {
	        var lowerD = d.toLowerCase();
	        var dayIndex = exports.DAYS.indexOf(lowerD);
	        if (dayIndex !== -1) {
	            return dayIndex + ''; // 0 for january, ...
	        }
	        var shortD = lowerD.substr(0, 3);
	        var shortDayIndex = exports.SHORT_DAYS.indexOf(shortD);
	        if (shortDayIndex !== -1) {
	            return shortDayIndex + '';
	        }
	        // Invalid day
	        throw new Error(log$5.message.invalidTimeUnit('day', d));
	    }
	}
	/**
	 * Return Vega Expression for a particular date time.
	 * @param d
	 * @param normalize whether to normalize quarter, month, day.
	 */
	function dateTimeExpr(d, normalize) {
	    if (normalize === void 0) { normalize = false; }
	    var units = [];
	    if (normalize && d.day !== undefined) {
	        if (util$3.keys(d).length > 1) {
	            log$5.warn(log$5.message.droppedDay(d));
	            d = util$3.duplicate(d);
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
	        var month = normalize ? normalizeMonth(d.month) : d.month;
	        units.push(month);
	    }
	    else if (d.quarter !== undefined) {
	        var quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
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
	        var day = normalize ? normalizeDay(d.day) : d.day;
	        units.push(day + '+1');
	    }
	    else {
	        units.push(1); // Date starts at 1 in JS
	    }
	    // Note: can't use TimeUnit enum here as importing it will create
	    // circular dependency problem!
	    for (var _i = 0, _a = ['hours', 'minutes', 'seconds', 'milliseconds']; _i < _a.length; _i++) {
	        var timeUnit = _a[_i];
	        if (d[timeUnit] !== undefined) {
	            units.push(d[timeUnit]);
	        }
	        else {
	            units.push(0);
	        }
	    }
	    if (d.utc) {
	        return "utc(" + units.join(', ') + ")";
	    }
	    else {
	        return "datetime(" + units.join(', ') + ")";
	    }
	}
	exports.dateTimeExpr = dateTimeExpr;

	});

	var datetime$1 = unwrapExports(datetime);
	var datetime_1 = datetime.isDateTime;
	var datetime_2 = datetime.MONTHS;
	var datetime_3 = datetime.SHORT_MONTHS;
	var datetime_4 = datetime.DAYS;
	var datetime_5 = datetime.SHORT_DAYS;
	var datetime_6 = datetime.dateTimeExpr;

	var datetime$2 = /*#__PURE__*/Object.freeze({
		default: datetime$1,
		__moduleExports: datetime,
		isDateTime: datetime_1,
		MONTHS: datetime_2,
		SHORT_MONTHS: datetime_3,
		DAYS: datetime_4,
		SHORT_DAYS: datetime_5,
		dateTimeExpr: datetime_6
	});

	var datetime_1$1 = ( datetime$2 && datetime$1 ) || datetime$2;

	var timeunit = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });




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
	    // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
	    TimeUnit.MONTHDATE = 'monthdate';
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
	    // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
	    TimeUnit.UTCMONTHDATE = 'utcmonthdate';
	    TimeUnit.UTCHOURSMINUTES = 'utchoursminutes';
	    TimeUnit.UTCHOURSMINUTESSECONDS = 'utchoursminutesseconds';
	    TimeUnit.UTCMINUTESSECONDS = 'utcminutesseconds';
	    TimeUnit.UTCSECONDSMILLISECONDS = 'utcsecondsmilliseconds';
	    TimeUnit.UTCQUARTER = 'utcquarter';
	    TimeUnit.UTCYEARQUARTER = 'utcyearquarter';
	    TimeUnit.UTCQUARTERMONTH = 'utcquartermonth';
	    TimeUnit.UTCYEARQUARTERMONTH = 'utcyearquartermonth';
	})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
	/** Time Unit that only corresponds to only one part of Date objects. */
	var LOCAL_SINGLE_TIMEUNIT_INDEX = {
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
	exports.TIMEUNIT_PARTS = util$3.flagKeys(LOCAL_SINGLE_TIMEUNIT_INDEX);
	function isLocalSingleTimeUnit(timeUnit) {
	    return !!LOCAL_SINGLE_TIMEUNIT_INDEX[timeUnit];
	}
	exports.isLocalSingleTimeUnit = isLocalSingleTimeUnit;
	var UTC_SINGLE_TIMEUNIT_INDEX = {
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
	exports.isUtcSingleTimeUnit = isUtcSingleTimeUnit;
	var LOCAL_MULTI_TIMEUNIT_INDEX = {
	    yearquarter: 1,
	    yearquartermonth: 1,
	    yearmonth: 1,
	    yearmonthdate: 1,
	    yearmonthdatehours: 1,
	    yearmonthdatehoursminutes: 1,
	    yearmonthdatehoursminutesseconds: 1,
	    quartermonth: 1,
	    monthdate: 1,
	    hoursminutes: 1,
	    hoursminutesseconds: 1,
	    minutesseconds: 1,
	    secondsmilliseconds: 1
	};
	var UTC_MULTI_TIMEUNIT_INDEX = {
	    utcyearquarter: 1,
	    utcyearquartermonth: 1,
	    utcyearmonth: 1,
	    utcyearmonthdate: 1,
	    utcyearmonthdatehours: 1,
	    utcyearmonthdatehoursminutes: 1,
	    utcyearmonthdatehoursminutesseconds: 1,
	    utcquartermonth: 1,
	    utcmonthdate: 1,
	    utchoursminutes: 1,
	    utchoursminutesseconds: 1,
	    utcminutesseconds: 1,
	    utcsecondsmilliseconds: 1
	};
	var UTC_TIMEUNIT_INDEX = tslib_1.__assign({}, UTC_SINGLE_TIMEUNIT_INDEX, UTC_MULTI_TIMEUNIT_INDEX);
	function isUTCTimeUnit(t) {
	    return !!UTC_TIMEUNIT_INDEX[t];
	}
	exports.isUTCTimeUnit = isUTCTimeUnit;
	function getLocalTimeUnit(t) {
	    return t.substr(3);
	}
	exports.getLocalTimeUnit = getLocalTimeUnit;
	var TIMEUNIT_INDEX = tslib_1.__assign({}, LOCAL_SINGLE_TIMEUNIT_INDEX, UTC_SINGLE_TIMEUNIT_INDEX, LOCAL_MULTI_TIMEUNIT_INDEX, UTC_MULTI_TIMEUNIT_INDEX);
	exports.TIMEUNITS = util$3.flagKeys(TIMEUNIT_INDEX);
	function isTimeUnit(t) {
	    return !!TIMEUNIT_INDEX[t];
	}
	exports.isTimeUnit = isTimeUnit;
	var SET_DATE_METHOD = {
	    year: 'setFullYear',
	    month: 'setMonth',
	    date: 'setDate',
	    hours: 'setHours',
	    minutes: 'setMinutes',
	    seconds: 'setSeconds',
	    milliseconds: 'setMilliseconds',
	    // Day and quarter have their own special cases
	    quarter: null,
	    day: null,
	};
	/**
	 * Converts a date to only have the measurements relevant to the specified unit
	 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
	 * Note: the base date is Jan 01 1900 00:00:00
	 */
	function convert(unit, date) {
	    var isUTC = isUTCTimeUnit(unit);
	    var result = isUTC ?
	        // start with uniform date
	        new Date(Date.UTC(0, 0, 1, 0, 0, 0, 0)) :
	        new Date(0, 0, 1, 0, 0, 0, 0);
	    for (var _i = 0, TIMEUNIT_PARTS_1 = exports.TIMEUNIT_PARTS; _i < TIMEUNIT_PARTS_1.length; _i++) {
	        var timeUnitPart = TIMEUNIT_PARTS_1[_i];
	        if (containsTimeUnit(unit, timeUnitPart)) {
	            switch (timeUnitPart) {
	                case TimeUnit.DAY:
	                    throw new Error('Cannot convert to TimeUnits containing \'day\'');
	                case TimeUnit.QUARTER: {
	                    var _a = dateMethods('month', isUTC), getDateMethod_1 = _a.getDateMethod, setDateMethod_1 = _a.setDateMethod;
	                    // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
	                    result[setDateMethod_1]((Math.floor(date[getDateMethod_1]() / 3)) * 3);
	                    break;
	                }
	                default:
	                    var _b = dateMethods(timeUnitPart, isUTC), getDateMethod = _b.getDateMethod, setDateMethod = _b.setDateMethod;
	                    result[setDateMethod](date[getDateMethod]());
	            }
	        }
	    }
	    return result;
	}
	exports.convert = convert;
	function dateMethods(singleUnit, isUtc) {
	    var rawSetDateMethod = SET_DATE_METHOD[singleUnit];
	    var setDateMethod = isUtc ? 'setUTC' + rawSetDateMethod.substr(3) : rawSetDateMethod;
	    var getDateMethod = 'get' + (isUtc ? 'UTC' : '') + rawSetDateMethod.substr(3);
	    return { setDateMethod: setDateMethod, getDateMethod: getDateMethod };
	}
	function getTimeUnitParts(timeUnit) {
	    return exports.TIMEUNIT_PARTS.reduce(function (parts, part) {
	        if (containsTimeUnit(timeUnit, part)) {
	            return parts.concat(part);
	        }
	        return parts;
	    }, []);
	}
	exports.getTimeUnitParts = getTimeUnitParts;
	/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
	function containsTimeUnit(fullTimeUnit, timeUnit) {
	    var index = fullTimeUnit.indexOf(timeUnit);
	    return index > -1 &&
	        (timeUnit !== TimeUnit.SECONDS ||
	            index === 0 ||
	            fullTimeUnit.charAt(index - 1) !== 'i' // exclude milliseconds
	        );
	}
	exports.containsTimeUnit = containsTimeUnit;
	/**
	 * Returns Vega expresssion for a given timeUnit and fieldRef
	 */
	function fieldExpr(fullTimeUnit, field) {
	    var fieldRef = "datum" + util$3.accessPath(field);
	    var utc = isUTCTimeUnit(fullTimeUnit) ? 'utc' : '';
	    function func(timeUnit) {
	        if (timeUnit === TimeUnit.QUARTER) {
	            // quarter starting at 0 (0,3,6,9).
	            return "(" + utc + "quarter(" + fieldRef + ")-1)";
	        }
	        else {
	            return "" + utc + timeUnit + "(" + fieldRef + ")";
	        }
	    }
	    var d = exports.TIMEUNIT_PARTS.reduce(function (dateExpr, tu) {
	        if (containsTimeUnit(fullTimeUnit, tu)) {
	            dateExpr[tu] = func(tu);
	        }
	        return dateExpr;
	    }, {});
	    return datetime_1$1.dateTimeExpr(d);
	}
	exports.fieldExpr = fieldExpr;
	/**
	 * returns the signal expression used for axis labels for a time unit
	 */
	function formatExpression(timeUnit, field, shortTimeLabels, isUTCScale) {
	    if (!timeUnit) {
	        return undefined;
	    }
	    var dateComponents = [];
	    var expression = '';
	    var hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);
	    if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
	        // special expression for quarter as prefix
	        expression = "'Q' + quarter(" + field + ")";
	    }
	    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
	        // By default use short month name
	        dateComponents.push(shortTimeLabels !== false ? '%b' : '%B');
	    }
	    if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
	        dateComponents.push(shortTimeLabels ? '%a' : '%A');
	    }
	    else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
	        dateComponents.push('%d' + (hasYear ? ',' : '')); // add comma if there is year
	    }
	    if (hasYear) {
	        dateComponents.push(shortTimeLabels ? '%y' : '%Y');
	    }
	    var timeComponents = [];
	    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
	        timeComponents.push('%H');
	    }
	    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
	        timeComponents.push('%M');
	    }
	    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
	        timeComponents.push('%S');
	    }
	    if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
	        timeComponents.push('%L');
	    }
	    var dateTimeComponents = [];
	    if (dateComponents.length > 0) {
	        dateTimeComponents.push(dateComponents.join(' '));
	    }
	    if (timeComponents.length > 0) {
	        dateTimeComponents.push(timeComponents.join(':'));
	    }
	    if (dateTimeComponents.length > 0) {
	        if (expression) {
	            // Add space between quarter and main time format
	            expression += " + ' ' + ";
	        }
	        // We only use utcFormat for utc scale
	        // For utc time units, the data is already converted as a part of timeUnit transform.
	        // Thus, utc time units should use timeFormat to avoid shifting the time twice.
	        if (isUTCScale) {
	            expression += "utcFormat(" + field + ", '" + dateTimeComponents.join(' ') + "')";
	        }
	        else {
	            expression += "timeFormat(" + field + ", '" + dateTimeComponents.join(' ') + "')";
	        }
	    }
	    // If expression is still an empty string, return undefined instead.
	    return expression || undefined;
	}
	exports.formatExpression = formatExpression;
	function normalizeTimeUnit(timeUnit) {
	    if (timeUnit !== 'day' && timeUnit.indexOf('day') >= 0) {
	        log$5.warn(log$5.message.dayReplacedWithDate(timeUnit));
	        return timeUnit.replace('day', 'date');
	    }
	    return timeUnit;
	}
	exports.normalizeTimeUnit = normalizeTimeUnit;

	});

	var timeunit$1 = unwrapExports(timeunit);
	var timeunit_1 = timeunit.TimeUnit;
	var timeunit_2 = timeunit.TIMEUNIT_PARTS;
	var timeunit_3 = timeunit.isLocalSingleTimeUnit;
	var timeunit_4 = timeunit.isUtcSingleTimeUnit;
	var timeunit_5 = timeunit.isUTCTimeUnit;
	var timeunit_6 = timeunit.getLocalTimeUnit;
	var timeunit_7 = timeunit.TIMEUNITS;
	var timeunit_8 = timeunit.isTimeUnit;
	var timeunit_9 = timeunit.convert;
	var timeunit_10 = timeunit.getTimeUnitParts;
	var timeunit_11 = timeunit.containsTimeUnit;
	var timeunit_12 = timeunit.fieldExpr;
	var timeunit_13 = timeunit.formatExpression;
	var timeunit_14 = timeunit.normalizeTimeUnit;

	var timeunit$2 = /*#__PURE__*/Object.freeze({
		default: timeunit$1,
		__moduleExports: timeunit,
		TimeUnit: timeunit_1,
		TIMEUNIT_PARTS: timeunit_2,
		isLocalSingleTimeUnit: timeunit_3,
		isUtcSingleTimeUnit: timeunit_4,
		isUTCTimeUnit: timeunit_5,
		getLocalTimeUnit: timeunit_6,
		TIMEUNITS: timeunit_7,
		isTimeUnit: timeunit_8,
		convert: timeunit_9,
		getTimeUnitParts: timeunit_10,
		containsTimeUnit: timeunit_11,
		fieldExpr: timeunit_12,
		formatExpression: timeunit_13,
		normalizeTimeUnit: timeunit_14
	});

	var type = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/** Constants and utilities for data type */
	/** Data type based on level of measurement */
	var Type;
	(function (Type) {
	    Type.QUANTITATIVE = 'quantitative';
	    Type.ORDINAL = 'ordinal';
	    Type.TEMPORAL = 'temporal';
	    Type.NOMINAL = 'nominal';
	    Type.LATITUDE = 'latitude';
	    Type.LONGITUDE = 'longitude';
	    Type.GEOJSON = 'geojson';
	})(Type = exports.Type || (exports.Type = {}));
	var TYPE_INDEX = {
	    quantitative: 1,
	    ordinal: 1,
	    temporal: 1,
	    nominal: 1,
	    latitude: 1,
	    longitude: 1,
	    geojson: 1
	};
	function isType(t) {
	    return !!TYPE_INDEX[t];
	}
	exports.isType = isType;
	exports.QUANTITATIVE = Type.QUANTITATIVE;
	exports.ORDINAL = Type.ORDINAL;
	exports.TEMPORAL = Type.TEMPORAL;
	exports.NOMINAL = Type.NOMINAL;
	exports.GEOJSON = Type.GEOJSON;
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
	            case exports.QUANTITATIVE:
	                return 'quantitative';
	            case 't':
	            case exports.TEMPORAL:
	                return 'temporal';
	            case 'o':
	            case exports.ORDINAL:
	                return 'ordinal';
	            case 'n':
	            case exports.NOMINAL:
	                return 'nominal';
	            case Type.LATITUDE:
	                return 'latitude';
	            case Type.LONGITUDE:
	                return 'longitude';
	            case exports.GEOJSON:
	                return 'geojson';
	        }
	    }
	    // If we get invalid input, return undefined type.
	    return undefined;
	}
	exports.getFullName = getFullName;

	});

	var type$1 = unwrapExports(type);
	var type_1 = type.Type;
	var type_2 = type.isType;
	var type_3 = type.QUANTITATIVE;
	var type_4 = type.ORDINAL;
	var type_5 = type.TEMPORAL;
	var type_6 = type.NOMINAL;
	var type_7 = type.GEOJSON;
	var type_8 = type.getFullName;

	var type$2 = /*#__PURE__*/Object.freeze({
		default: type$1,
		__moduleExports: type,
		Type: type_1,
		isType: type_2,
		QUANTITATIVE: type_3,
		ORDINAL: type_4,
		TEMPORAL: type_5,
		NOMINAL: type_6,
		GEOJSON: type_7,
		getFullName: type_8
	});

	var property_1$1 = ( property$2 && property$1 ) || property$2;

	var util_1$2 = ( util$9 && util$8 ) || util$9;

	var mark_1$1 = ( mark$2 && mark$1 ) || mark$2;

	var timeunit_1$1 = ( timeunit$2 && timeunit$1 ) || timeunit$2;

	var type_1$1 = ( type$2 && type$1 ) || type$2;

	var wildcard = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });









	exports.SHORT_WILDCARD = '?';
	function isWildcard(prop) {
	    return isShortWildcard(prop) || isWildcardDef(prop);
	}
	exports.isWildcard = isWildcard;
	function isShortWildcard(prop) {
	    return prop === exports.SHORT_WILDCARD;
	}
	exports.isShortWildcard = isShortWildcard;
	function isWildcardDef(prop) {
	    return prop !== undefined && prop != null && (!!prop.enum || !!prop.name) && !util_1$2.isArray(prop);
	}
	exports.isWildcardDef = isWildcardDef;
	function initWildcard(prop, defaultName, defaultEnumValues) {
	    return util_1$2.extend({}, {
	        name: defaultName,
	        enum: defaultEnumValues
	    }, prop === exports.SHORT_WILDCARD ? {} : prop);
	}
	exports.initWildcard = initWildcard;
	/**
	 * Initial short names from list of full camelCaseNames.
	 * For each camelCaseNames, return unique short names based on initial (e.g., `ccn`)
	 */
	function initNestedPropName(fullNames) {
	    var index = {};
	    var has = {};
	    var _loop_1 = function (fullName) {
	        var initialIndices = [0];
	        for (var i = 0; i < fullName.length; i++) {
	            if (fullName.charAt(i).toUpperCase() === fullName.charAt(i)) {
	                initialIndices.push(i);
	            }
	        }
	        var shortName = initialIndices.map(function (i) { return fullName.charAt(i); }).join('').toLowerCase();
	        if (!has[shortName]) {
	            index[fullName] = shortName;
	            has[shortName] = true;
	            return "continue";
	        }
	        // If duplicate, add last character and try again!
	        if (initialIndices[initialIndices.length - 1] !== fullName.length - 1) {
	            shortName = initialIndices.concat([fullName.length - 1]).map(function (i) { return fullName.charAt(i); }).join('').toLowerCase();
	            if (!has[shortName]) {
	                index[fullName] = shortName;
	                has[shortName] = true;
	                return "continue";
	            }
	        }
	        for (var i = 1; !index[fullName]; i++) {
	            var shortNameWithNo = shortName + '_' + i;
	            if (!has[shortNameWithNo]) {
	                index[fullName] = shortNameWithNo;
	                has[shortNameWithNo] = true;
	                break;
	            }
	        }
	    };
	    for (var _i = 0, fullNames_1 = fullNames; _i < fullNames_1.length; _i++) {
	        var fullName = fullNames_1[_i];
	        _loop_1(fullName);
	    }
	    return index;
	}
	exports.DEFAULT_NAME = {
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
	    scaleProps: initNestedPropName(scale_1$1.SCALE_PROPERTIES),
	    axisProps: initNestedPropName(axis_1$1.AXIS_PROPERTIES),
	    legendProps: initNestedPropName(legend_1$1.LEGEND_PROPERTIES)
	};
	function getDefaultName(prop) {
	    if (property_1$1.isEncodingNestedProp(prop)) {
	        return exports.DEFAULT_NAME[prop.parent] + '-' + exports.DEFAULT_NAME[prop.parent + 'Props'][prop.child];
	    }
	    if (exports.DEFAULT_NAME[prop]) {
	        return exports.DEFAULT_NAME[prop];
	    }
	    /* istanbul ignore next */
	    throw new Error('Default name undefined for ' + prop);
	}
	exports.getDefaultName = getDefaultName;
	var DEFAULT_BOOLEAN_ENUM = [false, true];
	var DEFAULT_BIN_PROPS_ENUM = {
	    maxbins: [5, 10, 20],
	    extent: [undefined],
	    base: [10],
	    step: [undefined],
	    steps: [undefined],
	    minstep: [undefined],
	    divide: [[5, 2]]
	};
	var DEFAULT_SORT_PROPS = {
	    field: [undefined],
	    op: ['min', 'mean'],
	    order: ['ascending', 'descending']
	};
	var DEFAULT_SCALE_PROPS_ENUM = {
	    type: [undefined, scale_1$1.ScaleType.LOG],
	    domain: [undefined],
	    base: [undefined],
	    exponent: [1, 2],
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
	    scheme: [undefined],
	};
	var DEFAULT_AXIS_PROPS_ENUM = {
	    zindex: [1, 0],
	    offset: [undefined],
	    orient: [undefined],
	    values: [undefined],
	    encoding: [undefined],
	    domain: DEFAULT_BOOLEAN_ENUM,
	    grid: DEFAULT_BOOLEAN_ENUM,
	    format: [undefined],
	    labels: DEFAULT_BOOLEAN_ENUM,
	    labelAngle: [undefined],
	    labelOverlap: [undefined],
	    labelPadding: [undefined],
	    labelBound: [undefined],
	    labelFlush: [undefined],
	    maxExtent: [undefined],
	    minExtent: [undefined],
	    position: [undefined],
	    ticks: DEFAULT_BOOLEAN_ENUM,
	    tickCount: [undefined],
	    tickSize: [undefined],
	    title: [undefined],
	    titleMaxLength: [undefined],
	    titlePadding: [undefined]
	};
	var DEFAULT_LEGEND_PROPS_ENUM = {
	    entryPadding: [undefined],
	    orient: ['left', 'right'],
	    offset: [undefined],
	    padding: [undefined],
	    format: [undefined],
	    values: [undefined],
	    tickCount: [undefined],
	    title: [undefined],
	    type: [undefined],
	    zindex: [undefined]
	};
	// Use FullEnumIndex to make sure we have all properties specified here!
	exports.DEFAULT_ENUM_INDEX = {
	    mark: [mark_1$1.Mark.POINT, mark_1$1.Mark.BAR, mark_1$1.Mark.LINE, mark_1$1.Mark.AREA, mark_1$1.Mark.RECT, mark_1$1.Mark.TICK, mark_1$1.Mark.TEXT],
	    channel: [channel_1$1.X, channel_1$1.Y, channel_1$1.ROW, channel_1$1.COLUMN, channel_1$1.SIZE, channel_1$1.COLOR],
	    aggregate: [undefined, 'mean'],
	    autoCount: DEFAULT_BOOLEAN_ENUM,
	    bin: DEFAULT_BOOLEAN_ENUM,
	    hasFn: DEFAULT_BOOLEAN_ENUM,
	    timeUnit: [undefined, timeunit_1$1.TimeUnit.YEAR, timeunit_1$1.TimeUnit.MONTH, timeunit_1$1.TimeUnit.MINUTES, timeunit_1$1.TimeUnit.SECONDS],
	    field: [undefined],
	    type: [type_1$1.Type.NOMINAL, type_1$1.Type.ORDINAL, type_1$1.Type.QUANTITATIVE, type_1$1.Type.TEMPORAL],
	    sort: ['ascending', 'descending'],
	    stack: ['zero', 'normalize', 'center', null],
	    value: [undefined],
	    format: [undefined],
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
	    if (prop === 'field' || (property_1$1.isEncodingNestedProp(prop) && prop.parent === 'sort' && prop.child === 'field')) {
	        // For field, by default enumerate all fields
	        return schema.fieldNames();
	    }
	    var val;
	    if (property_1$1.isEncodingNestedProp(prop)) {
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
	exports.getDefaultEnumValues = getDefaultEnumValues;

	});

	var wildcard$1 = unwrapExports(wildcard);
	var wildcard_1 = wildcard.SHORT_WILDCARD;
	var wildcard_2 = wildcard.isWildcard;
	var wildcard_3 = wildcard.isShortWildcard;
	var wildcard_4 = wildcard.isWildcardDef;
	var wildcard_5 = wildcard.initWildcard;
	var wildcard_6 = wildcard.DEFAULT_NAME;
	var wildcard_7 = wildcard.getDefaultName;
	var wildcard_8 = wildcard.DEFAULT_ENUM_INDEX;
	var wildcard_9 = wildcard.getDefaultEnumValues;

	var wildcard$2 = /*#__PURE__*/Object.freeze({
		default: wildcard$1,
		__moduleExports: wildcard,
		SHORT_WILDCARD: wildcard_1,
		isWildcard: wildcard_2,
		isShortWildcard: wildcard_3,
		isWildcardDef: wildcard_4,
		initWildcard: wildcard_5,
		DEFAULT_NAME: wildcard_6,
		getDefaultName: wildcard_7,
		DEFAULT_ENUM_INDEX: wildcard_8,
		getDefaultEnumValues: wildcard_9
	});

	var wildcard_1$1 = ( wildcard$2 && wildcard$1 ) || wildcard$2;

	var config = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	exports.DEFAULT_QUERY_CONFIG = {
	    verbose: false,
	    defaultSpecConfig: {
	        line: { point: true },
	        scale: { useUnaggregatedDomain: true }
	    },
	    propertyPrecedence: property_1$1.DEFAULT_PROP_PRECEDENCE.map(property_1$1.toKey),
	    enum: wildcard_1$1.DEFAULT_ENUM_INDEX,
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
	    preferredBinAxis: channel_1$1.Channel.X,
	    preferredTemporalAxis: channel_1$1.Channel.X,
	    preferredOrdinalAxis: channel_1$1.Channel.Y,
	    preferredNominalAxis: channel_1$1.Channel.Y,
	    preferredFacet: channel_1$1.Channel.ROW,
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
	    minPercentUniqueForKey: .8,
	    minCardinalityForKey: 50,
	};
	function extendConfig(opt) {
	    return __assign({}, exports.DEFAULT_QUERY_CONFIG, opt, { enum: extendEnumIndex(opt.enum) });
	}
	exports.extendConfig = extendConfig;
	function extendEnumIndex(enumIndex) {
	    var enumOpt = __assign({}, wildcard_1$1.DEFAULT_ENUM_INDEX, enumIndex, { binProps: extendNestedEnumIndex(enumIndex, 'bin'), scaleProps: extendNestedEnumIndex(enumIndex, 'scale'), axisProps: extendNestedEnumIndex(enumIndex, 'axis'), legendProps: extendNestedEnumIndex(enumIndex, 'legend') });
	    return enumOpt;
	}
	function extendNestedEnumIndex(enumIndex, prop) {
	    return __assign({}, wildcard_1$1.DEFAULT_ENUM_INDEX[prop + 'Props'], enumIndex[prop + 'Props']);
	}

	});

	var config$1 = unwrapExports(config);
	var config_1 = config.DEFAULT_QUERY_CONFIG;
	var config_2 = config.extendConfig;

	var config$2 = /*#__PURE__*/Object.freeze({
		default: config$1,
		__moduleExports: config,
		DEFAULT_QUERY_CONFIG: config_1,
		extendConfig: config_2
	});

	var aggregate = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	var AGGREGATE_OP_INDEX = {
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
	    variancep: 1,
	};
	exports.AGGREGATE_OPS = util$3.flagKeys(AGGREGATE_OP_INDEX);
	function isAggregateOp(a) {
	    return !!AGGREGATE_OP_INDEX[a];
	}
	exports.isAggregateOp = isAggregateOp;
	exports.COUNTING_OPS = ['count', 'valid', 'missing', 'distinct'];
	function isCountingAggregateOp(aggregate) {
	    return aggregate && util$3.contains(exports.COUNTING_OPS, aggregate);
	}
	exports.isCountingAggregateOp = isCountingAggregateOp;
	/** Additive-based aggregation operations.  These can be applied to stack. */
	exports.SUM_OPS = [
	    'count',
	    'sum',
	    'distinct',
	    'valid',
	    'missing'
	];
	/**
	 * Aggregation operators that always produce values within the range [domainMin, domainMax].
	 */
	exports.SHARED_DOMAIN_OPS = [
	    'mean',
	    'average',
	    'median',
	    'q1',
	    'q3',
	    'min',
	    'max',
	];
	exports.SHARED_DOMAIN_OP_INDEX = vega_util_1.toSet(exports.SHARED_DOMAIN_OPS);

	});

	var aggregate$1 = unwrapExports(aggregate);
	var aggregate_1 = aggregate.AGGREGATE_OPS;
	var aggregate_2 = aggregate.isAggregateOp;
	var aggregate_3 = aggregate.COUNTING_OPS;
	var aggregate_4 = aggregate.isCountingAggregateOp;
	var aggregate_5 = aggregate.SUM_OPS;
	var aggregate_6 = aggregate.SHARED_DOMAIN_OPS;
	var aggregate_7 = aggregate.SHARED_DOMAIN_OP_INDEX;

	var aggregate$2 = /*#__PURE__*/Object.freeze({
		default: aggregate$1,
		__moduleExports: aggregate,
		AGGREGATE_OPS: aggregate_1,
		isAggregateOp: aggregate_2,
		COUNTING_OPS: aggregate_3,
		isCountingAggregateOp: aggregate_4,
		SUM_OPS: aggregate_5,
		SHARED_DOMAIN_OPS: aggregate_6,
		SHARED_DOMAIN_OP_INDEX: aggregate_7
	});

	var bin = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	function binToString(bin) {
	    if (vega_util_1.isBoolean(bin)) {
	        return 'bin';
	    }
	    return 'bin' + util$3.keys(bin).map(function (p) { return util$3.varName("_" + p + "_" + bin[p]); }).join('');
	}
	exports.binToString = binToString;
	function autoMaxBins(channel) {
	    switch (channel) {
	        case channel_1$1.ROW:
	        case channel_1$1.COLUMN:
	        case channel_1$1.SIZE:
	        case channel_1$1.COLOR:
	        case channel_1$1.FILL:
	        case channel_1$1.STROKE:
	        case channel_1$1.OPACITY:
	        // Facets and Size shouldn't have too many bins
	        // We choose 6 like shape to simplify the rule
	        case channel_1$1.SHAPE:
	            return 6; // Vega's "shape" has 6 distinct values
	        default:
	            return 10;
	    }
	}
	exports.autoMaxBins = autoMaxBins;

	});

	var bin$1 = unwrapExports(bin);
	var bin_1 = bin.binToString;
	var bin_2 = bin.autoMaxBins;

	var bin$2 = /*#__PURE__*/Object.freeze({
		default: bin$1,
		__moduleExports: bin,
		binToString: bin_1,
		autoMaxBins: bin_2
	});

	var aggregate_1$1 = ( aggregate$2 && aggregate$1 ) || aggregate$2;

	var bin_1$1 = ( bin$2 && bin$1 ) || bin$2;

	var fielddef = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });









	function isConditionalSelection(c) {
	    return c['selection'];
	}
	exports.isConditionalSelection = isConditionalSelection;
	function isRepeatRef(field) {
	    return field && !vega_util_1.isString(field) && 'repeat' in field;
	}
	exports.isRepeatRef = isRepeatRef;
	function toFieldDefBase(fieldDef) {
	    var field = fieldDef.field, timeUnit = fieldDef.timeUnit, bin = fieldDef.bin, aggregate = fieldDef.aggregate;
	    return tslib_1.__assign({}, (timeUnit ? { timeUnit: timeUnit } : {}), (bin ? { bin: bin } : {}), (aggregate ? { aggregate: aggregate } : {}), { field: field });
	}
	exports.toFieldDefBase = toFieldDefBase;
	function isConditionalDef(channelDef) {
	    return !!channelDef && !!channelDef.condition;
	}
	exports.isConditionalDef = isConditionalDef;
	/**
	 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
	 */
	function hasConditionalFieldDef(channelDef) {
	    return !!channelDef && !!channelDef.condition && !vega_util_1.isArray(channelDef.condition) && isFieldDef(channelDef.condition);
	}
	exports.hasConditionalFieldDef = hasConditionalFieldDef;
	function hasConditionalValueDef(channelDef) {
	    return !!channelDef && !!channelDef.condition && (vega_util_1.isArray(channelDef.condition) || isValueDef(channelDef.condition));
	}
	exports.hasConditionalValueDef = hasConditionalValueDef;
	function isFieldDef(channelDef) {
	    return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
	}
	exports.isFieldDef = isFieldDef;
	function isStringFieldDef(fieldDef) {
	    return isFieldDef(fieldDef) && vega_util_1.isString(fieldDef.field);
	}
	exports.isStringFieldDef = isStringFieldDef;
	function isValueDef(channelDef) {
	    return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
	}
	exports.isValueDef = isValueDef;
	function isScaleFieldDef(channelDef) {
	    return !!channelDef && (!!channelDef['scale'] || !!channelDef['sort']);
	}
	exports.isScaleFieldDef = isScaleFieldDef;
	function vgField(fieldDef, opt) {
	    if (opt === void 0) { opt = {}; }
	    var field = fieldDef.field;
	    var prefix = opt.prefix;
	    var suffix = opt.suffix;
	    if (isCount(fieldDef)) {
	        field = 'count_*';
	    }
	    else {
	        var fn = undefined;
	        if (!opt.nofn) {
	            if (fieldDef.bin) {
	                fn = bin_1$1.binToString(fieldDef.bin);
	                suffix = opt.binSuffix || '';
	            }
	            else if (fieldDef.aggregate) {
	                fn = String(opt.aggregate || fieldDef.aggregate);
	            }
	            else if (fieldDef.timeUnit) {
	                fn = String(fieldDef.timeUnit);
	            }
	        }
	        if (fn) {
	            field = fn + "_" + field;
	        }
	    }
	    if (suffix) {
	        field = field + "_" + suffix;
	    }
	    if (prefix) {
	        field = prefix + "_" + field;
	    }
	    if (opt.expr) {
	        field = "" + opt.expr + util$3.accessPath(field);
	    }
	    return field;
	}
	exports.vgField = vgField;
	function isDiscrete(fieldDef) {
	    switch (fieldDef.type) {
	        case 'nominal':
	        case 'ordinal':
	        case 'geojson':
	            return true;
	        case 'quantitative':
	            return !!fieldDef.bin;
	        case 'latitude':
	        case 'longitude':
	        case 'temporal':
	            return false;
	    }
	    throw new Error(log$5.message.invalidFieldType(fieldDef.type));
	}
	exports.isDiscrete = isDiscrete;
	function isContinuous(fieldDef) {
	    return !isDiscrete(fieldDef);
	}
	exports.isContinuous = isContinuous;
	function isCount(fieldDef) {
	    return fieldDef.aggregate === 'count';
	}
	exports.isCount = isCount;
	function verbalTitleFormatter(fieldDef, config) {
	    var field = fieldDef.field, bin = fieldDef.bin, timeUnit = fieldDef.timeUnit, aggregate = fieldDef.aggregate;
	    if (aggregate === 'count') {
	        return config.countTitle;
	    }
	    else if (bin) {
	        return field + " (binned)";
	    }
	    else if (timeUnit) {
	        var units = timeunit_1$1.getTimeUnitParts(timeUnit).join('-');
	        return field + " (" + units + ")";
	    }
	    else if (aggregate) {
	        return util$3.titlecase(aggregate) + " of " + field;
	    }
	    return field;
	}
	exports.verbalTitleFormatter = verbalTitleFormatter;
	function functionalTitleFormatter(fieldDef, config) {
	    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
	    if (fn) {
	        return fn.toUpperCase() + '(' + fieldDef.field + ')';
	    }
	    else {
	        return fieldDef.field;
	    }
	}
	exports.functionalTitleFormatter = functionalTitleFormatter;
	exports.defaultTitleFormatter = function (fieldDef, config) {
	    switch (config.fieldTitle) {
	        case 'plain':
	            return fieldDef.field;
	        case 'functional':
	            return functionalTitleFormatter(fieldDef, config);
	        default:
	            return verbalTitleFormatter(fieldDef, config);
	    }
	};
	var titleFormatter = exports.defaultTitleFormatter;
	function setTitleFormatter(formatter) {
	    titleFormatter = formatter;
	}
	exports.setTitleFormatter = setTitleFormatter;
	function resetTitleFormatter() {
	    setTitleFormatter(exports.defaultTitleFormatter);
	}
	exports.resetTitleFormatter = resetTitleFormatter;
	function title(fieldDef, config) {
	    return titleFormatter(fieldDef, config);
	}
	exports.title = title;
	function defaultType(fieldDef, channel) {
	    if (fieldDef.timeUnit) {
	        return 'temporal';
	    }
	    if (fieldDef.bin) {
	        return 'quantitative';
	    }
	    switch (channel_1$1.rangeType(channel)) {
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
	exports.defaultType = defaultType;
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
	exports.getFieldDef = getFieldDef;
	/**
	 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
	 */
	function normalize(channelDef, channel) {
	    if (vega_util_1.isString(channelDef) || vega_util_1.isNumber(channelDef) || vega_util_1.isBoolean(channelDef)) {
	        var primitiveType = vega_util_1.isString(channelDef) ? 'string' :
	            vega_util_1.isNumber(channelDef) ? 'number' : 'boolean';
	        log$5.warn(log$5.message.primitiveChannelDef(channel, primitiveType, channelDef));
	        return { value: channelDef };
	    }
	    // If a fieldDef contains a field, we need type.
	    if (isFieldDef(channelDef)) {
	        return normalizeFieldDef(channelDef, channel);
	    }
	    else if (hasConditionalFieldDef(channelDef)) {
	        return tslib_1.__assign({}, channelDef, { 
	            // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
	            condition: normalizeFieldDef(channelDef.condition, channel) });
	    }
	    return channelDef;
	}
	exports.normalize = normalize;
	function normalizeFieldDef(fieldDef, channel) {
	    // Drop invalid aggregate
	    if (fieldDef.aggregate && !aggregate_1$1.isAggregateOp(fieldDef.aggregate)) {
	        var aggregate = fieldDef.aggregate, fieldDefWithoutAggregate = tslib_1.__rest(fieldDef, ["aggregate"]);
	        log$5.warn(log$5.message.invalidAggregate(fieldDef.aggregate));
	        fieldDef = fieldDefWithoutAggregate;
	    }
	    // Normalize Time Unit
	    if (fieldDef.timeUnit) {
	        fieldDef = tslib_1.__assign({}, fieldDef, { timeUnit: timeunit_1$1.normalizeTimeUnit(fieldDef.timeUnit) });
	    }
	    // Normalize bin
	    if (fieldDef.bin) {
	        fieldDef = tslib_1.__assign({}, fieldDef, { bin: normalizeBin(fieldDef.bin, channel) });
	    }
	    // Normalize Type
	    if (fieldDef.type) {
	        var fullType = type_1$1.getFullName(fieldDef.type);
	        if (fieldDef.type !== fullType) {
	            // convert short type to full type
	            fieldDef = tslib_1.__assign({}, fieldDef, { type: fullType });
	        }
	        if (fieldDef.type !== 'quantitative') {
	            if (aggregate_1$1.isCountingAggregateOp(fieldDef.aggregate)) {
	                log$5.warn(log$5.message.invalidFieldTypeForCountAggregate(fieldDef.type, fieldDef.aggregate));
	                fieldDef = tslib_1.__assign({}, fieldDef, { type: 'quantitative' });
	            }
	        }
	    }
	    else {
	        // If type is empty / invalid, then augment with default type
	        var newType = defaultType(fieldDef, channel);
	        log$5.warn(log$5.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
	        fieldDef = tslib_1.__assign({}, fieldDef, { type: newType });
	    }
	    var _a = channelCompatibility(fieldDef, channel), compatible = _a.compatible, warning = _a.warning;
	    if (!compatible) {
	        log$5.warn(warning);
	    }
	    return fieldDef;
	}
	exports.normalizeFieldDef = normalizeFieldDef;
	function normalizeBin(bin, channel) {
	    if (vega_util_1.isBoolean(bin)) {
	        return { maxbins: bin_1$1.autoMaxBins(channel) };
	    }
	    else if (!bin.maxbins && !bin.step) {
	        return tslib_1.__assign({}, bin, { maxbins: bin_1$1.autoMaxBins(channel) });
	    }
	    else {
	        return bin;
	    }
	}
	exports.normalizeBin = normalizeBin;
	var COMPATIBLE = { compatible: true };
	function channelCompatibility(fieldDef, channel) {
	    switch (channel) {
	        case 'row':
	        case 'column':
	            if (isContinuous(fieldDef) && !fieldDef.timeUnit) {
	                // TODO:(https://github.com/vega/vega-lite/issues/2011):
	                // with timeUnit it's not always strictly continuous
	                return {
	                    compatible: false,
	                    warning: log$5.message.facetChannelShouldBeDiscrete(channel)
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
	            if (fieldDef.type !== type_1$1.QUANTITATIVE) {
	                return {
	                    compatible: false,
	                    warning: "Channel " + channel + " should not be used with " + fieldDef.type + " field."
	                };
	            }
	            return COMPATIBLE;
	        case 'opacity':
	        case 'size':
	        case 'x2':
	        case 'y2':
	            if (isDiscrete(fieldDef) && !fieldDef.bin) {
	                return {
	                    compatible: false,
	                    warning: "Channel " + channel + " should not be used with discrete field."
	                };
	            }
	            return COMPATIBLE;
	        case 'shape':
	            if (fieldDef.type !== 'nominal' && fieldDef.type !== 'geojson') {
	                return {
	                    compatible: false,
	                    warning: 'Shape channel should be used with nominal data or geojson only'
	                };
	            }
	            return COMPATIBLE;
	        case 'order':
	            if (fieldDef.type === 'nominal') {
	                return {
	                    compatible: false,
	                    warning: "Channel order is inappropriate for nominal field, which has no inherent order."
	                };
	            }
	            return COMPATIBLE;
	    }
	    throw new Error('channelCompatability not implemented for channel ' + channel);
	}
	exports.channelCompatibility = channelCompatibility;
	function isNumberFieldDef(fieldDef) {
	    return fieldDef.type === 'quantitative' || !!fieldDef.bin;
	}
	exports.isNumberFieldDef = isNumberFieldDef;
	function isTimeFieldDef(fieldDef) {
	    return fieldDef.type === 'temporal' || !!fieldDef.timeUnit;
	}
	exports.isTimeFieldDef = isTimeFieldDef;

	});

	var fielddef$1 = unwrapExports(fielddef);
	var fielddef_1 = fielddef.isConditionalSelection;
	var fielddef_2 = fielddef.isRepeatRef;
	var fielddef_3 = fielddef.toFieldDefBase;
	var fielddef_4 = fielddef.isConditionalDef;
	var fielddef_5 = fielddef.hasConditionalFieldDef;
	var fielddef_6 = fielddef.hasConditionalValueDef;
	var fielddef_7 = fielddef.isFieldDef;
	var fielddef_8 = fielddef.isStringFieldDef;
	var fielddef_9 = fielddef.isValueDef;
	var fielddef_10 = fielddef.isScaleFieldDef;
	var fielddef_11 = fielddef.vgField;
	var fielddef_12 = fielddef.isDiscrete;
	var fielddef_13 = fielddef.isContinuous;
	var fielddef_14 = fielddef.isCount;
	var fielddef_15 = fielddef.verbalTitleFormatter;
	var fielddef_16 = fielddef.functionalTitleFormatter;
	var fielddef_17 = fielddef.defaultTitleFormatter;
	var fielddef_18 = fielddef.setTitleFormatter;
	var fielddef_19 = fielddef.resetTitleFormatter;
	var fielddef_20 = fielddef.title;
	var fielddef_21 = fielddef.defaultType;
	var fielddef_22 = fielddef.getFieldDef;
	var fielddef_23 = fielddef.normalize;
	var fielddef_24 = fielddef.normalizeFieldDef;
	var fielddef_25 = fielddef.normalizeBin;
	var fielddef_26 = fielddef.channelCompatibility;
	var fielddef_27 = fielddef.isNumberFieldDef;
	var fielddef_28 = fielddef.isTimeFieldDef;

	var fielddef$2 = /*#__PURE__*/Object.freeze({
		default: fielddef$1,
		__moduleExports: fielddef,
		isConditionalSelection: fielddef_1,
		isRepeatRef: fielddef_2,
		toFieldDefBase: fielddef_3,
		isConditionalDef: fielddef_4,
		hasConditionalFieldDef: fielddef_5,
		hasConditionalValueDef: fielddef_6,
		isFieldDef: fielddef_7,
		isStringFieldDef: fielddef_8,
		isValueDef: fielddef_9,
		isScaleFieldDef: fielddef_10,
		vgField: fielddef_11,
		isDiscrete: fielddef_12,
		isContinuous: fielddef_13,
		isCount: fielddef_14,
		verbalTitleFormatter: fielddef_15,
		functionalTitleFormatter: fielddef_16,
		defaultTitleFormatter: fielddef_17,
		setTitleFormatter: fielddef_18,
		resetTitleFormatter: fielddef_19,
		title: fielddef_20,
		defaultType: fielddef_21,
		getFieldDef: fielddef_22,
		normalize: fielddef_23,
		normalizeFieldDef: fielddef_24,
		normalizeBin: fielddef_25,
		channelCompatibility: fielddef_26,
		isNumberFieldDef: fielddef_27,
		isTimeFieldDef: fielddef_28
	});

	var expandedtype = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var ExpandedType;
	(function (ExpandedType) {
	    ExpandedType.QUANTITATIVE = type_1$1.Type.QUANTITATIVE;
	    ExpandedType.ORDINAL = type_1$1.Type.ORDINAL;
	    ExpandedType.TEMPORAL = type_1$1.Type.TEMPORAL;
	    ExpandedType.NOMINAL = type_1$1.Type.NOMINAL;
	    ExpandedType.KEY = 'key';
	})(ExpandedType = exports.ExpandedType || (exports.ExpandedType = {}));
	function isDiscrete(fieldType) {
	    return fieldType === type_1$1.Type.ORDINAL || fieldType === type_1$1.Type.NOMINAL || fieldType === ExpandedType.KEY;
	}
	exports.isDiscrete = isDiscrete;

	});

	var expandedtype$1 = unwrapExports(expandedtype);
	var expandedtype_1 = expandedtype.ExpandedType;
	var expandedtype_2 = expandedtype.isDiscrete;

	var expandedtype$2 = /*#__PURE__*/Object.freeze({
		default: expandedtype$1,
		__moduleExports: expandedtype,
		ExpandedType: expandedtype_1,
		isDiscrete: expandedtype_2
	});

	var type$3 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	var scale_2 = scale_1$1;


	var util_1 = util$3;
	/**
	 * Determine if there is a specified scale type and if it is appropriate,
	 * or determine default type if type is unspecified or inappropriate.
	 */
	// NOTE: CompassQL uses this method.
	function scaleType(specifiedType, channel, fieldDef, mark, scaleConfig) {
	    var defaultScaleType = defaultType(channel, fieldDef, mark, scaleConfig);
	    if (!channel_1$1.isScaleChannel(channel)) {
	        // There is no scale for these channels
	        return null;
	    }
	    if (specifiedType !== undefined) {
	        // Check if explicitly specified scale type is supported by the channel
	        if (!scale_1$1.channelSupportScaleType(channel, specifiedType)) {
	            log$5.warn(log$5.message.scaleTypeNotWorkWithChannel(channel, specifiedType, defaultScaleType));
	            return defaultScaleType;
	        }
	        // Check if explicitly specified scale type is supported by the data type
	        if (!fieldDefMatchScaleType(specifiedType, fieldDef)) {
	            log$5.warn(log$5.message.scaleTypeNotWorkWithFieldDef(specifiedType, defaultScaleType));
	            return defaultScaleType;
	        }
	        return specifiedType;
	    }
	    return defaultScaleType;
	}
	exports.scaleType = scaleType;
	/**
	 * Determine appropriate default scale type.
	 */
	// NOTE: Voyager uses this method.
	function defaultType(channel, fieldDef, mark, scaleConfig) {
	    switch (fieldDef.type) {
	        case 'nominal':
	        case 'ordinal':
	            if (channel_1$1.isColorChannel(channel) || channel_1$1.rangeType(channel) === 'discrete') {
	                if (channel === 'shape' && fieldDef.type === 'ordinal') {
	                    log$5.warn(log$5.message.discreteChannelCannotEncode(channel, 'ordinal'));
	                }
	                return 'ordinal';
	            }
	            if (util$3.contains(['x', 'y'], channel)) {
	                if (util$3.contains(['rect', 'bar', 'rule'], mark)) {
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
	            if (channel_1$1.isColorChannel(channel)) {
	                return 'sequential';
	            }
	            else if (channel_1$1.rangeType(channel) === 'discrete') {
	                log$5.warn(log$5.message.discreteChannelCannotEncode(channel, 'temporal'));
	                // TODO: consider using quantize (equivalent to binning) once we have it
	                return 'ordinal';
	            }
	            return 'time';
	        case 'quantitative':
	            if (channel_1$1.isColorChannel(channel)) {
	                if (fieldDef.bin) {
	                    return 'bin-ordinal';
	                }
	                // Use `sequential` as the default color scale for continuous data
	                // since it supports both array range and scheme range.
	                return 'sequential';
	            }
	            else if (channel_1$1.rangeType(channel) === 'discrete') {
	                log$5.warn(log$5.message.discreteChannelCannotEncode(channel, 'quantitative'));
	                // TODO: consider using quantize (equivalent to binning) once we have it
	                return 'ordinal';
	            }
	            // x and y use a linear scale because selections don't work with bin scales.
	            // Binned scales apply discretization but pan/zoom apply transformations to a [min, max] extent domain.
	            if (fieldDef.bin && channel !== 'x' && channel !== 'y') {
	                return 'bin-linear';
	            }
	            return 'linear';
	        case 'latitude':
	        case 'longitude':
	        case 'geojson':
	            return undefined;
	    }
	    /* istanbul ignore next: should never reach this */
	    throw new Error(log$5.message.invalidFieldType(fieldDef.type));
	}
	function fieldDefMatchScaleType(specifiedType, fieldDef) {
	    var type = fieldDef.type;
	    if (util_1.contains([type_1$1.Type.ORDINAL, type_1$1.Type.NOMINAL], type)) {
	        return specifiedType === undefined || scale_2.hasDiscreteDomain(specifiedType);
	    }
	    else if (type === type_1$1.Type.TEMPORAL) {
	        return util_1.contains([scale_1$1.ScaleType.TIME, scale_1$1.ScaleType.UTC, scale_1$1.ScaleType.SEQUENTIAL, undefined], specifiedType);
	    }
	    else if (type === type_1$1.Type.QUANTITATIVE) {
	        if (fieldDef.bin) {
	            return util_1.contains([scale_1$1.ScaleType.BIN_LINEAR, scale_1$1.ScaleType.BIN_ORDINAL, scale_1$1.ScaleType.LINEAR], specifiedType);
	        }
	        return util_1.contains([scale_1$1.ScaleType.LOG, scale_1$1.ScaleType.POW, scale_1$1.ScaleType.SQRT, scale_1$1.ScaleType.QUANTILE, scale_1$1.ScaleType.QUANTIZE, scale_1$1.ScaleType.LINEAR, scale_1$1.ScaleType.SEQUENTIAL, undefined], specifiedType);
	    }
	    return true;
	}
	exports.fieldDefMatchScaleType = fieldDefMatchScaleType;

	});

	var type$4 = unwrapExports(type$3);
	var type_2$1 = type$3.scaleType;
	var type_3$1 = type$3.fieldDefMatchScaleType;

	var type$5 = /*#__PURE__*/Object.freeze({
		default: type$4,
		__moduleExports: type$3,
		scaleType: type_2$1,
		fieldDefMatchScaleType: type_3$1
	});

	var fielddef_1$1 = ( fielddef$2 && fielddef$1 ) || fielddef$2;

	var encoding = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });







	function channelHasField(encoding, channel) {
	    var channelDef = encoding && encoding[channel];
	    if (channelDef) {
	        if (vega_util_1.isArray(channelDef)) {
	            return util$3.some(channelDef, function (fieldDef) { return !!fieldDef.field; });
	        }
	        else {
	            return fielddef_1$1.isFieldDef(channelDef) || fielddef_1$1.hasConditionalFieldDef(channelDef);
	        }
	    }
	    return false;
	}
	exports.channelHasField = channelHasField;
	function isAggregate(encoding) {
	    return util$3.some(channel_1$1.CHANNELS, function (channel) {
	        if (channelHasField(encoding, channel)) {
	            var channelDef = encoding[channel];
	            if (vega_util_1.isArray(channelDef)) {
	                return util$3.some(channelDef, function (fieldDef) { return !!fieldDef.aggregate; });
	            }
	            else {
	                var fieldDef = fielddef_1$1.getFieldDef(channelDef);
	                return fieldDef && !!fieldDef.aggregate;
	            }
	        }
	        return false;
	    });
	}
	exports.isAggregate = isAggregate;
	function normalizeEncoding(encoding, mark) {
	    return util$3.keys(encoding).reduce(function (normalizedEncoding, channel) {
	        if (!channel_1$1.isChannel(channel)) {
	            // Drop invalid channel
	            log$5.warn(log$5.message.invalidEncodingChannel(channel));
	            return normalizedEncoding;
	        }
	        if (!channel_1$1.supportMark(channel, mark)) {
	            // Drop unsupported channel
	            log$5.warn(log$5.message.incompatibleChannel(channel, mark));
	            return normalizedEncoding;
	        }
	        // Drop line's size if the field is aggregated.
	        if (channel === 'size' && mark === 'line') {
	            var fieldDef = fielddef_1$1.getFieldDef(encoding[channel]);
	            if (fieldDef && fieldDef.aggregate) {
	                log$5.warn(log$5.message.LINE_WITH_VARYING_SIZE);
	                return normalizedEncoding;
	            }
	        }
	        // Drop color if either fill or stroke is specified
	        if (channel === 'color' && ('fill' in encoding || 'stroke' in encoding)) {
	            log$5.warn(log$5.message.droppingColor('encoding', { fill: 'fill' in encoding, stroke: 'stroke' in encoding }));
	            return normalizedEncoding;
	        }
	        if (channel === 'detail' || channel === 'order' || (channel === 'tooltip' && vega_util_1.isArray(encoding[channel]))) {
	            var channelDef = encoding[channel];
	            if (channelDef) {
	                // Array of fieldDefs for detail channel (or production rule)
	                normalizedEncoding[channel] = (vega_util_1.isArray(channelDef) ? channelDef : [channelDef])
	                    .reduce(function (defs, fieldDef) {
	                    if (!fielddef_1$1.isFieldDef(fieldDef)) {
	                        log$5.warn(log$5.message.emptyFieldDef(fieldDef, channel));
	                    }
	                    else {
	                        defs.push(fielddef_1$1.normalizeFieldDef(fieldDef, channel));
	                    }
	                    return defs;
	                }, []);
	            }
	        }
	        else {
	            // FIXME: remove this casting.  (I don't know why Typescript doesn't infer this correctly here.)
	            var channelDef = encoding[channel];
	            var fieldDef = fielddef_1$1.getFieldDef(encoding[channel]);
	            if (fieldDef && util$3.contains([type_1$1.Type.LATITUDE, type_1$1.Type.LONGITUDE], fieldDef.type)) {
	                var _a = channel, _ = normalizedEncoding[_a], newEncoding = tslib_1.__rest(normalizedEncoding, [typeof _a === "symbol" ? _a : _a + ""]);
	                var newChannel = channel === 'x' ? 'longitude' :
	                    channel === 'y' ? 'latitude' :
	                        channel === 'x2' ? 'longitude2' :
	                            channel === 'y2' ? 'latitude2' : undefined;
	                log$5.warn(log$5.message.latLongDeprecated(channel, fieldDef.type, newChannel));
	                return tslib_1.__assign({}, newEncoding, (_b = {}, _b[newChannel] = tslib_1.__assign({}, fielddef_1$1.normalize(fieldDef, channel), { type: 'quantitative' }), _b));
	            }
	            if (!fielddef_1$1.isFieldDef(channelDef) && !fielddef_1$1.isValueDef(channelDef) && !fielddef_1$1.isConditionalDef(channelDef)) {
	                log$5.warn(log$5.message.emptyFieldDef(channelDef, channel));
	                return normalizedEncoding;
	            }
	            normalizedEncoding[channel] = fielddef_1$1.normalize(channelDef, channel);
	        }
	        return normalizedEncoding;
	        var _b;
	    }, {});
	}
	exports.normalizeEncoding = normalizeEncoding;
	function isRanged(encoding) {
	    return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
	}
	exports.isRanged = isRanged;
	function fieldDefs(encoding) {
	    var arr = [];
	    channel_1$1.CHANNELS.forEach(function (channel) {
	        if (channelHasField(encoding, channel)) {
	            var channelDef = encoding[channel];
	            (vega_util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (def) {
	                if (fielddef_1$1.isFieldDef(def)) {
	                    arr.push(def);
	                }
	                else if (fielddef_1$1.hasConditionalFieldDef(def)) {
	                    arr.push(def.condition);
	                }
	            });
	        }
	    });
	    return arr;
	}
	exports.fieldDefs = fieldDefs;
	function forEach(mapping, f, thisArg) {
	    if (!mapping) {
	        return;
	    }
	    var _loop_1 = function (channel) {
	        if (vega_util_1.isArray(mapping[channel])) {
	            mapping[channel].forEach(function (channelDef) {
	                f.call(thisArg, channelDef, channel);
	            });
	        }
	        else {
	            f.call(thisArg, mapping[channel], channel);
	        }
	    };
	    for (var _i = 0, _a = util$3.keys(mapping); _i < _a.length; _i++) {
	        var channel = _a[_i];
	        _loop_1(channel);
	    }
	}
	exports.forEach = forEach;
	function reduce(mapping, f, init, thisArg) {
	    if (!mapping) {
	        return init;
	    }
	    return util$3.keys(mapping).reduce(function (r, channel) {
	        var map = mapping[channel];
	        if (vega_util_1.isArray(map)) {
	            return map.reduce(function (r1, channelDef) {
	                return f.call(thisArg, r1, channelDef, channel);
	            }, r);
	        }
	        else {
	            return f.call(thisArg, r, map, channel);
	        }
	    }, init);
	}
	exports.reduce = reduce;

	});

	var encoding$1 = unwrapExports(encoding);
	var encoding_1 = encoding.channelHasField;
	var encoding_2 = encoding.isAggregate;
	var encoding_3 = encoding.normalizeEncoding;
	var encoding_4 = encoding.isRanged;
	var encoding_5 = encoding.fieldDefs;
	var encoding_6 = encoding.forEach;
	var encoding_7 = encoding.reduce;

	var encoding$2 = /*#__PURE__*/Object.freeze({
		default: encoding$1,
		__moduleExports: encoding,
		channelHasField: encoding_1,
		isAggregate: encoding_2,
		normalizeEncoding: encoding_3,
		isRanged: encoding_4,
		fieldDefs: encoding_5,
		forEach: encoding_6,
		reduce: encoding_7
	});

	var encoding_1$1 = ( encoding$2 && encoding$1 ) || encoding$2;

	var stack_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });









	var STACK_OFFSET_INDEX = {
	    zero: 1,
	    center: 1,
	    normalize: 1
	};
	function isStackOffset(s) {
	    return !!STACK_OFFSET_INDEX[s];
	}
	exports.isStackOffset = isStackOffset;
	exports.STACKABLE_MARKS = [mark_1$1.BAR, mark_1$1.AREA, mark_1$1.RULE, mark_1$1.POINT, mark_1$1.CIRCLE, mark_1$1.SQUARE, mark_1$1.LINE, mark_1$1.TEXT, mark_1$1.TICK];
	exports.STACK_BY_DEFAULT_MARKS = [mark_1$1.BAR, mark_1$1.AREA];
	function potentialStackedChannel(encoding) {
	    var xDef = encoding.x;
	    var yDef = encoding.y;
	    if (fielddef_1$1.isFieldDef(xDef) && fielddef_1$1.isFieldDef(yDef)) {
	        if (xDef.type === 'quantitative' && yDef.type === 'quantitative') {
	            if (xDef.stack) {
	                return 'x';
	            }
	            else if (yDef.stack) {
	                return 'y';
	            }
	            // if there is no explicit stacking, only apply stack if there is only one aggregate for x or y
	            if ((!!xDef.aggregate) !== (!!yDef.aggregate)) {
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
	    else if (fielddef_1$1.isFieldDef(xDef) && xDef.type === 'quantitative') {
	        return 'x';
	    }
	    else if (fielddef_1$1.isFieldDef(yDef) && yDef.type === 'quantitative') {
	        return 'y';
	    }
	    return undefined;
	}
	// Note: CompassQL uses this method and only pass in required properties of each argument object.
	// If required properties change, make sure to update CompassQL.
	function stack(m, encoding, stackConfig) {
	    var mark = mark_1$1.isMarkDef(m) ? m.type : m;
	    // Should have stackable mark
	    if (!util$3.contains(exports.STACKABLE_MARKS, mark)) {
	        return null;
	    }
	    var fieldChannel = potentialStackedChannel(encoding);
	    if (!fieldChannel) {
	        return null;
	    }
	    var stackedFieldDef = encoding[fieldChannel];
	    var stackedField = fielddef_1$1.isStringFieldDef(stackedFieldDef) ? fielddef_1$1.vgField(stackedFieldDef, {}) : undefined;
	    var dimensionChannel = fieldChannel === 'x' ? 'y' : 'x';
	    var dimensionDef = encoding[dimensionChannel];
	    var dimensionField = fielddef_1$1.isStringFieldDef(dimensionDef) ? fielddef_1$1.vgField(dimensionDef, {}) : undefined;
	    // Should have grouping level of detail that is different from the dimension field
	    var stackBy = channel_1$1.NONPOSITION_CHANNELS.reduce(function (sc, channel) {
	        if (encoding_1$1.channelHasField(encoding, channel)) {
	            var channelDef = encoding[channel];
	            (vega_util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (cDef) {
	                var fieldDef = fielddef_1$1.getFieldDef(cDef);
	                if (fieldDef.aggregate) {
	                    return;
	                }
	                // Check whether the channel's field is identical to x/y's field or if the channel is a repeat
	                var f = fielddef_1$1.isStringFieldDef(fieldDef) ? fielddef_1$1.vgField(fieldDef, {}) : undefined;
	                if (
	                // if fielddef is a repeat, just include it in the stack by
	                !f ||
	                    // otherwise, the field must be different from x and y fields.
	                    (f !== dimensionField && f !== stackedField)) {
	                    sc.push({ channel: channel, fieldDef: fieldDef });
	                }
	            });
	        }
	        return sc;
	    }, []);
	    if (stackBy.length === 0) {
	        return null;
	    }
	    // Automatically determine offset
	    var offset = undefined;
	    if (stackedFieldDef.stack !== undefined) {
	        offset = stackedFieldDef.stack;
	    }
	    else if (util$3.contains(exports.STACK_BY_DEFAULT_MARKS, mark)) {
	        // Bar and Area with sum ops are automatically stacked by default
	        offset = stackConfig === undefined ? 'zero' : stackConfig;
	    }
	    else {
	        offset = stackConfig;
	    }
	    if (!offset || !isStackOffset(offset)) {
	        return null;
	    }
	    // If stacked, check scale type if it is linear
	    if (stackedFieldDef.scale && stackedFieldDef.scale.type && stackedFieldDef.scale.type !== scale_1$1.ScaleType.LINEAR) {
	        log$5.warn(log$5.message.cannotStackNonLinearScale(stackedFieldDef.scale.type));
	        return null;
	    }
	    // Check if it is a ranged mark
	    if (encoding_1$1.channelHasField(encoding, fieldChannel === channel_1$1.X ? channel_1$1.X2 : channel_1$1.Y2)) {
	        log$5.warn(log$5.message.cannotStackRangedMark(fieldChannel));
	        return null;
	    }
	    // Warn if stacking summative aggregate
	    if (stackedFieldDef.aggregate && !util$3.contains(aggregate_1$1.SUM_OPS, stackedFieldDef.aggregate)) {
	        log$5.warn(log$5.message.stackNonSummativeAggregate(stackedFieldDef.aggregate));
	    }
	    return {
	        groupbyChannel: dimensionDef ? dimensionChannel : undefined,
	        fieldChannel: fieldChannel,
	        impute: mark_1$1.isPathMark(mark),
	        stackBy: stackBy,
	        offset: offset
	    };
	}
	exports.stack = stack;

	});

	var stack = unwrapExports(stack_1);
	var stack_2 = stack_1.isStackOffset;
	var stack_3 = stack_1.STACKABLE_MARKS;
	var stack_4 = stack_1.STACK_BY_DEFAULT_MARKS;
	var stack_5 = stack_1.stack;

	var stack$1 = /*#__PURE__*/Object.freeze({
		default: stack,
		__moduleExports: stack_1,
		isStackOffset: stack_2,
		STACKABLE_MARKS: stack_3,
		STACK_BY_DEFAULT_MARKS: stack_4,
		stack: stack_5
	});

	var stack_1$1 = ( stack$1 && stack ) || stack$1;

	var encoding_1$2 = ( encoding$5 && encoding$4 ) || encoding$5;

	var spec = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });






	/**
	 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
	 * @param {ExtendedUnitSpec} spec
	 * @returns
	 */
	function fromSpec(spec) {
	    return util_1$2.extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, spec.width ? { width: spec.width } : {}, spec.height ? { height: spec.height } : {}, spec.background ? { background: spec.background } : {}, spec.padding ? { padding: spec.padding } : {}, spec.title ? { title: spec.title } : {}, {
	        mark: spec.mark,
	        encodings: util_1$2.keys(spec.encoding).map(function (channel) {
	            var encQ = { channel: channel };
	            var channelDef = spec.encoding[channel];
	            for (var prop in channelDef) {
	                if (property_1$1.isEncodingTopLevelProperty(prop) && channelDef[prop] !== undefined) {
	                    // Currently bin, scale, axis, legend only support boolean, but not null.
	                    // Therefore convert null to false.
	                    if (util_1$2.contains(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
	                        encQ[prop] = false;
	                    }
	                    else {
	                        encQ[prop] = channelDef[prop];
	                    }
	                }
	            }
	            if (encoding_1$2.isFieldQuery(encQ) && encQ.aggregate === 'count' && !encQ.field) {
	                encQ.field = '*';
	            }
	            return encQ;
	        })
	    }, spec.config ? { config: spec.config } : {});
	}
	exports.fromSpec = fromSpec;
	function isAggregate(specQ) {
	    return util_1$2.some(specQ.encodings, function (encQ) {
	        return (encoding_1$2.isFieldQuery(encQ) && !wildcard_1$1.isWildcard(encQ.aggregate) && !!encQ.aggregate) || encoding_1$2.isEnabledAutoCountQuery(encQ);
	    });
	}
	exports.isAggregate = isAggregate;
	/**
	 * @return The Vega-Lite `StackProperties` object that describes the stack
	 * configuration of `specQ`. Returns `null` if this is not stackable.
	 */
	function getVlStack(specQ) {
	    if (!hasRequiredStackProperties(specQ)) {
	        return null;
	    }
	    var encoding = encoding_1$2.toEncoding(specQ.encodings, { schema: null, wildcardMode: 'null' });
	    var mark = specQ.mark;
	    return stack_1$1.stack(mark, encoding, getStackOffset(specQ));
	}
	exports.getVlStack = getVlStack;
	/**
	 * @return The `StackOffset` specified in `specQ`, `undefined` if none
	 * is specified.
	 */
	function getStackOffset(specQ) {
	    for (var _i = 0, _a = specQ.encodings; _i < _a.length; _i++) {
	        var encQ = _a[_i];
	        if (encQ[property_1$1.Property.STACK] !== undefined && !wildcard_1$1.isWildcard(encQ[property_1$1.Property.STACK])) {
	            return encQ[property_1$1.Property.STACK];
	        }
	    }
	    return undefined;
	}
	exports.getStackOffset = getStackOffset;
	/**
	 * @return The `Channel` in which `stack` is specified in `specQ`, or
	 * `null` if none is specified.
	 */
	function getStackChannel(specQ) {
	    for (var _i = 0, _a = specQ.encodings; _i < _a.length; _i++) {
	        var encQ = _a[_i];
	        if (encQ[property_1$1.Property.STACK] !== undefined && !wildcard_1$1.isWildcard(encQ.channel)) {
	            return encQ.channel;
	        }
	    }
	    return null;
	}
	exports.getStackChannel = getStackChannel;
	/**
	 * Returns true iff the given SpecQuery has the properties defined
	 * to be a potential Stack spec.
	 * @param specQ The SpecQuery in question.
	 */
	function hasRequiredStackProperties(specQ) {
	    // TODO(haldenl): make this leaner, a lot of encQ properties aren't required for stack.
	    // TODO(haldenl): check mark, then encodings
	    if (wildcard_1$1.isWildcard(specQ.mark)) {
	        return false;
	    }
	    var requiredEncodingProps = [property_1$1.Property.STACK, property_1$1.Property.CHANNEL,
	        property_1$1.Property.MARK, property_1$1.Property.FIELD, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT, property_1$1.Property.SCALE,
	        property_1$1.getEncodingNestedProp('scale', 'type'), property_1$1.Property.TYPE];
	    var exclude = util$6.toMap(util_1$2.without(property_1$1.ALL_ENCODING_PROPS, requiredEncodingProps));
	    var encodings = specQ.encodings.filter(function (encQ) { return !encoding_1$2.isDisabledAutoCountQuery(encQ); });
	    for (var _i = 0, encodings_1 = encodings; _i < encodings_1.length; _i++) {
	        var encQ = encodings_1[_i];
	        if (objectContainsWildcard(encQ, { exclude: exclude })) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.hasRequiredStackProperties = hasRequiredStackProperties;
	/**
	 * Returns true iff the given object does not contain a nested wildcard.
	 * @param obj The object in question.
	 * @param opt With optional `exclude` property, which defines properties to
	 * ignore when testing for wildcards.
	 */
	// TODO(haldenl): rename to objectHasWildcard, rename prop to obj
	function objectContainsWildcard(obj, opt) {
	    if (opt === void 0) { opt = {}; }
	    if (!util_1$2.isObject(obj)) {
	        return false;
	    }
	    for (var childProp in obj) {
	        if (obj.hasOwnProperty(childProp)) {
	            var wildcard = wildcard_1$1.isWildcard(obj[childProp]);
	            if ((wildcard && (!opt.exclude || !opt.exclude[childProp])) ||
	                objectContainsWildcard(obj[childProp], opt)) {
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
	function hasWildcard(specQ, opt) {
	    if (opt === void 0) { opt = {}; }
	    var exclude = opt.exclude ? util$6.toMap(opt.exclude.map(property_1$1.toKey)) : {};
	    if (wildcard_1$1.isWildcard(specQ.mark) && !exclude['mark']) {
	        return true;
	    }
	    for (var _i = 0, _a = specQ.encodings; _i < _a.length; _i++) {
	        var encQ = _a[_i];
	        if (objectContainsWildcard(encQ, exclude)) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.hasWildcard = hasWildcard;

	});

	var spec$1 = unwrapExports(spec);
	var spec_1 = spec.fromSpec;
	var spec_2 = spec.isAggregate;
	var spec_3 = spec.getVlStack;
	var spec_4 = spec.getStackOffset;
	var spec_5 = spec.getStackChannel;
	var spec_6 = spec.hasRequiredStackProperties;
	var spec_7 = spec.hasWildcard;

	var spec$2 = /*#__PURE__*/Object.freeze({
		default: spec$1,
		__moduleExports: spec,
		fromSpec: spec_1,
		isAggregate: spec_2,
		getVlStack: spec_3,
		getStackOffset: spec_4,
		getStackChannel: spec_5,
		hasRequiredStackProperties: spec_6,
		hasWildcard: spec_7
	});

	var propindex = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * Dictionary that takes property as a key.
	 */
	var PropIndex = /** @class */ (function () {
	    function PropIndex(i) {
	        if (i === void 0) { i = null; }
	        this.index = i ? __assign({}, i) : {};
	    }
	    PropIndex.prototype.has = function (p) {
	        return property_1$1.toKey(p) in this.index;
	    };
	    PropIndex.prototype.get = function (p) {
	        return this.index[property_1$1.toKey(p)];
	    };
	    PropIndex.prototype.set = function (p, value) {
	        this.index[property_1$1.toKey(p)] = value;
	        return this;
	    };
	    PropIndex.prototype.setByKey = function (key, value) {
	        this.index[key] = value;
	    };
	    PropIndex.prototype.map = function (f) {
	        var i = new PropIndex();
	        for (var k in this.index) {
	            i.index[k] = f(this.index[k]);
	        }
	        return i;
	    };
	    PropIndex.prototype.size = function () {
	        return util_1$2.keys(this.index).length;
	    };
	    PropIndex.prototype.duplicate = function () {
	        return new PropIndex(this.index);
	    };
	    return PropIndex;
	}());
	exports.PropIndex = PropIndex;

	});

	var propindex$1 = unwrapExports(propindex);
	var propindex_1 = propindex.PropIndex;

	var propindex$2 = /*#__PURE__*/Object.freeze({
		default: propindex$1,
		__moduleExports: propindex,
		PropIndex: propindex_1
	});

	var spec$3 = ( spec$2 && spec$1 ) || spec$2;

	var propindex_1$1 = ( propindex$2 && propindex$1 ) || propindex$2;

	var shorthand = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });











	function getReplacerIndex(replaceIndex) {
	    return replaceIndex.map(function (r) { return getReplacer(r); });
	}
	exports.getReplacerIndex = getReplacerIndex;
	function getReplacer(replace) {
	    return function (s) {
	        if (replace[s] !== undefined) {
	            return replace[s];
	        }
	        return s;
	    };
	}
	exports.getReplacer = getReplacer;
	function value(v, replacer) {
	    if (wildcard_1$1.isWildcard(v)) {
	        // Return the enum array if it's a full wildcard, or just return SHORT_WILDCARD for short ones.
	        if (!wildcard_1$1.isShortWildcard(v) && v.enum) {
	            return wildcard_1$1.SHORT_WILDCARD + JSON.stringify(v.enum);
	        }
	        else {
	            return wildcard_1$1.SHORT_WILDCARD;
	        }
	    }
	    if (replacer) {
	        return replacer(v);
	    }
	    return v;
	}
	exports.value = value;
	function replace(v, replacer) {
	    if (replacer) {
	        return replacer(v);
	    }
	    return v;
	}
	exports.replace = replace;
	exports.REPLACE_NONE = new propindex_1$1.PropIndex();
	exports.INCLUDE_ALL = 
	// FIXME: remove manual TRANSFORM concat once we really support enumerating transform.
	[].concat(property_1$1.DEFAULT_PROP_PRECEDENCE, property_1$1.SORT_PROPS, [property_1$1.Property.TRANSFORM, property_1$1.Property.STACK], property_1$1.VIEW_PROPS)
	    .reduce(function (pi, prop) { return pi.set(prop, true); }, new propindex_1$1.PropIndex());
	function vlSpec(vlspec, include, replace) {
	    if (include === void 0) { include = exports.INCLUDE_ALL; }
	    if (replace === void 0) { replace = exports.REPLACE_NONE; }
	    var specQ = spec$3.fromSpec(vlspec);
	    return spec(specQ, include, replace);
	}
	exports.vlSpec = vlSpec;
	exports.PROPERTY_SUPPORTED_CHANNELS = {
	    axis: { x: true, y: true, row: true, column: true },
	    legend: { color: true, opacity: true, size: true, shape: true },
	    scale: { x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true },
	    sort: { x: true, y: true, path: true, order: true },
	    stack: { x: true, y: true },
	};
	/**
	 * Returns a shorthand for a spec query
	 * @param specQ a spec query
	 * @param include Dict Set listing property types (key) to be included in the shorthand
	 * @param replace Dictionary of replace function for values of a particular property type (key)
	 */
	function spec(specQ, include, replace) {
	    if (include === void 0) { include = exports.INCLUDE_ALL; }
	    if (replace === void 0) { replace = exports.REPLACE_NONE; }
	    var parts = [];
	    if (include.get(property_1$1.Property.MARK)) {
	        parts.push(value(specQ.mark, replace.get(property_1$1.Property.MARK)));
	    }
	    if (specQ.transform && specQ.transform.length > 0) {
	        parts.push('transform:' + JSON.stringify(specQ.transform));
	    }
	    var stack;
	    if (include.get(property_1$1.Property.STACK)) {
	        stack = spec$3.getVlStack(specQ);
	    }
	    if (specQ.encodings) {
	        var encodings = specQ.encodings.reduce(function (encQs, encQ) {
	            // Exclude encoding mapping with autoCount=false as they are basically disabled.
	            if (!encoding_1$2.isDisabledAutoCountQuery(encQ)) {
	                var str = void 0;
	                if (!!stack && encQ.channel === stack.fieldChannel) {
	                    str = encoding(__assign({}, encQ, { stack: stack.offset }), include, replace);
	                }
	                else {
	                    str = encoding(encQ, include, replace);
	                }
	                if (str) {
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
	    for (var _i = 0, VIEW_PROPS_1 = property_1$1.VIEW_PROPS; _i < VIEW_PROPS_1.length; _i++) {
	        var viewProp = VIEW_PROPS_1[_i];
	        var propString = viewProp.toString();
	        if (include.get(viewProp) && !!specQ[propString]) {
	            var value_1 = specQ[propString];
	            parts.push(propString + "=" + JSON.stringify(value_1));
	        }
	    }
	    return parts.join('|');
	}
	exports.spec = spec;
	/**
	 * Returns a shorthand for an encoding query
	 * @param encQ an encoding query
	 * @param include Dict Set listing property types (key) to be included in the shorthand
	 * @param replace Dictionary of replace function for values of a particular property type (key)
	 */
	function encoding(encQ, include, replace) {
	    if (include === void 0) { include = exports.INCLUDE_ALL; }
	    if (replace === void 0) { replace = exports.REPLACE_NONE; }
	    var parts = [];
	    if (include.get(property_1$1.Property.CHANNEL)) {
	        parts.push(value(encQ.channel, replace.get(property_1$1.Property.CHANNEL)));
	    }
	    if (encoding_1$2.isFieldQuery(encQ)) {
	        var fieldDefStr = fieldDef(encQ, include, replace);
	        if (fieldDefStr) {
	            parts.push(fieldDefStr);
	        }
	    }
	    else if (encoding_1$2.isValueQuery(encQ)) {
	        parts.push(encQ.value);
	    }
	    else if (encoding_1$2.isAutoCountQuery(encQ)) {
	        parts.push('autocount()');
	    }
	    return parts.join(':');
	}
	exports.encoding = encoding;
	/**
	 * Returns a field definition shorthand for an encoding query
	 * @param encQ an encoding query
	 * @param include Dict Set listing property types (key) to be included in the shorthand
	 * @param replace Dictionary of replace function for values of a particular property type (key)
	 */
	function fieldDef(encQ, include, replacer) {
	    if (include === void 0) { include = exports.INCLUDE_ALL; }
	    if (replacer === void 0) { replacer = exports.REPLACE_NONE; }
	    if (include.get(property_1$1.Property.AGGREGATE) && encoding_1$2.isDisabledAutoCountQuery(encQ)) {
	        return '-';
	    }
	    var fn = func(encQ, include, replacer);
	    var props = fieldDefProps(encQ, include, replacer);
	    var fieldAndParams;
	    if (encoding_1$2.isFieldQuery(encQ)) {
	        // field
	        fieldAndParams = include.get('field') ? value(encQ.field, replacer.get('field')) : '...';
	        // type
	        if (include.get(property_1$1.Property.TYPE)) {
	            if (wildcard_1$1.isWildcard(encQ.type)) {
	                fieldAndParams += ',' + value(encQ.type, replacer.get(property_1$1.Property.TYPE));
	            }
	            else {
	                var typeShort = ((encQ.type || type_1$1.Type.QUANTITATIVE) + '').substr(0, 1);
	                fieldAndParams += ',' + value(typeShort, replacer.get(property_1$1.Property.TYPE));
	            }
	        }
	        // encoding properties
	        fieldAndParams += props.map(function (p) {
	            var val = p.value instanceof Array ? '[' + p.value + ']' : p.value;
	            return ',' + p.key + '=' + val;
	        }).join('');
	    }
	    else if (encoding_1$2.isAutoCountQuery(encQ)) {
	        fieldAndParams = '*,q';
	    }
	    if (!fieldAndParams) {
	        return null;
	    }
	    if (fn) {
	        var fnPrefix = util$6.isString(fn) ? fn : wildcard_1$1.SHORT_WILDCARD +
	            (util_1$2.keys(fn).length > 0 ? JSON.stringify(fn) : '');
	        return fnPrefix + '(' + fieldAndParams + ')';
	    }
	    return fieldAndParams;
	}
	exports.fieldDef = fieldDef;
	/**
	 * Return function part of
	 */
	function func(fieldQ, include, replacer) {
	    if (include.get(property_1$1.Property.AGGREGATE) && fieldQ.aggregate && !wildcard_1$1.isWildcard(fieldQ.aggregate)) {
	        return replace(fieldQ.aggregate, replacer.get(property_1$1.Property.AGGREGATE));
	    }
	    else if (include.get(property_1$1.Property.AGGREGATE) && encoding_1$2.isEnabledAutoCountQuery(fieldQ)) {
	        // autoCount is considered a part of aggregate
	        return replace('count', replacer.get(property_1$1.Property.AGGREGATE));
	    }
	    else if (include.get(property_1$1.Property.TIMEUNIT) && fieldQ.timeUnit && !wildcard_1$1.isWildcard(fieldQ.timeUnit)) {
	        return replace(fieldQ.timeUnit, replacer.get(property_1$1.Property.TIMEUNIT));
	    }
	    else if (include.get(property_1$1.Property.BIN) && fieldQ.bin && !wildcard_1$1.isWildcard(fieldQ.bin)) {
	        return 'bin';
	    }
	    else {
	        var fn = null;
	        for (var _i = 0, _a = [property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT, property_1$1.Property.TIMEUNIT, property_1$1.Property.BIN]; _i < _a.length; _i++) {
	            var prop = _a[_i];
	            var val = fieldQ[prop];
	            if (include.get(prop) && fieldQ[prop] && wildcard_1$1.isWildcard(val)) {
	                // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_WILDCARD
	                fn = fn || {};
	                fn[prop] = wildcard_1$1.isShortWildcard(val) ? val : val.enum;
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
	    var props = [];
	    // Parameters of function such as bin will be just top-level properties
	    if (!util_1$2.isBoolean(fieldQ.bin) && !wildcard_1$1.isShortWildcard(fieldQ.bin)) {
	        var bin = fieldQ.bin;
	        for (var child in bin) {
	            var prop = property_1$1.getEncodingNestedProp('bin', child);
	            if (prop && include.get(prop) && bin[child] !== undefined) {
	                props.push({
	                    key: child,
	                    value: value(bin[child], replacer.get(prop))
	                });
	            }
	        }
	        // Sort to make sure that parameter are ordered consistently
	        props.sort(function (a, b) { return a.key.localeCompare(b.key); });
	    }
	    for (var _i = 0, _a = [property_1$1.Property.SCALE, property_1$1.Property.SORT, property_1$1.Property.STACK, property_1$1.Property.AXIS, property_1$1.Property.LEGEND]; _i < _a.length; _i++) {
	        var parent_1 = _a[_i];
	        if (!wildcard_1$1.isWildcard(fieldQ.channel) && !exports.PROPERTY_SUPPORTED_CHANNELS[parent_1][fieldQ.channel]) {
	            continue;
	        }
	        if (include.get(parent_1) && fieldQ[parent_1] !== undefined) {
	            var parentValue = fieldQ[parent_1];
	            if (util_1$2.isBoolean(parentValue) || parentValue === null) {
	                // `scale`, `axis`, `legend` can be false/null.
	                props.push({
	                    key: parent_1 + '',
	                    value: parentValue || false // return true or false (false if null)
	                });
	            }
	            else if (util$6.isString(parentValue)) {
	                // `sort` can be a string (ascending/descending).
	                props.push({
	                    key: parent_1 + '',
	                    value: replace(JSON.stringify(parentValue), replacer.get(parent_1))
	                });
	            }
	            else {
	                var nestedPropChildren = [];
	                for (var child in parentValue) {
	                    var nestedProp = property_1$1.getEncodingNestedProp(parent_1, child);
	                    if (nestedProp && include.get(nestedProp) && parentValue[child] !== undefined) {
	                        nestedPropChildren.push({
	                            key: child,
	                            value: value(parentValue[child], replacer.get(nestedProp))
	                        });
	                    }
	                }
	                if (nestedPropChildren.length > 0) {
	                    var nestedPropObject = nestedPropChildren.sort(function (a, b) { return a.key.localeCompare(b.key); })
	                        .reduce(function (o, item) {
	                        o[item.key] = item.value;
	                        return o;
	                    }, {});
	                    // Sort to make sure that parameter are ordered consistently
	                    props.push({
	                        key: parent_1 + '',
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
	    var splitShorthand = shorthand.split('|');
	    var specQ = {
	        mark: splitShorthand[0],
	        encodings: []
	    };
	    for (var i = 1; i < splitShorthand.length; i++) {
	        var part = splitShorthand[i];
	        var splitPart = splitWithTail(part, ':', 1);
	        var splitPartKey = splitPart[0];
	        var splitPartValue = splitPart[1];
	        if (channel_1$1.isChannel(splitPartKey) || splitPartKey === '?') {
	            var encQ = shorthandParser.encoding(splitPartKey, splitPartValue);
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
	exports.parse = parse;
	/**
	 * Split a string n times into substrings with the specified delimiter and return them as an array.
	 * @param str The string to be split
	 * @param delim The delimiter string used to separate the string
	 * @param number The value used to determine how many times the string is split
	 */
	function splitWithTail(str, delim, count) {
	    var result = [];
	    var lastIndex = 0;
	    for (var i = 0; i < count; i++) {
	        var indexOfDelim = str.indexOf(delim, lastIndex);
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
	exports.splitWithTail = splitWithTail;
	var shorthandParser;
	(function (shorthandParser) {
	    function encoding(channel, fieldDefShorthand) {
	        var encQMixins = fieldDefShorthand.indexOf('(') !== -1 ?
	            fn(fieldDefShorthand) :
	            rawFieldDef(splitWithTail(fieldDefShorthand, ',', 2));
	        return __assign({ channel: channel }, encQMixins);
	    }
	    shorthandParser.encoding = encoding;
	    function rawFieldDef(fieldDefPart) {
	        var fieldQ = {};
	        fieldQ.field = fieldDefPart[0];
	        fieldQ.type = type_1$1.getFullName(fieldDefPart[1].toUpperCase()) || '?';
	        var partParams = fieldDefPart[2];
	        var closingBraceIndex = 0;
	        var i = 0;
	        while (i < partParams.length) {
	            var propEqualSignIndex = partParams.indexOf('=', i);
	            var parsedValue = void 0;
	            if (propEqualSignIndex !== -1) {
	                var prop = partParams.substring(i, propEqualSignIndex);
	                if (partParams[i + prop.length + 1] === '{') {
	                    var openingBraceIndex = i + prop.length + 1;
	                    closingBraceIndex = getClosingIndex(openingBraceIndex, partParams, '}');
	                    var value_2 = partParams.substring(openingBraceIndex, closingBraceIndex + 1);
	                    parsedValue = JSON.parse(value_2);
	                    // index after next comma
	                    i = closingBraceIndex + 2;
	                }
	                else if (partParams[i + prop.length + 1] === '[') {
	                    // find closing square bracket
	                    var openingBracketIndex = i + prop.length + 1;
	                    var closingBracketIndex = getClosingIndex(openingBracketIndex, partParams, ']');
	                    var value_3 = partParams.substring(openingBracketIndex, closingBracketIndex + 1);
	                    parsedValue = JSON.parse(value_3);
	                    // index after next comma
	                    i = closingBracketIndex + 2;
	                }
	                else {
	                    var propIndex = i;
	                    // Substring until the next comma (or end of the string)
	                    var nextCommaIndex = partParams.indexOf(',', i + prop.length);
	                    if (nextCommaIndex === -1) {
	                        nextCommaIndex = partParams.length;
	                    }
	                    // index after next comma
	                    i = nextCommaIndex + 1;
	                    parsedValue = JSON.parse(partParams.substring(propIndex + prop.length + 1, nextCommaIndex));
	                }
	                if (property_1$1.isEncodingNestedParent(prop)) {
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
	        for (var i = openingBraceIndex; i < str.length; i++) {
	            if (str[i] === closingChar) {
	                return i;
	            }
	        }
	    }
	    shorthandParser.getClosingIndex = getClosingIndex;
	    function fn(fieldDefShorthand) {
	        var fieldQ = {};
	        // Aggregate, Bin, TimeUnit as wildcard case
	        if (fieldDefShorthand[0] === '?') {
	            var closingBraceIndex = getClosingIndex(1, fieldDefShorthand, '}');
	            var fnEnumIndex = JSON.parse(fieldDefShorthand.substring(1, closingBraceIndex + 1));
	            for (var encodingProperty in fnEnumIndex) {
	                if (util_1$2.isArray(fnEnumIndex[encodingProperty])) {
	                    fieldQ[encodingProperty] = { enum: fnEnumIndex[encodingProperty] };
	                }
	                else {
	                    fieldQ[encodingProperty] = fnEnumIndex[encodingProperty];
	                }
	            }
	            return __assign({}, fieldQ, rawFieldDef(splitWithTail(fieldDefShorthand.substring(closingBraceIndex + 2, fieldDefShorthand.length - 1), ',', 2)));
	        }
	        else {
	            var func_1 = fieldDefShorthand.substring(0, fieldDefShorthand.indexOf('('));
	            var insideFn = fieldDefShorthand.substring(func_1.length + 1, fieldDefShorthand.length - 1);
	            var insideFnParts = splitWithTail(insideFn, ',', 2);
	            if (aggregate_1$1.isAggregateOp(func_1)) {
	                return __assign({ aggregate: func_1 }, rawFieldDef(insideFnParts));
	            }
	            else if (timeunit_1$1.isTimeUnit(func_1)) {
	                return __assign({ timeUnit: func_1 }, rawFieldDef(insideFnParts));
	            }
	            else if (func_1 === 'bin') {
	                return __assign({ bin: {} }, rawFieldDef(insideFnParts));
	            }
	        }
	    }
	    shorthandParser.fn = fn;
	})(shorthandParser = exports.shorthandParser || (exports.shorthandParser = {}));

	});

	var shorthand$1 = unwrapExports(shorthand);
	var shorthand_1 = shorthand.getReplacerIndex;
	var shorthand_2 = shorthand.getReplacer;
	var shorthand_3 = shorthand.value;
	var shorthand_4 = shorthand.replace;
	var shorthand_5 = shorthand.REPLACE_NONE;
	var shorthand_6 = shorthand.INCLUDE_ALL;
	var shorthand_7 = shorthand.vlSpec;
	var shorthand_8 = shorthand.PROPERTY_SUPPORTED_CHANNELS;
	var shorthand_9 = shorthand.spec;
	var shorthand_10 = shorthand.encoding;
	var shorthand_11 = shorthand.fieldDef;
	var shorthand_12 = shorthand.parse;
	var shorthand_13 = shorthand.splitWithTail;
	var shorthand_14 = shorthand.shorthandParser;

	var shorthand$2 = /*#__PURE__*/Object.freeze({
		default: shorthand$1,
		__moduleExports: shorthand,
		getReplacerIndex: shorthand_1,
		getReplacer: shorthand_2,
		value: shorthand_3,
		replace: shorthand_4,
		REPLACE_NONE: shorthand_5,
		INCLUDE_ALL: shorthand_6,
		vlSpec: shorthand_7,
		PROPERTY_SUPPORTED_CHANNELS: shorthand_8,
		spec: shorthand_9,
		encoding: shorthand_10,
		fieldDef: shorthand_11,
		parse: shorthand_12,
		splitWithTail: shorthand_13,
		shorthandParser: shorthand_14
	});

	var expandedtype_1$1 = ( expandedtype$2 && expandedtype$1 ) || expandedtype$2;

	var type_2$2 = ( type$5 && type$4 ) || type$5;

	var shorthand_1$1 = ( shorthand$2 && shorthand$1 ) || shorthand$2;

	var encoding$3 = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });








	function isValueQuery(encQ) {
	    return encQ !== null && encQ !== undefined && encQ['value'] !== undefined;
	}
	exports.isValueQuery = isValueQuery;
	function isFieldQuery(encQ) {
	    return encQ !== null && encQ !== undefined && (encQ['field'] || encQ['aggregate'] === 'count');
	}
	exports.isFieldQuery = isFieldQuery;
	function isAutoCountQuery(encQ) {
	    return encQ !== null && encQ !== undefined && 'autoCount' in encQ;
	}
	exports.isAutoCountQuery = isAutoCountQuery;
	function isDisabledAutoCountQuery(encQ) {
	    return isAutoCountQuery(encQ) && encQ.autoCount === false;
	}
	exports.isDisabledAutoCountQuery = isDisabledAutoCountQuery;
	function isEnabledAutoCountQuery(encQ) {
	    return isAutoCountQuery(encQ) && encQ.autoCount === true;
	}
	exports.isEnabledAutoCountQuery = isEnabledAutoCountQuery;
	var DEFAULT_PROPS = [property_1$1.Property.AGGREGATE, property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT, property_1$1.Property.FIELD, property_1$1.Property.TYPE, property_1$1.Property.SCALE, property_1$1.Property.SORT, property_1$1.Property.AXIS, property_1$1.Property.LEGEND, property_1$1.Property.STACK, property_1$1.Property.FORMAT];
	function toEncoding(encQs, params) {
	    var _a = params.wildcardMode;
	    var encoding = {};
	    for (var _i = 0, encQs_1 = encQs; _i < encQs_1.length; _i++) {
	        var encQ = encQs_1[_i];
	        if (isDisabledAutoCountQuery(encQ)) {
	            continue; // Do not include this in the output.
	        }
	        var channel = encQ.channel;
	        // if channel is a wildcard, return null
	        if (wildcard_1$1.isWildcard(channel)) {
	            throw new Error('Cannot convert wildcard channel to a fixed channel');
	        }
	        var channelDef = isValueQuery(encQ) ? toValueDef(encQ) : toFieldDef(encQ, params);
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
	exports.toEncoding = toEncoding;
	function toValueDef(valueQ) {
	    var value = valueQ.value;
	    if (wildcard_1$1.isWildcard(value)) {
	        return null;
	    }
	    return { value: value };
	}
	exports.toValueDef = toValueDef;
	function toFieldDef(encQ, params) {
	    if (params === void 0) { params = {}; }
	    var _a = params.props, props = _a === void 0 ? DEFAULT_PROPS : _a, schema = params.schema, _b = params.wildcardMode, wildcardMode = _b === void 0 ? 'skip' : _b;
	    if (isFieldQuery(encQ)) {
	        var fieldDef = {};
	        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
	            var prop = props_1[_i];
	            var encodingProperty = encQ[prop];
	            if (wildcard_1$1.isWildcard(encodingProperty)) {
	                if (wildcardMode === 'skip')
	                    continue;
	                return null;
	            }
	            if (encodingProperty !== undefined) {
	                // if the channel supports this prop
	                var isSupportedByChannel = (!shorthand_1$1.PROPERTY_SUPPORTED_CHANNELS[prop] || shorthand_1$1.PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel]);
	                if (!isSupportedByChannel) {
	                    continue;
	                }
	                if (property_1$1.isEncodingNestedParent(prop) && util$6.isObject(encodingProperty)) {
	                    encodingProperty = __assign({}, encodingProperty); // Make a shallow copy first
	                    for (var childProp in encodingProperty) {
	                        // ensure nested properties are not wildcard before assigning to field def
	                        if (wildcard_1$1.isWildcard(encodingProperty[childProp])) {
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
	            if (prop === property_1$1.Property.SCALE && schema && encQ.type === type_1$1.Type.ORDINAL) {
	                var scale = encQ.scale;
	                var ordinalDomain = schema.fieldSchema(encQ.field).ordinalDomain;
	                if (scale !== null && ordinalDomain) {
	                    fieldDef[property_1$1.Property.SCALE] = __assign({ domain: ordinalDomain }, (util$6.isObject(scale) ? scale : {}));
	                }
	            }
	        }
	        return fieldDef;
	    }
	    else {
	        if (encQ.autoCount === false) {
	            throw new Error("Cannot convert {autoCount: false} into a field def");
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
	exports.toFieldDef = toFieldDef;
	/**
	 * Is a field query continuous field?
	 * This method is applicable only for fieldQuery without wildcard
	 */
	function isContinuous(encQ) {
	    if (isFieldQuery(encQ)) {
	        return fielddef_1$1.isContinuous(toFieldDef(encQ, { props: ['bin', 'timeUnit', 'field', 'type'] }));
	    }
	    return isAutoCountQuery(encQ);
	}
	exports.isContinuous = isContinuous;
	function isMeasure(encQ) {
	    if (isFieldQuery(encQ)) {
	        return !isDimension(encQ) && encQ.type !== 'temporal';
	    }
	    return isAutoCountQuery(encQ);
	}
	exports.isMeasure = isMeasure;
	/**
	 * Is a field query discrete field?
	 * This method is applicable only for fieldQuery without wildcard
	 */
	function isDimension(encQ) {
	    if (isFieldQuery(encQ)) {
	        var fieldDef = toFieldDef(encQ, { props: ['bin', 'timeUnit', 'type'] });
	        return fielddef_1$1.isDiscrete(fieldDef) || !!fieldDef.timeUnit;
	    }
	    return false;
	}
	exports.isDimension = isDimension;
	/**
	 *  Returns the true scale type of an encoding.
	 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
	 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
	 */
	function scaleType(fieldQ) {
	    var scale = fieldQ.scale === true || fieldQ.scale === wildcard_1$1.SHORT_WILDCARD ? {} : fieldQ.scale || {};
	    var type = fieldQ.type, channel = fieldQ.channel, timeUnit = fieldQ.timeUnit, bin = fieldQ.bin;
	    // HACK: All of markType, and scaleConfig only affect
	    // sub-type of ordinal to quantitative scales (point or band)
	    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
	    // Thus, instead of making this method requiring the global mark,
	    // we will just call it with mark = undefined .
	    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
	    var markType = undefined;
	    var scaleConfig = {};
	    if (wildcard_1$1.isWildcard(scale.type) || wildcard_1$1.isWildcard(type) || wildcard_1$1.isWildcard(channel) || wildcard_1$1.isWildcard(bin)) {
	        return undefined;
	    }
	    // If scale type is specified, then use scale.type
	    if (scale.type) {
	        return scale.type;
	    }
	    // if type is fixed and it's not temporal, we can ignore time unit.
	    if (type === 'temporal' && wildcard_1$1.isWildcard(timeUnit)) {
	        return undefined;
	    }
	    // if type is fixed and it's not quantitative, we can ignore bin
	    if (type === 'quantitative' && wildcard_1$1.isWildcard(bin)) {
	        return undefined;
	    }
	    var vegaLiteType = type === expandedtype_1$1.ExpandedType.KEY ? 'nominal' : type;
	    var fieldDef = { type: vegaLiteType, timeUnit: timeUnit, bin: bin };
	    return type_2$2.scaleType(scale.type, channel, fieldDef, markType, scaleConfig);
	}
	exports.scaleType = scaleType;

	});

	var encoding$4 = unwrapExports(encoding$3);
	var encoding_1$3 = encoding$3.isValueQuery;
	var encoding_2$1 = encoding$3.isFieldQuery;
	var encoding_3$1 = encoding$3.isAutoCountQuery;
	var encoding_4$1 = encoding$3.isDisabledAutoCountQuery;
	var encoding_5$1 = encoding$3.isEnabledAutoCountQuery;
	var encoding_6$1 = encoding$3.toEncoding;
	var encoding_7$1 = encoding$3.toValueDef;
	var encoding_8 = encoding$3.toFieldDef;
	var encoding_9 = encoding$3.isContinuous;
	var encoding_10 = encoding$3.isMeasure;
	var encoding_11 = encoding$3.isDimension;
	var encoding_12 = encoding$3.scaleType;

	var TYPES = '__types__';

	var PARSERS = {
	  boolean: util$6.boolean,
	  integer: util$6.number,
	  number:  util$6.number,
	  date:    util$6.date,
	  string:  function(x) { return x == null || x === '' ? null : x + ''; }
	};

	var TESTS = {
	  boolean: function(x) { return x==='true' || x==='false' || util$6.isBoolean(x); },
	  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
	  number: function(x) { return !isNaN(+x) && !util$6.isDate(x); },
	  date: function(x) { return !isNaN(Date.parse(x)); }
	};

	function annotation(data, types) {
	  if (!types) return data && data[TYPES] || null;
	  data[TYPES] = types;
	}

	function fieldNames(datum) {
	  return util$6.keys(datum);
	}

	function bracket(fieldName) {
	  return '[' + fieldName + ']';
	}

	function type$6(values, f) {
	  values = util$6.array(values);
	  f = util$6.$(f);
	  var v, i, n;

	  // if data array has type annotations, use them
	  if (values[TYPES]) {
	    v = f(values[TYPES]);
	    if (util$6.isString(v)) return v;
	  }

	  for (i=0, n=values.length; !util$6.isValid(v) && i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	  }

	  return util$6.isDate(v) ? 'date' :
	    util$6.isNumber(v)    ? 'number' :
	    util$6.isBoolean(v)   ? 'boolean' :
	    util$6.isString(v)    ? 'string' : null;
	}

	function typeAll(data, fields) {
	  if (!data.length) return;
	  var get = fields ? util$6.identity : (fields = fieldNames(data[0]), bracket);
	  return fields.reduce(function(types, f) {
	    return (types[f] = type$6(data, get(f)), types);
	  }, {});
	}

	function infer(values, f) {
	  values = util$6.array(values);
	  f = util$6.$(f);
	  var i, j, v;

	  // types to test for, in precedence order
	  var types = ['boolean', 'integer', 'number', 'date'];

	  for (i=0; i<values.length; ++i) {
	    // get next value to test
	    v = f ? f(values[i]) : values[i];
	    // test value against remaining types
	    for (j=0; j<types.length; ++j) {
	      if (util$6.isValid(v) && !TESTS[types[j]](v)) {
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
	  var get = fields ? util$6.identity : (fields = fieldNames(data[0]), bracket);
	  return fields.reduce(function(types, f) {
	    types[f] = infer(data, get(f));
	    return types;
	  }, {});
	}

	type$6.annotation = annotation;
	type$6.all = typeAll;
	type$6.infer = infer;
	type$6.inferAll = inferAll;
	type$6.parsers = PARSERS;
	var type_1$2 = type$6;
	var type_2$3 = type_1$2.inferAll;

	var type$7 = /*#__PURE__*/Object.freeze({
		default: type_1$2,
		__moduleExports: type_1$2,
		inferAll: type_2$3
	});

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
	  var val = domain.filter(util$6.isValid),
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

	var generate$1 = /*#__PURE__*/Object.freeze({
		default: generate,
		__moduleExports: generate
	});

	var type$8 = ( type$7 && type_1$2 ) || type$7;

	var gen = ( generate$1 && generate ) || generate$1;

	var stats_1 = createCommonjsModule(function (module) {
	var stats = module.exports;

	// Collect unique values.
	// Output: an array of unique values, in first-observed order
	stats.unique = function(values, f, results) {
	  f = util$6.$(f);
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
	  f = util$6.$(f);
	  var v, i, n, valid = 0;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) valid += 1;
	  }
	  return valid;
	};

	// Count the number of null or undefined values.
	stats.count.missing = function(values, f) {
	  f = util$6.$(f);
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
	  f = util$6.$(f);
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
	  f = util$6.$(f);
	  var map = {}, v, i, n;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    map[v] = (v in map) ? map[v] + 1 : 1;
	  }
	  return map;
	};

	// Compute the median of an array of numbers.
	stats.median = function(values, f) {
	  if (f) values = values.map(util$6.$(f));
	  values = values.filter(util$6.isValid).sort(util$6.cmp);
	  return stats.quantile(values, 0.5);
	};

	// Computes the quartile boundaries of an array of numbers.
	stats.quartile = function(values, f) {
	  if (f) values = values.map(util$6.$(f));
	  values = values.filter(util$6.isValid).sort(util$6.cmp);
	  var q = stats.quantile;
	  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
	};

	// Compute the quantile of a sorted array of numbers.
	// Adapted from the D3.js implementation.
	stats.quantile = function(values, f, p) {
	  if (p === undefined) { p = f; f = util$6.identity; }
	  f = util$6.$(f);
	  var H = (values.length - 1) * p + 1,
	      h = Math.floor(H),
	      v = +f(values[h - 1]),
	      e = H - h;
	  return e ? v + e * (f(values[h]) - v) : v;
	};

	// Compute the sum of an array of numbers.
	stats.sum = function(values, f) {
	  f = util$6.$(f);
	  for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) sum += v;
	  }
	  return sum;
	};

	// Compute the mean (average) of an array of numbers.
	stats.mean = function(values, f) {
	  f = util$6.$(f);
	  var mean = 0, delta, i, n, c, v;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) {
	      delta = v - mean;
	      mean = mean + delta / (++c);
	    }
	  }
	  return mean;
	};

	// Compute the geometric mean of an array of numbers.
	stats.mean.geometric = function(values, f) {
	  f = util$6.$(f);
	  var mean = 1, c, n, v, i;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) {
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
	  f = util$6.$(f);
	  var mean = 0, c, n, v, i;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) {
	      mean += 1/v;
	      ++c;
	    }
	  }
	  return c / mean;
	};

	// Compute the sample variance of an array of numbers.
	stats.variance = function(values, f) {
	  f = util$6.$(f);
	  if (!util$6.isArray(values) || values.length < 2) return 0;
	  var mean = 0, M2 = 0, delta, i, c, v;
	  for (i=0, c=0; i<values.length; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) {
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
	  f = util$6.$(f);
	  var a, b, v, i, n = values.length;
	  for (i=0; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) { a = b = v; break; }
	  }
	  for (; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) {
	      if (v < a) a = v;
	      if (v > b) b = v;
	    }
	  }
	  return [a, b];
	};

	// Find the integer indices of the minimum and maximum values.
	stats.extent.index = function(values, f) {
	  f = util$6.$(f);
	  var x = -1, y = -1, a, b, v, i, n = values.length;
	  for (i=0; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) { a = b = v; x = y = i; break; }
	  }
	  for (; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util$6.isValid(v)) {
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
	    a = util$6.$(a);
	    b = util$6.$(b);
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
	  var f = util$6.isFunction(b) || util$6.isString(b),
	      X = values,
	      Y = f ? values : a,
	      e = f ? exp : b,
	      L2 = e === 2 || e == null,
	      n = values.length, s = 0, d, i;
	  if (f) {
	    a = util$6.$(a);
	    b = util$6.$(b);
	  }
	  for (i=0; i<n; ++i) {
	    d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
	    s += L2 ? d*d : Math.pow(Math.abs(d), e);
	  }
	  return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
	};

	// Compute the Cohen's d effect size between two arrays of numbers.
	stats.cohensd = function(values, a, b) {
	  var X = b ? values.map(util$6.$(a)) : values,
	      Y = b ? values.map(util$6.$(b)) : a,
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
	  var X = b ? values.map(util$6.$(a)) : values,
	      Y = b ? values.map(util$6.$(b)) : a,
	      n = X.length,
	      xm = stats.mean(X),
	      ym = stats.mean(Y),
	      sum = 0, c = 0, i, x, y, vx, vy;

	  if (n !== Y.length) {
	    throw Error('Input lengths must match.');
	  }

	  for (i=0; i<n; ++i) {
	    x = X[i]; vx = util$6.isValid(x);
	    y = Y[i]; vy = util$6.isValid(y);
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
	  f = util$6.$(f) || util$6.identity;
	  var a = values.map(function(v, i) {
	      return {idx: i, val: f(v)};
	    })
	    .sort(util$6.comparator('val'));

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
	  b = fn ? values.map(util$6.$(b)) : a;
	  a = fn ? values.map(util$6.$(a)) : values;

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
	  var X = b ? values.map(util$6.$(a)) : values,
	      Y = b ? values.map(util$6.$(b)) : a;

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
	  var X = b ? values.map(util$6.$(a)) : values,
	      Y = b ? values.map(util$6.$(b)) : a,
	      n = X.length,
	      xy = stats.covariance(X, Y), // will throw err if valid vals don't align
	      sx = stats.stdev(X),
	      sy = stats.stdev(Y),
	      slope = xy / (sx*sx),
	      icept = stats.mean(Y) - slope * stats.mean(X),
	      fit = {slope: slope, intercept: icept, R: xy / (sx*sy), rss: 0},
	      res, i;

	  for (i=0; i<n; ++i) {
	    if (util$6.isValid(X[i]) && util$6.isValid(Y[i])) {
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
	  if (util$6.isFunction(a) || util$6.isString(a)) {
	    X = values.map(util$6.$(a));
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

	  bs = gen.random.bootstrap(X, smooth);
	  for (i=0, means = Array(N); i<N; ++i) {
	    means[i] = stats.mean(bs.samples(X.length));
	  }
	  means.sort(util$6.numcmp);
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
	  if (util$6.isFunction(a) || util$6.isString(a)) {
	    X = values.map(util$6.$(a));
	    alpha = b;
	  }
	  alpha = alpha || 0.05;

	  var z = alpha===0.05 ? 1.96 : gen.random.normal(0, 1).icdf(1-(alpha/2)),
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
	  if (util$6.isFunction(b) || util$6.isString(b)) { // table and accessors
	    return (opt && opt.paired ? ztestP : ztest2)(opt, values, a, b);
	  } else if (util$6.isArray(a)) { // two arrays
	    return (b && b.paired ? ztestP : ztest2)(b, values, a);
	  } else if (util$6.isFunction(a) || util$6.isString(a)) {
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
	      gaussian = gen.random.normal(0, 1),
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
	  var X = b ? values.map(util$6.$(a)) : values,
	      Y = b ? values.map(util$6.$(b)) : a,
	      n1 = stats.count(X),
	      n2 = stats.count(Y),
	      diffs = Array(), i;

	  if (n1 !== n2) {
	    throw Error('Array lengths must match.');
	  }
	  for (i=0; i<n1; ++i) {
	    // Only valid differences should contribute to the test statistic
	    if (util$6.isValid(X[i]) && util$6.isValid(Y[i])) {
	      diffs.push(X[i] - Y[i]);
	    }
	  }
	  return stats.z.test(diffs, opt && opt.nullh || 0);
	}

	// Perform a two sample z-test of means. Returns the p-value.
	function ztest2(opt, values, a, b) {
	  var X = b ? values.map(util$6.$(a)) : values,
	      Y = b ? values.map(util$6.$(b)) : a,
	      n1 = stats.count.valid(X),
	      n2 = stats.count.valid(Y),
	      gaussian = gen.random.normal(0, 1),
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
	      R = gen.zeros(n),
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
	  f = util$6.$(f);
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
	  var x = counts ? values.map(util$6.$(a)) : values,
	      y = counts ? values.map(util$6.$(b)) : a,
	      z = counts ? values.map(util$6.$(counts)) : b;

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
	    } else if (util$6.isValid(v)) {
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
	  vals.sort(util$6.cmp);

	  return {
	    type:     type$8(values, f),
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
	  fields = fields || util$6.keys(data[0]);
	  var s = fields.map(function(f) {
	    var p = stats.profile(data, util$6.$(f));
	    return (p.field = f, p);
	  });
	  return (s.__summary__ = true, s);
	};
	});
	var stats_2 = stats_1.summary;

	var stats = /*#__PURE__*/Object.freeze({
		default: stats_1,
		__moduleExports: stats_1,
		summary: stats_2
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

	var d3Time$1 = /*#__PURE__*/Object.freeze({
		default: d3Time,
		__moduleExports: d3Time
	});

	var d3_time = ( d3Time$1 && d3Time ) || d3Time$1;

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
	  create('second', d3_time.second, baseDate),
	  create('minute', d3_time.minute, baseDate),
	  create('hour',   d3_time.hour,   baseDate),
	  create('day',    d3_time.day,    baseDate, [1, 7]),
	  create('month',  d3_time.month,  baseDate, [1, 3, 6]),
	  create('year',   d3_time.year,   baseDate),

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
	  create('second', d3_time.utcSecond, utcBaseDate),
	  create('minute', d3_time.utcMinute, utcBaseDate),
	  create('hour',   d3_time.utcHour,   utcBaseDate),
	  create('day',    d3_time.utcDay,    utcBaseDate, [1, 7]),
	  create('month',  d3_time.utcMonth,  utcBaseDate, [1, 3, 6]),
	  create('year',   d3_time.utcYear,   utcBaseDate),

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

	var time$1 = /*#__PURE__*/Object.freeze({
		default: time,
		__moduleExports: time,
		utc: utc_1
	});

	var time$2 = ( time$1 && time ) || time$1;

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
	    if (util$6.cmp(a[mid], x) < 0) { lo = mid + 1; }
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
	  var units = opt.utc ? time$2.utc : time$2,
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

	var bins$1 = /*#__PURE__*/Object.freeze({
		default: bins_1,
		__moduleExports: bins_1
	});

	var stats_1$1 = ( stats && stats_1 ) || stats;

	var dlBin_ = ( bins$1 && bins_1 ) || bins$1;

	var config_1$1 = ( config$2 && config$1 ) || config$2;

	var schema = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });










	var dlBin = dlBin_;
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
	function build(data, opt, tableSchema) {
	    if (opt === void 0) { opt = {}; }
	    if (tableSchema === void 0) { tableSchema = { fields: [] }; }
	    opt = util_1$2.extend({}, config_1$1.DEFAULT_QUERY_CONFIG, opt);
	    // create profiles for each variable
	    var summaries = stats_1$1.summary(data);
	    var types = type$8.inferAll(data); // inferAll does stronger type inference than summary
	    var tableSchemaFieldIndex = tableSchema.fields.reduce(function (m, field) {
	        m[field.name] = field;
	        return m;
	    }, {});
	    var fieldSchemas = summaries.map(function (fieldProfile, index) {
	        var name = fieldProfile.field;
	        // In Table schema, 'date' doesn't include time so use 'datetime'
	        var type = types[name] === 'date' ? PrimitiveType.DATETIME : types[name];
	        var distinct = fieldProfile.distinct;
	        var vlType;
	        if (type === PrimitiveType.NUMBER) {
	            vlType = type_1$1.Type.QUANTITATIVE;
	        }
	        else if (type === PrimitiveType.INTEGER) {
	            // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
	            if ((distinct < opt.numberNominalLimit) && (distinct / fieldProfile.count < opt.numberNominalProportion)) {
	                vlType = type_1$1.Type.NOMINAL;
	            }
	            else {
	                vlType = type_1$1.Type.QUANTITATIVE;
	            }
	        }
	        else if (type === PrimitiveType.DATETIME) {
	            vlType = type_1$1.Type.TEMPORAL;
	            // need to get correct min/max of date data because datalib's summary method does not
	            // calculate this correctly for date types.
	            fieldProfile.min = new Date(data[0][name]);
	            fieldProfile.max = new Date(data[0][name]);
	            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
	                var dataEntry = data_1[_i];
	                var time = new Date(dataEntry[name]).getTime();
	                if (time < fieldProfile.min.getTime()) {
	                    fieldProfile.min = new Date(time);
	                }
	                if (time > fieldProfile.max.getTime()) {
	                    fieldProfile.max = new Date(time);
	                }
	            }
	        }
	        else {
	            vlType = type_1$1.Type.NOMINAL;
	        }
	        if (vlType === type_1$1.Type.NOMINAL
	            && distinct / fieldProfile.count > opt.minPercentUniqueForKey
	            && fieldProfile.count > opt.minCardinalityForKey) {
	            vlType = expandedtype_1$1.ExpandedType.KEY;
	        }
	        var fieldSchema = {
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
	        var orgFieldSchema = tableSchemaFieldIndex[fieldSchema.name];
	        fieldSchema = util_1$2.extend(fieldSchema, orgFieldSchema);
	        return fieldSchema;
	    });
	    // calculate preset bins for quantitative and temporal data
	    for (var _i = 0, fieldSchemas_1 = fieldSchemas; _i < fieldSchemas_1.length; _i++) {
	        var fieldSchema = fieldSchemas_1[_i];
	        if (fieldSchema.vlType === type_1$1.Type.QUANTITATIVE) {
	            for (var _a = 0, _b = opt.enum.binProps.maxbins; _a < _b.length; _a++) {
	                var maxbins = _b[_a];
	                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
	            }
	        }
	        else if (fieldSchema.vlType === type_1$1.Type.TEMPORAL) {
	            for (var _c = 0, _d = opt.enum.timeUnit; _c < _d.length; _c++) {
	                var unit = _d[_c];
	                if (unit !== undefined) {
	                    fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
	                }
	            }
	        }
	    }
	    var derivedTableSchema = __assign({}, tableSchema, { fields: fieldSchemas });
	    return new Schema(derivedTableSchema);
	}
	exports.build = build;
	// order the field schema when we construct a new Schema
	// this orders the fields in the UI
	var order = {
	    'nominal': 0,
	    'key': 1,
	    'ordinal': 2,
	    'temporal': 3,
	    'quantitative': 4
	};
	var Schema = /** @class */ (function () {
	    function Schema(tableSchema) {
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
	        tableSchema.fields.forEach(function (fieldSchema, index) { return fieldSchema.index = index; });
	        this._fieldSchemaIndex = tableSchema.fields.reduce(function (m, fieldSchema) {
	            m[fieldSchema.name] = fieldSchema;
	            return m;
	        }, {});
	    }
	    /** @return a list of the field names (for enumerating). */
	    Schema.prototype.fieldNames = function () {
	        return this._tableSchema.fields.map(function (fieldSchema) { return fieldSchema.name; });
	    };
	    Object.defineProperty(Schema.prototype, "fieldSchemas", {
	        /** @return a list of FieldSchemas */
	        get: function () {
	            return this._tableSchema.fields;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Schema.prototype.fieldSchema = function (fieldName) {
	        return this._fieldSchemaIndex[fieldName];
	    };
	    Schema.prototype.tableSchema = function () {
	        // the fieldschemas are re-arranged
	        // but this is not allowed in table schema.
	        // so we will re-order based on original index.
	        var tableSchema = util_1$2.duplicate(this._tableSchema);
	        tableSchema.fields.sort(function (a, b) { return a.originalIndex - b.originalIndex; });
	        return tableSchema;
	    };
	    /**
	     * @return primitive type of the field if exist, otherwise return null
	     */
	    Schema.prototype.primitiveType = function (fieldName) {
	        return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].type : null;
	    };
	    /**
	     * @return vlType of measturement of the field if exist, otherwise return null
	     */
	    Schema.prototype.vlType = function (fieldName) {
	        return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].vlType : null;
	    };
	    /** @return cardinality of the field associated with encQ, null if it doesn't exist.
	     *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
	     */
	    Schema.prototype.cardinality = function (fieldQ, augmentTimeUnitDomain, excludeInvalid) {
	        if (augmentTimeUnitDomain === void 0) { augmentTimeUnitDomain = true; }
	        if (excludeInvalid === void 0) { excludeInvalid = false; }
	        var fieldSchema = this._fieldSchemaIndex[fieldQ.field];
	        if (fieldQ.aggregate || (encoding_1$2.isAutoCountQuery(fieldQ) && fieldQ.autoCount)) {
	            return 1;
	        }
	        else if (fieldQ.bin) {
	            // encQ.bin will either be a boolean or a BinQuery
	            var bin = void 0;
	            if (typeof fieldQ.bin === 'boolean') {
	                // autoMaxBins defaults to 10 if channel is Wildcard
	                bin = {
	                    maxbins: bin_1$1.autoMaxBins(fieldQ.channel)
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
	            var maxbins = bin.maxbins;
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
	                    case timeunit_1$1.TimeUnit.SECONDS: return 60;
	                    case timeunit_1$1.TimeUnit.MINUTES: return 60;
	                    case timeunit_1$1.TimeUnit.HOURS: return 24;
	                    case timeunit_1$1.TimeUnit.DAY: return 7;
	                    case timeunit_1$1.TimeUnit.DATE: return 31;
	                    case timeunit_1$1.TimeUnit.MONTH: return 12;
	                    case timeunit_1$1.TimeUnit.QUARTER: return 4;
	                    case timeunit_1$1.TimeUnit.MILLISECONDS: return 1000;
	                }
	            }
	            var unit = fieldQ.timeUnit;
	            var timeStats = fieldSchema.timeStats;
	            // if the cardinality for the timeUnit is not cached, calculate it
	            if (!timeStats || !timeStats[unit]) {
	                timeStats = __assign({}, timeStats, (_a = {}, _a[unit] = timeSummary(fieldQ.timeUnit, fieldSchema.stats), _a));
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
	        var _a;
	    };
	    /**
	     * Given an EncodingQuery with a timeUnit, returns true if the date field
	     * has multiple distinct values for all parts of the timeUnit. Returns undefined
	     * if the timeUnit is undefined.
	     * i.e.
	     * ('yearmonth', [Jan 1 2000, Feb 2 2000] returns false)
	     * ('yearmonth', [Jan 1 2000, Feb 2 2001] returns true)
	     */
	    Schema.prototype.timeUnitHasVariation = function (fieldQ) {
	        if (!fieldQ.timeUnit) {
	            return;
	        }
	        // if there is no variation in `date`, there should not be variation in `day`
	        if (fieldQ.timeUnit === timeunit_1$1.TimeUnit.DAY) {
	            var dateEncQ = util_1$2.extend({}, fieldQ, { timeUnit: timeunit_1$1.TimeUnit.DATE });
	            if (this.cardinality(dateEncQ, false, true) <= 1) {
	                return false;
	            }
	        }
	        var fullTimeUnit = fieldQ.timeUnit;
	        for (var _i = 0, TIMEUNIT_PARTS_1 = timeunit_1$1.TIMEUNIT_PARTS; _i < TIMEUNIT_PARTS_1.length; _i++) {
	            var timeUnitPart = TIMEUNIT_PARTS_1[_i];
	            if (timeunit_1$1.containsTimeUnit(fullTimeUnit, timeUnitPart)) {
	                // Create a clone of encQ, but with singleTimeUnit
	                var singleUnitEncQ = util_1$2.extend({}, fieldQ, { timeUnit: timeUnitPart });
	                if (this.cardinality(singleUnitEncQ, false, true) <= 1) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    };
	    Schema.prototype.domain = function (fieldQueryParts) {
	        // TODO: differentiate for field with bin / timeUnit
	        var fieldSchema = this._fieldSchemaIndex[fieldQueryParts.field];
	        var domain = util_1$2.keys(fieldSchema.stats.unique);
	        if (fieldSchema.vlType === type_1$1.Type.QUANTITATIVE) {
	            // return [min, max], coerced into number types
	            return [+fieldSchema.stats.min, +fieldSchema.stats.max];
	        }
	        else if (fieldSchema.type === PrimitiveType.DATETIME) {
	            // return [min, max] dates
	            return [fieldSchema.stats.min, fieldSchema.stats.max];
	        }
	        else if (fieldSchema.type === PrimitiveType.INTEGER ||
	            fieldSchema.type === PrimitiveType.NUMBER) {
	            // coerce non-quantitative numerical data into number type
	            domain = domain.map(function (x) { return +x; });
	            return domain.sort(util_1$2.cmp);
	        }
	        else if ((fieldSchema.vlType === type_1$1.Type.ORDINAL) && fieldSchema.ordinalDomain) {
	            return fieldSchema.ordinalDomain;
	        }
	        return domain.map(function (x) {
	            // Convert 'null' to null as it is encoded similarly in datalib.
	            // This is wrong when it is a string 'null' but that rarely happens.
	            return x === 'null' ? null : x;
	        }).sort(util_1$2.cmp);
	    };
	    /**
	     * @return a Summary corresponding to the field of the given EncodingQuery
	     */
	    Schema.prototype.stats = function (fieldQ) {
	        // TODO: differentiate for field with bin / timeUnit vs without
	        var fieldSchema = this._fieldSchemaIndex[fieldQ.field];
	        return fieldSchema ? fieldSchema.stats : null;
	    };
	    return Schema;
	}());
	exports.Schema = Schema;
	/**
	 * @return a summary of the binning scheme determined from the given max number of bins
	 */
	function binSummary(maxbins, summary) {
	    var bin = dlBin({
	        min: summary.min,
	        max: summary.max,
	        maxbins: maxbins
	    });
	    // start with summary, pre-binning
	    var result = util_1$2.extend({}, summary);
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
	    var result = util_1$2.extend({}, summary);
	    var unique = {};
	    util_1$2.keys(summary.unique).forEach(function (dateString) {
	        // don't convert null value because the Date constructor will actually convert it to a date
	        var date = (dateString === 'null') ? null : new Date(dateString);
	        // at this point, `date` is either the null value, a valid Date object, or "Invalid Date" which is a Date
	        var key;
	        if (date === null) {
	            key = null;
	        }
	        else if (isNaN(date.getTime())) {
	            key = 'Invalid Date';
	        }
	        else {
	            key = ((timeunit === timeunit_1$1.TimeUnit.DAY) ? date.getDay() : timeunit_1$1.convert(timeunit, date)).toString();
	        }
	        unique[key] = (unique[key] || 0) + summary.unique[dateString];
	    });
	    result.unique = unique;
	    result.distinct = util_1$2.keys(unique).length;
	    return result;
	}
	/**
	 * @return a new unique object based off of the old unique count and a binning scheme
	 */
	function binUnique(bin, oldUnique) {
	    var newUnique = {};
	    for (var value in oldUnique) {
	        var bucket = void 0;
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
	})(PrimitiveType = exports.PrimitiveType || (exports.PrimitiveType = {}));

	});

	var schema$1 = unwrapExports(schema);
	var schema_1 = schema.build;
	var schema_2 = schema.Schema;
	var schema_3 = schema.PrimitiveType;

	var schema$2 = /*#__PURE__*/Object.freeze({
		default: schema$1,
		__moduleExports: schema,
		build: schema_1,
		Schema: schema_2,
		PrimitiveType: schema_3
	});

	var base = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });



	/**
	 * Abstract model for a constraint.
	 */
	var AbstractConstraintModel = /** @class */ (function () {
	    function AbstractConstraintModel(constraint) {
	        this.constraint = constraint;
	    }
	    AbstractConstraintModel.prototype.name = function () {
	        return this.constraint.name;
	    };
	    AbstractConstraintModel.prototype.description = function () {
	        return this.constraint.description;
	    };
	    AbstractConstraintModel.prototype.properties = function () {
	        return this.constraint.properties;
	    };
	    AbstractConstraintModel.prototype.strict = function () {
	        return this.constraint.strict;
	    };
	    return AbstractConstraintModel;
	}());
	exports.AbstractConstraintModel = AbstractConstraintModel;
	var EncodingConstraintModel = /** @class */ (function (_super) {
	    __extends(EncodingConstraintModel, _super);
	    function EncodingConstraintModel(constraint) {
	        return _super.call(this, constraint) || this;
	    }
	    EncodingConstraintModel.prototype.hasAllRequiredPropertiesSpecific = function (encQ) {
	        return util_1$2.every(this.constraint.properties, function (prop) {
	            if (property_1$1.isEncodingNestedProp(prop)) {
	                var parent_1 = prop.parent;
	                var child = prop.child;
	                if (!encQ[parent_1]) {
	                    return true;
	                }
	                return !wildcard_1$1.isWildcard(encQ[parent_1][child]);
	            }
	            if (!encQ[prop]) {
	                return true;
	            }
	            return !wildcard_1$1.isWildcard(encQ[prop]);
	        });
	    };
	    EncodingConstraintModel.prototype.satisfy = function (encQ, schema, encWildcardIndex, opt) {
	        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
	        if (!this.constraint.allowWildcardForProperties) {
	            // TODO: extract as a method and do unit test
	            if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
	                return true;
	            }
	        }
	        return this.constraint.satisfy(encQ, schema, encWildcardIndex, opt);
	    };
	    return EncodingConstraintModel;
	}(AbstractConstraintModel));
	exports.EncodingConstraintModel = EncodingConstraintModel;

	});

	var base$1 = unwrapExports(base);
	var base_1 = base.AbstractConstraintModel;
	var base_2 = base.EncodingConstraintModel;

	var base$2 = /*#__PURE__*/Object.freeze({
		default: base$1,
		__moduleExports: base,
		AbstractConstraintModel: base_1,
		EncodingConstraintModel: base_2
	});

	var schema_1$1 = ( schema$2 && schema$1 ) || schema$2;

	var base_1$1 = ( base$2 && base$1 ) || base$2;

	var field$1 = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });












	exports.FIELD_CONSTRAINTS = [
	    {
	        name: 'aggregateOpSupportedByType',
	        description: 'Aggregate function should be supported by data type.',
	        properties: [property_1$1.Property.TYPE, property_1$1.Property.AGGREGATE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ.aggregate) {
	                return !expandedtype_1$1.isDiscrete(fieldQ.type);
	            }
	            // TODO: some aggregate function are actually supported by ordinal
	            return true; // no aggregate is okay with any type.
	        }
	    }, {
	        name: 'asteriskFieldWithCountOnly',
	        description: 'Field="*" should be disallowed except aggregate="count"',
	        properties: [property_1$1.Property.FIELD, property_1$1.Property.AGGREGATE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            return (fieldQ.field === '*') === (fieldQ.aggregate === 'count');
	        }
	    }, {
	        name: 'minCardinalityForBin',
	        description: 'binned quantitative field should not have too low cardinality',
	        properties: [property_1$1.Property.BIN, property_1$1.Property.FIELD, property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, schema, _, opt) {
	            if (fieldQ.bin && fieldQ.type === type_1$1.Type.QUANTITATIVE) {
	                // We remove bin so schema can infer the raw unbinned cardinality.
	                var fieldQwithoutBin = { channel: fieldQ.channel, field: fieldQ.field, type: fieldQ.type };
	                return schema.cardinality(fieldQwithoutBin) >= opt.minCardinalityForBin;
	            }
	            return true;
	        }
	    }, {
	        name: 'binAppliedForQuantitative',
	        description: 'bin should be applied to quantitative field only.',
	        properties: [property_1$1.Property.TYPE, property_1$1.Property.BIN],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ.bin) {
	                // If binned, the type must be quantitative
	                return fieldQ.type === type_1$1.Type.QUANTITATIVE;
	            }
	            return true;
	        }
	    }, {
	        name: 'channelFieldCompatible',
	        description: "encoding channel's range type be compatible with channel type.",
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.TYPE, property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, schema, encWildcardIndex, opt) {
	            var fieldDef = __assign({ field: 'f' }, encoding_1$2.toFieldDef(fieldQ, { schema: schema, props: ['bin', 'timeUnit', 'type'] }));
	            return fielddef_1$1.channelCompatibility(fieldDef, fieldQ.channel).compatible;
	        }
	    }, {
	        name: 'hasFn',
	        description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
	        properties: [property_1$1.Property.AGGREGATE, property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ.hasFn) {
	                return !!fieldQ.aggregate || !!fieldQ.bin || !!fieldQ.timeUnit;
	            }
	            return true;
	        }
	    }, {
	        name: 'omitScaleZeroWithBinnedField',
	        description: 'Do not use scale zero with binned field',
	        properties: [property_1$1.Property.SCALE, property_1$1.getEncodingNestedProp('scale', 'zero'), property_1$1.Property.BIN],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ.bin && fieldQ.scale) {
	                if (fieldQ.scale.zero === true) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    }, {
	        name: 'onlyOneTypeOfFunction',
	        description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
	        properties: [property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT, property_1$1.Property.TIMEUNIT, property_1$1.Property.BIN],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (encoding_1$2.isFieldQuery(fieldQ)) {
	                var numFn = (!wildcard_1$1.isWildcard(fieldQ.aggregate) && !!fieldQ.aggregate ? 1 : 0) +
	                    (!wildcard_1$1.isWildcard(fieldQ.bin) && !!fieldQ.bin ? 1 : 0) +
	                    (!wildcard_1$1.isWildcard(fieldQ.timeUnit) && !!fieldQ.timeUnit ? 1 : 0);
	                return numFn <= 1;
	            }
	            // For autoCount there is always only one type of function
	            return true;
	        }
	    }, {
	        name: 'timeUnitAppliedForTemporal',
	        description: 'Time unit should be applied to temporal field only.',
	        properties: [property_1$1.Property.TYPE, property_1$1.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ.timeUnit && fieldQ.type !== type_1$1.Type.TEMPORAL) {
	                return false;
	            }
	            return true;
	        }
	    }, {
	        name: 'timeUnitShouldHaveVariation',
	        description: 'A particular time unit should be applied only if they produce unique values.',
	        properties: [property_1$1.Property.TIMEUNIT, property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (fieldQ, schema, encWildcardIndex, opt) {
	            if (fieldQ.timeUnit && fieldQ.type === type_1$1.Type.TEMPORAL) {
	                if (!encWildcardIndex.has('timeUnit') && !opt.constraintManuallySpecifiedValue) {
	                    // Do not have to check this as this is manually specified by users.
	                    return true;
	                }
	                return schema.timeUnitHasVariation(fieldQ);
	            }
	            return true;
	        }
	    }, {
	        name: 'scalePropertiesSupportedByScaleType',
	        description: 'Scale properties must be supported by correct scale type',
	        properties: [].concat(property_1$1.SCALE_PROPS, [property_1$1.Property.SCALE, property_1$1.Property.TYPE]),
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ.scale) {
	                var scale = fieldQ.scale;
	                //  If fieldQ.type is an Wildcard and scale.type is undefined, it is equivalent
	                //  to scale type is Wildcard. If scale type is an Wildcard, we do not yet know
	                //  what the scale type is, and thus can ignore the constraint.
	                var sType = encoding_1$2.scaleType(fieldQ);
	                if (sType === undefined || sType === null) {
	                    // If still ambiguous, doesn't check the constraint
	                    return true;
	                }
	                for (var scaleProp in scale) {
	                    if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
	                        // ignore type and properties of wildcards
	                        continue;
	                    }
	                    var sProp = scaleProp;
	                    if (sType === 'point') {
	                        // HACK: our current implementation of scaleType() can return point
	                        // when the scaleType is a band since we didn't pass all parameter to Vega-Lite's scale type method.
	                        if (!scale_1$1.scaleTypeSupportProperty('point', sProp) && !scale_1$1.scaleTypeSupportProperty('band', sProp)) {
	                            return false;
	                        }
	                    }
	                    else if (!scale_1$1.scaleTypeSupportProperty(sType, sProp)) {
	                        return false;
	                    }
	                }
	            }
	            return true;
	        }
	    }, {
	        name: 'scalePropertiesSupportedByChannel',
	        description: 'Not all scale properties are supported by all encoding channels',
	        properties: [].concat(property_1$1.SCALE_PROPS, [property_1$1.Property.SCALE, property_1$1.Property.CHANNEL]),
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ) {
	                var channel = fieldQ.channel;
	                var scale = fieldQ.scale;
	                if (channel && !wildcard_1$1.isWildcard(channel) && scale) {
	                    if (channel === 'row' || channel === 'column') {
	                        // row / column do not have scale
	                        return false;
	                    }
	                    for (var scaleProp in scale) {
	                        if (!scale.hasOwnProperty(scaleProp))
	                            continue;
	                        if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
	                            // ignore type and properties of wildcards
	                            continue;
	                        }
	                        var isSupported = scale_1$1.channelScalePropertyIncompatability(channel, scaleProp) === undefined;
	                        if (!isSupported) {
	                            return false;
	                        }
	                    }
	                }
	            }
	            return true;
	        }
	    }, {
	        name: 'typeMatchesPrimitiveType',
	        description: 'Data type should be supported by field\'s primitive type.',
	        properties: [property_1$1.Property.FIELD, property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, schema, encWildcardIndex, opt) {
	            if (fieldQ.field === '*') {
	                return true;
	            }
	            var primitiveType = schema.primitiveType(fieldQ.field);
	            var type = fieldQ.type;
	            if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
	                // Do not have to check this as this is manually specified by users.
	                return true;
	            }
	            switch (primitiveType) {
	                case schema_1$1.PrimitiveType.BOOLEAN:
	                case schema_1$1.PrimitiveType.STRING:
	                    return type !== type_1$1.Type.QUANTITATIVE && type !== type_1$1.Type.TEMPORAL;
	                case schema_1$1.PrimitiveType.NUMBER:
	                case schema_1$1.PrimitiveType.INTEGER:
	                    return type !== type_1$1.Type.TEMPORAL;
	                case schema_1$1.PrimitiveType.DATETIME:
	                    // TODO: add NOMINAL, ORDINAL support after we support this in Vega-Lite
	                    return type === type_1$1.Type.TEMPORAL;
	                case null:
	                    // field does not exist in the schema
	                    return false;
	            }
	            throw new Error('Not implemented');
	        }
	    },
	    {
	        name: 'typeMatchesSchemaType',
	        description: 'Enumerated data type of a field should match the field\'s type in the schema.',
	        properties: [property_1$1.Property.FIELD, property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (fieldQ, schema, encWildcardIndex, opt) {
	            if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
	                // Do not have to check this as this is manually specified by users.
	                return true;
	            }
	            if (fieldQ.field === '*') {
	                return fieldQ.type === type_1$1.Type.QUANTITATIVE;
	            }
	            return schema.vlType(fieldQ.field) === fieldQ.type;
	        }
	    }, {
	        name: 'maxCardinalityForCategoricalColor',
	        description: 'Categorical channel should not have too high cardinality',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.FIELD],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (fieldQ, schema, _, opt) {
	            // TODO: missing case where ordinal / temporal use categorical color
	            // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
	            if (fieldQ.channel === channel_1$1.Channel.COLOR && (fieldQ.type === type_1$1.Type.NOMINAL || fieldQ.type === expandedtype_1$1.ExpandedType.KEY)) {
	                return schema.cardinality(fieldQ) <= opt.maxCardinalityForCategoricalColor;
	            }
	            return true; // other channel is irrelevant to this constraint
	        }
	    }, {
	        name: 'maxCardinalityForFacet',
	        description: 'Row/column channel should not have too high cardinality',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.FIELD, property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (fieldQ, schema, _, opt) {
	            if (fieldQ.channel === channel_1$1.Channel.ROW || fieldQ.channel === channel_1$1.Channel.COLUMN) {
	                return schema.cardinality(fieldQ) <= opt.maxCardinalityForFacet;
	            }
	            return true; // other channel is irrelevant to this constraint
	        }
	    }, {
	        name: 'maxCardinalityForShape',
	        description: 'Shape channel should not have too high cardinality',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.FIELD, property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (fieldQ, schema, _, opt) {
	            if (fieldQ.channel === channel_1$1.Channel.SHAPE) {
	                return schema.cardinality(fieldQ) <= opt.maxCardinalityForShape;
	            }
	            return true; // other channel is irrelevant to this constraint
	        }
	    },
	    {
	        name: 'dataTypeAndFunctionMatchScaleType',
	        description: 'Scale type must match data type',
	        properties: [property_1$1.Property.TYPE, property_1$1.Property.SCALE, property_1$1.getEncodingNestedProp('scale', 'type'), property_1$1.Property.TIMEUNIT, property_1$1.Property.BIN],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (fieldQ.scale) {
	                var type = fieldQ.type;
	                var sType = encoding_1$2.scaleType(fieldQ);
	                if (expandedtype_1$1.isDiscrete(type)) {
	                    return sType === undefined || scale_1$1.hasDiscreteDomain(sType);
	                }
	                else if (type === type_1$1.Type.TEMPORAL) {
	                    if (!fieldQ.timeUnit) {
	                        return util_1$2.contains([scale_1$1.ScaleType.TIME, scale_1$1.ScaleType.UTC, undefined], sType);
	                    }
	                    else {
	                        return util_1$2.contains([scale_1$1.ScaleType.TIME, scale_1$1.ScaleType.UTC, undefined], sType) || scale_1$1.hasDiscreteDomain(sType);
	                    }
	                }
	                else if (type === type_1$1.Type.QUANTITATIVE) {
	                    if (fieldQ.bin) {
	                        return util_1$2.contains([scale_1$1.ScaleType.LINEAR, undefined], sType);
	                    }
	                    else {
	                        return util_1$2.contains([scale_1$1.ScaleType.LOG, scale_1$1.ScaleType.POW, scale_1$1.ScaleType.SQRT, scale_1$1.ScaleType.QUANTILE, scale_1$1.ScaleType.QUANTIZE, scale_1$1.ScaleType.LINEAR, undefined], sType);
	                    }
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'stackIsOnlyUsedWithXY',
	        description: 'stack should only be allowed for x and y channels',
	        properties: [property_1$1.Property.STACK, property_1$1.Property.CHANNEL],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (fieldQ, _, __, ___) {
	            if (!!fieldQ.stack) {
	                return fieldQ.channel === channel_1$1.Channel.X || fieldQ.channel === channel_1$1.Channel.Y;
	            }
	            return true;
	        }
	    }
	].map(function (ec) { return new base_1$1.EncodingConstraintModel(ec); });
	exports.FIELD_CONSTRAINT_INDEX = exports.FIELD_CONSTRAINTS.reduce(function (m, ec) {
	    m[ec.name()] = ec;
	    return m;
	}, {});
	exports.FIELD_CONSTRAINTS_BY_PROPERTY = exports.FIELD_CONSTRAINTS.reduce(function (index, c) {
	    for (var _i = 0, _a = c.properties(); _i < _a.length; _i++) {
	        var prop = _a[_i];
	        // Initialize array and use it
	        index.set(prop, index.get(prop) || []);
	        index.get(prop).push(c);
	    }
	    return index;
	}, new propindex_1$1.PropIndex());

	});

	var field$2 = unwrapExports(field$1);
	var field_1 = field$1.FIELD_CONSTRAINTS;
	var field_2 = field$1.FIELD_CONSTRAINT_INDEX;
	var field_3 = field$1.FIELD_CONSTRAINTS_BY_PROPERTY;

	var field$3 = /*#__PURE__*/Object.freeze({
		default: field$2,
		__moduleExports: field$1,
		FIELD_CONSTRAINTS: field_1,
		FIELD_CONSTRAINT_INDEX: field_2,
		FIELD_CONSTRAINTS_BY_PROPERTY: field_3
	});

	var value$3 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });




	exports.VALUE_CONSTRAINTS = [
	    {
	        name: 'doesNotSupportConstantValue',
	        description: 'row, column, x, y, order, and detail should not work with constant values.',
	        properties: [property_1$1.Property.TYPE, property_1$1.Property.AGGREGATE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (valueQ, _, __, ___) {
	            return !(util_1$2.contains(['row', 'column', 'x', 'y', 'detail', 'order'], valueQ.channel));
	        }
	    }
	].map(function (ec) { return new base_1$1.EncodingConstraintModel(ec); });
	exports.VALUE_CONSTRAINT_INDEX = exports.VALUE_CONSTRAINTS.reduce(function (m, ec) {
	    m[ec.name()] = ec;
	    return m;
	}, {});
	exports.VALUE_CONSTRAINTS_BY_PROPERTY = exports.VALUE_CONSTRAINTS.reduce(function (index, c) {
	    for (var _i = 0, _a = c.properties(); _i < _a.length; _i++) {
	        var prop = _a[_i];
	        index.set(prop, index.get(prop) || []);
	        index.get(prop).push(c);
	    }
	    return index;
	}, new propindex_1$1.PropIndex());

	});

	var value$4 = unwrapExports(value$3);
	var value_1 = value$3.VALUE_CONSTRAINTS;
	var value_2 = value$3.VALUE_CONSTRAINT_INDEX;
	var value_3 = value$3.VALUE_CONSTRAINTS_BY_PROPERTY;

	var value$5 = /*#__PURE__*/Object.freeze({
		default: value$4,
		__moduleExports: value$3,
		VALUE_CONSTRAINTS: value_1,
		VALUE_CONSTRAINT_INDEX: value_2,
		VALUE_CONSTRAINTS_BY_PROPERTY: value_3
	});

	var field_1$1 = ( field$3 && field$2 ) || field$3;

	var value_1$1 = ( value$5 && value$4 ) || value$5;

	var encoding$6 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	/**
	 * Check all encoding constraints for a particular property and index tuple
	 */
	function checkEncoding(prop, wildcard, index, specM, schema, opt) {
	    // Check encoding constraint
	    var encodingConstraints = field_1$1.FIELD_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
	    var encQ = specM.getEncodingQueryByIndex(index);
	    for (var _i = 0, encodingConstraints_1 = encodingConstraints; _i < encodingConstraints_1.length; _i++) {
	        var c = encodingConstraints_1[_i];
	        // Check if the constraint is enabled
	        if (c.strict() || !!opt[c.name()]) {
	            // For strict constraint, or enabled non-strict, check the constraints
	            var satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
	            if (!satisfy) {
	                var violatedConstraint = '(enc) ' + c.name();
	                /* istanbul ignore if */
	                if (opt.verbose) {
	                    console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
	                }
	                return violatedConstraint;
	            }
	        }
	    }
	    var valueContraints = value_1$1.VALUE_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
	    for (var _a = 0, valueContraints_1 = valueContraints; _a < valueContraints_1.length; _a++) {
	        var c = valueContraints_1[_a];
	        // Check if the constraint is enabled
	        if ((c.strict() || !!opt[c.name()]) && encoding_1$2.isValueQuery(encQ)) {
	            // For strict constraint, or enabled non-strict, check the constraints
	            var satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
	            if (!satisfy) {
	                var violatedConstraint = '(enc) ' + c.name();
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
	exports.checkEncoding = checkEncoding;

	});

	var encoding$7 = unwrapExports(encoding$6);
	var encoding_2$2 = encoding$6.checkEncoding;

	var encoding$8 = /*#__PURE__*/Object.freeze({
		default: encoding$7,
		__moduleExports: encoding$6,
		checkEncoding: encoding_2$2
	});

	var spec$4 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });












	var NONPOSITION_CHANNELS_INDEX = channel_1$1.NONPOSITION_CHANNELS.reduce(function (m, channel) {
	    m[channel] = true;
	    return m;
	}, {});
	var SpecConstraintModel = /** @class */ (function (_super) {
	    __extends(SpecConstraintModel, _super);
	    function SpecConstraintModel(specConstraint) {
	        return _super.call(this, specConstraint) || this;
	    }
	    SpecConstraintModel.prototype.hasAllRequiredPropertiesSpecific = function (specM) {
	        return util_1$2.every(this.constraint.properties, function (prop) {
	            if (prop === property_1$1.Property.MARK) {
	                return !wildcard_1$1.isWildcard(specM.getMark());
	            }
	            // TODO: transform
	            if (property_1$1.isEncodingNestedProp(prop)) {
	                var parent_1 = prop.parent;
	                var child_1 = prop.child;
	                return util_1$2.every(specM.getEncodings(), function (encQ) {
	                    if (!encQ[parent_1]) {
	                        return true;
	                    }
	                    return !wildcard_1$1.isWildcard(encQ[parent_1][child_1]);
	                });
	            }
	            if (!property_1$1.isEncodingProperty(prop)) {
	                throw new Error('UNIMPLEMENTED');
	            }
	            return util_1$2.every(specM.getEncodings(), function (encQ) {
	                if (!encQ[prop]) {
	                    return true;
	                }
	                return !wildcard_1$1.isWildcard(encQ[prop]);
	            });
	        });
	    };
	    SpecConstraintModel.prototype.satisfy = function (specM, schema, opt) {
	        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
	        if (!this.constraint.allowWildcardForProperties) {
	            if (!this.hasAllRequiredPropertiesSpecific(specM)) {
	                return true;
	            }
	        }
	        return this.constraint.satisfy(specM, schema, opt);
	    };
	    return SpecConstraintModel;
	}(base_1$1.AbstractConstraintModel));
	exports.SpecConstraintModel = SpecConstraintModel;
	exports.SPEC_CONSTRAINTS = [
	    {
	        name: 'noRepeatedChannel',
	        description: 'Each encoding channel should only be used once.',
	        properties: [property_1$1.Property.CHANNEL],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: function (specM, _, __) {
	            var usedChannel = {};
	            // channel for all encodings should be valid
	            return util_1$2.every(specM.getEncodings(), function (encQ) {
	                if (!wildcard_1$1.isWildcard(encQ.channel)) {
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
	        properties: [property_1$1.Property.MARK, property_1$1.Property.SCALE, property_1$1.getEncodingNestedProp('scale', 'zero'), property_1$1.Property.CHANNEL, property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (specM, _, __) {
	            var mark = specM.getMark();
	            var encodings = specM.getEncodings();
	            if (mark === mark_1$1.Mark.BAR) {
	                for (var _i = 0, encodings_1 = encodings; _i < encodings_1.length; _i++) {
	                    var encQ = encodings_1[_i];
	                    if (encoding_1$2.isFieldQuery(encQ) &&
	                        (encQ.channel === channel_1$1.Channel.X || encQ.channel === channel_1$1.Channel.Y) &&
	                        (encQ.type === type_1$1.Type.QUANTITATIVE) &&
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
	        properties: [property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT, property_1$1.Property.TYPE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: function (specM, _, __) {
	            var hasAutoCount = util_1$2.some(specM.getEncodings(), function (encQ) { return encoding_1$2.isEnabledAutoCountQuery(encQ); });
	            if (hasAutoCount) {
	                // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
	                return util_1$2.every(specM.getEncodings(), function (encQ) {
	                    if (encoding_1$2.isValueQuery(encQ)) {
	                        return true;
	                    }
	                    if (encoding_1$2.isAutoCountQuery(encQ)) {
	                        return true;
	                    }
	                    switch (encQ.type) {
	                        case type_1$1.Type.QUANTITATIVE:
	                            return !!encQ.bin;
	                        case type_1$1.Type.TEMPORAL:
	                            return !!encQ.timeUnit;
	                        case type_1$1.Type.ORDINAL:
	                        case expandedtype_1$1.ExpandedType.KEY:
	                        case type_1$1.Type.NOMINAL:
	                            return true;
	                    }
	                    /* istanbul ignore next */
	                    throw new Error('Unsupported Type');
	                });
	            }
	            else {
	                var autoCountEncIndex = specM.wildcardIndex.encodingIndicesByProperty.get('autoCount') || [];
	                var neverHaveAutoCount = util_1$2.every(autoCountEncIndex, function (index) {
	                    var encQ = specM.getEncodingQueryByIndex(index);
	                    return encoding_1$2.isAutoCountQuery(encQ) && !wildcard_1$1.isWildcard(encQ.autoCount);
	                });
	                if (neverHaveAutoCount) {
	                    // If the query surely does not have autoCount
	                    // then one of the field should be
	                    // (1) unbinned quantitative
	                    // (2) temporal without time unit
	                    // (3) nominal or ordinal field
	                    // or at least have potential to be (still ambiguous).
	                    return util_1$2.some(specM.getEncodings(), function (encQ) {
	                        if ((encoding_1$2.isFieldQuery(encQ) || encoding_1$2.isAutoCountQuery(encQ)) && encQ.type === type_1$1.Type.QUANTITATIVE) {
	                            if (encoding_1$2.isDisabledAutoCountQuery(encQ)) {
	                                return false;
	                            }
	                            else {
	                                return encoding_1$2.isFieldQuery(encQ) && (!encQ.bin || wildcard_1$1.isWildcard(encQ.bin));
	                            }
	                        }
	                        else if (encoding_1$2.isFieldQuery(encQ) && encQ.type === type_1$1.Type.TEMPORAL) {
	                            return !encQ.timeUnit || wildcard_1$1.isWildcard(encQ.timeUnit);
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
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.MARK],
	        allowWildcardForProperties: true,
	        strict: true,
	        satisfy: function (specM, _, __) {
	            var mark = specM.getMark();
	            // if mark is unspecified, no need to check
	            if (wildcard_1$1.isWildcard(mark))
	                return true;
	            // TODO: can optimize this to detect only what's the changed property if needed.
	            return util_1$2.every(specM.getEncodings(), function (encQ) {
	                // channel unspecified, no need to check
	                if (wildcard_1$1.isWildcard(encQ.channel))
	                    return true;
	                return channel_1$1.supportMark(encQ.channel, mark);
	            });
	        }
	    },
	    {
	        name: 'hasAllRequiredChannelsForMark',
	        description: 'All required channels for the specified mark should be specified',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.MARK],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (specM, _, __) {
	            var mark = specM.getMark();
	            switch (mark) {
	                case mark_1$1.Mark.AREA:
	                case mark_1$1.Mark.LINE:
	                    return specM.channelUsed(channel_1$1.Channel.X) && specM.channelUsed(channel_1$1.Channel.Y);
	                case mark_1$1.Mark.TEXT:
	                    return specM.channelUsed(channel_1$1.Channel.TEXT);
	                case mark_1$1.Mark.BAR:
	                case mark_1$1.Mark.CIRCLE:
	                case mark_1$1.Mark.SQUARE:
	                case mark_1$1.Mark.TICK:
	                case mark_1$1.Mark.RULE:
	                case mark_1$1.Mark.RECT:
	                    return specM.channelUsed(channel_1$1.Channel.X) || specM.channelUsed(channel_1$1.Channel.Y);
	                case mark_1$1.Mark.POINT:
	                    // This allows generating a point plot if channel was not a wildcard.
	                    return !specM.wildcardIndex.hasProperty(property_1$1.Property.CHANNEL) ||
	                        specM.channelUsed(channel_1$1.Channel.X) || specM.channelUsed(channel_1$1.Channel.Y);
	            }
	            /* istanbul ignore next */
	            throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + JSON.stringify(mark));
	        }
	    },
	    {
	        name: 'omitAggregate',
	        description: 'Omit aggregate plots.',
	        properties: [property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: function (specM, _, __) {
	            if (specM.isAggregate()) {
	                return false;
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitAggregatePlotWithDimensionOnlyOnFacet',
	        description: 'Omit aggregate plots with dimensions only on facets as that leads to inefficient use of space.',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (specM, _, opt) {
	            if (specM.isAggregate()) {
	                var hasNonFacetDim_1 = false, hasDim_1 = false, hasEnumeratedFacetDim_1 = false;
	                specM.specQuery.encodings.forEach(function (encQ, index) {
	                    if (encoding_1$2.isValueQuery(encQ) || (encoding_1$2.isDisabledAutoCountQuery(encQ)))
	                        return; // skip unused field
	                    // FieldQuery & !encQ.aggregate
	                    if (encoding_1$2.isFieldQuery(encQ) && !encQ.aggregate) {
	                        hasDim_1 = true;
	                        if (util_1$2.contains([channel_1$1.Channel.ROW, channel_1$1.Channel.COLUMN], encQ.channel)) {
	                            if (specM.wildcardIndex.hasEncodingProperty(index, property_1$1.Property.CHANNEL)) {
	                                hasEnumeratedFacetDim_1 = true;
	                            }
	                        }
	                        else {
	                            hasNonFacetDim_1 = true;
	                        }
	                    }
	                });
	                if (hasDim_1 && !hasNonFacetDim_1) {
	                    if (hasEnumeratedFacetDim_1 || opt.constraintManuallySpecifiedValue) {
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
	        properties: [property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT, property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT, property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (specM, _, __) {
	            if (specM.isAggregate()) {
	                // TODO relax
	                return util_1$2.some(specM.getEncodings(), function (encQ) {
	                    if (encoding_1$2.isDimension(encQ) || (encoding_1$2.isFieldQuery(encQ) && (encQ.type === 'temporal'))) {
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
	        description: 'Don\'t use bar, line or area to visualize raw plot as they often lead to occlusion.',
	        properties: [property_1$1.Property.MARK, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (specM, _, __) {
	            if (util_1$2.contains([mark_1$1.Mark.BAR, mark_1$1.Mark.LINE, mark_1$1.Mark.AREA], specM.getMark())) {
	                return specM.isAggregate();
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitBarTickWithSize',
	        description: 'Do not map field to size channel with bar and tick mark',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.MARK],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: function (specM, _, opt) {
	            var mark = specM.getMark();
	            if (util_1$2.contains([mark_1$1.Mark.TICK, mark_1$1.Mark.BAR], mark)) {
	                if (specM.channelEncodingField(channel_1$1.Channel.SIZE)) {
	                    if (opt.constraintManuallySpecifiedValue) {
	                        // If size is used and we constraintManuallySpecifiedValue,
	                        // then the spec violates this constraint.
	                        return false;
	                    }
	                    else {
	                        // Otherwise have to search for the size channel and check if it is enumerated
	                        var encodings = specM.specQuery.encodings;
	                        for (var i = 0; i < encodings.length; i++) {
	                            var encQ = encodings[i];
	                            if (encQ.channel === channel_1$1.Channel.SIZE) {
	                                if (specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.CHANNEL)) {
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
	        description: 'Do not use bar and area mark for x and y\'s log scale',
	        properties: [property_1$1.Property.MARK, property_1$1.Property.CHANNEL, property_1$1.Property.SCALE, property_1$1.getEncodingNestedProp('scale', 'type'), property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (specM, _, __) {
	            var mark = specM.getMark();
	            var encodings = specM.getEncodings();
	            // TODO: mark or scale type should be enumerated
	            if (mark === mark_1$1.Mark.AREA || mark === mark_1$1.Mark.BAR) {
	                for (var _i = 0, encodings_2 = encodings; _i < encodings_2.length; _i++) {
	                    var encQ = encodings_2[_i];
	                    if (encoding_1$2.isFieldQuery(encQ) && ((encQ.channel === channel_1$1.Channel.X || encQ.channel === channel_1$1.Channel.Y) && encQ.scale)) {
	                        var sType = encoding_1$2.scaleType(encQ);
	                        if (sType === scale_1$1.ScaleType.LOG) {
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
	        properties: [property_1$1.Property.CHANNEL],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: function (specM, _, opt) {
	            // have to use specM.specQuery.encodings insetad of specM.getEncodings()
	            // since specM.getEncodings() remove encQ with autoCount===false from the array
	            // and thus might shift the index
	            var encodings = specM.specQuery.encodings;
	            var nonPositionChannelCount = 0;
	            var hasEnumeratedNonPositionChannel = false;
	            for (var i = 0; i < encodings.length; i++) {
	                var encQ = encodings[i];
	                if (encoding_1$2.isValueQuery(encQ) || (encoding_1$2.isDisabledAutoCountQuery(encQ))) {
	                    continue; // ignore skipped encoding
	                }
	                var channel = encQ.channel;
	                if (!wildcard_1$1.isWildcard(channel)) {
	                    if (NONPOSITION_CHANNELS_INDEX[channel + '']) {
	                        nonPositionChannelCount += 1;
	                        if (specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.CHANNEL)) {
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
	        properties: [property_1$1.Property.CHANNEL],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (specM, _, opt) {
	            var encodings = specM.specQuery.encodings;
	            var hasNonPositionalChannelOrFacet = false;
	            var hasEnumeratedNonPositionOrFacetChannel = false;
	            var hasX = false, hasY = false;
	            for (var i = 0; i < encodings.length; i++) {
	                var encQ = encodings[i];
	                if (encoding_1$2.isValueQuery(encQ) || (encoding_1$2.isDisabledAutoCountQuery(encQ))) {
	                    continue; // ignore skipped encoding
	                }
	                var channel = encQ.channel;
	                if (channel === channel_1$1.Channel.X) {
	                    hasX = true;
	                }
	                else if (channel === channel_1$1.Channel.Y) {
	                    hasY = true;
	                }
	                else if (!wildcard_1$1.isWildcard(channel)) {
	                    // All non positional channel / Facet
	                    hasNonPositionalChannelOrFacet = true;
	                    if (specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.CHANNEL)) {
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
	        properties: [property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (specM, _, __) {
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
	        properties: [property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT, property_1$1.Property.TIMEUNIT, property_1$1.Property.BIN, property_1$1.Property.TYPE],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: function (specM, _, opt) {
	            if (specM.isAggregate()) {
	                var encodings = specM.specQuery.encodings;
	                for (var i = 0; i < encodings.length; i++) {
	                    var encQ = encodings[i];
	                    if (encoding_1$2.isValueQuery(encQ) || (encoding_1$2.isDisabledAutoCountQuery(encQ)))
	                        continue; // skip unused encoding
	                    // TODO: aggregate for ordinal and temporal
	                    if (encoding_1$2.isFieldQuery(encQ) && encQ.type === type_1$1.Type.TEMPORAL) {
	                        // Temporal fields should have timeUnit or is still a wildcard
	                        if (!encQ.timeUnit && (specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.TIMEUNIT) ||
	                            opt.constraintManuallySpecifiedValue)) {
	                            return false;
	                        }
	                    }
	                    if (encQ.type === type_1$1.Type.QUANTITATIVE) {
	                        if (encoding_1$2.isFieldQuery(encQ) && !encQ.bin && !encQ.aggregate) {
	                            // If Raw Q
	                            if (specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.BIN) ||
	                                specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.AGGREGATE) ||
	                                specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.AUTOCOUNT)) {
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
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (specM, _, opt) {
	            if (specM.isAggregate()) {
	                return true;
	            }
	            return util_1$2.every(specM.specQuery.encodings, function (encQ, index) {
	                if (encoding_1$2.isValueQuery(encQ) || (encoding_1$2.isDisabledAutoCountQuery(encQ)))
	                    return true; // ignore autoCount field
	                if (encQ.channel === channel_1$1.Channel.DETAIL) {
	                    // Detail channel for raw plot is not good, except when its enumerated
	                    // or when it's manually specified but we constraintManuallySpecifiedValue.
	                    if (specM.wildcardIndex.hasEncodingProperty(index, property_1$1.Property.CHANNEL) ||
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
	        properties: [property_1$1.Property.FIELD],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: function (specM, _, opt) {
	            var fieldUsed = {};
	            var fieldEnumerated = {};
	            var encodings = specM.specQuery.encodings;
	            for (var i = 0; i < encodings.length; i++) {
	                var encQ = encodings[i];
	                if (encoding_1$2.isValueQuery(encQ) || encoding_1$2.isAutoCountQuery(encQ))
	                    continue;
	                var field = void 0;
	                if (encQ.field && !wildcard_1$1.isWildcard(encQ.field)) {
	                    field = encQ.field;
	                }
	                if (encoding_1$2.isAutoCountQuery(encQ) && !wildcard_1$1.isWildcard(encQ.autoCount)) {
	                    field = 'count_*';
	                }
	                if (field) {
	                    if (specM.wildcardIndex.hasEncodingProperty(i, property_1$1.Property.FIELD)) {
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
	        properties: [property_1$1.Property.CHANNEL],
	        allowWildcardForProperties: true,
	        strict: false,
	        satisfy: function (specM, _, __) {
	            var encodings = specM.getEncodings();
	            if (encodings.length === 1 && encodings[0].channel === channel_1$1.Channel.Y) {
	                return false;
	            }
	            return true;
	        }
	    },
	    // EXPENSIVE CONSTRAINTS -- check them later!
	    {
	        name: 'hasAppropriateGraphicTypeForMark',
	        description: 'Has appropriate graphic type for mark',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.MARK, property_1$1.Property.TYPE, property_1$1.Property.TIMEUNIT, property_1$1.Property.BIN, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (specM, _, __) {
	            var mark = specM.getMark();
	            switch (mark) {
	                case mark_1$1.Mark.AREA:
	                case mark_1$1.Mark.LINE:
	                    if (specM.isAggregate()) {
	                        var xEncQ_1 = specM.getEncodingQueryByChannel(channel_1$1.Channel.X);
	                        var yEncQ_1 = specM.getEncodingQueryByChannel(channel_1$1.Channel.Y);
	                        var xIsMeasure = encoding_1$2.isMeasure(xEncQ_1);
	                        var yIsMeasure = encoding_1$2.isMeasure(yEncQ_1);
	                        // for aggregate line / area, we need at least one group-by axis and one measure axis.
	                        return xEncQ_1 && yEncQ_1 && (xIsMeasure !== yIsMeasure) &&
	                            // and the dimension axis should not be nominal
	                            // TODO: make this clause optional
	                            !(encoding_1$2.isFieldQuery(xEncQ_1) && !xIsMeasure && util_1$2.contains(['nominal', 'key'], xEncQ_1.type)) &&
	                            !(encoding_1$2.isFieldQuery(yEncQ_1) && !yIsMeasure && util_1$2.contains(['nominal', 'key'], yEncQ_1.type));
	                        // TODO: allow connected scatterplot
	                    }
	                    return true;
	                case mark_1$1.Mark.TEXT:
	                    // FIXME correctly when we add text
	                    return true;
	                case mark_1$1.Mark.BAR:
	                case mark_1$1.Mark.TICK:
	                    // Bar and tick should not use size.
	                    if (specM.channelEncodingField(channel_1$1.Channel.SIZE)) {
	                        return false;
	                    }
	                    else {
	                        // Tick and Bar should have one and only one measure
	                        var xEncQ_2 = specM.getEncodingQueryByChannel(channel_1$1.Channel.X);
	                        var yEncQ_2 = specM.getEncodingQueryByChannel(channel_1$1.Channel.Y);
	                        var xIsMeasure = encoding_1$2.isMeasure(xEncQ_2);
	                        var yIsMeasure = encoding_1$2.isMeasure(yEncQ_2);
	                        if (xIsMeasure !== yIsMeasure) {
	                            return true;
	                        }
	                        return false;
	                    }
	                case mark_1$1.Mark.RECT:
	                    // Until CompassQL supports layering, it only makes sense for
	                    // rect to encode DxD or 1xD (otherwise just use bar).
	                    // Furthermore, color should only be used in a 'heatmap' fashion
	                    // (with a measure field).
	                    var xEncQ = specM.getEncodingQueryByChannel(channel_1$1.Channel.X);
	                    var yEncQ = specM.getEncodingQueryByChannel(channel_1$1.Channel.Y);
	                    var xIsDimension = encoding_1$2.isDimension(xEncQ);
	                    var yIsDimension = encoding_1$2.isDimension(yEncQ);
	                    var colorEncQ = specM.getEncodingQueryByChannel(channel_1$1.Channel.COLOR);
	                    var colorIsQuantitative = encoding_1$2.isMeasure(colorEncQ);
	                    var colorIsOrdinal = encoding_1$2.isFieldQuery(colorEncQ) ?
	                        colorEncQ.type === type_1$1.Type.ORDINAL : false;
	                    var correctChannels = (xIsDimension && yIsDimension) ||
	                        (xIsDimension && !specM.channelUsed(channel_1$1.Channel.Y)) ||
	                        (yIsDimension && !specM.channelUsed(channel_1$1.Channel.X));
	                    var correctColor = !colorEncQ ||
	                        (colorEncQ && (colorIsQuantitative || colorIsOrdinal));
	                    return correctChannels && correctColor;
	                case mark_1$1.Mark.CIRCLE:
	                case mark_1$1.Mark.POINT:
	                case mark_1$1.Mark.SQUARE:
	                case mark_1$1.Mark.RULE:
	                    return true;
	            }
	            /* istanbul ignore next */
	            throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
	        }
	    },
	    {
	        name: 'omitInvalidStackSpec',
	        description: 'If stack is specified, must follow Vega-Lite stack rules',
	        properties: [property_1$1.Property.STACK, property_1$1.Property.FIELD, property_1$1.Property.CHANNEL, property_1$1.Property.MARK, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT, property_1$1.Property.SCALE, property_1$1.getEncodingNestedProp('scale', 'type'), property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (specM, _, __) {
	            if (!specM.wildcardIndex.hasProperty(property_1$1.Property.STACK)) {
	                return true;
	            }
	            var stackProps = specM.getVlStack();
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
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.MARK, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT, property_1$1.Property.SCALE, property_1$1.getEncodingNestedProp('scale', 'type'), property_1$1.Property.TYPE],
	        allowWildcardForProperties: false,
	        strict: true,
	        satisfy: function (specM, _, __) {
	            var specStack = specM.getVlStack();
	            if (specStack != null) {
	                var stackParentEncQ = specM.getEncodingQueryByChannel(specStack.fieldChannel);
	                if (!util_1$2.contains(aggregate_1$1.SUM_OPS, stackParentEncQ.aggregate)) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    },
	    {
	        name: 'omitTableWithOcclusionIfAutoAddCount',
	        description: 'Plots without aggregation or autocount where x and y are both discrete should be omitted if autoAddCount is enabled as they often lead to occlusion',
	        properties: [property_1$1.Property.CHANNEL, property_1$1.Property.TYPE, property_1$1.Property.TIMEUNIT, property_1$1.Property.BIN, property_1$1.Property.AGGREGATE, property_1$1.Property.AUTOCOUNT],
	        allowWildcardForProperties: false,
	        strict: false,
	        satisfy: function (specM, _, opt) {
	            if (opt.autoAddCount) {
	                var xEncQ = specM.getEncodingQueryByChannel('x');
	                var yEncQ = specM.getEncodingQueryByChannel('y');
	                if ((!encoding_1$2.isFieldQuery(xEncQ) || encoding_1$2.isDimension(xEncQ)) &&
	                    (!encoding_1$2.isFieldQuery(yEncQ) || encoding_1$2.isDimension(yEncQ))) {
	                    if (!specM.isAggregate()) {
	                        return false;
	                    }
	                    else {
	                        return util_1$2.every(specM.getEncodings(), function (encQ) {
	                            var channel = encQ.channel;
	                            if (channel !== channel_1$1.Channel.X && channel !== channel_1$1.Channel.Y &&
	                                channel !== channel_1$1.Channel.ROW && channel !== channel_1$1.Channel.COLUMN) {
	                                // Non-position fields should not be unaggreated fields
	                                if (encoding_1$2.isFieldQuery(encQ) && !encQ.aggregate) {
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
	].map(function (sc) { return new SpecConstraintModel(sc); });
	// For testing
	exports.SPEC_CONSTRAINT_INDEX = exports.SPEC_CONSTRAINTS.reduce(function (m, c) {
	    m[c.name()] = c;
	    return m;
	}, {});
	var SPEC_CONSTRAINTS_BY_PROPERTY = exports.SPEC_CONSTRAINTS.reduce(function (index, c) {
	    for (var _i = 0, _a = c.properties(); _i < _a.length; _i++) {
	        var prop = _a[_i];
	        // Initialize array and use it
	        index.set(prop, index.get(prop) || []);
	        index.get(prop).push(c);
	    }
	    return index;
	}, new propindex_1$1.PropIndex());
	/**
	 * Check all encoding constraints for a particular property and index tuple
	 */
	function checkSpec(prop, wildcard, specM, schema, opt) {
	    // Check encoding constraint
	    var specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
	    for (var _i = 0, specConstraints_1 = specConstraints; _i < specConstraints_1.length; _i++) {
	        var c = specConstraints_1[_i];
	        // Check if the constraint is enabled
	        if (c.strict() || !!opt[c.name()]) {
	            // For strict constraint, or enabled non-strict, check the constraints
	            var satisfy = c.satisfy(specM, schema, opt);
	            if (!satisfy) {
	                var violatedConstraint = '(spec) ' + c.name();
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
	exports.checkSpec = checkSpec;

	});

	var spec$5 = unwrapExports(spec$4);
	var spec_1$1 = spec$4.SpecConstraintModel;
	var spec_2$1 = spec$4.SPEC_CONSTRAINTS;
	var spec_3$1 = spec$4.SPEC_CONSTRAINT_INDEX;
	var spec_4$1 = spec$4.checkSpec;

	var spec$6 = /*#__PURE__*/Object.freeze({
		default: spec$5,
		__moduleExports: spec$4,
		SpecConstraintModel: spec_1$1,
		SPEC_CONSTRAINTS: spec_2$1,
		SPEC_CONSTRAINT_INDEX: spec_3$1,
		checkSpec: spec_4$1
	});

	var encoding$9 = ( encoding$8 && encoding$7 ) || encoding$8;

	var spec$7 = ( spec$6 && spec$5 ) || spec$6;

	var constraint = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.encoding = encoding$9;

	exports.spec = spec$7;

	});

	var index$1 = unwrapExports(constraint);
	var constraint_1 = constraint.encoding;
	var constraint_2 = constraint.spec;

	var constraint$1 = /*#__PURE__*/Object.freeze({
		default: index$1,
		__moduleExports: constraint,
		encoding: constraint_1,
		spec: constraint_2
	});

	var enumerator = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });





	var ENUMERATOR_INDEX = new propindex_1$1.PropIndex();
	function getEnumerator(prop) {
	    return ENUMERATOR_INDEX.get(prop);
	}
	exports.getEnumerator = getEnumerator;
	ENUMERATOR_INDEX.set('mark', function (wildcardIndex, schema, opt) {
	    return function (answerSet, specM) {
	        var markWildcard = specM.getMark();
	        // enumerate the value
	        markWildcard.enum.forEach(function (mark) {
	            specM.setMark(mark);
	            // Check spec constraint
	            var violatedSpecConstraint = spec$7.checkSpec('mark', wildcardIndex.mark, specM, schema, opt);
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
	property_1$1.ENCODING_TOPLEVEL_PROPS.forEach(function (prop) {
	    ENUMERATOR_INDEX.set(prop, EncodingPropertyGeneratorFactory(prop));
	});
	property_1$1.ENCODING_NESTED_PROPS.forEach(function (nestedProp) {
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
	    return function (wildcardIndex, schema, opt) {
	        return function (answerSet, specM) {
	            // index of encoding mappings that require enumeration
	            var indices = wildcardIndex.encodingIndicesByProperty.get(prop);
	            function enumerate(jobIndex) {
	                if (jobIndex === indices.length) {
	                    // emit and terminate
	                    answerSet.push(specM.duplicate());
	                    return;
	                }
	                var index = indices[jobIndex];
	                var wildcard = wildcardIndex.encodings[index].get(prop);
	                var encQ = specM.getEncodingQueryByIndex(index);
	                var propWildcard = specM.getEncodingProperty(index, prop);
	                if (encoding_1$2.isValueQuery(encQ) || (
	                // TODO: encQ.exclude
	                // If this encoding query is an excluded autoCount, there is no point enumerating other properties
	                // for this encoding query because they will be excluded anyway.
	                // Thus, we can just move on to the next encoding to enumerate.
	                (encoding_1$2.isDisabledAutoCountQuery(encQ)) ||
	                    // nested encoding property might have its parent set to false
	                    // therefore, we no longer have to enumerate them
	                    !propWildcard)) {
	                    enumerate(jobIndex + 1);
	                }
	                else {
	                    wildcard.enum.forEach(function (propVal) {
	                        if (propVal === null) {
	                            // our duplicate() method use JSON.stringify, parse and thus can accidentally
	                            // convert undefined in an array into null
	                            propVal = undefined;
	                        }
	                        specM.setEncodingProperty(index, prop, propVal, wildcard);
	                        // Check encoding constraint
	                        var violatedEncodingConstraint = encoding$9.checkEncoding(prop, wildcard, index, specM, schema, opt);
	                        if (violatedEncodingConstraint) {
	                            return; // do not keep searching
	                        }
	                        // Check spec constraint
	                        var violatedSpecConstraint = spec$7.checkSpec(prop, wildcard, specM, schema, opt);
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
	exports.EncodingPropertyGeneratorFactory = EncodingPropertyGeneratorFactory;

	});

	var enumerator$1 = unwrapExports(enumerator);
	var enumerator_1 = enumerator.getEnumerator;
	var enumerator_2 = enumerator.EncodingPropertyGeneratorFactory;

	var enumerator$2 = /*#__PURE__*/Object.freeze({
		default: enumerator$1,
		__moduleExports: enumerator,
		getEnumerator: enumerator_1,
		EncodingPropertyGeneratorFactory: enumerator_2
	});

	var wildcardindex = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	var WildcardIndex = /** @class */ (function () {
	    function WildcardIndex() {
	        this._mark = undefined;
	        this._encodings = {};
	        this._encodingIndicesByProperty = new propindex_1$1.PropIndex();
	    }
	    WildcardIndex.prototype.setEncodingProperty = function (index, prop, wildcard) {
	        var encodingsIndex = this._encodings;
	        // Init encoding index and set prop
	        var encIndex = encodingsIndex[index] = encodingsIndex[index] || new propindex_1$1.PropIndex();
	        encIndex.set(prop, wildcard);
	        // Initialize indicesByProperty[prop] and add index
	        var indicesByProp = this._encodingIndicesByProperty;
	        indicesByProp.set(prop, (indicesByProp.get(prop) || []));
	        indicesByProp.get(prop).push(index);
	        return this;
	    };
	    WildcardIndex.prototype.hasEncodingProperty = function (index, prop) {
	        return !!this._encodings[index] && this._encodings[index].has(prop);
	    };
	    WildcardIndex.prototype.hasProperty = function (prop) {
	        if (property_1$1.isEncodingProperty(prop)) {
	            return this.encodingIndicesByProperty.has(prop);
	        }
	        else if (prop === 'mark') {
	            return !!this.mark;
	        }
	        /* istanbul ignore next */
	        throw new Error('Unimplemented for property ' + prop);
	    };
	    WildcardIndex.prototype.isEmpty = function () {
	        return !this.mark && this.encodingIndicesByProperty.size() === 0;
	    };
	    WildcardIndex.prototype.setMark = function (mark) {
	        this._mark = mark;
	        return this;
	    };
	    Object.defineProperty(WildcardIndex.prototype, "mark", {
	        get: function () {
	            return this._mark;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(WildcardIndex.prototype, "encodings", {
	        get: function () {
	            return this._encodings;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(WildcardIndex.prototype, "encodingIndicesByProperty", {
	        get: function () {
	            return this._encodingIndicesByProperty;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return WildcardIndex;
	}());
	exports.WildcardIndex = WildcardIndex;

	});

	var wildcardindex$1 = unwrapExports(wildcardindex);
	var wildcardindex_1 = wildcardindex.WildcardIndex;

	var wildcardindex$2 = /*#__PURE__*/Object.freeze({
		default: wildcardindex$1,
		__moduleExports: wildcardindex,
		WildcardIndex: wildcardindex_1
	});

	var groupby = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });





	exports.REPLACE_BLANK_FIELDS = { '*': '' };
	exports.REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
	exports.REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
	exports.REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
	function isExtendedGroupBy(g) {
	    return util$6.isObject(g) && !!g['property'];
	}
	exports.isExtendedGroupBy = isExtendedGroupBy;
	function parseGroupBy(groupBy, include, replaceIndex) {
	    include = include || new propindex_1$1.PropIndex();
	    replaceIndex = replaceIndex || new propindex_1$1.PropIndex();
	    groupBy.forEach(function (grpBy) {
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
	        replacer: shorthand_1$1.getReplacerIndex(replaceIndex)
	    };
	}
	exports.parseGroupBy = parseGroupBy;
	function toString(groupBy) {
	    if (util$6.isArray(groupBy)) {
	        return groupBy.map(function (g) {
	            if (isExtendedGroupBy(g)) {
	                if (g.replace) {
	                    var replaceIndex_1 = util_1$2.keys(g.replace).reduce(function (index, valFrom) {
	                        var valTo = g.replace[valFrom];
	                        (index[valTo] = index[valTo] || []).push(valFrom);
	                        return index;
	                    }, {});
	                    return g.property + '[' + util_1$2.keys(replaceIndex_1).map(function (valTo) {
	                        var valsFrom = replaceIndex_1[valTo].sort();
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
	exports.toString = toString;
	exports.GROUP_BY_FIELD_TRANSFORM = [
	    property_1$1.Property.FIELD, property_1$1.Property.TYPE,
	    property_1$1.Property.AGGREGATE, property_1$1.Property.BIN, property_1$1.Property.TIMEUNIT, property_1$1.Property.STACK
	];
	exports.GROUP_BY_ENCODING = exports.GROUP_BY_FIELD_TRANSFORM.concat([
	    {
	        property: property_1$1.Property.CHANNEL,
	        replace: {
	            'x': 'xy', 'y': 'xy',
	            'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
	            'row': 'facet', 'column': 'facet'
	        }
	    }
	]);

	});

	var groupby$1 = unwrapExports(groupby);
	var groupby_1 = groupby.REPLACE_BLANK_FIELDS;
	var groupby_2 = groupby.REPLACE_XY_CHANNELS;
	var groupby_3 = groupby.REPLACE_FACET_CHANNELS;
	var groupby_4 = groupby.REPLACE_MARK_STYLE_CHANNELS;
	var groupby_5 = groupby.isExtendedGroupBy;
	var groupby_6 = groupby.parseGroupBy;
	var groupby_7 = groupby.GROUP_BY_FIELD_TRANSFORM;
	var groupby_8 = groupby.GROUP_BY_ENCODING;

	var groupby$2 = /*#__PURE__*/Object.freeze({
		default: groupby$1,
		__moduleExports: groupby,
		REPLACE_BLANK_FIELDS: groupby_1,
		REPLACE_XY_CHANNELS: groupby_2,
		REPLACE_FACET_CHANNELS: groupby_3,
		REPLACE_MARK_STYLE_CHANNELS: groupby_4,
		isExtendedGroupBy: groupby_5,
		parseGroupBy: groupby_6,
		GROUP_BY_FIELD_TRANSFORM: groupby_7,
		GROUP_BY_ENCODING: groupby_8
	});

	var groupBy = ( groupby$2 && groupby$1 ) || groupby$2;

	var nest_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });





	/**
	 * Registry for all possible grouping key functions.
	 */
	var groupRegistry = {};
	/**
	 * Add a grouping function to the registry.
	 */
	function registerKeyFn(name, keyFn) {
	    groupRegistry[name] = keyFn;
	}
	exports.registerKeyFn = registerKeyFn;
	exports.FIELD = 'field';
	exports.FIELD_TRANSFORM = 'fieldTransform';
	exports.ENCODING = 'encoding';
	exports.SPEC = 'spec';
	/**
	 * Group the input spec query model by a key function registered in the group registry
	 * @return
	 */
	function nest(specModels, queryNest) {
	    if (queryNest) {
	        var rootGroup_1 = {
	            name: '',
	            path: '',
	            items: [],
	        };
	        var groupIndex_1 = {};
	        // global `includes` and `replaces` will get augmented by each level's groupBy.
	        // Upper level's `groupBy` will get cascaded to lower-level groupBy.
	        // `replace` can be overriden in a lower-level to support different grouping.
	        var includes_1 = [];
	        var replaces = [];
	        var replacers_1 = [];
	        for (var l = 0; l < queryNest.length; l++) {
	            includes_1.push(l > 0 ? includes_1[l - 1].duplicate() : new propindex_1$1.PropIndex());
	            replaces.push(l > 0 ? replaces[l - 1].duplicate() : new propindex_1$1.PropIndex());
	            var groupBy$$1 = queryNest[l].groupBy;
	            if (util$6.isArray(groupBy$$1)) {
	                // If group is array, it's an array of extended group by that need to be parsed
	                var parsedGroupBy = groupBy.parseGroupBy(groupBy$$1, includes_1[l], replaces[l]);
	                replacers_1.push(parsedGroupBy.replacer);
	            }
	        }
	        // With includes and replacers, now we can construct the nesting tree
	        specModels.forEach(function (specM) {
	            var path = '';
	            var group = rootGroup_1;
	            for (var l = 0; l < queryNest.length; l++) {
	                var groupBy$$1 = group.groupBy = queryNest[l].groupBy;
	                group.orderGroupBy = queryNest[l].orderGroupBy;
	                var key = util$6.isArray(groupBy$$1) ?
	                    shorthand_1$1.spec(specM.specQuery, includes_1[l], replacers_1[l]) :
	                    groupRegistry[groupBy$$1](specM.specQuery);
	                path += '/' + key;
	                if (!groupIndex_1[path]) {
	                    groupIndex_1[path] = {
	                        name: key,
	                        path: path,
	                        items: [],
	                    };
	                    group.items.push(groupIndex_1[path]);
	                }
	                group = groupIndex_1[path];
	            }
	            group.items.push(specM);
	        });
	        return rootGroup_1;
	    }
	    else {
	        // no nesting, just return a flat group
	        return {
	            name: '',
	            path: '',
	            items: specModels,
	        };
	    }
	}
	exports.nest = nest;
	// TODO: move this to groupBy, rename properly, and export
	var GROUP_BY_FIELD = [property_1$1.Property.FIELD];
	var PARSED_GROUP_BY_FIELD = groupBy.parseGroupBy(GROUP_BY_FIELD);
	function getGroupByKey(specM, groupBy$$1) {
	    return groupRegistry[groupBy$$1](specM);
	}
	exports.getGroupByKey = getGroupByKey;
	registerKeyFn(exports.FIELD, function (specQ) {
	    return shorthand_1$1.spec(specQ, PARSED_GROUP_BY_FIELD.include, PARSED_GROUP_BY_FIELD.replacer);
	});
	exports.PARSED_GROUP_BY_FIELD_TRANSFORM = groupBy.parseGroupBy(groupBy.GROUP_BY_FIELD_TRANSFORM);
	registerKeyFn(exports.FIELD_TRANSFORM, function (specQ) {
	    return shorthand_1$1.spec(specQ, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.include, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.replacer);
	});
	exports.PARSED_GROUP_BY_ENCODING = groupBy.parseGroupBy(groupBy.GROUP_BY_ENCODING);
	registerKeyFn(exports.ENCODING, function (specQ) {
	    return shorthand_1$1.spec(specQ, exports.PARSED_GROUP_BY_ENCODING.include, exports.PARSED_GROUP_BY_ENCODING.replacer);
	});
	registerKeyFn(exports.SPEC, function (specQ) { return JSON.stringify(specQ); });

	});

	var nest = unwrapExports(nest_1);
	var nest_2 = nest_1.registerKeyFn;
	var nest_3 = nest_1.FIELD;
	var nest_4 = nest_1.FIELD_TRANSFORM;
	var nest_5 = nest_1.ENCODING;
	var nest_6 = nest_1.SPEC;
	var nest_7 = nest_1.nest;
	var nest_8 = nest_1.getGroupByKey;
	var nest_9 = nest_1.PARSED_GROUP_BY_FIELD_TRANSFORM;
	var nest_10 = nest_1.PARSED_GROUP_BY_ENCODING;

	var nest$1 = /*#__PURE__*/Object.freeze({
		default: nest,
		__moduleExports: nest_1,
		registerKeyFn: nest_2,
		FIELD: nest_3,
		FIELD_TRANSFORM: nest_4,
		ENCODING: nest_5,
		SPEC: nest_6,
		nest: nest_7,
		getGroupByKey: nest_8,
		PARSED_GROUP_BY_FIELD_TRANSFORM: nest_9,
		PARSED_GROUP_BY_ENCODING: nest_10
	});

	var wildcardindex_1$1 = ( wildcardindex$2 && wildcardindex$1 ) || wildcardindex$2;

	var nest_1$1 = ( nest$1 && nest ) || nest$1;

	var model = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });











	/**
	 * Internal class for specQuery that provides helper for the enumeration process.
	 */
	var SpecQueryModel = /** @class */ (function () {
	    function SpecQueryModel(spec, wildcardIndex, schema, opt, wildcardAssignment) {
	        this._rankingScore = {};
	        this._spec = spec;
	        this._channelFieldCount = spec.encodings.reduce(function (m, encQ) {
	            if (!wildcard_1$1.isWildcard(encQ.channel) && (!encoding_1$2.isAutoCountQuery(encQ) || encQ.autoCount !== false)) {
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
	    SpecQueryModel.build = function (specQ, schema, opt) {
	        var wildcardIndex = new wildcardindex_1$1.WildcardIndex();
	        // mark
	        if (wildcard_1$1.isWildcard(specQ.mark)) {
	            var name_1 = wildcard_1$1.getDefaultName(property_1$1.Property.MARK);
	            specQ.mark = wildcard_1$1.initWildcard(specQ.mark, name_1, opt.enum.mark);
	            wildcardIndex.setMark(specQ.mark);
	        }
	        // TODO: transform
	        // encodings
	        specQ.encodings.forEach(function (encQ, index) {
	            if (encoding_1$2.isAutoCountQuery(encQ)) {
	                // This is only for testing purpose
	                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
	                encQ.type = type_1$1.Type.QUANTITATIVE; // autoCount is always quantitative
	            }
	            if (encoding_1$2.isFieldQuery(encQ) && encQ.type === undefined) {
	                // type is optional -- we automatically augment wildcard if not specified
	                encQ.type = wildcard_1$1.SHORT_WILDCARD;
	            }
	            // For each property of the encodingQuery, enumerate
	            property_1$1.ENCODING_TOPLEVEL_PROPS.forEach(function (prop) {
	                if (wildcard_1$1.isWildcard(encQ[prop])) {
	                    // Assign default wildcard name and enum values.
	                    var defaultWildcardName = wildcard_1$1.getDefaultName(prop) + index;
	                    var defaultEnumValues = wildcard_1$1.getDefaultEnumValues(prop, schema, opt);
	                    var wildcard = encQ[prop] = wildcard_1$1.initWildcard(encQ[prop], defaultWildcardName, defaultEnumValues);
	                    // Add index of the encoding mapping to the property's wildcard index.
	                    wildcardIndex.setEncodingProperty(index, prop, wildcard);
	                }
	            });
	            // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
	            property_1$1.ENCODING_NESTED_PROPS.forEach(function (prop) {
	                var propObj = encQ[prop.parent]; // the property object e.g., encQ.bin
	                if (propObj) {
	                    var child = prop.child;
	                    if (wildcard_1$1.isWildcard(propObj[child])) {
	                        // Assign default wildcard name and enum values.
	                        var defaultWildcardName = wildcard_1$1.getDefaultName(prop) + index;
	                        var defaultEnumValues = wildcard_1$1.getDefaultEnumValues(prop, schema, opt);
	                        var wildcard = propObj[child] = wildcard_1$1.initWildcard(propObj[child], defaultWildcardName, defaultEnumValues);
	                        // Add index of the encoding mapping to the property's wildcard index.
	                        wildcardIndex.setEncodingProperty(index, prop, wildcard);
	                    }
	                }
	            });
	        });
	        // AUTO COUNT
	        // Add Auto Count Field
	        if (opt.autoAddCount) {
	            var channel = {
	                name: wildcard_1$1.getDefaultName(property_1$1.Property.CHANNEL) + specQ.encodings.length,
	                enum: wildcard_1$1.getDefaultEnumValues(property_1$1.Property.CHANNEL, schema, opt)
	            };
	            var autoCount = {
	                name: wildcard_1$1.getDefaultName(property_1$1.Property.AUTOCOUNT) + specQ.encodings.length,
	                enum: [false, true]
	            };
	            var countEncQ = {
	                channel: channel,
	                autoCount: autoCount,
	                type: type_1$1.Type.QUANTITATIVE
	            };
	            specQ.encodings.push(countEncQ);
	            var index = specQ.encodings.length - 1;
	            // Add index of the encoding mapping to the property's wildcard index.
	            wildcardIndex.setEncodingProperty(index, property_1$1.Property.CHANNEL, channel);
	            wildcardIndex.setEncodingProperty(index, property_1$1.Property.AUTOCOUNT, autoCount);
	        }
	        return new SpecQueryModel(specQ, wildcardIndex, schema, opt, {});
	    };
	    Object.defineProperty(SpecQueryModel.prototype, "wildcardIndex", {
	        get: function () {
	            return this._wildcardIndex;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SpecQueryModel.prototype, "schema", {
	        get: function () {
	            return this._schema;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SpecQueryModel.prototype, "specQuery", {
	        get: function () {
	            return this._spec;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SpecQueryModel.prototype.duplicate = function () {
	        return new SpecQueryModel(util_1$2.duplicate(this._spec), this._wildcardIndex, this._schema, this._opt, util_1$2.duplicate(this._assignedWildcardIndex));
	    };
	    SpecQueryModel.prototype.setMark = function (mark) {
	        var name = this._wildcardIndex.mark.name;
	        this._assignedWildcardIndex[name] = this._spec.mark = mark;
	    };
	    SpecQueryModel.prototype.resetMark = function () {
	        var wildcard = this._spec.mark = this._wildcardIndex.mark;
	        delete this._assignedWildcardIndex[wildcard.name];
	    };
	    SpecQueryModel.prototype.getMark = function () {
	        return this._spec.mark;
	    };
	    SpecQueryModel.prototype.getEncodingProperty = function (index, prop) {
	        var encQ = this._spec.encodings[index];
	        if (property_1$1.isEncodingNestedProp(prop)) {
	            return encQ[prop.parent][prop.child];
	        }
	        return encQ[prop]; // encoding property (non-nested)
	    };
	    SpecQueryModel.prototype.setEncodingProperty = function (index, prop, value, wildcard) {
	        var encQ = this._spec.encodings[index];
	        if (prop === property_1$1.Property.CHANNEL && encQ.channel && !wildcard_1$1.isWildcard(encQ.channel)) {
	            // If there is an old channel
	            this._channelFieldCount[encQ.channel]--;
	        }
	        if (property_1$1.isEncodingNestedProp(prop)) {
	            encQ[prop.parent][prop.child] = value;
	        }
	        else if (property_1$1.isEncodingNestedParent(prop) && value === true) {
	            encQ[prop] = util_1$2.extend({}, encQ[prop], // copy all existing properties
	            { enum: undefined, name: undefined } // except name and values to it no longer an wildcard
	            );
	        }
	        else {
	            encQ[prop] = value;
	        }
	        this._assignedWildcardIndex[wildcard.name] = value;
	        if (prop === property_1$1.Property.CHANNEL) {
	            // If there is a new channel, make sure it exists and add it to the count.
	            this._channelFieldCount[value] = (this._channelFieldCount[value] || 0) + 1;
	        }
	    };
	    SpecQueryModel.prototype.resetEncodingProperty = function (index, prop, wildcard) {
	        var encQ = this._spec.encodings[index];
	        if (prop === property_1$1.Property.CHANNEL) {
	            this._channelFieldCount[encQ.channel]--;
	        }
	        // reset it to wildcard
	        if (property_1$1.isEncodingNestedProp(prop)) {
	            encQ[prop.parent][prop.child] = wildcard;
	        }
	        else {
	            encQ[prop] = wildcard;
	        }
	        // add remove value that is reset from the assignment map
	        delete this._assignedWildcardIndex[wildcard.name];
	    };
	    SpecQueryModel.prototype.channelUsed = function (channel) {
	        // do not include encoding that has autoCount = false because it is not a part of the output spec.
	        return this._channelFieldCount[channel] > 0;
	    };
	    SpecQueryModel.prototype.channelEncodingField = function (channel) {
	        var encodingQuery = this.getEncodingQueryByChannel(channel);
	        return encoding_1$2.isFieldQuery(encodingQuery);
	    };
	    SpecQueryModel.prototype.getEncodings = function () {
	        // do not include encoding that has autoCount = false because it is not a part of the output spec.
	        return this._spec.encodings.filter(function (encQ) { return !encoding_1$2.isDisabledAutoCountQuery(encQ); });
	    };
	    SpecQueryModel.prototype.getEncodingQueryByChannel = function (channel) {
	        for (var _i = 0, _a = this._spec.encodings; _i < _a.length; _i++) {
	            var specEncoding = _a[_i];
	            if (specEncoding.channel === channel) {
	                return specEncoding;
	            }
	        }
	        return undefined;
	    };
	    SpecQueryModel.prototype.getEncodingQueryByIndex = function (i) {
	        return this._spec.encodings[i];
	    };
	    SpecQueryModel.prototype.isAggregate = function () {
	        return spec$3.isAggregate(this._spec);
	    };
	    /**
	     * @return The Vega-Lite `StackProperties` object that describes the stack
	     * configuration of `this`. Returns `null` if this is not stackable.
	     */
	    SpecQueryModel.prototype.getVlStack = function () {
	        return spec$3.getVlStack(this._spec);
	    };
	    /**
	     * @return The `StackOffset` specified in `this`, `undefined` if none
	     * is specified.
	     */
	    SpecQueryModel.prototype.getStackOffset = function () {
	        return spec$3.getStackOffset(this._spec);
	    };
	    /**
	     * @return The `Channel` in which `stack` is specified in `this`, or
	     * `null` if none is specified.
	     */
	    SpecQueryModel.prototype.getStackChannel = function () {
	        return spec$3.getStackChannel(this._spec);
	    };
	    SpecQueryModel.prototype.toShorthand = function (groupBy$$1) {
	        if (groupBy$$1) {
	            if (util$6.isString(groupBy$$1)) {
	                return nest_1$1.getGroupByKey(this.specQuery, groupBy$$1);
	            }
	            var parsedGroupBy = groupBy.parseGroupBy(groupBy$$1);
	            return shorthand_1$1.spec(this._spec, parsedGroupBy.include, parsedGroupBy.replacer);
	        }
	        return shorthand_1$1.spec(this._spec);
	    };
	    /**
	     * Convert a query to a Vega-Lite spec if it is completed.
	     * @return a Vega-Lite spec if completed, null otherwise.
	     */
	    SpecQueryModel.prototype.toSpec = function (data) {
	        if (wildcard_1$1.isWildcard(this._spec.mark))
	            return null;
	        var spec = {};
	        data = data || this._spec.data;
	        if (data) {
	            spec.data = data;
	        }
	        if (this._spec.transform) {
	            spec.transform = this._spec.transform;
	        }
	        spec.mark = this._spec.mark;
	        spec.encoding = encoding_1$2.toEncoding(this.specQuery.encodings, { schema: this._schema, wildcardMode: 'null' });
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
	            spec.config = util_1$2.extend({}, this._opt.defaultSpecConfig, this._spec.config);
	        return spec;
	    };
	    SpecQueryModel.prototype.getRankingScore = function (rankingName) {
	        return this._rankingScore[rankingName];
	    };
	    SpecQueryModel.prototype.setRankingScore = function (rankingName, score) {
	        this._rankingScore[rankingName] = score;
	    };
	    return SpecQueryModel;
	}());
	exports.SpecQueryModel = SpecQueryModel;

	});

	var model$1 = unwrapExports(model);
	var model_1 = model.SpecQueryModel;

	var model$2 = /*#__PURE__*/Object.freeze({
		default: model$1,
		__moduleExports: model,
		SpecQueryModel: model_1
	});

	var transform = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	});

	var transform$1 = unwrapExports(transform);

	var transform$2 = /*#__PURE__*/Object.freeze({
		default: transform$1,
		__moduleExports: transform
	});

	var normalize_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Normalize the non-nested version of the query
	 * (basically when you have a `groupBy`)
	 * to a standardize nested.
	 */
	function normalize(q) {
	    if (q.groupBy) {
	        var nest = {
	            groupBy: q.groupBy
	        };
	        if (q.orderBy) {
	            nest.orderGroupBy = q.orderBy;
	        }
	        var normalizedQ = {
	            spec: util_1$2.duplicate(q.spec),
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
	    return util_1$2.duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
	}
	exports.normalize = normalize;

	});

	var normalize = unwrapExports(normalize_1);
	var normalize_2 = normalize_1.normalize;

	var normalize$1 = /*#__PURE__*/Object.freeze({
		default: normalize,
		__moduleExports: normalize_1,
		normalize: normalize_2
	});

	var transform$3 = ( transform$2 && transform$1 ) || transform$2;

	var normalize_1$1 = ( normalize$1 && normalize ) || normalize$1;

	var query = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.encoding = encoding_1$2;

	exports.groupBy = groupBy;

	exports.shorthand = shorthand_1$1;

	exports.spec = spec$3;

	exports.transform = transform$3;

	exports.normalize = normalize_1$1.normalize;

	});

	var index$2 = unwrapExports(query);
	var query_1 = query.encoding;
	var query_2 = query.groupBy;
	var query_3 = query.shorthand;
	var query_4 = query.spec;
	var query_5 = query.transform;
	var query_6 = query.normalize;

	var query$1 = /*#__PURE__*/Object.freeze({
		default: index$2,
		__moduleExports: query,
		encoding: query_1,
		groupBy: query_2,
		shorthand: query_3,
		spec: query_4,
		transform: query_5,
		normalize: query_6
	});

	var result = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	function isResultTree(item) {
	    return item.items !== undefined;
	}
	exports.isResultTree = isResultTree;
	function getTopResultTreeItem(specQuery) {
	    var topItem = specQuery.items[0];
	    while (topItem && isResultTree(topItem)) {
	        topItem = topItem.items[0];
	    }
	    return topItem;
	}
	exports.getTopResultTreeItem = getTopResultTreeItem;
	function mapLeaves(group, f) {
	    return __assign({}, group, { items: group.items.map(function (item) { return (isResultTree(item) ? mapLeaves(item, f) : f(item)); }) });
	}
	exports.mapLeaves = mapLeaves;

	});

	var result$1 = unwrapExports(result);
	var result_1 = result.isResultTree;
	var result_2 = result.getTopResultTreeItem;
	var result_3 = result.mapLeaves;

	var result$2 = /*#__PURE__*/Object.freeze({
		default: result$1,
		__moduleExports: result,
		isResultTree: result_1,
		getTopResultTreeItem: result_2,
		mapLeaves: result_3
	});

	var type$9 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });




	/**
	 * Finer grained data types that takes binning and timeUnit into account.
	 */
	var ExtendedType;
	(function (ExtendedType) {
	    ExtendedType[ExtendedType["Q"] = type_1$1.Type.QUANTITATIVE] = "Q";
	    ExtendedType[ExtendedType["BIN_Q"] = 'bin_' + type_1$1.Type.QUANTITATIVE] = "BIN_Q";
	    ExtendedType[ExtendedType["T"] = type_1$1.Type.TEMPORAL] = "T";
	    /**
	     * Time Unit Temporal Field with time scale.
	     */
	    ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
	    /**
	     * Time Unit Temporal Field with ordinal scale.
	     */
	    ExtendedType[ExtendedType["TIMEUNIT_O"] = 'timeUnit_' + type_1$1.Type.ORDINAL] = "TIMEUNIT_O";
	    ExtendedType[ExtendedType["O"] = type_1$1.Type.ORDINAL] = "O";
	    ExtendedType[ExtendedType["N"] = type_1$1.Type.NOMINAL] = "N";
	    ExtendedType[ExtendedType["K"] = expandedtype_1$1.ExpandedType.KEY] = "K";
	    ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
	})(ExtendedType = exports.ExtendedType || (exports.ExtendedType = {}));
	exports.Q = ExtendedType.Q;
	exports.BIN_Q = ExtendedType.BIN_Q;
	exports.T = ExtendedType.T;
	exports.TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
	exports.TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
	exports.O = ExtendedType.O;
	exports.N = ExtendedType.N;
	exports.K = ExtendedType.K;
	exports.NONE = ExtendedType.NONE;
	function getExtendedType(fieldQ) {
	    if (fieldQ.bin) {
	        return ExtendedType.BIN_Q;
	    }
	    else if (fieldQ.timeUnit) {
	        var sType = encoding_1$2.scaleType(fieldQ);
	        return scale_1$1.hasDiscreteDomain(sType) ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
	    }
	    return fieldQ.type;
	}
	exports.getExtendedType = getExtendedType;

	});

	var type$10 = unwrapExports(type$9);
	var type_2$4 = type$9.ExtendedType;
	var type_3$2 = type$9.Q;
	var type_4$1 = type$9.BIN_Q;
	var type_5$1 = type$9.T;
	var type_6$1 = type$9.TIMEUNIT_T;
	var type_7$1 = type$9.TIMEUNIT_O;
	var type_8$1 = type$9.O;
	var type_9 = type$9.N;
	var type_10 = type$9.K;
	var type_11 = type$9.NONE;
	var type_12 = type$9.getExtendedType;

	var type$11 = /*#__PURE__*/Object.freeze({
		default: type$10,
		__moduleExports: type$9,
		ExtendedType: type_2$4,
		Q: type_3$2,
		BIN_Q: type_4$1,
		T: type_5$1,
		TIMEUNIT_T: type_6$1,
		TIMEUNIT_O: type_7$1,
		O: type_8$1,
		N: type_9,
		K: type_10,
		NONE: type_11,
		getExtendedType: type_12
	});

	var base$3 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var Scorer = /** @class */ (function () {
	    function Scorer(type) {
	        this.type = type;
	        this.scoreIndex = this.initScore();
	    }
	    Scorer.prototype.getFeatureScore = function (feature) {
	        var type = this.type;
	        var score = this.scoreIndex[feature];
	        if (score !== undefined) {
	            return { type: type, feature: feature, score: score };
	        }
	        return undefined;
	    };
	    return Scorer;
	}());
	exports.Scorer = Scorer;

	});

	var base$4 = unwrapExports(base$3);
	var base_1$2 = base$3.Scorer;

	var base$5 = /*#__PURE__*/Object.freeze({
		default: base$4,
		__moduleExports: base$3,
		Scorer: base_1$2
	});

	var type_1$3 = ( type$11 && type$10 ) || type$11;

	var base_1$3 = ( base$5 && base$4 ) || base$5;

	var axis$3 = createCommonjsModule(function (module, exports) {
	/**
	 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
	 */
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });





	/**
	 * Effectiveness Score for preferred axis.
	 */
	var AxisScorer = /** @class */ (function (_super) {
	    __extends(AxisScorer, _super);
	    function AxisScorer() {
	        return _super.call(this, 'Axis') || this;
	    }
	    AxisScorer.prototype.initScore = function (opt) {
	        if (opt === void 0) { opt = {}; }
	        opt = __assign({}, config_1$1.DEFAULT_QUERY_CONFIG, opt);
	        var score = {};
	        var preferredAxes = [{
	                feature: type_1$3.BIN_Q,
	                opt: 'preferredBinAxis'
	            }, {
	                feature: type_1$3.T,
	                opt: 'preferredTemporalAxis'
	            }, {
	                feature: type_1$3.TIMEUNIT_T,
	                opt: 'preferredTemporalAxis'
	            }, {
	                feature: type_1$3.TIMEUNIT_O,
	                opt: 'preferredTemporalAxis'
	            }, {
	                feature: type_1$3.O,
	                opt: 'preferredOrdinalAxis'
	            }, {
	                feature: type_1$3.N,
	                opt: 'preferredNominalAxis'
	            }];
	        preferredAxes.forEach(function (pAxis) {
	            if (opt[pAxis.opt] === channel_1$1.Channel.X) {
	                // penalize the other axis
	                score[pAxis.feature + '_' + channel_1$1.Channel.Y] = -0.01;
	            }
	            else if (opt[pAxis.opt] === channel_1$1.Channel.Y) {
	                // penalize the other axis
	                score[pAxis.feature + '_' + channel_1$1.Channel.X] = -0.01;
	            }
	        });
	        return score;
	    };
	    AxisScorer.prototype.featurize = function (type, channel) {
	        return type + '_' + channel;
	    };
	    AxisScorer.prototype.getScore = function (specM, _, __) {
	        var _this = this;
	        return specM.getEncodings().reduce(function (features, encQ) {
	            if (encoding_1$2.isFieldQuery(encQ) || encoding_1$2.isAutoCountQuery(encQ)) {
	                var type = type_1$3.getExtendedType(encQ);
	                var feature = _this.featurize(type, encQ.channel);
	                var featureScore = _this.getFeatureScore(feature);
	                if (featureScore) {
	                    features.push(featureScore);
	                }
	            }
	            return features;
	        }, []);
	    };
	    return AxisScorer;
	}(base_1$3.Scorer));
	exports.AxisScorer = AxisScorer;

	});

	var axis$4 = unwrapExports(axis$3);
	var axis_1$2 = axis$3.AxisScorer;

	var axis$5 = /*#__PURE__*/Object.freeze({
		default: axis$4,
		__moduleExports: axis$3,
		AxisScorer: axis_1$2
	});

	var dimension = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * Penalize if facet channels are the only dimensions
	 */
	var DimensionScorer = /** @class */ (function (_super) {
	    __extends(DimensionScorer, _super);
	    function DimensionScorer() {
	        return _super.call(this, 'Dimension') || this;
	    }
	    DimensionScorer.prototype.initScore = function () {
	        return {
	            row: -2,
	            column: -2,
	            color: 0,
	            opacity: 0,
	            size: 0,
	            shape: 0
	        };
	    };
	    DimensionScorer.prototype.getScore = function (specM, _, __) {
	        var _this = this;
	        if (specM.isAggregate()) {
	            specM.getEncodings().reduce(function (maxFScore, encQ) {
	                if (encoding_1$2.isAutoCountQuery(encQ) || (encoding_1$2.isFieldQuery(encQ) && !encQ.aggregate)) {
	                    var featureScore = _this.getFeatureScore(encQ.channel + '');
	                    if (featureScore && featureScore.score > maxFScore.score) {
	                        return featureScore;
	                    }
	                }
	                return maxFScore;
	            }, { type: 'Dimension', feature: 'No Dimension', score: -5 });
	        }
	        return [];
	    };
	    return DimensionScorer;
	}(base_1$3.Scorer));
	exports.DimensionScorer = DimensionScorer;

	});

	var dimension$1 = unwrapExports(dimension);
	var dimension_1 = dimension.DimensionScorer;

	var dimension$2 = /*#__PURE__*/Object.freeze({
		default: dimension$1,
		__moduleExports: dimension,
		DimensionScorer: dimension_1
	});

	var facet = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });




	/**
	 * Effective Score for preferred facet
	 */
	var FacetScorer = /** @class */ (function (_super) {
	    __extends(FacetScorer, _super);
	    function FacetScorer() {
	        return _super.call(this, 'Facet') || this;
	    }
	    FacetScorer.prototype.initScore = function (opt) {
	        opt = __assign({}, config_1$1.DEFAULT_QUERY_CONFIG, opt);
	        var score = {};
	        if (opt.preferredFacet === channel_1$1.Channel.ROW) {
	            // penalize the other axis
	            score[channel_1$1.Channel.COLUMN] = -0.01;
	        }
	        else if (opt.preferredFacet === channel_1$1.Channel.COLUMN) {
	            // penalize the other axis
	            score[channel_1$1.Channel.ROW] = -0.01;
	        }
	        return score;
	    };
	    FacetScorer.prototype.getScore = function (specM, _, __) {
	        var _this = this;
	        return specM.getEncodings().reduce(function (features, encQ) {
	            if (encoding_1$2.isFieldQuery(encQ) || encoding_1$2.isAutoCountQuery(encQ)) {
	                var featureScore = _this.getFeatureScore(encQ.channel);
	                if (featureScore) {
	                    features.push(featureScore);
	                }
	            }
	            return features;
	        }, []);
	    };
	    return FacetScorer;
	}(base_1$3.Scorer));
	exports.FacetScorer = FacetScorer;

	});

	var facet$1 = unwrapExports(facet);
	var facet_1 = facet.FacetScorer;

	var facet$2 = /*#__PURE__*/Object.freeze({
		default: facet$1,
		__moduleExports: facet,
		FacetScorer: facet_1
	});

	var sizechannel = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * Effectivenss score that penalize size for bar and tick
	 */
	var SizeChannelScorer = /** @class */ (function (_super) {
	    __extends(SizeChannelScorer, _super);
	    function SizeChannelScorer() {
	        return _super.call(this, 'SizeChannel') || this;
	    }
	    SizeChannelScorer.prototype.initScore = function () {
	        return {
	            bar_size: -2,
	            tick_size: -2
	        };
	    };
	    SizeChannelScorer.prototype.getScore = function (specM, _, __) {
	        var _this = this;
	        var mark = specM.getMark();
	        return specM.getEncodings().reduce(function (featureScores, encQ) {
	            if (encoding_1$2.isFieldQuery(encQ) || encoding_1$2.isAutoCountQuery(encQ)) {
	                var feature = mark + '_' + encQ.channel;
	                var featureScore = _this.getFeatureScore(feature);
	                if (featureScore) {
	                    featureScores.push(featureScore);
	                }
	            }
	            return featureScores;
	        }, []);
	    };
	    return SizeChannelScorer;
	}(base_1$3.Scorer));
	exports.SizeChannelScorer = SizeChannelScorer;

	});

	var sizechannel$1 = unwrapExports(sizechannel);
	var sizechannel_1 = sizechannel.SizeChannelScorer;

	var sizechannel$2 = /*#__PURE__*/Object.freeze({
		default: sizechannel$1,
		__moduleExports: sizechannel,
		SizeChannelScorer: sizechannel_1
	});

	var typechannel = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });





	exports.TERRIBLE = -10;
	/**
	 * Effectiveness score for relationship between
	 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
	 */
	var TypeChannelScorer = /** @class */ (function (_super) {
	    __extends(TypeChannelScorer, _super);
	    function TypeChannelScorer() {
	        return _super.call(this, 'TypeChannel') || this;
	    }
	    TypeChannelScorer.prototype.initScore = function () {
	        var _this = this;
	        var SCORE = {};
	        // Continuous Quantitative / Temporal Fields
	        var CONTINUOUS_TYPE_CHANNEL_SCORE = {
	            x: 0,
	            y: 0,
	            size: -0.575,
	            color: -0.725,
	            text: -2,
	            opacity: -3,
	            shape: exports.TERRIBLE,
	            row: exports.TERRIBLE,
	            column: exports.TERRIBLE,
	            detail: 2 * exports.TERRIBLE
	        };
	        [type_1$3.Q, type_1$3.T, type_1$3.TIMEUNIT_T].forEach(function (type) {
	            util_1$2.keys(CONTINUOUS_TYPE_CHANNEL_SCORE).forEach(function (channel) {
	                SCORE[_this.featurize(type, channel)] = CONTINUOUS_TYPE_CHANNEL_SCORE[channel];
	            });
	        });
	        // Discretized Quantitative / Temporal Fields / Ordinal
	        var ORDERED_TYPE_CHANNEL_SCORE = util_1$2.extend({}, CONTINUOUS_TYPE_CHANNEL_SCORE, {
	            row: -0.75,
	            column: -0.75,
	            shape: -3.1,
	            text: -3.2,
	            detail: -4
	        });
	        [type_1$3.BIN_Q, type_1$3.TIMEUNIT_O, type_1$3.O].forEach(function (type) {
	            util_1$2.keys(ORDERED_TYPE_CHANNEL_SCORE).forEach(function (channel) {
	                SCORE[_this.featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
	            });
	        });
	        var NOMINAL_TYPE_CHANNEL_SCORE = {
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
	        util_1$2.keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach(function (channel) {
	            SCORE[_this.featurize(type_1$3.N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
	            SCORE[_this.featurize(type_1$3.K, channel)] =
	                // Putting key on position or detail isn't terrible
	                util_1$2.contains(['x', 'y', 'detail'], channel) ? -1 :
	                    NOMINAL_TYPE_CHANNEL_SCORE[channel] - 2;
	        });
	        return SCORE;
	    };
	    TypeChannelScorer.prototype.featurize = function (type, channel) {
	        return type + '_' + channel;
	    };
	    TypeChannelScorer.prototype.getScore = function (specM, schema, opt) {
	        var _this = this;
	        var encodingQueryByField = specM.getEncodings().reduce(function (m, encQ) {
	            if (encoding_1$2.isFieldQuery(encQ) || encoding_1$2.isAutoCountQuery(encQ)) {
	                var fieldKey = shorthand_1$1.fieldDef(encQ);
	                (m[fieldKey] = m[fieldKey] || []).push(encQ);
	            }
	            return m;
	        }, {});
	        var features = [];
	        util_1$2.forEach(encodingQueryByField, function (encQs) {
	            var bestFieldFeature = encQs.reduce(function (best, encQ) {
	                if (encoding_1$2.isFieldQuery(encQ) || encoding_1$2.isAutoCountQuery(encQ)) {
	                    var type = type_1$3.getExtendedType(encQ);
	                    var feature = _this.featurize(type, encQ.channel);
	                    var featureScore = _this.getFeatureScore(feature);
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
	    };
	    return TypeChannelScorer;
	}(base_1$3.Scorer));
	exports.TypeChannelScorer = TypeChannelScorer;

	});

	var typechannel$1 = unwrapExports(typechannel);
	var typechannel_1 = typechannel.TERRIBLE;
	var typechannel_2 = typechannel.TypeChannelScorer;

	var typechannel$2 = /*#__PURE__*/Object.freeze({
		default: typechannel$1,
		__moduleExports: typechannel,
		TERRIBLE: typechannel_1,
		TypeChannelScorer: typechannel_2
	});

	var mark$3 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });





	var MarkScorer = /** @class */ (function (_super) {
	    __extends(MarkScorer, _super);
	    function MarkScorer() {
	        return _super.call(this, 'Mark') || this;
	    }
	    MarkScorer.prototype.initScore = function () {
	        return init();
	    };
	    MarkScorer.prototype.getScore = function (specM, _, __) {
	        var mark = specM.getMark();
	        if (mark === mark_1$1.Mark.CIRCLE || mark === mark_1$1.Mark.SQUARE) {
	            mark = mark_1$1.Mark.POINT;
	        }
	        var xEncQ = specM.getEncodingQueryByChannel(channel_1$1.Channel.X);
	        var xType = xEncQ ? type_1$3.getExtendedType(xEncQ) : type_1$3.NONE;
	        var yEncQ = specM.getEncodingQueryByChannel(channel_1$1.Channel.Y);
	        var yType = yEncQ ? type_1$3.getExtendedType(yEncQ) : type_1$3.NONE;
	        var isOccluded = !specM.isAggregate(); // FIXME
	        var feature = xType + '_' + yType + '_' + isOccluded + '_' + mark;
	        var featureScore = this.getFeatureScore(feature);
	        return [featureScore];
	    };
	    return MarkScorer;
	}(base_1$3.Scorer));
	exports.MarkScorer = MarkScorer;
	function featurize(xType, yType, hasOcclusion, mark) {
	    return xType + '_' + yType + '_' + hasOcclusion + '_' + mark;
	}
	exports.featurize = featurize;
	function init() {
	    var MEASURES = [type_1$3.Q, type_1$3.T];
	    var DISCRETE = [type_1$3.BIN_Q, type_1$3.TIMEUNIT_O, type_1$3.O, type_1$3.N, type_1$3.K];
	    var DISCRETE_OR_NONE = DISCRETE.concat([type_1$3.NONE]);
	    var SCORE = {};
	    // QxQ
	    MEASURES.forEach(function (xType) {
	        MEASURES.forEach(function (yType) {
	            // has occlusion
	            var occludedQQMark = {
	                point: 0,
	                text: -0.2,
	                tick: -0.5,
	                rect: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util_1$2.forEach(occludedQQMark, function (score, mark) {
	                var feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            // no occlusion
	            // TODO: possible to use connected scatter plot
	            var noOccludedQQMark = {
	                point: 0,
	                text: -0.2,
	                tick: -0.5,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util_1$2.forEach(noOccludedQQMark, function (score, mark) {
	                var feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	        });
	    });
	    // DxQ, QxD
	    MEASURES.forEach(function (xType) {
	        // HAS OCCLUSION
	        DISCRETE_OR_NONE.forEach(function (yType) {
	            var occludedDimensionMeasureMark = {
	                tick: 0,
	                point: -0.2,
	                text: -0.5,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util_1$2.forEach(occludedDimensionMeasureMark, function (score, mark) {
	                var feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                var feature2 = featurize(yType, xType, true, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        [type_1$3.TIMEUNIT_T].forEach(function (yType) {
	            var occludedDimensionMeasureMark = {
	                // For Time Dimension with time scale, tick is not good
	                point: 0,
	                text: -0.5,
	                tick: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util_1$2.forEach(occludedDimensionMeasureMark, function (score, mark) {
	                var feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                var feature2 = featurize(yType, xType, true, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        // NO OCCLUSION
	        [type_1$3.NONE, type_1$3.N, type_1$3.O, type_1$3.K].forEach(function (yType) {
	            var noOccludedQxN = {
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
	            util_1$2.forEach(noOccludedQxN, function (score, mark) {
	                var feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                var feature2 = featurize(yType, xType, false, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        [type_1$3.BIN_Q].forEach(function (yType) {
	            var noOccludedQxBinQ = {
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
	            util_1$2.forEach(noOccludedQxBinQ, function (score, mark) {
	                var feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                var feature2 = featurize(yType, xType, false, mark);
	                SCORE[feature2] = score;
	            });
	        });
	        [type_1$3.TIMEUNIT_T, type_1$3.TIMEUNIT_O].forEach(function (yType) {
	            // For aggregate / surely no occlusion plot, Temporal with time or ordinal
	            // are not that different.
	            var noOccludedQxBinQ = {
	                line: 0,
	                area: -0.1,
	                bar: -0.2,
	                point: -0.3,
	                tick: -0.35,
	                text: -0.4,
	                // Non-sense to use rule here
	                rule: -2.5
	            };
	            util_1$2.forEach(noOccludedQxBinQ, function (score, mark) {
	                var feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	                // also do the inverse
	                var feature2 = featurize(yType, xType, false, mark);
	                SCORE[feature2] = score;
	            });
	        });
	    });
	    [type_1$3.TIMEUNIT_T].forEach(function (xType) {
	        [type_1$3.TIMEUNIT_T].forEach(function (yType) {
	            // has occlusion
	            var ttMark = {
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
	            util_1$2.forEach(ttMark, function (score, mark) {
	                var feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            util_1$2.forEach(ttMark, function (score, mark) {
	                var feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	        });
	        DISCRETE_OR_NONE.forEach(function (yType) {
	            // has occlusion
	            var tdMark = {
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
	            util_1$2.forEach(tdMark, function (score, mark) {
	                var feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            util_1$2.forEach(tdMark, function (score, mark) {
	                var feature = featurize(yType, xType, true, mark);
	                SCORE[feature] = score;
	            });
	            util_1$2.forEach(tdMark, function (score, mark) {
	                var feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	            util_1$2.forEach(tdMark, function (score, mark) {
	                var feature = featurize(yType, xType, false, mark);
	                SCORE[feature] = score;
	            });
	        });
	    });
	    // DxD
	    DISCRETE_OR_NONE.forEach(function (xType) {
	        DISCRETE_OR_NONE.forEach(function (yType) {
	            // has occlusion
	            var ddMark = {
	                point: 0,
	                rect: 0,
	                text: -0.1,
	                tick: -1,
	                bar: -2,
	                line: -2,
	                area: -2,
	                rule: -2.5
	            };
	            util_1$2.forEach(ddMark, function (score, mark) {
	                var feature = featurize(xType, yType, true, mark);
	                SCORE[feature] = score;
	            });
	            // same for no occlusion.
	            util_1$2.forEach(ddMark, function (score, mark) {
	                var feature = featurize(xType, yType, false, mark);
	                SCORE[feature] = score;
	            });
	        });
	    });
	    return SCORE;
	}

	});

	var mark$4 = unwrapExports(mark$3);
	var mark_2$1 = mark$3.MarkScorer;
	var mark_3$1 = mark$3.featurize;

	var mark$5 = /*#__PURE__*/Object.freeze({
		default: mark$4,
		__moduleExports: mark$3,
		MarkScorer: mark_2$1,
		featurize: mark_3$1
	});

	var axis_1$3 = ( axis$5 && axis$4 ) || axis$5;

	var dimension_1$1 = ( dimension$2 && dimension$1 ) || dimension$2;

	var facet_1$1 = ( facet$2 && facet$1 ) || facet$2;

	var sizechannel_1$1 = ( sizechannel$2 && sizechannel$1 ) || sizechannel$2;

	var typechannel_1$1 = ( typechannel$2 && typechannel$1 ) || typechannel$2;

	var mark_1$2 = ( mark$5 && mark$4 ) || mark$5;

	var effectiveness_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });






	var SCORERS = [
	    new axis_1$3.AxisScorer(),
	    new dimension_1$1.DimensionScorer(),
	    new facet_1$1.FacetScorer(),
	    new mark_1$2.MarkScorer(),
	    new sizechannel_1$1.SizeChannelScorer(),
	    new typechannel_1$1.TypeChannelScorer()
	];
	// TODO: x/y, row/column preference
	// TODO: stacking
	// TODO: Channel, Cardinality
	// TODO: Penalize over encoding
	function effectiveness(specM, schema, opt) {
	    var features = SCORERS.reduce(function (f, scorer) {
	        var scores = scorer.getScore(specM, schema, opt);
	        return f.concat(scores);
	    }, []);
	    return {
	        score: features.reduce(function (s, f) {
	            return s + f.score;
	        }, 0),
	        features: features
	    };
	}
	exports.effectiveness = effectiveness;

	});

	var index$3 = unwrapExports(effectiveness_1);
	var effectiveness_2 = effectiveness_1.effectiveness;

	var effectiveness = /*#__PURE__*/Object.freeze({
		default: index$3,
		__moduleExports: effectiveness_1,
		effectiveness: effectiveness_2
	});

	var aggregation = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	exports.name = 'aggregationQuality';
	function score(specM, schema, opt) {
	    var feature = aggregationQualityFeature(specM, schema, opt);
	    return {
	        score: feature.score,
	        features: [feature]
	    };
	}
	exports.score = score;
	function aggregationQualityFeature(specM, _, __) {
	    var encodings = specM.getEncodings();
	    if (specM.isAggregate()) {
	        var isRawContinuous = function (encQ) {
	            return encoding_1$2.isFieldQuery(encQ) && ((encQ.type === type_1$1.Type.QUANTITATIVE && !encQ.bin && !encQ.aggregate) ||
	                (encQ.type === type_1$1.Type.TEMPORAL && !encQ.timeUnit));
	        };
	        if (util_1$2.some(encodings, isRawContinuous)) {
	            // These are plots that pollute continuous fields as dimension.
	            // They are often intermediate visualizations rather than what users actually want.
	            return {
	                type: exports.name,
	                score: 0.1,
	                feature: 'Aggregate with raw continuous'
	            };
	        }
	        if (util_1$2.some(encodings, function (encQ) { return encoding_1$2.isFieldQuery(encQ) && encoding_1$2.isDimension(encQ); })) {
	            var hasCount = util_1$2.some(encodings, function (encQ) {
	                return (encoding_1$2.isFieldQuery(encQ) && encQ.aggregate === 'count') || encoding_1$2.isEnabledAutoCountQuery(encQ);
	            });
	            var hasBin = util_1$2.some(encodings, function (encQ) {
	                return encoding_1$2.isFieldQuery(encQ) && !!encQ.bin;
	            });
	            if (hasCount) {
	                // If there is count, we might add additional count field, making it a little less simple
	                // then when we just apply aggregate to Q field
	                return {
	                    type: exports.name,
	                    score: 0.8,
	                    feature: 'Aggregate with count'
	                };
	            }
	            else if (hasBin) {
	                // This is not as good as binning all the Q and show heatmap
	                return {
	                    type: exports.name,
	                    score: 0.7,
	                    feature: 'Aggregate with bin but without count'
	                };
	            }
	            else {
	                return {
	                    type: exports.name,
	                    score: 0.9,
	                    feature: 'Aggregate without count and without bin'
	                };
	            }
	        }
	        // no dimension -- often not very useful
	        return {
	            type: exports.name,
	            score: 0.3,
	            feature: 'Aggregate without dimension'
	        };
	    }
	    else {
	        if (util_1$2.some(encodings, function (encQ) { return encoding_1$2.isFieldQuery(encQ) && !encoding_1$2.isDimension(encQ); })) {
	            // raw plots with measure -- simplest of all!
	            return {
	                type: exports.name,
	                score: 1,
	                feature: 'Raw with measure'
	            };
	        }
	        // raw plots with no measure -- often a lot of occlusion
	        return {
	            type: exports.name,
	            score: 0.2,
	            feature: 'Raw without measure'
	        };
	    }
	}

	});

	var aggregation$1 = unwrapExports(aggregation);
	var aggregation_1 = aggregation.name;
	var aggregation_2 = aggregation.score;

	var aggregation$2 = /*#__PURE__*/Object.freeze({
		default: aggregation$1,
		__moduleExports: aggregation,
		name: aggregation_1,
		score: aggregation_2
	});

	var fieldorder = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.name = 'fieldOrder';
	/**
	 * Return ranking score based on indices of encoded fields in the schema.
	 * If there are multiple fields, prioritize field on the lower indices of encodings.
	 *
	 * For example, to compare two specs with two encodings each,
	 * first we compare the field on the 0-th index
	 * and only compare the field on the 1-th index only if the fields on the 0-th index are the same.
	 */
	function score(specM, schema, _) {
	    var fieldWildcardIndices = specM.wildcardIndex.encodingIndicesByProperty.get('field');
	    if (!fieldWildcardIndices) {
	        return {
	            score: 0,
	            features: []
	        };
	    }
	    var encodings = specM.specQuery.encodings;
	    var numFields = schema.fieldSchemas.length;
	    var features = [];
	    var totalScore = 0, base = 1;
	    for (var i = fieldWildcardIndices.length - 1; i >= 0; i--) {
	        var index = fieldWildcardIndices[i];
	        var encoding = encodings[index];
	        // Skip ValueQuery as we only care about order of fields.
	        var field = void 0;
	        if (encoding_1$2.isFieldQuery(encoding)) {
	            field = encoding.field;
	        }
	        else {
	            continue;
	        }
	        var fieldWildcard = specM.wildcardIndex.encodings[index].get('field');
	        var fieldIndex = schema.fieldSchema(field).index;
	        // reverse order field with lower index should get higher score and come first
	        var score_1 = -fieldIndex * base;
	        totalScore += score_1;
	        features.push({
	            score: score_1,
	            type: 'fieldOrder',
	            feature: "field " + fieldWildcard.name + " is " + field + " (#" + fieldIndex + " in the schema)"
	        });
	        base *= numFields;
	    }
	    return {
	        score: totalScore,
	        features: features
	    };
	}
	exports.score = score;

	});

	var fieldorder$1 = unwrapExports(fieldorder);
	var fieldorder_1 = fieldorder.name;
	var fieldorder_2 = fieldorder.score;

	var fieldorder$2 = /*#__PURE__*/Object.freeze({
		default: fieldorder$1,
		__moduleExports: fieldorder,
		name: fieldorder_1,
		score: fieldorder_2
	});

	var result_1$1 = ( result$2 && result$1 ) || result$2;

	var effectiveness_1$1 = ( effectiveness && index$3 ) || effectiveness;

	var aggregation$3 = ( aggregation$2 && aggregation$1 ) || aggregation$2;

	var fieldOrder = ( fieldorder$2 && fieldorder$1 ) || fieldorder$2;

	var ranking = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });


	__export(effectiveness_1$1);

	exports.aggregation = aggregation$3;

	exports.fieldOrder = fieldOrder;
	/**
	 * Registry for all encoding ranking functions
	 */
	var rankingRegistry = {};
	/**
	 * Add an ordering function to the registry.
	 */
	function register(name, keyFn) {
	    rankingRegistry[name] = keyFn;
	}
	exports.register = register;
	function get(name) {
	    return rankingRegistry[name];
	}
	exports.get = get;
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
	        group.items.forEach(function (subgroup) {
	            rank(subgroup, query, schema, level + 1);
	        });
	        if (query.nest[level].orderGroupBy) {
	            group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
	        }
	    }
	    return group;
	}
	exports.rank = rank;
	function comparatorFactory(name, schema, opt) {
	    return function (m1, m2) {
	        if (name instanceof Array) {
	            return getScoreDifference(name, m1, m2, schema, opt);
	        }
	        else {
	            return getScoreDifference([name], m1, m2, schema, opt);
	        }
	    };
	}
	exports.comparatorFactory = comparatorFactory;
	function groupComparatorFactory(name, schema, opt) {
	    return function (g1, g2) {
	        var m1 = result_1$1.getTopResultTreeItem(g1);
	        var m2 = result_1$1.getTopResultTreeItem(g2);
	        if (name instanceof Array) {
	            return getScoreDifference(name, m1, m2, schema, opt);
	        }
	        else {
	            return getScoreDifference([name], m1, m2, schema, opt);
	        }
	    };
	}
	exports.groupComparatorFactory = groupComparatorFactory;
	function getScoreDifference(name, m1, m2, schema, opt) {
	    for (var _i = 0, name_1 = name; _i < name_1.length; _i++) {
	        var rankingName = name_1[_i];
	        var scoreDifference = getScore(m2, rankingName, schema, opt).score - getScore(m1, rankingName, schema, opt).score;
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
	    var fn = get(rankingName);
	    var score = fn(model, schema, opt);
	    model.setRankingScore(rankingName, score);
	    return score;
	}
	exports.getScore = getScore;
	exports.EFFECTIVENESS = 'effectiveness';
	register(exports.EFFECTIVENESS, effectiveness_1$1.effectiveness);
	register(aggregation$3.name, aggregation$3.score);
	register(fieldOrder.name, fieldOrder.score);

	});

	var ranking$1 = unwrapExports(ranking);
	var ranking_1 = ranking.aggregation;
	var ranking_2 = ranking.fieldOrder;
	var ranking_3 = ranking.register;
	var ranking_4 = ranking.get;
	var ranking_5 = ranking.rank;
	var ranking_6 = ranking.comparatorFactory;
	var ranking_7 = ranking.groupComparatorFactory;
	var ranking_8 = ranking.getScore;
	var ranking_9 = ranking.EFFECTIVENESS;

	var ranking$2 = /*#__PURE__*/Object.freeze({
		default: ranking$1,
		__moduleExports: ranking,
		aggregation: ranking_1,
		fieldOrder: ranking_2,
		register: ranking_3,
		get: ranking_4,
		rank: ranking_5,
		comparatorFactory: ranking_6,
		groupComparatorFactory: ranking_7,
		getScore: ranking_8,
		EFFECTIVENESS: ranking_9
	});

	var stylize_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });





	function stylize(answerSet, schema, opt) {
	    var encQIndex = {};
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
	exports.stylize = stylize;
	function smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
	    [channel_1$1.Channel.ROW, channel_1$1.Channel.Y, channel_1$1.Channel.COLUMN, channel_1$1.Channel.X].forEach(function (channel) {
	        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
	    });
	    var yEncQ = encQIndex[channel_1$1.Channel.Y];
	    if (yEncQ !== undefined && encoding_1$2.isFieldQuery(yEncQ)) {
	        if (encQIndex[channel_1$1.Channel.ROW] ||
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
	            var yScaleType = encoding_1$2.scaleType(yEncQ);
	            if (yEncQ.scale && (yScaleType === undefined || scale_1$1.hasDiscreteDomain(yScaleType))) {
	                if (!yEncQ.scale.rangeStep) {
	                    yEncQ.scale.rangeStep = 12;
	                }
	            }
	        }
	    }
	    var xEncQ = encQIndex[channel_1$1.Channel.X];
	    if (encoding_1$2.isFieldQuery(xEncQ)) {
	        if (encQIndex[channel_1$1.Channel.COLUMN] ||
	            schema.cardinality(xEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
	            // Just like y, we don't want to do this if scale is null/false
	            if (xEncQ.scale === undefined) {
	                xEncQ.scale = {};
	            }
	            // We do not want to assign a rangeStep if scale is set to false
	            // and we only apply this if the scale is (or can be) an ordinal scale.
	            var xScaleType = encoding_1$2.scaleType(xEncQ);
	            if (xEncQ.scale && (xScaleType === undefined || scale_1$1.hasDiscreteDomain(xScaleType))) {
	                if (!xEncQ.scale.rangeStep) {
	                    xEncQ.scale.rangeStep = 12;
	                }
	            }
	        }
	    }
	    return specM;
	}
	exports.smallRangeStepForHighCardinalityOrFacet = smallRangeStepForHighCardinalityOrFacet;
	function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
	    encQIndex[channel_1$1.Channel.COLOR] = specM.getEncodingQueryByChannel(channel_1$1.Channel.COLOR);
	    var colorEncQ = encQIndex[channel_1$1.Channel.COLOR];
	    if (encoding_1$2.isFieldQuery(colorEncQ) && (colorEncQ !== undefined) && (colorEncQ.type === type_1$1.Type.NOMINAL || colorEncQ.type === expandedtype_1$1.ExpandedType.KEY) &&
	        (schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality)) {
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
	exports.nominalColorScaleForHighCardinality = nominalColorScaleForHighCardinality;
	function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
	    [channel_1$1.Channel.COLUMN, channel_1$1.Channel.X, channel_1$1.Channel.Y].forEach(function (channel) {
	        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
	    });
	    if (encQIndex[channel_1$1.Channel.COLUMN] === undefined) {
	        var xEncQ = encQIndex[channel_1$1.Channel.X];
	        var yEncQ = encQIndex[channel_1$1.Channel.Y];
	        if (encoding_1$2.isFieldQuery(xEncQ) && encoding_1$2.isFieldQuery(yEncQ) && yEncQ !== undefined && yEncQ.field && scale_1$1.hasDiscreteDomain(encoding_1$2.scaleType(yEncQ))) {
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
	exports.xAxisOnTopForHighYCardinalityWithoutColumn = xAxisOnTopForHighYCardinalityWithoutColumn;

	});

	var stylize = unwrapExports(stylize_1);
	var stylize_2 = stylize_1.stylize;
	var stylize_3 = stylize_1.smallRangeStepForHighCardinalityOrFacet;
	var stylize_4 = stylize_1.nominalColorScaleForHighCardinality;
	var stylize_5 = stylize_1.xAxisOnTopForHighYCardinalityWithoutColumn;

	var stylize$1 = /*#__PURE__*/Object.freeze({
		default: stylize,
		__moduleExports: stylize_1,
		stylize: stylize_2,
		smallRangeStepForHighCardinalityOrFacet: stylize_3,
		nominalColorScaleForHighCardinality: stylize_4,
		xAxisOnTopForHighYCardinalityWithoutColumn: stylize_5
	});

	var enumerator_1$1 = ( enumerator$2 && enumerator$1 ) || enumerator$2;

	var model_1$1 = ( model$2 && model$1 ) || model$2;

	var stylize_1$1 = ( stylize$1 && stylize ) || stylize$1;

	var generate_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });





	function generate(specQ, schema, opt) {
	    if (opt === void 0) { opt = config_1$1.DEFAULT_QUERY_CONFIG; }
	    // 1. Build a SpecQueryModel, which also contains wildcardIndex
	    var specM = model_1$1.SpecQueryModel.build(specQ, schema, opt);
	    var wildcardIndex = specM.wildcardIndex;
	    // 2. Enumerate each of the properties based on propPrecedence.
	    var answerSet = [specM]; // Initialize Answer Set with only the input spec query.
	    opt.propertyPrecedence.forEach(function (propKey) {
	        var prop = property_1$1.fromKey(propKey);
	        // If the original specQuery contains wildcard for this prop
	        if (wildcardIndex.hasProperty(prop)) {
	            // update answerset
	            var enumerator = enumerator_1$1.getEnumerator(prop);
	            var reducer = enumerator(wildcardIndex, schema, opt);
	            answerSet = answerSet.reduce(reducer, []);
	        }
	    });
	    if (opt.stylize) {
	        if ((opt.nominalColorScaleForHighCardinality !== null) ||
	            (opt.smallRangeStepForHighCardinalityOrFacet !== null) ||
	            (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
	            return stylize_1$1.stylize(answerSet, schema, opt);
	        }
	    }
	    return answerSet;
	}
	exports.generate = generate;

	});

	var generate$2 = unwrapExports(generate_1);
	var generate_2 = generate_1.generate;

	var generate$3 = /*#__PURE__*/Object.freeze({
		default: generate$2,
		__moduleExports: generate_1,
		generate: generate_2
	});

	var generate_1$1 = ( generate$3 && generate$2 ) || generate$3;

	var ranking_1$1 = ( ranking$2 && ranking$1 ) || ranking$2;

	var recommend_1 = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });





	function recommend(q, schema, config) {
	    // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
	    //    and merge config with the following precedence
	    //    query.config > config > DEFAULT_QUERY_CONFIG
	    q = __assign({}, normalize_1$1.normalize(q), { config: __assign({}, config_1$1.DEFAULT_QUERY_CONFIG, config, q.config) });
	    // 2. Generate
	    var answerSet = generate_1$1.generate(q.spec, schema, q.config);
	    var nestedAnswerSet = nest_1$1.nest(answerSet, q.nest);
	    var result = ranking_1$1.rank(nestedAnswerSet, q, schema, 0);
	    return {
	        query: q,
	        result: result
	    };
	}
	exports.recommend = recommend;

	});

	var recommend = unwrapExports(recommend_1);
	var recommend_2 = recommend_1.recommend;

	var recommend$1 = /*#__PURE__*/Object.freeze({
		default: recommend,
		__moduleExports: recommend_1,
		recommend: recommend_2
	});

	var name = "compassql";
	var version = "0.20.4";
	var description = "CompassQL visualization query language";
	var main = "build/compassql.js";
	var unpkg = "build/compassql.min.js";
	var jsdelivr = "build/compassql.min.js";
	var module$1 = "build/src/cql.ts";
	var types = "build/src/cql.d.ts";
	var typings = "./build/src/cql";
	var directories = {"test":"test"};
	var scripts = {"prebuild":"mkdir -p build","build":"tsc && cp package.json build/src/ && rollup -c","build:examples":"npm run build && ./scripts/build-examples.sh","build:examples-only":"./scripts/build-examples.sh","postbuild":"uglifyjs build/compassql.js -cm --source-map build/compassql.min.js.map > build/compassql.min.js","clean":"rm -rf build","deploy":"npm run clean && npm run lint && npm run test && scripts/deploy.sh","lint":"tslint -c tslint.json src/**/*.ts test/**/*.ts","schema":"npm run prebuild && typescript-json-schema --required true src/query.ts Query > build/compassql-schema.json","test":"jest --maxWorkers=4 && npm run lint","test:inspect":"node --inspect-brk ./node_modules/.bin/jest --runInBand","check:examples":"./scripts/check-examples.sh","watch:build":"npm run build && concurrently --kill-others -n Typescript,Rollup 'tsc -w' 'rollup -c -w'","watch:test":"jest --watch"};
	var repository = {"type":"git","url":"git+https://github.com/uwdata/CompassQL.git"};
	var keywords = ["visualization","recommendation"];
	var author = {"name":"UW Interactive Data Lab","url":"http://idl.cs.washington.edu"};
	var collaborators = ["Kanit Wongsuphasawat <kanitw@gmail.com> (http://kanitw.yellowpigz.com)","Dominik Moritz <domoritz@cs.washington.edu> (http://domoritz.de)","Jeffrey Heer <jheer@uw.edu> (http://jheer.org)"];
	var license = "BSD-3-Clause";
	var bugs = {"url":"https://github.com/uwdata/compassql/issues"};
	var homepage = "https://github.com/uwdata/compassql#readme";
	var devDependencies = {"@types/chai":"^4.1.3","@types/d3":"^4.13.0","@types/jest":"^22.2.3","chai":"^4.1.2","codecov":"~1.0.1","concurrently":"^3.5.1","d3":"~4","exorcist":"~0.4.0","jest":"^22.4.3","rollup":"^0.58.2","rollup-plugin-commonjs":"^9.1.0","rollup-plugin-json":"^2.3.0","rollup-plugin-node-resolve":"^3.3.0","source-map-support":"~0.4.0","ts-jest":"^22.4.4","tslint":"~4.3.1","typescript":"^2.3.4","uglify-js":"~2.6.1","vega-datasets":"latest"};
	var dependencies = {"datalib":"~1.7.0","typescript-json-schema":"^0.9.0","vega-lite":"2.4.0","vega-typings":"^0.2.15"};
	var jest = {"transform":{"^.+\\.tsx?$":"ts-jest"},"testRegex":"(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$","moduleFileExtensions":["ts","tsx","js","jsx","json","node"],"testPathIgnorePatterns":["node_modules","<rootDir>/build","scripts","src"],"coverageDirectory":"./coverage/","collectCoverage":true};
	var _package = {
		name: name,
		version: version,
		description: description,
		main: main,
		unpkg: unpkg,
		jsdelivr: jsdelivr,
		module: module$1,
		types: types,
		typings: typings,
		directories: directories,
		scripts: scripts,
		repository: repository,
		keywords: keywords,
		author: author,
		collaborators: collaborators,
		license: license,
		bugs: bugs,
		homepage: homepage,
		devDependencies: devDependencies,
		dependencies: dependencies,
		jest: jest
	};

	var _package$1 = /*#__PURE__*/Object.freeze({
		name: name,
		version: version,
		description: description,
		main: main,
		unpkg: unpkg,
		jsdelivr: jsdelivr,
		module: module$1,
		types: types,
		typings: typings,
		directories: directories,
		scripts: scripts,
		repository: repository,
		keywords: keywords,
		author: author,
		collaborators: collaborators,
		license: license,
		bugs: bugs,
		homepage: homepage,
		devDependencies: devDependencies,
		dependencies: dependencies,
		jest: jest,
		default: _package
	});

	var constraint$2 = ( constraint$1 && index$1 ) || constraint$1;

	var query$2 = ( query$1 && index$2 ) || query$1;

	var recommend_1$1 = ( recommend$1 && recommend ) || recommend$1;

	var package_json_1 = ( _package$1 && _package ) || _package$1;

	var src = createCommonjsModule(function (module, exports) {
	/// <reference path="../typings/json.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.config = config_1$1;

	exports.constraint = constraint$2;

	exports.enumerate = enumerator_1$1;

	exports.wildcard = wildcard_1$1;

	exports.model = model_1$1;

	exports.nest = nest_1$1;

	exports.property = property_1$1;

	exports.query = query$2;

	exports.ranking = ranking_1$1;

	exports.result = result_1$1;

	exports.schema = schema_1$1;

	exports.util = util_1$2;

	exports.generate = generate_1$1.generate;

	exports.recommend = recommend_1$1.recommend;

	exports.version = package_json_1.version;

	});

	var index$4 = unwrapExports(src);
	var src_1 = src.config;
	var src_2 = src.constraint;
	var src_3 = src.enumerate;
	var src_4 = src.wildcard;
	var src_5 = src.model;
	var src_6 = src.nest;
	var src_7 = src.property;
	var src_8 = src.query;
	var src_9 = src.ranking;
	var src_10 = src.result;
	var src_11 = src.schema;
	var src_12 = src.util;
	var src_13 = src.generate;
	var src_14 = src.recommend;
	var src_15 = src.version;

	exports.default = index$4;
	exports.config = src_1;
	exports.constraint = src_2;
	exports.enumerate = src_3;
	exports.wildcard = src_4;
	exports.model = src_5;
	exports.nest = src_6;
	exports.property = src_7;
	exports.query = src_8;
	exports.ranking = src_9;
	exports.result = src_10;
	exports.schema = src_11;
	exports.util = src_12;
	exports.generate = src_13;
	exports.recommend = src_14;
	exports.version = src_15;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=compassql.js.map
