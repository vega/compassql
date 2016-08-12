import {AxisOrient} from 'vega-lite/src/axis';
import {Channel} from 'vega-lite/src/channel';
import {ScaleType} from 'vega-lite/src/scale';
import {Type} from 'vega-lite/src/type';

import {QueryConfig} from './config';
import {SpecQueryModel} from './model';
import {AxisQuery, EncodingQuery, ScaleQuery, scaleType} from './query/encoding';
import {Schema} from './schema';
import {contains, Dict} from './util';

export function stylize(answerSet: SpecQueryModel[], schema: Schema, opt: QueryConfig): SpecQueryModel[] {
  let encQIndex: Dict<EncodingQuery> = {};
  answerSet = answerSet.map(function(specM) {
    if (opt.smallBandSizeForHighCardinalityOrFacet) {
      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
     }

    if (opt.nominalColorScaleForHighCardinality) {
      specM = nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt);
    }

    if (opt.xAxisOnTopForHighYCardinalityWithoutColumn) {
      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt);
    }
    return specM;
  });

  return answerSet;
}

export function smallBandSizeForHighCardinalityOrFacet(specM: SpecQueryModel, schema: Schema, encQIndex: Dict<EncodingQuery>, opt: QueryConfig): SpecQueryModel {
  [Channel.ROW, Channel.Y, Channel.COLUMN, Channel.X].forEach((channel) => {
    encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
  });

  const yEncQ = encQIndex[Channel.Y];
  if (yEncQ !== undefined) {
    if (encQIndex[Channel.ROW] ||
        schema.cardinality(yEncQ) > opt.smallBandSizeForHighCardinalityOrFacet.maxCardinality) {

      // We check for undefined rather than
      // yEncQ.scale = yEncQ.scale || {} to cover the case where
      // yEncQ.scale has been set to false/null.
      // This prevents us from incorrectly overriding scale and
      // assigning a bandSize when scale is set to false.
      if (yEncQ.scale === undefined) {
        yEncQ.scale = {};
      }

      // We do not want to assign a bandSize if scale is set to false
      // and we only apply this if the scale is (or can be) an ordinal scale.
      if (yEncQ.scale && contains([ScaleType.ORDINAL, undefined], scaleType(yEncQ))) {
        if (!(yEncQ.scale as ScaleQuery).bandSize) {
          (yEncQ.scale as ScaleQuery).bandSize = 12;
        }
      }
    }
  }

  const xEncQ = encQIndex[Channel.X];
  if (xEncQ !== undefined) {
    if (encQIndex[Channel.COLUMN] ||
        schema.cardinality(xEncQ) > opt.smallBandSizeForHighCardinalityOrFacet.maxCardinality) {

      // Just like y, we don't want to do this if scale is null/false
      if (xEncQ.scale === undefined) {
        xEncQ.scale = {};
      }

      // We do not want to assign a bandSize if scale is set to false
      // and we only apply this if the scale is (or can be) an ordinal scale.
      if (xEncQ.scale && contains([ScaleType.ORDINAL, undefined], scaleType(xEncQ))) {
        if (!(xEncQ.scale as ScaleQuery).bandSize) {
          (xEncQ.scale as ScaleQuery).bandSize = 12;
        }
      }
    }
  }

  return specM;
}

export function nominalColorScaleForHighCardinality(specM: SpecQueryModel, schema: Schema, encQIndex: Dict<EncodingQuery>, opt: QueryConfig): SpecQueryModel {
  encQIndex[Channel.COLOR] = specM.getEncodingQueryByChannel(Channel.COLOR);

  const colorEncQ = encQIndex[Channel.COLOR];
  if ((colorEncQ !== undefined) && (colorEncQ.type === Type.NOMINAL) &&
      (schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality)) {

    if (colorEncQ.scale === undefined) {
      colorEncQ.scale = {};
    }

    if (colorEncQ.scale) {
      if (!(colorEncQ.scale as ScaleQuery).range) {
        (colorEncQ.scale as ScaleQuery).range = opt.nominalColorScaleForHighCardinality.palette;
      }
    }
  }

  return specM;
}

export function xAxisOnTopForHighYCardinalityWithoutColumn(specM: SpecQueryModel, schema: Schema, encQIndex: Dict<EncodingQuery>, opt: QueryConfig): SpecQueryModel {
  [Channel.COLUMN, Channel.X, Channel.Y].forEach((channel) => {
    encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
  });

  if (encQIndex[Channel.COLUMN] === undefined) {
    const xEncQ = encQIndex[Channel.X];
    const yEncQ = encQIndex[Channel.Y];
    if (yEncQ !== undefined && yEncQ.field && scaleType(yEncQ) === ScaleType.ORDINAL) {
      if (xEncQ !== undefined) {
        if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {

          if (xEncQ.axis === undefined) {
            xEncQ.axis = {};
          }

          if (xEncQ.axis && !(xEncQ.axis as AxisQuery).orient) {
            (xEncQ.axis as AxisQuery).orient = AxisOrient.TOP;
          }
        }
      }
    }
  }

  return specM;
}
