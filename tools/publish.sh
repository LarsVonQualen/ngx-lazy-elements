#!/bin/bash

npm run test
npm run build
npm run e2e

pushd dist/ngx-lazy-elements

VERSION=$(npm version $LEVEL)
git push
npm publish

popd
