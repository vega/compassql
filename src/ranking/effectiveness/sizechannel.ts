import {Dict} from '../../util';
import {Scorer} from './base';
import {SpecQueryModel} from '../../model';
import {Schema} from '../../schema';
import {QueryConfig} from '../../config';
import {FeatureScore} from '../ranking';

/**
 * Effectivenss score that penalize size for bar and tick
 */
export class SizeChannelScorer extends Scorer {
  constructor() {
    super('SizeChannel');
  }

  protected initScore() {
    return {
      bar_size: -2,
      tick_size: -2
    } as Dict<number>;
  }

  public getScore(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore[] {
    const mark = specM.getMark();
    return specM.getEncodings().reduce((featureScores, encQ) => {
      const feature = mark + '_' + encQ.channel;
      const featureScore = this.getFeatureScore(feature);
      if (featureScore) {
        featureScores.push(featureScore);
      }
      return featureScores;
    }, []);
  }
}
