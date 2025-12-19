import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Status type
export type ScriptStatus =
  | "Pending Script"
  | "Script Approved"
  | "Video Ready (Preview)"
  | "Posted"
  | "Failed";

// Content pillar type
export type ContentPillar = 
  | "educational" 
  | "entertainment" 
  | "behind-scenes" 
  | "storytelling"
  | string; // Allow custom pillars

// Script JSON structure (from Gemini generation)
export interface ScriptJson {
  spoken_script: string;
  caption: string;
  hashtags: string[];
  on_screen_text: string;
  music_track: string;
  hook: string;
}

// Analysis JSON structure (from Gemini analysis)
export interface AnalysisJson {
  summary: string;
  hook: string;
  emotional_triggers: string[];
  key_elements: string[];
}

// Hook variant for A/B testing
export interface HookVariant {
  hook: string;
  score: number | null; // Performance score after posting
}

// Platform-specific captions
export interface PlatformCaptions {
  tiktok?: string;
  instagram?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

// Source metrics from scraped video
export interface SourceMetrics {
  views: number;
  likes: number;
  captured_at: string;
}

// Our performance metrics
export interface OurMetrics {
  views: number;
  likes: number;
  comments?: number;
  shares?: number;
  captured_at: string;
}

// QC Checklist
export interface QCChecklist {
  hook_grabs_attention: boolean;
  matches_brand_voice: boolean;
  clear_cta: boolean;
  no_competitor_mentions: boolean;
  pillar_balanced: boolean;
}

// Full Script record
export interface Script {
  id: string;
  user_id: string | null;
  status: ScriptStatus;
  processed: boolean;
  source_video_url: string | null;
  source_hash: string | null;
  source_metrics: SourceMetrics | null;
  analysis_json: AnalysisJson | null;
  script_json: ScriptJson | null;
  caption: string | null;
  hashtags: string[] | null;
  music_track: string | null;
  
  // Content strategy fields
  pillar: ContentPillar | null;
  quality_score: number | null;
  auto_reject: boolean;
  qc_checklist: QCChecklist | null;
  hook_variants: HookVariant[] | null;
  selected_hook_index: number;
  series_id: string | null;
  series_position: number | null;
  scheduled_for: string | null;
  platform_captions: PlatformCaptions | null;
  
  // Video output
  video_url: string | null;
  error_message: string | null;
  
  // Posting results
  posted_at: string | null;
  platforms: string[] | null;
  post_ids: Record<string, string> | null;
  
  // Performance tracking
  our_metrics: OurMetrics | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================
// BRAND CONFIG TYPES
// ============================================

export interface ContentPillarConfig {
  name: string;
  weight: number;
  description: string;
}

export interface PlatformGuidelines {
  tone: "casual" | "polished" | "professional";
  emoji_level: "high" | "medium" | "low";
  max_caption_length?: number;
  include_channel_cta?: boolean;
}

export interface BrandConfig {
  id: string;
  voice_description: string | null;
  banned_phrases: string[] | null;
  required_cta: string | null;
  target_audience: string | null;
  content_pillars: ContentPillarConfig[];
  unique_angles: string[] | null;
  platform_guidelines: Record<string, PlatformGuidelines>;
  min_quality_score: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// SERIES TYPES
// ============================================

export interface Series {
  id: string;
  name: string;
  description: string | null;
  pillar: string | null;
  target_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// INSIGHTS TYPES
// ============================================

export type InsightType = 
  | "winning_hook"
  | "best_pillar"
  | "optimal_length"
  | "best_posting_time"
  | "top_hashtags";

export interface Insight {
  id: string;
  insight_type: InsightType;
  insight_data: Record<string, unknown>;
  confidence: number;
  source_script_ids: string[] | null;
  created_at: string;
}

// ============================================
// DATABASE TYPES FOR SUPABASE
// ============================================

export interface Database {
  public: {
    Tables: {
      scripts: {
        Row: Script;
        Insert: Partial<Script> & { user_id?: string };
        Update: Partial<Script>;
      };
      brand_config: {
        Row: BrandConfig;
        Insert: Partial<BrandConfig>;
        Update: Partial<BrandConfig>;
      };
      series: {
        Row: Series;
        Insert: Partial<Series> & { name: string };
        Update: Partial<Series>;
      };
      insights: {
        Row: Insight;
        Insert: Partial<Insight> & { insight_type: InsightType; insight_data: Record<string, unknown> };
        Update: Partial<Insight>;
      };
    };
  };
}

// Browser client (uses anon key, respects RLS)
// Note: Using untyped client to avoid TypeScript generic issues with supabase-js
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Alias for browser client
export const createBrowserClient = createClient;

// Server client (uses service role key, bypasses RLS)
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
