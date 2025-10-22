#!/bin/sh

export PORT=$1
export NODE_ENV='production'
export DB_HOST='127.0.0.1'
export DB_PORT=3306
node index.js
