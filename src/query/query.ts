import {SpecQuery} from './spec';
import {Nest, GroupBy} from './groupby';
import {QueryConfig} from '../config';

export interface Query {
  spec: SpecQuery;

  groupBy?: GroupBy;
  nest?: Nest[];

  orderBy?: string | string[];
  chooseBy?: string | string[];

  config?: QueryConfig;
}
