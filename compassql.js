(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cql = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-time', ['exports'], factory) :
  factory((global.d3_time = {}));
}(this, function (exports) { 'use strict';

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
  };

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
},{}],3:[function(require,module,exports){
var util = require('../util'),
    time = require('../time'),
    EPSILON = 1e-15;

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
    value: value,
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

function value(v) {
  return this.step * Math.floor(v / this.step + EPSILON);
}

function index(v) {
  return Math.floor((v - this.start) / this.step + EPSILON);
}

function date_value(v) {
  return this.unit.date(value.call(this, v));
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

module.exports = bins;

},{"../time":7,"../util":8}],4:[function(require,module,exports){
var util = require('./util'),
    gen = module.exports;

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
},{"./util":8}],5:[function(require,module,exports){
var util = require('../util');

var TYPES = '__types__';

var PARSERS = {
  boolean: util.boolean,
  integer: util.number,
  number:  util.number,
  date:    util.date,
  string:  function(x) { return x==='' ? null : x; }
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
  fields = fields || util.keys(data[0]);
  return fields.reduce(function(types, f) {
    return (types[f] = type(data, f), types);
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
  fields = fields || util.keys(data[0]);
  return fields.reduce(function(types, f) {
    types[f] = infer(data, f);
    return types;
  }, {});
}

type.annotation = annotation;
type.all = typeAll;
type.infer = infer;
type.inferAll = inferAll;
type.parsers = PARSERS;
module.exports = type;

},{"../util":8}],6:[function(require,module,exports){
var util = require('./util');
var type = require('./import/type');
var gen = require('./generate');

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

  bs = gen.random.bootstrap(X, smooth);
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
    type:     type(values, f),
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

},{"./generate":4,"./import/type":5,"./util":8}],7:[function(require,module,exports){
var d3_time = require('d3-time');

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

module.exports = toUnitMap(locale);
module.exports.utc = toUnitMap(utc);
},{"d3-time":2}],8:[function(require,module,exports){
(function (Buffer){
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
  return function(a,b) {
    var i, n, f, x, y;
    for (i=0, n=sort.length; i<n; ++i) {
      f = sort[i]; x = f(a); y = f(b);
      if (x < y) return -1 * sign[i];
      if (x > y) return sign[i];
    }
    return 0;
  };
};

u.cmp = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else if (a >= b) {
    return 0;
  } else if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  }
  return NaN;
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

}).call(this,require("buffer").Buffer)

},{"buffer":1}],9:[function(require,module,exports){
"use strict";
var channel_1 = require('vega-lite/src/channel');
var aggregate_1 = require('vega-lite/src/aggregate');
var mark_1 = require('vega-lite/src/mark');
var scale_1 = require('vega-lite/src/scale');
var sort_1 = require('vega-lite/src/sort');
var timeunit_1 = require('vega-lite/src/timeunit');
var type_1 = require('vega-lite/src/type');
var property_1 = require('./property');
exports.DEFAULT_QUERY_CONFIG = {
    verbose: false,
    defaultSpecConfig: {
        overlay: { line: true },
        scale: { useRawDomain: true }
    },
    propertyPrecedence: property_1.DEFAULT_PROPERTY_PRECEDENCE,
    marks: [mark_1.Mark.POINT, mark_1.Mark.BAR, mark_1.Mark.LINE, mark_1.Mark.AREA, mark_1.Mark.TICK],
    channels: [channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN, channel_1.SIZE, channel_1.COLOR],
    aggregates: [undefined, aggregate_1.AggregateOp.MEAN],
    timeUnits: [undefined, timeunit_1.TimeUnit.YEAR, timeunit_1.TimeUnit.MONTH, timeunit_1.TimeUnit.DATE, timeunit_1.TimeUnit.MINUTES, timeunit_1.TimeUnit.SECONDS],
    types: [type_1.Type.NOMINAL, type_1.Type.ORDINAL, type_1.Type.QUANTITATIVE, type_1.Type.TEMPORAL],
    maxBinsList: [5, 10, 20],
    axisAxisColors: [undefined],
    axisAxisWidths: [undefined],
    axisLayers: ['front', 'back'],
    axisOffsets: [undefined],
    axisOrients: [undefined],
    axisGridColors: [undefined],
    axisGridDashes: [undefined],
    axisGridOpacities: [undefined],
    axisGridWidths: [undefined],
    axisFormats: [undefined],
    axisLabelAngles: [undefined],
    axisLabelMaxLengths: [undefined],
    axisSubDivides: [undefined],
    axisTicks: [undefined],
    axisTickColors: [undefined],
    axisTickLabelColors: [undefined],
    axisTickLabelFonts: [undefined],
    axisTickLabelFontSizes: [undefined],
    axisTickPaddings: [undefined],
    axisTickSizes: [undefined],
    axisTickSizeMajors: [undefined],
    axisTickSizeMinors: [undefined],
    axisTickSizeEnds: [undefined],
    axisTickWidths: [undefined],
    axisValuesList: [undefined],
    axisTitles: [undefined],
    axisTitleColors: [undefined],
    axisTitleFonts: [undefined],
    axisTitleFontWeights: [undefined],
    axisTitleFontSizes: [undefined],
    axisTitleOffsets: [undefined],
    axisTitleMaxLengths: [undefined],
    axisCharacterWidths: [undefined],
    legendOrients: ['left', 'right'],
    legendOffsets: [undefined],
    legendValuesList: [undefined],
    legendFormats: [undefined],
    legendLabelAligns: [undefined],
    legendLabelBaselines: [undefined],
    legendLabelColors: [undefined],
    legendLabelFonts: [undefined],
    legendLabelFontSizes: [undefined],
    legendSymbolColors: [undefined],
    legendSymbolShapes: [undefined],
    legendSymbolSizes: [undefined],
    legendSymbolStrokeWidths: [undefined],
    legendTitles: [undefined],
    legendTitleColors: [undefined],
    legendTitleFonts: [undefined],
    legendTitleFontSizes: [undefined],
    legendTitleFontWeights: [undefined],
    // TODO: Come back and implement correctly when designing sort enumeration.
    sorts: [sort_1.SortOrder.ASCENDING, sort_1.SortOrder.DESCENDING],
    sortOps: [aggregate_1.AggregateOp.MIN, aggregate_1.AggregateOp.MEAN],
    sortOrders: [sort_1.SortOrder.ASCENDING, sort_1.SortOrder.DESCENDING],
    scaleBandSizes: [17, 21],
    scaleDomains: [undefined],
    scaleExponents: [1],
    scaleRanges: [undefined],
    scaleTypes: [undefined, scale_1.ScaleType.LOG],
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
    omitNonSumStack: true,
    omitRaw: false,
    omitRawContinuousFieldForAggregatePlot: true,
    omitRepeatedField: true,
    omitNonPositionalOrFacetOverPositionalChannels: true,
    omitTableWithOcclusionIfAutoAddCount: true,
    omitVerticalDotPlot: false,
    preferredBinAxis: channel_1.Channel.X,
    preferredTemporalAxis: channel_1.Channel.X,
    preferredOrdinalAxis: channel_1.Channel.Y,
    preferredNominalAxis: channel_1.Channel.Y,
    preferredFacet: channel_1.Channel.ROW,
    // Encoding Constraints -- See description inside src/constraints/encoding.ts
    maxCardinalityForCategoricalColor: 20,
    maxCardinalityForFacet: 20,
    maxCardinalityForShape: 6,
    timeUnitShouldHaveVariation: true,
    typeMatchesSchemaType: true,
    // STYLIZE
    stylize: true,
    smallBandSizeForHighCardinalityOrFacet: { maxCardinality: 10, bandSize: 12 },
    nominalColorScaleForHighCardinality: { maxCardinality: 10, palette: 'category20' },
    xAxisOnTopForHighYCardinalityWithoutColumn: { maxCardinality: 30 },
    // RANKING PREFERENCE
    maxGoodCardinalityForFacet: 5,
    maxGoodCardinalityForColor: 7,
};

},{"./property":21,"vega-lite/src/aggregate":43,"vega-lite/src/channel":46,"vega-lite/src/mark":49,"vega-lite/src/scale":50,"vega-lite/src/sort":51,"vega-lite/src/timeunit":53,"vega-lite/src/type":54}],10:[function(require,module,exports){
"use strict";
/**
 * Abstract model for a constraint.
 */
var AbstractConstraintModel = (function () {
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

},{}],11:[function(require,module,exports){
"use strict";
var _encoding = require('./encoding');
var _spec = require('./spec');
exports.encoding = _encoding;
exports.spec = _spec;

},{"./encoding":12,"./spec":13}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aggregate_1 = require('vega-lite/src/aggregate');
var channel_1 = require('vega-lite/src/channel');
var scale_1 = require('vega-lite/src/scale');
var type_1 = require('vega-lite/src/type');
var base_1 = require('./base');
var property_1 = require('../property');
var enumspec_1 = require('../enumspec');
var schema_1 = require('../schema');
var util_1 = require('../util');
var encoding_1 = require('../query/encoding');
var EncodingConstraintModel = (function (_super) {
    __extends(EncodingConstraintModel, _super);
    function EncodingConstraintModel(constraint) {
        _super.call(this, constraint);
    }
    EncodingConstraintModel.prototype.hasAllRequiredPropertiesSpecific = function (encQ) {
        return util_1.every(this.constraint.properties, function (prop) {
            var nestedEncProp = property_1.getNestedEncodingProperty(prop);
            if (nestedEncProp) {
                var parent_1 = nestedEncProp.parent;
                var child = nestedEncProp.child;
                if (!encQ[parent_1]) {
                    return true;
                }
                return !enumspec_1.isEnumSpec(encQ[parent_1][child]);
            }
            if (!encQ[prop]) {
                return true;
            }
            return !enumspec_1.isEnumSpec(encQ[prop]);
        });
    };
    EncodingConstraintModel.prototype.satisfy = function (encQ, schema, encEnumSpecIndex, opt) {
        // TODO: Re-order logic to optimize the "allowEnumSpecForProperties" check
        if (!this.constraint.allowEnumSpecForProperties) {
            // TODO: extract as a method and do unit test
            if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
                return true;
            }
        }
        return this.constraint.satisfy(encQ, schema, encEnumSpecIndex, opt);
    };
    return EncodingConstraintModel;
}(base_1.AbstractConstraintModel));
exports.EncodingConstraintModel = EncodingConstraintModel;
exports.ENCODING_CONSTRAINTS = [
    {
        name: 'aggregateOpSupportedByType',
        description: 'Aggregate function should be supported by data type.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.aggregate) {
                return encQ.type !== type_1.Type.ORDINAL && encQ.type !== type_1.Type.NOMINAL;
            }
            // TODO: some aggregate function are actually supported by ordinal
            return true; // no aggregate is okay with any type.
        }
    }, {
        name: 'asteriskFieldWithCountOnly',
        description: 'Field="*" should be disallowed except aggregate="count"',
        properties: [property_1.Property.FIELD, property_1.Property.AGGREGATE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            return (encQ.field === '*') === (encQ.aggregate === aggregate_1.AggregateOp.COUNT);
        }
    }, {
        name: 'binAppliedForQuantitative',
        description: 'bin should be applied to quantitative field only.',
        properties: [property_1.Property.TYPE, property_1.Property.BIN],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.bin) {
                // If binned, the type must be quantitative
                return encQ.type === type_1.Type.QUANTITATIVE;
            }
            return true;
        }
    }, {
        name: 'channelSupportsRole',
        description: 'encoding channel should support the role of the field',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (enumspec_1.isEnumSpec(encQ.channel))
                return true; // not ready for checking yet!
            if (!encEnumSpecIndex.channel && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            var supportedRole = channel_1.getSupportedRole(encQ.channel);
            if (encoding_1.isDimension(encQ)) {
                return supportedRole.dimension;
            }
            else if (encoding_1.isMeasure(encQ)) {
                return supportedRole.measure;
            }
            return true;
        }
    }, {
        name: 'hasFn',
        description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.hasFn) {
                return !!encQ.aggregate || !!encQ.bin || !!encQ.timeUnit;
            }
            return true;
        }
    }, {
        name: 'omitScaleZeroWithBinnedField',
        description: 'Do not use scale zero with binned field',
        properties: [property_1.Property.SCALE, property_1.Property.SCALE_ZERO, property_1.Property.BIN],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.bin && encQ.scale) {
                if (encQ.scale.zero === true) {
                    return false;
                }
            }
            return true;
        }
    }, {
        name: 'onlyOneTypeOfFunction',
        description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            var numFn = (!enumspec_1.isEnumSpec(encQ.aggregate) && !!encQ.aggregate ? 1 : 0) +
                (!enumspec_1.isEnumSpec(encQ.autoCount) && !!encQ.autoCount ? 1 : 0) +
                (!enumspec_1.isEnumSpec(encQ.bin) && !!encQ.bin ? 1 : 0) +
                (!enumspec_1.isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit ? 1 : 0);
            return numFn <= 1;
        }
    }, {
        name: 'timeUnitAppliedForTemporal',
        description: 'Time unit should be applied to temporal field only.',
        properties: [property_1.Property.TYPE, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.timeUnit && encQ.type !== type_1.Type.TEMPORAL) {
                return false;
            }
            return true;
        }
    }, {
        name: 'timeUnitShouldHaveVariation',
        description: 'A particular time unit should be applied only if they produce unique values.',
        properties: [property_1.Property.TIMEUNIT, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.timeUnit && encQ.type === type_1.Type.TEMPORAL) {
                if (!encEnumSpecIndex.timeUnit && !opt.constraintManuallySpecifiedValue) {
                    // Do not have to check this as this is manually specified by users.
                    return true;
                }
                return schema.timeUnitHasVariation(encQ);
            }
            return true;
        }
    }, {
        name: 'scalePropertiesSupportedByScaleType',
        description: 'Scale properties must be supported by correct scale type',
        properties: property_1.SCALE_PROPERTIES.concat([property_1.Property.SCALE, property_1.Property.TYPE]),
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.scale) {
                var scale = encQ.scale;
                //  If encQ.type is an EnumSpec and scale.type is undefined, it is equivalent
                //  to scale type is EnumSpec. If scale type is an EnumSpec, we do not yet know
                //  what the scale type is, and thus can ignore the constraint.
                var sType = encoding_1.scaleType(encQ);
                if (sType === undefined) {
                    // If still ambiguous, doesn't check the constraint
                    return true;
                }
                for (var scaleProp in scale) {
                    if (property_1.SUPPORTED_SCALE_PROPERTY_INDEX[scaleProp]) {
                        if (!util_1.contains(property_1.SUPPORTED_SCALE_PROPERTY_INDEX[scaleProp], sType)) {
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
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.field === '*') {
                return true;
            }
            var primitiveType = schema.primitiveType(encQ.field);
            var type = encQ.type;
            if (!encEnumSpecIndex.field && !encEnumSpecIndex.type && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            switch (primitiveType) {
                case schema_1.PrimitiveType.BOOLEAN:
                case schema_1.PrimitiveType.STRING:
                    return type !== type_1.Type.QUANTITATIVE && type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.NUMBER:
                case schema_1.PrimitiveType.INTEGER:
                    return type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.DATE:
                    // TODO: add NOMINAL, ORDINAL support after we support this in Vega-Lite
                    return type === type_1.Type.TEMPORAL;
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
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (!encEnumSpecIndex.field && !encEnumSpecIndex.type && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            if (encQ.field === '*') {
                return encQ.type === type_1.Type.QUANTITATIVE;
            }
            return schema.type(encQ.field) === encQ.type;
        }
    }, {
        name: 'maxCardinalityForCategoricalColor',
        description: 'Categorical channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            // TODO: missing case where ordinal / temporal use categorical color
            // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
            if (encQ.channel === channel_1.Channel.COLOR && encQ.type === type_1.Type.NOMINAL) {
                return schema.cardinality(encQ) <= opt.maxCardinalityForCategoricalColor;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'maxCardinalityForFacet',
        description: 'Row/column channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.channel === channel_1.Channel.ROW || encQ.channel === channel_1.Channel.COLUMN) {
                return schema.cardinality(encQ) <= opt.maxCardinalityForFacet;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'maxCardinalityForShape',
        description: 'Shape channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.channel === channel_1.Channel.SHAPE) {
                return schema.cardinality(encQ) <= opt.maxCardinalityForShape;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'dataTypeAndFunctionMatchScaleType',
        description: 'Scale type must match data type',
        properties: [property_1.Property.TYPE, property_1.Property.SCALE, property_1.Property.SCALE_TYPE, property_1.Property.TIMEUNIT, property_1.Property.BIN],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.scale) {
                var type = encQ.type;
                var sType = encoding_1.scaleType(encQ);
                if (util_1.contains([type_1.Type.ORDINAL, type_1.Type.NOMINAL], type)) {
                    return util_1.contains([scale_1.ScaleType.ORDINAL, undefined], sType);
                }
                else if (type === type_1.Type.TEMPORAL) {
                    if (!encQ.timeUnit) {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType);
                    }
                    else {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.ORDINAL, undefined], sType);
                    }
                }
                else if (type === type_1.Type.QUANTITATIVE) {
                    if (encQ.bin) {
                        return util_1.contains([scale_1.ScaleType.LINEAR, undefined], sType);
                    }
                    else {
                        return util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT, scale_1.ScaleType.QUANTILE, scale_1.ScaleType.QUANTIZE, scale_1.ScaleType.LINEAR, undefined], sType);
                    }
                }
            }
            return true;
        }
    }
].map(function (ec) { return new EncodingConstraintModel(ec); });
exports.ENCODING_CONSTRAINT_INDEX = exports.ENCODING_CONSTRAINTS.reduce(function (m, ec) {
    m[ec.name()] = ec;
    return m;
}, {});
exports.ENCODING_CONSTRAINTS_BY_PROPERTY = exports.ENCODING_CONSTRAINTS.reduce(function (m, c) {
    c.properties().forEach(function (prop) {
        m[prop] = m[prop] || [];
        m[prop].push(c);
    });
    return m;
}, {});
/**
 * Check all encoding constraints for a particular property and index tuple
 */
