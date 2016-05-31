export class Stats {
  private _fieldsStats: FieldStats[];
  private _fieldStatsIndex: {[field: string]: FieldStats};

  constructor(fieldsStats: FieldStats[]) {
    this._fieldsStats = fieldsStats;
    this._fieldStatsIndex = fieldsStats.reduce((m, fieldStats: FieldStats) => {
      m[fieldStats.field] = fieldStats;
      return m;
    }, {});
  }

  public cardinality(field: string) {
    return this._fieldStatsIndex[field].cardinality;
  }
}

export interface FieldStats {
  field: string;
  cardinality: number;
}