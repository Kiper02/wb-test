#!/bin/sh

echo "Running database migrations..."
npm run knex migrate latest

echo "Starting application..."
exec "$@"