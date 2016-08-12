
import {QueryConfig} from '../../config';
import {SpecQueryModel} from '../../model';
import {Dict} from '../../util';

import {Schema} from '../../schema';
import {FeatureScore, FeatureFactory, RankingScore} from '../ranking';
import {TypeChannelScore, MarkChannelScore, PreferredAxisScore, PreferredFacetScore} from './channel';
import {MarkScore} from './mark';

export let FEATURE_INDEX = {} as Dict<Dict<number>>;
let FEATURE_FACTORIES: FeatureFactory[] = [];

export function getFeatureScore(type: string, feature: string): FeatureScore {
  const score = FEATURE_INDEX[type][feature];
  if (score !== undefined) {
    return {
      score: score,
      type: type,
      feature: feature
    };
  }
  return null;
}

export function addFeatureFactory(factory: FeatureFactory) {
  FEATURE_FACTORIES.push(factory);
  FEATURE_INDEX[factory.type] = factory.init();
}

addFeatureFactory({
  type: TypeChannelScore.TYPE_CHANNEL,
  init: TypeChannelScore.init,
  getScore: TypeChannelScore.getScore
});

addFeatureFactory({
  type: PreferredAxisScore.PREFERRED_AXIS,
  init: PreferredAxisScore.init,
  getScore: PreferredAxisScore.getScore
});


addFeatureFactory({
  type: PreferredFacetScore.PREFERRED_FACET,
  init: PreferredFacetScore.init,
  getScore: PreferredFacetScore.getScore
});

addFeatureFactory({
  type: MarkChannelScore.MARK_CHANNEL,
  init: MarkChannelScore.init,
  getScore: MarkChannelScore.getScore
});

addFeatureFactory({
  type: MarkScore.MARK_SCORE,
  init: MarkScore.init,
  getScore: MarkScore.getScore
});

// TODO: x/y, row/column preference
// TODO: stacking
// TODO: Channel, Cardinality
// TODO: Penalize over encoding

export default function (specM: SpecQueryModel, schema: Schema, opt: QueryConfig): RankingScore {
  const features = FEATURE_FACTORIES.reduce((f, factory) => {
    const scores = factory.getScore(specM, schema, opt);
    return f.concat(scores);
  }, [] as FeatureScore[]);

  return {
    score: features.reduce((s, f) => {
      return s + f.score;
    }, 0),
    features: features
  };
}
