"use strict";
var type_1 = require("vega-lite/build/src/type");
var util_1 = require("../util");
var encoding_1 = require("../query/encoding");
exports.name = 'aggregationQuality';
function score(specM, schema, opt) {
    var feature = aggregationQualityFeature(specM, schema, opt);
    return {
        score: feature.score,
        features: [feature]
    };
}
exports.score = score;
function isDimension(encQ) {
    return encoding_1.isDiscrete(encQ) || !!encQ.timeUnit;
}
function aggregationQualityFeature(specM, _, __) {
    var encodings = specM.getEncodings();
    if (specM.isAggregate()) {
        var isRawContinuous = function (encQ) {
            return encoding_1.isFieldQuery(encQ) && ((encQ.type === type_1.Type.QUANTITATIVE && !encQ.bin && !encQ.aggregate && !encQ.autoCount) ||
                (encQ.type === type_1.Type.TEMPORAL && !encQ.timeUnit));
        };
        if (util_1.some(encodings, isRawContinuous)) {
            // These are plots that pollute continuous fields as dimension.
            // They are often intermediate visualizations rather than what users actually want.
            return {
                type: exports.name,
                score: 0.1,
                feature: 'Aggregate with raw continuous'
            };
        }
        if (util_1.some(encodings, function (encQ) { return encoding_1.isFieldQuery(encQ) && isDimension(encQ); })) {
            var hasCount = util_1.some(encodings, function (encQ) {
                return encoding_1.isFieldQuery(encQ) && (encQ.aggregate === 'count' || encQ.autoCount === true);
            });
            var hasBin = util_1.some(encodings, function (encQ) {
                return encoding_1.isFieldQuery(encQ) && !!encQ.bin;
            });
            if (hasCount) {
                // If there is count, we might add additional count field, making it a little less simple
                // then when we just apply aggregate to Q field
                return {
                    type: exports.name,
                    score: 0.8,
                    feature: 'Aggregate with count'
                };
            }
            else if (hasBin) {
                // This is not as good as binning all the Q and show heatmap
                return {
                    type: exports.name,
                    score: 0.7,
                    feature: 'Aggregate with bin but without count'
                };
            }
            else {
                return {
                    type: exports.name,
                    score: 0.9,
                    feature: 'Aggregate without count and without bin'
                };
            }
        }
        // no dimension -- often not very useful
        return {
            type: exports.name,
            score: 0.3,
            feature: 'Aggregate without dimension'
        };
    }
    else {
        if (util_1.some(encodings, function (encQ) { return encoding_1.isFieldQuery(encQ) && !isDimension(encQ); })) {
            // raw plots with measure -- simplest of all!
            return {
                type: exports.name,
                score: 1,
                feature: 'Raw with measure'
            };
        }
        // raw plots with no measure -- often a lot of occlusion
        return {
            type: exports.name,
            score: 0.2,
            feature: 'Raw without measure'
        };
    }
}
//# sourceMappingURL=aggregation.js.map