-- Viral Video App - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BRAND CONFIGURATION TABLE
-- Stores brand voice, guidelines, and content strategy
-- ============================================
CREATE TABLE IF NOT EXISTS brand_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Brand voice
  voice_description TEXT,           -- "Witty, slightly sarcastic, expert but approachable"
  banned_phrases TEXT[],            -- Phrases to never use
  required_cta TEXT,                -- "Follow for more tips"
  target_audience TEXT,             -- "Gen Z entrepreneurs, 18-25"
  
  -- Content pillars (what types of content you make)
  content_pillars JSONB DEFAULT '[]'::jsonb,  -- [{name: "educational", weight: 0.4}, {name: "entertainment", weight: 0.3}]
  
  -- Unique angles to differentiate from competitors
  unique_angles TEXT[],             -- ["Always include real data", "Contrarian takes"]
  
  -- Platform-specific guidelines
  platform_guidelines JSONB DEFAULT '{}'::jsonb, -- {tiktok: {tone: "casual"}, instagram: {tone: "polished"}}
  
  -- Quality thresholds
  min_quality_score INTEGER DEFAULT 6,  -- Auto-reject below this
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SERIES TABLE
-- For multi-part content that builds anticipation
-- ============================================
CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,               -- "5 Days of Productivity Hacks"
  description TEXT,
  pillar TEXT,                      -- Content pillar this series belongs to
  target_count INTEGER DEFAULT 5,   -- How many parts in the series
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INSIGHTS TABLE
-- Performance feedback loop - stores winning patterns
-- ============================================
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  insight_type TEXT NOT NULL,       -- "winning_hook", "best_pillar", "optimal_length", "best_posting_time"
  insight_data JSONB NOT NULL,      -- Flexible structure per insight type
  confidence FLOAT DEFAULT 0.5,     -- How confident we are (0-1)
  
  -- Reference to source scripts
  source_script_ids UUID[],         -- Scripts that contributed to this insight
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SCRIPTS TABLE
-- Main content pipeline table
-- ============================================
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'Pending Script'
    CHECK (status IN ('Pending Script', 'Script Approved', 'Video Ready (Preview)', 'Posted', 'Failed')),
  processed BOOLEAN NOT NULL DEFAULT false,

  -- Source video data
  source_video_url TEXT,
  source_hash TEXT UNIQUE,
  source_metrics JSONB,             -- {views: 1000000, likes: 50000, captured_at: "2024-01-01"}

  -- AI-generated content
  analysis_json JSONB,
  script_json JSONB,

  -- Editable fields
  caption TEXT,
  hashtags TEXT[],
  music_track TEXT,

  -- === NEW: Content Strategy Fields ===
  
  -- Content pillar classification
  pillar TEXT,                      -- "educational", "entertainment", "behind-scenes", etc.
  
  -- Quality control
  quality_score INTEGER,            -- 1-10 score from Gemini
  auto_reject BOOLEAN DEFAULT false, -- Scripts below threshold
  qc_checklist JSONB,               -- {hook_grabs_attention: true, matches_brand: true, clear_cta: true}
  
  -- Hook variants for A/B testing
  hook_variants JSONB,              -- [{hook: "Did you know...", score: null}, {hook: "Stop scrolling if...", score: null}]
  selected_hook_index INTEGER DEFAULT 0, -- Which variant to use
  
  -- Series support
  series_id UUID REFERENCES series(id) ON DELETE SET NULL,
  series_position INTEGER,          -- Part 1, 2, 3 of series
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ,        -- When to post (null = ASAP when approved)
  
  -- Platform-specific captions
  platform_captions JSONB,          -- {tiktok: "casual caption", instagram: "polished caption", youtube: "channel CTA"}
  
  -- === END NEW FIELDS ===

  -- Video output
  video_url TEXT,
  error_message TEXT,
  
  -- Posting results
  posted_at TIMESTAMPTZ,
  platforms TEXT[],                 -- ["tiktok", "instagram", "youtube"]
  post_ids JSONB,                   -- {tiktok: "123", instagram: "456"}

  -- Performance tracking (our content vs source)
  our_metrics JSONB,                -- {views: 50000, likes: 2500, captured_at: "2024-01-02"}

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_scripts_status ON scripts(status);
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_pillar ON scripts(pillar);
CREATE INDEX IF NOT EXISTS idx_scripts_quality_score ON scripts(quality_score);
CREATE INDEX IF NOT EXISTS idx_scripts_scheduled_for ON scripts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scripts_series_id ON scripts(series_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(insight_type);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scripts_updated_at
  BEFORE UPDATE ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_config_updated_at
  BEFORE UPDATE ON brand_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DEFAULT BRAND CONFIG (insert one row)
-- ============================================
INSERT INTO brand_config (
  voice_description,
  banned_phrases,
  required_cta,
  target_audience,
  content_pillars,
  unique_angles,
  platform_guidelines,
  min_quality_score
) VALUES (
  'Professional yet approachable, knowledgeable but not condescending, occasionally witty',
  ARRAY['click the link in bio', 'smash that like button', 'you won''t believe'],
  'Follow for more tips like this!',
  'Young professionals and entrepreneurs, 22-35',
  '[{"name": "educational", "weight": 0.4, "description": "Tips, tutorials, how-tos"}, {"name": "entertainment", "weight": 0.3, "description": "Trending formats, humor"}, {"name": "behind-scenes", "weight": 0.2, "description": "Process, day-in-life"}, {"name": "storytelling", "weight": 0.1, "description": "Case studies, transformations"}]'::jsonb,
  ARRAY['Always back claims with data or examples', 'Take contrarian angles when appropriate', 'Share personal experiences'],
  '{"tiktok": {"tone": "casual", "emoji_level": "high", "max_caption_length": 150}, "instagram": {"tone": "polished", "emoji_level": "medium", "max_caption_length": 200}, "youtube": {"tone": "professional", "emoji_level": "low", "include_channel_cta": true}}'::jsonb,
  6
) ON CONFLICT DO NOTHING;
