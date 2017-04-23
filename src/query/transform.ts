import {Filter} from 'vega-lite/build/src/filter';
import {VgFormulaTransform} from 'vega-lite/build/src/vega.schema';

export interface TransformQuery {
  calculate?: VgFormulaTransform[];
  filter?: Filter | string | (Filter|string)[];
  filterInvalid?: boolean;
}
