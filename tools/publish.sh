#!/bin/bash

pushd projects/ngx-lazy-elements
VERSION=$(npm version $LEVEL)
popd

git push

npm run ci

pushd dist/ngx-lazy-elements

npm publish

popd
