import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { triggerApproveScript } from "@/lib/n8n";
import { success, notFound, badRequest, serverError } from "@/lib/api-response";

interface ApproveBody {
  script_id: string;
  requested_by_user_id: string;
}

/**
 * POST /api/scripts/approve
 * Approve a script and trigger n8n video generation workflow
 */
export async function POST(request: NextRequest) {
  let body: ApproveBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { script_id, requested_by_user_id } = body;

  if (!script_id) {
    return badRequest("script_id is required");
  }

  if (!requested_by_user_id) {
    return badRequest("requested_by_user_id is required");
  }

  try {
    const supabase = createServiceClient();

    // Fetch the script and validate status
    const { data: script, error: fetchError } = await supabase
      .from("scripts")
      .select("id, status")
      .eq("id", script_id)
      .single();

    if (fetchError || !script) {
      return notFound("Script not found");
    }

    if (script.status !== "Pending Script") {
      return badRequest(
        `Cannot approve script with status "${script.status}". Only scripts with status "Pending Script" can be approved.`
      );
    }

    // Update status to "Script Approved"
    const { error: updateError } = await supabase
      .from("scripts")
      .update({ status: "Script Approved" })
      .eq("id", script_id);

    if (updateError) {
      throw updateError;
    }

    // Trigger n8n webhook
    try {
      await triggerApproveScript(script_id, requested_by_user_id);
    } catch (webhookError) {
      // Revert status if webhook fails
      await supabase
        .from("scripts")
        .update({ status: "Pending Script" })
        .eq("id", script_id);

      console.error("n8n webhook failed:", webhookError);
      return serverError("Failed to trigger video generation workflow");
    }

    return success({
      message: "Script approved successfully",
      script_id,
      new_status: "Script Approved",
    });
  } catch (err) {
    console.error("Error approving script:", err);
    return serverError("Failed to approve script");
  }
}
