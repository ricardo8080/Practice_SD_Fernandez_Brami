#!/bin/bash

echo "waiting for server ${SERVER} on port ${PORT} for ${TIMEOUT} seconds"

./wait-for master:8080 -t ${TIMEOUT} -- node index.js

echo "server ready"
