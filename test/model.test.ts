import {assert} from 'chai';

import {Mark} from 'vega-lite/src/mark';
import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {SpecQueryModel} from '../src/model';
import {Property} from '../src/property';
import {DEFAULT_QUERY_CONFIG, SHORT_ENUM_SPEC, SpecQuery} from '../src/query';
import {Schema} from '../src/schema';
import {duplicate} from '../src/util';

describe('SpecQueryModel', () => {
  const schema = new Schema([]);

  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  describe('build', () => {
    it('should have cause side effect to the original query object.', () => {
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
    const encodingproperties = [Property.AGGREGATE, Property.BIN,
      Property.CHANNEL, Property.TIMEUNIT, Property.FIELD];

    // TODO: also test type

    const templateSpecQ: SpecQuery = {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
      ]
    };

    encodingproperties.forEach((property) => {
      it('should have ' + property + ' enumSpecIndex if ' + property + ' is a ShortEnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short enum spec
        specQ.encodings[0][property] = SHORT_ENUM_SPEC;

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[property]);
      });

      it('should have ' + property + ' enumSpecIndex if ' + property + ' is an EnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a full enum spec
        const enumValues = property === Property.FIELD ? ['A', 'B'] : DEFAULT_QUERY_CONFIG[property +'s'];
        specQ.encodings[0][property] = {
          enumValues: enumValues
        };

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isOk(enumSpecIndex[property]);
      });

      it('should have ' + property + ' enumSpecIndex if ' + property + ' is specific.', () => {
        let specQ = duplicate(templateSpecQ);
        // do not set to enum spec = make it specific

        const enumSpecIndex = SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG).enumSpecIndex;
        assert.isNotOk(enumSpecIndex[property]);
      });
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
