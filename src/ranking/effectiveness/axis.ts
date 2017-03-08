/**
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */

import {Channel} from 'vega-lite/build/src/channel';

import {QueryConfig, DEFAULT_QUERY_CONFIG} from '../../config';
import {SpecQueryModel} from '../../model';
import {EncodingQuery} from '../../query/encoding';
import {Dict} from '../../util';

import {Schema} from '../../schema';
import {FeatureScore} from '../ranking';
import {BIN_Q, TIMEUNIT_T, TIMEUNIT_O, N, O, T, ExtendedType, getExtendedType} from './type';


import {Scorer} from './base';


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

    const preferredAxes = [{
      feature: BIN_Q,
      opt: 'preferredBinAxis'
    },{
      feature: T,
      opt: 'preferredTemporalAxis'
    },{
      feature: TIMEUNIT_T,
      opt: 'preferredTemporalAxis'
    },{
      feature: TIMEUNIT_O,
      opt: 'preferredTemporalAxis'
    },{
      feature: O,
      opt: 'preferredOrdinalAxis'
    },{
      feature: N,
      opt: 'preferredNominalAxis'
    }];

    preferredAxes.forEach((pAxis) => {
      if (opt[pAxis.opt] === Channel.X) {
        // penalize the other axis
        score[pAxis.feature + '_' + Channel.Y] = -0.01;
      } else if (opt[pAxis.opt] === Channel.Y) {
        // penalize the other axis
        score[pAxis.feature + '_' + Channel.X] = -0.01;
      }
    });

    return score;
  }

  public featurize(type: ExtendedType, channel: Channel) {
    return type + '_' + channel;
  }

  public getScore(specM: SpecQueryModel, _: Schema, __: QueryConfig): FeatureScore[] {
    return specM.getEncodings().reduce((features, encQ: EncodingQuery) => {
      const type = getExtendedType(encQ);
      const feature = this.featurize(type, encQ.channel as Channel);
      const featureScore = this.getFeatureScore(feature);

      if (featureScore) {
        features.push(featureScore);
      }
      return features;
    }, []);
  }
}


