#!/bin/bash

npm run ci

pushd dist/ngx-lazy-elements

VERSION=$(npm version $LEVEL)
git push
npm publish

popd
