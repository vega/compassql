# CompassQL

CompassQL is a visualization query language that powers chart specifications and recommendations in [Voyager 2](https://github.com/vega/voyager2).

As described in our [vision paper](https://idl.cs.washington.edu/papers/compassql) and [Voyager 2](https://idl.cs.washington.edu/papers/voyager2) paper, a CompassQL query is a JSON object that contains the following components:

- **Specification** (`spec`) for describing a collection of queried visualizations. This `spec`'s syntax follows a structure similar to [Vega-Lite](https://vega.github.io/vega-lite)'s single view specification.  However, `spec` in CompassQL can have *enumeration specifiers* (or *wildcards*) describing properties that can be enumerated.<sup>1</sup>

- **Grouping/Nesting** method names (`groupBy` and `nest`) for grouping queried visualizations into groups or hierarchical groups.

- **Ranking** method names (`orderBy` and `chooseBy`) for ordering queried visualizations or choose a top visualization from the collection.

- **Config** (`config`) for customizing query parameters.

Internally, CompassQL engine contains a collection of constraints for enumerating a set of candidate visualizations based on the input specification, and methods for grouping and ranking visualization.

For example, the following CompassQL query has one wildcard for the `mark` property.  The system will automatically generate different marks and choose the top visual encodings based on the effectiveness score.

```
{
  "spec": {
    "data": {"url": "data/cars.json"},
    "mark": "?",
    "encodings": [
      {
        "channel": "x",
        "aggregate": "mean",
        "field": "Horsepower",
        "type": "quantitative"
      },{
        "channel": "y",
        "field": "Cylinders",
        "type": "ordinal"
      }
    ]
  },
  "chooseBy": "effectiveness"
}
```

The [`examples/specs`](https://github.com/vega/compassql/tree/master/examples/specs) directory contains a number of example CompassQL queries.

To understand more about the structure of a CompassQL Query, look at [the `Query` interface declaration](https://github.com/vega/compassql/blob/master/src/query/query.ts).
- A query's `spec` property implements `SpecQuery` interface, which follows the same structure as [Vega-Lite](https://github.com/vega/vega-lite)'s `UnitSpec` (single view specification) but most of `SpecQuery`'s properties have `-Query` suffixes to hint that its instance is a query that can contain wildcards to describe a collection of specifications.
- Since multiple encoding channels can be a wildcard, the `encoding` object in Vega-Lite is flatten as `encodings` which is an array of Encoding in CompassQL's `spec`.

## Usage

Given a row-based array of data object, here are the steps to use CompassQL:

1) Specify a query config (or use an empty object to use the default configs)

```js
var opt = {}; // Use all default query configs
```

For all query configuration properties, see [`src/config.ts`](https://github.com/vega/compassql/blob/master/src/config.ts).

2) Build a data schema.

```js
var schema = cql.schema.build(data);
```

The `data` property is a row-based array of data objects where each object represents a row in the data table (e.g., `[{"a": 1, "b":2}, {"a": 2, "b": 3}]`).

You can reuse the same schema for querying the same dataset multiple times.

3) Specify a query.  For example, this is a query for automatically selecting a mark:

```js
var query = {
  "spec": {
    "data": {"url": "node_modules/vega-datasets/data/cars.json"},
    "mark": "?",
    "encodings": [
      {
        "channel": "x",
        "aggregate": "mean",
        "field": "Horsepower",
        "type": "quantitative"
      },{
        "channel": "y",
        "field": "Cylinders",
        "type": "ordinal"
      }
    ]
  },
  "chooseBy": "effectiveness"
};
```
4) Execute a CompassQL `query`.

```js
var output = cql.recommend(query, schema);
var result = output.result; // recommendation result
```

The `result` object is an instance of [`SpecQueryModelGroup` (`ResultGroup<SpecQueryModel>`)](https://github.com/vega/compassql/blob/master/src/resultgroup.ts), which is a root of the output ordered tree.  Its `items` property can be either an array of  `SpecQueryModel` or an array of `SpecQueryModelGroup` (for hierarchical groupings).

The `SpecQueryModel` is an class instance of a `SpecQuery` with helper methods.
Note that, in the result, all of spec query models are completely enumerated and there would be no wildcard left.

5) Convert instances of `SpecQueryModel` in the tree, using `SpecQueryModel`'s `toSpec()` class method and the `mapLeaves` method.

```js
var vlTree = cql.result.mapLeaves(result, function(item) {
  return item.toSpec();
});
```

6) Now you can use the result. In this case, the tree has only 2 levels (the root and leaves).
We can just get the top visualization by accessing the 0-th item.

For a full source code, please see [`index.html`](https://github.com/vega/compassql/blob/master/index.html).

```js
var topVlSpec = vlTree.items[0];
```

# Note for Developers

- The root file of our project is `src/cql.ts`, which defines the top-level namespace `cql` for the compiled files. Other files under `src/` reflect namespace structure.  All methods for `cql.xxx` will be in either `src/xxx.ts` or `src/xxx/xxx.ts`.  For example, `cql.util.*` methods are in `src/util.ts`, `cql.query` is in `src/query/query.ts`.

- TODO: constraints
  - List in Vy2 paper supplement..

## Development Instructions

You can install dependencies with:

```sh
yarn install
```

You can use the following npm commands such as

```
npm run build
npm run lint
npm run test
npm run cover       // see test coverage  (see coverage/lcov-report/index.html)
npm run watch       // watcher that build, lint, and test
npm run test-debug  // useful for debugging unit-test with vscode
npm run clean       // useful for wiping out js files that's created from other branch
```

(See package.json for Full list of commands.)

To play with latest CompassQL in the vega-editor, use branch [`cql-vl2`](https://github.com/vega/vega-editor/tree/cql-vl2), which has been updated to use Vega-Lite 2 and Vega 3.
(For CompassQL 0.7 or older, use branch [`compassql`](https://github.com/vega/vega-editor/tree/compassql), which uses Vega-Lite 1.x).

Make sure to link CompassQL to the editor

```
cd COMPASSQL_DIR
npm link

cd VEGA_EDITOR_DIR
npm run vendor -- -l compassql
```

(You might want to [link your local version of Vega-Lite](https://github.com/vega/vega-editor/tree/compassql#local-testing--debugging) as well.)


## Main API

The main method is `cql.recommend`, which is in `src/recommend.ts`.

## Directory Structure

- `examples` - Example CompassQL queries
  - `examples/specs` – All JSON files for CompassQL queries
  - `examples/cql-examples.json` - A json files listing all CompasssQL examples that should be shown in Vega-editor.
- `src/` - Main source code directory.
  - `src/cql.ts` is the root file for CompassQL codebase that exports the global `cql` object. Other files under `src/` reflect namespace structure.
  - All interface for CompassQL syntax should be declared at the top-level of the `src/` folder.
- `test/` - Code for unit testing. `test`'s structure reflects `src`'s' directory structure.
For example, `test/constraint/` test files inside `src/constraint/`.
- `typings/` - TypeScript typing declaration for dependencies.
Some of them are downloaded from the TypeStrong community.

## Pro-Tip

- When you add a new source file to the project, don't forget to the file to `files` in `tsconfig.json`.
