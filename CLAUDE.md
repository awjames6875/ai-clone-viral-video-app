# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **viral video content automation system** built with n8n workflows. The system scrapes TikTok for viral videos, analyzes them with Gemini AI, generates scripts, creates videos with HeyGen, and posts to social platforms via Blotato.

## Architecture

### Workflow Pipeline
```
TikTok Scrape → Gemini Analysis → Script Generation → Supabase Storage → HeyGen Video → Blotato Posting
```

### Key Components

1. **n8n Workflows** (`/n8n/`)
   - `wf1_daily_script_generator.json` - Daily scraping and script generation, stores to Supabase
   - `AI Agent workflow.json` - Full pipeline with Google Sheets (legacy, being replaced with Supabase)

2. **Data Flow**
   - Scripts stored in Supabase `scripts` table
   - Status progression: `Pending Script` → `Script Approved` → `Video Ready (Preview)` → `Posted`
   - Failed state captures errors from video generation or posting

3. **External Services**
   - **TikTok Scraper API** - Fetches viral videos by niche
   - **Google Gemini** - Analyzes videos and generates scripts
   - **HeyGen** - Creates AI avatar videos from scripts
   - **Blotato** - Posts to multiple social platforms
   - **Supabase** - Database and auth

### Environment Variables
```
TIKTOK_NICHE
TIKTOK_SCRAPER_API_URL
HEYGEN_API_KEY
HEYGEN_AVATAR_ID
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## Working with n8n Workflows

- Workflows are JSON files that can be imported directly into n8n
- Node IDs and connection references must remain consistent
- Configuration values use `={{$env.VARIABLE_NAME}}` syntax for environment variables
- Webhook triggers use format: `${N8N_BASE_URL}/webhook/<webhook-name>`

## Script Data Structure

Scripts contain:
- `script_json` - Full script with `spoken_script`, `caption`, `hashtags`, `on_screen_text`, `music_track`, `hook`
- `analysis_json` - Gemini's analysis of the source video
- `source_video_url` - Original TikTok video reference
- `source_hash` - Deduplication identifier
- `status` - Current pipeline stage
- `processed` - Boolean flag for posting state

## Development Guidelines

1. **Simplicity First** - Make minimal changes that impact as little code as possible
2. **Strong Typing** - Avoid `any` types; use strict TypeScript
3. **Zero Warnings** - Console, linter, and compiler must be clean
4. **Plan First** - Write plans in `tasks/todo.md` before implementing

## Task Tracking

All implementation plans go in `tasks/todo.md`. Check items off as completed. Add a review section after implementation.
