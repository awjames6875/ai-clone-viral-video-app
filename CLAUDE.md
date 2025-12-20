# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **viral video content automation system** built with n8n workflows. The system scrapes TikTok for viral videos, analyzes them with Gemini AI, generates scripts, creates videos with HeyGen, and posts to social platforms via Blotato.

## Current Status (Updated 2025-12-19)

### What's Working
- Next.js dashboard UI with stats cards, search, filtering
- Toast notification system
- Video preview page with metrics entry & download
- Database schema in Supabase (scripts, brand_config, series, insights tables)
- TypeScript types for all data structures

### What's NOT Working Yet
- **n8n WF1 fails** - "access to env vars denied" error
- n8n Cloud doesn't support `$env.VARIABLE` syntax
- **Fix needed:** Hardcode values directly in n8n "Workflow Configuration" node

### Immediate Next Step
1. In n8n, open WF1 → "Workflow Configuration" node
2. Replace `{{$env.X}}` with actual values from `.env.local`
3. Test the pipeline end-to-end before adding more features

## Architecture

### Workflow Pipeline
```
TikTok Scrape → Gemini Analysis → Script Generation → Supabase Storage → HeyGen Video → Blotato Posting
```

### n8n Workflows (`/n8n/`)

| Workflow | Purpose | Status |
|----------|---------|--------|
| `wf1_daily_script_generator.json` | Scrape TikTok, generate scripts | Needs env var fix |
| `wf2_create_video_draft.json` | Create HeyGen video from script | Not tested |
| `wf3_post_video_manual.json` | Post video to platforms via Blotato | Not tested |
| `wf4_performance_feedback_loop.json` | Track performance metrics | Not tested |
| `*_improved.json` variants | Enhanced versions (ignore for now) | Premature |

### Data Flow
- Scripts stored in Supabase `scripts` table
- Status progression: `Pending Script` → `Script Approved` → `Video Ready (Preview)` → `Posted`
- Failed state captures errors from video generation or posting

### External Services
- **TikTok Scraper API** - Fetches viral videos by niche
- **Google Gemini** - Analyzes videos and generates scripts
- **HeyGen** - Creates AI avatar videos from scripts
- **Blotato** - Posts to multiple social platforms
- **Supabase** - Database and auth
- **n8n Cloud** - Workflow automation (https://awjames.app.n8n.cloud)

## Environment Variables

All secrets stored in `.env.local` (gitignored). Required:
```
NEXT_PUBLIC_SUPABASE_URL     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY    # Supabase admin key (keep secret!)
HEYGEN_API_KEY               # HeyGen API key
N8N_BASE_URL                 # n8n instance URL
N8N_API_KEY                  # n8n API key
```

Still missing (need to add):
```
TIKTOK_NICHE                 # Your content niche
TIKTOK_SCRAPER_API_URL       # TikTok scraper endpoint
HEYGEN_AVATAR_ID             # Your HeyGen avatar
```

## n8n Cloud Limitations

- **Cannot use `$env.VARIABLE`** - Must hardcode values or use n8n Credentials
- **MCP tool is read-only** - Can search/execute workflows, cannot edit them
- **Must enable "Available in MCP"** per workflow in n8n settings

## Key Files

| File | Purpose |
|------|---------|
| `app/dashboard/page.tsx` | Main dashboard with script list |
| `app/videos/[id]/page.tsx` | Video preview and posting |
| `lib/supabase.ts` | Database types and client |
| `components/ui/toast.tsx` | Toast notification system |
| `supabase/schema.sql` | Database schema |
| `tasks/todo.md` | Implementation tracking |

## Development Guidelines

1. **Simplicity First** - Make minimal changes that impact as little code as possible
2. **Strong Typing** - Avoid `any` types; use strict TypeScript
3. **Zero Warnings** - Console, linter, and compiler must be clean
4. **Plan First** - Write plans in `tasks/todo.md` before implementing
5. **Test Pipeline First** - Don't add features until WF1→WF2→WF3 works end-to-end

## Task Tracking

All implementation plans go in `tasks/todo.md`. Check items off as completed. Add a review section after implementation.

## Commands Reference

- `/compact` - Summarize long conversations
- `/clear` - Start fresh
- `/init` - Regenerate this file
- `/cost` - Check token usage
