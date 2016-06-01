import {EncodingQuery} from './query';

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

  public cardinality(encQ: EncodingQuery) {
    if (encQ.aggregate || encQ.autoCount) {
      return 1;
    } else if (encQ.bin) {
      return 1; // FIXME
    } else if (encQ.timeUnit) {
      return 1; // FIXME
    }

    return this._fieldStatsIndex[encQ.field as string].cardinality;
  }
}

export interface FieldStats {
  field: string;
  cardinality: number;
}
