
import {Type} from 'vega-lite/build/src/type';
import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {Schema} from '../schema';
import {some} from '../util';

import {RankingScore, FeatureScore} from './ranking';

import {EncodingQuery, isFieldQuery, isDiscrete, FieldQuery} from '../query/encoding';

export const name = 'aggregationQuality';

export function score(specM: SpecQueryModel, schema: Schema, opt: QueryConfig): RankingScore {
  const feature = aggregationQualityFeature(specM, schema, opt);
  return {
    score: feature.score,
    features: [feature]
  };
}

function isDimension(encQ: FieldQuery) {
  return isDiscrete(encQ) || !!encQ.timeUnit;
}

function aggregationQualityFeature(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore {
  const encodings = specM.getEncodings();
  if (specM.isAggregate()) {
    const isRawContinuous = (encQ: EncodingQuery) => {
      return isFieldQuery(encQ) && ((encQ.type === Type.QUANTITATIVE && !encQ.bin && !encQ.aggregate && !encQ.autoCount) ||
        (encQ.type === Type.TEMPORAL && !encQ.timeUnit));
    };

    if (some(encodings, isRawContinuous)) {
      // These are plots that pollute continuous fields as dimension.
      // They are often intermediate visualizations rather than what users actually want.
      return {
        type: name,
        score: 0.1,
        feature: 'Aggregate with raw continuous'
      };
    }

    if (some(encodings, (encQ) => isFieldQuery(encQ) && isDimension(encQ))) {
      let hasCount = some(encodings, (encQ: EncodingQuery) => {
        return isFieldQuery(encQ) && (encQ.aggregate === 'count' || encQ.autoCount === true);
      });
      let hasBin = some(encodings, (encQ: EncodingQuery) => {
        return isFieldQuery(encQ) && !!encQ.bin;
      });

      if (hasCount) {
        // If there is count, we might add additional count field, making it a little less simple
        // then when we just apply aggregate to Q field
        return {
          type: name,
          score: 0.8,
          feature: 'Aggregate with count'
        };
      } else if (hasBin) {
        // This is not as good as binning all the Q and show heatmap
        return {
          type: name,
          score: 0.7,
          feature: 'Aggregate with bin but without count'
        };
      } else {
        return {
          type: name,
          score: 0.9,
          feature: 'Aggregate without count and without bin'
        };
      }
    }
    // no dimension -- often not very useful
    return {
      type: name,
      score: 0.3,
      feature: 'Aggregate without dimension'
    };
  } else {
    if (some(encodings, (encQ) => isFieldQuery(encQ) && !isDimension(encQ))) {
       // raw plots with measure -- simplest of all!
      return {
        type: name,
        score: 1,
        feature: 'Raw with measure'
      };
    }
    // raw plots with no measure -- often a lot of occlusion
    return {
      type: name,
      score: 0.2,
      feature: 'Raw without measure'
    };
  }
}
