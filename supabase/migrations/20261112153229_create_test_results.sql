/*
# Create test_results table for multi-user Linux assessment

## Overview
Adds a `test_results` table that stores each user's completed Linux skill assessment
on the server so multiple people can take the test concurrently, see their results
from any device, and compare scores in a shared leaderboard.

## New Tables
- `test_results`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), references auth.users with cascade delete)
  - `user_email` (text, NOT NULL) — denormalized for leaderboard display
  - `user_name` (text, nullable) — display name the user enters on the certificate
  - `score_percentage` (integer, NOT NULL) — 0–100 score
  - `correct_answers` (integer, NOT NULL)
  - `incorrect_answers` (integer, NOT NULL)
  - `level_key` (text, NOT NULL) — level key (windows, beginner, intermediate, advanced, expert)
  - `level_name` (text, NOT NULL) — human-readable level name
  - `category_scores` (jsonb, NOT NULL default '[]') — per-category breakdown
  - `result_id` (text, NOT NULL) — display ID like LNX-2026-ABC123
  - `created_at` (timestamptz, default now())

## Security
- Enable RLS on `test_results`.
- Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` only (sign-in required).
- Owner-scoped CRUD: users can only SELECT/UPDATE/DELETE their own rows.
- All users can see all rows for SELECT (leaderboard) — but only modify their own.
  - SELECT policy: `TO authenticated USING (true)` — shared leaderboard data.
  - INSERT/UPDATE/DELETE: `auth.uid() = user_id` ownership check.

## Notes
1. `user_id` defaults to `auth.uid()` so frontend inserts that omit user_id still pass the WITH CHECK.
2. `user_email` is denormalized so the leaderboard query doesn't need to join auth.users (which is not accessible via Data API).
3. Only the latest result per user is shown on the leaderboard (frontend handles dedup or we can query with DISTINCT ON).
*/

CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  user_name text,
  score_percentage integer NOT NULL,
  correct_answers integer NOT NULL,
  incorrect_answers integer NOT NULL,
  level_key text NOT NULL,
  level_name text NOT NULL,
  category_scores jsonb NOT NULL DEFAULT '[]'::jsonb,
  result_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON test_results TO authenticated;

-- Leaderboard: all authenticated users can see everyone's results
DROP POLICY IF EXISTS "select_all_test_results" ON test_results;
CREATE POLICY "select_all_test_results"
  ON test_results FOR SELECT
  TO authenticated USING (true);

-- Users can only insert their own results
DROP POLICY IF EXISTS "insert_own_test_result" ON test_results;
CREATE POLICY "insert_own_test_result"
  ON test_results FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only update their own results
DROP POLICY IF EXISTS "update_own_test_result" ON test_results;
CREATE POLICY "update_own_test_result"
  ON test_results FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own results
DROP POLICY IF EXISTS "delete_own_test_result" ON test_results;
CREATE POLICY "delete_own_test_result"
  ON test_results FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Index for leaderboard sorting (highest score first)
CREATE INDEX IF NOT EXISTS idx_test_results_score_percentage ON test_results(score_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);
