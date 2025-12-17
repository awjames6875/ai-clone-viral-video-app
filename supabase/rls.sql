-- Viral Video App - Row Level Security Policies
-- Run this in Supabase SQL Editor AFTER schema.sql

-- Enable RLS on scripts table
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own scripts
CREATE POLICY "Users can view own scripts"
  ON scripts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own scripts
CREATE POLICY "Users can insert own scripts"
  ON scripts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own scripts
CREATE POLICY "Users can update own scripts"
  ON scripts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own scripts
CREATE POLICY "Users can delete own scripts"
  ON scripts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Note: Service role key bypasses RLS automatically
-- n8n workflows use service role key for full access
