import {GroupBy} from './query/groupby';

export interface SpecQueryGroup<T> {
  name: string;
  path: string;
  items: (SpecQueryGroup<T> | T)[];
  groupBy?: GroupBy;
  orderGroupBy?: string | string[];
}

export function isSpecQueryGroup<T>(item: SpecQueryGroup<T> | T): item is SpecQueryGroup<T> {
  return (<SpecQueryGroup<T>>item).items !== undefined;
}

export function getTopSpecQueryItem<T>(specQuery: SpecQueryGroup<T>): T {
  let topItem = specQuery.items[0];
  while (topItem && isSpecQueryGroup(topItem)) {
    topItem = topItem.items[0];
  }
  return <T>topItem;
}


