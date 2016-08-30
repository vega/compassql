import {Type} from 'vega-lite/src/type';
import {Channel} from 'vega-lite/src/channel';
import {autoMaxBins} from 'vega-lite/src/bin';
import {TimeUnit, containsTimeUnit, convert, SINGLE_TIMEUNITS} from 'vega-lite/src/timeunit';
import {summary} from 'datalib/src/stats';
import {inferAll} from 'datalib/src/import/type';
import * as dlBin from 'datalib/src/bins/bins';

import {BinQuery, EncodingQuery} from './query/encoding';
import {QueryConfig, DEFAULT_QUERY_CONFIG} from './config';
import {cmp, extend, keys} from './util';

export class Schema {
  private _fieldSchemas: FieldSchema[];
  private _fieldSchemaIndex: {[field: string]: FieldSchema};

  /**
   * Build a Schema object.
   *
   * @param data - a set of raw data
   * @return a Schema object
   */
  public static build(data: any, opt: QueryConfig = {}): Schema {
    opt = extend({}, DEFAULT_QUERY_CONFIG, opt);

    // create profiles for each variable
    var summaries: Summary[] = summary(data);
    var types = inferAll(data); // inferAll does stronger type inference than summary

    var fieldSchemas: FieldSchema[] = summaries.map(function(summary) {
      var field: string = summary.field;
      var primitiveType: PrimitiveType = types[field] as any;
      var distinct: number = summary.distinct;
      var type: Type;

      if (primitiveType === PrimitiveType.NUMBER) {
        type = Type.QUANTITATIVE;
      } else if (primitiveType === PrimitiveType.INTEGER) {
        // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
        if ((distinct < opt.numberNominalLimit) && (distinct / summary.count < opt.numberNominalProportion)) {
          type = Type.NOMINAL;
        } else {
          type = Type.QUANTITATIVE;
        }
      } else if (primitiveType === PrimitiveType.DATE) {
        type = Type.TEMPORAL;
        // need to get correct min/max of date data because datalib's summary method does not
        // calculate this correctly for date types.
        summary.min = new Date(data[0][field]);
        summary.max = new Date(data[0][field]);
        for (var i = 0; i < data.length; i++) {
          const time = new Date(data[i][field]).getTime();
          if (time < (summary.min as Date).getTime()) {
            summary.min = new Date(time);
          }
          if (time > (summary.max as Date).getTime()) {
            summary.max = new Date(time);
          }
        }
      } else {
        type = Type.NOMINAL;
      }
      return {
        field: field,
        type: type,
        primitiveType: primitiveType,
        stats: summary,
        timeStats: {} as {[timeUnit: string]: Summary},
        binStats: {} as {[key: string]: Summary}
      };
    });

    // order the fieldSchemas (sort them)
    const order = {
      'nominal': 0,
      'ordinal': 1,
      'temporal': 2,
      'quantitative': 3
    };
    fieldSchemas.sort(function(a: FieldSchema, b: FieldSchema) {
      // first order by type: nominal < temporal < quantitative < ordinal
      if (order[a.type] < order[b.type]) {
        return -1;
      } else if (order[a.type] > order[b.type]) {
        return 1;
      } else {
        // then order by field (alphabetically)
        return a.field.localeCompare(b.field);
      }
    });

    // Add index for sorting
    fieldSchemas.forEach((fieldSchema, index) => fieldSchema.index = index);

    // calculate preset bins for quantitative and temporal data
    for (let fieldSchema of fieldSchemas) {
      if (fieldSchema.type === Type.QUANTITATIVE) {
        for (let maxbins of opt.maxBinsList) {
          fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
        }
      } else if (fieldSchema.type === Type.TEMPORAL) {
        for (let unit of opt.timeUnits) {
          if (unit !== undefined) {
            fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
          }
        }
      }
    }

    return new Schema(fieldSchemas);
  }

  constructor(fieldSchemas: FieldSchema[]) {
    this._fieldSchemas = fieldSchemas;
    this._fieldSchemaIndex = fieldSchemas.reduce((m, fieldSchema: FieldSchema) => {
      m[fieldSchema.field] = fieldSchema;
      return m;
    }, {});
  }

