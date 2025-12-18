# Handoff State

**Timestamp:** 2025-12-18
**Branch:** main
**Status:** Ready for IDE switch

---

## What Was Just Completed

### Performance Tracking Enhancement
Added performance tracking to measure how repurposed viral content performs vs. the original source video.

**Changes Made:**

1. **Database Migration** (`add_performance_tracking` - version 20251217141151)
   - Added 5 new columns to `scripts` table:
     - `source_metrics` (JSONB) - Original viral video stats
     - `posted_at` (TIMESTAMPTZ) - When content was posted
     - `platforms` (TEXT[]) - Array of platforms posted to
     - `post_ids` (JSONB) - Post IDs from Blotato response
     - `our_metrics` (JSONB) - Our content's performance

2. **WF1 Update** - Now captures `source_metrics` with views/likes from scraped TikTok video

3. **WF3 Update** - Now captures `posted_at`, `platforms`, and `post_ids` from Blotato response

---

## Files Changed (Not Yet Committed)

| File | Change |
|------|--------|
| `n8n/wf1_daily_script_generator.json` | Added source_metrics to INSERT |
| `n8n/wf3_post_video_manual.json` | Added posted_at, platforms, post_ids to PATCH |
| `tasks/todo.md` | Added review section for performance tracking |

---

## Database State (Supabase Migrations)

| Version | Name | Status |
|---------|------|--------|
| 20251217111554 | create_scripts_table | Applied |
| 20251217111605 | add_rls_policies | Applied |
| 20251217141151 | add_performance_tracking | Applied |

---

## Next Steps (Suggested)

1. **UI for manual metrics entry** - Add form for "Posted" scripts to input our content's performance
2. **Comparison dashboard** - Show "Original: 1.2M views" vs "Ours: 5K views"
3. **Multi-format repurposing** - Generate short/long/text versions from one viral video
4. **Multi-platform scraping** - Add Instagram Reels, YouTube Shorts sources

---

## Environment Variables Needed

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# n8n Webhooks
N8N_BASE_URL=https://your-n8n-instance.com
N8N_WEBHOOK_SECRET=your-webhook-secret

# TikTok Scraper
TIKTOK_NICHE=your-niche
TIKTOK_SCRAPER_API_URL=your-scraper-api

# HeyGen
HEYGEN_API_KEY=your-key
HEYGEN_AVATAR_ID=your-avatar-id

# Blotato
BLOTATO_API_KEY=your-key
```

---

## Quick Resume Commands

```bash
# Navigate to project
cd "al clone viral video app"

# Check status
git status

# Commit the performance tracking changes
git add n8n/wf1_daily_script_generator.json n8n/wf3_post_video_manual.json tasks/todo.md
git commit -m "Add performance tracking to measure content success"

# Import updated workflows to n8n
# - Import wf1_daily_script_generator.json
# - Import wf3_post_video_manual.json
```

---

## Project Overview

**What this app does:**
1. Scrapes viral TikTok videos by niche
2. Analyzes WHY they went viral (Gemini AI)
3. Generates scripts mimicking the viral formula
4. Creates AI avatar videos (HeyGen)
5. Posts to all platforms (Blotato)
6. **NEW:** Tracks performance to learn what works

**Architecture:**
```
TikTok Scrape → Gemini Analysis → Script Generation → Supabase → HeyGen Video → Blotato Posting
                                                        ↑
                                                  source_metrics (NEW)
                                                  our_metrics (NEW)
```
