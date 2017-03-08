

import {Channel} from 'vega-lite/build/src/channel';

import {QueryConfig} from '../../config';
import {SpecQueryModel} from '../../model';
import {fieldDef as fieldDefShorthand} from '../../query/shorthand';
import {EncodingQuery} from '../../query/encoding';
import {Dict, extend, forEach, keys} from '../../util';

import {Schema} from '../../schema';
import {FeatureScore} from '../ranking';
import {BIN_Q, TIMEUNIT_T, TIMEUNIT_O, Q, N, O, T, ExtendedType, getExtendedType} from './type';


import {Scorer} from './base';


export const TERRIBLE = -10;

/**
 * Effectiveness score for relationship between
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
export class TypeChannelScorer extends Scorer {
  constructor() {
    super('TypeChannel');
  }
  protected initScore() {
    let SCORE = {} as Dict<number>;

    // Continuous Quantitative / Temporal Fields
    const CONTINUOUS_TYPE_CHANNEL_SCORE = {
      x: 0,
      y: 0,
      size: -0.575,
      color: -0.725,  // Middle between -0.7 and -0.75
      text: -2,
      opacity: -3,

      shape: TERRIBLE,
      row: TERRIBLE,
      column: TERRIBLE,
      detail: 2 * TERRIBLE
    };

    [Q, T, TIMEUNIT_T].forEach((type) => {
      keys(CONTINUOUS_TYPE_CHANNEL_SCORE).forEach((channel: Channel) => {
        SCORE[this.featurize(type, channel)] = CONTINUOUS_TYPE_CHANNEL_SCORE[channel];
      });
    });

    // Discretized Quantitative / Temporal Fields / Ordinal

    const ORDERED_TYPE_CHANNEL_SCORE = extend({}, CONTINUOUS_TYPE_CHANNEL_SCORE, {
      row: -0.75,
      column: -0.75,

      shape: -3.1,
      text: -3.2,
      detail: -4
    });

    [BIN_Q, TIMEUNIT_O, O].forEach((type) => {
      keys(ORDERED_TYPE_CHANNEL_SCORE).forEach((channel: Channel) => {
        SCORE[this.featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
      });
    });

    const NOMINAL_TYPE_CHANNEL_SCORE = {
      x: 0,
      y: 0,
      color: -0.6, // TODO: make it adjustable based on preference (shape is better for black and white)
      shape: -0.65,
      row: -0.7,
      column: -0.7,
      text: -0.8,

      detail: -2,
      size: -3,
      opacity: -3.1,
    };

    keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach((channel: Channel) => {
      SCORE[this.featurize(N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
    });

    return SCORE;
  }

  public featurize(type: ExtendedType, channel: Channel) {
    return type + '_' + channel;
  }

  public getScore(specM: SpecQueryModel, schema: Schema, opt: QueryConfig): FeatureScore[] {
    const encodingQueryByField = specM.getEncodings().reduce((m, encQ) => {
      const fieldKey = fieldDefShorthand(encQ);
      (m[fieldKey] = m[fieldKey] || []).push(encQ);
      return m;
    }, {});

    const features: FeatureScore[] = [];

    forEach(encodingQueryByField, (encQs: EncodingQuery[]) => {
      const bestFieldFeature = encQs.reduce((best: FeatureScore, encQ) => {
        const type = getExtendedType(encQ);
        const feature = this.featurize(type, encQ.channel as Channel);
        const featureScore = this.getFeatureScore(feature);

        if (best === null || featureScore.score > best.score) {
          return featureScore;
        }
        return best;
      }, null);

      features.push(bestFieldFeature);

      // TODO: add plus for over-encoding of one field
    });
    return features;
  }
}
