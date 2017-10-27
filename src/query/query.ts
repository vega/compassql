import {SpecQuery} from './spec';
import {Nest, GroupBy} from './groupby';
import {QueryConfig} from '../config';

export interface Query {
  /**
   * **Specification** (`spec`) for describing a collection of queried visualizations. This `spec`'s syntax follows a structure similar to [Vega-Lite](https://vega.github.io/vega-lite)'s single view specification.  However, `spec` in CompassQL can have _wildcards_ (or _enumeration specifiers_) to describe properties that can be enumerated.
   *
   * See the SpecQuery interface for more details.
   */
  spec: SpecQuery;

  /**
   * Methods for grouping queried visualization into groups.  This property is a shorthand for the `nest` property with one level.
   */
  groupBy?: GroupBy;

  /**
   * Methods for grouping queried visualization into hierarchical groupings.
   */
  nest?: Nest[];

  /**
   * Method for ordering the list of visualization represented by this query (or the list of visualization groups if `groupBy` or `nest` is specified.)
   */
  orderBy?: string | string[];

  /**
   * Method for ordering the top visualization represented by this query (or the top  visualization group if `groupBy` or `nest` is specified.)
   */
  chooseBy?: string | string[];

  /**
   * Configuration for customizing query parameters.
   */
  config?: QueryConfig;
}
