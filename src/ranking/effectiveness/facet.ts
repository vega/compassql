import * as CHANNEL from 'vega-lite/build/src/channel';
import {DEFAULT_QUERY_CONFIG, QueryConfig} from '../../config';
import {SpecQueryModel} from '../../model';
import {EncodingQuery, isAutoCountQuery, isFieldQuery} from '../../query/encoding';
import {Schema} from '../../schema';
import {Dict} from '../../util';
import {FeatureScore} from '../ranking';
import {Scorer} from './base';

/**
 * Effective Score for preferred facet
 */
export class FacetScorer extends Scorer {
  constructor() {
    super('Facet');
  }
  protected initScore(opt?: QueryConfig) {
    opt = {...DEFAULT_QUERY_CONFIG, ...opt};
    let score: Dict<number> = {};

    if (opt.preferredFacet === CHANNEL.ROW) {
      // penalize the other axis
      score[CHANNEL.COLUMN] = -0.01;
    } else if (opt.preferredFacet === CHANNEL.COLUMN) {
      // penalize the other axis
      score[CHANNEL.ROW] = -0.01;
    }

    return score;
  }
  public getScore(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore[] {
    return specM.getEncodings().reduce((features, encQ: EncodingQuery) => {
      if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
        const featureScore = this.getFeatureScore(encQ.channel as string);
        if (featureScore) {
          features.push(featureScore);
        }
      }
      return features;
    }, []);
  }
}
