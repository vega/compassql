import {SpecQuery} from './spec';
import {Nest, GroupBy} from './groupby';
import {QueryConfig} from '../config';

export interface Query {
  spec: SpecQuery;
  nest?: Nest[];
  groupBy?: GroupBy;
  orderBy?: string | string[];
  chooseBy?: string | string[];
  config?: QueryConfig;
}
