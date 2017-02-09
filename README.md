# CompassQL
CompassQL Query Language for visualization recommendation.


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

The main method is `cql.query`, which is in `src/query.ts`.

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
