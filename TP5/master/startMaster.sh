#!/bin/bash

echo "waiting for server ${SERVER} on port ${PORT} for ${TIMEOUT} seconds"

./wait-for ${SERVER}:${PORT} -t ${TIMEOUT} -- node index.js

echo "server ready"