function checkEncoding(prop, enumSpec, index, specM, schema, opt) {
    // Check encoding constraint
    var encodingConstraints = exports.ENCODING_CONSTRAINTS_BY_PROPERTY[prop] || [];
    var encQ = specM.getEncodingQueryByIndex(index);
    for (var i = 0; i < encodingConstraints.length; i++) {
        var c = encodingConstraints[i];
        // Check if the constraint is enabled
        if (c.strict() || !!opt[c.name()]) {
            // For strict constraint, or enabled non-strict, check the constraints
            var satisfy = c.satisfy(encQ, schema, specM.enumSpecIndex.encodings[index], opt);
            if (!satisfy) {
                var violatedConstraint = '(enc) ' + c.name();
                /* istanbul ignore if */
                if (opt.verbose) {
                    console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + enumSpec.name);
                }
                return violatedConstraint;
            }
        }
    }
    return null;
}
exports.checkEncoding = checkEncoding;

},{"../enumspec":16,"../property":21,"../query/encoding":22,"../schema":35,"../util":37,"./base":10,"vega-lite/src/aggregate":43,"vega-lite/src/channel":46,"vega-lite/src/scale":50,"vega-lite/src/type":54}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aggregate_1 = require('vega-lite/src/aggregate');
var channel_1 = require('vega-lite/src/channel');
var mark_1 = require('vega-lite/src/mark');
var scale_1 = require('vega-lite/src/scale');
var type_1 = require('vega-lite/src/type');
var base_1 = require('./base');
var enumspec_1 = require('../enumspec');
var property_1 = require('../property');
var encoding_1 = require('../query/encoding');
var util_1 = require('../util');
var encoding_2 = require('../query/encoding');
var NONSPATIAL_CHANNELS_INDEX = channel_1.NONSPATIAL_CHANNELS.reduce(function (m, channel) {
    m[channel] = true;
    return m;
}, {});
var SpecConstraintModel = (function (_super) {
    __extends(SpecConstraintModel, _super);
    function SpecConstraintModel(specConstraint) {
        _super.call(this, specConstraint);
    }
    SpecConstraintModel.prototype.hasAllRequiredPropertiesSpecific = function (specM) {
        return util_1.every(this.constraint.properties, function (prop) {
            if (prop === property_1.Property.MARK) {
                return !enumspec_1.isEnumSpec(specM.getMark());
            }
            // TODO: transform
            var nestedEncProp = property_1.getNestedEncodingProperty(prop);
            if (nestedEncProp) {
                var parent_1 = nestedEncProp.parent;
                var child_1 = nestedEncProp.child;
                return util_1.every(specM.getEncodings(), function (encQ) {
                    if (!encQ[parent_1]) {
                        return true;
                    }
                    return !enumspec_1.isEnumSpec(encQ[parent_1][child_1]);
                });
            }
            if (!property_1.isEncodingProperty(prop)) {
                throw new Error('UNIMPLEMENTED');
            }
            return util_1.every(specM.getEncodings(), function (encQ) {
                if (!encQ[prop]) {
                    return true;
                }
                return !enumspec_1.isEnumSpec(encQ[prop]);
            });
        });
    };
    SpecConstraintModel.prototype.satisfy = function (specM, schema, opt) {
        // TODO: Re-order logic to optimize the "allowEnumSpecForProperties" check
        if (!this.constraint.allowEnumSpecForProperties) {
            if (!this.hasAllRequiredPropertiesSpecific(specM)) {
                return true;
            }
        }
        return this.constraint.satisfy(specM, schema, opt);
    };
    return SpecConstraintModel;
}(base_1.AbstractConstraintModel));
exports.SpecConstraintModel = SpecConstraintModel;
exports.SPEC_CONSTRAINTS = [
    {
        name: 'noRepeatedChannel',
        description: 'Each encoding channel should only be used once.',
        properties: [property_1.Property.CHANNEL],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (specM, schema, opt) {
            var usedChannel = {};
            // channel for all encodings should be valid
            return util_1.every(specM.getEncodings(), function (encQ) {
                if (!enumspec_1.isEnumSpec(encQ.channel)) {
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
        properties: [property_1.Property.MARK, property_1.Property.SCALE, property_1.Property.SCALE_ZERO, property_1.Property.CHANNEL, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (specM, schema, opt) {
            var mark = specM.getMark();
            var encodings = specM.getEncodings();
            if (mark === mark_1.Mark.BAR) {
                for (var _i = 0, encodings_1 = encodings; _i < encodings_1.length; _i++) {
                    var encQ = encodings_1[_i];
                    if ((encQ.channel === channel_1.Channel.X || encQ.channel === channel_1.Channel.Y) &&
                        (encQ.type === type_1.Type.QUANTITATIVE) &&
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
        properties: [property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.TYPE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: true,
        strict: false,
        satisfy: function (specM, schema, opt) {
            var hasAutoCount = util_1.some(specM.getEncodings(), function (encQ) { return encQ.autoCount === true; });
            if (hasAutoCount) {
                // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
                return util_1.every(specM.getEncodings(), function (encQ) {
                    if (encQ.autoCount !== undefined) {
                        return true;
                    }
                    switch (encQ.type) {
                        case type_1.Type.QUANTITATIVE:
                            return !!encQ.bin;
                        case type_1.Type.TEMPORAL:
                            return !!encQ.timeUnit;
                        case type_1.Type.ORDINAL:
                        case type_1.Type.NOMINAL:
                            return true;
                    }
                    /* istanbul ignore next */
                    throw new Error('Unsupported Type');
                });
            }
            else {
                var neverHaveAutoCount = util_1.every(specM.enumSpecIndex.encodingIndicesByProperty['autoCount'], function (index) {
                    return !enumspec_1.isEnumSpec(specM.getEncodingQueryByIndex(index).autoCount);
                });
                if (neverHaveAutoCount) {
                    // If the query surely does not have autoCount
                    // then one of the field should be
                    // (1) unbinned quantitative
                    // (2) temporal without time unit
                    // (3) nominal or ordinal field
                    // or at least have potential to be (still ambiguous).
                    return util_1.some(specM.getEncodings(), function (encQ) {
                        if (encQ.type === type_1.Type.QUANTITATIVE) {
                            if (encQ.autoCount === false) {
                                return false;
                            }
                            else {
                                return !encQ.bin || enumspec_1.isEnumSpec(encQ.bin);
                            }
                        }
                        else if (encQ.type === type_1.Type.TEMPORAL) {
                            return !encQ.timeUnit || enumspec_1.isEnumSpec(encQ.timeUnit);
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
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (specM, schema, opt) {
            var mark = specM.getMark();
            // if mark is unspecified, no need to check
            if (enumspec_1.isEnumSpec(mark))
                return true;
            // TODO: can optimize this to detect only what's the changed property if needed.
            return util_1.every(specM.getEncodings(), function (encQ) {
                // channel unspecified, no need to check
                if (enumspec_1.isEnumSpec(encQ.channel))
                    return true;
                return channel_1.supportMark(encQ.channel, mark);
            });
        }
    },
    {
        name: 'hasAllRequiredChannelsForMark',
        description: 'All required channels for the specified mark should be specified',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (specM, schema, opt) {
            var mark = specM.getMark();
            switch (mark) {
                case mark_1.Mark.AREA:
                case mark_1.Mark.LINE:
                    return specM.channelUsed(channel_1.Channel.X) && specM.channelUsed(channel_1.Channel.Y);
                case mark_1.Mark.TEXT:
                    return specM.channelUsed(channel_1.Channel.TEXT);
                case mark_1.Mark.BAR:
                case mark_1.Mark.CIRCLE:
                case mark_1.Mark.SQUARE:
                case mark_1.Mark.TICK:
                case mark_1.Mark.RULE:
                    return specM.channelUsed(channel_1.Channel.X) || specM.channelUsed(channel_1.Channel.Y);
                case mark_1.Mark.POINT:
                    // This allows generating a point plot if channel was not an enum spec.
                    return !specM.enumSpecIndex.hasProperty(property_1.Property.CHANNEL) ||
                        specM.channelUsed(channel_1.Channel.X) || specM.channelUsed(channel_1.Channel.Y);
            }
            /* istanbul ignore next */
            throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
        }
    },
    {
        name: 'omitAggregate',
        description: 'Omit aggregate plots.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: true,
        strict: false,
        satisfy: function (specM, schema, opt) {
            if (specM.isAggregate()) {
                return false;
            }
            return true;
        }
    },
    {
        name: 'omitAggregatePlotWithDimensionOnlyOnFacet',
        description: 'All required channels for the specified mark should be specified',
        properties: [property_1.Property.CHANNEL, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
            if (specM.isAggregate()) {
                var hasNonFacetDim_1 = false, hasDim_1 = false, hasEnumeratedFacetDim_1 = false;
                specM.specQuery.encodings.forEach(function (encQ, index) {
                    if (encQ.autoCount === false)
                        return; // skip unused field
                    if (!encQ.aggregate && !encQ.autoCount) {
                        hasDim_1 = true;
                        if (util_1.contains([channel_1.Channel.ROW, channel_1.Channel.COLUMN], encQ.channel)) {
                            if (specM.enumSpecIndex.hasEncodingProperty(index, property_1.Property.CHANNEL)) {
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
            if (specM.isAggregate()) {
                // TODO relax
                return util_1.some(specM.getEncodings(), function (encQ) {
                    if (encoding_1.isDimension(encQ)) {
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
        properties: [property_1.Property.MARK, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
            if (util_1.contains([mark_1.Mark.BAR, mark_1.Mark.LINE, mark_1.Mark.AREA], specM.getMark())) {
                return specM.isAggregate();
            }
            return true;
        }
    },
    {
        name: 'omitBarTickWithSize',
        description: 'Do not map field to size channel with bar and tick mark',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowEnumSpecForProperties: true,
        strict: false,
        satisfy: function (specM, schema, opt) {
            var mark = specM.getMark();
            if (util_1.contains([mark_1.Mark.TICK, mark_1.Mark.BAR], mark)) {
                if (specM.channelUsed(channel_1.Channel.SIZE)) {
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
                            if (encQ.channel === channel_1.Channel.SIZE) {
                                if (specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
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
        properties: [property_1.Property.MARK, property_1.Property.CHANNEL, property_1.Property.SCALE, property_1.Property.SCALE_TYPE, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (specM, schema, opt) {
            var mark = specM.getMark();
            var encodings = specM.getEncodings();
            // TODO: mark or scale type should be enumerated
            if (mark === mark_1.Mark.AREA || mark === mark_1.Mark.BAR) {
                for (var _i = 0, encodings_2 = encodings; _i < encodings_2.length; _i++) {
                    var encQ = encodings_2[_i];
                    if ((encQ.channel === channel_1.Channel.X || encQ.channel === channel_1.Channel.Y) && encQ.scale) {
                        var sType = encoding_2.scaleType(encQ);
                        if (sType === scale_1.ScaleType.LOG) {
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
        properties: [property_1.Property.CHANNEL],
        allowEnumSpecForProperties: true,
        strict: false,
        satisfy: function (specM, schema, opt) {
            // have to use specM.specQuery.encodings insetad of specM.getEncodings()
            // since specM.getEncodings() remove encQ with autoCount===false from the array
            // and thus might shift the index
            var encodings = specM.specQuery.encodings;
            var nonPositionChannelCount = 0;
            var hasEnumeratedNonPositionChannel = false;
            for (var i = 0; i < encodings.length; i++) {
                var encQ = encodings[i];
                if (encQ.autoCount === false)
                    continue; // ignore skipped encoding
                var channel = encQ.channel;
                if (!enumspec_1.isEnumSpec(channel)) {
                    if (NONSPATIAL_CHANNELS_INDEX[channel]) {
                        nonPositionChannelCount += 1;
                        if (specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
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
        properties: [property_1.Property.CHANNEL],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
            var encodings = specM.specQuery.encodings;
            var hasNonPositionalChannelOrFacet = false;
            var hasEnumeratedNonPositionOrFacetChannel = false;
            var hasX = false, hasY = false;
            for (var i = 0; i < encodings.length; i++) {
                var encQ = encodings[i];
                if (encQ.autoCount === false)
                    continue; // ignore skipped encoding
                var channel = encQ.channel;
                if (channel === channel_1.Channel.X) {
                    hasX = true;
                }
                else if (channel === channel_1.Channel.Y) {
                    hasY = true;
                }
                else if (!enumspec_1.isEnumSpec(channel)) {
                    // All non positional channel / Facet
                    hasNonPositionalChannelOrFacet = true;
                    if (specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.TYPE],
        allowEnumSpecForProperties: true,
        strict: false,
        satisfy: function (specM, schema, opt) {
            if (specM.isAggregate()) {
                var encodings = specM.specQuery.encodings;
                for (var i = 0; i < encodings.length; i++) {
                    var encQ = encodings[i];
                    if (encQ.autoCount === false)
                        continue; // skip unused encoding
                    // TODO: aggregate for ordinal and temporal
                    if (encQ.type === type_1.Type.TEMPORAL) {
                        // Temporal fields should have timeUnit or is still an enumSpec
                        if (!encQ.timeUnit && (specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.TIMEUNIT) ||
                            opt.constraintManuallySpecifiedValue)) {
                            return false;
                        }
                    }
                    if (encQ.type === type_1.Type.QUANTITATIVE) {
                        if (!encQ.bin && !encQ.aggregate && !encQ.autoCount) {
                            // If Raw Q
                            if (specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.BIN) ||
                                specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.AGGREGATE) ||
                                specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.AUTOCOUNT)) {
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
        properties: [property_1.Property.CHANNEL, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (specM, schema, opt) {
            if (specM.isAggregate()) {
                return true;
            }
            return util_1.every(specM.specQuery.encodings, function (encQ, index) {
                if (encQ.autoCount === false)
                    return true; // ignore autoCount field
                if (encQ.channel === channel_1.Channel.DETAIL) {
                    // Detail channel for raw plot is not good, except when its enumerated
                    // or when it's manually specified but we constraintManuallySpecifiedValue.
                    if (specM.enumSpecIndex.hasEncodingProperty(index, property_1.Property.CHANNEL) ||
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
        properties: [property_1.Property.FIELD],
        allowEnumSpecForProperties: true,
        strict: false,
        satisfy: function (specM, schema, opt) {
            var fieldUsed = {};
            var fieldEnumerated = {};
            var encodings = specM.specQuery.encodings;
            for (var i = 0; i < encodings.length; i++) {
                var encQ = encodings[i];
                if (encQ.field && !enumspec_1.isEnumSpec(encQ.field)) {
                    var field = encQ.field;
                    if (specM.enumSpecIndex.hasEncodingProperty(i, property_1.Property.FIELD)) {
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
        properties: [property_1.Property.CHANNEL],
        allowEnumSpecForProperties: true,
        strict: false,
        satisfy: function (specM, schema, opt) {
            var encodings = specM.getEncodings();
            if (encodings.length === 1 && encodings[0].channel === channel_1.Channel.Y) {
                return false;
            }
            return true;
        }
    },
    // EXPENSIVE CONSTRAINTS -- check them later!
    {
        name: 'hasAppropriateGraphicTypeForMark',
        description: 'Has appropriate graphic type for mark',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK, property_1.Property.TYPE, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
            var mark = specM.getMark();
            switch (mark) {
                case mark_1.Mark.AREA:
                case mark_1.Mark.LINE:
                    if (specM.isAggregate()) {
                        var xEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.X);
                        var yEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.Y);
                        var xIsMeasure = xEncQ && encoding_2.isMeasure(xEncQ);
                        var yIsMeasure = yEncQ && encoding_2.isMeasure(yEncQ);
                        // for aggregate line / area, we need at least one group-by axis and one measure axis.
                        return xEncQ && yEncQ && (xIsMeasure !== yIsMeasure) &&
                            // and the dimension axis should not be nominal
                            // TODO: make this clause optional
                            !(!xIsMeasure && xEncQ.type === type_1.Type.NOMINAL) &&
                            !(!yIsMeasure && yEncQ.type === type_1.Type.NOMINAL);
                    }
                    return true;
                case mark_1.Mark.TEXT:
                    // FIXME correctly when we add text
                    return true;
                case mark_1.Mark.BAR:
                case mark_1.Mark.TICK:
                    // Bar and tick should not use size.
                    if (specM.channelUsed(channel_1.Channel.SIZE)) {
                        return false;
                    }
                    // Tick and Bar should have one and only one measure
                    if (specM.isMeasure(channel_1.Channel.X) !== specM.isMeasure(channel_1.Channel.Y)) {
                        // TODO: Bar and tick's dimension should not be continuous (quant/time) scale
                        return true;
                    }
                    return false;
                case mark_1.Mark.CIRCLE:
                case mark_1.Mark.POINT:
                case mark_1.Mark.SQUARE:
                case mark_1.Mark.RULE:
                    return true;
            }
            /* istanbul ignore next */
            throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
        }
    },
    {
        name: 'omitNonLinearScaleTypeWithStack',
        description: 'Stacked plot should only use linear scale',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.SCALE, property_1.Property.SCALE_TYPE, property_1.Property.TYPE],
        // TODO: Property.STACK
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (specM, schema, opt) {
            var stack = specM.stack();
            if (stack) {
                for (var _i = 0, _a = specM.getEncodings(); _i < _a.length; _i++) {
                    var encQ = _a[_i];
                    if ((!!encQ.aggregate || encQ.autoCount === true) &&
                        encQ.type === type_1.Type.QUANTITATIVE &&
                        util_1.contains([channel_1.Channel.X, channel_1.Channel.Y], encQ.channel)) {
                        if (encoding_2.scaleType(encQ) !== scale_1.ScaleType.LINEAR) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    },
    {
        name: 'omitNonSumStack',
        description: 'Stacked plot should use summative aggregation such as sum, count, or distinct',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
            var stack = specM.stack();
            if (stack) {
                var measureEncQ = specM.getEncodingQueryByChannel(stack.fieldChannel);
                return util_1.contains(aggregate_1.SUM_OPS, measureEncQ.aggregate) || !!measureEncQ.autoCount;
            }
            return true;
        }
    },
    {
        name: 'omitTableWithOcclusionIfAutoAddCount',
        description: 'Plots without aggregation or autocount where x and y are both dimensions should be omitted if autoAddCount is enabled as they often lead to occlusion',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (specM, schema, opt) {
            if (opt.autoAddCount) {
                // TODO(#186): take mark properties channel into account
                if (specM.isDimension(channel_1.Channel.X) &&
                    specM.isDimension(channel_1.Channel.Y) &&
                    !specM.isAggregate() // TODO: refactor based on statistics
                ) {
                    return false;
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
//
exports.SPEC_CONSTRAINTS_BY_PROPERTY = exports.SPEC_CONSTRAINTS.reduce(function (m, c) {
    c.properties().forEach(function (prop) {
        m[prop] = m[prop] || [];
        m[prop].push(c);
    });
    return m;
}, {});
/**
 * Check all encoding constraints for a particular property and index tuple
 */
function checkSpec(prop, enumSpec, specM, schema, opt) {
    // Check encoding constraint
    var specConstraints = exports.SPEC_CONSTRAINTS_BY_PROPERTY[prop] || [];
    for (var i = 0; i < specConstraints.length; i++) {
        var c = specConstraints[i];
        // Check if the constraint is enabled
        if (c.strict() || !!opt[c.name()]) {
            // For strict constraint, or enabled non-strict, check the constraints
            var satisfy = c.satisfy(specM, schema, opt);
            if (!satisfy) {
                var violatedConstraint = '(spec) ' + c.name();
                /* istanbul ignore if */
                if (opt.verbose) {
                    console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + enumSpec.name);
                }
                return violatedConstraint;
            }
        }
    }
    return null;
}
exports.checkSpec = checkSpec;

},{"../enumspec":16,"../property":21,"../query/encoding":22,"../util":37,"./base":10,"vega-lite/src/aggregate":43,"vega-lite/src/channel":46,"vega-lite/src/mark":49,"vega-lite/src/scale":50,"vega-lite/src/type":54}],14:[function(require,module,exports){
"use strict";
exports.version = '0.6.7';
var util_1 = require('./util');
exports.config = require('./config');
exports.constraint = require('./constraint/constraint');
exports.enumerate = require('./enumerator');
exports.enumSpec = require('./enumspec');
var generate_1 = require('./generate');
exports.generate = generate_1.generate;
exports.model = require('./model');
exports.nest = require('./nest');
exports.property = require('./property');
// Make it so that we can call cql.query() as method, or access other methods inside cql.query
var cqlQuery = require('./query/query');
var query_1 = require('./query/query');
exports.query = util_1.extend(query_1.query, cqlQuery);
exports.ranking = require('./ranking/ranking');
exports.schema = require('./schema');
exports.util = require('./util');

},{"./config":9,"./constraint/constraint":11,"./enumerator":15,"./enumspec":16,"./generate":18,"./model":19,"./nest":20,"./property":21,"./query/query":24,"./ranking/ranking":34,"./schema":35,"./util":37}],15:[function(require,module,exports){
"use strict";
var encoding_1 = require('./constraint/encoding');
var spec_1 = require('./constraint/spec');
var property_1 = require('./property');
exports.ENUMERATOR_INDEX = {};
exports.ENUMERATOR_INDEX[property_1.Property.MARK] = function (enumSpecIndex, schema, opt) {
    return function (answerSet, specM) {
        var markEnumSpec = specM.getMark();
        // enumerate the value
        markEnumSpec.enum.forEach(function (mark) {
            specM.setMark(mark);
            // Check spec constraint
            var violatedSpecConstraint = spec_1.checkSpec(property_1.Property.MARK, enumSpecIndex.mark, specM, schema, opt);
            if (!violatedSpecConstraint) {
                // emit
                answerSet.push(specM.duplicate());
            }
        });
        // Reset to avoid side effect
        specM.resetMark();
        return answerSet;
    };
};
property_1.ENCODING_PROPERTIES.forEach(function (prop) {
    exports.ENUMERATOR_INDEX[prop] = EncodingPropertyGeneratorFactory(prop);
});
property_1.NESTED_ENCODING_PROPERTIES.forEach(function (nestedProp) {
    exports.ENUMERATOR_INDEX[nestedProp.property] = EncodingPropertyGeneratorFactory(nestedProp.property);
});
/**
 * @param prop property type.
 * @return an answer set reducer factory for the given prop.
 */
function EncodingPropertyGeneratorFactory(prop) {
    /**
     * @return as reducer that takes a specQueryModel as input and output an answer set array.
     */
    return function (enumSpecIndex, schema, opt) {
        return function (answerSet, specM) {
            // index of encoding mappings that require enumeration
            var indices = enumSpecIndex.encodingIndicesByProperty[prop];
            function enumerate(jobIndex) {
                if (jobIndex === indices.length) {
                    // emit and terminate
                    answerSet.push(specM.duplicate());
                    return;
                }
                var index = indices[jobIndex];
                var enumSpec = enumSpecIndex.encodings[index][prop];
                var encQ = specM.getEncodingQueryByIndex(index);
                var propEnumSpec = specM.getEncodingProperty(index, prop);
                if (
                // TODO: encQ.exclude
                // If this encoding query is an excluded autoCount, there is no point enumerating other properties
                // for this encoding query because they will be excluded anyway.
                // Thus, we can just move on to the next encoding to enumerate.
                encQ.autoCount === false ||
                    // nested encoding property might have its parent set to false
                    // therefore, we no longer have to enumerate them
                    !propEnumSpec) {
                    enumerate(jobIndex + 1);
                }
                else {
                    enumSpec.enum.forEach(function (propVal) {
                        if (propVal === null) {
                            // our duplicate() method use JSON.stringify, parse and thus can accidentally
                            // convert undefined in an array into null
                            propVal = undefined;
                        }
                        specM.setEncodingProperty(index, prop, propVal, enumSpec);
                        // Check encoding constraint
                        var violatedEncodingConstraint = encoding_1.checkEncoding(prop, enumSpec, index, specM, schema, opt);
                        if (violatedEncodingConstraint) {
                            return; // do not keep searching
                        }
                        // Check spec constraint
                        var violatedSpecConstraint = spec_1.checkSpec(prop, enumSpec, specM, schema, opt);
                        if (violatedSpecConstraint) {
                            return; // do not keep searching
                        }
                        // If qualify all of the constraints, keep enumerating
                        enumerate(jobIndex + 1);
                    });
                    // Reset to avoid side effect
                    specM.resetEncodingProperty(index, prop, enumSpec);
                }
            }
            // start enumerating from 0
            enumerate(0);
            return answerSet;
        };
    };
}
exports.EncodingPropertyGeneratorFactory = EncodingPropertyGeneratorFactory;

},{"./constraint/encoding":12,"./constraint/spec":13,"./property":21}],16:[function(require,module,exports){
"use strict";
var util_1 = require('./util');
/** Enum for a short form of the enumeration spec. */
(function (ShortEnumSpec) {
    ShortEnumSpec[ShortEnumSpec["ENUMSPEC"] = '?'] = "ENUMSPEC";
})(exports.ShortEnumSpec || (exports.ShortEnumSpec = {}));
var ShortEnumSpec = exports.ShortEnumSpec;
exports.SHORT_ENUM_SPEC = ShortEnumSpec.ENUMSPEC;
function isEnumSpec(prop) {
    return prop === exports.SHORT_ENUM_SPEC || (prop !== undefined && (!!prop.enum || !!prop.name) && !util_1.isArray(prop));
}
exports.isEnumSpec = isEnumSpec;
function initEnumSpec(prop, defaultName, defaultEnumValues) {
    return util_1.extend({}, {
        name: defaultName,
        enum: defaultEnumValues
    }, prop === exports.SHORT_ENUM_SPEC ? {} : prop);
}
exports.initEnumSpec = initEnumSpec;

},{"./util":37}],17:[function(require,module,exports){
"use strict";
var property_1 = require('./property');
var util_1 = require('./util');
var EnumSpecIndex = (function () {
    function EnumSpecIndex() {
        this._mark = undefined;
        this._encodings = {};
        this._encodingIndicesByProperty = {};
    }
    EnumSpecIndex.prototype.setEncodingProperty = function (index, prop, enumSpec) {
        var encodingsIndex = this._encodings;
        // Init encoding index and set prop
        var encIndex = encodingsIndex[index] = encodingsIndex[index] || {};
        encIndex[prop] = enumSpec;
        // Initialize indicesByProperty[prop] and add index
        var encodingIndicesByProperty = this._encodingIndicesByProperty;
        (encodingIndicesByProperty[prop] = encodingIndicesByProperty[prop] || []).push(index);
        return this;
    };
    EnumSpecIndex.prototype.hasEncodingProperty = function (index, prop) {
        return !!(this._encodings[index] || {})[prop];
    };
    EnumSpecIndex.prototype.hasProperty = function (prop) {
        if (property_1.isEncodingProperty(prop)) {
            return !!this.encodingIndicesByProperty[prop];
        }
        if (prop === property_1.Property.MARK) {
            return !!this.mark;
        }
        /* istanbul ignore next */
        throw new Error('Unimplemented for property ' + prop);
    };
    EnumSpecIndex.prototype.isEmpty = function () {
        return !this.mark && util_1.keys(this.encodingIndicesByProperty).length === 0;
    };
    EnumSpecIndex.prototype.setMark = function (mark) {
        this._mark = mark;
        return this;
    };
    Object.defineProperty(EnumSpecIndex.prototype, "mark", {
        get: function () {
            return this._mark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumSpecIndex.prototype, "encodings", {
        get: function () {
            return this._encodings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumSpecIndex.prototype, "encodingIndicesByProperty", {
        get: function () {
            return this._encodingIndicesByProperty;
        },
        enumerable: true,
        configurable: true
    });
    return EnumSpecIndex;
}());
exports.EnumSpecIndex = EnumSpecIndex;

},{"./property":21,"./util":37}],18:[function(require,module,exports){
"use strict";
var enumerator_1 = require('../src/enumerator');
var config_1 = require('./config');
var model_1 = require('./model');
var stylize_1 = require('./stylize');
function generate(specQ, schema, opt) {
    if (opt === void 0) { opt = config_1.DEFAULT_QUERY_CONFIG; }
    // 1. Build a SpecQueryModel, which also contains enumSpecIndex
    var specM = model_1.SpecQueryModel.build(specQ, schema, opt);
    var enumSpecIndex = specM.enumSpecIndex;
    // 2. Enumerate each of the properties based on propPrecedence.
    var answerSet = [specM]; // Initialize Answer Set with only the input spec query.
    opt.propertyPrecedence.forEach(function (prop) {
        // If the original specQuery contains enumSpec for this prop
        if (enumSpecIndex.hasProperty(prop)) {
            // update answerset
            var reducer = enumerator_1.ENUMERATOR_INDEX[prop](enumSpecIndex, schema, opt);
            answerSet = answerSet.reduce(reducer, []);
        }
    });
    if (opt.stylize) {
        if ((opt.nominalColorScaleForHighCardinality !== null) ||
            (opt.smallBandSizeForHighCardinalityOrFacet !== null) ||
            (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
            return stylize_1.stylize(answerSet, schema, opt);
        }
    }
    return answerSet;
}
exports.generate = generate;

},{"../src/enumerator":15,"./config":9,"./model":19,"./stylize":36}],19:[function(require,module,exports){
"use strict";
var aggregate_1 = require('vega-lite/src/aggregate');
var type_1 = require('vega-lite/src/type');
var property_1 = require('./property');
var enumspec_1 = require('./enumspec');
var enumspecindex_1 = require('./enumspecindex');
var spec_1 = require('./query/spec');
var encoding_1 = require('./query/encoding');
var groupby_1 = require('./query/groupby');
var shorthand_1 = require('./query/shorthand');
var util_1 = require('./util');
function getDefaultName(prop) {
    switch (prop) {
        case property_1.Property.MARK:
            return 'm';
        case property_1.Property.CHANNEL:
            return 'c';
        case property_1.Property.AGGREGATE:
            return 'a';
        case property_1.Property.AUTOCOUNT:
            return '#';
        case property_1.Property.BIN:
            return 'b';
        case property_1.Property.BIN_MAXBINS:
            return 'b-mb';
        case property_1.Property.SORT:
            return 'so';
        case property_1.Property.SORT_FIELD:
            return 'so-f';
        case property_1.Property.SORT_OP:
            return 'so-op';
        case property_1.Property.SORT_ORDER:
            return 'so-or';
        case property_1.Property.SCALE:
            return 's';
        case property_1.Property.SCALE_BANDSIZE:
            return 's-bs';
        case property_1.Property.SCALE_CLAMP:
            return 's-c';
        case property_1.Property.SCALE_DOMAIN:
            return 's-d';
        case property_1.Property.SCALE_EXPONENT:
            return 's-e';
        case property_1.Property.SCALE_NICE:
            return 's-n';
        case property_1.Property.SCALE_RANGE:
            return 's-ra';
        case property_1.Property.SCALE_ROUND:
            return 's-r';
        case property_1.Property.SCALE_TYPE:
            return 's-t';
        case property_1.Property.SCALE_USERAWDOMAIN:
            return 's-u';
        case property_1.Property.SCALE_ZERO:
            return 's-z';
        case property_1.Property.AXIS:
            return 'ax';
        case property_1.Property.AXIS_AXISCOLOR:
            return 'ax-ac';
        case property_1.Property.AXIS_AXISWIDTH:
            return 'ax-aw';
        case property_1.Property.AXIS_LAYER:
            return 'ax-lay';
        case property_1.Property.AXIS_OFFSET:
            return 'ax-of';
        case property_1.Property.AXIS_ORIENT:
            return 'ax-or';
        case property_1.Property.AXIS_GRID:
            return 'ax-g';
        case property_1.Property.AXIS_GRIDCOLOR:
            return 'ax-gc';
        case property_1.Property.AXIS_GRIDDASH:
            return 'ax-gd';
        case property_1.Property.AXIS_GRIDOPACITY:
            return 'ax-go';
        case property_1.Property.AXIS_GRIDWIDTH:
            return 'ax-gw';
        case property_1.Property.AXIS_LABELS:
            return 'ax-lab';
        case property_1.Property.AXIS_FORMAT:
            return 'ax-f';
        case property_1.Property.AXIS_LABELANGLE:
            return 'ax-laba';
        case property_1.Property.AXIS_LABELMAXLENGTH:
            return 'ax-labm';
        case property_1.Property.AXIS_SHORTTIMELABELS:
            return 'ax-stl';
        case property_1.Property.AXIS_SUBDIVIDE:
            return 'ax-sub';
        case property_1.Property.AXIS_TICKS:
            return 'ax-t';
        case property_1.Property.AXIS_TICKCOLOR:
            return 'ax-tc';
        case property_1.Property.AXIS_TICKLABELCOLOR:
            return 'ax-tlc';
        case property_1.Property.AXIS_TICKLABELFONT:
            return 'ax-tlf';
        case property_1.Property.AXIS_TICKLABELFONTSIZE:
            return 'ax-tlfs';
        case property_1.Property.AXIS_TICKPADDING:
            return 'ax-tp';
        case property_1.Property.AXIS_TICKSIZE:
            return 'ax-ts';
        case property_1.Property.AXIS_TICKSIZEMAJOR:
            return 'ax-tsma';
        case property_1.Property.AXIS_TICKSIZEMINOR:
            return 'ax-tsmi';
        case property_1.Property.AXIS_TICKSIZEEND:
            return 'ax-tse';
        case property_1.Property.AXIS_TICKWIDTH:
            return 'ax-tw';
        case property_1.Property.AXIS_VALUES:
            return 'ax-v';
        case property_1.Property.AXIS_TITLE:
            return 'ax-ti';
        case property_1.Property.AXIS_TITLECOLOR:
            return 'ax-tic';
        case property_1.Property.AXIS_TITLEFONT:
            return 'ax-tif';
        case property_1.Property.AXIS_TITLEFONTSIZE:
            return 'ax-tifs';
        case property_1.Property.AXIS_TITLEFONTWEIGHT:
            return 'ax-tifw';
        case property_1.Property.AXIS_TITLEOFFSET:
            return 'ax-tio';
        case property_1.Property.AXIS_TITLEMAXLENGTH:
            return 'ax-timl';
        case property_1.Property.AXIS_CHARACTERWIDTH:
            return 'ax-cw';
        case property_1.Property.LEGEND:
            return 'l';
        case property_1.Property.LEGEND_ORIENT:
            return 'l-or';
        case property_1.Property.LEGEND_OFFSET:
            return 'l-of';
        case property_1.Property.LEGEND_VALUES:
            return 'l-v';
        case property_1.Property.LEGEND_FORMAT:
            return 'l-f';
        case property_1.Property.LEGEND_LABELALIGN:
            return 'l-la';
        case property_1.Property.LEGEND_LABELBASELINE:
            return 'l-lb';
        case property_1.Property.LEGEND_LABELCOLOR:
            return 'l-lc';
        case property_1.Property.LEGEND_LABELFONT:
            return 'l-lf';
        case property_1.Property.LEGEND_LABELFONTSIZE:
            return 'l-lfs';
        case property_1.Property.LEGEND_SHORTTIMELABELS:
            return 'l-stl';
        case property_1.Property.LEGEND_SYMBOLCOLOR:
            return 'l-syc';
        case property_1.Property.LEGEND_SYMBOLSHAPE:
            return 'l-sysh';
        case property_1.Property.LEGEND_SYMBOLSIZE:
            return 'l-sysi';
        case property_1.Property.LEGEND_SYMBOLSTROKEWIDTH:
            return 'l-sysw';
        case property_1.Property.LEGEND_TITLE:
            return 'l-ti';
        case property_1.Property.LEGEND_TITLECOLOR:
            return 'l-tic';
        case property_1.Property.LEGEND_TITLEFONT:
            return 'l-tif';
        case property_1.Property.LEGEND_TITLEFONTSIZE:
            return 'l-tifs';
        case property_1.Property.LEGEND_TITLEFONTWEIGHT:
            return 'l-tifw';
        case property_1.Property.TIMEUNIT:
            return 'tu';
        case property_1.Property.FIELD:
            return 'f';
        case property_1.Property.TYPE:
            return 't';
    }
    /* istanbul ignore next */
    throw new Error('Default name undefined');
}
exports.getDefaultName = getDefaultName;
function getDefaultEnumValues(prop, schema, opt) {
    switch (prop) {
        case property_1.Property.FIELD: // For field, by default enumerate all fields
        case property_1.Property.SORT_FIELD:
            return schema.fields();
        // True, False for boolean values
        case property_1.Property.AXIS:
        case property_1.Property.AXIS_GRID:
        case property_1.Property.AXIS_LABELS:
        case property_1.Property.AXIS_SHORTTIMELABELS:
        case property_1.Property.BIN:
        case property_1.Property.LEGEND:
        case property_1.Property.LEGEND_SHORTTIMELABELS:
        case property_1.Property.SCALE:
        case property_1.Property.SCALE_CLAMP:
        case property_1.Property.SCALE_NICE:
        case property_1.Property.SCALE_ROUND:
        case property_1.Property.SCALE_USERAWDOMAIN:
        case property_1.Property.SCALE_ZERO:
        case property_1.Property.AUTOCOUNT:
            return [false, true];
        // For other properties, take default enumValues from config.
        // The config name for each prop is a plural form of the prop.
        case property_1.Property.AGGREGATE:
            return opt.aggregates;
        case property_1.Property.AXIS_AXISCOLOR:
            return opt.axisAxisColors;
        case property_1.Property.AXIS_AXISWIDTH:
            return opt.axisAxisWidths;
        case property_1.Property.AXIS_LAYER:
            return opt.axisLayers;
        case property_1.Property.AXIS_OFFSET:
            return opt.axisOffsets;
        case property_1.Property.AXIS_ORIENT:
            return opt.axisOrients;
        case property_1.Property.AXIS_GRIDCOLOR:
            return opt.axisGridColors;
        case property_1.Property.AXIS_GRIDDASH:
            return opt.axisGridDashes;
        case property_1.Property.AXIS_GRIDOPACITY:
            return opt.axisGridOpacities;
        case property_1.Property.AXIS_GRIDWIDTH:
            return opt.axisGridWidths;
        case property_1.Property.AXIS_FORMAT:
            return opt.axisFormats;
        case property_1.Property.AXIS_LABELANGLE:
            return opt.axisLabelAngles;
        case property_1.Property.AXIS_LABELMAXLENGTH:
            return opt.axisLabelMaxLengths;
        case property_1.Property.AXIS_SUBDIVIDE:
            return opt.axisSubDivides;
        case property_1.Property.AXIS_TICKS:
            return opt.axisTicks;
        case property_1.Property.AXIS_TICKCOLOR:
            return opt.axisTickColors;
        case property_1.Property.AXIS_TICKLABELCOLOR:
            return opt.axisTickLabelColors;
        case property_1.Property.AXIS_TICKLABELFONT:
            return opt.axisTickLabelFonts;
        case property_1.Property.AXIS_TICKLABELFONTSIZE:
            return opt.axisTickLabelFontSizes;
        case property_1.Property.AXIS_TICKPADDING:
            return opt.axisTickPaddings;
        case property_1.Property.AXIS_TICKSIZE:
            return opt.axisTickSizes;
        case property_1.Property.AXIS_TICKSIZEMAJOR:
            return opt.axisTickSizeMajors;
        case property_1.Property.AXIS_TICKSIZEMINOR:
            return opt.axisTickSizeMinors;
        case property_1.Property.AXIS_TICKSIZEEND:
            return opt.axisTickSizeEnds;
        case property_1.Property.AXIS_TICKWIDTH:
            return opt.axisTickWidths;
        case property_1.Property.AXIS_VALUES:
            return opt.axisValuesList;
        case property_1.Property.AXIS_TITLE:
            return opt.axisTitles;
        case property_1.Property.AXIS_TITLECOLOR:
            return opt.axisTitleColors;
        case property_1.Property.AXIS_TITLEFONT:
            return opt.axisTitleFonts;
        case property_1.Property.AXIS_TITLEFONTWEIGHT:
            return opt.axisTitleFontWeights;
        case property_1.Property.AXIS_TITLEFONTSIZE:
            return opt.axisTitleFontSizes;
        case property_1.Property.AXIS_TITLEOFFSET:
            return opt.axisTitleOffsets;
        case property_1.Property.AXIS_TITLEMAXLENGTH:
            return opt.axisTitleMaxLengths;
        case property_1.Property.AXIS_CHARACTERWIDTH:
            return opt.axisCharacterWidths;
        case property_1.Property.BIN_MAXBINS:
            return opt.maxBinsList;
        case property_1.Property.CHANNEL:
            return opt.channels;
        case property_1.Property.MARK:
            return opt.marks;
        case property_1.Property.LEGEND_ORIENT:
            return opt.legendOrients;
        case property_1.Property.LEGEND_OFFSET:
            return opt.legendOffsets;
        case property_1.Property.LEGEND_VALUES:
            return opt.legendValuesList;
        case property_1.Property.LEGEND_FORMAT:
            return opt.legendFormats;
        case property_1.Property.LEGEND_LABELALIGN:
            return opt.legendLabelAligns;
        case property_1.Property.LEGEND_LABELBASELINE:
            return opt.legendLabelBaselines;
        case property_1.Property.LEGEND_LABELCOLOR:
            return opt.legendLabelColors;
        case property_1.Property.LEGEND_LABELFONT:
            return opt.legendLabelFonts;
        case property_1.Property.LEGEND_LABELFONTSIZE:
            return opt.legendLabelFontSizes;
        case property_1.Property.LEGEND_SYMBOLCOLOR:
            return opt.legendSymbolColors;
        case property_1.Property.LEGEND_SYMBOLSHAPE:
            return opt.legendSymbolShapes;
        case property_1.Property.LEGEND_SYMBOLSIZE:
            return opt.legendSymbolSizes;
        case property_1.Property.LEGEND_SYMBOLSTROKEWIDTH:
            return opt.legendSymbolStrokeWidths;
        case property_1.Property.LEGEND_TITLE:
            return opt.legendTitles;
        case property_1.Property.LEGEND_TITLECOLOR:
            return opt.legendTitleColors;
        case property_1.Property.LEGEND_TITLEFONT:
            return opt.legendTitleFonts;
        case property_1.Property.LEGEND_TITLEFONTSIZE:
            return opt.legendTitleFontSizes;
        case property_1.Property.LEGEND_TITLEFONTWEIGHT:
            return opt.legendTitleFontWeights;
        case property_1.Property.SORT:
            return opt.sorts;
        case property_1.Property.SORT_OP:
            return opt.sortOps;
        case property_1.Property.SORT_ORDER:
            return opt.sortOrders;
        case property_1.Property.SCALE_BANDSIZE:
            return opt.scaleBandSizes;
        case property_1.Property.SCALE_DOMAIN:
            return opt.scaleDomains;
        case property_1.Property.SCALE_EXPONENT:
            return opt.scaleExponents;
        case property_1.Property.SCALE_RANGE:
            return opt.scaleRanges;
        case property_1.Property.SCALE_TYPE:
            return opt.scaleTypes;
        case property_1.Property.TIMEUNIT:
            return opt.timeUnits;
        case property_1.Property.TYPE:
            return opt.types;
    }
    /* istanbul ignore next */
    throw new Error('No default enumValues for ' + prop);
}
exports.getDefaultEnumValues = getDefaultEnumValues;
/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
var SpecQueryModel = (function () {
    function SpecQueryModel(spec, enumSpecIndex, schema, opt, enumSpecAssignment) {
        this._rankingScore = {};
        this._spec = spec;
        this._channelCount = spec.encodings.reduce(function (m, encQ) {
            if (!enumspec_1.isEnumSpec(encQ.channel) && encQ.autoCount !== false) {
                m[encQ.channel] = 1;
            }
            return m;
        }, {});
        this._enumSpecIndex = enumSpecIndex;
        this._enumSpecAssignment = enumSpecAssignment;
        this._opt = opt;
        this._schema = schema;
    }
    /**
     * Build an enumSpecIndex by detecting enumeration specifiers
     * in the input specQuery and replace short enum specs with
     * full ones that includes both names and enumValues.
     *
     * @return a SpecQueryModel that wraps the specQuery and the enumSpecIndex.
     */
    SpecQueryModel.build = function (specQ, schema, opt) {
        var enumSpecIndex = new enumspecindex_1.EnumSpecIndex();
        // mark
        if (enumspec_1.isEnumSpec(specQ.mark)) {
            var name_1 = getDefaultName(property_1.Property.MARK);
            specQ.mark = enumspec_1.initEnumSpec(specQ.mark, name_1, opt.marks);
            enumSpecIndex.setMark(specQ.mark);
        }
        // TODO: transform
        // encodings
        specQ.encodings.forEach(function (encQ, index) {
            if (encQ.autoCount !== undefined) {
                // This is only for testing purpose
                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
                encQ.type = type_1.Type.QUANTITATIVE; // autoCount is always quantitative
            }
            if (encQ.type === undefined) {
                // type is optional -- we automatically augment enum spec if not specified
                encQ.type = enumspec_1.SHORT_ENUM_SPEC;
            }
            // For each property of the encodingQuery, enumerate
            property_1.ENCODING_PROPERTIES.forEach(function (prop) {
                if (enumspec_1.isEnumSpec(encQ[prop])) {
                    // Assign default enum spec name and enum values.
                    var defaultEnumSpecName = getDefaultName(prop) + index;
                    var defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                    var enumSpec = encQ[prop] = enumspec_1.initEnumSpec(encQ[prop], defaultEnumSpecName, defaultEnumValues);
                    // Add index of the encoding mapping to the property's enum spec index.
                    enumSpecIndex.setEncodingProperty(index, prop, enumSpec);
                }
            });
            // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
            property_1.NESTED_ENCODING_PROPERTIES.forEach(function (nestedProp) {
                var propObj = encQ[nestedProp.parent]; // the property object e.g., encQ.bin
                if (propObj) {
                    var prop = nestedProp.property;
                    var child = nestedProp.child;
                    if (enumspec_1.isEnumSpec(propObj[child])) {
                        // Assign default enum spec name and enum values.
                        var defaultEnumSpecName = getDefaultName(prop) + index;
                        var defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                        var enumSpec = propObj[child] = enumspec_1.initEnumSpec(propObj[child], defaultEnumSpecName, defaultEnumValues);
                        // Add index of the encoding mapping to the property's enum spec index.
                        enumSpecIndex.setEncodingProperty(index, prop, enumSpec);
                    }
                }
            });
        });
        // AUTO COUNT
        // Add Auto Count Field
        if (opt.autoAddCount) {
            var countEncQ = {
                channel: {
                    name: getDefaultName(property_1.Property.CHANNEL) + specQ.encodings.length,
                    enum: getDefaultEnumValues(property_1.Property.CHANNEL, schema, opt)
                },
                autoCount: {
                    name: getDefaultName(property_1.Property.AUTOCOUNT) + specQ.encodings.length,
                    enum: [false, true]
                },
                type: type_1.Type.QUANTITATIVE
            };
            specQ.encodings.push(countEncQ);
            var index = specQ.encodings.length - 1;
            // Add index of the encoding mapping to the property's enum spec index.
            enumSpecIndex.setEncodingProperty(index, property_1.Property.CHANNEL, countEncQ.channel);
            enumSpecIndex.setEncodingProperty(index, property_1.Property.AUTOCOUNT, countEncQ.autoCount);
        }
        return new SpecQueryModel(specQ, enumSpecIndex, schema, opt, {});
    };
    Object.defineProperty(SpecQueryModel.prototype, "enumSpecIndex", {
        get: function () {
            return this._enumSpecIndex;
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
        return new SpecQueryModel(util_1.duplicate(this._spec), this._enumSpecIndex, this._schema, this._opt, util_1.duplicate(this._enumSpecAssignment));
    };
    SpecQueryModel.prototype.setMark = function (mark) {
        var name = this._spec.mark.name;
        this._enumSpecAssignment[name] = this._spec.mark = mark;
    };
    SpecQueryModel.prototype.resetMark = function () {
        var enumSpec = this._spec.mark = this._enumSpecIndex.mark;
        delete this._enumSpecAssignment[enumSpec.name];
    };
    SpecQueryModel.prototype.getMark = function () {
        return this._spec.mark;
    };
    SpecQueryModel.prototype.getEncodingProperty = function (index, prop) {
        var encQ = this._spec.encodings[index];
        var nestedProp = property_1.getNestedEncodingProperty(prop);
        if (nestedProp) {
            return encQ[nestedProp.parent][nestedProp.child];
        }
        return encQ[prop]; // encoding property (non-nested)
    };
    SpecQueryModel.prototype.setEncodingProperty = function (index, prop, value, enumSpec) {
        var encQ = this._spec.encodings[index];
        var nestedProp = property_1.getNestedEncodingProperty(prop);
        if (prop === property_1.Property.CHANNEL && encQ.channel && !enumspec_1.isEnumSpec(encQ.channel)) {
            // If there is an old channel
            this._channelCount[encQ.channel]--;
        }
        if (nestedProp) {
            encQ[nestedProp.parent][nestedProp.child] = value;
        }
        else if (property_1.hasNestedProperty(prop) && value === true) {
            encQ[prop] = util_1.extend({}, encQ[prop], // copy all existing properties
            { enum: undefined, name: undefined } // except name and values to it no longer an enumSpec
            );
        }
        else {
            encQ[prop] = value;
        }
        this._enumSpecAssignment[enumSpec.name] = value;
        if (prop === property_1.Property.CHANNEL) {
            // If there is a new channel, make sure it exists and add it to the count.
            this._channelCount[value] = (this._channelCount[value] || 0) + 1;
        }
    };
    SpecQueryModel.prototype.resetEncodingProperty = function (index, prop, enumSpec) {
        var encQ = this._spec.encodings[index];
        var nestedProp = property_1.getNestedEncodingProperty(prop);
        if (prop === property_1.Property.CHANNEL) {
            this._channelCount[encQ.channel]--;
        }
        // reset it to enumSpec
        if (nestedProp) {
            encQ[nestedProp.parent][nestedProp.child] = enumSpec;
        }
        else {
            encQ[prop] = enumSpec;
        }
        // add remove value that is reset from the assignment map
        delete this._enumSpecAssignment[enumSpec.name];
    };
    SpecQueryModel.prototype.channelUsed = function (channel) {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._channelCount[channel] > 0;
    };
    SpecQueryModel.prototype.stack = function () {
        return spec_1.stack(this._spec);
    };
    SpecQueryModel.prototype.getEncodings = function () {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._spec.encodings.filter(function (encQ) { return encQ.autoCount !== false; });
    };
    SpecQueryModel.prototype.getEncodingQueryByChannel = function (channel) {
        for (var i = 0; i < this._spec.encodings.length; i++) {
            if (this._spec.encodings[i].channel === channel) {
                return this._spec.encodings[i];
            }
        }
        return undefined;
    };
    SpecQueryModel.prototype.getEncodingQueryByIndex = function (i) {
        return this._spec.encodings[i];
    };
    SpecQueryModel.prototype.isDimension = function (channel) {
        var encQ = this.getEncodingQueryByChannel(channel);
        return encQ && encoding_1.isDimension(encQ);
    };
    SpecQueryModel.prototype.isMeasure = function (channel) {
        var encQ = this.getEncodingQueryByChannel(channel);
        return encQ && encoding_1.isMeasure(encQ);
    };
    SpecQueryModel.prototype.isAggregate = function () {
        return spec_1.isAggregate(this._spec);
    };
    SpecQueryModel.prototype.toShorthand = function (groupBy) {
        if (groupBy) {
            var include = {}, replace = {};
            groupby_1.parse(groupBy, include, replace);
            return shorthand_1.spec(this._spec, include, shorthand_1.getReplacerIndex(replace));
        }
        return shorthand_1.spec(this._spec);
    };
    SpecQueryModel.prototype._encoding = function () {
        var encoding = {};
        for (var i = 0; i < this._spec.encodings.length; i++) {
            var encQ = this._spec.encodings[i];
            var fieldDef = {};
            // For count field that is automatically added, convert to correct vega-lite fieldDef
            if (encQ.autoCount === true) {
                fieldDef.aggregate = aggregate_1.AggregateOp.COUNT;
                fieldDef.field = '*';
                fieldDef.type = type_1.Type.QUANTITATIVE;
            }
            else if (encQ.autoCount === false) {
                continue; // Do not include this in the output.
            }
            // if channel is an enum spec, return null
            if (enumspec_1.isEnumSpec(encQ.channel))
                return null;
            // assemble other property into a field def.
            var PROPERTIES = [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.FIELD, property_1.Property.TYPE, property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND];
            // TODO(#226):
            // write toSpec() and toShorthand() in a way that prevents outputting inapplicable scale, sort, axis / legend
            for (var j = 0; j < PROPERTIES.length; j++) {
                var prop = PROPERTIES[j];
                // if the property is an enum spec, return null
                if (enumspec_1.isEnumSpec(encQ[prop]))
                    return null;
                // otherwise, assign the proper to the field def
                if (encQ[prop] !== undefined) {
                    if (!shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop] ||
                        shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel]) {
                        fieldDef[prop] = encQ[prop];
                    }
                }
            }
            if (fieldDef.bin === false) {
                // exclude bin false
                delete fieldDef.bin;
            }
            encoding[encQ.channel] = fieldDef;
        }
        return encoding;
    };
    /**
     * Convert a query to a Vega-Lite spec if it is completed.
     * @return a Vega-Lite spec if completed, null otherwise.
     */
    SpecQueryModel.prototype.toSpec = function (data) {
        if (enumspec_1.isEnumSpec(this._spec.mark))
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
        spec.encoding = this._encoding();
        if (spec.encoding === null) {
            return null;
        }
        if (this._spec.config || this._opt.defaultSpecConfig)
            spec.config = util_1.extend({}, this._opt.defaultSpecConfig, this._spec.config);
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
var SpecQueryModelGroup = (function () {
    function SpecQueryModelGroup(name, path, items, groupBy, orderGroupBy) {
        if (name === void 0) { name = ''; }
        if (path === void 0) { path = ''; }
        if (items === void 0) { items = []; }
        if (groupBy === void 0) { groupBy = undefined; }
        if (orderGroupBy === void 0) { orderGroupBy = undefined; }
        this._name = name;
        this._path = path;
        this._items = items;
        this._groupBy = groupBy;
        this._orderGroupBy = orderGroupBy;
    }
    SpecQueryModelGroup.prototype.getTopSpecQueryModel = function () {
        var topItem = this._items[0];
        if (topItem instanceof SpecQueryModelGroup) {
            return topItem.getTopSpecQueryModel();
        }
        else {
            return topItem;
        }
    };
    Object.defineProperty(SpecQueryModelGroup.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "groupBy", {
        get: function () {
            return this._groupBy;
        },
        set: function (groupBy) {
            this._groupBy = groupBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "orderGroupBy", {
        get: function () {
            return this._orderGroupBy;
        },
        set: function (orderGroupBy) {
            this._orderGroupBy = orderGroupBy;
        },
        enumerable: true,
        configurable: true
    });
    return SpecQueryModelGroup;
}());
exports.SpecQueryModelGroup = SpecQueryModelGroup;

},{"./enumspec":16,"./enumspecindex":17,"./property":21,"./query/encoding":22,"./query/groupby":23,"./query/shorthand":25,"./query/spec":26,"./util":37,"vega-lite/src/aggregate":43,"vega-lite/src/type":54}],20:[function(require,module,exports){
"use strict";
var channel_1 = require('vega-lite/src/channel');
var util_1 = require('datalib/src/util');
var enumspec_1 = require('./enumspec');
var model_1 = require('./model');
var util_2 = require('./util');
var groupby_1 = require('./query/groupby');
var shorthand_1 = require('./query/shorthand');
var spec_1 = require('./query/spec');
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
exports.TRANSPOSE = 'transpose';
exports.SPEC = 'spec';
/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
function nest(specModels, query) {
    if (query.nest) {
        var rootGroup_1 = new model_1.SpecQueryModelGroup();
        var groupIndex_1 = {};
        // global `includes` and `replaces` will get augmented by each level's groupBy.
        // Upper level's `groupBy` will get cascaded to lower-level groupBy.
        // `replace` can be overriden in a lower-level to support different grouping.
        var includes_1 = [];
        var replaces = [];
        var replacers_1 = [];
        for (var l = 0; l < query.nest.length; l++) {
            includes_1.push(l > 0 ? util_2.duplicate(includes_1[l - 1]) : {});
            replaces.push(l > 0 ? util_2.duplicate(replaces[l - 1]) : {});
            var groupBy = query.nest[l].groupBy;
            if (util_1.isArray(groupBy)) {
                groupby_1.parse(groupBy, includes_1[l], replaces[l]);
                replacers_1.push(shorthand_1.getReplacerIndex(replaces[l]));
            }
        }
        // With includes and replacers, now we can construct the nesting tree
        specModels.forEach(function (specM) {
            var path = '';
            var group = rootGroup_1;
            for (var l = 0; l < query.nest.length; l++) {
                var groupBy = group.groupBy = query.nest[l].groupBy;
                group.orderGroupBy = query.nest[l].orderGroupBy;
                var key = util_1.isArray(groupBy) ?
                    shorthand_1.spec(specM.specQuery, includes_1[l], replacers_1[l]) :
                    groupRegistry[groupBy](specM);
                path += '/' + key;
                if (!groupIndex_1[path]) {
                    groupIndex_1[path] = new model_1.SpecQueryModelGroup(key, path, []);
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
        return new model_1.SpecQueryModelGroup('', '', specModels);
    }
}
exports.nest = nest;
registerKeyFn(exports.FIELD, function (specM) {
    return specM.getEncodings().map(function (encQ) { return encQ.field; })
        .filter(function (field) { return field && field !== '*'; })
        .sort()
        .join('|');
});
registerKeyFn(exports.FIELD_TRANSFORM, function (specM) {
    return specM.getEncodings().map(function (encQ) { return shorthand_1.fieldDef(encQ); })
        .sort()
        .join('|');
});
function channelType(channel) {
    if (enumspec_1.isEnumSpec(channel)) {
        return enumspec_1.SHORT_ENUM_SPEC + '';
    }
    var c = channel;
    switch (c) {
        case channel_1.Channel.X:
        case channel_1.Channel.Y:
            return 'xy';
        case channel_1.Channel.ROW:
        case channel_1.Channel.COLUMN:
            return 'facet';
        case channel_1.Channel.COLOR:
        case channel_1.Channel.SIZE:
        case channel_1.Channel.SHAPE:
        case channel_1.Channel.OPACITY:
            return 'non-xy';
        case channel_1.Channel.TEXT:
        case channel_1.Channel.DETAIL:
        case channel_1.Channel.PATH:
        case channel_1.Channel.ORDER:
            return c + '';
        /* istanbul ignore next */
        default:
            console.warn('channel type not implemented for ' + c);
            return c + '';
    }
}
function stringifyStack(specM) {
    var _stack = spec_1.stack(specM.specQuery);
    return (!!_stack ? 'stack=' + _stack.offset + '|' : '');
}
registerKeyFn(exports.ENCODING, function (specM) {
    // mark does not matter
    return stringifyStack(specM) +
        specM.getEncodings().map(function (encQ) {
            var fieldDef = shorthand_1.fieldDef(encQ);
            return channelType(encQ.channel) + ':' + fieldDef;
        })
            .sort()
            .join('|');
});
registerKeyFn(exports.TRANSPOSE, function (specM) {
    return specM.getMark() + '|' +
        stringifyStack(specM) +
        specM.getEncodings().map(function (encQ) {
            var fieldDef = shorthand_1.fieldDef(encQ);
            var channel = (encQ.channel === channel_1.Channel.X || encQ.channel === channel_1.Channel.Y) ? 'xy' :
                (encQ.channel === channel_1.Channel.ROW || encQ.channel === channel_1.Channel.COLUMN) ? 'facet' :
                    encQ.channel;
            return channel + ':' + fieldDef;
        })
            .sort()
            .join('|');
});
registerKeyFn(exports.SPEC, function (specM) { return JSON.stringify(specM.specQuery); });

},{"./enumspec":16,"./model":19,"./query/groupby":23,"./query/shorthand":25,"./query/spec":26,"./util":37,"datalib/src/util":8,"vega-lite/src/channel":46}],21:[function(require,module,exports){
"use strict";
var scale_1 = require('vega-lite/src/scale');
(function (Property) {
    Property[Property["MARK"] = 'mark'] = "MARK";
    Property[Property["FILTER"] = 'filter'] = "FILTER";
    // TODO: Sub-properties for filter
    Property[Property["CALCULATE"] = 'calculate'] = "CALCULATE";
    // TODO: Sub-properties for calculate
    Property[Property["FILTERINVALID"] = 'filterInvalid'] = "FILTERINVALID";
    // Layout
    Property[Property["STACK"] = 'stack'] = "STACK";
    // TODO: sub parts of stack
    // Encoding Properties
    Property[Property["CHANNEL"] = 'channel'] = "CHANNEL";
    Property[Property["AGGREGATE"] = 'aggregate'] = "AGGREGATE";
    Property[Property["AUTOCOUNT"] = 'autoCount'] = "AUTOCOUNT";
    Property[Property["BIN"] = 'bin'] = "BIN";
    Property[Property["BIN_MAXBINS"] = 'binMaxBins'] = "BIN_MAXBINS";
    Property[Property["HAS_FN"] = 'hasFn'] = "HAS_FN";
    Property[Property["TIMEUNIT"] = 'timeUnit'] = "TIMEUNIT";
    Property[Property["FIELD"] = 'field'] = "FIELD";
    Property[Property["TYPE"] = 'type'] = "TYPE";
    // - Sort
    Property[Property["SORT"] = 'sort'] = "SORT";
    Property[Property["SORT_FIELD"] = 'sortField'] = "SORT_FIELD";
    Property[Property["SORT_OP"] = 'sortOp'] = "SORT_OP";
    Property[Property["SORT_ORDER"] = 'sortOrder'] = "SORT_ORDER";
    // - Scale
    Property[Property["SCALE"] = 'scale'] = "SCALE";
    Property[Property["SCALE_BANDSIZE"] = 'scaleBandSize'] = "SCALE_BANDSIZE";
    Property[Property["SCALE_CLAMP"] = 'scaleClamp'] = "SCALE_CLAMP";
    Property[Property["SCALE_DOMAIN"] = 'scaleDomain'] = "SCALE_DOMAIN";
    Property[Property["SCALE_EXPONENT"] = 'scaleExponent'] = "SCALE_EXPONENT";
    Property[Property["SCALE_NICE"] = 'scaleNice'] = "SCALE_NICE";
    Property[Property["SCALE_RANGE"] = 'scaleRange'] = "SCALE_RANGE";
    Property[Property["SCALE_ROUND"] = 'scaleRound'] = "SCALE_ROUND";
    Property[Property["SCALE_TYPE"] = 'scaleType'] = "SCALE_TYPE";
    Property[Property["SCALE_USERAWDOMAIN"] = 'scaleUseRawDomain'] = "SCALE_USERAWDOMAIN";
    Property[Property["SCALE_ZERO"] = 'scaleZero'] = "SCALE_ZERO";
    // - Axis
    Property[Property["AXIS"] = 'axis'] = "AXIS";
    // General Axis Properties
    Property[Property["AXIS_AXISCOLOR"] = 'axisAxisColor'] = "AXIS_AXISCOLOR";
    Property[Property["AXIS_AXISWIDTH"] = 'axisAxisWidth'] = "AXIS_AXISWIDTH";
    Property[Property["AXIS_LAYER"] = 'axisLayer'] = "AXIS_LAYER";
    Property[Property["AXIS_OFFSET"] = 'axisOffset'] = "AXIS_OFFSET";
    Property[Property["AXIS_ORIENT"] = 'axisOrient'] = "AXIS_ORIENT";
    // Axis_Grid Properties
    Property[Property["AXIS_GRID"] = 'axisGrid'] = "AXIS_GRID";
    Property[Property["AXIS_GRIDCOLOR"] = 'axisGridColor'] = "AXIS_GRIDCOLOR";
    Property[Property["AXIS_GRIDDASH"] = 'axisGridDash'] = "AXIS_GRIDDASH";
    Property[Property["AXIS_GRIDOPACITY"] = 'axisGridOpacity'] = "AXIS_GRIDOPACITY";
    Property[Property["AXIS_GRIDWIDTH"] = 'axisGridWidth'] = "AXIS_GRIDWIDTH";
    // Axis Properties
    Property[Property["AXIS_LABELS"] = 'axisLabels'] = "AXIS_LABELS";
    Property[Property["AXIS_FORMAT"] = 'axisFormat'] = "AXIS_FORMAT";
    Property[Property["AXIS_LABELANGLE"] = 'axisLabelAngle'] = "AXIS_LABELANGLE";
    Property[Property["AXIS_LABELMAXLENGTH"] = 'axisLabelMaxLength'] = "AXIS_LABELMAXLENGTH";
    Property[Property["AXIS_SHORTTIMELABELS"] = 'axisShortTimeLabels'] = "AXIS_SHORTTIMELABELS";
    // Axis_Tick Properties
    Property[Property["AXIS_SUBDIVIDE"] = 'axisSubdivide'] = "AXIS_SUBDIVIDE";
    Property[Property["AXIS_TICKS"] = 'axisTicks'] = "AXIS_TICKS";
    Property[Property["AXIS_TICKCOLOR"] = 'axisTickColor'] = "AXIS_TICKCOLOR";
    Property[Property["AXIS_TICKLABELCOLOR"] = 'axisTickLabelColor'] = "AXIS_TICKLABELCOLOR";
    Property[Property["AXIS_TICKLABELFONT"] = 'axisTickLabelFont'] = "AXIS_TICKLABELFONT";
    Property[Property["AXIS_TICKLABELFONTSIZE"] = 'axisTickLabelFontSize'] = "AXIS_TICKLABELFONTSIZE";
    Property[Property["AXIS_TICKPADDING"] = 'axisTickPadding'] = "AXIS_TICKPADDING";
    Property[Property["AXIS_TICKSIZE"] = 'axisTickSize'] = "AXIS_TICKSIZE";
    Property[Property["AXIS_TICKSIZEMAJOR"] = 'axisTickSizeMajor'] = "AXIS_TICKSIZEMAJOR";
    Property[Property["AXIS_TICKSIZEMINOR"] = 'axisTickSizeMinor'] = "AXIS_TICKSIZEMINOR";
    Property[Property["AXIS_TICKSIZEEND"] = 'axisTickSizeEnd'] = "AXIS_TICKSIZEEND";
    Property[Property["AXIS_TICKWIDTH"] = 'axisTickWidth'] = "AXIS_TICKWIDTH";
    Property[Property["AXIS_VALUES"] = 'axisValues'] = "AXIS_VALUES";
    // Axis_Title Properties
    Property[Property["AXIS_TITLE"] = 'axisTitle'] = "AXIS_TITLE";
    Property[Property["AXIS_TITLECOLOR"] = 'axisTitleColor'] = "AXIS_TITLECOLOR";
    Property[Property["AXIS_TITLEFONT"] = 'axisTitleFont'] = "AXIS_TITLEFONT";
    Property[Property["AXIS_TITLEFONTSIZE"] = 'axisTitleFontSize'] = "AXIS_TITLEFONTSIZE";
    Property[Property["AXIS_TITLEFONTWEIGHT"] = 'axisTitleFontWeight'] = "AXIS_TITLEFONTWEIGHT";
    Property[Property["AXIS_TITLEOFFSET"] = 'axisTitleOffset'] = "AXIS_TITLEOFFSET";
    Property[Property["AXIS_TITLEMAXLENGTH"] = 'axisTitleMaxLength'] = "AXIS_TITLEMAXLENGTH";
    Property[Property["AXIS_CHARACTERWIDTH"] = 'axisCharacterWidth'] = "AXIS_CHARACTERWIDTH";
    // - Legend
    Property[Property["LEGEND"] = 'legend'] = "LEGEND";
    // General Legend Properties
    Property[Property["LEGEND_ORIENT"] = 'legendOrient'] = "LEGEND_ORIENT";
    Property[Property["LEGEND_OFFSET"] = 'legendOffset'] = "LEGEND_OFFSET";
    Property[Property["LEGEND_VALUES"] = 'legendValues'] = "LEGEND_VALUES";
    // Legend_Label Properties
    Property[Property["LEGEND_FORMAT"] = 'legendFormat'] = "LEGEND_FORMAT";
    Property[Property["LEGEND_LABELALIGN"] = 'legendLabelAlign'] = "LEGEND_LABELALIGN";
    Property[Property["LEGEND_LABELBASELINE"] = 'legendLabelBaseline'] = "LEGEND_LABELBASELINE";
    Property[Property["LEGEND_LABELCOLOR"] = 'legendLabelColor'] = "LEGEND_LABELCOLOR";
    Property[Property["LEGEND_LABELFONT"] = 'legendLabelFont'] = "LEGEND_LABELFONT";
    Property[Property["LEGEND_LABELFONTSIZE"] = 'legendLabelFontSize'] = "LEGEND_LABELFONTSIZE";
    Property[Property["LEGEND_SHORTTIMELABELS"] = 'legendShortTimeLabels'] = "LEGEND_SHORTTIMELABELS";
    // Legend_Symbol Properties
    Property[Property["LEGEND_SYMBOLCOLOR"] = 'legendSymbolColor'] = "LEGEND_SYMBOLCOLOR";
    Property[Property["LEGEND_SYMBOLSHAPE"] = 'legendSymbolShape'] = "LEGEND_SYMBOLSHAPE";
    Property[Property["LEGEND_SYMBOLSIZE"] = 'legendSymbolSize'] = "LEGEND_SYMBOLSIZE";
    Property[Property["LEGEND_SYMBOLSTROKEWIDTH"] = 'legendSymbolStrokeWidth'] = "LEGEND_SYMBOLSTROKEWIDTH";
    // Legend_Title Properties
    Property[Property["LEGEND_TITLE"] = 'legendTitle'] = "LEGEND_TITLE";
    Property[Property["LEGEND_TITLECOLOR"] = 'legendTitleColor'] = "LEGEND_TITLECOLOR";
    Property[Property["LEGEND_TITLEFONT"] = 'legendTitleFont'] = "LEGEND_TITLEFONT";
    Property[Property["LEGEND_TITLEFONTSIZE"] = 'legendTitleFontSize'] = "LEGEND_TITLEFONTSIZE";
    Property[Property["LEGEND_TITLEFONTWEIGHT"] = 'legendTitleFontWeight'] = "LEGEND_TITLEFONTWEIGHT";
})(exports.Property || (exports.Property = {}));
var Property = exports.Property;
function hasNestedProperty(prop) {
    switch (prop) {
        case Property.BIN:
        case Property.SCALE:
        case Property.SORT:
        case Property.AXIS:
        case Property.LEGEND:
            return true;
        case Property.MARK:
        case Property.FILTER:
        case Property.CALCULATE:
        case Property.FILTERINVALID:
        case Property.STACK:
        case Property.CHANNEL:
        case Property.AGGREGATE:
        case Property.AUTOCOUNT:
        case Property.TIMEUNIT:
        case Property.FIELD:
        case Property.TYPE:
        case Property.BIN_MAXBINS:
        case Property.SCALE_BANDSIZE:
        case Property.SCALE_CLAMP:
        case Property.SCALE_DOMAIN:
        case Property.SCALE_EXPONENT:
        case Property.SCALE_NICE:
        case Property.SCALE_RANGE:
        case Property.SCALE_ROUND:
        case Property.SCALE_TYPE:
        case Property.SCALE_USERAWDOMAIN:
        case Property.SCALE_ZERO:
        case Property.AXIS_AXISCOLOR:
        case Property.AXIS_AXISWIDTH:
        case Property.AXIS_LAYER:
        case Property.AXIS_OFFSET:
        case Property.AXIS_ORIENT:
        case Property.AXIS_GRID:
        case Property.AXIS_GRIDCOLOR:
        case Property.AXIS_GRIDDASH:
        case Property.AXIS_GRIDOPACITY:
        case Property.AXIS_GRIDWIDTH:
        case Property.AXIS_LABELS:
        case Property.AXIS_FORMAT:
        case Property.AXIS_LABELANGLE:
        case Property.AXIS_LABELMAXLENGTH:
        case Property.AXIS_SHORTTIMELABELS:
        case Property.AXIS_TICKS:
        case Property.AXIS_SUBDIVIDE:
        case Property.AXIS_TICKCOLOR:
        case Property.AXIS_TICKLABELCOLOR:
        case Property.AXIS_TICKLABELFONT:
        case Property.AXIS_TICKLABELFONTSIZE:
        case Property.AXIS_TICKPADDING:
        case Property.AXIS_TICKSIZE:
        case Property.AXIS_TICKSIZEMAJOR:
        case Property.AXIS_TICKSIZEMINOR:
        case Property.AXIS_TICKSIZEEND:
        case Property.AXIS_TICKWIDTH:
        case Property.AXIS_VALUES:
        case Property.AXIS_TITLE:
        case Property.AXIS_TITLECOLOR:
        case Property.AXIS_TITLEFONT:
        case Property.AXIS_TITLEFONTSIZE:
        case Property.AXIS_TITLEFONTWEIGHT:
        case Property.AXIS_CHARACTERWIDTH:
        case Property.AXIS_TITLEMAXLENGTH:
        case Property.AXIS_TITLEOFFSET:
        case Property.LEGEND_ORIENT:
        case Property.LEGEND_OFFSET:
        case Property.LEGEND_VALUES:
        case Property.LEGEND_FORMAT:
        case Property.LEGEND_LABELALIGN:
        case Property.LEGEND_LABELBASELINE:
        case Property.LEGEND_LABELCOLOR:
        case Property.LEGEND_LABELFONT:
        case Property.LEGEND_LABELFONTSIZE:
        case Property.LEGEND_SHORTTIMELABELS:
        case Property.LEGEND_SYMBOLCOLOR:
        case Property.LEGEND_SYMBOLSHAPE:
        case Property.LEGEND_SYMBOLSIZE:
        case Property.LEGEND_SYMBOLSTROKEWIDTH:
        case Property.LEGEND_TITLE:
        case Property.LEGEND_TITLECOLOR:
        case Property.LEGEND_TITLEFONT:
        case Property.LEGEND_TITLEFONTSIZE:
        case Property.LEGEND_TITLEFONTWEIGHT:
            return false;
    }
    /* istanbul ignore next */
    throw new Error('hasNestedProperty undefined for property ' + prop);
}
exports.hasNestedProperty = hasNestedProperty;
exports.ENCODING_PROPERTIES = [
    Property.CHANNEL,
    Property.BIN,
    Property.BIN_MAXBINS,
    Property.TIMEUNIT,
    Property.AGGREGATE,
    Property.AUTOCOUNT,
    Property.FIELD,
    Property.TYPE,
    Property.SORT,
    Property.SORT_FIELD,
    Property.SORT_OP,
    Property.SORT_ORDER,
    Property.SCALE,
    Property.SCALE_BANDSIZE,
    Property.SCALE_CLAMP,
    Property.SCALE_DOMAIN,
    Property.SCALE_EXPONENT,
    Property.SCALE_NICE,
    Property.SCALE_RANGE,
    Property.SCALE_ROUND,
    Property.SCALE_TYPE,
    Property.SCALE_USERAWDOMAIN,
    Property.SCALE_ZERO,
    Property.AXIS,
    Property.AXIS_AXISCOLOR,
    Property.AXIS_AXISWIDTH,
    Property.AXIS_CHARACTERWIDTH,
    Property.AXIS_FORMAT,
    Property.AXIS_GRID,
    Property.AXIS_GRIDCOLOR,
    Property.AXIS_GRIDDASH,
    Property.AXIS_GRIDOPACITY,
    Property.AXIS_GRIDWIDTH,
    Property.AXIS_LABELANGLE,
    Property.AXIS_LABELMAXLENGTH,
    Property.AXIS_LABELS,
    Property.AXIS_LAYER,
    Property.AXIS_OFFSET,
    Property.AXIS_ORIENT,
    Property.AXIS_SHORTTIMELABELS,
    Property.AXIS_SUBDIVIDE,
    Property.AXIS_TICKCOLOR,
    Property.AXIS_TICKLABELCOLOR,
    Property.AXIS_TICKLABELFONT,
    Property.AXIS_TICKLABELFONTSIZE,
    Property.AXIS_TICKPADDING,
    Property.AXIS_TICKS,
    Property.AXIS_TICKSIZE,
    Property.AXIS_TICKSIZEEND,
    Property.AXIS_TICKSIZEMAJOR,
    Property.AXIS_TICKSIZEMINOR,
    Property.AXIS_TICKWIDTH,
    Property.AXIS_TITLE,
    Property.AXIS_TITLECOLOR,
    Property.AXIS_TITLEFONT,
    Property.AXIS_TITLEFONTSIZE,
    Property.AXIS_TITLEFONTWEIGHT,
    Property.AXIS_TITLEMAXLENGTH,
    Property.AXIS_TITLEOFFSET,
    Property.AXIS_VALUES,
    Property.LEGEND,
    Property.LEGEND_ORIENT,
    Property.LEGEND_OFFSET,
    Property.LEGEND_VALUES,
    Property.LEGEND_FORMAT,
    Property.LEGEND_LABELALIGN,
    Property.LEGEND_LABELBASELINE,
    Property.LEGEND_LABELCOLOR,
    Property.LEGEND_LABELFONT,
    Property.LEGEND_LABELFONTSIZE,
    Property.LEGEND_SHORTTIMELABELS,
    Property.LEGEND_SYMBOLCOLOR,
    Property.LEGEND_SYMBOLSHAPE,
    Property.LEGEND_SYMBOLSIZE,
    Property.LEGEND_SYMBOLSTROKEWIDTH,
    Property.LEGEND_TITLE,
    Property.LEGEND_TITLECOLOR,
    Property.LEGEND_TITLEFONT,
    Property.LEGEND_TITLEFONTSIZE,
    Property.LEGEND_TITLEFONTWEIGHT
];
exports.DEFAULT_PROPERTY_PRECEDENCE = [
    // Projection
    Property.TYPE,
    Property.FIELD,
    // TODO: Add stack and remove it from INCLUDE_ALL in shorthand
    // TODO: Add filter and remove it from INCLUDE_ALL in shorthand
    // TODO: Add calculate and remove it from INCLUDE_ALL in shorthand
    // TODO: Add filterInvalid and remove it from INCLUDE_ALL in shorthand
    // Field Transform
    Property.BIN,
    Property.TIMEUNIT,
    Property.AGGREGATE,
    Property.AUTOCOUNT,
    Property.SORT,
    Property.SORT_FIELD,
    Property.SORT_OP,
    Property.SORT_ORDER,
    // Nested Transform Property
    Property.BIN_MAXBINS,
    // Encoding
    Property.CHANNEL,
    Property.MARK,
    Property.SCALE,
    Property.AXIS,
    Property.LEGEND,
    // Nested Encoding Property
    // - Scale
    Property.SCALE_BANDSIZE,
    Property.SCALE_CLAMP,
    Property.SCALE_DOMAIN,
    Property.SCALE_EXPONENT,
    Property.SCALE_NICE,
    Property.SCALE_RANGE,
    Property.SCALE_ROUND,
    Property.SCALE_TYPE,
    Property.SCALE_USERAWDOMAIN,
    Property.SCALE_ZERO,
    // - Axis
    Property.AXIS_AXISCOLOR,
    Property.AXIS_AXISWIDTH,
    Property.AXIS_CHARACTERWIDTH,
    Property.AXIS_FORMAT,
    Property.AXIS_GRID,
    Property.AXIS_GRIDCOLOR,
    Property.AXIS_GRIDDASH,
    Property.AXIS_GRIDOPACITY,
    Property.AXIS_GRIDWIDTH,
    Property.AXIS_LABELANGLE,
    Property.AXIS_LABELMAXLENGTH,
    Property.AXIS_LABELS,
    Property.AXIS_LAYER,
    Property.AXIS_OFFSET,
    Property.AXIS_ORIENT,
    Property.AXIS_SHORTTIMELABELS,
    Property.AXIS_SUBDIVIDE,
    Property.AXIS_TICKCOLOR,
    Property.AXIS_TICKLABELCOLOR,
    Property.AXIS_TICKLABELFONT,
    Property.AXIS_TICKLABELFONTSIZE,
    Property.AXIS_TICKPADDING,
    Property.AXIS_TICKS,
    Property.AXIS_TICKSIZE,
    Property.AXIS_TICKSIZEEND,
    Property.AXIS_TICKSIZEMAJOR,
    Property.AXIS_TICKSIZEMINOR,
    Property.AXIS_TICKWIDTH,
    Property.AXIS_TITLE,
    Property.AXIS_TITLECOLOR,
    Property.AXIS_TITLEFONT,
    Property.AXIS_TITLEFONTSIZE,
    Property.AXIS_TITLEFONTWEIGHT,
    Property.AXIS_TITLEMAXLENGTH,
    Property.AXIS_TITLEOFFSET,
    Property.AXIS_VALUES,
    // - Legend
    Property.LEGEND_ORIENT,
    Property.LEGEND_OFFSET,
    Property.LEGEND_VALUES,
    Property.LEGEND_FORMAT,
    Property.LEGEND_LABELALIGN,
    Property.LEGEND_LABELBASELINE,
    Property.LEGEND_LABELCOLOR,
    Property.LEGEND_LABELFONT,
    Property.LEGEND_LABELFONTSIZE,
    Property.LEGEND_SHORTTIMELABELS,
    Property.LEGEND_SYMBOLCOLOR,
    Property.LEGEND_SYMBOLSHAPE,
    Property.LEGEND_SYMBOLSIZE,
    Property.LEGEND_SYMBOLSTROKEWIDTH,
    Property.LEGEND_TITLE,
    Property.LEGEND_TITLECOLOR,
    Property.LEGEND_TITLEFONT,
    Property.LEGEND_TITLEFONTSIZE,
    Property.LEGEND_TITLEFONTWEIGHT
];
exports.NESTED_ENCODING_PROPERTIES = [
    {
        property: Property.BIN_MAXBINS,
        parent: 'bin',
        child: 'maxbins'
    },
    {
        property: Property.SORT_FIELD,
        parent: 'sort',
        child: 'field'
    },
    {
        property: Property.SORT_OP,
        parent: 'sort',
        child: 'op'
    },
    {
        property: Property.SORT_ORDER,
        parent: 'sort',
        child: 'order'
    },
    {
        property: Property.SCALE_BANDSIZE,
        parent: 'scale',
        child: 'bandSize'
    },
    {
        property: Property.SCALE_CLAMP,
        parent: 'scale',
        child: 'clamp'
    },
    {
        property: Property.SCALE_DOMAIN,
        parent: 'scale',
        child: 'domain'
    },
    {
        property: Property.SCALE_EXPONENT,
        parent: 'scale',
        child: 'exponent'
    },
    {
        property: Property.SCALE_NICE,
        parent: 'scale',
        child: 'nice'
    },
    {
        property: Property.SCALE_RANGE,
        parent: 'scale',
        child: 'range'
    },
    {
        property: Property.SCALE_ROUND,
        parent: 'scale',
        child: 'round'
    },
    {
        property: Property.SCALE_TYPE,
        parent: 'scale',
        child: 'type'
    },
    {
        property: Property.SCALE_USERAWDOMAIN,
        parent: 'scale',
        child: 'useRawDomain'
    },
    {
        property: Property.SCALE_ZERO,
        parent: 'scale',
        child: 'zero'
    },
    {
        property: Property.AXIS_AXISCOLOR,
        parent: 'axis',
        child: 'axisColor'
    },
    {
        property: Property.AXIS_AXISWIDTH,
        parent: 'axis',
        child: 'axisWidth'
    },
    {
        property: Property.AXIS_LAYER,
        parent: 'axis',
        child: 'layer'
    },
    {
        property: Property.AXIS_OFFSET,
        parent: 'axis',
        child: 'offset'
    },
    {
        property: Property.AXIS_ORIENT,
        parent: 'axis',
        child: 'orient'
    },
    {
        property: Property.AXIS_GRID,
        parent: 'axis',
        child: 'grid'
    },
    {
        property: Property.AXIS_GRIDCOLOR,
        parent: 'axis',
        child: 'gridColor'
    },
    {
        property: Property.AXIS_GRIDDASH,
        parent: 'axis',
        child: 'gridDash'
    },
    {
        property: Property.AXIS_GRIDOPACITY,
        parent: 'axis',
        child: 'gridOpacity'
    },
    {
        property: Property.AXIS_GRIDWIDTH,
        parent: 'axis',
        child: 'gridWidth'
    },
    {
        property: Property.AXIS_LABELS,
        parent: 'axis',
        child: 'labels'
    },
    {
        property: Property.AXIS_FORMAT,
        parent: 'axis',
        child: 'format'
    },
    {
        property: Property.AXIS_LABELANGLE,
        parent: 'axis',
        child: 'labelAngle'
    },
    {
        property: Property.AXIS_LABELMAXLENGTH,
        parent: 'axis',
        child: 'labelMaxLength'
    },
    {
        property: Property.AXIS_SHORTTIMELABELS,
        parent: 'axis',
        child: 'shortTimeLabels'
    },
    {
        property: Property.AXIS_TICKS,
        parent: 'axis',
        child: 'ticks'
    },
    {
        property: Property.AXIS_SUBDIVIDE,
        parent: 'axis',
        child: 'subdivide'
    },
    {
        property: Property.AXIS_TICKCOLOR,
        parent: 'axis',
        child: 'tickColor'
    },
    {
        property: Property.AXIS_TICKLABELCOLOR,
        parent: 'axis',
        child: 'tickLabelColor'
    },
    {
        property: Property.AXIS_TICKLABELFONT,
        parent: 'axis',
        child: 'tickLabelFont'
    },
    {
        property: Property.AXIS_TICKLABELFONTSIZE,
        parent: 'axis',
        child: 'tickLabelFontSize'
    },
    {
        property: Property.AXIS_TICKPADDING,
        parent: 'axis',
        child: 'tickPadding'
    },
    {
        property: Property.AXIS_TICKSIZE,
        parent: 'axis',
        child: 'tickSize'
    },
    {
        property: Property.AXIS_TICKSIZEMAJOR,
        parent: 'axis',
        child: 'tickSizeMajor'
    },
    {
        property: Property.AXIS_TICKSIZEMINOR,
        parent: 'axis',
        child: 'tickSizeMinor'
    },
    {
        property: Property.AXIS_TICKSIZEEND,
        parent: 'axis',
        child: 'tickSizeEnd'
    },
    {
        property: Property.AXIS_TICKWIDTH,
        parent: 'axis',
        child: 'tickWidth'
    },
    {
        property: Property.AXIS_VALUES,
        parent: 'axis',
        child: 'values'
    },
    {
        property: Property.AXIS_TITLE,
        parent: 'axis',
        child: 'title'
    },
    {
        property: Property.AXIS_TITLECOLOR,
        parent: 'axis',
        child: 'titleColor'
    },
    {
        property: Property.AXIS_TITLEFONT,
        parent: 'axis',
        child: 'titleFont'
    },
    {
        property: Property.AXIS_TITLEFONTSIZE,
        parent: 'axis',
        child: 'titleFontSize'
    },
    {
        property: Property.AXIS_TITLEFONTWEIGHT,
        parent: 'axis',
        child: 'titleFontWeight'
    },
    {
        property: Property.AXIS_CHARACTERWIDTH,
        parent: 'axis',
        child: 'characterWidth'
    },
    {
        property: Property.AXIS_TITLEMAXLENGTH,
        parent: 'axis',
        child: 'titleMaxLength'
    },
    {
        property: Property.AXIS_TITLEOFFSET,
        parent: 'axis',
        child: 'titleOffset'
    },
    {
        property: Property.LEGEND_ORIENT,
        parent: 'legend',
        child: 'orient'
    },
    {
        property: Property.LEGEND_OFFSET,
        parent: 'legend',
        child: 'offset',
    },
    {
        property: Property.LEGEND_VALUES,
        parent: 'legend',
        child: 'values'
    },
    {
        property: Property.LEGEND_FORMAT,
        parent: 'legend',
        child: 'format'
    },
    {
        property: Property.LEGEND_LABELALIGN,
        parent: 'legend',
        child: 'labelAlign'
    },
    {
        property: Property.LEGEND_LABELBASELINE,
        parent: 'legend',
        child: 'labelBaseline'
    },
    {
        property: Property.LEGEND_LABELFONT,
        parent: 'legend',
        child: 'labelFont'
    },
    {
        property: Property.LEGEND_LABELFONTSIZE,
        parent: 'legend',
        child: 'labelFontSize'
    },
    {
        property: Property.LEGEND_SHORTTIMELABELS,
        parent: 'legend',
        child: 'shortTimeLabels'
    },
    {
        property: Property.LEGEND_SYMBOLCOLOR,
        parent: 'legend',
        child: 'symbolColor'
    },
    {
        property: Property.LEGEND_SYMBOLSHAPE,
        parent: 'legend',
        child: 'symbolShape'
    },
    {
        property: Property.LEGEND_SYMBOLSIZE,
        parent: 'legend',
        child: 'symbolSize'
    },
    {
        property: Property.LEGEND_SYMBOLSTROKEWIDTH,
        parent: 'legend',
        child: 'symbolStrokeWidth'
    },
    {
        property: Property.LEGEND_TITLE,
        parent: 'legend',
        child: 'title'
    },
    {
        property: Property.LEGEND_TITLECOLOR,
        parent: 'legend',
        child: 'titleColor'
    },
    {
        property: Property.LEGEND_TITLEFONT,
        parent: 'legend',
        child: 'titleFont'
    },
    {
        property: Property.LEGEND_TITLEFONTSIZE,
        parent: 'legend',
        child: 'titleFontSize'
    },
    {
        property: Property.LEGEND_TITLEFONTWEIGHT,
        parent: 'legend',
        child: 'titleFontWeight'
    }
];
var NESTED_ENCODING_INDEX = exports.NESTED_ENCODING_PROPERTIES.reduce(function (m, nestedProp) {
    m[nestedProp.property] = nestedProp;
    return m;
}, {});
var NESTED_ENCODING_PROPERTY_PARENT_INDEX = exports.NESTED_ENCODING_PROPERTIES.reduce(function (m, nestedProp) {
    var parent = nestedProp.parent;
    // if the parent does not exist in m yet, add it as a key in m with empty [] as value
    if (!(parent in m)) {
        m[parent] = [];
    }
    m[nestedProp.parent].push(nestedProp);
    return m;
}, {}); // as Dict<Array<String>>);
exports.SCALE_PROPERTIES = NESTED_ENCODING_PROPERTY_PARENT_INDEX['scale'].map(function (nestedProp) {
    return nestedProp.property;
});
var ENCODING_INDEX = exports.ENCODING_PROPERTIES.reduce(function (m, prop) {
    m[prop] = prop;
    return m;
}, {});
function isEncodingProperty(prop) {
    return ENCODING_INDEX[prop] !== undefined;
}
exports.isEncodingProperty = isEncodingProperty;
function getNestedEncodingProperty(prop) {
    return NESTED_ENCODING_INDEX[prop];
}
exports.getNestedEncodingProperty = getNestedEncodingProperty;
function getNestedEncodingPropertyChildren(parent) {
    return NESTED_ENCODING_PROPERTY_PARENT_INDEX[parent];
}
exports.getNestedEncodingPropertyChildren = getNestedEncodingPropertyChildren;
function isNestedEncodingProperty(prop) {
    return prop in NESTED_ENCODING_INDEX;
}
exports.isNestedEncodingProperty = isNestedEncodingProperty;
var SUPPORTED_SCALE_PROPERTY = [
    {
        property: 'bandSize',
        supportedScaleType: [
            scale_1.ScaleType.ORDINAL
        ]
    },
    {
        property: 'clamp',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'domain',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.QUANTILE,
            scale_1.ScaleType.QUANTIZE,
            scale_1.ScaleType.ORDINAL,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'exponent',
        supportedScaleType: [
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.SQRT
        ]
    },
    {
        property: 'nice',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'range',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.QUANTILE,
            scale_1.ScaleType.QUANTIZE,
            scale_1.ScaleType.ORDINAL,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'round',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'useRawDomain',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.QUANTILE,
            scale_1.ScaleType.QUANTIZE,
            scale_1.ScaleType.ORDINAL,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'zero',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.SQRT
        ]
    }
];
exports.SUPPORTED_SCALE_PROPERTY_INDEX = SUPPORTED_SCALE_PROPERTY.reduce(function (m, scaleProp) {
    var prop = scaleProp.property;
    m[prop] = scaleProp.supportedScaleType;
    return m;
}, {});

},{"vega-lite/src/scale":50}],22:[function(require,module,exports){
"use strict";
var scale_1 = require('vega-lite/src/scale');
var timeunit_1 = require('vega-lite/src/timeunit');
var type_1 = require('vega-lite/src/type');
var enumspec_1 = require('../enumspec');
var util_1 = require('../util');
function isDimension(encQ) {
    return util_1.contains([type_1.Type.NOMINAL, type_1.Type.ORDINAL], encQ.type) ||
        (!enumspec_1.isEnumSpec(encQ.bin) && !!encQ.bin) ||
        (!enumspec_1.isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit); // surely T type
}
exports.isDimension = isDimension;
function isMeasure(encQ) {
    return (encQ.type === type_1.Type.QUANTITATIVE && !encQ.bin) ||
        (encQ.type === type_1.Type.TEMPORAL && !encQ.timeUnit);
}
exports.isMeasure = isMeasure;
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is an EnumSpec, there is no clear scale type
 */
function scaleType(encQ) {
    var scale = encQ.scale === true || encQ.scale === enumspec_1.SHORT_ENUM_SPEC ? {} : encQ.scale;
    var type = encQ.type;
    var timeUnit = encQ.timeUnit;
    if (scale && scale.type !== undefined) {
        return scale.type;
    }
    if (enumspec_1.isEnumSpec(type)) {
        return undefined;
    }
    /* istanbul ignore else */
    if (type === type_1.Type.QUANTITATIVE) {
        return scale_1.ScaleType.LINEAR;
    }
    else if (type === type_1.Type.ORDINAL || type === type_1.Type.NOMINAL) {
        return scale_1.ScaleType.ORDINAL;
    }
    else if (type === type_1.Type.TEMPORAL) {
        if (timeUnit !== undefined) {
            if (enumspec_1.isEnumSpec(timeUnit)) {
                return undefined;
            }
            return timeunit_1.defaultScaleType(timeUnit);
        }
        else {
            return scale_1.ScaleType.TIME;
        }
    }
    else {
        throw new Error('Unsupported type: ' + type + ' in scaleType');
    }
}
exports.scaleType = scaleType;

},{"../enumspec":16,"../util":37,"vega-lite/src/scale":50,"vega-lite/src/timeunit":53,"vega-lite/src/type":54}],23:[function(require,module,exports){
"use strict";
var util_1 = require('datalib/src/util');
var util_2 = require('../util');
exports.REPLACE_BLANK_FIELDS = { '*': '' };
exports.REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
exports.REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
exports.REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
function isExtendedGroupBy(g) {
    return util_1.isObject(g) && !!g['property'];
}
exports.isExtendedGroupBy = isExtendedGroupBy;
function parse(groupBy, include, replaceIndex) {
    groupBy.forEach(function (grpBy) {
        if (isExtendedGroupBy(grpBy)) {
            include[grpBy.property] = true;
            replaceIndex[grpBy.property] = grpBy.replace;
        }
        else {
            include[grpBy] = true;
        }
    });
}
exports.parse = parse;
function toString(groupBy) {
    if (util_1.isArray(groupBy)) {
        return groupBy.map(function (g) {
            if (isExtendedGroupBy(g)) {
                if (g.replace) {
                    var replaceIndex = util_2.keys(g.replace).reduce(function (index, valFrom) {
                        var valTo = g.replace[valFrom];
                        (index[valTo] = index[valTo] || []).push(valFrom);
                        return index;
                    }, {});
                    return g.property + '[' + util_2.keys(replaceIndex).map(function (valTo) {
                        var valsFrom = replaceIndex[valTo].sort();
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

},{"../util":37,"datalib/src/util":8}],24:[function(require,module,exports){
"use strict";
var config_1 = require('../config');
var generate_1 = require('../generate');
var nest_1 = require('../nest');
var ranking_1 = require('../ranking/ranking');
var util_1 = require('../util');
exports.encoding = require('./encoding');
exports.groupBy = require('./groupby');
exports.shorthand = require('./shorthand');
exports.spec = require('./spec');
exports.transform = require('./transform');
function query(q, schema, config) {
    // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
    //    and merge config with the following precedence
    //    query.config > config > DEFAULT_QUERY_CONFIG
    q = util_1.extend({}, normalize(q), {
        config: util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, config, q.config)
    });
    // 2. Generate
    var answerSet = generate_1.generate(q.spec, schema, q.config);
    var nestedAnswerSet = nest_1.nest(answerSet, q);
    var result = ranking_1.rank(nestedAnswerSet, q, schema, 0);
    return {
        query: q,
        result: result
    };
}
exports.query = query;
/**
 * Normalize the non-nested version of the query to a standardize nested
 */
function normalize(q) {
    if (q.groupBy) {
        var nest_2 = {
            groupBy: q.groupBy
        };
        if (q.orderBy) {
            nest_2.orderGroupBy = q.orderBy;
        }
        var normalizedQ = {
            spec: util_1.duplicate(q.spec),
            nest: [nest_2],
        };
        if (q.chooseBy) {
            normalizedQ.chooseBy = q.chooseBy;
        }
        if (q.config) {
            normalizedQ.config = q.config;
        }
        return normalizedQ;
    }
    return util_1.duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
}
exports.normalize = normalize;

},{"../config":9,"../generate":18,"../nest":20,"../ranking/ranking":34,"../util":37,"./encoding":22,"./groupby":23,"./shorthand":25,"./spec":26,"./transform":27}],25:[function(require,module,exports){
"use strict";
var type_1 = require('vega-lite/src/type');
var util_1 = require('datalib/src/util');
var spec_1 = require('./spec');
var enumspec_1 = require('../enumspec');
var property_1 = require('../property');
var util_2 = require('../util');
function getReplacerIndex(replaceIndex) {
    return util_2.keys(replaceIndex).reduce(function (fnIndex, prop) {
        fnIndex[prop] = getReplacer(replaceIndex[prop]);
        return fnIndex;
    }, {});
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
    if (enumspec_1.isEnumSpec(v)) {
        // Return the enum array if it's a full enum spec, or just return SHORT_ENUM_SPEC for short ones.
        if (v.enum) {
            return enumspec_1.SHORT_ENUM_SPEC + JSON.stringify(v.enum);
        }
        else {
            return enumspec_1.SHORT_ENUM_SPEC;
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
exports.INCLUDE_ALL = 
// TODO: remove manual STACK, FILTER, CALCULATE concat once we really support enumerating it.
property_1.DEFAULT_PROPERTY_PRECEDENCE.concat([property_1.Property.CALCULATE, property_1.Property.FILTER, property_1.Property.FILTERINVALID, property_1.Property.STACK])
    .reduce(function (m, prop) {
    m[prop] = true;
    return m;
}, {});
function vlSpec(vlspec, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = {}; }
    var specQ = spec_1.fromSpec(vlspec);
    return spec(specQ);
}
exports.vlSpec = vlSpec;
exports.PROPERTY_SUPPORTED_CHANNELS = {
    axis: { x: true, y: true, row: true, column: true },
    legend: { color: true, opacity: true, size: true, shape: true },
    scale: { x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true },
    sort: { x: true, y: true, path: true, order: true }
};
/**
 * Returns a shorthand for a spec query
 * @param specQ a spec query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function spec(specQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = {}; }
    var parts = [];
    if (include[property_1.Property.MARK]) {
        parts.push(value(specQ.mark, replace[property_1.Property.MARK]));
    }
    if (specQ.transform) {
        if (include[property_1.Property.CALCULATE]) {
            if (specQ.transform.calculate !== undefined) {
                parts.push('calculate:' + calculate(specQ.transform.calculate));
            }
        }
        if (include[property_1.Property.FILTER]) {
            if (specQ.transform.filter !== undefined) {
                parts.push('filter:' + JSON.stringify(specQ.transform.filter));
            }
        }
        if (include[property_1.Property.FILTERINVALID]) {
            if (specQ.transform.filterInvalid !== undefined) {
                parts.push('filterInvalid:' + specQ.transform.filterInvalid);
            }
        }
    }
    // TODO: extract this to its own stack method
    if (include[property_1.Property.STACK]) {
        var _stack = spec_1.stack(specQ);
        if (_stack) {
            // TODO: Refactor this once we have child stack property.
            // Exclude type since we don't care about type in stack
            var includeExceptType = util_2.extend({}, include, { type: false });
            var field = fieldDef(_stack.fieldEncQ, includeExceptType, replace);
            var groupby = fieldDef(_stack.groupByEncQ, includeExceptType, replace);
            parts.push('stack={field:' + field + ',' +
                (groupby ? 'by:' + groupby + ',' : '') +
                'offset:' + _stack.offset + '}');
        }
    }
    parts.push(specQ.encodings.reduce(function (encQs, encQ) {
        // Exclude encoding mapping with autoCount=false as they are basically disabled.
        if (encQ.autoCount !== false) {
            var str = encoding(encQ, include, replace);
            if (str) {
                encQs.push(str);
            }
        }
        return encQs;
    }, [])
        .sort() // sort at the end to ignore order
        .join('|'));
    return parts.join('|');
}
exports.spec = spec;
function calculate(formulaArr) {
    return formulaArr.map(function (calculateItem) {
        return "{" + calculateItem.field + ":" + calculateItem.expr + "}";
    }).join(',');
}
exports.calculate = calculate;
/**
 * Returns a shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function encoding(encQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = {}; }
    var parts = [];
    if (include[property_1.Property.CHANNEL]) {
        parts.push(value(encQ.channel, replace[property_1.Property.CHANNEL]));
    }
    var fieldDefStr = fieldDef(encQ, include, replace);
    if (fieldDefStr) {
        parts.push(fieldDefStr);
    }
    return parts.join(':');
}
exports.encoding = encoding;
/**
 * Returns a field definiton shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function fieldDef(encQ, include, replacer) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replacer === void 0) { replacer = {}; }
    var fn = null, fnEnumIndex = null;
    /** Encoding properties e.g., Scale, Axis, Legend */
    var props = [];
    if (include[property_1.Property.AGGREGATE] && encQ.autoCount === false) {
        return '-';
    }
    else if (include[property_1.Property.AGGREGATE] && encQ.aggregate && !enumspec_1.isEnumSpec(encQ.aggregate)) {
        fn = replace(encQ.aggregate, replacer[property_1.Property.AGGREGATE]);
    }
    else if (include[property_1.Property.AGGREGATE] && encQ.autoCount && !enumspec_1.isEnumSpec(encQ.autoCount)) {
        fn = replace('count', replacer[property_1.Property.AGGREGATE]);
        ;
    }
    else if (include[property_1.Property.TIMEUNIT] && encQ.timeUnit && !enumspec_1.isEnumSpec(encQ.timeUnit)) {
        fn = replace(encQ.timeUnit, replacer[property_1.Property.TIMEUNIT]);
    }
    else if (include[property_1.Property.BIN] && encQ.bin && !enumspec_1.isEnumSpec(encQ.bin)) {
        fn = 'bin';
        // TODO(https://github.com/uwdata/compassql/issues/97):
        // extract this as a method that support other bin properties
        if (include[property_1.Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
            props.push({
                key: 'maxbins',
                value: value(encQ.bin['maxbins'], replacer[property_1.Property.BIN_MAXBINS])
            });
        }
    }
    else {
        for (var _i = 0, _a = [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN]; _i < _a.length; _i++) {
            var prop = _a[_i];
            if (include[prop] && encQ[prop] && enumspec_1.isEnumSpec(encQ[prop])) {
                fn = enumspec_1.SHORT_ENUM_SPEC + '';
                // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_ENUM_SPEC
                fnEnumIndex = fnEnumIndex || {};
                fnEnumIndex[prop] = encQ[prop].enum || encQ[prop];
                if (prop === property_1.Property.BIN) {
                    // TODO(https://github.com/uwdata/compassql/issues/97):
                    // extract this as a method that support other bin properties
                    if (include[property_1.Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
                        props.push({
                            key: 'maxbins',
                            value: value(encQ.bin['maxbins'], replacer[property_1.Property.BIN_MAXBINS])
                        });
                    }
                }
            }
        }
        if (fnEnumIndex && encQ.hasFn) {
            fnEnumIndex.hasFn = true;
        }
    }
    var _loop_1 = function(nestedPropParent) {
        if (!enumspec_1.isEnumSpec(encQ.channel) && !exports.PROPERTY_SUPPORTED_CHANNELS[nestedPropParent][encQ.channel]) {
            return "continue";
        }
        if (include[nestedPropParent]) {
            if (encQ[nestedPropParent] && !enumspec_1.isEnumSpec(encQ[nestedPropParent])) {
                // `sort` can be a string (ascending/descending).
                if (util_1.isString(encQ[nestedPropParent])) {
                    props.push({
                        key: nestedPropParent + '',
                        value: JSON.stringify(encQ[nestedPropParent])
                    });
                }
                else {
                    var nestedProps = property_1.getNestedEncodingPropertyChildren(nestedPropParent);
                    var nestedPropChildren = nestedProps.reduce(function (p, nestedProp) {
                        if (include[nestedProp.property] && encQ[nestedPropParent][nestedProp.child] !== undefined) {
                            p[nestedProp.child] = replace(encQ[nestedPropParent][nestedProp.child], replacer[nestedProp.property]);
                        }
                        return p;
                    }, {});
                    if (util_2.keys(nestedPropChildren).length > 0) {
                        props.push({
                            key: nestedPropParent + '',
                            value: JSON.stringify(nestedPropChildren)
                        });
                    }
                }
            }
            else if (encQ[nestedPropParent] === false || encQ[nestedPropParent] === null) {
                // `scale`, `axis`, `legend` can be false/null.
                props.push({
                    key: nestedPropParent + '',
                    value: false
                });
            }
        }
    };
    for (var _b = 0, _c = [property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND]; _b < _c.length; _b++) {
        var nestedPropParent = _c[_b];
        var state_1 = _loop_1(nestedPropParent);
        if (state_1 === "continue") continue;
    }
    // field
    var fieldAndParams = include[property_1.Property.FIELD] ? value(encQ.field || '*', replacer[property_1.Property.FIELD]) : '...';
    // type
    if (include[property_1.Property.TYPE]) {
        if (enumspec_1.isEnumSpec(encQ.type)) {
            fieldAndParams += ',' + value(encQ.type, replacer[property_1.Property.TYPE]);
        }
        else {
            var typeShort = ((encQ.type || type_1.Type.QUANTITATIVE) + '').substr(0, 1);
            fieldAndParams += ',' + value(typeShort, replacer[property_1.Property.TYPE]);
        }
    }
    // encoding properties
    fieldAndParams += props.map(function (p) { return ',' + p.key + '=' + p.value; }).join('');
    if (fn) {
        return fn + (fnEnumIndex ? JSON.stringify(fnEnumIndex) : '') + '(' + fieldAndParams + ')';
    }
    return fieldAndParams;
}
exports.fieldDef = fieldDef;

},{"../enumspec":16,"../property":21,"../util":37,"./spec":26,"datalib/src/util":8,"vega-lite/src/type":54}],26:[function(require,module,exports){
"use strict";
var channel_1 = require('vega-lite/src/channel');
var mark_1 = require('vega-lite/src/mark');
var stack_1 = require('vega-lite/src/stack');
var enumspec_1 = require('../enumspec');
var property_1 = require('../property');
var util_1 = require('../util');
/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
function fromSpec(spec) {
    return util_1.extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, {
        mark: spec.mark,
        encodings: util_1.keys(spec.encoding).map(function (channel) {
            var encQ = { channel: channel };
            var channelDef = spec.encoding[channel];
            for (var _i = 0, ENCODING_PROPERTIES_1 = property_1.ENCODING_PROPERTIES; _i < ENCODING_PROPERTIES_1.length; _i++) {
                var prop = ENCODING_PROPERTIES_1[_i];
                if (!property_1.isNestedEncodingProperty(prop) && channelDef[prop] !== undefined) {
                    encQ[prop] = channelDef[prop];
                }
                // Currently scale, axis, legend only support boolean, but not null.
                // Therefore convert null to false.
                if (util_1.contains([property_1.Property.SCALE, property_1.Property.AXIS, property_1.Property.LEGEND], prop) && encQ[prop] === null) {
                    encQ[prop] = false;
                }
            }
            return encQ;
        })
    }, spec.config ? { config: spec.config } : {});
}
exports.fromSpec = fromSpec;
function isAggregate(specQ) {
    return util_1.some(specQ.encodings, function (encQ) {
        return (!enumspec_1.isEnumSpec(encQ.aggregate) && !!encQ.aggregate) || encQ.autoCount === true;
    });
}
exports.isAggregate = isAggregate;
/**
 * @return the stack offset type for the specQuery
 */
function stack(specQ) {
    var config = specQ.config;
    var stacked = (config && config.mark) ? config.mark.stacked : undefined;
    // Should not have stack explicitly disabled
    if (util_1.contains([stack_1.StackOffset.NONE, null, false], stacked)) {
        return null;
    }
    // Should have stackable mark
    if (!util_1.contains([mark_1.BAR, mark_1.AREA], specQ.mark)) {
        return null;
    }
    // Should be aggregate plot
    if (!isAggregate(specQ)) {
        return null;
    }
    var stackByChannels = specQ.encodings.reduce(function (sc, encQ) {
        if (util_1.contains(channel_1.STACK_GROUP_CHANNELS, encQ.channel) && !encQ.aggregate) {
            sc.push(encQ.channel);
        }
        return sc;
    }, []);
    if (stackByChannels.length === 0) {
        return null;
    }
    // Has only one aggregate axis
    var xEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.X ? encQ : null);
    }, null);
    var yEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.Y ? encQ : null);
    }, null);
    var xIsAggregate = !!xEncQ && (!!xEncQ.aggregate || !!xEncQ.autoCount);
    var yIsAggregate = !!yEncQ && (!!yEncQ.aggregate || !!yEncQ.autoCount);
    if (xIsAggregate !== yIsAggregate) {
        return {
            groupbyChannel: xIsAggregate ? (!!yEncQ ? channel_1.Y : null) : (!!xEncQ ? channel_1.X : null),
            groupByEncQ: xIsAggregate ? yEncQ : xEncQ,
            fieldChannel: xIsAggregate ? channel_1.X : channel_1.Y,
            fieldEncQ: xIsAggregate ? xEncQ : yEncQ,
            stackByChannels: stackByChannels,
            offset: stacked || stack_1.StackOffset.ZERO
        };
    }
    return null;
}
exports.stack = stack;

},{"../enumspec":16,"../property":21,"../util":37,"vega-lite/src/channel":46,"vega-lite/src/mark":49,"vega-lite/src/stack":52}],27:[function(require,module,exports){
"use strict";

},{}],28:[function(require,module,exports){
"use strict";
var aggregate_1 = require('vega-lite/src/aggregate');
var type_1 = require('vega-lite/src/type');
var util_1 = require('../util');
var encoding_1 = require('../query/encoding');
exports.name = 'aggregationQuality';
function score(specM, schema, opt) {
    var feature = aggregationQualityFeature(specM, schema, opt);
    return {
        score: feature.score,
        features: [feature]
    };
}
exports.score = score;
function aggregationQualityFeature(specM, schema, opt) {
    var encodings = specM.getEncodings();
    if (specM.isAggregate()) {
        var isRawContinuous = function (encQ) {
            return (encQ.type === type_1.Type.QUANTITATIVE && !encQ.bin && !encQ.aggregate && !encQ.autoCount) ||
                (encQ.type === type_1.Type.TEMPORAL && !encQ.timeUnit);
        };
        if (util_1.some(encodings, isRawContinuous)) {
            // These are plots that pollute continuous fields as dimension.
            // They are often intermediate visualizations rather than what users actually want.
            return {
                type: exports.name,
                score: 0.1,
                feature: 'Aggregate with raw continuous'
            };
        }
        if (util_1.some(encodings, encoding_1.isDimension)) {
            var hasCount = util_1.some(encodings, function (encQ) {
                return encQ.aggregate === aggregate_1.AggregateOp.COUNT || encQ.autoCount === true;
            });
            var hasBin = util_1.some(encodings, function (encQ) {
                return !!encQ.bin;
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
        if (util_1.some(encodings, encoding_1.isMeasure)) {
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

},{"../query/encoding":22,"../util":37,"vega-lite/src/aggregate":43,"vega-lite/src/type":54}],29:[function(require,module,exports){
"use strict";
var channel_1 = require('vega-lite/src/channel');
var config_1 = require('../../config');
var shorthand_1 = require('../../query/shorthand');
var util_1 = require('../../util');
var effectiveness_1 = require('./effectiveness');
var type_1 = require('./type');
/**
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
var TypeChannelScore;
(function (TypeChannelScore) {
    TypeChannelScore.TYPE_CHANNEL = 'typeChannel';
    function init() {
        var SCORE = {};
        var ORDERED_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            size: -0.575,
            color: -0.725,
            opacity: -0.85,
            text: -0.875,
            row: -0.9,
            column: -0.9,
            shape: -2.5,
            detail: -3
        };
        [type_1.Q, type_1.BIN_Q, type_1.T, type_1.TIMEUNIT_T, type_1.TIMEUNIT_O, type_1.O].forEach(function (type) {
            util_1.keys(ORDERED_TYPE_CHANNEL_SCORE).forEach(function (channel) {
                SCORE[featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
            });
        });
        // Penalize row/column for bin quantitative / timeUnit_temporal / O less
        [type_1.BIN_Q, type_1.TIMEUNIT_T, type_1.TIMEUNIT_O, type_1.O].forEach(function (type) {
            [channel_1.Channel.ROW, channel_1.Channel.COLUMN].forEach(function (channel) {
                SCORE[featurize(type, channel)] += 0.15;
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
            size: -1.8,
            detail: -2,
            opacity: -2.1
        };
        util_1.keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach(function (channel) {
            SCORE[featurize(type_1.N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
        });
        return SCORE;
    }
    TypeChannelScore.init = init;
    function featurize(type, channel) {
        return type + '_' + channel;
    }
    TypeChannelScore.featurize = featurize;
    function getScore(specM, schema, opt) {
        var encodingQueryByField = specM.getEncodings().reduce(function (m, encQ) {
            var fieldKey = shorthand_1.fieldDef(encQ);
            (m[fieldKey] = m[fieldKey] || []).push(encQ);
            return m;
        }, {});
        var features = [];
        util_1.forEach(encodingQueryByField, function (encQs) {
            var bestFieldFeature = encQs.reduce(function (best, encQ) {
                var type = type_1.getExtendedType(encQ);
                var feature = featurize(type, encQ.channel);
                var featureScore = effectiveness_1.getFeatureScore(TypeChannelScore.TYPE_CHANNEL, feature);
                if (best === null || featureScore.score > best.score) {
                    return featureScore;
                }
                return best;
            }, null);
            features.push(bestFieldFeature);
            // TODO: add plus for over-encoding of one field
        });
        return features;
    }
    TypeChannelScore.getScore = getScore;
})(TypeChannelScore = exports.TypeChannelScore || (exports.TypeChannelScore = {}));
var PreferredAxisScore;
(function (PreferredAxisScore) {
    PreferredAxisScore.PREFERRED_AXIS = 'preferredAxis';
    // FIXME support doing this at runtime
    function init(opt) {
        if (opt === void 0) { opt = {}; }
        opt = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, opt);
        var score = {};
        var preferredAxes = [{
                feature: type_1.BIN_Q,
                opt: 'preferredBinAxis'
            }, {
                feature: type_1.T,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.TIMEUNIT_T,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.TIMEUNIT_O,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.O,
                opt: 'preferredOrdinalAxis'
            }, {
                feature: type_1.N,
                opt: 'preferredNominalAxis'
            }];
        preferredAxes.forEach(function (preferredAxis) {
            if (opt[preferredAxis.opt] === channel_1.Channel.X) {
                // penalize the other axis
                score[preferredAxis.feature + '_' + channel_1.Channel.Y] = -0.01;
            }
            else if (opt[preferredAxis.opt] === channel_1.Channel.Y) {
                // penalize the other axis
                score[preferredAxis.feature + '_' + channel_1.Channel.X] = -0.01;
            }
        });
        return score;
    }
    PreferredAxisScore.init = init;
    function featurize(type, channel) {
        return type + '_' + channel;
    }
    PreferredAxisScore.featurize = featurize;
    function getScore(specM, schema, opt) {
        return specM.getEncodings().reduce(function (features, encQ) {
            var type = type_1.getExtendedType(encQ);
            var feature = featurize(type, encQ.channel);
            var featureScore = effectiveness_1.getFeatureScore(PreferredAxisScore.PREFERRED_AXIS, feature);
            if (featureScore) {
                features.push(featureScore);
            }
            return features;
        }, []);
    }
    PreferredAxisScore.getScore = getScore;
})(PreferredAxisScore = exports.PreferredAxisScore || (exports.PreferredAxisScore = {}));
var PreferredFacetScore;
(function (PreferredFacetScore) {
    PreferredFacetScore.PREFERRED_FACET = 'preferredFacet';
    // FIXME support doing this at runtime
    function init(opt) {
        opt = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, opt);
        var score = {};
        if (opt.preferredFacet === channel_1.Channel.ROW) {
            // penalize the other axis
            score[channel_1.Channel.COLUMN] = -0.01;
        }
        else if (opt.preferredFacet === channel_1.Channel.COLUMN) {
            // penalize the other axis
            score[channel_1.Channel.ROW] = -0.01;
        }
        return score;
    }
    PreferredFacetScore.init = init;
    function getScore(specM, schema, opt) {
        return specM.getEncodings().reduce(function (features, encQ) {
            var featureScore = effectiveness_1.getFeatureScore(PreferredFacetScore.PREFERRED_FACET, encQ.channel);
            if (featureScore) {
                features.push(featureScore);
            }
            return features;
        }, []);
    }
    PreferredFacetScore.getScore = getScore;
})(PreferredFacetScore = exports.PreferredFacetScore || (exports.PreferredFacetScore = {}));
var MarkChannelScore;
(function (MarkChannelScore) {
    // Penalty for certain channel for certain mark types
    MarkChannelScore.MARK_CHANNEL = 'markChannel';
    function init() {
        return {
            bar_size: -2,
            tick_size: -2
        };
    }
    MarkChannelScore.init = init;
    function getScore(specM, schema, opt) {
        var mark = specM.getMark();
        return specM.getEncodings().reduce(function (featureScores, encQ) {
            var feature = mark + '_' + encQ.channel;
            var featureScore = effectiveness_1.getFeatureScore(MarkChannelScore.MARK_CHANNEL, feature);
            if (featureScore) {
                featureScores.push(featureScore);
            }
            return featureScores;
        }, []);
    }
    MarkChannelScore.getScore = getScore;
})(MarkChannelScore = exports.MarkChannelScore || (exports.MarkChannelScore = {}));
/**
 * Penalize if facet channels are the only dimensions
 */
var DimensionScore;
(function (DimensionScore) {
    DimensionScore.DIMENSION = 'dimension';
    function init() {
        return {
            row: -2,
            column: -2,
            color: 0,
            opacity: 0,
            size: 0,
            shape: 0
        };
    }
    DimensionScore.init = init;
    function getScore(specM, schema, opt) {
        if (specM.isAggregate()) {
            specM.getEncodings().reduce(function (maxFScore, encQ) {
                if (!encQ.aggregate && !encQ.autoCount) {
                    var featureScore = effectiveness_1.getFeatureScore(DimensionScore.DIMENSION, encQ.channel + '');
                    if (featureScore.score > maxFScore.score) {
                        return featureScore;
                    }
                }
                return maxFScore;
            }, { type: DimensionScore.DIMENSION, feature: 'No Dimension', score: -5 });
        }
        return [];
    }
    DimensionScore.getScore = getScore;
})(DimensionScore = exports.DimensionScore || (exports.DimensionScore = {}));

},{"../../config":9,"../../query/shorthand":25,"../../util":37,"./effectiveness":30,"./type":32,"vega-lite/src/channel":46}],30:[function(require,module,exports){
"use strict";
var channel_1 = require('./channel');
var mark_1 = require('./mark');
exports.FEATURE_INDEX = {};
var FEATURE_FACTORIES = [];
function getFeatureScore(type, feature) {
    var score = exports.FEATURE_INDEX[type][feature];
    if (score !== undefined) {
        return {
            score: score,
            type: type,
            feature: feature
        };
    }
    return null;
}
exports.getFeatureScore = getFeatureScore;
function addFeatureFactory(factory) {
    FEATURE_FACTORIES.push(factory);
    exports.FEATURE_INDEX[factory.type] = factory.init();
}
exports.addFeatureFactory = addFeatureFactory;
addFeatureFactory({
    type: channel_1.TypeChannelScore.TYPE_CHANNEL,
    init: channel_1.TypeChannelScore.init,
    getScore: channel_1.TypeChannelScore.getScore
});
addFeatureFactory({
    type: channel_1.PreferredAxisScore.PREFERRED_AXIS,
    init: channel_1.PreferredAxisScore.init,
    getScore: channel_1.PreferredAxisScore.getScore
});
addFeatureFactory({
    type: channel_1.PreferredFacetScore.PREFERRED_FACET,
    init: channel_1.PreferredFacetScore.init,
    getScore: channel_1.PreferredFacetScore.getScore
});
addFeatureFactory({
    type: channel_1.MarkChannelScore.MARK_CHANNEL,
    init: channel_1.MarkChannelScore.init,
    getScore: channel_1.MarkChannelScore.getScore
});
addFeatureFactory({
    type: mark_1.MarkScore.MARK_SCORE,
    init: mark_1.MarkScore.init,
    getScore: mark_1.MarkScore.getScore
});
// TODO: x/y, row/column preference
// TODO: stacking
// TODO: Channel, Cardinality
// TODO: Penalize over encoding
function default_1(specM, schema, opt) {
    var features = FEATURE_FACTORIES.reduce(function (f, factory) {
        var scores = factory.getScore(specM, schema, opt);
        return f.concat(scores);
    }, []);
    return {
        score: features.reduce(function (s, f) {
            return s + f.score;
        }, 0),
        features: features
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;

},{"./channel":29,"./mark":31}],31:[function(require,module,exports){
"use strict";
var channel_1 = require('vega-lite/src/channel');
var mark_1 = require('vega-lite/src/mark');
var util_1 = require('../../util');
var effectiveness_1 = require('./effectiveness');
var type_1 = require('./type');
var MarkScore;
(function (MarkScore) {
    MarkScore.MARK_SCORE = 'markScore';
    function featurize(xType, yType, hasOcclusion, mark) {
        return xType + '_' + yType + '_' + hasOcclusion + '_' + mark;
    }
    MarkScore.featurize = featurize;
    function init() {
        var MEASURES = [type_1.Q, type_1.T];
        var DISCRETE = [type_1.BIN_Q, type_1.TIMEUNIT_O, type_1.O, type_1.N];
        var DISCRETE_OR_NONE = DISCRETE.concat([type_1.NONE]);
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
                util_1.forEach(occludedQQMark, function (score, mark) {
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
                util_1.forEach(noOccludedQQMark, function (score, mark) {
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
                util_1.forEach(occludedDimensionMeasureMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, true, mark);
                    SCORE[feature2] = score;
                });
            });
            [type_1.TIMEUNIT_T].forEach(function (yType) {
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
                util_1.forEach(occludedDimensionMeasureMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, true, mark);
                    SCORE[feature2] = score;
                });
            });
            // NO OCCLUSION
            [type_1.NONE, type_1.N, type_1.O].forEach(function (yType) {
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
                util_1.forEach(noOccludedQxN, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
            [type_1.BIN_Q].forEach(function (yType) {
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
                util_1.forEach(noOccludedQxBinQ, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
            [type_1.TIMEUNIT_T, type_1.TIMEUNIT_O].forEach(function (yType) {
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
                util_1.forEach(noOccludedQxBinQ, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
        });
        [type_1.TIMEUNIT_T].forEach(function (xType) {
            [type_1.TIMEUNIT_T].forEach(function (yType) {
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
                util_1.forEach(ttMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(ttMark, function (score, mark) {
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
                util_1.forEach(tdMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(tdMark, function (score, mark) {
                    var feature = featurize(yType, xType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(tdMark, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(tdMark, function (score, mark) {
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
                // No difference between has occlusion and no occlusion
                util_1.forEach(ddMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(ddMark, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
            });
        });
        return SCORE;
    }
    MarkScore.init = init;
    function getScore(specM, schema, opt) {
        var mark = specM.getMark();
        if (mark === mark_1.Mark.CIRCLE || mark === mark_1.Mark.SQUARE) {
            mark = mark_1.Mark.POINT;
        }
        var xEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.X);
        var xType = xEncQ ? type_1.getExtendedType(xEncQ) : type_1.NONE;
        var yEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.Y);
        var yType = yEncQ ? type_1.getExtendedType(yEncQ) : type_1.NONE;
        var isOccluded = !specM.isAggregate(); // FIXME
        var feature = xType + '_' + yType + '_' + isOccluded + '_' + mark;
        var featureScore = effectiveness_1.getFeatureScore(MarkScore.MARK_SCORE, feature);
        return [featureScore];
    }
    MarkScore.getScore = getScore;
})(MarkScore = exports.MarkScore || (exports.MarkScore = {}));

},{"../../util":37,"./effectiveness":30,"./type":32,"vega-lite/src/channel":46,"vega-lite/src/mark":49}],32:[function(require,module,exports){
"use strict";
var scale_1 = require('vega-lite/src/scale');
var type_1 = require('vega-lite/src/type');
var encoding_1 = require('../../query/encoding');
/**
 * Finer grained data types that takes binning and timeUnit into account.
 */
(function (ExtendedType) {
    ExtendedType[ExtendedType["Q"] = type_1.Type.QUANTITATIVE] = "Q";
    ExtendedType[ExtendedType["BIN_Q"] = 'bin_' + type_1.Type.QUANTITATIVE] = "BIN_Q";
    ExtendedType[ExtendedType["T"] = type_1.Type.TEMPORAL] = "T";
    /**
     * Time Unit Temporal Field with time scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
    /**
     * Time Unit Temporal Field with ordinal scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_O"] = 'timeUnit_' + type_1.Type.ORDINAL] = "TIMEUNIT_O";
    ExtendedType[ExtendedType["O"] = type_1.Type.ORDINAL] = "O";
    ExtendedType[ExtendedType["N"] = type_1.Type.NOMINAL] = "N";
    ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
})(exports.ExtendedType || (exports.ExtendedType = {}));
var ExtendedType = exports.ExtendedType;
exports.Q = ExtendedType.Q;
exports.BIN_Q = ExtendedType.BIN_Q;
exports.T = ExtendedType.T;
exports.TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
exports.TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
exports.O = ExtendedType.O;
exports.N = ExtendedType.N;
exports.NONE = ExtendedType.NONE;
function getExtendedType(encQ) {
    if (encQ.bin) {
        return ExtendedType.BIN_Q;
    }
    else if (encQ.timeUnit) {
        return encoding_1.scaleType(encQ) === scale_1.ScaleType.ORDINAL ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
    }
    return encQ.type;
}
exports.getExtendedType = getExtendedType;

},{"../../query/encoding":22,"vega-lite/src/scale":50,"vega-lite/src/type":54}],33:[function(require,module,exports){
"use strict";
var property_1 = require('../property');
exports.name = 'fieldOrder';
function score(specM, schema, opt) {
    var fieldEnumSpecIndices = specM.enumSpecIndex.encodingIndicesByProperty[property_1.Property.FIELD];
    if (!fieldEnumSpecIndices) {
        return {
            score: 0,
            features: []
        };
    }
    var encodings = specM.specQuery.encodings;
    var numFields = schema.fieldSchemas.length;
    var features = [];
    var totalScore = 0, base = 1;
    for (var i = fieldEnumSpecIndices.length - 1; i >= 0; i--) {
        var index = fieldEnumSpecIndices[i];
        var field = encodings[index].field;
        var fieldEnumSpec = specM.enumSpecIndex.encodings[index].field;
        var fieldIndex = schema.fieldSchema(field).index;
        // reverse order field with lower index should get higher score and come first
        var score_1 = -fieldIndex * base;
        totalScore += score_1;
        features.push({
            score: score_1,
            type: 'fieldOrder',
            feature: "field " + fieldEnumSpec.name + " is " + field + " (#" + fieldIndex + " in the schema)"
        });
        base *= numFields;
    }
    return {
        score: totalScore,
        features: features
    };
}
exports.score = score;

},{"../property":21}],34:[function(require,module,exports){
"use strict";
exports.effectiveness = require('./effectiveness/effectiveness');
exports.aggregation = require('./aggregation');
exports.fieldOrder = require('./fieldorder');
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
        var m1 = g1.getTopSpecQueryModel();
        var m2 = g2.getTopSpecQueryModel();
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
    for (var i = 0; i < name.length; i++) {
        var scoreDifference = getScore(m2, name[i], schema, opt).score - getScore(m1, name[i], schema, opt).score;
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
register(exports.EFFECTIVENESS, exports.effectiveness.default);
register(exports.aggregation.name, exports.aggregation.score);
register(exports.fieldOrder.name, exports.fieldOrder.score);

},{"./aggregation":28,"./effectiveness/effectiveness":30,"./fieldorder":33}],35:[function(require,module,exports){
"use strict";
var type_1 = require('vega-lite/src/type');
var bin_1 = require('vega-lite/src/bin');
var timeunit_1 = require('vega-lite/src/timeunit');
var stats_1 = require('datalib/src/stats');
var type_2 = require('datalib/src/import/type');
var dlBin = require('datalib/src/bins/bins');
var config_1 = require('./config');
var util_1 = require('./util');
var Schema = (function () {
    function Schema(fieldSchemas) {
        this._fieldSchemas = fieldSchemas;
        this._fieldSchemaIndex = fieldSchemas.reduce(function (m, fieldSchema) {
            m[fieldSchema.field] = fieldSchema;
            return m;
        }, {});
    }
    /**
     * Build a Schema object.
     *
     * @param data - a set of raw data
     * @return a Schema object
     */
    Schema.build = function (data, opt) {
        if (opt === void 0) { opt = {}; }
        opt = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, opt);
        // create profiles for each variable
        var summaries = stats_1.summary(data);
        var types = type_2.inferAll(data); // inferAll does stronger type inference than summary
        var fieldSchemas = summaries.map(function (summary) {
            var field = summary.field;
            var primitiveType = types[field];
            var distinct = summary.distinct;
            var type;
            if (primitiveType === PrimitiveType.NUMBER) {
                type = type_1.Type.QUANTITATIVE;
            }
            else if (primitiveType === PrimitiveType.INTEGER) {
                // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
                if ((distinct < opt.numberNominalLimit) && (distinct / summary.count < opt.numberNominalProportion)) {
                    type = type_1.Type.NOMINAL;
                }
                else {
                    type = type_1.Type.QUANTITATIVE;
                }
            }
            else if (primitiveType === PrimitiveType.DATE) {
                type = type_1.Type.TEMPORAL;
                // need to get correct min/max of date data because datalib's summary method does not
                // calculate this correctly for date types.
                summary.min = new Date(data[0][field]);
                summary.max = new Date(data[0][field]);
                for (var i = 0; i < data.length; i++) {
                    var time = new Date(data[i][field]).getTime();
                    if (time < summary.min.getTime()) {
                        summary.min = new Date(time);
                    }
                    if (time > summary.max.getTime()) {
                        summary.max = new Date(time);
                    }
                }
            }
            else {
                type = type_1.Type.NOMINAL;
            }
            return {
                field: field,
                type: type,
                primitiveType: primitiveType,
                stats: summary,
                timeStats: {},
                binStats: {}
            };
        });
        // order the fieldSchemas (sort them)
        var order = {
            'nominal': 0,
            'ordinal': 1,
            'temporal': 2,
            'quantitative': 3
        };
        fieldSchemas.sort(function (a, b) {
            // first order by type: nominal < temporal < quantitative < ordinal
            if (order[a.type] < order[b.type]) {
                return -1;
            }
            else if (order[a.type] > order[b.type]) {
                return 1;
            }
            else {
                // then order by field (alphabetically)
                return a.field.localeCompare(b.field);
            }
        });
        // Add index for sorting
        fieldSchemas.forEach(function (fieldSchema, index) { return fieldSchema.index = index; });
        // calculate preset bins for quantitative and temporal data
        for (var _i = 0, fieldSchemas_1 = fieldSchemas; _i < fieldSchemas_1.length; _i++) {
            var fieldSchema = fieldSchemas_1[_i];
            if (fieldSchema.type === type_1.Type.QUANTITATIVE) {
                for (var _a = 0, _b = opt.maxBinsList; _a < _b.length; _a++) {
                    var maxbins = _b[_a];
                    fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
                }
            }
            else if (fieldSchema.type === type_1.Type.TEMPORAL) {
                for (var _c = 0, _d = opt.timeUnits; _c < _d.length; _c++) {
                    var unit = _d[_c];
                    if (unit !== undefined) {
                        fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
                    }
                }
            }
        }
        return new Schema(fieldSchemas);
    };
    /** @return a list of the field names. */
    Schema.prototype.fields = function () {
        return this._fieldSchemas.map(function (fieldSchema) { return fieldSchema.field; });
    };
    Object.defineProperty(Schema.prototype, "fieldSchemas", {
        /** @return a list of FieldSchemas */
        get: function () {
            return this._fieldSchemas;
        },
        enumerable: true,
        configurable: true
    });
    Schema.prototype.fieldSchema = function (field) {
        return this._fieldSchemaIndex[field];
    };
    /**
     * @return primitive type of the field if exist, otherwise return null
     */
    Schema.prototype.primitiveType = function (field) {
        return this._fieldSchemaIndex[field] ? this._fieldSchemaIndex[field].primitiveType : null;
    };
    /**
     * @return type of measturement of the field if exist, otherwise return null
     */
    Schema.prototype.type = function (field) {
        return this._fieldSchemaIndex[field] ? this._fieldSchemaIndex[field].type : null;
    };
    /** @return cardinality of the field associated with encQ, null if it doesn't exist.
     *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
     */
    Schema.prototype.cardinality = function (encQ, augmentTimeUnitDomain, excludeInvalid) {
        if (augmentTimeUnitDomain === void 0) { augmentTimeUnitDomain = true; }
        if (excludeInvalid === void 0) { excludeInvalid = false; }
        var fieldSchema = this._fieldSchemaIndex[encQ.field];
        if (encQ.aggregate || encQ.autoCount) {
            return 1;
        }
        else if (encQ.bin) {
            // encQ.bin will either be a boolean or a BinQuery
            var bin;
            if (typeof encQ.bin === 'boolean') {
                // autoMaxBins defaults to 10 if channel is EnumSpec
                bin = {
                    maxbins: bin_1.autoMaxBins(encQ.channel)
                };
            }
            else {
                bin = encQ.bin;
            }
            var maxbins = bin.maxbins;
            if (!fieldSchema.binStats[maxbins]) {
                // need to calculate
                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
            }
            // don't need to worry about excludeInvalid here because invalid values don't affect linearly binned field's cardinality
            return fieldSchema.binStats[maxbins].distinct;
        }
        else if (encQ.timeUnit) {
            if (augmentTimeUnitDomain) {
                switch (encQ.timeUnit) {
                    // TODO: this should not always be the case once Vega-Lite supports turning off domain augmenting (VL issue #1385)
                    case timeunit_1.TimeUnit.SECONDS: return 60;
                    case timeunit_1.TimeUnit.MINUTES: return 60;
                    case timeunit_1.TimeUnit.HOURS: return 24;
                    case timeunit_1.TimeUnit.DAY: return 7;
                    case timeunit_1.TimeUnit.DATE: return 31;
                    case timeunit_1.TimeUnit.MONTH: return 12;
                    case timeunit_1.TimeUnit.QUARTER: return 4;
                    case timeunit_1.TimeUnit.MILLISECONDS: return 1000;
                }
            }
            var unit = encQ.timeUnit;
            var timeStats = fieldSchema.timeStats;
            // if the cardinality for the timeUnit is not cached, calculate it
            if (!timeStats[unit]) {
                timeStats[unit] = timeSummary(encQ.timeUnit, fieldSchema.stats);
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
    };
    /**
     * Given an EncodingQuery with a timeUnit, returns true if the date field
     * has multiple distinct values for all parts of the timeUnit. Returns undefined
     * if the timeUnit is undefined.
     * i.e.
     * ('yearmonth', [Jan 1 2000, Feb 2 2000] returns false)
     * ('yearmonth', [Jan 1 2000, Feb 2 2001] returns true)
     */
    Schema.prototype.timeUnitHasVariation = function (encQ) {
        if (!encQ.timeUnit) {
            return;
        }
        // if there is no variation in `date`, there should not be variation in `day`
        if (encQ.timeUnit === timeunit_1.TimeUnit.DAY) {
            var dateEncQ = util_1.extend({}, encQ, { timeUnit: timeunit_1.TimeUnit.DATE });
            if (this.cardinality(dateEncQ, false, true) <= 1) {
                return false;
            }
        }
        var fullTimeUnit = encQ.timeUnit;
        for (var _i = 0, SINGLE_TIMEUNITS_1 = timeunit_1.SINGLE_TIMEUNITS; _i < SINGLE_TIMEUNITS_1.length; _i++) {
            var singleUnit = SINGLE_TIMEUNITS_1[_i];
            if (timeunit_1.containsTimeUnit(fullTimeUnit, singleUnit)) {
                encQ.timeUnit = singleUnit;
                if (this.cardinality(encQ, false, true) <= 1) {
                    return false;
                }
            }
        }
        return true;
    };
    Schema.prototype.domain = function (encQ) {
        // TODO: differentiate for field with bin / timeUnit
        var fieldSchema = this._fieldSchemaIndex[encQ.field];
        var domain = util_1.keys(fieldSchema.stats.unique);
        if (fieldSchema.type === type_1.Type.QUANTITATIVE) {
            // return [min, max], coerced into number types
            return [+fieldSchema.stats.min, +fieldSchema.stats.max];
        }
        else if (fieldSchema.primitiveType === PrimitiveType.DATE) {
            // return [min, max] dates
            return [fieldSchema.stats.min, fieldSchema.stats.max];
        }
        else if (fieldSchema.primitiveType === PrimitiveType.INTEGER ||
            fieldSchema.primitiveType === PrimitiveType.NUMBER) {
            // coerce non-quantitative numerical data into number type
            domain = domain.map(function (x) { return +x; });
            return domain.sort(util_1.cmp);
        }
        return domain.map(function (x) {
            // Convert 'null' to null as it is encoded similarly in datalib.
            // This is wrong when it is a string 'null' but that rarely happens.
            return x === 'null' ? null : x;
        }).sort(util_1.cmp);
    };
    /**
     * @return a Summary corresponding to the field of the given EncodingQuery
     */
    Schema.prototype.stats = function (encQ) {
        // TODO: differentiate for field with bin / timeUnit vs without
        var fieldSchema = this._fieldSchemaIndex[encQ.field];
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
    var result = util_1.extend({}, summary);
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
    var result = util_1.extend({}, summary);
    var unique = {};
    util_1.keys(summary.unique).forEach(function (dateString) {
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
            key = ((timeunit === timeunit_1.TimeUnit.DAY) ? date.getDay() : timeunit_1.convert(timeunit, date)).toString();
        }
        unique[key] = (unique[key] || 0) + summary.unique[dateString];
    });
    result.unique = unique;
    result.distinct = util_1.keys(unique).length;
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
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["STRING"] = 'string'] = "STRING";
    PrimitiveType[PrimitiveType["NUMBER"] = 'number'] = "NUMBER";
    PrimitiveType[PrimitiveType["INTEGER"] = 'integer'] = "INTEGER";
    PrimitiveType[PrimitiveType["BOOLEAN"] = 'boolean'] = "BOOLEAN";
    PrimitiveType[PrimitiveType["DATE"] = 'date'] = "DATE";
})(exports.PrimitiveType || (exports.PrimitiveType = {}));
var PrimitiveType = exports.PrimitiveType;

},{"./config":9,"./util":37,"datalib/src/bins/bins":3,"datalib/src/import/type":5,"datalib/src/stats":6,"vega-lite/src/bin":45,"vega-lite/src/timeunit":53,"vega-lite/src/type":54}],36:[function(require,module,exports){
"use strict";
var axis_1 = require('vega-lite/src/axis');
var channel_1 = require('vega-lite/src/channel');
var scale_1 = require('vega-lite/src/scale');
var type_1 = require('vega-lite/src/type');
var encoding_1 = require('./query/encoding');
var util_1 = require('./util');
function stylize(answerSet, schema, opt) {
    var encQIndex = {};
    answerSet = answerSet.map(function (specM) {
        if (opt.smallBandSizeForHighCardinalityOrFacet) {
            specM = smallBandSizeForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
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
function smallBandSizeForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
    [channel_1.Channel.ROW, channel_1.Channel.Y, channel_1.Channel.COLUMN, channel_1.Channel.X].forEach(function (channel) {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    var yEncQ = encQIndex[channel_1.Channel.Y];
    if (yEncQ !== undefined) {
        if (encQIndex[channel_1.Channel.ROW] ||
            schema.cardinality(yEncQ) > opt.smallBandSizeForHighCardinalityOrFacet.maxCardinality) {
            // We check for undefined rather than
            // yEncQ.scale = yEncQ.scale || {} to cover the case where
            // yEncQ.scale has been set to false/null.
            // This prevents us from incorrectly overriding scale and
            // assigning a bandSize when scale is set to false.
            if (yEncQ.scale === undefined) {
                yEncQ.scale = {};
            }
            // We do not want to assign a bandSize if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            if (yEncQ.scale && util_1.contains([scale_1.ScaleType.ORDINAL, undefined], encoding_1.scaleType(yEncQ))) {
                if (!yEncQ.scale.bandSize) {
                    yEncQ.scale.bandSize = 12;
                }
            }
        }
    }
    var xEncQ = encQIndex[channel_1.Channel.X];
    if (xEncQ !== undefined) {
        if (encQIndex[channel_1.Channel.COLUMN] ||
            schema.cardinality(xEncQ) > opt.smallBandSizeForHighCardinalityOrFacet.maxCardinality) {
            // Just like y, we don't want to do this if scale is null/false
            if (xEncQ.scale === undefined) {
                xEncQ.scale = {};
            }
            // We do not want to assign a bandSize if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            if (xEncQ.scale && util_1.contains([scale_1.ScaleType.ORDINAL, undefined], encoding_1.scaleType(xEncQ))) {
                if (!xEncQ.scale.bandSize) {
                    xEncQ.scale.bandSize = 12;
                }
            }
        }
    }
    return specM;
}
exports.smallBandSizeForHighCardinalityOrFacet = smallBandSizeForHighCardinalityOrFacet;
function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
    encQIndex[channel_1.Channel.COLOR] = specM.getEncodingQueryByChannel(channel_1.Channel.COLOR);
    var colorEncQ = encQIndex[channel_1.Channel.COLOR];
    if ((colorEncQ !== undefined) && (colorEncQ.type === type_1.Type.NOMINAL) &&
        (schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality)) {
        if (colorEncQ.scale === undefined) {
            colorEncQ.scale = {};
        }
        if (colorEncQ.scale) {
            if (!colorEncQ.scale.range) {
                colorEncQ.scale.range = opt.nominalColorScaleForHighCardinality.palette;
            }
        }
    }
    return specM;
}
exports.nominalColorScaleForHighCardinality = nominalColorScaleForHighCardinality;
function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
    [channel_1.Channel.COLUMN, channel_1.Channel.X, channel_1.Channel.Y].forEach(function (channel) {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    if (encQIndex[channel_1.Channel.COLUMN] === undefined) {
        var xEncQ = encQIndex[channel_1.Channel.X];
        var yEncQ = encQIndex[channel_1.Channel.Y];
        if (yEncQ !== undefined && yEncQ.field && encoding_1.scaleType(yEncQ) === scale_1.ScaleType.ORDINAL) {
            if (xEncQ !== undefined) {
                if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
                    if (xEncQ.axis === undefined) {
                        xEncQ.axis = {};
                    }
                    if (xEncQ.axis && !xEncQ.axis.orient) {
                        xEncQ.axis.orient = axis_1.AxisOrient.TOP;
                    }
                }
            }
        }
    }
    return specM;
}
exports.xAxisOnTopForHighYCardinalityWithoutColumn = xAxisOnTopForHighYCardinalityWithoutColumn;

},{"./query/encoding":22,"./util":37,"vega-lite/src/axis":44,"vega-lite/src/channel":46,"vega-lite/src/scale":50,"vega-lite/src/type":54}],37:[function(require,module,exports){
"use strict";
var util_1 = require('datalib/src/util');
var util_2 = require('datalib/src/util');
exports.cmp = util_2.cmp;
exports.keys = util_2.keys;
exports.duplicate = util_2.duplicate;
exports.extend = util_2.extend;
exports.isObject = util_2.isObject;
exports.isArray = util_2.isArray;
function contains(array, item) {
    return array.indexOf(item) !== -1;
}
exports.contains = contains;
;
function every(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
;
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
;
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
;
function nestedMap(array, f) {
    return array.map(function (a) {
        if (util_1.isArray(a)) {
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

},{"datalib/src/util":8}],38:[function(require,module,exports){
(function (Buffer){
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

}).call(this,require("buffer").Buffer)

},{"buffer":1}],39:[function(require,module,exports){
var json = typeof JSON !== 'undefined' ? JSON : require('jsonify');

module.exports = function (obj, opts) {
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
                ;
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

},{"jsonify":40}],40:[function(require,module,exports){
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

},{"./lib/parse":41,"./lib/stringify":42}],41:[function(require,module,exports){
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

    value,  // Place holder for the value function.

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
                array.push(value());
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
                object[key] = value();
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

value = function () {

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

module.exports = function (source, reviver) {
    var result;
    
    text = source;
    at = 0;
    ch = ' ';
    result = value();
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

},{}],42:[function(require,module,exports){
var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
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

module.exports = function (value, replacer, space) {
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

},{}],43:[function(require,module,exports){
"use strict";
(function (AggregateOp) {
    AggregateOp[AggregateOp["VALUES"] = 'values'] = "VALUES";
    AggregateOp[AggregateOp["COUNT"] = 'count'] = "COUNT";
    AggregateOp[AggregateOp["VALID"] = 'valid'] = "VALID";
    AggregateOp[AggregateOp["MISSING"] = 'missing'] = "MISSING";
    AggregateOp[AggregateOp["DISTINCT"] = 'distinct'] = "DISTINCT";
    AggregateOp[AggregateOp["SUM"] = 'sum'] = "SUM";
    AggregateOp[AggregateOp["MEAN"] = 'mean'] = "MEAN";
    AggregateOp[AggregateOp["AVERAGE"] = 'average'] = "AVERAGE";
    AggregateOp[AggregateOp["VARIANCE"] = 'variance'] = "VARIANCE";
    AggregateOp[AggregateOp["VARIANCEP"] = 'variancep'] = "VARIANCEP";
    AggregateOp[AggregateOp["STDEV"] = 'stdev'] = "STDEV";
    AggregateOp[AggregateOp["STDEVP"] = 'stdevp'] = "STDEVP";
    AggregateOp[AggregateOp["MEDIAN"] = 'median'] = "MEDIAN";
    AggregateOp[AggregateOp["Q1"] = 'q1'] = "Q1";
    AggregateOp[AggregateOp["Q3"] = 'q3'] = "Q3";
    AggregateOp[AggregateOp["MODESKEW"] = 'modeskew'] = "MODESKEW";
    AggregateOp[AggregateOp["MIN"] = 'min'] = "MIN";
    AggregateOp[AggregateOp["MAX"] = 'max'] = "MAX";
    AggregateOp[AggregateOp["ARGMIN"] = 'argmin'] = "ARGMIN";
    AggregateOp[AggregateOp["ARGMAX"] = 'argmax'] = "ARGMAX";
})(exports.AggregateOp || (exports.AggregateOp = {}));
var AggregateOp = exports.AggregateOp;
exports.AGGREGATE_OPS = [
    AggregateOp.VALUES,
    AggregateOp.COUNT,
    AggregateOp.VALID,
    AggregateOp.MISSING,
    AggregateOp.DISTINCT,
    AggregateOp.SUM,
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.VARIANCE,
    AggregateOp.VARIANCEP,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MODESKEW,
    AggregateOp.MIN,
    AggregateOp.MAX,
    AggregateOp.ARGMIN,
    AggregateOp.ARGMAX,
];
/** Additive-based aggregation operations.  These can be applied to stack. */
exports.SUM_OPS = [
    AggregateOp.COUNT,
    AggregateOp.SUM,
    AggregateOp.DISTINCT
];
exports.SHARED_DOMAIN_OPS = [
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MIN,
    AggregateOp.MAX,
];

},{}],44:[function(require,module,exports){
"use strict";
(function (AxisOrient) {
    AxisOrient[AxisOrient["TOP"] = 'top'] = "TOP";
    AxisOrient[AxisOrient["RIGHT"] = 'right'] = "RIGHT";
    AxisOrient[AxisOrient["LEFT"] = 'left'] = "LEFT";
    AxisOrient[AxisOrient["BOTTOM"] = 'bottom'] = "BOTTOM";
})(exports.AxisOrient || (exports.AxisOrient = {}));
var AxisOrient = exports.AxisOrient;
// TODO: add comment for properties that we rely on Vega's default to produce
// more concise Vega output.
exports.defaultAxisConfig = {
    offset: undefined,
    grid: undefined,
    labels: true,
    labelMaxLength: 25,
    tickSize: undefined,
    characterWidth: 6
};
exports.defaultFacetAxisConfig = {
    axisWidth: 0,
    labels: true,
    grid: false,
    tickSize: 0
};

},{}],45:[function(require,module,exports){
"use strict";
var channel_1 = require('./channel');
function autoMaxBins(channel) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule
        case channel_1.SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        default:
            return 10;
    }
}
exports.autoMaxBins = autoMaxBins;

},{"./channel":46}],46:[function(require,module,exports){
/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
"use strict";
var util_1 = require('./util');
(function (Channel) {
    Channel[Channel["X"] = 'x'] = "X";
    Channel[Channel["Y"] = 'y'] = "Y";
    Channel[Channel["X2"] = 'x2'] = "X2";
    Channel[Channel["Y2"] = 'y2'] = "Y2";
    Channel[Channel["ROW"] = 'row'] = "ROW";
    Channel[Channel["COLUMN"] = 'column'] = "COLUMN";
    Channel[Channel["SHAPE"] = 'shape'] = "SHAPE";
    Channel[Channel["SIZE"] = 'size'] = "SIZE";
    Channel[Channel["COLOR"] = 'color'] = "COLOR";
    Channel[Channel["TEXT"] = 'text'] = "TEXT";
    Channel[Channel["DETAIL"] = 'detail'] = "DETAIL";
    Channel[Channel["LABEL"] = 'label'] = "LABEL";
    Channel[Channel["PATH"] = 'path'] = "PATH";
    Channel[Channel["ORDER"] = 'order'] = "ORDER";
    Channel[Channel["OPACITY"] = 'opacity'] = "OPACITY";
})(exports.Channel || (exports.Channel = {}));
var Channel = exports.Channel;
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.X2 = Channel.X2;
exports.Y2 = Channel.Y2;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.LABEL = Channel.LABEL;
exports.PATH = Channel.PATH;
exports.ORDER = Channel.ORDER;
exports.OPACITY = Channel.OPACITY;
exports.CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.PATH, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL, exports.LABEL];
exports.UNIT_CHANNELS = util_1.without(exports.CHANNELS, [exports.ROW, exports.COLUMN]);
exports.UNIT_SCALE_CHANNELS = util_1.without(exports.UNIT_CHANNELS, [exports.PATH, exports.ORDER, exports.DETAIL, exports.TEXT, exports.LABEL, exports.X2, exports.Y2]);
exports.NONSPATIAL_CHANNELS = util_1.without(exports.UNIT_CHANNELS, [exports.X, exports.Y, exports.X2, exports.Y2]);
exports.NONSPATIAL_SCALE_CHANNELS = util_1.without(exports.UNIT_SCALE_CHANNELS, [exports.X, exports.Y, exports.X2, exports.Y2]);
/** Channels that can serve as groupings for stacked charts. */
exports.STACK_GROUP_CHANNELS = [exports.COLOR, exports.DETAIL, exports.ORDER, exports.OPACITY, exports.SIZE];
;
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
function supportMark(channel, mark) {
    return !!getSupportedMark(channel)[mark];
}
exports.supportMark = supportMark;
/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
function getSupportedMark(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.DETAIL:
        case exports.ORDER:
        case exports.OPACITY:
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, line: true, area: true, text: true
            };
        case exports.X2:
        case exports.Y2:
            return {
                rule: true, bar: true, area: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, text: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
        case exports.PATH:
            return { line: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
;
/**
 * Return whether a channel supports dimension / measure role
 * @param  channel
 * @return A dictionary mapping role to boolean values.
 */
function getSupportedRole(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.OPACITY:
        case exports.LABEL:
        case exports.DETAIL:
            return {
                measure: true,
                dimension: true
            };
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
            return {
                measure: false,
                dimension: true
            };
        case exports.X2:
        case exports.Y2:
        case exports.SIZE:
        case exports.TEXT:
            return {
                measure: true,
                dimension: false
            };
        case exports.PATH:
            return {
                measure: false,
                dimension: true
            };
    }
    throw new Error('Invalid encoding channel' + channel);
}
exports.getSupportedRole = getSupportedRole;
function hasScale(channel) {
    return !util_1.contains([exports.DETAIL, exports.PATH, exports.TEXT, exports.LABEL, exports.ORDER], channel);
}
exports.hasScale = hasScale;

},{"./util":55}],47:[function(require,module,exports){
// DateTime definition object
"use strict";
var util_1 = require('./util');
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
    if (util_1.isNumber(q)) {
        // We accept 1-based quarter, so need to readjust to 0-based quarter
        return (q - 1) + '';
    }
    else {
        // Simply an expression string, but normalize should not be called in this case.
        console.warn('Potentially invalid quarter', q);
        return q;
    }
}
function normalizeMonth(m) {
    if (util_1.isNumber(m)) {
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
        // Simply an expression string, but normalize should not be called in this case.
        console.warn('Potentially invalid month', m);
        return m;
    }
}
function normalizeDay(d) {
    if (util_1.isNumber(d)) {
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
        // Simply an expression string, but normalize should not be called in this case.
        console.warn('Potentially invalid day', d);
        return d;
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
        for (var _i = 0, _a = ['year', 'quarter', 'month', 'date']; _i < _a.length; _i++) {
            var unit = _a[_i];
            if (d[unit] !== undefined) {
                console.warn('Dropping day from datetime', JSON.stringify(d), 'as day cannot be combined with', unit);
                d = util_1.duplicate(d);
                delete d.day;
                break;
            }
        }
    }
    if (d.year !== undefined) {
        units.push(d.year);
    }
    else if (d.day !== undefined) {
        // Set year to 2006 for working with day since January 1 2006 is a Sunday
        units.push(2006);
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
    for (var _b = 0, _c = ['hours', 'minutes', 'seconds', 'milliseconds']; _b < _c.length; _b++) {
        var timeUnit = _c[_b];
        if (d[timeUnit] !== undefined) {
            units.push(d[timeUnit]);
        }
        else {
            units.push(0);
        }
    }
    return 'datetime(' + units.join(', ') + ')';
}
exports.dateTimeExpr = dateTimeExpr;

},{"./util":55}],48:[function(require,module,exports){
"use strict";
var channel_1 = require('./channel');
var util_1 = require('./util');
function countRetinal(encoding) {
    var count = 0;
    if (encoding.color) {
        count++;
    }
    if (encoding.opacity) {
        count++;
    }
    if (encoding.size) {
        count++;
    }
    if (encoding.shape) {
        count++;
    }
    return count;
}
exports.countRetinal = countRetinal;
function channels(encoding) {
    return channel_1.CHANNELS.filter(function (channel) {
        return has(encoding, channel);
    });
}
exports.channels = channels;
// TOD: rename this to hasChannelField and only use we really want it.
function has(encoding, channel) {
    var channelEncoding = encoding && encoding[channel];
    return channelEncoding && (channelEncoding.field !== undefined ||
        // TODO: check that we have field in the array
        (util_1.isArray(channelEncoding) && channelEncoding.length > 0));
}
exports.has = has;
function isAggregate(encoding) {
    return util_1.some(channel_1.CHANNELS, function (channel) {
        if (has(encoding, channel) && encoding[channel].aggregate) {
            return true;
        }
        return false;
    });
}
exports.isAggregate = isAggregate;
function isRanged(encoding) {
    return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}
exports.isRanged = isRanged;
function fieldDefs(encoding) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            if (util_1.isArray(encoding[channel])) {
                encoding[channel].forEach(function (fieldDef) {
                    arr.push(fieldDef);
                });
            }
            else {
                arr.push(encoding[channel]);
            }
        }
    });
    return arr;
}
exports.fieldDefs = fieldDefs;
;
function forEach(encoding, f, thisArg) {
    channelMappingForEach(channel_1.CHANNELS, encoding, f, thisArg);
}
exports.forEach = forEach;
function channelMappingForEach(channels, mapping, f, thisArg) {
    var i = 0;
    channels.forEach(function (channel) {
        if (has(mapping, channel)) {
            if (util_1.isArray(mapping[channel])) {
                mapping[channel].forEach(function (fieldDef) {
                    f.call(thisArg, fieldDef, channel, i++);
                });
            }
            else {
                f.call(thisArg, mapping[channel], channel, i++);
            }
        }
    });
}
exports.channelMappingForEach = channelMappingForEach;
function map(encoding, f, thisArg) {
    return channelMappingMap(channel_1.CHANNELS, encoding, f, thisArg);
}
exports.map = map;
function channelMappingMap(channels, mapping, f, thisArg) {
    var arr = [];
    channels.forEach(function (channel) {
        if (has(mapping, channel)) {
            if (util_1.isArray(mapping[channel])) {
                mapping[channel].forEach(function (fieldDef) {
                    arr.push(f.call(thisArg, fieldDef, channel));
                });
            }
            else {
                arr.push(f.call(thisArg, mapping[channel], channel));
            }
        }
    });
    return arr;
}
exports.channelMappingMap = channelMappingMap;
function reduce(encoding, f, init, thisArg) {
    return channelMappingReduce(channel_1.CHANNELS, encoding, f, init, thisArg);
}
exports.reduce = reduce;
function channelMappingReduce(channels, mapping, f, init, thisArg) {
    var r = init;
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(mapping, channel)) {
            if (util_1.isArray(mapping[channel])) {
                mapping[channel].forEach(function (fieldDef) {
                    r = f.call(thisArg, r, fieldDef, channel);
                });
            }
            else {
                r = f.call(thisArg, r, mapping[channel], channel);
            }
        }
    });
    return r;
}
exports.channelMappingReduce = channelMappingReduce;

},{"./channel":46,"./util":55}],49:[function(require,module,exports){
"use strict";
(function (Mark) {
    Mark[Mark["AREA"] = 'area'] = "AREA";
    Mark[Mark["BAR"] = 'bar'] = "BAR";
    Mark[Mark["LINE"] = 'line'] = "LINE";
    Mark[Mark["POINT"] = 'point'] = "POINT";
    Mark[Mark["TEXT"] = 'text'] = "TEXT";
    Mark[Mark["TICK"] = 'tick'] = "TICK";
    Mark[Mark["RULE"] = 'rule'] = "RULE";
    Mark[Mark["CIRCLE"] = 'circle'] = "CIRCLE";
    Mark[Mark["SQUARE"] = 'square'] = "SQUARE";
    Mark[Mark["ERRORBAR"] = 'errorBar'] = "ERRORBAR";
})(exports.Mark || (exports.Mark = {}));
var Mark = exports.Mark;
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.TICK = Mark.TICK;
exports.RULE = Mark.RULE;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;
exports.ERRORBAR = Mark.ERRORBAR;
exports.PRIMITIVE_MARKS = [exports.AREA, exports.BAR, exports.LINE, exports.POINT, exports.TEXT, exports.TICK, exports.RULE, exports.CIRCLE, exports.SQUARE];

},{}],50:[function(require,module,exports){
"use strict";
(function (ScaleType) {
    ScaleType[ScaleType["LINEAR"] = 'linear'] = "LINEAR";
    ScaleType[ScaleType["LOG"] = 'log'] = "LOG";
    ScaleType[ScaleType["POW"] = 'pow'] = "POW";
    ScaleType[ScaleType["SQRT"] = 'sqrt'] = "SQRT";
    ScaleType[ScaleType["QUANTILE"] = 'quantile'] = "QUANTILE";
    ScaleType[ScaleType["QUANTIZE"] = 'quantize'] = "QUANTIZE";
    ScaleType[ScaleType["ORDINAL"] = 'ordinal'] = "ORDINAL";
    ScaleType[ScaleType["TIME"] = 'time'] = "TIME";
    ScaleType[ScaleType["UTC"] = 'utc'] = "UTC";
})(exports.ScaleType || (exports.ScaleType = {}));
var ScaleType = exports.ScaleType;
(function (NiceTime) {
    NiceTime[NiceTime["SECOND"] = 'second'] = "SECOND";
    NiceTime[NiceTime["MINUTE"] = 'minute'] = "MINUTE";
    NiceTime[NiceTime["HOUR"] = 'hour'] = "HOUR";
    NiceTime[NiceTime["DAY"] = 'day'] = "DAY";
    NiceTime[NiceTime["WEEK"] = 'week'] = "WEEK";
    NiceTime[NiceTime["MONTH"] = 'month'] = "MONTH";
    NiceTime[NiceTime["YEAR"] = 'year'] = "YEAR";
})(exports.NiceTime || (exports.NiceTime = {}));
var NiceTime = exports.NiceTime;
(function (BandSize) {
    BandSize[BandSize["FIT"] = 'fit'] = "FIT";
})(exports.BandSize || (exports.BandSize = {}));
var BandSize = exports.BandSize;
exports.BANDSIZE_FIT = BandSize.FIT;
exports.defaultScaleConfig = {
    round: true,
    textBandWidth: 90,
    bandSize: 21,
    padding: 0.1,
    useRawDomain: false,
    opacity: [0.3, 0.8],
    nominalColorRange: 'category10',
    sequentialColorRange: ['#AFC6A3', '#09622A'],
    shapeRange: 'shapes',
    fontSizeRange: [8, 40],
    ruleSizeRange: [1, 5],
    tickSizeRange: [1, 20]
};
exports.defaultFacetScaleConfig = {
    round: true,
    padding: 16
};

},{}],51:[function(require,module,exports){
"use strict";
(function (SortOrder) {
    SortOrder[SortOrder["ASCENDING"] = 'ascending'] = "ASCENDING";
    SortOrder[SortOrder["DESCENDING"] = 'descending'] = "DESCENDING";
    SortOrder[SortOrder["NONE"] = 'none'] = "NONE";
})(exports.SortOrder || (exports.SortOrder = {}));
var SortOrder = exports.SortOrder;
function isSortField(sort) {
    return !!sort && !!sort['field'] && !!sort['op'];
}
exports.isSortField = isSortField;

},{}],52:[function(require,module,exports){
"use strict";
var channel_1 = require('./channel');
var encoding_1 = require('./encoding');
var mark_1 = require('./mark');
var util_1 = require('./util');
(function (StackOffset) {
    StackOffset[StackOffset["ZERO"] = 'zero'] = "ZERO";
    StackOffset[StackOffset["CENTER"] = 'center'] = "CENTER";
    StackOffset[StackOffset["NORMALIZE"] = 'normalize'] = "NORMALIZE";
    StackOffset[StackOffset["NONE"] = 'none'] = "NONE";
})(exports.StackOffset || (exports.StackOffset = {}));
var StackOffset = exports.StackOffset;
function stack(mark, encoding, config) {
    var stacked = (config && config.mark) ? config.mark.stacked : undefined;
    // Should not have stack explicitly disabled
    if (util_1.contains([StackOffset.NONE, null, false], stacked)) {
        return null;
    }
    // Should have stackable mark
    if (!util_1.contains([mark_1.BAR, mark_1.AREA], mark)) {
        return null;
    }
    // Should be aggregate plot
    if (!encoding_1.isAggregate(encoding)) {
        return null;
    }
    // Should have grouping level of detail
    var stackByChannels = channel_1.STACK_GROUP_CHANNELS.reduce(function (sc, channel) {
        if (encoding_1.has(encoding, channel) && !encoding[channel].aggregate) {
            sc.push(channel);
        }
        return sc;
    }, []);
    if (stackByChannels.length === 0) {
        return null;
    }
    // Has only one aggregate axis
    var hasXField = encoding_1.has(encoding, channel_1.X);
    var hasYField = encoding_1.has(encoding, channel_1.Y);
    var xIsAggregate = hasXField && !!encoding.x.aggregate;
    var yIsAggregate = hasYField && !!encoding.y.aggregate;
    if (xIsAggregate !== yIsAggregate) {
        return {
            groupbyChannel: xIsAggregate ? (hasYField ? channel_1.Y : null) : (hasXField ? channel_1.X : null),
            fieldChannel: xIsAggregate ? channel_1.X : channel_1.Y,
            stackByChannels: stackByChannels,
            offset: stacked || StackOffset.ZERO
        };
    }
    return null;
}
exports.stack = stack;

},{"./channel":46,"./encoding":48,"./mark":49,"./util":55}],53:[function(require,module,exports){
"use strict";
var channel_1 = require('./channel');
var datetime_1 = require('./datetime');
var scale_1 = require('./scale');
var util_1 = require('./util');
(function (TimeUnit) {
    TimeUnit[TimeUnit["YEAR"] = 'year'] = "YEAR";
    TimeUnit[TimeUnit["MONTH"] = 'month'] = "MONTH";
    TimeUnit[TimeUnit["DAY"] = 'day'] = "DAY";
    TimeUnit[TimeUnit["DATE"] = 'date'] = "DATE";
    TimeUnit[TimeUnit["HOURS"] = 'hours'] = "HOURS";
    TimeUnit[TimeUnit["MINUTES"] = 'minutes'] = "MINUTES";
    TimeUnit[TimeUnit["SECONDS"] = 'seconds'] = "SECONDS";
    TimeUnit[TimeUnit["MILLISECONDS"] = 'milliseconds'] = "MILLISECONDS";
    TimeUnit[TimeUnit["YEARMONTH"] = 'yearmonth'] = "YEARMONTH";
    // Note: don't add MONTH DATE because it will be incorrect
    // since days on a leap year will be shifted by one if
    // we only add
    TimeUnit[TimeUnit["YEARMONTHDATE"] = 'yearmonthdate'] = "YEARMONTHDATE";
    TimeUnit[TimeUnit["YEARMONTHDATEHOURS"] = 'yearmonthdatehours'] = "YEARMONTHDATEHOURS";
    TimeUnit[TimeUnit["YEARMONTHDATEHOURSMINUTES"] = 'yearmonthdatehoursminutes'] = "YEARMONTHDATEHOURSMINUTES";
    TimeUnit[TimeUnit["YEARMONTHDATEHOURSMINUTESSECONDS"] = 'yearmonthdatehoursminutesseconds'] = "YEARMONTHDATEHOURSMINUTESSECONDS";
    TimeUnit[TimeUnit["HOURSMINUTES"] = 'hoursminutes'] = "HOURSMINUTES";
    TimeUnit[TimeUnit["HOURSMINUTESSECONDS"] = 'hoursminutesseconds'] = "HOURSMINUTESSECONDS";
    TimeUnit[TimeUnit["MINUTESSECONDS"] = 'minutesseconds'] = "MINUTESSECONDS";
    TimeUnit[TimeUnit["SECONDSMILLISECONDS"] = 'secondsmilliseconds'] = "SECONDSMILLISECONDS";
    TimeUnit[TimeUnit["QUARTER"] = 'quarter'] = "QUARTER";
    TimeUnit[TimeUnit["YEARQUARTER"] = 'yearquarter'] = "YEARQUARTER";
    TimeUnit[TimeUnit["QUARTERMONTH"] = 'quartermonth'] = "QUARTERMONTH";
    TimeUnit[TimeUnit["YEARQUARTERMONTH"] = 'yearquartermonth'] = "YEARQUARTERMONTH";
})(exports.TimeUnit || (exports.TimeUnit = {}));
var TimeUnit = exports.TimeUnit;
/** Time Unit that only corresponds to only one part of Date objects. */
exports.SINGLE_TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.QUARTER,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
];
var SINGLE_TIMEUNIT_INDEX = exports.SINGLE_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isSingleTimeUnit(timeUnit) {
    return !!SINGLE_TIMEUNIT_INDEX[timeUnit];
}
exports.isSingleTimeUnit = isSingleTimeUnit;
/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
function convert(unit, date) {
    var result = new Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date
    exports.SINGLE_TIMEUNITS.forEach(function (singleUnit) {
        if (containsTimeUnit(unit, singleUnit)) {
            switch (singleUnit) {
                case TimeUnit.DAY:
                    throw new Error('Cannot convert to TimeUnits containing \'day\'');
                case TimeUnit.YEAR:
                    result.setFullYear(date.getFullYear());
                    break;
                case TimeUnit.QUARTER:
                    // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
                    result.setMonth((Math.floor(date.getMonth() / 3)) * 3);
                    break;
                case TimeUnit.MONTH:
                    result.setMonth(date.getMonth());
                    break;
                case TimeUnit.DATE:
                    result.setDate(date.getDate());
                    break;
                case TimeUnit.HOURS:
                    result.setHours(date.getHours());
                    break;
                case TimeUnit.MINUTES:
                    result.setMinutes(date.getMinutes());
                    break;
                case TimeUnit.SECONDS:
                    result.setSeconds(date.getSeconds());
                    break;
                case TimeUnit.MILLISECONDS:
                    result.setMilliseconds(date.getMilliseconds());
                    break;
            }
        }
    });
    return result;
}
exports.convert = convert;
exports.MULTI_TIMEUNITS = [
    TimeUnit.YEARQUARTER,
    TimeUnit.YEARQUARTERMONTH,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARMONTHDATEHOURS,
    TimeUnit.YEARMONTHDATEHOURSMINUTES,
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
    TimeUnit.QUARTERMONTH,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS,
];
var MULTI_TIMEUNIT_INDEX = exports.MULTI_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isMultiTimeUnit(timeUnit) {
    return !!MULTI_TIMEUNIT_INDEX[timeUnit];
}
exports.isMultiTimeUnit = isMultiTimeUnit;
exports.TIMEUNITS = exports.SINGLE_TIMEUNITS.concat(exports.MULTI_TIMEUNITS);
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
function containsTimeUnit(fullTimeUnit, timeUnit) {
    var fullTimeUnitStr = fullTimeUnit.toString();
    var timeUnitStr = timeUnit.toString();
    var index = fullTimeUnitStr.indexOf(timeUnitStr);
    return index > -1 &&
        (timeUnit !== TimeUnit.SECONDS ||
            index === 0 ||
            fullTimeUnitStr.charAt(index - 1) !== 'i' // exclude milliseconds
        );
}
exports.containsTimeUnit = containsTimeUnit;
function defaultScaleType(timeUnit) {
    switch (timeUnit) {
        case TimeUnit.HOURS:
        case TimeUnit.DAY:
        case TimeUnit.MONTH:
        case TimeUnit.QUARTER:
            return scale_1.ScaleType.ORDINAL;
    }
    // date, year, minute, second, yearmonth, monthday, ...
    return scale_1.ScaleType.TIME;
}
exports.defaultScaleType = defaultScaleType;
/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
function fieldExpr(fullTimeUnit, field) {
    var fieldRef = 'datum["' + field + '"]';
    function func(timeUnit) {
        if (timeUnit === TimeUnit.QUARTER) {
            // Divide by 3 to get the corresponding quarter number, multiply by 3
            // to scale to the first month of the corresponding quarter(0,3,6,9).
            return 'floor(month(' + fieldRef + ')' + '/3)';
        }
        else {
            return timeUnit + '(' + fieldRef + ')';
        }
    }
    var d = exports.SINGLE_TIMEUNITS.reduce(function (_d, tu) {
        if (containsTimeUnit(fullTimeUnit, tu)) {
            _d[tu] = func(tu);
        }
        return _d;
    }, {});
    if (d.day && util_1.keys(d).length > 1) {
        console.warn('Time unit "' + fullTimeUnit + '" is not supported. We are replacing it with ', (fullTimeUnit + '').replace('day', 'date') + '.');
        delete d.day;
        d.date = func(TimeUnit.DATE);
    }
    return datetime_1.dateTimeExpr(d);
}
exports.fieldExpr = fieldExpr;
/** Generate the complete raw domain. */
function rawDomain(timeUnit, channel) {
    if (util_1.contains([channel_1.ROW, channel_1.COLUMN, channel_1.SHAPE, channel_1.COLOR], channel)) {
        return null;
    }
    switch (timeUnit) {
        case TimeUnit.SECONDS:
            return util_1.range(0, 60);
        case TimeUnit.MINUTES:
            return util_1.range(0, 60);
        case TimeUnit.HOURS:
            return util_1.range(0, 24);
        case TimeUnit.DAY:
            return util_1.range(0, 7);
        case TimeUnit.DATE:
            return util_1.range(1, 32);
        case TimeUnit.MONTH:
            return util_1.range(0, 12);
        case TimeUnit.QUARTER:
            return [0, 3, 6, 9];
    }
    return null;
}
exports.rawDomain = rawDomain;
/** returns the smallest nice unit for scale.nice */
function smallestUnit(timeUnit) {
    if (!timeUnit) {
        return undefined;
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        return 'second';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        return 'minute';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        return 'hour';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY) ||
        containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        return 'day';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        return 'month';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
        return 'year';
    }
    return undefined;
}
exports.smallestUnit = smallestUnit;
/** returns the template name used for axis labels for a time unit */
function template(timeUnit, field, shortTimeLabels) {
    if (!timeUnit) {
        return undefined;
    }
    var dateComponents = [];
    if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
        dateComponents.push(shortTimeLabels ? '%y' : '%Y');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
        // special template for quarter
        dateComponents.push('\'}}Q{{' + field + ' | quarter}}{{' + field + ' | time:\'');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        dateComponents.push(shortTimeLabels ? '%b' : '%B');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
        dateComponents.push(shortTimeLabels ? '%a' : '%A');
    }
    else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        dateComponents.push('%d');
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
    var out = [];
    if (dateComponents.length > 0) {
        out.push(dateComponents.join('-'));
    }
    if (timeComponents.length > 0) {
        out.push(timeComponents.join(':'));
    }
    if (out.length > 0) {
        // clean up empty formatting expressions that may have been generated by the quarter time unit
        var template_1 = '{{' + field + ' | time:\'' + out.join(' ') + '\'}}';
        // FIXME: Remove these RegExp Hacks!!!
        var escapedField = field.replace(/(\[|\])/g, '\\$1'); // excape field for use in Regex
        return template_1.replace(new RegExp('{{' + escapedField + ' \\| time:\'\'}}', 'g'), ''); // remove empty templates with Regex
    }
    else {
        return undefined;
    }
}
exports.template = template;

},{"./channel":46,"./datetime":47,"./scale":50,"./util":55}],54:[function(require,module,exports){
/** Constants and utilities for data type */
"use strict";
(function (Type) {
    Type[Type["QUANTITATIVE"] = 'quantitative'] = "QUANTITATIVE";
    Type[Type["ORDINAL"] = 'ordinal'] = "ORDINAL";
    Type[Type["TEMPORAL"] = 'temporal'] = "TEMPORAL";
    Type[Type["NOMINAL"] = 'nominal'] = "NOMINAL";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
exports.QUANTITATIVE = Type.QUANTITATIVE;
exports.ORDINAL = Type.ORDINAL;
exports.TEMPORAL = Type.TEMPORAL;
exports.NOMINAL = Type.NOMINAL;
/**
 * Mapping from full type names to short type names.
 * @type {Object}
 */
exports.SHORT_TYPE = {
    quantitative: 'Q',
    temporal: 'T',
    nominal: 'N',
    ordinal: 'O'
};
/**
 * Mapping from short type names to full type names.
 * @type {Object}
 */
exports.TYPE_FROM_SHORT_TYPE = {
    Q: exports.QUANTITATIVE,
    T: exports.TEMPORAL,
    O: exports.ORDINAL,
    N: exports.NOMINAL
};
/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
function getFullName(type) {
    var typeString = type; // force type as string so we can translate short types
    return exports.TYPE_FROM_SHORT_TYPE[typeString.toUpperCase()] ||
        typeString.toLowerCase();
}
exports.getFullName = getFullName;

},{}],55:[function(require,module,exports){
/// <reference path="../typings/datalib.d.ts"/>
/// <reference path="../typings/json-stable-stringify.d.ts"/>
"use strict";
var stringify = require('json-stable-stringify');
var util_1 = require('datalib/src/util');
exports.keys = util_1.keys;
exports.extend = util_1.extend;
exports.duplicate = util_1.duplicate;
exports.isArray = util_1.isArray;
exports.vals = util_1.vals;
exports.truncate = util_1.truncate;
exports.toMap = util_1.toMap;
exports.isObject = util_1.isObject;
exports.isString = util_1.isString;
exports.isNumber = util_1.isNumber;
exports.isBoolean = util_1.isBoolean;
var util_2 = require('datalib/src/util');
var util_3 = require('datalib/src/util');
/**
 * Creates an object composed of the picked object properties.
 *
 * Example:  (from lodash)
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 * pick(object, ['a', 'c']);
 * // → { 'a': 1, 'c': 3 }
 *
 */
function pick(obj, props) {
    var copy = {};
    props.forEach(function (prop) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    });
    return copy;
}
exports.pick = pick;
// Copied from datalib
function range(start, stop, step) {
    if (arguments.length < 3) {
        step = 1;
        if (arguments.length < 2) {
            stop = start;
            start = 0;
        }
    }
    if ((stop - start) / step === Infinity) {
        throw new Error('Infinite range');
    }
    var range = [], i = -1, j;
    if (step < 0) {
        /* tslint:disable */
        while ((j = start + step * ++i) > stop) {
            range.push(j);
        }
    }
    else {
        while ((j = start + step * ++i) < stop) {
            range.push(j);
        }
    }
    return range;
}
exports.range = range;
;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
function omit(obj, props) {
    var copy = util_2.duplicate(obj);
    props.forEach(function (prop) {
        delete copy[prop];
    });
    return copy;
}
exports.omit = omit;
function hash(a) {
    if (util_3.isString(a) || util_3.isNumber(a) || util_3.isBoolean(a)) {
        return String(a);
    }
    return stringify(a);
}
exports.hash = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) {
        return !contains(excludedItems, item);
    });
}
exports.without = without;
function union(array, other) {
    return array.concat(without(other, array));
}
exports.union = union;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                f.call(thisArg, obj[k], k, obj);
            }
        }
    }
}
exports.forEach = forEach;
function reduce(obj, f, init, thisArg) {
    if (obj.reduce) {
        return obj.reduce.call(thisArg, f, init);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                init = f.call(thisArg, init, obj[k], k, obj);
            }
        }
        return init;
    }
}
exports.reduce = reduce;
function map(obj, f, thisArg) {
    if (obj.map) {
        return obj.map.call(thisArg, f);
    }
    else {
        var output = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                output.push(f.call(thisArg, obj[k], k, obj));
            }
        }
        return output;
    }
}
exports.map = map;
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
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < src.length; i++) {
        dest = deepMerge_(dest, src[i]);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
;
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
        if (typeof src[p] !== 'object' || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
function unique(values, f) {
    var results = [];
    var u = {}, v, i, n;
    for (i = 0, n = values.length; i < n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(values[i]);
    }
    return results;
}
exports.unique = unique;
;
function warning(message) {
    console.warn('[VL Warning]', message);
}
exports.warning = warning;
function error(message) {
    console.error('[VL Error]', message);
}
exports.error = error;
/**
 * Returns true if the two dicitonaries disagree. Applies only to defioned values.
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

},{"datalib/src/util":38,"json-stable-stringify":39}]},{},[14])(14)
});
//# sourceMappingURL=compassql.js.map
