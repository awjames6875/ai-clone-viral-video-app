# Handoff State

**Timestamp:** 2025-12-20 03:30 AM EST
**Branch:** main
**Status:** WF2 Debugging In Progress - URL Query Parameter Fix Needed

---

## What You Were Working On

### WF2 (Create Video Draft) Workflow Fix

Debugging the n8n workflow that creates HeyGen videos from approved scripts. The workflow receives a script_id via webhook, fetches the script from Supabase, creates a HeyGen video, polls for completion, and updates Supabase with the video URL.

**Root Cause Identified:** The `Fetch Script` HTTP Request node returns empty data because n8n has issues with expressions embedded directly in URLs. The query parameters need to use n8n's built-in Query Parameters feature instead.

---

## Current Blocker & Fix Needed

**Problem:** `Fetch Script` node returns empty `[[]]` even though the script exists in Supabase.

**Fix:** Change from URL-embedded expressions to Query Parameters:

### Current (Broken):
```
URL: =https://habpialjdsyczxxkkbcj.supabase.co/rest/v1/scripts?id=eq.{{ $json.scriptId }}&select=*
```

### Fixed (Do This):
1. URL: `https://habpialjdsyczxxkkbcj.supabase.co/rest/v1/scripts` (no query string)
2. Enable "Send Query Parameters" toggle
3. Add parameter: Name=`id`, Value=`eq.{{ $json.scriptId }}`
4. Add parameter: Name=`select`, Value=`*`

---

## Test Data Available

**Test Script ID:** `648cc5c9-4349-4f3b-b43a-471eb95e2aac`

This script exists in Supabase with status "Pending Script" and contains:
```json
{
  "spoken_script": "Did you know that most people scroll past the best content? Here is a secret that top creators use. They hook you in the first 3 seconds. Try this technique and watch your views explode."
}
```

---

## Workflow Details

**n8n Workflow ID:** `X0OvrziKjfp8kKrK`
**Workflow Name:** WF2 - Create Video Draft
**Webhook URL:** https://awjames.app.n8n.cloud/webhook/create-video
**Test Webhook URL:** https://awjames.app.n8n.cloud/webhook-test/create-video

**Headers Already Fixed:**
- `apikey: {{ $json.supabaseKey }}` ✅
- `Authorization: Bearer {{ $json.supabaseKey }}` ✅

---

## Resume Steps

1. Open n8n: https://awjames.app.n8n.cloud
2. Open workflow "WF2 - Create Video Draft"
3. Click "Fetch Script" node
4. Apply the Query Parameters fix above
5. Save workflow
6. Test via MCP or Postman:
   ```json
   POST /webhook-test/create-video
   { "script_id": "648cc5c9-4349-4f3b-b43a-471eb95e2aac" }
   ```

---

## Files Changed This Session

| File | Changes |
|------|---------|
| `n8n/wf2_minimal.json` | Created minimal 20-node workflow (alternative) |
| `n8n/wf2_create_video_draft.json` | Various debugging attempts |
| `tasks/todo.md` | Updated with WF2 fix tasks |

---

## What's Working

- ✅ n8n MCP connection (can search/execute workflows)
- ✅ Supabase connection (curl commands work with auth headers)
- ✅ Webhook trigger receiving requests
- ✅ Extract Config node extracting scriptId correctly
- ✅ If Valid Input passing data correctly
- ❌ Fetch Script returning empty (needs Query Parameters fix)

---

## API Keys (Already in Workflow)

- **Supabase Service Key:** Hardcoded in workflow ✅
- **HeyGen API Key:** `sk_V2_hgu_kcWFcXGWWja_pBX4MbRCxxyS7DHusruaY50fcdSBq8zu` ✅
- **Talking Photo ID:** `d3882e6017e04a569868b81c6d60fab6` ✅
- **Voice ID:** `2d5b0e6cf36f460aa7fc47e3eee4ba54` ✅

---

## Quick Commands

```bash
# Navigate to project
cd "c:\Users\1alph\OneDrive\Desktop\viral-video-app"

# Check git status
git status

# Test Supabase fetch (works)
curl -s "https://habpialjdsyczxxkkbcj.supabase.co/rest/v1/scripts?id=eq.648cc5c9-4349-4f3b-b43a-471eb95e2aac&select=*" \
  -H "apikey: YOUR_KEY" \
  -H "Authorization: Bearer YOUR_KEY"

# Start Next.js dashboard
npm run dev
```

---

## Project Context

**App Purpose:** Viral video content automation
1. Scrape TikTok for viral videos
2. Analyze with Gemini AI
3. Generate scripts
4. Create AI avatar videos with HeyGen (← YOU ARE HERE)
5. Post to social platforms via Blotato

**Tech Stack:**
- Next.js 14 (dashboard UI)
- Supabase (database)
- n8n Cloud (workflow automation)
- HeyGen (AI video generation)
- Blotato (social media posting)
