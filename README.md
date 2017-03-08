# CompassQL

CompassQL is a visualization query language that powers chart recommendations in [Voyager 2](https://github.com/vega/voyager2).

As described in our [vision paper](https://idl.cs.washington.edu/papers/compassql) and [Voyager 2](https://idl.cs.washington.edu/papers/voyager2) paper, a CompassQL query is a JSON object that contains the following components:

- **Specification** (`spec`) for describing a collection of queried visualizations. This `spec`'s syntax follows a structure similar to [Vega-Lite](https://vega.github.io/vega-lite)'s unit specification.  However, `spec` in CompassQL can have *enumeration specifiers* (or *wildcards*) describing properties that can be enumerated.<sub>1<sub>

- **Grouping/Nesting** method names (`groupBy` and `nest`) for grouping queried visualizations into groups or hierarchical groups.

- **Ranking** method names (`orderBy` and `chooseBy`) for ordering queried visualizations or choose a top visualization from the collection.

- **Config** (`config`) for customizing query parameters.

Internally, CompassQL engine contains a collection of constraints for enumerating a set of candidate visualizations based on the input specification, and methods for grouping and ranking visualization.

__Notes__:

<sub>1</sub> Since multiple encoding channels can be a wildcard, the `encoding` object in Vega-Lite is flatten as `encodings` which is an array of Encoding in CompassQL's `spec`.

## Usage

Given a row-based array of data object, you can use CQL in two steps.

1) Build a data schema.

```js
var schema = cql.schema.build(data);
```

(You can reuse the same schema for querying the same dataset multiple times.)

2) Execute a CompassQL query.

```js
var output = cql.query(query, schema);
var query = output.query; // normalized query
var result = output.result; // recommendation result
```

Currently, a result is an object of class `SpecQueryModelGroup` that can contains items of class `SpecQueryModel` or `SpecQueryModelGroup`.

For example source code, please see index.html and its source code and console log.  (Currently we don't output any to the HTML yet.)

# Note for Developers

- To understand more about the structure of a CompassQL Query, look at its [interface](https://github.com/vega/compassql/blob/master/src/query/query.ts) declaration.
  - Its `spec` property implements `SpecQuery` interface, which follows the same structure as [Vega-Lite](https://github.com/vega/vega-lite)'s `UnitSpec`.  The interface name has `Query` suffixes to hint that its instance (which can contain wildcards) is a query that describe a collection of specifications.  Most interfaces under `SpecQuery` similarly describe a "query" version of directives in Vega-Lite.

- The root file of our project is `src/cql.ts`, which defines the top-level namespace `cql` for the compiled files. Other files under `src/` reflect namespace structure.  All methods for `cql.xxx` will be in either `src/xxx.ts` or `src/xxx/xxx.ts`.  For example, `cql.util.*` methods are in `src/util.ts`, `cql.query` is in `src/query/query.ts`.

- TODO: constraints
  - List in Vy2 paper supplement..

## Development Instructions

You can install npm dependency with:

```sh
npm install
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
