# CompassQL
CompassQL Query Language for visualization recommendation.

## Run Instructions

You can install npm dependency with:

```sh
npm install
```

You can use the following npm commands such as

```
npm run build
npm run lint
npm run test
npm run watch // watcher that build, lint, and test
```

(See package.json for Full list of commands.)


You can use [this branch of vega-editor](https://github.com/vega/vega-editor/tree/compassql) to play with CompassQL.
Make sure to link CompassQL to the editor


```
cd COMPASSQL_DIR
npm link

cd VEGA_EDITOR_DIR
npm run vendor -- -l compassql
```

(You might want to [link your local version of Vega-Lite](https://github.com/vega/vega-editor/tree/compassql#local-testing--debugging) as well.)
