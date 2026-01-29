-- =============================================================================
-- PostgreSQL Initialization Script
-- =============================================================================
-- This script runs when the PostgreSQL container is first created
-- =============================================================================

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create additional users if needed (optional)
-- CREATE USER readonly WITH PASSWORD 'readonlypassword';
-- GRANT CONNECT ON DATABASE tend TO readonly;
-- GRANT USAGE ON SCHEMA public TO readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- Set default configuration
ALTER DATABASE tend SET timezone TO 'UTC';

-- Log initialization complete
DO $$
BEGIN
    RAISE NOTICE 'Tend database initialized successfully';
END $$;
