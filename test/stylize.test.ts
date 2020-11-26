import {assert} from 'chai';
import {Step} from 'vega-lite/build/src/spec/base';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import * as TYPE from 'vega-lite/build/src/type';
import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel} from '../src/model';
import {AxisQuery, FieldQuery, ScaleQuery} from '../src/query/encoding';
import {
  nominalColorScaleForHighCardinality,
  smallRangeStepForHighCardinalityOrFacet,
  xAxisOnTopForHighYCardinalityWithoutColumn
} from '../src/stylize';
import {schema} from './fixture';

describe('stylize', () => {
  describe('smallRangeStepForHighCardinalityOrFacet', () => {
    it('should not assign a rangeStep of 12 if cardinality of Y is under 10', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          encodings: [{channel: CHANNEL.Y, field: 'O', scale: {}, type: TYPE.ORDINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(
        //((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep,
        specM.specQuery.height,
        undefined
      );
    });

    it('should not assign a rangeStep of 12 if cardinality of Y is over 10 and rangeStep is already set', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          height: {step: 21},
          encodings: [{channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      //assert.equal(((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 21);
      assert.equal((specM.specQuery.height as Step).step, 21);
    });

    it('should assign a rangeStep of 12 if cardinality of Y is over 10 and rangeStep is not already set', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          encodings: [{channel: CHANNEL.Y, field: 'O_100', scale: {}, type: TYPE.ORDINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      //assert.equal(((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
      assert.equal((specM.specQuery.height as Step).step, 12);
    });

    it('should not assign a rangeStep of 12 if there is a row channel and rangeStep is already set', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          height: {step: 21},
          encodings: [
            {channel: CHANNEL.Y, field: 'A', type: TYPE.ORDINAL},
            {channel: CHANNEL.ROW, field: 'A', type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      //assert.equal(((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 21);
      assert.equal((specM.specQuery.height as Step).step, 21);
    });

    it('should assign a rangeStep of 12 if there is a row channel and rangeStep is not already set', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          encodings: [
            {channel: CHANNEL.Y, field: 'A', scale: {}, type: TYPE.ORDINAL},
            {channel: CHANNEL.ROW, field: 'A', type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      //assert.equal(((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
      assert.equal((specM.specQuery.height as Step).step, 12);
    });

    it('should not assign a rangeStep if scale is false', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          encodings: [{channel: CHANNEL.Y, field: 'O_100', scale: false, type: TYPE.ORDINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(
        //((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep,
        specM.specQuery.height,
        undefined
      );
    });

    it('should assign a rangeStep if scale is an Wildcard', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          encodings: [
            {channel: CHANNEL.Y, field: 'O_100', scale: {name: 'scale', enum: [true, false]}, type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      //assert.equal(((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep, 12);
      assert.equal((specM.specQuery.height as Step).step, 12);
    });

    it('should not assign a rangeStep if rangeStep is a Wildcard', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.BAR,
          height: {name: 'step', enum: [{step: 17}, {step: 21}]},
          encodings: [
            {
              channel: CHANNEL.Y,
              field: 'O_100',
              type: TYPE.ORDINAL
            }
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      //assert.deepEqual(((specM.getEncodingQueryByChannel(CHANNEL.Y) as FieldQuery).scale as ScaleQuery).rangeStep, {
      assert.deepEqual(specM.specQuery.height, {
        name: 'step',
        enum: [{step: 17}, {step: 21}]
      });
    });
  });

  describe('nominalColorScaleForHighCardinality', () => {
    it('should not assign a range of category20 if cardinality of color is under 10', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.COLOR, field: 'N', scale: {}, type: TYPE.NOMINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(
        ((specM.getEncodingQueryByChannel(CHANNEL.COLOR) as FieldQuery).scale as ScaleQuery).range,
        undefined
      );
    });

    it('should not assign a range of category20 if cardinality of color is over 10 and range is already set', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.COLOR, field: 'N20', scale: {range: [10, 20]}, type: TYPE.NOMINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(CHANNEL.COLOR) as FieldQuery).scale as ScaleQuery).range, [
        10,
        20
      ]);
    });

    it('should assign a range of category20 if cardinality of color is over 10 and range is not already set', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.COLOR, field: 'N20', scale: {}, type: TYPE.NOMINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(
        ((specM.getEncodingQueryByChannel(CHANNEL.COLOR) as FieldQuery).scale as ScaleQuery).scheme,
        'category20'
      );
    });

    it('should not assign a range if cardinality of color is over 10 and scale is false', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.COLOR, field: 'N20', scale: false, type: TYPE.NOMINAL}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(
        ((specM.getEncodingQueryByChannel(CHANNEL.COLOR) as FieldQuery).scale as ScaleQuery).range,
        undefined
      );
    });

    it('should assign a scheme if cardinality of color is over 10 and scale is a Wildcard', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.COLOR, field: 'N20', scale: {name: 'scale', enum: [true, false]}, type: TYPE.NOMINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(
        ((specM.getEncodingQueryByChannel(CHANNEL.COLOR) as FieldQuery).scale as ScaleQuery).scheme,
        'category20'
      );
    });

    it('should not assign a range if cardinality of color is over 10 and scale.range is wildcard', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {
              channel: CHANNEL.COLOR,
              field: 'N20',
              scale: {range: {name: 'scaleRange', enum: [null]}},
              type: TYPE.NOMINAL
            }
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = nominalColorScaleForHighCardinality(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(CHANNEL.COLOR) as FieldQuery).scale as ScaleQuery).range, {
        name: 'scaleRange',
        enum: [null]
      });
    });
  });

  describe('xAxisOnTopForHighYCardinalityWithoutColumn', () => {
    it('should not orient the x axis on top if there is column channel', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.COLUMN, field: 'A', type: TYPE.ORDINAL},
            {channel: CHANNEL.X, field: 'Q', type: TYPE.NOMINAL, axis: {}},
            {channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(
        ((specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).axis as AxisQuery).orient,
        undefined
      );
    });

    it('should not orient the x axis on top if the orient has already been set', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: {orient: 'bottom'}},
            {channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(((specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).axis as AxisQuery).orient, 'bottom');
    });

    it('should not orient the x axis on top if axis is set to false', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: false},
            {channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(
        ((specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).axis as AxisQuery).orient,
        undefined
      );
    });

    it("should not orient the x axis on top if the Y channel's type is not NOMINAL or ORDINAL", () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: {}},
            {channel: CHANNEL.Y, field: 'Q2', type: TYPE.QUANTITATIVE}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(
        ((specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).axis as AxisQuery).orient,
        undefined
      );
    });

    it('should not orient the x axis on top if there is no Y channel', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.X, field: 'Q2', type: TYPE.QUANTITATIVE, axis: {}}]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(
        ((specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).axis as AxisQuery).orient,
        undefined
      );
    });

    it('should not orient the x axis on top if the cardinality of the Y channel is not sufficiently high', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE, axis: {}},
            {channel: CHANNEL.Y, field: 'O', type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.deepEqual(
        ((specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).axis as AxisQuery).orient,
        undefined
      );
    });

    it('should orient the x axis on top if there is no column channel and the cardinality of the Y channel is sufficiently high', () => {
      let specM = SpecQueryModel.build(
        {
          mark: MARK.POINT,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'O_100', type: TYPE.ORDINAL}
          ]
        },
        schema,
        DEFAULT_QUERY_CONFIG
      );

      specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, {}, DEFAULT_QUERY_CONFIG);
      assert.equal(((specM.getEncodingQueryByChannel(CHANNEL.X) as FieldQuery).axis as AxisQuery).orient, 'top');
    });
  });
});
