import {Type} from 'vega-lite/src/type';
import {summary} from 'datalib/src/stats';
import {inferAll} from 'datalib/src/import/type';

import {EncodingQuery} from './query';

export class Schema {
  private fieldSchemas: FieldSchema[];
  private fieldSchemaIndex: {[field: string]: FieldSchema};

  /**
   * Build a Schema object.
   *
   * @param data - a set of raw data
   * @return a Schema object
   */
  public static build(data: any): Schema {
    // create profiles for each variable
    var summaries: Summary[] = summary(data);
    var types = inferAll(data); // inferAll does stronger type inference than summary

    var fieldSchemas: FieldSchema[] = summaries.map(function(summary) {
      var field: string = summary.field;
      var primitiveType: PrimitiveType = types[field] as any;
      var type: Type = (primitiveType === PrimitiveType.NUMBER || primitiveType === PrimitiveType.INTEGER) ? Type.QUANTITATIVE:
        primitiveType === PrimitiveType.DATE ? Type.TEMPORAL : Type.NOMINAL;
      var distinct: number = summary.distinct;

      return {
        field: field,
        type: type,
        primitiveType: primitiveType,
        distinct: distinct,
        stats: summary
      };
    });

    return new Schema(fieldSchemas);
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
      return 1; // FIXME
    } else if (encQ.timeUnit) {
      return 1; // FIXME
    }
    const fieldSchema = this.fieldSchemaIndex[encQ.field as string];
    return fieldSchema ? fieldSchema.distinct : null;
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

export enum PrimitiveType {
  STRING = 'string' as any,
  NUMBER = 'number' as any,
  INTEGER = 'integer' as any,
  BOOLEAN = 'boolean' as any,
  DATE = 'date' as any
}

export interface FieldSchema {
  field: string;
  distinct: number;
  type?: Type;
  /** number, integer, string, date  */
  primitiveType: PrimitiveType;
  stats?: Summary;
  title?: string;
}
