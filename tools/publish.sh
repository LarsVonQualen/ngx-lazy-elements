#!/bin/bash
LEVEL=$1

pushd projects/ngx-lazy-elements
VERSION=$(npm version $LEVEL)
popd

git add .
git commit -m "$VERSION"
git push

npm run ci

pushd dist/ngx-lazy-elements

npm publish

popd
