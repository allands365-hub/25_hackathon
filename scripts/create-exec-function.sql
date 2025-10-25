-- Create a helper function to execute raw SQL
-- This needs to be run first in Supabase SQL Editor

CREATE OR REPLACE FUNCTION exec(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;
