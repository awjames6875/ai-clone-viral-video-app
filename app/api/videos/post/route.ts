import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Script } from "@/lib/supabase";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  try {
    const { script_id } = await request.json();

    if (!script_id) {
      return NextResponse.json(
        { error: "script_id is required" },
        { status: 400 }
      );
    }

    // Verify script exists and is in correct status
    const { data: script, error: fetchError } = await supabase
      .from("scripts")
      .select("*")
      .eq("id", script_id)
      .single();

    if (fetchError || !script) {
      return NextResponse.json(
        { error: "Script not found" },
        { status: 404 }
      );
    }

    const typedScript = script as Script;

    if (typedScript.status !== "Video Ready (Preview)") {
      return NextResponse.json(
        { error: `Cannot post video with status: ${typedScript.status}` },
        { status: 400 }
      );
    }

    if (typedScript.processed) {
      return NextResponse.json(
        { error: "Video has already been posted" },
        { status: 400 }
      );
    }

    if (!typedScript.video_url) {
      return NextResponse.json(
        { error: "No video URL available" },
        { status: 400 }
      );
    }

    // Call n8n webhook to trigger WF3 (Post Video)
    const n8nBaseUrl = process.env.N8N_BASE_URL;
    if (n8nBaseUrl) {
      try {
        const webhookResponse = await fetch(`${n8nBaseUrl}/webhook/post-video`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            script_id,
          }),
        });

        if (!webhookResponse.ok) {
          const errorText = await webhookResponse.text();
          console.error("n8n webhook failed:", errorText);
          return NextResponse.json(
            { error: "Failed to trigger video posting" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Video posting initiated",
        });
      } catch (webhookError) {
        console.error("n8n webhook error:", webhookError);
        return NextResponse.json(
          { error: "Failed to connect to workflow engine" },
          { status: 500 }
        );
      }
    } else {
      // If no n8n URL configured, just update the status directly
      const { error: updateError } = await supabase
        .from("scripts")
        .update({
          status: "Posted",
          processed: true,
        })
        .eq("id", script_id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update script status" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Video marked as posted (n8n not configured)",
      });
    }
  } catch (error) {
    console.error("Post video error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
