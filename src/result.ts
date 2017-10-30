import {GroupBy} from './query/groupby';

/**
 * An ordered tree structure for storing query results.
 */
export interface ResultTree<T> {
  name: string;
  path: string;
  items: (ResultTree<T> | T)[];
  groupBy?: GroupBy;
  orderGroupBy?: string | string[];
}

export function isResultTree<T>(item: ResultTree<T> | T): item is ResultTree<T> {
  return (<ResultTree<T>>item).items !== undefined;
}

export function getTopResultTreeItem<T>(specQuery: ResultTree<T>): T {
  let topItem = specQuery.items[0];
  while (topItem && isResultTree(topItem)) {
    topItem = topItem.items[0];
  }
  return <T>topItem;
}

export function mapLeaves<T, U>(group: ResultTree<T>, f: (item: T) => U): ResultTree<U> {
  return {
    ...group,
    items: group.items.map(item => (isResultTree(item) ? mapLeaves(item, f) : f(item)))
  };
}

/**
 * Collapses the given tree into a preorder leaf view.
 * @param group The tree to collapse
 * @param f The function with which to process leaves.
 */
export function collapseTree<T, U>(tree: ResultTree<T>,
                                   f:(item: T) => U) {
  tree.items.map(item => {
    isResultTree(item) ? collapseTree(item, f) : f(item);
  });
}
