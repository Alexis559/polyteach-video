#!/usr/bin/env bash

eval "$(ssh-agent -s)"
chmod 600 .travis/travis
ssh-add .travis/travis
ssh-keyscan igpolytech.fr >> ~/.ssh/known_hosts
git add ./src/api/Polyteach-218b86e392c9.json
git commit -m "Add gcs key"
git remote add deploy dokku@igpolytech.fr:polyteach-video
git config --global push.default simple
git push deploy HEAD:master --force
