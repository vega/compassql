import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {ENUMERATOR_INDEX} from '../src/enumerator';

import {QueryConfig, DEFAULT_QUERY_CONFIG} from './config';
import {SpecQueryModel} from './model';
import {Property} from './property';
import {EncodingQuery} from './query/encoding';
import {SpecQuery} from './query/spec';
import {Schema} from './schema';
import {Dict} from './util';

export function generate(specQ: SpecQuery, schema: Schema, opt: QueryConfig = DEFAULT_QUERY_CONFIG) {
  // 1. Build a SpecQueryModel, which also contains enumSpecIndex
  const specM = SpecQueryModel.build(specQ, schema, opt);
  const enumSpecIndex = specM.enumSpecIndex;

  // 2. Enumerate each of the properties based on propPrecedence.

  let answerSet = [specM]; // Initialize Answer Set with only the input spec query.
  opt.propertyPrecedence.forEach((prop) => {
    // If the original specQuery contains enumSpec for this prop
    if (enumSpecIndex.hasProperty(prop)) {
      // update answerset
      const reducer = ENUMERATOR_INDEX[prop](enumSpecIndex, schema, opt);
      answerSet = answerSet.reduce(reducer, []);
    }
  });

  let ENCODING_QUERY_INDEX: Dict<EncodingQuery> = {};

  if (opt.smallBandSizeForHighCardinality || opt.smallBandSizeForFacet) {
    answerSet = answerSet.map(function(specQM) {

      [Channel.ROW, Channel.Y, Channel.COLUMN, Channel.X].forEach((channel) => {
        ENCODING_QUERY_INDEX[channel] = specQM.getEncodingQueryByChannel(channel);
      });

      const yEncQ = ENCODING_QUERY_INDEX[Channel.Y];
      if (yEncQ !== undefined) {
        if (ENCODING_QUERY_INDEX[Channel.ROW] ||
            schema.cardinality(yEncQ) > 10) {

          if (yEncQ.scale === undefined) {
            specQM.setEncodingProperty(
              specQM.getEncodingQueryIndexByChannel(Channel.Y),
              Property.SCALE,
              true,
              {name: 'scale', values: [true, false]} // not sure what this EnumSpec should be
            );
          }

          if (yEncQ.scale) {
            specQM.setEncodingProperty(
              specQM.getEncodingQueryIndexByChannel(Channel.Y),
              Property.SCALE_BANDSIZE,
              12,
              {name: 'scaleBandSize', values: [12]} // not sure what this EnumSpec should be
            );
          }
        }
      }

      const xEncQ = ENCODING_QUERY_INDEX[Channel.X];
      if (xEncQ !== undefined) {
        if (ENCODING_QUERY_INDEX[Channel.COLUMN] ||
            schema.cardinality(xEncQ) > 10) {

          if (xEncQ.scale === undefined) {
            specQM.setEncodingProperty(
              specQM.getEncodingQueryIndexByChannel(Channel.X),
              Property.SCALE,
              true,
              {name: 'scale', values: [true, false]} // not sure what this EnumSpec should be
            );
          }

          if (xEncQ.scale) {
            specQM.setEncodingProperty(
              specQM.getEncodingQueryIndexByChannel(Channel.X),
              Property.SCALE_BANDSIZE,
              12,
              {name: 'scaleBandSize', values: [12]} // not sure what this EnumSpec should be
            );
          }
        }
      }

      return specQM;
    });
  }

  if (opt.nominalScaleForHighCardinality) {
    answerSet = answerSet.map(function(specQM) {
      ENCODING_QUERY_INDEX[Channel.COLOR] = specQM.getEncodingQueryByChannel(Channel.COLOR);

      const colorEncQ = ENCODING_QUERY_INDEX[Channel.COLOR];
      if ((colorEncQ !== undefined) && (colorEncQ.type === Type.NOMINAL) &&
          (schema.cardinality(colorEncQ) > 10)) {

        if (colorEncQ.scale === undefined) {
          specQM.setEncodingProperty(
            specQM.getEncodingQueryIndexByChannel(Channel.COLOR),
            Property.SCALE,
            true,
            {name: 'scale', values: [true, false]} // not sure what this EnumSpec should be
          );
        }

        if (colorEncQ.scale) {
          specQM.setEncodingProperty(
            specQM.getEncodingQueryIndexByChannel(Channel.COLOR),
            Property.SCALE_RANGE,
            'category20',
            {name: 'scaleRange', values: [undefined]} // not sure what this EnumSpec should be
          );
        }
      }

      return specQM;
    });
  }

  return answerSet;
}


