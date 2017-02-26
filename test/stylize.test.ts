
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {schema} from './fixture';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel} from '../src/model';
import {AxisQuery, ScaleQuery, FieldQuery} from '../src/query/encoding';
import {smallRangeStepForHighCardinalityOrFacet, nominalColorScaleForHighCardinality, xAxisOnTopForHighYCardinalityWithoutColumn} from '../src/stylize';

import {assert} from 'chai';

describe('stylize', () => {
  describe('smallRangeStepForHighCardinalityOrFacet', () => {
    it('should not assign a rangeStep of 12 if cardinality of Y is under 10', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O', scale: {}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, undefined);
    });

    it('should not assign a rangeStep of 12 if cardinality of Y is over 10 and rangeStep is already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O_100', scale: {rangeStep: 21}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 21);
    });

    it('should assign a rangeStep of 12 if cardinality of Y is over 10 and rangeStep is not already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O_100', scale: {}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
    });

    it('should not assign a rangeStep of 12 if there is a row channel and rangeStep is already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'A', scale: {rangeStep: 21}, type: Type.ORDINAL},
            {channel: Channel.ROW, field: 'A', type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 21);
    });

    it('should assign a rangeStep of 12 if there is a row channel and rangeStep is not already set', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'A', scale: {}, type: Type.ORDINAL},
            {channel: Channel.ROW, field: 'A', type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
    });

    it('should not assign a rangeStep if scale is false', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.Y, field: 'O_100', scale: false, type: Type.ORDINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.equal(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, undefined);
    });

    it('should assign a rangeStep if scale is an Wildcard', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.Y, field: 'O_100', scale: {name: 'scale', enum: [true, false]}, type: Type.ORDINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.equal(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
    });

    it('should not assign a rangeStep if rangeStep is a Wildcard', () => {
      let specM = SpecQueryModel.build({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.Y, field: 'O_100', scale: {rangeStep: {name: 'scaleRangeStep', enum: [17, 21]}}, type: Type.ORDINAL}
          ]
        }, schema, DEFAULT_QUERY_CONFIG);

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.Y) as FieldQuery).scale as ScaleQuery).rangeStep, {name: 'scaleRangeStep', enum: [17, 21]});
    });
  });

  describe('nominalColorScaleForHighCardinality', () => {
    it('should not assign a range of category20 if cardinality of color is under 10', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N', scale: {}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.COLOR) as FieldQuery).scale as ScaleQuery).range, undefined);
    });

    it('should not assign a range of category20 if cardinality of color is over 10 and range is already set', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {range: [10, 20]}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.COLOR) as FieldQuery).scale as ScaleQuery).range, [10, 20]);
    });

    it('should assign a range of category20 if cardinality of color is over 10 and range is not already set', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.equal(((specM.getEncodingQueryByChannel(Channel.COLOR) as FieldQuery).scale as ScaleQuery).range, 'category20');
    });

    it('should not assign a range if cardinality of color is over 10 and scale is false', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: false, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.equal(((specM.getEncodingQueryByChannel(Channel.COLOR) as FieldQuery).scale as ScaleQuery).range, undefined);
    });

    it('should assign a range if cardinality of color is over 10 and scale is a Wildcard', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {name: 'scale', enum: [true, false]}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.equal(((specM.getEncodingQueryByChannel(Channel.COLOR) as FieldQuery).scale as ScaleQuery).range, 'category20');
    });

    it('should not assign a range if cardinality of color is over 10 and scale.range is wildcard', () => {
        let specM = SpecQueryModel.build({
            mark: Mark.POINT,
            encodings: [
              {channel: Channel.COLOR, field: 'N20', scale: {range: {name: 'scaleRange', enum: [null]}}, type: Type.NOMINAL}
            ]
          }, schema, DEFAULT_QUERY_CONFIG);

        specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
        assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.COLOR) as FieldQuery).scale as ScaleQuery).range, {name: 'scaleRange', enum: [null]});
    });
  });

  describe('xAxisOnTopForHighYCardinalityWithoutColumn', () => {
    it('should not orient the x axis on top if there is column channel', () => {
      let specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.COLUMN, field: 'A', type: Type.ORDINAL},
          {channel: Channel.X, field: 'Q', type: Type.NOMINAL, axis: {}},
          {channel: Channel.Y, field: 'O_100', type: Type.ORDINAL}
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).axis as AxisQuery).orient, undefined);
    });

    it('should not orient the x axis on top if the orient has already been set', () => {
      let specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE, axis: {orient: 'bottom'}},
          {channel: Channel.Y, field: 'O_100', type: Type.ORDINAL}
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).axis as AxisQuery).orient, 'bottom');
    });

    it('should not orient the x axis on top if axis is set to false', () => {
      let specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE, axis: false},
          {channel: Channel.Y, field: 'O_100', type: Type.ORDINAL}
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).axis as AxisQuery).orient, undefined);
    });

    it('should not orient the x axis on top if the Y channel\'s type is not NOMINAL or ORDINAL', () => {
      let specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE, axis: {}},
          {channel: Channel.Y, field: 'Q2', type: Type.QUANTITATIVE}
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).axis as AxisQuery).orient, undefined);
    });

    it('should not orient the x axis on top if there is no Y channel', () => {
      let specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q2', type: Type.QUANTITATIVE, axis: {}},
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).axis as AxisQuery).orient, undefined);
    });

    it('should not orient the x axis on top if the cardinality of the Y channel is not sufficiently high', () => {
      let specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE, axis: {}},
          {channel: Channel.Y, field: 'O', type: Type.ORDINAL}
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).axis as AxisQuery).orient, undefined);
    });

    it('should orient the x axis on top if there is no column channel and the cardinality of the Y channel is sufficiently high', () => {
      let specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'Q', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'O_100', type: Type.ORDINAL}
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(((specM.getEncodingQueryByChannel(Channel.X) as FieldQuery).axis as AxisQuery).orient, 'top');
    });
  });
});

