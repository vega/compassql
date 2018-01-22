import {Dict} from '../../util';
import {Scorer} from './base';
import {Schema} from '../../schema';
import {SpecQueryModel} from '../../model';
import {FeatureScore} from '../ranking';
import {QueryConfig} from '../../config';

/**
 * Effectivenss score that penalize size for bar and tick
 */
export class ChannelMarkScorer extends Scorer {
  constructor() {
    super('TypeChannel');
  }

  protected initScore() {
    let SCORE = {} as Dict<number>;

    // bar with size is terrible
    // distinguish between position and length for x/y

    return SCORE;
  }

  public getScore(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore[] {
    return null;
  }
}
