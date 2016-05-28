import {Type} from 'vega-lite/src/Type';

export class Schema {
  private fieldSchemas: FieldSchema[];
  private fieldSchemaIndex: {[field: string]: FieldSchema};

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
  /** number, string, date  */
  primitiveType: PrimitiveType;
  title?: string;

  // TODO: cardinality
}
