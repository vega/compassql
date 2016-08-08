import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {Type} from 'vega-lite/src/type';

import {QueryConfig} from './config';
import {SpecQueryModel} from './model';
import {EncodingQuery, ScaleQuery, scaleType} from './query/encoding';
import {Schema} from './schema';
import {contains, Dict} from './util';

export function stylize(answerSet: SpecQueryModel[], schema: Schema, opt: QueryConfig): SpecQueryModel[] {
  answerSet = answerSet.map(function(specM) {
    if (opt.smallBandSizeForHighCardinalityOrFacet) {
      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
     }

    if (opt.nominalColorScaleForHighCardinality) {
      specM = nominalColorScaleForHighCardinality(specM, schema);
    }
    return specM;
  });

  return answerSet;
}

let encQIndex: Dict<EncodingQuery> = {};

export function smallBandSizeForHighCardinalityOrFacet(specM: SpecQueryModel, schema: Schema): SpecQueryModel {
 [Channel.ROW, Channel.Y, Channel.COLUMN, Channel.X].forEach((channel) => {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
      });

  const yEncQ = encQIndex[Channel.Y];
  if (yEncQ !== undefined) {
    if (encQIndex[Channel.ROW] ||
        schema.cardinality(yEncQ) > 10) {

      // We check for undefined rather than
      // yEncQ.scale = yEncQ.scale || {} to cover the case where
      // yEncQ.scale has been set to false/null.
      // This prevents us from incorrectly overriding scale and
      // assigning a bandSize when scale is set to false
      if (yEncQ.scale === undefined) {
        yEncQ.scale = {};
      }

      // We do not want to assign a bandSize if scale is set to false
      if (yEncQ.scale && contains([ScaleType.ORDINAL, undefined], scaleType((yEncQ.scale as ScaleQuery).type, yEncQ.timeUnit, yEncQ.type))) {
        if (!(yEncQ.scale as ScaleQuery).bandSize) {
          (yEncQ.scale as ScaleQuery).bandSize = 12;
        }
      }
    }
  }

  const xEncQ = encQIndex[Channel.X];
  if (xEncQ !== undefined) {
    if (encQIndex[Channel.COLUMN] ||
        schema.cardinality(xEncQ) > 10) {


      if (xEncQ.scale === undefined) {
        xEncQ.scale = {};
      }

      if (xEncQ.scale && contains([ScaleType.ORDINAL, undefined], scaleType((xEncQ.scale as ScaleQuery).type, xEncQ.timeUnit, xEncQ.type))) {
        if (!(xEncQ.scale as ScaleQuery).bandSize) {
          (xEncQ.scale as ScaleQuery).bandSize = 12;
        }
      }
    }
  }

  return specM;
}

export function nominalColorScaleForHighCardinality(specM: SpecQueryModel, schema: Schema): SpecQueryModel {
  encQIndex[Channel.COLOR] = specM.getEncodingQueryByChannel(Channel.COLOR);

  const colorEncQ = encQIndex[Channel.COLOR];
  if ((colorEncQ !== undefined) && (colorEncQ.type === Type.NOMINAL) &&
      (schema.cardinality(colorEncQ) > 10)) {

    if (colorEncQ.scale === undefined) {
      colorEncQ.scale = {};
    }

    if (colorEncQ.scale) {
      if (!(colorEncQ.scale as ScaleQuery).range) {
        (colorEncQ.scale as ScaleQuery).range = 'category20';
      }
    }
  }

  return specM;
}
