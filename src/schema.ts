import {Type} from 'vega-lite/src/type';
import {Channel} from 'vega-lite/src/channel';
import {autoMaxBins} from 'vega-lite/src/bin';
import {summary} from 'datalib/src/stats';
import {inferAll} from 'datalib/src/import/type';
import * as dlBin from 'datalib/src/bins/bins';
import {duplicate} from 'datalib/src/util';

import {EncodingQuery, BinQuery} from './query';
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

    let schema = new Schema(fieldSchemas);

    // calculate preset bins
    for (let fieldSchema of fieldSchemas) {
      if (fieldSchema.type === Type.QUANTITATIVE) {
        fieldSchema.binStats = {};
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
        // TODO: enumerate default timeUnit bins
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
      const fieldSchema = this.fieldSchemaIndex[encQ.field as string];
      const maxbins: any = bin.maxbins;
      if (!fieldSchema.binStats[maxbins]) {
        // need to calculate
        fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
      }
      return fieldSchema.binStats[maxbins].distinct;
    } else if (encQ.timeUnit) {
      return 1; // FIXME
    }
    const fieldSchema = this.fieldSchemaIndex[encQ.field as string];
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

  /**
   * Overrides a field schema.
   */
  public setSchema(field: string, schema: FieldSchema) {
    // FIXME: need to update this.fieldSchemas ?
    this.fieldSchemaIndex[field] = schema;
  }

  /**
   * Get a field schema.
   * @return a copy of the FieldSchema associated with the given field
   */
  public getSchema(field: string) {
    return duplicate(this.fieldSchemaIndex[field]);
  }
}

/**
 * @return a summary with the correct distinct property given a max number of bins
 */
function binSummary(maxbins: number, summary: Summary) {
  const bin = dlBin({
    min: summary.min,
    max: summary.max,
    maxbins: maxbins
  });
  const binSum = extend({}, summary);
  binSum.distinct = (bin.stop - bin.start) / bin.step;
  return binSum;
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
