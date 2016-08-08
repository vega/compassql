import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {QueryConfig} from './config';
import {SpecQueryModel} from './model';
// import {Property} from './property';
import {EncodingQuery, ScaleQuery} from './query/encoding';
import {Schema} from './schema';
import {Dict, extend} from './util';

export function stylize(answerSet: SpecQueryModel[], schema: Schema, opt: QueryConfig): SpecQueryModel[] {

  answerSet = answerSet.map(function(specM) {
    let encQIndex: Dict<EncodingQuery> = {};
    let encodings = specM.specQuery.encodings;

    if (opt.smallBandSizeForHighCardinality || opt.smallBandSizeForFacet) {

      [Channel.ROW, Channel.Y, Channel.COLUMN, Channel.X].forEach((channel) => {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
      });

      const yEncQ = encQIndex[Channel.Y];
      if (yEncQ !== undefined) {
        if (encQIndex[Channel.ROW] ||
            schema.cardinality(yEncQ) > 10) {

          if (yEncQ.scale === undefined) {
            yEncQ.scale = yEncQ.scale || {};
          }

          if (yEncQ.scale) {
            (yEncQ.scale as ScaleQuery).bandSize = 12;
          }
        }
      }

      const xEncQ = encQIndex[Channel.X];
      if (xEncQ !== undefined) {
        if (encQIndex[Channel.COLUMN] ||
            schema.cardinality(xEncQ) > 10) {

          if (xEncQ.scale === undefined) {
            xEncQ.scale = xEncQ.scale || {};
          }

          if (xEncQ.scale) {
            (xEncQ.scale as ScaleQuery).bandSize = 12;
          }
        }
      }
    }

    if (opt.nominalScaleForHighCardinality) {

      encQIndex[Channel.COLOR] = specM.getEncodingQueryByChannel(Channel.COLOR);

      const colorEncQ = encQIndex[Channel.COLOR];
      if ((colorEncQ !== undefined) && (colorEncQ.type === Type.NOMINAL) &&
          (schema.cardinality(colorEncQ) > 10)) {

        if (colorEncQ.scale === undefined) {
          colorEncQ.scale = colorEncQ.scale || {};
        }

        if (colorEncQ.scale) {
          (colorEncQ.scale as ScaleQuery).range = 'category20';
        }
      }
    }
    return specM;
  });

  return answerSet;
}
