
import {SpecQueryModel} from '../model';
import {EncodingQuery, QueryConfig} from '../query';
import {Stats} from '../stats';
import {keys, forEach} from '../util';

import {Channel} from 'vega-lite/src/channel';
import {reduce as encodingReduce} from 'vega-lite/src/encoding';
import {isDimension, FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import * as vlShorthand from 'vega-lite/src/shorthand';
import {Type} from 'vega-lite/src/type';
import {UnitSpec} from 'vega-lite/src/spec';


export function effectiveness(specM: SpecQueryModel, stats: Stats, opt: QueryConfig) {
  return old.rankEncodings(specM.toSpec(), stats, opt);
}

namespace old {
  // bad score not specified in the table above
  var UNUSED_POSITION = 0.5;

  var MARK_SCORE = {
    line: 0.99,
    area: 0.98,
    bar: 0.97,
    tick: 0.96,
    point: 0.95,
    circle: 0.94,
    square: 0.94,
    text: 0.8
  };

  var D:any = {}, M:any = {}, BAD = 0.1, TERRIBLE = 0.01;

  D.minor = 0.01;
  D.pos = 1;
  D.Y_T = 0.8;
  D.facet_text = 1;
  D.facet_good = 0.675; // < color_ok, > color_bad
  D.facet_ok = 0.55;
  D.facet_bad = 0.4;
  D.color_good = 0.7;
  D.color_ok = 0.65; // > M.Size
  D.color_bad = 0.3;
  D.color_stack = 0.6;
  D.shape = 0.6;
  D.detail = 0.5;
  D.bad = BAD;
  D.terrible = TERRIBLE;

  M.pos = 1;
  M.size = 0.6;
  M.color = 0.5;
  M.text = 0.4;
  M.bad = BAD;
  M.terrible = TERRIBLE;

  // FIXME
  export let dimensionScore:any = function(fieldDef: FieldDef, channel: Channel, mark: Mark, stats: Stats, opt: QueryConfig){
    const cardinality = stats.cardinality(fieldDef as any as EncodingQuery); // HACK
    switch (channel) {
      case Channel.X:
        if (fieldDef.type === Type.NOMINAL || fieldDef.type === Type.ORDINAL)  {
          return D.pos - D.minor;
        }
        return D.pos;

      case Channel.Y:
        if (fieldDef.type === Type.NOMINAL || fieldDef.type === Type.ORDINAL) {
          return D.pos - D.minor; // prefer ordinal on y
        }
        if (fieldDef.type === Type.TEMPORAL) {
          return D.Y_T; // time should not be on Y
        }
        return D.pos - D.minor;

      case Channel.COLUMN:
        if (mark === Mark.TEXT) return D.facet_text;
        // prefer column over row due to scrolling issues
        return cardinality <= opt.maxGoodCardinalityForFacet ? D.facet_good :
          cardinality <= opt.maxCardinalityForFacet ? D.facet_ok : D.facet_bad;

      case Channel.ROW:
        if (mark === Mark.TEXT) return D.facet_text;
        return (cardinality <= opt.maxGoodCardinalityForFacet ? D.facet_good :
          cardinality <= opt.maxCardinalityForFacet ? D.facet_ok : D.facet_bad) - D.minor;

      case Channel.COLOR:
        var hasOrder = (fieldDef.bin && fieldDef.type=== Type.QUANTITATIVE) || (fieldDef.timeUnit && fieldDef.type=== Type.TEMPORAL);

        // FIXME add stacking option once we have control ..
        var isStacked = mark === Mark.BAR || mark === Mark.AREA;

        // true ordinal on color is currently BAD (until we have good ordinal color scale support)
        if (hasOrder) return D.color_bad;

        // stacking gets lower score
        if (isStacked) return D.color_stack;

        return cardinality <= opt.maxGoodCardinalityForColor ? D.color_good: cardinality <= opt.maxCardinalityForCategoricalColor ? D.color_ok : D.color_bad;
      case Channel.SHAPE:
        return cardinality <= opt.maxCardinalityForShape ? D.shape : TERRIBLE;
      case Channel.DETAIL:
        return D.detail;
    }
    return TERRIBLE;
  };

  dimensionScore.consts = D;

  // FIXME
  export let measureScore:any = function(fieldDef, channel, mark, stats: Stats, opt) {
    // jshint unused:false
    switch (channel) {
      case Channel.X: return M.pos;
      case Channel.Y: return M.pos;
      case Channel.SIZE:
        if (mark === Mark.BAR || mark === Mark.TEXT || mark === Mark.LINE) {
          return BAD; // size of bar is very bad
        }
        return M.size;
      case Channel.COLOR: return M.color;
      case Channel.TEXT: return M.text;
    }
    return BAD;
  };

  measureScore.consts = M;

  export function rankEncodings(spec: UnitSpec, stats: Stats, opt: QueryConfig) {
    var features = [],
      channels = keys(spec.encoding),
      mark = spec.mark,
      encoding = spec.encoding;

    var encodingMappingByField = encodingReduce(spec.encoding, function(o, fieldDef, channel) {
      var key = vlShorthand.shortenFieldDef(fieldDef);
      var mappings = o[key] = o[key] || [];
      mappings.push({channel: channel, fieldDef: fieldDef});
      return o;
    }, {});

    // data - encoding mapping score
    forEach(encodingMappingByField, function(mappings) {
      var reasons = mappings.map(function(m) {
          return m.channel + vlShorthand.ASSIGN + vlShorthand.shortenFieldDef(m.fieldDef);
        }),
        scores = mappings.map(function(m) {
          var roleScore = isDimension(m.fieldDef) ?
                            dimensionScore : measureScore;

          return roleScore(m.fieldDef, m.channel, spec.mark, stats, opt);
        });

      features.push({
        reason: reasons.join(' | '),
        score: Math.max.apply(null, scores)
      });
    });

    // plot type
    if (mark === Mark.TEXT) {
      // TODO
    } else {
      if (encoding.x && encoding.y) {
        if (isDimension(encoding.x) !== isDimension(encoding.y)) {
          features.push({
            reason: 'OxQ plot',
            score: 0.8
          });
        }
      }
    }

    // penalize not using positional only penalize for non-text
    if (channels.length > 1 && mark !== Mark.TEXT) {
      if ((!encoding.x || !encoding.y) && !encoding.text) {
        features.push({
          reason: 'unused position',
          score: UNUSED_POSITION
        });
      }
    }

    // mark type score
    features.push({
      reason: 'mark='+mark,
      score: MARK_SCORE[mark]
    });

    return {
      score: features.reduce(function(p, f) {
        return p * f.score;
      }, 1),
      features: features
    };
  }
}
