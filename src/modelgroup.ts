import {SpecQueryModel} from './model';

export interface SpecQueryModelGroup {
  name: string;
  path: string;
  items: (SpecQueryModel | SpecQueryModelGroup)[];
  groupBy?: string;
  orderGroupBy?: string;
}

export function isSpecQueryModelGroup(item: SpecQueryModel | SpecQueryModelGroup): item is SpecQueryModelGroup {
  return item.hasOwnProperty('items');
}

export function getTopItem(g: SpecQueryModelGroup): SpecQueryModel {
  const topItem = g.items[0];
  if (isSpecQueryModelGroup(topItem)) {
    return getTopItem(topItem);
  } else {
    return topItem;
  }
}
