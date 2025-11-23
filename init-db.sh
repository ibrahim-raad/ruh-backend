#!/bin/bash
set -e

# Check if database exists
if psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -lqt | cut -d \| -f 1 | grep -qw ruh_therapy_db; then
    echo "Database ruh_therapy_db already exists"
else
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE DATABASE ruh_therapy_db;
EOSQL
    echo "Database ruh_therapy_db created"
fi
