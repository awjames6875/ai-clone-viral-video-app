import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { triggerPostVideo } from "@/lib/n8n";
import { success, notFound, badRequest, serverError } from "@/lib/api-response";

interface PostVideoBody {
  script_id: string;
  requested_by_user_id: string;
}

/**
 * POST /api/videos/post
 * Post a video to social platforms via n8n workflow
 */
export async function POST(request: NextRequest) {
  let body: PostVideoBody;
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

    // Fetch the script and validate status + processed flag
    const { data: script, error: fetchError } = await supabase
      .from("scripts")
      .select("id, status, processed")
      .eq("id", script_id)
      .single();

    if (fetchError || !script) {
      return notFound("Script not found");
    }

    if (script.status !== "Video Ready (Preview)") {
      return badRequest(
        `Cannot post video with status "${script.status}". Only videos with status "Video Ready (Preview)" can be posted.`
      );
    }

    if (script.processed) {
      return badRequest("This video has already been posted or is being processed.");
    }

    // Mark as processed to prevent double-posting
    const { error: updateError } = await supabase
      .from("scripts")
      .update({ processed: true })
      .eq("id", script_id);

    if (updateError) {
      throw updateError;
    }

    // Trigger n8n webhook
    try {
      await triggerPostVideo(script_id, requested_by_user_id);
    } catch (webhookError) {
      // Revert processed flag if webhook fails
      await supabase
        .from("scripts")
        .update({ processed: false })
        .eq("id", script_id);

      console.error("n8n webhook failed:", webhookError);
      return serverError("Failed to trigger video posting workflow");
    }

    return success({
      message: "Video posting initiated successfully",
      script_id,
    });
  } catch (err) {
    console.error("Error posting video:", err);
    return serverError("Failed to post video");
  }
}
