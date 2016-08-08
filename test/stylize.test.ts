import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {schema} from './fixture';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel} from '../src/model';
import {ScaleQuery} from '../src/query/encoding';
import {smallBandSizeForHighCardinalityOrFacet, nominalColorScaleForHighCardinality} from '../src/stylize';

import {assert} from 'chai';

describe('stylize', () => {
  describe('smallBandSizeForHighCardinalityOrFacet', () => {
    it('should not assign a bandSize of 12 if cardinality of Y is under 10', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O', scale: {}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, undefined);
    });

    it('should not assign a bandSize of 12 if cardinality of Y is over 10 and bandSize is already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O_100', scale: {bandSize: 21}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, 21);
    });

    it('should assign a bandSize of 12 if cardinality of Y is over 10 and bandSize is not already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O_100', scale: {}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, 12);
    });

    it('should not assign a bandSize of 12 if there is a row channel and bandSize is already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'A', scale: {bandSize: 21}, type: Type.ORDINAL},
            {channel: Channel.ROW, field: 'A', type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, 21);
    });

    it('should assign a bandSize of 12 if there is a row channel and bandSize is not already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'A', scale: {}, type: Type.ORDINAL},
            {channel: Channel.ROW, field: 'A', type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, 12);
    });

    it('should not assign a bandSize if scale is false', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.Y, field: 'O_100', scale: false, type: Type.ORDINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, undefined);
    });

    it('should assign a bandSize if scale is an EnumSpec', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.Y, field: 'O_100', scale: {name: 'scale', values: [true, false]}, type: Type.ORDINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, 12);
    });

    it('should not assign a bandSize if bandSize is an EnumSpec', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O_100', scale: {bandSize: {name: 'scaleBandSize', values: [17, 21]}}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallBandSizeForHighCardinalityOrFacet(specM, schema);
      assert.deepEqual((specM.getEncodingQueryByChannel(Channel.Y).scale as ScaleQuery).bandSize, {name: 'scaleBandSize', values: [17, 21]});
    });
  });

  describe('nominalColorScaleForHighCardinality', () => {
    it('should not assign a range of category20 if cardinality of color is over 10 and range is already set', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {range: [10, 20]}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema);
        assert.deepEqual((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, [10, 20]);
    });

    it('should assign a range of category20 if cardinality of color is over 10 and range is not already set', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, 'category20');
    });

    it('should not assign a range if cardinality of color is over 10 and scale is false', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: false, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, undefined);
    });

    it('should assign a range if cardinality of color is over 10 and scale is an EnumSpec', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {name: 'scale', values: [true, false]}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema);
        assert.equal((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, 'category20');
    });

    it('should not assign a range if cardinality of color is over 10 and scale.range is an Enum Spec', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {range: {name: 'scaleRange', values: [null]}}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema);
        assert.deepEqual((specM.getEncodingQueryByChannel(Channel.COLOR).scale as ScaleQuery).range, {name: 'scaleRange', values: [null]});
    });
  });
});
