# Viral Video App - Implementation Plan

## Overview
Build a premium mobile-first Next.js dashboard that integrates with n8n workflows for viral video content creation.

---

## Phase 1: n8n Workflow Files (Create from existing workflow)

### Extracted from existing `AI Agent workflow.json`:
**Current Flow:**
1. Daily TikTok Scraper Schedule (9 AM trigger)
2. Workflow Configuration (set API keys, niche)
3. Scrape TikTok Viral Videos
4. Extract Video Data
5. Analyze Video with Gemini
6. Generate Script with Gemini
7. Save Script to Google Sheets ← **REPLACE WITH SUPABASE**
8. Approval Trigger (Google Sheets polling) ← **REPLACE WITH WEBHOOK**
9. Prepare Approved Script Data
10. Create Video with Heygen
11. Check Heygen Video Status
12. Download Heygen Video
13. Post to All Platforms via Blotato

### Tasks:
- [x] **1.1** Create `/n8n/wf1_daily_script_generator.json`
  - Nodes: Schedule → Config → Scrape → Extract → Analyze → Generate Script → Insert to Supabase (status: "Pending Script")
  - Replace Google Sheets with Supabase INSERT

- [x] **1.2** Create `/n8n/wf2_create_video_draft.json`
  - Webhook trigger: `approve-script`
  - Nodes: Webhook → Update Supabase (status: "Script Approved") → Create Heygen Video → Poll Status → Download → Store video_url → Update Supabase (status: "Video Ready (Preview)")

- [x] **1.3** Create `/n8n/wf3_post_video_manual.json`
  - Webhook trigger: `post-video`
  - Nodes: Webhook → Fetch Script Data → Post via Blotato → Update Supabase (status: "Posted")

---

## Phase 2: Database Setup

### Tasks:
- [x] **2.1** Create `/supabase/schema.sql`
  - Table: `scripts` with all required fields
  - Proper indexes for status filtering

- [x] **2.2** Create `/supabase/rls.sql`
  - Row Level Security policies
  - User-based access control

- [x] **2.3** Create `/src/lib/supabase.ts`
  - Typed Supabase client
  - Type definitions for scripts table

---

## Phase 3: Next.js Project Setup

### Tasks:
- [x] **3.1** Initialize Next.js App Router project
  - TypeScript configuration
  - Tailwind CSS setup
  - shadcn/ui installation

- [x] **3.2** Create `.env.example`
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - N8N_BASE_URL
  - N8N_WEBHOOK_SECRET

- [x] **3.3** Setup Framer Motion
  - Install dependencies
  - Create animation variants in `/src/lib/animations.ts`

---

## Phase 4: API Routes

### Tasks:
- [ ] **4.1** Create `POST /api/scripts/approve`
  - Validate script status = "Pending Script"
  - Update status to "Script Approved"
  - Call n8n webhook: `${N8N_BASE_URL}/webhook/approve-script`
  - Pass: `{ script_id, requested_by_user_id }`

- [ ] **4.2** Create `POST /api/videos/post`
  - Validate status = "Video Ready (Preview)" AND processed = false
  - Call n8n webhook: `${N8N_BASE_URL}/webhook/post-video`
  - Pass: `{ script_id, requested_by_user_id }`

- [ ] **4.3** Create script CRUD routes
  - GET /api/scripts - List with status filter
  - GET /api/scripts/[id] - Single script
  - PATCH /api/scripts/[id] - Update script fields

---

## Phase 5: UI Pages

### Tasks:
- [ ] **5.1** Create `/login` page
  - Supabase Auth (email/password)
  - Clean branded layout
  - Error handling

- [ ] **5.2** Create `/app` (dashboard) page
  - Status tabs: Pending Script | Script Approved | Video Ready | Posted | Failed
  - Script cards with:
    - Hook preview (from script_json or analysis_json)
    - Caption snippet
    - Created time
    - Status badge (color-coded)
  - Skeleton loaders
  - Empty states

