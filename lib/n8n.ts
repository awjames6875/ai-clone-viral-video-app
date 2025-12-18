interface WebhookPayload {
  script_id: string;
  requested_by_user_id: string;
  tenant_id?: string;
}

interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Trigger an n8n webhook
 */
export async function triggerN8nWebhook(
  webhookPath: string,
  payload: WebhookPayload
): Promise<WebhookResponse> {
  const baseUrl = process.env.N8N_BASE_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!baseUrl) {
    throw new Error("N8N_BASE_URL environment variable is not set");
  }

  const url = `${baseUrl}/webhook/${webhookPath}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (webhookSecret) {
    headers["X-Webhook-Secret"] = webhookSecret;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`n8n webhook failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json().catch(() => ({}));

  return {
    success: true,
    data,
  };
}

/**
 * Trigger the approve-script webhook (WF2)
 */
export async function triggerApproveScript(
  scriptId: string,
  userId: string
): Promise<WebhookResponse> {
  return triggerN8nWebhook("approve-script", {
    script_id: scriptId,
    requested_by_user_id: userId,
  });
}

/**
 * Trigger the post-video webhook (WF3)
 */
export async function triggerPostVideo(
  scriptId: string,
  userId: string
): Promise<WebhookResponse> {
  return triggerN8nWebhook("post-video", {
    script_id: scriptId,
    requested_by_user_id: userId,
  });
}
