import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';
import {assert} from 'chai';

import {schema} from '../fixture';

import {SpecQueryModel} from '../../src/model';
import {isSpecQueryModelGroup, SpecQueryModelGroup} from '../../src/modelgroup';
import {normalize, query, Query} from '../../src/query/query';
import {EnumSpec} from '../../src/enumspec';
import {duplicate} from '../../src/util';
import {Schema} from '../../src/schema';

describe('query/query', () => {
  describe('query()', () => {
    describe('nested query', () => {
      const q: Query = {
        spec: {
          mark: '?',
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        nest: [
          {groupBy: 'fieldTransform'}
        ],
        orderBy: 'effectiveness',
      };
      const qCopy = duplicate(q);
      const output = query(q, schema);
      const result = output.result;

      it('enumerates a nested query correctly ', () => {
        assert.isTrue(isSpecQueryModelGroup(result.items[0]));
        if (isSpecQueryModelGroup(result.items[0])) {
          const group1: SpecQueryModelGroup = <SpecQueryModelGroup> result.items[0];
          assert.isFalse(isSpecQueryModelGroup(group1.items[0]));
          assert.equal(group1.items.length, 2);
          assert.equal((<SpecQueryModel>group1.items[0]).specQuery.mark, 'tick');
          assert.equal((<SpecQueryModel>group1.items[1]).specQuery.mark, 'point');
        }
      });

      it('should augment enumSpec name for enum specs', () => {
        assert.isDefined((output.query.spec.mark as EnumSpec<Mark>).name);
      });

      it('should not cause side effect to the original query object.', () => {
        assert.deepEqual(q, qCopy);
      });
    });
    it('enumerates a flat query correctly ', () => {
      const q: Query = {
        spec: {
          mark: '?',
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        orderBy: 'effectiveness',
      };
      const result = query(q, schema).result;
      assert.isFalse(isSpecQueryModelGroup(result.items[0]));
      assert.equal(result.items.length, 2);
      assert.equal((<SpecQueryModel>result.items[0]).specQuery.mark, 'tick');
      assert.equal((<SpecQueryModel>result.items[1]).specQuery.mark, 'point');
    });
    it('correctly overrides properties of the provided schema when q has a schema property specified', () => {
      const q: Query = {
        spec: {
          data: {
            values: [
              {x: '1/1/2000'}
            ]
          },
          mark: 'point',
          encodings: [
            {channel: Channel.X, field: 'x', type: Type.TEMPORAL}
          ]
        },
        orderBy: 'effectiveness',
        schema: {x: {type: 'nominal'}}
      };
      const s = Schema.build(q.spec.data.values);
      const result = query(q, s).result;

      // result should have a schema with the x field as nominal
      assert.equal(result.items[0]['_schema'].fieldSchemas[0].type, Type.NOMINAL);
      assert.equal(result.items[0]['_schema'].fieldSchemaIndex['x'].type, Type.NOMINAL);
    });
  });

  describe('normalize', () => {
    it('should correctly normalize query', () => {
      const q: Query = {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        groupBy: 'fieldTransform',
        chooseBy: 'effectiveness',
        orderBy: 'effectiveness'
      };

      assert.deepEqual(normalize(q), {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        nest: [{
          groupBy: 'fieldTransform',
          orderGroupBy: 'effectiveness'
        }],
        chooseBy: 'effectiveness'
      });
    });
  });
});
