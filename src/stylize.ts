import * as CHANNEL from 'vega-lite/build/src/channel';
import {hasDiscreteDomain} from 'vega-lite/build/src/scale';
import * as TYPE from 'vega-lite/build/src/type';
import {QueryConfig} from './config';
import {SpecQueryModel} from './model';
import {AxisQuery, EncodingQuery, isFieldQuery, ScaleQuery, scaleType} from './query/encoding';
import {ExpandedType} from './query/expandedtype';
import {Schema} from './schema';
import {Dict} from './util';

export function stylize(answerSet: SpecQueryModel[], schema: Schema, opt: QueryConfig): SpecQueryModel[] {
  let encQIndex: Dict<EncodingQuery> = {};
  answerSet = answerSet.map(function(specM) {
    if (opt.smallRangeStepForHighCardinalityOrFacet) {
      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
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

export function smallRangeStepForHighCardinalityOrFacet(
  specM: SpecQueryModel,
  schema: Schema,
  encQIndex: Dict<EncodingQuery>,
  opt: QueryConfig
): SpecQueryModel {
  [CHANNEL.ROW, CHANNEL.Y, CHANNEL.COLUMN, CHANNEL.X].forEach(channel => {
    encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
  });

  const yEncQ = encQIndex[CHANNEL.Y];
  if (yEncQ !== undefined && isFieldQuery(yEncQ)) {
    if (
      encQIndex[CHANNEL.ROW] ||
      schema.cardinality(yEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality
    ) {
      // We check for undefined rather than
      // yEncQ.scale = yEncQ.scale || {} to cover the case where
      // yEncQ.scale has been set to false/null.
      // This prevents us from incorrectly overriding scale and
      // assigning a rangeStep when scale is set to false.
      if (yEncQ.scale === undefined) {
        yEncQ.scale = {};
      }
    }
  }

  const xEncQ = encQIndex[CHANNEL.X];
  if (isFieldQuery(xEncQ)) {
    if (
      encQIndex[CHANNEL.COLUMN] ||
      schema.cardinality(xEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality
    ) {
      // Just like y, we don't want to do this if scale is null/false
      if (xEncQ.scale === undefined) {
        xEncQ.scale = {};
      }
    }
  }

  return specM;
}

export function nominalColorScaleForHighCardinality(
  specM: SpecQueryModel,
  schema: Schema,
  encQIndex: Dict<EncodingQuery>,
  opt: QueryConfig
): SpecQueryModel {
  encQIndex[CHANNEL.COLOR] = specM.getEncodingQueryByChannel(CHANNEL.COLOR);

  const colorEncQ = encQIndex[CHANNEL.COLOR];
  if (
    isFieldQuery(colorEncQ) &&
    colorEncQ !== undefined &&
    (colorEncQ.type === TYPE.NOMINAL || colorEncQ.type === ExpandedType.KEY) &&
    schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality
  ) {
    if (colorEncQ.scale === undefined) {
      colorEncQ.scale = {};
    }

    if (colorEncQ.scale) {
      if (!(colorEncQ.scale as ScaleQuery).range) {
        (colorEncQ.scale as ScaleQuery).scheme = opt.nominalColorScaleForHighCardinality.palette;
      }
    }
  }

  return specM;
}

export function xAxisOnTopForHighYCardinalityWithoutColumn(
  specM: SpecQueryModel,
  schema: Schema,
  encQIndex: Dict<EncodingQuery>,
  opt: QueryConfig
): SpecQueryModel {
  [CHANNEL.COLUMN, CHANNEL.X, CHANNEL.Y].forEach(channel => {
    encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
  });

  if (encQIndex[CHANNEL.COLUMN] === undefined) {
    const xEncQ = encQIndex[CHANNEL.X];
    const yEncQ = encQIndex[CHANNEL.Y];
    if (
      isFieldQuery(xEncQ) &&
      isFieldQuery(yEncQ) &&
      yEncQ !== undefined &&
      yEncQ.field &&
      hasDiscreteDomain(scaleType(yEncQ))
    ) {
      if (xEncQ !== undefined) {
        if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
          if (xEncQ.axis === undefined) {
            xEncQ.axis = {};
          }

          if (xEncQ.axis && !(xEncQ.axis as AxisQuery).orient) {
            (xEncQ.axis as AxisQuery).orient = 'top';
          }
        }
      }
    }
  }

  return specM;
}
