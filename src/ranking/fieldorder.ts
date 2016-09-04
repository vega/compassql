import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {Property} from '../property';
import {Schema} from '../schema';

import {RankingScore, FeatureScore} from './ranking';

export const name = 'fieldOrder';

export function score(specM: SpecQueryModel, schema: Schema, opt: QueryConfig): RankingScore {
  const fieldEnumSpecIndices = specM.enumSpecIndex.encodingIndicesByProperty[Property.FIELD];
  if (!fieldEnumSpecIndices) {
    return {
      score: 0,
      features: []
    };
  }

  const encodings = specM.specQuery.encodings;
  const numFields = schema.fieldSchemas.length;

  const features: FeatureScore[] = [];
  let totalScore = 0, base = 1;

  for (let i = fieldEnumSpecIndices.length - 1; i >= 0; i--) {
    const index = fieldEnumSpecIndices[i];
    const field = encodings[index].field as string;
    const fieldEnumSpec = specM.enumSpecIndex.encodings[index].field;
    const fieldIndex = schema.fieldSchema(field).index;
     // reverse order field with lower index should get higher score and come first
    const score = - fieldIndex * base;
    totalScore += score;

    features.push({
      score: score,
      type: 'fieldOrder',
      feature: `field ${fieldEnumSpec.name} is ${field} (#${fieldIndex} in the schema)`
    });

    base *= numFields;
  }

  return {
    score: totalScore,
    features: features
  };
}
