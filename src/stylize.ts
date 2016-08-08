import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {QueryConfig} from './config';
import {SpecQueryModel} from './model';
// import {Property} from './property';
import {EncodingQuery} from './query/encoding';
import {Schema} from './schema';
import {Dict, extend} from './util';

export function stylize(answerSet: SpecQueryModel[], schema: Schema, opt: QueryConfig): SpecQueryModel[] {

  answerSet = answerSet.map(function(specM) {
    let encQIndex: Dict<EncodingQuery> = {};
    let encodings = specM.specQuery.encodings;
    let encQPositionIndex: Dict<number> = {};

    for (let index = 0; index < encodings.length; index++) {
      let channel = encodings[index].channel as Channel;
      encQPositionIndex[channel] = index;
    }

    if (opt.smallBandSizeForHighCardinality || opt.smallBandSizeForFacet) {

      [Channel.ROW, Channel.Y, Channel.COLUMN, Channel.X].forEach((channel) => {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
      });

      const yEncQ = encQIndex[Channel.Y];
      if (yEncQ !== undefined) {
        if (encQIndex[Channel.ROW] ||
            schema.cardinality(yEncQ) > 10) {

          if (yEncQ.scale === undefined) {
            yEncQ['scale'] = extend({},
              yEncQ['scale'],
              {values: undefined, name: undefined}
            );
          }

          // if (yEncQ.scale === undefined) {
          //   specM.setEncodingProperty(
          //     encQPositionIndex[Channel.Y],
          //     Property.SCALE,
          //     true,
          //     {name: 'scale', values: [true, false]}
          //   );
          // }

          if (yEncQ.scale) {
            yEncQ['scale']['bandSize'] = 12;
          }

          // if (yEncQ.scale) {
          //   specM.setEncodingProperty(
          //     encQPositionIndex[Channel.Y],
          //     Property.SCALE_BANDSIZE,
          //     12,
          //     {name: 'scaleBandSize', values: [12]}
          //   );
          // }
        }

        specM.setEncodingQuery(encQPositionIndex[Channel.Y], yEncQ);
      }

      const xEncQ = encQIndex[Channel.X];
      if (xEncQ !== undefined) {
        if (encQIndex[Channel.COLUMN] ||
            schema.cardinality(xEncQ) > 10) {

          if (xEncQ.scale === undefined) {
            xEncQ['scale'] = extend({},
              xEncQ['scale'],
              {values: undefined, name: undefined}
            );
          }

          // if (xEncQ.scale === undefined) {
          //   specM.setEncodingProperty(
          //     encQPositionIndex[Channel.X],
          //     Property.SCALE,
          //     true,
          //     {name: 'scale', values: [true, false]}
          //   );
          // }

          if (xEncQ.scale) {
            xEncQ['scale']['bandSize'] = 12;
          }

          // if (xEncQ.scale) {
          //   specM.setEncodingProperty(
          //     encQPositionIndex[Channel.X],
          //     Property.SCALE_BANDSIZE,
          //     12,
          //     {name: 'scaleBandSize', values: [12]}
          //   );
          // }
        }

        specM.setEncodingQuery(encQPositionIndex[Channel.X], xEncQ);
      }
    }

    if (opt.nominalScaleForHighCardinality) {

      encQIndex[Channel.COLOR] = specM.getEncodingQueryByChannel(Channel.COLOR);

      const colorEncQ = encQIndex[Channel.COLOR];
      if ((colorEncQ !== undefined) && (colorEncQ.type === Type.NOMINAL) &&
          (schema.cardinality(colorEncQ) > 10)) {

        if (colorEncQ.scale === undefined) {
          colorEncQ['scale'] = extend({},
            colorEncQ['scale'],
            {values: undefined, name: undefined}
          );
        }

        // if (colorEncQ.scale === undefined) {
        //   specM.setEncodingProperty(
        //     encQPositionIndex[Channel.COLOR],
        //     Property.SCALE,
        //     true,
        //     {name: 'scale', values: [true, false]}
        //   );
        // }

        if (colorEncQ.scale) {
          colorEncQ['scale']['range'] = 'category20';
        }
        // if (colorEncQ.scale) {
        //   specM.setEncodingProperty(
        //     encQPositionIndex[Channel.COLOR],
        //     Property.SCALE_RANGE,
        //     'category20',
        //     {name: 'scaleRange', values: [undefined]}
        //   );
        // }
      }

      specM.setEncodingQuery(encQPositionIndex[Channel.COLOR], colorEncQ);
    }
    return specM;
  });

  return answerSet;
}
