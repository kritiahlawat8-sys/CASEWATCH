GRANT SELECT, INSERT, UPDATE, DELETE ON public.courts TO service_role, anon, authenticated;

CREATE TABLE IF NOT EXISTS courts (
  id       TEXT PRIMARY KEY,
  label    TEXT NOT NULL,
  category TEXT NOT NULL,
  icon     TEXT,
  state    TEXT
);

CREATE INDEX IF NOT EXISTS idx_courts_category ON courts (category);
CREATE INDEX IF NOT EXISTS idx_courts_state    ON courts (state);

-- Use pg_trgm for efficient ILIKE '%term%' wildcard matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_courts_label    ON courts USING GIN (label gin_trgm_ops);
