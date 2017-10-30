#!/bin/bash

# Check example outputs for changes.
if ! git diff --word-diff=color --exit-code HEAD -- ./examples/output/*.json
then
  echo "Output for cql examples are outdated."
  exit 1
else
  exit 0
fi