import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {Schema} from '../schema';
import {isValueQuery} from '../query/encoding';

import {RankingScore, FeatureScore} from './ranking';

export const name = 'fieldOrder';

/**
 * Return ranking score based on indices of encoded fields in the schema.
 * If there are multiple fields, prioritize field on the lower indices of encodings.
 *
 * For example, to compare two specs with two encodings each,
 * first we compare the field on the 0-th index
 * and only compare the field on the 1-th index only if the fields on the 0-th index are the same.
 */
export function score(specM: SpecQueryModel, schema: Schema, _: QueryConfig): RankingScore {
  const fieldWildcardIndices = specM.wildcardIndex.encodingIndicesByProperty.get('field');
  if (!fieldWildcardIndices) {
    return {
      score: 0,
      features: []
    };
  }

  const encodings = specM.specQuery.encodings;
  const numFields = schema.fieldSchemas.length;

  const features: FeatureScore[] = [];
  let totalScore = 0, base = 1;

  for (let i = fieldWildcardIndices.length - 1; i >= 0; i--) {
    const index = fieldWildcardIndices[i];
    const encoding = encodings[index];

    // Skip ValueQuery as we only care about order of fields.
    if (isValueQuery(encoding)) continue;
    const field = encoding.field as string;
    const fieldWildcard = specM.wildcardIndex.encodings[index].get('field');
    const fieldIndex = schema.fieldSchema(field).index;
     // reverse order field with lower index should get higher score and come first
    const score = - fieldIndex * base;
    totalScore += score;

    features.push({
      score: score,
      type: 'fieldOrder',
      feature: `field ${fieldWildcard.name} is ${field} (#${fieldIndex} in the schema)`
    });

    base *= numFields;
  }

  return {
    score: totalScore,
    features: features
  };
}
