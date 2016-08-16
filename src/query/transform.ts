import {Filter} from 'vega-lite/src/filter';
import {Formula} from 'vega-lite/src/transform';

export interface TransformQuery {
  calculate?: Formula[];
  filter?: Filter | string | (Filter|string)[];
  filterInvalid?: boolean;
}
