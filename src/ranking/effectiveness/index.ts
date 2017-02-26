import {SpecQueryModel} from '../../model';
import {Schema} from '../../schema';
import {QueryConfig} from '../../config';
import {RankingScore, FeatureScore} from '../ranking';
import {AxisScorer} from './axis';
import {DimensionScorer} from './dimension';
import {FacetScorer} from './facet';
import {SizeChannelScorer} from './sizechannel';
import {TypeChannelScorer} from './typechannel';
import {MarkScorer} from './mark';

const SCORERS = [
  new AxisScorer(),
  new DimensionScorer(),
  new FacetScorer(),
  new MarkScorer(),
  new SizeChannelScorer(),
  new TypeChannelScorer()
];

// TODO: x/y, row/column preference
// TODO: stacking
// TODO: Channel, Cardinality
// TODO: Penalize over encoding
export function effectiveness(specM: SpecQueryModel, schema: Schema, opt: QueryConfig): RankingScore {
  const features = SCORERS.reduce((f, scorer) => {
    const scores = scorer.getScore(specM, schema, opt);
    return f.concat(scores);
  }, [] as FeatureScore[]);

  return {
    score: features.reduce((s, f) => {
      return s + f.score;
    }, 0),
    features: features
  };
}
