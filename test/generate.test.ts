import {assert} from 'chai';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {initEnumJobs} from '../src/generate';
import {DEFAULT_QUERY_CONFIG, Schema, PropertyType, SHORT_ENUM_SPEC, SpecQuery} from '../src/schema';
import {duplicate} from '../src/util';


describe('generate', function () {
  describe('initEnumJobs', () => {
    const schema = new Schema([]);

    // Mark
    it('should have mark job if mark is a ShortEnumSpec.', () => {
      const specQ: SpecQuery = {
        mark: SHORT_ENUM_SPEC,
        encodings: []
      };
      const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
      assert.isTrue(enumJob.mark);
    });

    it('should have mark job if mark is an EnumSpec.', () => {
      const specQ: SpecQuery = {
        mark: {
          enumValues: [Mark.BAR]
        },
        encodings: []
      };
      const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
      assert.isTrue(enumJob.mark);
    });

    it('should have no mark job if mark is specific.', () => {
      const specQ: SpecQuery = {
        mark: Mark.BAR,
        encodings: []
      };
      const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
      assert.isNotOk(enumJob.mark);
    });

    // TODO: Transform

    // Encoding
    const encodingPropertyTypes = [PropertyType.AGGREGATE, PropertyType.BIN,
      PropertyType.CHANNEL, PropertyType.TIMEUNIT, PropertyType.FIELD];

    // TODO: also test type

    const templateSpecQ: SpecQuery = {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
      ]
    };

    encodingPropertyTypes.forEach((propertyType) => {
      it('should have ' + propertyType + ' job if ' + propertyType + ' is a ShortEnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short enum spec
        specQ.encodings[0][propertyType] = SHORT_ENUM_SPEC;

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isOk(enumJob[propertyType]);
      });

      it('should have ' + propertyType + ' job if ' + propertyType + ' is an EnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a full enum spec
        const enumValues = propertyType === PropertyType.FIELD ? ['A', 'B'] : DEFAULT_QUERY_CONFIG[propertyType +'s'];
        specQ.encodings[0][propertyType] = {
          enumValues: enumValues
        };

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isOk(enumJob[propertyType]);
      });

      it('should have ' + propertyType + ' job if ' + propertyType + ' is specific.', () => {
        let specQ = duplicate(templateSpecQ);
        // do not set to enum spec = make it specific

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isNotOk(enumJob[propertyType]);
      });
    });
  });
});