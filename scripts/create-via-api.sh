#!/bin/bash

# Load environment variables
source .env.local

# Supabase project ref (extract from URL)
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')

echo "Project Ref: $PROJECT_REF"
echo "Using Supabase Management API to create tables..."

# Read SQL file
SQL_FILE="../supabase-schema.sql"

# Try to execute via psql if available
if command -v psql &> /dev/null; then
    echo "Using psql to execute schema..."
    # Connection string format
    psql "postgresql://postgres:[YOUR_DB_PASSWORD]@db.${PROJECT_REF}.supabase.co:5432/postgres" < "$SQL_FILE"
else
    echo "psql not found. Please run the SQL manually in Supabase SQL Editor:"
    echo "https://supabase.com/dashboard/project/${PROJECT_REF}/sql"
fi
