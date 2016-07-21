import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel, getDefaultName, getDefaultEnumValues} from '../src/model';
import {DEFAULT_PROPERTY_PRECENCE, Property, ENCODING_PROPERTIES, NESTED_ENCODING_PROPERTIES} from '../src/property';
import {SHORT_ENUM_SPEC, SpecQuery, isEnumSpec} from '../src/query';
import {Schema} from '../src/schema';
import {duplicate, extend} from '../src/util';

const DEFAULT_SPEC_CONFIG = DEFAULT_QUERY_CONFIG.defaultSpecConfig;

describe('SpecQueryModel', () => {
  const schema = new Schema([]);

  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  describe('getDefaultName', () => {
    it('should have no duplicate default names.', () => {
      let defaultNameIndex = {};

      for (let prop of DEFAULT_PROPERTY_PRECENCE) {
        assert.equal((getDefaultName(prop) in defaultNameIndex), false);
        defaultNameIndex[getDefaultName(prop)] = prop;
      }
    });
  });

  describe('build', () => {
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
          values: [Mark.BAR]
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
    describe('type', () => {
      it('should automatically add type as enumspec and index it', () => {
        const specQ: SpecQuery = {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'A'}
          ]
        };

        const specM = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
        // check if type is enumspec
        assert.isTrue(isEnumSpec(specM.getEncodingQueryByIndex(0).type));
        // check if enumeration specifier index has an index for type
        assert.isOk(specM.enumSpecIndex.type);
      });
    });

    const templateSpecQ: SpecQuery = {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
      ]
    };

    ENCODING_PROPERTIES.forEach((prop) => {
      it('should have ' + prop + ' enumSpecIndex if it is a ShortEnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short enum spec
        specQ.encodings[0][prop] = SHORT_ENUM_SPEC;

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[prop]);
      });

      it('should have ' + prop + ' enumSpecIndex if it is an EnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a full enum spec
        const enumValues = prop === Property.FIELD ?
          ['A', 'B'] :
          getDefaultEnumValues(prop, schema, DEFAULT_QUERY_CONFIG);
        specQ.encodings[0][prop] = {
          values: enumValues
        };

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[prop]);
      });

      it('should not have ' + prop + ' enumSpecIndex if it is specific.', () => {
        let specQ = duplicate(templateSpecQ);
        // do not set to enum spec = make it specific

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isNotOk(enumSpecIndex[prop]);
      });
    });

    NESTED_ENCODING_PROPERTIES.forEach((nestedProp) => {
      const prop = nestedProp.property;
      const parent = nestedProp.parent;
      const child = nestedProp.child;

      it('should have ' + prop + ' enumSpecIndex if it is a ShortEnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short enum spec
        specQ.encodings[0][parent] = {};
        specQ.encodings[0][parent][child] = SHORT_ENUM_SPEC;

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[prop]);
      });

      it('should have ' + prop + ' enumSpecIndex if it is an EnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        specQ.encodings[0][parent] = {};
        specQ.encodings[0][parent][child] = {
          values: getDefaultEnumValues(prop, schema, DEFAULT_QUERY_CONFIG)
        };

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[prop]);
      });

      it('should not have ' + prop + ' enumSpecIndex if it is specific.', () => {
        let specQ = duplicate(templateSpecQ);

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

  describe('channelUsed', () => {
    it('should return true if channel is used for general fieldDef', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, aggregate: AggregateOp.MAX}
        ]
      });
      assert.isTrue(specM.channelUsed(Channel.X));
    });

    it('should return false if channel is used for general fieldDef', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, aggregate: AggregateOp.MAX}
        ]
      });
      assert.isFalse(specM.channelUsed(Channel.Y));
    });

    it('should return false if channel is used for disabled autoCount', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, autoCount: false}
        ]
      });
      assert.isFalse(specM.channelUsed(Channel.X));
    });
  });

  describe('isAggregate', () => {
    it('should return false if the query is not aggregated', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      assert.isFalse(specM.isAggregate());
    });

    it('should return true if the query is aggregated', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE, aggregate: AggregateOp.MAX}
        ]
      });

      assert.isTrue(specM.isAggregate());
    });

    it('should return true if the query has autoCount = true', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, autoCount: true}
        ]
      });

      assert.isTrue(specM.isAggregate());
    });
  });

  describe('toSpec', () => {
    it('should return a Vega-Lite spec if the query is completed', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.QUANTITATIVE}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a correct Vega-Lite spec if the query has autoCount=true', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: Channel.Y, autoCount: true, type: Type.QUANTITATIVE}
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.ORDINAL},
          y: {aggregate: AggregateOp.COUNT, field: '*', type: Type.QUANTITATIVE}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return a correct Vega-Lite spec if the query has autoCount=false', () => {
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: Channel.Y, autoCount: false}
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.ORDINAL}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });


    it('should return a correct Vega-Lite spec if the query has autoCount=false even if channel is unspecified', () => {
      // Basically, we no longer enumerate ambiguous channel autoCount is false.
      const specM = buildSpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.ORDINAL},
          {channel: SHORT_ENUM_SPEC, autoCount: false}
        ]
      });

      const spec = specM.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.ORDINAL}
        },
        config: DEFAULT_SPEC_CONFIG
      });
    });

    it('should return null if the query is incompleted', () => {
      const specM = buildSpecQueryModel({
        mark: {values: [Mark.BAR, Mark.POINT]},
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
        ],
        config: DEFAULT_SPEC_CONFIG
      });

      assert.isNull(specM.toSpec());
    });
  });
});
