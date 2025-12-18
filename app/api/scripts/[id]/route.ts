import { NextRequest } from "next/server";
import { createServiceClient, ScriptUpdate, ScriptJson } from "@/lib/supabase";
import { success, notFound, badRequest, serverError } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/scripts/[id]
 * Fetch a single script by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return badRequest("Script ID is required");
  }

  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return notFound("Script not found");
      }
      throw error;
    }

    return success(data);
  } catch (err) {
    console.error("Error fetching script:", err);
    return serverError("Failed to fetch script");
  }
}

// Allowed fields for PATCH updates
const ALLOWED_UPDATE_FIELDS = [
  "script_json",
  "caption",
  "hashtags",
  "music_track",
] as const;

interface PatchBody {
  script_json?: ScriptJson;
  caption?: string;
  hashtags?: string[];
  music_track?: string;
}

/**
 * PATCH /api/scripts/[id]
 * Update editable script fields (save draft)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return badRequest("Script ID is required");
  }

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Filter to only allowed fields and build update object
  const updates: ScriptUpdate = {};

  if ("script_json" in body && body.script_json !== undefined) {
    updates.script_json = body.script_json;
  }
  if ("caption" in body && body.caption !== undefined) {
    updates.caption = body.caption;
  }
  if ("hashtags" in body && body.hashtags !== undefined) {
    updates.hashtags = body.hashtags;
  }
  if ("music_track" in body && body.music_track !== undefined) {
    updates.music_track = body.music_track;
  }

  if (Object.keys(updates).length === 0) {
    return badRequest(
      `No valid fields to update. Allowed fields: ${ALLOWED_UPDATE_FIELDS.join(", ")}`
    );
  }

  try {
    const supabase = createServiceClient();

    // Check if script exists
    const { data: existing, error: fetchError } = await supabase
      .from("scripts")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return notFound("Script not found");
    }

    // Perform update
    const { data, error } = await supabase
      .from("scripts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return success(data);
  } catch (err) {
    console.error("Error updating script:", err);
    return serverError("Failed to update script");
  }
}
