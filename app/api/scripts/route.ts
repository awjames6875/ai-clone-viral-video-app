import { NextRequest } from "next/server";
import { createServiceClient, ScriptStatus } from "@/lib/supabase";
import { success, badRequest, serverError } from "@/lib/api-response";

const VALID_STATUSES: ScriptStatus[] = [
  "Pending Script",
  "Script Approved",
  "Video Ready (Preview)",
  "Posted",
  "Failed",
];

/**
 * GET /api/scripts
 * List scripts with optional status filter and pagination
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") as ScriptStatus | null;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (status && !VALID_STATUSES.includes(status)) {
    return badRequest(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  try {
    const supabase = createServiceClient();

    let query = supabase
      .from("scripts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return success({
      scripts: data,
      total: count,
      limit,
      offset,
    });
  } catch (err) {
    console.error("Error fetching scripts:", err);
    return serverError("Failed to fetch scripts");
  }
}
