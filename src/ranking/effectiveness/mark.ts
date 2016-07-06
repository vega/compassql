import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';

import {QueryConfig} from '../../config';
import {SpecQueryModel} from '../../model';
import {Dict, forEach} from '../../util';
import {Schema} from '../../schema';

import {FeatureScore, getExtendedType, getFeatureScore} from './effectiveness';
import {BIN_Q, TIMEUNIT_T, Q, N, O, T, NONE} from './type';

export namespace MarkScore {
  export const MARK_SCORE = 'markScore';

  export function featurize(xType, yType, hasOcclusion: boolean, mark: Mark) {
    return xType + '_' + yType + '_' + hasOcclusion + '_' + mark;
  }

  export function init() {
    const MEASURES = [Q, T];
    const DIMENSIONS = [BIN_Q, TIMEUNIT_T, O, N];
    const DIMENSIONS_OR_NONE = DIMENSIONS.concat([NONE]);

    let SCORE = {} as Dict<number>;
    // QxQ
    MEASURES.forEach((xType) => {
      MEASURES.forEach((yType) => {
        // has occlusion
        const occludedQQMark = {
          point: 0,
          text: -0.2,
          tick: -0.5,
          bar: -2,
          line: -2,
          area: -2,
          rule: -2.5
        };
        forEach(occludedQQMark, (score, mark) => {
          const feature = featurize(xType, yType, true, mark);
          SCORE[feature] = score;
        });

        // no occlusion
        // TODO: possible to use connected scatter plot
        const noOccludedQQMark = {
          point: 0,
          text: -0.2,
          tick: -0.5,
          bar: -2,
          line: -2,
          area: -2,
          rule: -2.5
        };
        forEach(noOccludedQQMark, (score, mark) => {
          const feature = featurize(xType, yType, false, mark);
          SCORE[feature] = score;
        });
      });
    });

    // DxQ, QxD
    MEASURES.forEach((xType) => {

      // has occlusion
      DIMENSIONS_OR_NONE.forEach((yType) => {
        const occludedDimensionMeasureMark = {
          tick: 0,
          point: -0.2,
          text: -0.5,
          bar: -2,
          line: -2,
          area: -2,
          rule: -2.5
        };
        forEach(occludedDimensionMeasureMark, (score, mark) => {
          const feature = featurize(xType, yType, true, mark);
          SCORE[feature] = score;
          // also do the inverse
          const feature2 = featurize(yType, xType, true, mark);
          SCORE[feature2] = score;
        });
      });
      // no occlusion
      [NONE, N].forEach((yType) => {
        const noOccludedQxN = {
          bar: 0,
          point: -0.2,
          tick: -0.25,
          text: -0.3,
          // Line / Area can mislead trend for N
          line: -2, // FIXME line vs area?
          area: -2,
          // Non-sense to use rule here
          rule: -2.5
        };
        forEach(noOccludedQxN, (score, mark) => {
          const feature = featurize(xType, yType, false, mark);
          SCORE[feature] = score;

          // also do the inverse
          const feature2 = featurize(yType, xType, false, mark);
          SCORE[feature2] = score;
        });
      });

      [BIN_Q].forEach((yType) => {
        const noOccludedQxBinQ = {
          bar: 0,
          point: -0.2,
          tick: -0.25,
          text: -0.3,
          // Line / Area isn't the best fit for bin
          line: -0.5,// FIXME line vs area?
          area: -0.5,
          // Non-sense to use rule here
          rule: -2.5
        };
        forEach(noOccludedQxBinQ, (score, mark) => {
          const feature = featurize(xType, yType, false, mark);
          SCORE[feature] = score;

          // also do the inverse
          const feature2 = featurize(yType, xType, false, mark);
          SCORE[feature2] = score;
        });
      });

      [TIMEUNIT_T, O].forEach((yType) => {
        const noOccludedQxBinQ = {
          line: 0,
          area: -0.1,
          bar: -0.2,
          point: -0.3,
          tick: -0.35,
          text: -0.4,
          // Non-sense to use rule here
          rule: -2.5
        };
        forEach(noOccludedQxBinQ, (score, mark) => {
          const feature = featurize(xType, yType, false, mark);
          SCORE[feature] = score;

          // also do the inverse
          const feature2 = featurize(yType, xType, false, mark);
          SCORE[feature2] = score;
        });
      });
    });

    // DxD
    DIMENSIONS_OR_NONE.forEach((xType) => {
      DIMENSIONS_OR_NONE.forEach((yType) => {
        // has occlusion
        const ddMark = {
          point: 0,
          rect: 0,
          text: -0.1,
          tick: -1,
          bar: -2,
          line: -2,
          area: -2,
          rule: -2.5
        };
        // No difference between has occlusion and no occlusion
        forEach(ddMark, (score, mark) => {
          const feature = featurize(xType, yType, true, mark);
          SCORE[feature] = score;
        });
        forEach(ddMark, (score, mark) => {
          const feature = featurize(xType, yType, false, mark);
          SCORE[feature] = score;
        });
      });
    });
    return SCORE;
  }

  export function getScore(specM: SpecQueryModel, schema: Schema, opt: QueryConfig): FeatureScore[] {
    let mark = specM.getMark() as Mark;
    if (mark === Mark.CIRCLE || mark === Mark.SQUARE) {
      mark = Mark.POINT;
    }
    const xEncQ = specM.getEncodingQueryByChannel(Channel.X);
    const xType = xEncQ ? getExtendedType(xEncQ) : '-';

    const yEncQ = specM.getEncodingQueryByChannel(Channel.Y);
    const yType = yEncQ ? getExtendedType(yEncQ) : '-';

    const isOccluded = !specM.isAggregate(); // FIXME

    const feature = xType + '_' + yType + '_' + isOccluded + '_' + mark;
    const featureScore = getFeatureScore(MARK_SCORE, feature);
    return [featureScore];
  }
}
