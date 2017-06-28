import {Type as VLType} from 'vega-lite/build/src/type';
import {Channel} from 'vega-lite/build/src/channel';
import {autoMaxBins} from 'vega-lite/build/src/bin';
import {TimeUnit, containsTimeUnit, convert, SINGLE_TIMEUNITS} from 'vega-lite/build/src/timeunit';
import {summary} from 'datalib/src/stats';
import {inferAll} from 'datalib/src/import/type';
import * as dlBin from 'datalib/src/bins/bins';

import {BinQuery, EncodingQuery, FieldQuery, isAutoCountQuery} from './query/encoding';
import { ExpandedType } from './query/expandedtype';
import {QueryConfig, DEFAULT_QUERY_CONFIG} from './config';
import {cmp, duplicate, extend, keys} from './util';

/**
 * Table Schema Field Descriptor interface
 * see: https://specs.frictionlessdata.io/table-schema/
 */
export interface TableSchemaFieldDescriptor {
  /* name of field **/
  name: string;

  /* A nicer human readable label or title for the field **/
  title?: string;

  /* number, integer, string, datetime  */
  type: PrimitiveType;

  /* A string specifying a format */
  format?: string;

  /* A description for the field */
  description?: string;

}

/**
 * Field Schema
 */
export interface FieldSchema extends TableSchemaFieldDescriptor {
  vlType?: ExpandedType;

  index?: number;
  // Need to keep original index for re-exporting TableSchema
  originalIndex?: number;

  stats: DLFieldProfile;
  binStats?: {[maxbins: string]: DLFieldProfile};
  timeStats?: {[timeUnit: string]: DLFieldProfile};

  // array of valid input values (fields)
  ordinalDomain?: string[];
}

/**
 * Table Schema
 * see: https://specs.frictionlessdata.io/table-schema/
 */
export interface TableSchema<F extends TableSchemaFieldDescriptor> {
  fields: F[];
  missingValues?: string[];
  primaryKey?: string | string[];
  foreignKeys?: object[];
}

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
export function build(data: any,  tableSchema: TableSchema<TableSchemaFieldDescriptor> = {fields:[]}, opt: QueryConfig = {}): Schema {
  opt = extend({}, DEFAULT_QUERY_CONFIG, opt);

  // create profiles for each variable
  let summaries: DLFieldProfile[] = summary(data);
  let types = inferAll(data); // inferAll does stronger type inference than summary

  let tableSchemaFieldIndex = tableSchema.fields.reduce((m, field: TableSchemaFieldDescriptor) => {
    m[field.name] = field;
    return m;
  }, {});

  let fieldSchemas: FieldSchema[] = summaries.map(function(fieldProfile, index) {

    const name: string = fieldProfile.field;
    // In Table schema, 'date' doesn't include time so use 'datetime'
    const type: PrimitiveType = types[name] === 'date' ? PrimitiveType.DATETIME :  (types[name] as any);
    let distinct: number = fieldProfile.distinct;
    let vlType: ExpandedType;

    if (type === PrimitiveType.NUMBER) {
      vlType = VLType.QUANTITATIVE;
    } else if (type === PrimitiveType.INTEGER) {
      // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
      if ((distinct < opt.numberNominalLimit) && (distinct / fieldProfile.count < opt.numberNominalProportion)) {
        vlType = VLType.NOMINAL;
      } else {
        vlType = VLType.QUANTITATIVE;
      }
    } else if (type === PrimitiveType.DATETIME) {
      vlType = VLType.TEMPORAL;
      // need to get correct min/max of date data because datalib's summary method does not
      // calculate this correctly for date types.
      fieldProfile.min = new Date(data[0][name]);
      fieldProfile.max = new Date(data[0][name]);
      for (const dataEntry of data) {
        const time = new Date(dataEntry[name]).getTime();
        if (time < (fieldProfile.min as Date).getTime()) {
          fieldProfile.min = new Date(time);
        }
        if (time > (fieldProfile.max as Date).getTime()) {
          fieldProfile.max = new Date(time);
        }
      }
    } else {
      vlType = VLType.NOMINAL;
    }

    if (vlType === VLType.NOMINAL
      && distinct / fieldProfile.count > opt.minPercentUniqueForKey
      && fieldProfile.count > opt.minCardinalityForKey) {
      vlType = ExpandedType.KEY;
    }

    let fieldSchema = {
      name: name,
      // Need to keep original index for re-exporting TableSchema
      originalIndex: index,
      vlType: vlType,
      type: type,
      stats: fieldProfile,
      timeStats: {} as {[timeUnit: string]: DLFieldProfile},
      binStats: {} as {[key: string]: DLFieldProfile}
    };

    // extend field schema with table schema field - if present
    const orgFieldSchema = tableSchemaFieldIndex[fieldSchema.name];
    fieldSchema = extend(fieldSchema, orgFieldSchema);

    return fieldSchema;
  });

  // calculate preset bins for quantitative and temporal data
  for (let fieldSchema of fieldSchemas) {
    if (fieldSchema.vlType === VLType.QUANTITATIVE) {
      for (let maxbins of opt.enum.binProps.maxbins) {
        fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
      }
    } else if (fieldSchema.vlType === VLType.TEMPORAL) {
      for (let unit of opt.enum.timeUnit) {
        if (unit !== undefined) {
          fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
        }
      }
    }
  }

  const derivedTableSchema: TableSchema<FieldSchema> = {
    ...tableSchema,
    fields: fieldSchemas,
  };

  return new Schema(derivedTableSchema);
}

  // order the field schema when we construct a new Schema
  // this orders the fields in the UI
  const order = {
    'nominal': 0,
    'key': 1,
    'ordinal': 2,
    'temporal': 3,
    'quantitative': 4
  };

