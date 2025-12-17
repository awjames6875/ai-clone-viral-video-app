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

    if (typedScript.status !== "Pending Script") {
      return NextResponse.json(
        { error: `Cannot approve script with status: ${typedScript.status}` },
        { status: 400 }
      );
    }

    // Update status to Script Approved (the n8n webhook will take it from here)
    const { error: updateError } = await supabase
      .from("scripts")
      .update({ status: "Script Approved" })
      .eq("id", script_id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update script status" },
        { status: 500 }
      );
    }

    // Call n8n webhook to trigger WF2 (Create Video Draft)
    const n8nBaseUrl = process.env.N8N_BASE_URL;
    if (n8nBaseUrl) {
      try {
        const webhookResponse = await fetch(`${n8nBaseUrl}/webhook/approve-script`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            script_id,
          }),
        });

        if (!webhookResponse.ok) {
          console.error("n8n webhook failed:", await webhookResponse.text());
        }
      } catch (webhookError) {
        console.error("n8n webhook error:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Script approved and video generation started",
    });
  } catch (error) {
    console.error("Approve script error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
