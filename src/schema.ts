import {Type} from 'vega-lite/src/type';
import {Channel} from 'vega-lite/src/channel';
import {autoMaxBins} from 'vega-lite/src/bin';
import {TimeUnit, TIMEUNITS} from 'vega-lite/src/timeunit';
import {summary} from 'datalib/src/stats';
import {inferAll} from 'datalib/src/import/type';

declare function require(name: string);
var dl = require('datalib');

import {BinQuery, EncodingQuery} from './query/encoding';
import {QueryConfig, DEFAULT_QUERY_CONFIG} from './config';
import {contains, extend, keys} from './util';

export class Schema {
  private fieldSchemas: FieldSchema[];
  private fieldSchemaIndex: {[field: string]: FieldSchema};

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
        // use ordinal or nominal when cardinality of integer type is relatively low
        if (distinct / summary.count < opt.numberOrdinalProportion) {
          // use nominal if the integers are 1,2,3,...,N or 0,1,2,3,...,N-1 where N = cardinality
          type = ((summary.max as number) - (summary.min as number) === distinct - 1 && contains([0,1], summary.min)) ? Type.NOMINAL : Type.ORDINAL;
        } else {
          type = Type.QUANTITATIVE;
        }
      } else if (primitiveType === PrimitiveType.DATE) {
        type = Type.TEMPORAL;
      } else {
        type = Type.NOMINAL;
      }
      return {
        field: field,
        type: type,
        primitiveType: primitiveType,
        stats: summary
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

    let schema = new Schema(fieldSchemas);

    // calculate preset bins
    for (let fieldSchema of fieldSchemas) {
      fieldSchema.binStats = {};
      fieldSchema.timeStats = {};
      if (fieldSchema.type === Type.QUANTITATIVE) {
        for (let maxbins of opt.maxBinsList) {
          fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
        }
      } else if (fieldSchema.type === Type.TEMPORAL) {
        // need to get min/max of date data
        fieldSchema.stats.min = new Date(data[0][fieldSchema.field]);
        fieldSchema.stats.max = new Date(data[0][fieldSchema.field]);
        for (var i = 0; i < data.length; i++) {
          const time = new Date(data[i][fieldSchema.field]).getTime();
          if (time < (fieldSchema.stats.min as Date).getTime()) {
            fieldSchema.stats.min = new Date(time);
          }
          if (time > (fieldSchema.stats.max as Date).getTime()) {
            fieldSchema.stats.max = new Date(time);
          }
        }

        // enumerate a binning scheme for every timeUnit
        for (let unit of TIMEUNITS) {
          fieldSchema.timeStats[unit] = timeUnitSummary(unit, fieldSchema.stats, fieldSchema.type);
        }
      }
    }

    return schema;
  }

  constructor(fieldSchemas: FieldSchema[]) {
    this.fieldSchemas = fieldSchemas;
    this.fieldSchemaIndex = fieldSchemas.reduce((m, fieldSchema: FieldSchema) => {
      m[fieldSchema.field] = fieldSchema;
      return m;
    }, {});
  }

  public fields() {
    return this.fieldSchemas.map((fieldSchema) => fieldSchema.field);
  }

  /**
   * @return primitive type of the field if exist, otherwise return null
   */
  public primitiveType(field: string) {
    return this.fieldSchemaIndex[field] ? this.fieldSchemaIndex[field].primitiveType : null;
  }

  /**
   * @return type of measturement of the field if exist, otherwise return null
   */
  public type(field: string) {
    return this.fieldSchemaIndex[field] ? this.fieldSchemaIndex[field].type : null;
  }

  public cardinality(encQ: EncodingQuery) {
    const fieldSchema = this.fieldSchemaIndex[encQ.field as string];
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
      return fieldSchema.binStats[maxbins].distinct;
    } else if (encQ.timeUnit) {
      switch (encQ.timeUnit) {
        case TimeUnit.SECONDS: return 60;
        case TimeUnit.MINUTES: return 60;
        case TimeUnit.HOURS: return 24;
        case TimeUnit.DAY: return 7;
        case TimeUnit.DATE: return 31;
        case TimeUnit.MONTH: return 12;
        case TimeUnit.QUARTER: return 4;
      }
      // TODO: handle other cases
      return fieldSchema.timeStats[encQ.timeUnit as string].distinct;
    }
    return fieldSchema ? fieldSchema.stats.distinct : null;
  }

  public domain(encQ: EncodingQuery): any[] {
    // TODO: differentiate for field with bin / timeUnit
    const fieldSchema = this.fieldSchemaIndex[encQ.field as string];
    var domain: any[] = keys(fieldSchema.stats.unique);
    if (fieldSchema.type === Type.QUANTITATIVE || fieldSchema.primitiveType === PrimitiveType.DATE) {
      // return [min, max] for quantitative and date data
      domain = [fieldSchema.stats.min, fieldSchema.stats.max];
    } else if (fieldSchema.primitiveType === PrimitiveType.INTEGER ||
        fieldSchema.primitiveType === PrimitiveType.NUMBER) {
      // coerce non-quantitative numerical data into number type
      domain = domain.map(x => +x);
    }
    return domain.sort();
  }

  /**
   * @return a Summary corresponding to the field of the given EncodingQuery
   */
  public stats(encQ: EncodingQuery) {
    // TODO: differentiate for field with bin / timeUnit vs without
    const fieldSchema = this.fieldSchemaIndex[encQ.field as string];
    return fieldSchema ? fieldSchema.stats : null;
  }
}

/**
 * @return a summary of the binning scheme determined from the given max number of bins
 */
function binSummary(maxbins: number, summary: Summary): Summary {
  const bin: Bin = dl.bins({
    min: summary.min,
    max: summary.max,
    maxbins: maxbins
  });

  return binStats(bin, summary);
}

function timeUnitSummary(unit: TimeUnit, summary: Summary, type: Type): Summary {
  var bin: Bin;
  switch (unit) {
    // these are the units that dl.bins.date supports
    case TimeUnit.YEAR:
    case TimeUnit.MONTH:
    case TimeUnit.DAY:
    case TimeUnit.HOURS:
    case TimeUnit.MINUTES:
    case TimeUnit.SECONDS:
      bin = dl.bins.date({
        min: summary.min,
        max: summary.max,
        unit: unit
      });
    // let dl.bins.date infer a unit
    default:
      bin = dl.bins.date({
        min: summary.min,
        max: summary.max
      });
  }

  return binStats(bin, summary);
}

/**
 * @return a new summary based on a new binning scheme and old summary statistics
 */
function binStats(bin: Bin, summary: Summary): Summary {
  // have the timeUnit bin scheme, need to determine new stats
  // start with summary, pre-binning
  const result = extend({}, summary);

  result.unique = binUnique(bin, summary.unique);
  result.distinct = (bin.stop - bin.start) / bin.step;
  result.min = bin.start;
  result.max = bin.stop;

  return result;
}

/**
 * @return a new unique object based off of the old unique count and a binning scheme
 */
function binUnique(bin: Bin, oldUnique) {
  const newUnique = {};
  for (var value in oldUnique) {
    // date types are tricky, need to convert into correct unit
    let bucket: number | string;
    if (bin.unit.date) {
      bucket = bin.value(bin.unit.unit(new Date(value))).toString();
    } else {
      bucket = bin.value(Number(value)) as number;
    }
    if (!newUnique[bucket]) {
      newUnique[bucket] = oldUnique[value];
    } else {
      newUnique[bucket] += oldUnique[value];
    }
  }
  return newUnique;
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
}
