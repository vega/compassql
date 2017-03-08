import {Scorer} from './base';
import {SpecQueryModel} from '../../model';
import {Schema} from '../../schema';
import {QueryConfig, DEFAULT_QUERY_CONFIG} from '../../config';
import {FeatureScore} from '../ranking';
import {EncodingQuery} from '../../query/encoding';
import {Channel} from 'vega-lite/build/src/channel';
import {Dict} from '../../util';

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

    if (opt.preferredFacet === Channel.ROW) {
      // penalize the other axis
      score[Channel.COLUMN] = -0.01;
    } else if (opt.preferredFacet === Channel.COLUMN) {
      // penalize the other axis
      score[Channel.ROW] = -0.01;
    }

    return score;
  }
  public getScore(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore[] {
    return specM.getEncodings().reduce((features, encQ: EncodingQuery) => {
      const featureScore = this.getFeatureScore(encQ.channel as string);
      if (featureScore) {
        features.push(featureScore);
      }
      return features;
    }, []);
  }
};
