import {Filter} from 'vega-lite/build/src/filter';
import {Formula} from 'vega-lite/build/src/transform';

export interface TransformQuery {
  calculate?: Formula[];
  filter?: Filter | string | (Filter|string)[];
  filterInvalid?: boolean;
}
