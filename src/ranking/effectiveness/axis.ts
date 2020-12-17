/**
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */

import * as CHANNEL from 'vega-lite/build/src/channel';
import {Channel} from 'vega-lite/build/src/channel';
import {DEFAULT_QUERY_CONFIG, QueryConfig} from '../../config';
import {SpecQueryModel} from '../../model';
import {EncodingQuery, isAutoCountQuery, isFieldQuery} from '../../query/encoding';
import {Schema} from '../../schema';
import {Dict} from '../../util';
import {FeatureScore} from '../ranking';
import {Scorer} from './base';
import {BIN_Q, ExtendedType, getExtendedType, N, O, T, TIMEUNIT_O, TIMEUNIT_T} from './type';

/**
 * Effectiveness Score for preferred axis.
 */
export class AxisScorer extends Scorer {
  constructor() {
    super('Axis');
  }
  protected initScore(opt: QueryConfig = {}) {
    opt = {...DEFAULT_QUERY_CONFIG, ...opt};
    let score: Dict<number> = {};

    const preferredAxes = [
      {
        feature: BIN_Q,
        opt: 'preferredBinAxis'
      },
      {
        feature: T,
        opt: 'preferredTemporalAxis'
      },
      {
        feature: TIMEUNIT_T,
        opt: 'preferredTemporalAxis'
      },
      {
        feature: TIMEUNIT_O,
        opt: 'preferredTemporalAxis'
      },
      {
        feature: O,
        opt: 'preferredOrdinalAxis'
      },
      {
        feature: N,
        opt: 'preferredNominalAxis'
      }
    ];

    preferredAxes.forEach(pAxis => {
      if (opt[pAxis.opt] === CHANNEL.X) {
        // penalize the other axis
        score[`${pAxis.feature}_${CHANNEL.Y}`] = -0.01;
      } else if (opt[pAxis.opt] === CHANNEL.Y) {
        // penalize the other axis
        score[`${pAxis.feature}_${CHANNEL.X}`] = -0.01;
      }
    });

    return score;
  }

  public featurize(type: ExtendedType, channel: Channel) {
    return `${type}_${channel}`;
  }

  public getScore(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore[] {
    return specM.getEncodings().reduce((features, encQ: EncodingQuery) => {
      if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
        const type = getExtendedType(encQ);
        const feature = this.featurize(type, encQ.channel as Channel);
        const featureScore = this.getFeatureScore(feature);

        if (featureScore) {
          features.push(featureScore);
        }
      }
      return features;
    }, []);
  }
}
