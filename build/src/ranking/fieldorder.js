"use strict";
var encoding_1 = require("../query/encoding");
exports.name = 'fieldOrder';
/**
 * Return ranking score based on indices of encoded fields in the schema.
 * If there are multiple fields, prioritize field on the lower indices of encodings.
 *
 * For example, to compare two specs with two encodings each,
 * first we compare the field on the 0-th index
 * and only compare the field on the 1-th index only if the fields on the 0-th index are the same.
 */
function score(specM, schema, _) {
    var fieldWildcardIndices = specM.wildcardIndex.encodingIndicesByProperty.get('field');
    if (!fieldWildcardIndices) {
        return {
            score: 0,
            features: []
        };
    }
    var encodings = specM.specQuery.encodings;
    var numFields = schema.fieldSchemas.length;
    var features = [];
    var totalScore = 0, base = 1;
    for (var i = fieldWildcardIndices.length - 1; i >= 0; i--) {
        var index = fieldWildcardIndices[i];
        var encoding = encodings[index];
        // Skip ValueQuery as we only care about order of fields.
        if (encoding_1.isValueQuery(encoding))
            continue;
        var field = encoding.field;
        var fieldWildcard = specM.wildcardIndex.encodings[index].get('field');
        var fieldIndex = schema.fieldSchema(field).index;
        // reverse order field with lower index should get higher score and come first
        var score_1 = -fieldIndex * base;
        totalScore += score_1;
        features.push({
            score: score_1,
            type: 'fieldOrder',
            feature: "field " + fieldWildcard.name + " is " + field + " (#" + fieldIndex + " in the schema)"
        });
        base *= numFields;
    }
    return {
        score: totalScore,
        features: features
    };
}
exports.score = score;
//# sourceMappingURL=fieldorder.js.map