import {AggregateOp} from 'vega-lite/src/aggregate';
import {X, Y, SIZE, COLOR, Channel} from 'vega-lite/src/channel';
import {AREA, BAR, POINT, SQUARE, CIRCLE, TICK, LINE, RULE, Mark} from 'vega-lite/src/mark';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {DEFAULT_QUERY_CONFIG} from '../../../src/config';
import {SpecQueryModel} from '../../../src/model';
import {extend, nestedMap} from '../../../src/util';
import effectiveness from '../../../src/ranking/effectiveness/effectiveness';
import {schema, stats} from '../../fixture';
import {RuleSet, testRuleSet} from './rule';

function build(specQ) {
  return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
}

const POINTS = [POINT, SQUARE, CIRCLE];

namespace rule1field {
  function plot1d(mark: Mark, channel, type) {
    return SpecQueryModel.build({
      mark: mark,
      encodings: [
        {
          channel: channel,
          field: 'f',
          type: type
        }
      ]
    }, schema, DEFAULT_QUERY_CONFIG);
  }

  export const SET1D: RuleSet<SpecQueryModel> = {
    name: '1D rules',
    rules: []
  };

  SET1D.rules.push({
    name: 'N with varying mark',
    items: nestedMap([[POINT /*, RECT */], TICK, [LINE, BAR, AREA], RULE], (mark) => {
      return plot1d(mark, X, Type.NOMINAL);
    })
  });

  function countplot(mark: Mark, field, type: Type) {
    return SpecQueryModel.build({
      mark: mark,
      encodings: [
        {
          channel: Y,
          field: field,
          type: type
        },{
          channel: X,
          aggregate: AggregateOp.COUNT,
          field: '*',
          type: Type.QUANTITATIVE
        }
      ]
    }, schema, DEFAULT_QUERY_CONFIG);
  }

  SET1D.rules.push({
    name: 'N plot with varying marks',
    items: nestedMap([BAR, POINT, TICK, [LINE, AREA], RULE], (mark) => {
      return countplot(mark, 'N', Type.NOMINAL);
    })
  });

  SET1D.rules.push({
    name: 'O plot with varying marks',
    items: nestedMap([LINE, AREA, BAR, POINT, TICK, RULE], (mark) => {
      return countplot(mark, 'O', Type.ORDINAL);
    })
  });

  SET1D.rules.push({
    name: 'Q dot plot with varying mark',
    items: nestedMap([TICK, POINT, [LINE, BAR, AREA], RULE], (mark) => {
      return plot1d(mark, X, Type.QUANTITATIVE);
    })
  });

  function histogram(mark: Mark, xEncQ) {
    return SpecQueryModel.build({
      mark: mark,
      encodings: [
        xEncQ,{
          channel: Y,
          aggregate: AggregateOp.COUNT,
          field: '*',
          type: Type.QUANTITATIVE
        }
      ]
    }, schema, DEFAULT_QUERY_CONFIG);
  }

  SET1D.rules.push({
    name: 'Q histogram with varying marks',
    items: nestedMap([BAR, POINT, TICK, [LINE, AREA], RULE], (mark) => {
      return histogram(mark, {
        channel: X,
        bin: true,
        field: 'Q',
        type: Type.QUANTITATIVE
      });
    })
  });

  SET1D.rules.push({
    name: 'T dot plot with varying mark',
    items: nestedMap([TICK, POINT, [LINE, BAR, AREA], RULE], (mark) => {
      return plot1d(mark, X, Type.TEMPORAL);
    })
  });

  SET1D.rules.push({
    name: 'TimeUnit T count with varying marks',
    items: nestedMap([LINE, AREA, BAR, POINT, TICK, RULE], (mark) => {
      return histogram(mark, {
        channel: X,
        timeUnit: TimeUnit.MONTH,
        field: 'T',
        type: Type.TEMPORAL
      });
    })
  });
}

export namespace rule2field {
  export const SET2D: RuleSet<SpecQueryModel> = {
    name: '2D rules',
    rules: []
  };

  SET2D.rules.push({
    name: 'NxN',
    items: nestedMap([{
      mark: POINT,
      encodings: [
        {channel: X, field: 'N', type: Type.NOMINAL},
        {channel: Y, field: 'N', type: Type.NOMINAL},
        {channel: SIZE, aggregate: AggregateOp.COUNT, field: '*', type: Type.QUANTITATIVE}
      ]
    },{
      mark: BAR,
      encodings: [
        {channel: X, field: 'N', type: Type.NOMINAL},
        {channel: COLOR, field: 'N1', type: Type.NOMINAL},
        {channel: Y, aggregate: AggregateOp.COUNT, field: '*', type: Type.QUANTITATIVE}
      ]
    }], (specQ) => SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG))
  });

  function stripplot(mark: Mark, qMixIns = {}) {
    return build({
      mark: mark,
      encodings: [
        extend({channel: X, field: 'Q', type: Type.QUANTITATIVE}, qMixIns),
        {channel: Y, field: 'N', type: Type.NOMINAL}
      ]
    });
  }

  SET2D.rules.push({
    name: 'NxQ Strip Plot',
    items: nestedMap([TICK, POINTS], stripplot)
  });

  SET2D.rules.push({
    name: 'NxA(Q) Strip Plot',
    items: nestedMap([BAR, POINTS, TICK, [LINE, AREA], RULE], (mark) => stripplot(mark, {aggregate: AggregateOp.MEAN}))
  });

  // TODO: O

  // TODO: O x BIN(Q) x #
}

function getScore(specM: SpecQueryModel) {
  const featureScores = effectiveness(specM, stats, DEFAULT_QUERY_CONFIG);
  return featureScores.features.reduce((s, featureScore) => {
    return s + featureScore.score;
  }, 0);
}

describe('effectiveness', () => {
  describe('mark for plots with 1 field', () => {
    testRuleSet(rule1field.SET1D, getScore, (specM) => specM.toShorthand()) ;
  });

  describe('mark for plots with 2 fields', () => {
    testRuleSet(rule2field.SET2D, getScore, (specM) => specM.toShorthand()) ;
  });
});
