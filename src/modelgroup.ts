import {SpecQueryModel} from './model';
import {GroupBy} from './query/groupby';

export interface SpecQueryModelGroup {
  name: string;
  path: string;
  items: (SpecQueryModel | SpecQueryModelGroup)[];
  groupBy?: GroupBy;
  orderGroupBy?: string;
}

export function isSpecQueryModelGroup(item: SpecQueryModel | SpecQueryModelGroup): item is SpecQueryModelGroup {
  return item && item.hasOwnProperty('items');
}

export function getTopItem(g: SpecQueryModelGroup): SpecQueryModel {
  const topItem = g.items[0];
  if (isSpecQueryModelGroup(topItem)) {
    return getTopItem(topItem);
  } else {
    return topItem;
  }
}
