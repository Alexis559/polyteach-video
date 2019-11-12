#!/usr/bin/env bash

# This script is used to run the docker app with the datadog's service on and running

echo "Starting Datadog service"
service datadog-agent start

echo "Starting Node app"
npm start
