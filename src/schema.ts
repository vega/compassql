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

  public primitiveType(field: string) {
    return this.fieldSchemaIndex[field].primitiveType;
  }

  public type(field: string) {
    return this.fieldSchemaIndex[field].type;
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
