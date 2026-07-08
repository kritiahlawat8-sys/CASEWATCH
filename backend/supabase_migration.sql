-- Run this in Supabase SQL Editor before running seed_courts.py

CREATE TABLE IF NOT EXISTS courts (
  id       TEXT PRIMARY KEY,
  label    TEXT NOT NULL,
  category TEXT NOT NULL,
  icon     TEXT,
  state    TEXT
);

CREATE INDEX IF NOT EXISTS idx_courts_category ON courts (category);
CREATE INDEX IF NOT EXISTS idx_courts_state    ON courts (state);
CREATE INDEX IF NOT EXISTS idx_courts_label    ON courts (label text_pattern_ops);
