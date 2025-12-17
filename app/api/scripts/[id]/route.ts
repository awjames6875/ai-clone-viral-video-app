import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Script, ScriptJson } from "@/lib/supabase";

interface ScriptUpdatePayload {
  caption?: string;
  hashtags?: string[];
  music_track?: string;
  script_json?: ScriptJson;
  status?: Script["status"];
  processed?: boolean;
  video_url?: string;
  error_message?: string;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabase();
  const body = (await request.json()) as ScriptUpdatePayload;

  const { data, error } = await supabase
    .from("scripts")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
