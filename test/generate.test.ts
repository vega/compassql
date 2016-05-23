import {assert} from 'chai';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {initEnumJobs, ENUMERATOR_INDEX} from '../src/generate';
import {SpecQueryModel} from '../src/model';
import {Property} from '../src/property';
import {Schema} from '../src/schema';
import {DEFAULT_QUERY_CONFIG, SHORT_ENUM_SPEC, SpecQuery} from '../src/query';
import {duplicate, extend} from '../src/util';


describe('generate', function () {
  const schema = new Schema([]);

  describe('initEnumJob', () => {
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
      it('should have ' + property + ' job if ' + property + ' is a ShortEnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short enum spec
        specQ.encodings[0][property] = SHORT_ENUM_SPEC;

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isOk(enumJob[property]);
      });

      it('should have ' + property + ' job if ' + property + ' is an EnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a full enum spec
        const enumValues = property === Property.FIELD ? ['A', 'B'] : DEFAULT_QUERY_CONFIG[property +'s'];
        specQ.encodings[0][property] = {
          enumValues: enumValues
        };

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isOk(enumJob[property]);
      });

      it('should have ' + property + ' job if ' + property + ' is specific.', () => {
        let specQ = duplicate(templateSpecQ);
        // do not set to enum spec = make it specific

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isNotOk(enumJob[property]);
      });
    });
  });

  describe('mark', () => {
    it('should correctly enumerate marks', () => {
      const enumJob = {mark: true};
      const enumerator = ENUMERATOR_INDEX['mark'](enumJob, schema, DEFAULT_QUERY_CONFIG);
      const specQ = new SpecQueryModel({
        mark: {enumValues: [Mark.POINT, Mark.BAR]},
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'A', type: Type.ORDINAL}
        ]
      });
      const answerSet = enumerator([], specQ);
      assert.equal(answerSet.length, 2);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
      assert.equal(answerSet[1].getMark(), Mark.BAR);
    });

    it('should not enumerate invalid mark', () => {
      const enumJob = {mark: true};
      const enumerator = ENUMERATOR_INDEX['mark'](enumJob, schema, DEFAULT_QUERY_CONFIG);
      const specQ = new SpecQueryModel({
        mark: {enumValues: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA]},
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.SHAPE, field: 'A', type: Type.ORDINAL}
        ]
      });
      const answerSet = enumerator([], specQ);
      assert.equal(answerSet.length, 1);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
    });
  });

  describe('encoding', () => {
    describe('channel', () => {
      it('should correctly enumerate channels', () => {
        const enumJob = {channel: [0]};
        const enumerator = ENUMERATOR_INDEX['channel'](enumJob, schema, extend({}, DEFAULT_QUERY_CONFIG, {omitVerticalDotPlot: false}));
        const specQ = new SpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: {enumValues: [Channel.X, Channel.Y]},
              field: 'A',
              type: Type.QUANTITATIVE
            }
          ]
        });

        const answerSet = enumerator([], specQ);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, Channel.Y);
      });

      it('should not enumerate invalid channels', () => {
        const enumJob = {channel: [0]};
        const enumerator = ENUMERATOR_INDEX['channel'](enumJob, schema, DEFAULT_QUERY_CONFIG);
        const specQ = new SpecQueryModel({
          mark: Mark.BAR,
          encodings: [
            {
              channel: {enumValues: [Channel.X, Channel.SHAPE]},
              field: 'A',
              type: Type.QUANTITATIVE
            }
          ]
        });

        const answerSet = enumerator([], specQ);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
      });
    });
  });
});