  /** @return a list of the field names. */
  public fields() {
    return this._fieldSchemas.map((fieldSchema) => fieldSchema.field);
  }

  /** @return a list of FieldSchemas */
  public get fieldSchemas() {
    return this._fieldSchemas;
  }

  public fieldSchema(field: string) {
    return this._fieldSchemaIndex[field];
  }

  /**
   * @return primitive type of the field if exist, otherwise return null
   */
  public primitiveType(field: string) {
    return this._fieldSchemaIndex[field] ? this._fieldSchemaIndex[field].primitiveType : null;
  }

  /**
   * @return type of measturement of the field if exist, otherwise return null
   */
  public type(field: string) {
    return this._fieldSchemaIndex[field] ? this._fieldSchemaIndex[field].type : null;
  }

  /** @return cardinality of the field associated with encQ, null if it doesn't exist.
   *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
   */
  public cardinality(encQ: EncodingQuery, augmentTimeUnitDomain: boolean = true, excludeInvalid: boolean = false) {
    const fieldSchema = this._fieldSchemaIndex[encQ.field as string];
    if (encQ.aggregate || encQ.autoCount) {
      return 1;
    } else if (encQ.bin) {
      // encQ.bin will either be a boolean or a BinQuery
      var bin: BinQuery;
      if (typeof encQ.bin === 'boolean') {
        // autoMaxBins defaults to 10 if channel is EnumSpec
        bin = {
          maxbins: autoMaxBins(encQ.channel as Channel)
        };
      } else {
        bin = encQ.bin;
      }
      const maxbins: any = bin.maxbins;
      if (!fieldSchema.binStats[maxbins]) {
        // need to calculate
        fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
      }
      // don't need to worry about excludeInvalid here because invalid values don't affect linearly binned field's cardinality
      return fieldSchema.binStats[maxbins].distinct;
    } else if (encQ.timeUnit) {
      if (augmentTimeUnitDomain) {
        switch (encQ.timeUnit) {
          // TODO: this should not always be the case once Vega-Lite supports turning off domain augmenting (VL issue #1385)
          case TimeUnit.SECONDS: return 60;
          case TimeUnit.MINUTES: return 60;
          case TimeUnit.HOURS: return 24;
          case TimeUnit.DAY: return 7;
          case TimeUnit.DATE: return 31;
          case TimeUnit.MONTH: return 12;
          case TimeUnit.QUARTER: return 4;
          case TimeUnit.MILLISECONDS: return 1000;
        }
      }
      var unit = encQ.timeUnit as string;
      var timeStats = fieldSchema.timeStats;
      // if the cardinality for the timeUnit is not cached, calculate it
      if (!timeStats[unit]) {
        timeStats[unit] = timeSummary(encQ.timeUnit as TimeUnit, fieldSchema.stats);
      }

      if (excludeInvalid) {
        return timeStats[unit].distinct - invalidCount(timeStats[unit].unique, ['Invalid Date', null]);
      } else {
        return timeStats[unit].distinct;
      }
    } else {
      if (fieldSchema) {
        if (excludeInvalid) {
          return fieldSchema.stats.distinct - invalidCount(fieldSchema.stats.unique, [NaN, null]);
        } else {
          return fieldSchema.stats.distinct;
        }
      } else {
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
  public timeUnitHasVariation(encQ: EncodingQuery): boolean {
    if (!encQ.timeUnit) {
      return;
    }

    // if there is no variation in `date`, there should not be variation in `day`
    if (encQ.timeUnit === TimeUnit.DAY) {
      const dateEncQ: EncodingQuery = extend({}, encQ, {timeUnit: TimeUnit.DATE});
      if (this.cardinality(dateEncQ, false, true) <= 1) {
        return false;
      }
    }

    let fullTimeUnit = encQ.timeUnit;
    for (let singleUnit of SINGLE_TIMEUNITS) {
      if (containsTimeUnit(fullTimeUnit as TimeUnit, singleUnit)) {
        encQ.timeUnit = singleUnit;
        if (this.cardinality(encQ, false, true) <= 1) {
          return false;
        }
      }
    }
    return true;
  }

  public domain(encQ: EncodingQuery): any[] {
    // TODO: differentiate for field with bin / timeUnit
    const fieldSchema = this._fieldSchemaIndex[encQ.field as string];
    var domain: any[] = keys(fieldSchema.stats.unique);
    if (fieldSchema.type === Type.QUANTITATIVE) {
      // return [min, max], coerced into number types
      return [+fieldSchema.stats.min, +fieldSchema.stats.max];
    } else if (fieldSchema.primitiveType === PrimitiveType.DATE) {
      // return [min, max] dates
      return [fieldSchema.stats.min, fieldSchema.stats.max];
    } else if (fieldSchema.primitiveType === PrimitiveType.INTEGER ||
        fieldSchema.primitiveType === PrimitiveType.NUMBER) {
      // coerce non-quantitative numerical data into number type
      domain = domain.map(x => +x);
      return domain.sort(cmp);
    }

    return domain.map((x) => {
      // Convert 'null' to null as it is encoded similarly in datalib.
      // This is wrong when it is a string 'null' but that rarely happens.
      return x==='null' ? null : x;
    }).sort(cmp);
  }

  /**
   * @return a Summary corresponding to the field of the given EncodingQuery
   */
  public stats(encQ: EncodingQuery) {
    // TODO: differentiate for field with bin / timeUnit vs without
    const fieldSchema = this._fieldSchemaIndex[encQ.field as string];
    return fieldSchema ? fieldSchema.stats : null;
  }
}

/**
 * @return a summary of the binning scheme determined from the given max number of bins
 */
function binSummary(maxbins: number, summary: Summary): Summary {
  const bin = dlBin({
    min: summary.min,
    max: summary.max,
    maxbins: maxbins
  });

  // start with summary, pre-binning
  const result = extend({}, summary);
  result.unique = binUnique(bin, summary.unique);
  result.distinct = (bin.stop - bin.start) / bin.step;
  result.min = bin.start;
  result.max = bin.stop;

  return result;
}

/** @return a modified version of the passed summary with unique and distinct set according to the timeunit.
 *  Maps 'null' (string) keys to the null value and invalid dates to 'Invalid Date' in the unique dictionary.
 */
function timeSummary(timeunit: TimeUnit, summary: Summary): Summary {
  const result = extend({}, summary);

  var unique: {[value: string]: number} = {};
  keys(summary.unique).forEach(function(dateString) {
    // don't convert null value because the Date constructor will actually convert it to a date
    let date: Date = (dateString === 'null') ? null : new Date(dateString);
    // at this point, `date` is either the null value, a valid Date object, or "Invalid Date" which is a Date
    let key: string;
    if (date === null) {
      key = null;
    } else if (isNaN(date.getTime())) {
      key = 'Invalid Date';
    } else {
      key = ((timeunit === TimeUnit.DAY) ? date.getDay() : convert(timeunit, date)).toString();
    }
    unique[key] = (unique[key] || 0) + summary.unique[dateString];
  });

  result.unique = unique;
  result.distinct = keys(unique).length;

  return result;
}

/**
 * @return a new unique object based off of the old unique count and a binning scheme
 */
function binUnique(bin, oldUnique) {
  const newUnique = {};
  for (var value in oldUnique) {
    let bucket: number;
    if (value === null) {
      bucket = null;
    } else if (isNaN(Number(value))) {
      bucket = NaN;
    } else {
      bucket = bin.value(Number(value)) as number;
    }
    newUnique[bucket] = (newUnique[bucket] || 0) + oldUnique[value];
  }
  return newUnique;
}

/** @return the number of items in list that occur as keys of unique */
function invalidCount(unique: {}, list: any[]) {
  return list.reduce(function(prev, cur) {
    return unique[cur] ? prev + 1 : prev;
  }, 0);
}

export enum PrimitiveType {
  STRING = 'string' as any,
  NUMBER = 'number' as any,
  INTEGER = 'integer' as any,
  BOOLEAN = 'boolean' as any,
  DATE = 'date' as any
}

export interface FieldSchema {
  field: string;
  type?: Type;
  /** number, integer, string, date  */
  primitiveType: PrimitiveType;
  stats: Summary;
  binStats?: {[key: string]: Summary};
  timeStats?: {[timeUnit: string]: Summary};
  title?: string;
  index?: number;
}