export class Schema {
  private _tableSchema: TableSchema<FieldSchema>;
  private _fieldSchemaIndex: {[field: string]: FieldSchema};

  constructor(tableSchema: TableSchema<FieldSchema>) {
    this._tableSchema = tableSchema;


    tableSchema.fields.sort(function(a: FieldSchema, b: FieldSchema) {
      // first order by vlType: nominal < temporal < quantitative < ordinal
      if (order[a.vlType] < order[b.vlType]) {
        return -1;
      } else if (order[a.vlType] > order[b.vlType]) {
        return 1;
      } else {
        // then order by field (alphabetically)
        return a.name.localeCompare(b.name);
      }
    });

    // Add index for sorting
    tableSchema.fields.forEach((fieldSchema, index) => fieldSchema.index = index);

    this._fieldSchemaIndex = tableSchema.fields.reduce((m, fieldSchema: FieldSchema) => {
      m[fieldSchema.name] = fieldSchema;
      return m;
    }, {});
  }

  /** @return a list of the field names (for enumerating). */
  public fieldNames() {
    return this._tableSchema.fields.map((fieldSchema) => fieldSchema.name);
  }

  /** @return a list of FieldSchemas */
  public get fieldSchemas() {
    return this._tableSchema.fields;
  }

  public fieldSchema(fieldName: string) {
    return this._fieldSchemaIndex[fieldName];
  }

  public tableSchema() {
    // the fieldschemas are re-arranged
    // but this is not allowed in table schema.
    // so we will re-order based on original index.
    const tableSchema = duplicate(this._tableSchema);
    tableSchema.fields.sort((a, b) => a.originalIndex - b.originalIndex);
    return tableSchema;
  }

