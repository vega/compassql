import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {schema} from './fixture';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel} from '../src/model';
import {ScaleQuery} from '../src/query/encoding';
import {smallBandSizeForHighCardinalityOrFacet, nominalScaleForHighCardinality} from '../src/stylize';



import {assert} from 'chai';

describe('stylize', () => {
  describe('smallBandSizeForHighCardinalityOrFacet', () => {
    it('should assign a bandSize of 12 if cardinality of Y is over 10 and bandSize is not already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'Q', scale: {}, type: Type.QUANTITATIVE}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, 12);
    });

    it('should not assign a bandSize if scale is false', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.Y, field: 'Q', scale: false, type: Type.QUANTITATIVE}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, undefined);
    });

    it('should not assign a bandSize if scale is an EnumSpec', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.Y, field: 'Q', scale: {name: 'scale', values: [true, false]}, type: Type.QUANTITATIVE}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, undefined);
    });

    it('should not assign a bandSize if bandSize is an Enum Spec', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'Q', scale: {bandSize: {name: 'scaleBandSize', values: [17, 21]}}, type: Type.QUANTITATIVE}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.deepEqual((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, {name: 'scaleBandSize', values: [17, 21]});
    });
  });

  describe('nominalScaleForHighCardinality', () => {
    it('should assign a range of category20 if cardainality of color is over 10 and range is not already set', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalScaleForHighCardinality(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, 'category20');
    });

    it('should not assign a range if cardinality of color is over 10 and scale is false', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: false, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalScaleForHighCardinality(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, undefined);
    });

    it('should not assign a range if cardinality of color is over 10 and scale is an Enum Spec', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {name: 'scale', values: [true, false]}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalScaleForHighCardinality(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, undefined);
    });

    it('should not assign a range if cardinality of color is over 10 and scale.range is an Enum Spec', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {range: {name: 'scaleRange', values: [null]}}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalScaleForHighCardinality(specM, schema);
        assert.deepEqual((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, {name: 'scaleRange', values: [null]});
    });
  });
});
