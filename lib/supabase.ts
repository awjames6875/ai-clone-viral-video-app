import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Status type
export type ScriptStatus =
  | "Pending Script"
  | "Script Approved"
  | "Video Ready (Preview)"
  | "Posted"
  | "Failed";

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

// Full Script record
export interface Script {
  id: string;
  user_id: string | null;
  status: ScriptStatus;
  processed: boolean;
  source_video_url: string | null;
  source_hash: string | null;
  analysis_json: AnalysisJson | null;
  script_json: ScriptJson | null;
  caption: string | null;
  hashtags: string[] | null;
  music_track: string | null;
  video_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// Script update fields
export type ScriptUpdate = {
  status?: ScriptStatus;
  processed?: boolean;
  source_video_url?: string | null;
  source_hash?: string | null;
  analysis_json?: AnalysisJson | null;
  script_json?: ScriptJson | null;
  caption?: string | null;
  hashtags?: string[] | null;
  music_track?: string | null;
  video_url?: string | null;
  error_message?: string | null;
};

// Database types for Supabase
export type Database = {
  public: {
    Tables: {
      scripts: {
        Row: Script;
        Insert: Partial<Script> & { user_id?: string };
        Update: ScriptUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Browser client (uses anon key, respects RLS)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

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
