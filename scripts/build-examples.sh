#!/bin/bash
# script for generating output for example compassql specs.

dir=${dir-"examples/output"}

echo "compiling examples to $dir"

rm -f $dir/*.results.json

for file in examples/specs/*.json; do
  filename=$(basename "$file")
  name="${filename%.json}"
  node scripts/cql2shorthand.js $file > $dir/$name.results.json
done