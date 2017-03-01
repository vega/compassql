import {Dict} from '../../util';
import {Scorer} from './base';
import {SpecQueryModel} from '../../model';
import {Schema} from '../../schema';
import {QueryConfig} from '../../config';
import {FeatureScore} from '../ranking';
import {EncodingQuery, isFieldQuery} from '../../query/encoding';

/**
 * Penalize if facet channels are the only dimensions
 */
export class DimensionScorer extends Scorer {
  constructor() {
    super('Dimension');
  }

  protected initScore() {
    return {
      row: -2,
      column: -2,
      color: 0,
      opacity: 0,
      size: 0,
      shape: 0
    } as Dict<number>;
  }

  public getScore(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore[] {
    if (specM.isAggregate()) {
      specM.getEncodings().reduce((maxFScore, encQ: EncodingQuery) => {
        if (isFieldQuery(encQ) && !encQ.aggregate && !encQ.autoCount) { // isDimension
          const featureScore = this.getFeatureScore(encQ.channel + '');
          if (featureScore && featureScore.score > maxFScore.score) {
            return featureScore;
          }
        }
        return maxFScore;
      }, {type: 'Dimension', feature: 'No Dimension', score: -5});
    }
    return [];
  }
}
