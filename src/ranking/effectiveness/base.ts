import {SpecQueryModel} from '../../model';
import {Schema} from '../../schema';
import {QueryConfig} from '../../config';
import {FeatureScore} from '../ranking';
import {Dict} from '../../util';


export abstract class Scorer {
  public readonly type: string;
  public readonly scoreIndex: Dict<number>;
  constructor(type: string) {
    this.type = type;
    this.scoreIndex = this.initScore();
  }

  protected abstract initScore(): Dict<number>;

  protected getFeatureScore(feature: string): FeatureScore {
    const type = this.type;
    const score = this.scoreIndex[feature];
    if (score !== undefined) {
      return {type, feature, score};
    }
    return undefined;
  }

  public abstract getScore(specM: SpecQueryModel, schema: Schema, opt: QueryConfig): FeatureScore[];
}
