#!/bin/bash

# Script to run specific API tests
# Usage: ./test-api.sh [test-file-pattern]

if [ $# -eq 0 ]; then
    echo "Running all API tests..."
    npm run test:api
else
    echo "Running tests matching pattern: $1"
    npx jest --testNamePattern="$1"
fi
