import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {SpecQueryModel, getDefaultEnumValues} from '../src/model';
import {Property} from '../src/property';
import {DEFAULT_QUERY_CONFIG, SHORT_ENUM_SPEC, SpecQuery, isEnumSpec} from '../src/query';
import {Schema} from '../src/schema';
import {duplicate, extend} from '../src/util';

describe('SpecQueryModel', () => {
  const schema = new Schema([]);

  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  describe('build', () => {
    it('should not cause side effect to the original query object.', () => {
      const specQ: SpecQuery = {
        mark: SHORT_ENUM_SPEC,
        encodings: []
      };
      const specQueryModel = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
      assert.equal(specQ.mark, SHORT_ENUM_SPEC);
      assert.notEqual(specQ.mark, specQueryModel.specQuery);
    });

    // Mark
    it('should have mark enumSpecIndex if mark is a ShortEnumSpec.', () => {
      const specQ: SpecQuery = {
        mark: SHORT_ENUM_SPEC,
        encodings: []
      };
      const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
      assert.isOk(enumSpecIndex.mark);
    });

    it('should have mark enumSpecIndex if mark is an EnumSpec.', () => {
      const specQ: SpecQuery = {
        mark: {
          enumValues: [Mark.BAR]
        },
        encodings: []
      };
      const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
      assert.isOk(enumSpecIndex.mark);
    });

    it('should have no mark enumSpecIndex if mark is specific.', () => {
      const specQ: SpecQuery = {
        mark: Mark.BAR,
        encodings: []
      };
      const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
      assert.isNotOk(enumSpecIndex.mark);
    });

    // TODO: Transform

    // Encoding
    const encodingproperties = [Property.AGGREGATE, Property.AUTOCOUNT, Property.BIN,
      Property.CHANNEL, Property.TIMEUNIT, Property.FIELD];

    // TODO: also test type

    const templateSpecQ: SpecQuery = {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
      ]
    };

    encodingproperties.forEach((prop) => {
      it('should have ' + prop + ' enumSpecIndex if ' + prop + ' is a ShortEnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short enum spec
        specQ.encodings[0][prop] = SHORT_ENUM_SPEC;

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[prop]);
      });

      it('should have ' + prop + ' enumSpecIndex if ' + prop + ' is an EnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a full enum spec
        const enumValues = prop === Property.FIELD ?
          ['A', 'B'] :
          getDefaultEnumValues(prop, schema, DEFAULT_QUERY_CONFIG);
        specQ.encodings[0][prop] = {
          enumValues: enumValues
        };

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[prop]);
      });

      it('should have ' + prop + ' enumSpecIndex if ' + prop + ' is specific.', () => {
        let specQ = duplicate(templateSpecQ);
        // do not set to enum spec = make it specific

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isNotOk(enumSpecIndex[prop]);
      });
    });

    describe('autoCount', () => {
      const specQ: SpecQuery = {
        mark: Mark.POINT,
        encodings: [{channel: Channel.X, field: 'a', type: Type.ORDINAL}]
      };
      const model = SpecQueryModel.build(specQ, schema, extend({}, DEFAULT_QUERY_CONFIG, {autoAddCount: true}));

      it('should add new encoding if autoCount is enabled' , () => {
        assert.equal(model.specQuery.encodings.length, 2);
        assert.isTrue(isEnumSpec(model.specQuery.encodings[1].autoCount));
      });

      it('should add new channel and autoCount to the enumSpec', () => {
        assert.equal(model.enumSpecIndex.autoCount[0].index, 1);
        assert.equal(model.enumSpecIndex.channel[0].index, 1);
      });
    });
  });

  describe('isAggregate', () => {
    it('should return false if the query is not aggregated', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, aggregate: AggregateOp.MAX}
        ]
      });

      assert.isTrue(specQ.isAggregate());
    });

    it('should return true if the query is aggregated', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, aggregate: AggregateOp.MAX}
        ]
      });

      assert.isTrue(specQ.isAggregate());
    });

    it('should return true if the query has autoCount = true', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, autoCount: true}
        ]
      });

      assert.isTrue(specQ.isAggregate());
    });
  });

  describe('toSpec', () => {
    it('should return a Vega-Lite spec if the query is completed', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      const spec = specQ.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.QUANTITATIVE}
        }
      });
    });

    it('should return a correct Vega-Lite spec if the query has autoCount=true', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: Channel.Y, autoCount: true, type: Type.QUANTITATIVE}
        ]
      });

      const spec = specQ.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.ORDINAL},
          y: {aggregate: AggregateOp.COUNT, field: '*', type: Type.QUANTITATIVE}
        }
      });
    });

    it('should return a correct Vega-Lite spec if the query has autoCount=false', () => {
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: Channel.Y, autoCount: false}
        ]
      });

      const spec = specQ.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.ORDINAL}
        }
      });
    });


    it('should return a correct Vega-Lite spec if the query has autoCount=false even if channel is unspecified', () => {
      // Basically, we no longer enumerate ambiguous channel autoCount is false.
      const specQ = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: SHORT_ENUM_SPEC, autoCount: false}
        ]
      });

      const spec = specQ.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.ORDINAL}
        }
      });
    });

    it('should return null if the query is incompleted', () => {
      const specQ = buildSpecQueryModel({
        mark: {enumValues: [Mark.BAR, Mark.POINT]},
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      assert.isNull(specQ.toSpec());
    });
  });
});