- [ ] **5.3** Create `/app/scripts/[id]` page
  - Script editor:
    - spoken_script (editable textarea)
    - caption (editable input)
    - hashtags (editable chips/tags)
    - on_screen_text (editable)
    - music_track (editable)
  - Buttons:
    - Save Draft (Supabase update only)
    - Approve Script (POST /api/scripts/approve)
  - "What happens next" panel showing WF2 nodes:
    - "HeyGen Generate Video"
    - "Wait / Poll for Completion"
    - "Update Status to Video Ready"
  - Guardrails: Disable Approve if status != "Pending Script"

- [ ] **5.4** Create `/app/videos/[id]` page
  - Video player (video_url)
  - Caption + hashtags editing
  - Post Video button (POST /api/videos/post)
  - Guardrails: Disable Post unless status = "Video Ready (Preview)" AND processed = false

---

## Phase 6: UI Components

### Tasks:
- [ ] **6.1** Create shared components
  - StatusBadge (color-coded by status)
  - ScriptCard (dashboard list item)
  - SkeletonCard (loading state)
  - EmptyState (no items)
  - StickyHeader (mobile navigation)

- [ ] **6.2** Create Framer Motion animations
  - List item transitions (staggered)
  - Button feedback (scale/tap)
  - Page transitions
  - Loading shimmer

- [ ] **6.3** Create form components
  - HashtagInput (chips with add/remove)
  - ScriptTextarea (with character count)
  - VideoPlayer (with controls)

---

## Phase 7: State Machine & Error Handling

### Tasks:
- [ ] **7.1** Implement status flow enforcement
  - Pending Script → Script Approved → Video Ready (Preview) → Posted
  - Failed state from WF2/WF3
  - Display error_message on failed items

- [ ] **7.2** Add retry placeholders
  - Retry button on Failed items
  - Visual error indicators

---

## Phase 8: Documentation

### Tasks:
- [ ] **8.1** Create `/README.md`
  - Supabase setup instructions
  - Environment variables guide
  - n8n webhook configuration
  - How to import workflows
  - How to run the UI

---

## Status Legend (for UI badges)
| Status | Color | Description |
|--------|-------|-------------|
| Pending Script | Yellow | Awaiting review/edit |
| Script Approved | Blue | WF2 triggered, generating video |
| Video Ready (Preview) | Purple | Video ready for review |
| Posted | Green | Successfully posted |
| Failed | Red | Error occurred |

---

## Webhook Payload Format
```json
{
  "script_id": "uuid",
  "tenant_id": "optional-string",
  "requested_by_user_id": "user-uuid"
}
```

## Review Section

### Completed (Phases 1-3)
- **Phase 1**: All 3 n8n workflow files created in `/n8n/`
  - `wf1_daily_script_generator.json` - Scrapes TikTok, generates scripts, stores in Supabase
  - `wf2_create_video_draft.json` - Creates HeyGen videos from approved scripts
  - `wf3_post_video_manual.json` - Posts videos via Blotato
  - Legacy `AI Agent workflow.json` moved to `/n8n/archive/` (used Google Sheets)
- **Phase 2**: Database layer complete
  - Supabase schema and RLS policies in `/supabase/`
  - Typed Supabase client in `/src/lib/supabase.ts`
- **Phase 3**: Next.js project setup complete
  - Next.js 14 with App Router, TypeScript, Tailwind CSS
  - shadcn/ui configured with CSS variables
  - Framer Motion with animation variants in `/src/lib/animations.ts`
  - Project structure: `/src/app/`, `/src/components/`, `/src/lib/`

### Remaining Work (Phases 4-8)
- **Phase 4**: API routes for script approval and video posting
- **Phase 5**: UI pages (login, dashboard, script editor, video preview)
- **Phase 6**: Shared UI components
- **Phase 7**: Status machine and error handling
- **Phase 8**: Documentation

---

**NEXT STEP: Create API routes (Phase 4)**
