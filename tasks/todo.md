# WF2 - HeyGen Video Creation Workflow Fix

## Goal
Create a robust n8n workflow that:
1. Tests HeyGen API auth before generating videos
2. Dynamically fetches available avatars and selects by name
3. Creates HeyGen videos from approved scripts
4. Polls for completion with proper retry/backoff logic
5. Updates Supabase with success/failure status

---

## Phase 1: Core Workflow Structure

### Tasks

- [x] **1.1** Create new workflow JSON with proper n8n Cloud compatibility (hardcoded values, no $env)
- [x] **1.2** Add Webhook Trigger node (POST /approve-script)
- [x] **1.3** Add Workflow Configuration node with hardcoded placeholders for:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - HEYGEN_API_KEY
  - AVATAR_NAME (for dynamic lookup)
- [x] **1.4** Add Fetch Script Data node (GET from Supabase)

---

## Phase 2: HeyGen Auth & Avatar Selection

### Tasks

- [x] **2.1** Add HeyGen Auth Test node (GET /v2/avatars) to validate API key
- [x] **2.2** Add IF node to check auth success (401/403 = config error, stop workflow)
- [x] **2.3** Add Code node to extract avatar_id from avatars list by name matching
- [x] **2.4** Add IF node to check if avatar was found (404 = avatar not found, fail gracefully)

---

## Phase 3: Video Generation

### Tasks

- [x] **3.1** Add Update Status to "Script Approved" node
- [x] **3.2** Add Create HeyGen Video node (POST /v2/video/generate) with:
  - Proper headers (X-Api-Key, Content-Type, Accept)
  - Correct JSON body structure for v2 API
  - Dynamic avatar_id from Phase 2
  - spoken_script from Fetch Script Data
- [x] **3.3** Add Update Status to "Video Generating" node with video_job_id

---

## Phase 4: Polling with Retry/Backoff

### Tasks

- [x] **4.1** Add Wait node (30 seconds initial delay)
- [x] **4.2** Add Check HeyGen Status node (GET /v1/video_status.get)
- [x] **4.3** Add IF node for status check (completed/failed/pending)
- [x] **4.4** Add retry loop with backoff (max 5 retries, 30s spacing)
- [x] **4.5** Add Code node to track retry count and handle backoff logic
- [x] **4.6** Add error handling for 5xx responses (retry with backoff)

---

## Phase 5: Final Status Updates

### Tasks

- [x] **5.1** Add Update Supabase Success node (status=Video Ready (Preview), video_url, processed=true)
- [x] **5.2** Add Update Supabase Failed node (status=Video Failed, error_message)
- [x] **5.3** Add Respond Success webhook response
- [x] **5.4** Add Respond Failed webhook response

---

## Review Section

### 2025-12-19: WF2 HeyGen Integration Fix

**Summary:** Completely rebuilt WF2 workflow with robust HeyGen API integration.

**Changes Made:**

1. **Removed $env references** - All config values are now hardcoded (n8n Cloud compatible)
2. **Added HeyGen Auth Test** - GET /v2/avatars validates API key before proceeding
3. **Dynamic avatar selection** - Fetches avatar list and matches by name (partial, case-insensitive)
4. **Correct v2 API payload** - Uses proper HeyGen v2 video/generate structure
5. **Robust polling** - 5 attempts with 30s spacing, handles 5xx errors with retry
6. **Comprehensive error handling**:
   - 401/403 → Auth failed response
   - 404 avatar → Lists available avatars in error message
   - 5xx → Retries with backoff
   - Timeout → Marks as failed after max attempts

**Workflow Flow:**
```
Webhook → Config → Auth Test → Select Avatar → Fetch Script →
Prepare Data → Update Approved → Create Video → Init Poll →
Wait → Check Status → [SUCCESS/RETRY/FAIL]
```

**Values to Replace in n8n:**
1. `supabaseUrl` → YOUR_SUPABASE_URL (e.g., https://xxx.supabase.co)
2. `supabaseServiceKey` → YOUR_SUPABASE_SERVICE_ROLE_KEY
3. `avatarName` → Name of your HeyGen avatar (currently "Adam CEO")

**HeyGen API Key:** Already set to your new key (sk_V2_hgu_...)

**Nodes (28 total):**
- Webhook Trigger
- Workflow Configuration
- HeyGen Auth Test
- If Auth Success / Respond Auth Failed
- Select Avatar by Name
- If Avatar Found / Respond Avatar Not Found
- Fetch Script Data
- Prepare Video Data
- If Script Valid / Respond Script Invalid
- Update Status to Approved
- Create HeyGen Video
- If Create Success / Update Create Failed / Respond Create Failed
- Init Polling State
- Update Status Generating
- Wait Before Poll
- Check HeyGen Status
- Process Poll Result
- If Poll Success / If Retry Needed
- Update Poll State
- Wait Retry
- Check Status Retry
- Process Retry Result
- If Retry Success / If Continue Retry
- Update Supabase Success / Respond Success
- Update Success (Retry) / Respond Success (Retry)
- Update Supabase Failed / Respond Failed

**Next Steps:**
1. Import workflow JSON to n8n Cloud
2. Replace placeholder values (supabaseUrl, supabaseServiceKey)
3. Test with a script record in Supabase
4. Monitor execution logs for any issues