  /**
   * @return primitive type of the field if exist, otherwise return null
   */
  public primitiveType(fieldName: string) {
    return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].type : null;
  }

  /**
   * @return vlType of measturement of the field if exist, otherwise return null
   */
  public vlType(fieldName: string) {
    return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].vlType : null;
  }

  /** @return cardinality of the field associated with encQ, null if it doesn't exist.
   *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
   */
  public cardinality(fieldQ: FieldQuery, augmentTimeUnitDomain: boolean = true, excludeInvalid: boolean = false) {
    const fieldSchema = this._fieldSchemaIndex[fieldQ.field as string];
    if (fieldQ.aggregate || (isAutoCountQuery(fieldQ) && fieldQ.autoCount)) {
      return 1;
    } else if (fieldQ.bin) {
      // encQ.bin will either be a boolean or a BinQuery
      let bin: BinQuery;
      if (typeof fieldQ.bin === 'boolean') {
        // autoMaxBins defaults to 10 if channel is Wildcard
        bin = {
          maxbins: autoMaxBins(fieldQ.channel as Channel)
        };
      } else {
        bin = fieldQ.bin;
      }
      const maxbins: any = bin.maxbins;
      if (!fieldSchema.binStats[maxbins]) {
        // need to calculate
        fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
      }
      // don't need to worry about excludeInvalid here because invalid values don't affect linearly binned field's cardinality
      return fieldSchema.binStats[maxbins].distinct;
    } else if (fieldQ.timeUnit) {
      if (augmentTimeUnitDomain) {
        switch (fieldQ.timeUnit) {
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
      let unit = fieldQ.timeUnit as string;
      let timeStats = fieldSchema.timeStats;
      // if the cardinality for the timeUnit is not cached, calculate it
      if (!timeStats[unit]) {
        timeStats[unit] = timeSummary(fieldQ.timeUnit as TimeUnit, fieldSchema.stats);
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
  public timeUnitHasVariation(fieldQ: FieldQuery): boolean {
    if (!fieldQ.timeUnit) {
      return;
    }

    // if there is no variation in `date`, there should not be variation in `day`
    if (fieldQ.timeUnit === TimeUnit.DAY) {
      const dateEncQ: EncodingQuery = extend({}, fieldQ, {timeUnit: TimeUnit.DATE});
      if (this.cardinality(dateEncQ, false, true) <= 1) {
        return false;
      }
    }

    let fullTimeUnit = fieldQ.timeUnit;
    for (let singleUnit of SINGLE_TIMEUNITS) {
      if (containsTimeUnit(fullTimeUnit as TimeUnit, singleUnit)) {
        // Create a clone of encQ, but with singleTimeUnit
        const singleUnitEncQ = extend({}, fieldQ, {timeUnit: singleUnit});
        if (this.cardinality(singleUnitEncQ, false, true) <= 1) {
          return false;
        }
      }
    }
    return true;
  }

  public domain(fieldQ: FieldQuery): any[] {
    // TODO: differentiate for field with bin / timeUnit
    const fieldSchema = this._fieldSchemaIndex[fieldQ.field as string];
    let domain: any[] = keys(fieldSchema.stats.unique);
    if (fieldSchema.vlType === VLType.QUANTITATIVE) {
      // return [min, max], coerced into number types
      return [+fieldSchema.stats.min, +fieldSchema.stats.max];
    } else if (fieldSchema.type === PrimitiveType.DATETIME) {
      // return [min, max] dates
      return [fieldSchema.stats.min, fieldSchema.stats.max];
    } else if (fieldSchema.type === PrimitiveType.INTEGER ||
        fieldSchema.type === PrimitiveType.NUMBER) {
      // coerce non-quantitative numerical data into number type
      domain = domain.map(x => +x);
      return domain.sort(cmp);
    } else if ((fieldSchema.vlType === VLType.ORDINAL) && (fieldSchema.ordinalDomain !== null)) {
      return fieldSchema.ordinalDomain;
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
  public stats(fieldQ: FieldQuery) {
    // TODO: differentiate for field with bin / timeUnit vs without
    const fieldSchema = this._fieldSchemaIndex[fieldQ.field as string];
    return fieldSchema ? fieldSchema.stats : null;
  }
}

/**
 * @return a summary of the binning scheme determined from the given max number of bins
 */
function binSummary(maxbins: number, summary: DLFieldProfile): DLFieldProfile {
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
function timeSummary(timeunit: TimeUnit, summary: DLFieldProfile): DLFieldProfile {
  const result = extend({}, summary);

  let unique: {[value: string]: number} = {};
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
function binUnique(bin: any, oldUnique: any) {
  const newUnique = {};
  for (let value in oldUnique) {
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
  DATETIME = 'datetime' as any
}
