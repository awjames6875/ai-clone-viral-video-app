# Product Requirements Document (PRD)
## Viral Video Content Automation System

**Version:** 1.0
**Last Updated:** December 18, 2025
**Status:** In Development

---

## 1. Executive Summary

### 1.1 Product Vision
A fully automated viral video content pipeline that discovers trending TikTok content, analyzes successful patterns using AI, generates original scripts, creates AI avatar videos, and distributes them across multiple social platforms—all with minimal human intervention.

### 1.2 Problem Statement
Content creators and businesses face significant challenges:
- **Time-intensive research:** Manually identifying viral trends takes hours daily
- **Creative bottleneck:** Writing engaging scripts consistently is difficult
- **Production costs:** Professional video creation is expensive
- **Multi-platform management:** Posting to multiple platforms is tedious
- **Performance tracking:** Measuring what works across platforms is fragmented

### 1.3 Solution
An end-to-end automation system that:
1. Scrapes viral TikTok videos by niche
2. Uses Gemini AI to analyze why videos went viral
3. Generates original scripts based on proven patterns
4. Creates AI avatar videos via HeyGen
5. Posts to all major platforms through Blotato
6. Tracks performance metrics for continuous improvement

---

## 2. Goals & Success Metrics

### 2.1 Primary Goals
| Goal | Description |
|------|-------------|
| **Automate Discovery** | Eliminate manual trend research |
| **AI-Powered Creation** | Generate 10+ scripts daily without human writing |
| **Rapid Production** | Reduce video production time from hours to minutes |
| **Multi-Platform Reach** | Post to TikTok, Instagram, YouTube Shorts simultaneously |
| **Data-Driven Optimization** | Use performance data to improve content strategy |

### 2.2 Success Metrics (KPIs)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Scripts generated per day | 10+ | Supabase `scripts` count |
| Script-to-video conversion | >80% | Scripts approved / Scripts generated |
| Video creation success rate | >95% | Videos created / Scripts approved |
| Time from script to post | <2 hours | Timestamp comparison |
| Average video views | Track growth | Platform analytics |

---

## 3. User Personas

### 3.1 Primary User: Solo Content Creator
- **Name:** Alex, 28
- **Background:** Full-time content creator with 50K followers
- **Pain Points:** Spends 4+ hours daily on research and scripting
- **Goals:** Scale content output without hiring a team
- **Tech Comfort:** Moderate; can navigate dashboards but not code

### 3.2 Secondary User: Marketing Agency
- **Name:** Digital Spark Agency
- **Background:** 5-person team managing 20+ client accounts
- **Pain Points:** Can't produce enough unique content for all clients
- **Goals:** Automate content ideation and production at scale
- **Tech Comfort:** High; familiar with automation tools

---

## 4. User Stories & Requirements

### 4.1 Core User Stories

#### US-1: Automated Script Generation
> **As a** content creator
> **I want** the system to automatically generate scripts from viral trends
> **So that** I don't have to spend hours researching and writing

**Acceptance Criteria:**
- [ ] System scrapes TikTok daily at scheduled time (default: 9 AM)
- [ ] Filters videos by configured niche
- [ ] Deduplicates using source_hash
- [ ] Generates unique scripts with hooks, captions, and hashtags
- [ ] Scripts appear in dashboard with "Pending Script" status

#### US-2: Script Review & Editing
> **As a** content creator
> **I want** to review and edit AI-generated scripts before production
> **So that** I can ensure quality and add my personal touch

**Acceptance Criteria:**
- [ ] Dashboard shows all pending scripts
- [ ] Script editor allows editing: spoken script, caption, hashtags, music
- [ ] AI analysis is visible for context
- [ ] Character count for spoken script (max 2000)
- [ ] Save changes without approving
- [ ] Approve triggers video generation

#### US-3: Video Generation
> **As a** content creator
> **I want** approved scripts to automatically become videos
> **So that** I don't need video editing skills or software

**Acceptance Criteria:**
- [ ] Approved scripts trigger HeyGen API
- [ ] AI avatar speaks the script
- [ ] Video renders in 9:16 format (vertical)
- [ ] Video URL stored in database
- [ ] Status updates to "Video Ready (Preview)"
- [ ] Errors captured with message

#### US-4: Video Preview & Posting
> **As a** content creator
> **I want** to preview videos and post to multiple platforms with one click
> **So that** I can maximize reach without manual uploading

**Acceptance Criteria:**
- [ ] Video player shows preview (9:16 aspect ratio)
- [ ] Final caption editable before posting
- [ ] One-click post to all configured platforms
- [ ] Status updates to "Posted"
- [ ] Post IDs captured for tracking

#### US-5: Performance Tracking
> **As a** content creator
> **I want** to see how my posted content performs
> **So that** I can understand what works and improve

**Acceptance Criteria:**
- [ ] Source video metrics stored (original views/likes)
- [ ] Posted content metrics tracked
- [ ] Comparison view (source vs our performance)
- [ ] Filterable by date range and platform

#### US-6: Analytics & Insights
> **As a** content creator
> **I want** to see analytics dashboards and performance insights
> **So that** I can make data-driven decisions about my content strategy

**Acceptance Criteria:**
- [ ] Analytics page with summary metrics (total views, avg engagement)
- [ ] Charts showing performance over time
- [ ] Best performing hooks and content patterns identified
- [ ] Source video vs our video comparison view
- [ ] Export reports as CSV/PDF

#### US-7: Settings & Configuration
> **As a** content creator
> **I want** to configure my brand voice, platforms, and preferences
> **So that** the system generates content tailored to my needs

**Acceptance Criteria:**
- [ ] Brand configuration (voice, banned phrases, required CTAs)
- [ ] Platform selection (which platforms to post to)
- [ ] HeyGen avatar selection
- [ ] Notification preferences (email, Slack)
- [ ] API key management

#### US-8: A/B Testing Hooks
> **As a** content creator
> **I want** to generate multiple hook variants and test which performs best
> **So that** I can optimize my content for maximum engagement

**Acceptance Criteria:**
- [ ] Generate 3-5 hook variants from Gemini analysis
- [ ] Store multiple hooks per script
- [ ] Select which hook to use for video
- [ ] Track performance by hook variant
- [ ] Surface winning hook patterns

---

### 4.2 Functional Requirements

#### FR-1: Dashboard
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Display all scripts with status filtering | P0 |
| FR-1.2 | Real-time updates via Supabase subscription | P0 |
| FR-1.3 | Show script counts per status | P1 |
| FR-1.4 | Sort by creation date (newest first) | P0 |
| FR-1.5 | Skeleton loaders during fetch | P2 |
| FR-1.6 | Search/filter by hook or caption text | P1 |
| FR-1.7 | Summary stats cards (total, posted, avg views) | P1 |
| FR-1.8 | Sort options (recent, most performed, failed) | P2 |
| FR-1.9 | Bulk actions (select multiple, batch approve) | P2 |

#### FR-2: Script Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Edit spoken script with character counter | P0 |
| FR-2.2 | Edit caption and hashtags | P0 |
| FR-2.3 | Edit on-screen text and music track | P1 |
| FR-2.4 | View AI analysis (collapsible) | P1 |
| FR-2.5 | Link to source TikTok video | P2 |
| FR-2.6 | Approve script to trigger video creation | P0 |
| FR-2.7 | Multi-hook variants (3-5 options) | P2 |
| FR-2.8 | Platform-specific captions | P2 |
| FR-2.9 | Auto-save drafts | P2 |
| FR-2.10 | Version history / rollback | P3 |

#### FR-3: Video Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Video player with 9:16 aspect ratio | P0 |
| FR-3.2 | Edit caption before posting | P0 |
| FR-3.3 | Copy caption + hashtags to clipboard | P1 |
| FR-3.4 | Post to social platforms via Blotato | P0 |
| FR-3.5 | Display error messages if posting fails | P0 |
| FR-3.6 | Manual metrics entry form | P1 |
| FR-3.7 | Platform selection before posting | P1 |
| FR-3.8 | Video download button (MP4) | P2 |
| FR-3.9 | Post URL links after posting | P1 |
| FR-3.10 | Processing status indicator | P1 |

#### FR-4: Automation (n8n Workflows)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | WF1: Daily TikTok scrape → Gemini → Supabase | P0 |
| FR-4.2 | WF2: Approved script → HeyGen → video URL | P0 |
| FR-4.3 | WF3: Post video → Blotato → update status | P0 |
| FR-4.4 | Error handling with status = "Failed" | P0 |
| FR-4.5 | Webhook security validation | P1 |
| FR-4.6 | Retry logic with exponential backoff | P1 |
| FR-4.7 | Failure notifications (Slack/email) | P1 |
| FR-4.8 | Post scheduling (optimal times) | P2 |
| FR-4.9 | Niche tracking per script | P2 |

#### FR-5: Settings & Configuration
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Brand configuration page | P1 |
| FR-5.2 | Platform integration settings | P1 |
| FR-5.3 | HeyGen avatar selection UI | P2 |
| FR-5.4 | Notification preferences | P2 |
| FR-5.5 | User roles & permissions | P3 |

#### FR-6: Analytics & Reporting
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Analytics dashboard page | P1 |
| FR-6.2 | Performance charts over time | P2 |
| FR-6.3 | Best performing hooks analysis | P2 |
| FR-6.4 | Source vs our video comparison | P2 |
| FR-6.5 | Export reports (CSV/PDF) | P2 |
| FR-6.6 | Content calendar view | P3 |

---

### 4.3 Non-Functional Requirements

#### NFR-1: Performance
| Requirement | Target |
|-------------|--------|
| Dashboard load time | <2 seconds |
| Real-time update latency | <500ms |
| Video player start time | <3 seconds |

#### NFR-2: Security
| Requirement | Implementation |
|-------------|----------------|
| User authentication | Supabase Auth |
| Row-level security | Users see only their data |
| API key protection | Environment variables, .gitignore |
| Webhook validation | Shared secret verification |

#### NFR-3: Reliability
| Requirement | Target |
|-------------|--------|
| System uptime | 99.5% |
| Workflow success rate | >95% |
| Data backup | Supabase automatic backups |

#### NFR-4: Scalability
| Requirement | Target |
|-------------|--------|
| Concurrent users | 100+ |
| Scripts per day | 1000+ |
| Video storage | Unlimited (external hosting) |

---

## 5. System Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                              │
│                         (Next.js + React + Tailwind)                    │
├─────────────┬─────────────────┬──────────────────┬─────────────────────┤
│  Dashboard  │  Script Editor  │  Video Preview   │    Performance      │
│   (list)    │    (edit)       │    (post)        │     (analytics)     │
└──────┬──────┴────────┬────────┴────────┬─────────┴──────────┬──────────┘
       │               │                 │                    │
       └───────────────┴────────┬────────┴────────────────────┘
                                │
                       ┌────────▼────────┐
                       │   API Routes    │
                       │  (Next.js API)  │
                       └────────┬────────┘
                                │
       ┌────────────────────────┼────────────────────────┐
       │                        │                        │
┌──────▼──────┐         ┌───────▼───────┐        ┌──────▼──────┐
│  Supabase   │         │     n8n       │        │  External   │
│  Database   │◄────────│   Workflows   │───────►│  Services   │
│  + Auth     │         │   (3 flows)   │        │             │
└─────────────┘         └───────────────┘        └─────────────┘
                                │                       │
                    ┌───────────┼───────────┐          │
                    │           │           │          │
              ┌─────▼───┐ ┌─────▼───┐ ┌─────▼───┐     │
              │   WF1   │ │   WF2   │ │   WF3   │     │
              │ Scrape  │ │ Create  │ │  Post   │     │
              │ & Gen   │ │ Video   │ │ Video   │     │
              └────┬────┘ └────┬────┘ └────┬────┘     │
                   │           │           │          │
                   │     ┌─────┼─────┐     │          │
                   │     │           │     │          │
              ┌────▼─────▼───┐ ┌─────▼─────▼────┐    │
              │   TikTok     │ │    HeyGen      │────┘
              │   Scraper    │ │    (Video)     │
              └──────────────┘ └────────────────┘
              ┌──────────────┐ ┌────────────────┐
              │   Gemini     │ │    Blotato     │
              │   (AI)       │ │   (Posting)    │
              └──────────────┘ └────────────────┘
```

### 5.2 Data Flow

```
1. DISCOVERY (WF1 - Daily)
   TikTok Scraper → Viral Videos → Gemini Analysis → Script Generation → Supabase

2. PRODUCTION (WF2 - On Approval)
   User Approves → API Call → n8n Webhook → HeyGen → Video URL → Supabase

3. DISTRIBUTION (WF3 - On Post)
   User Posts → API Call → n8n Webhook → Blotato → Platform Post IDs → Supabase

4. TRACKING (Continuous)
   Platform APIs → Metrics Collection → Supabase → Dashboard Analytics
```

### 5.3 Database Schema

```sql
scripts (
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES auth.users
  status          TEXT  -- Pending Script | Script Approved | Video Ready (Preview) | Posted | Failed
  processed       BOOLEAN DEFAULT false

  -- Source
  source_video_url  TEXT
  source_hash       TEXT UNIQUE
  source_metrics    JSONB  -- {views, likes, shares, comments}

  -- AI Generated
  analysis_json     JSONB  -- Gemini analysis
  script_json       JSONB  -- Full script object

  -- Editable
  caption           TEXT
  hashtags          TEXT[]
  music_track       TEXT

  -- Video
  video_url         TEXT
  error_message     TEXT

  -- Performance
  posted_at         TIMESTAMPTZ
  platforms         TEXT[]
  post_ids          JSONB
  our_metrics       JSONB  -- {views, likes, shares, comments}

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW()
  updated_at        TIMESTAMPTZ
)
```

---

## 6. Tech Stack

### 6.1 Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI components |
| TypeScript 5 | Type safety |
| Tailwind CSS 3 | Styling (n8n-inspired dark theme) |
| Framer Motion | Animations |
| Lucide Icons | Icon library |

### 6.2 Backend
| Technology | Purpose |
|------------|---------|
| Supabase | PostgreSQL database + Auth |
| Next.js API Routes | REST endpoints |
| n8n | Workflow automation |

### 6.3 External Services
| Service | Purpose |
|---------|---------|
| TikTok Scraper API | Fetch viral videos |
| Google Gemini | AI analysis & script generation |
| HeyGen | AI avatar video creation |
| Blotato | Multi-platform posting |

---

## 7. Implementation Roadmap

### Phase 1: Core Infrastructure (Complete)
- [x] Next.js project setup
- [x] Supabase database schema
- [x] UI component library (shadcn-inspired)
- [x] Dark theme styling
- [x] Basic routing

### Phase 2: Core Features (Complete)
- [x] Dashboard with status filtering
- [x] Script editor page
- [x] Video preview page
- [x] API routes for approve/post
- [x] Real-time Supabase updates

### Phase 3: Automation Workflows (Complete)
- [x] WF1: Daily script generation
- [x] WF2: Video creation on approval
- [x] WF3: Video posting

### Phase 4: Performance Tracking (Complete)
- [x] Source metrics capture
- [x] Posted metrics tracking
- [x] Database columns for analytics

### Phase 5: Polish & Security (In Progress)
- [ ] User authentication (login/signup)
- [ ] Protected route middleware
- [ ] Webhook secret validation
- [ ] Error boundaries
- [ ] Toast notifications

### Phase 6: Dashboard Enhancements (Planned)
- [ ] Summary stats cards
- [ ] Search/filter by hook or caption
- [ ] Sort options (recent, performance, failed)
- [ ] Bulk actions

### Phase 7: Analytics & Settings (Planned)
- [ ] Analytics dashboard with charts
- [ ] Settings/configuration page
- [ ] Manual metrics entry form
- [ ] Platform selection before posting
- [ ] Post URL links after posting

### Phase 8: Advanced Features (Future)
- [ ] A/B testing for hooks (multi-hook variants)
- [ ] Platform-specific captions
- [ ] Post scheduling system
- [ ] Retry logic with notifications
- [ ] Version history / rollback
- [ ] Team collaboration & roles
- [ ] Custom avatar selection
- [ ] Content calendar view
- [ ] ML-based performance predictions

---

## 8. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| TikTok API changes | High | Medium | Use scraper with fallback options |
| HeyGen rate limits | Medium | Medium | Queue system, retry logic |
| Blotato platform bans | High | Low | Comply with platform ToS, rate limiting |
| AI-generated content quality | Medium | Medium | Human review step before posting |
| Database performance at scale | Medium | Low | Indexing, connection pooling |

---

## 9. Success Criteria

### 9.1 Launch Readiness
- [ ] All P0 requirements implemented
- [ ] 95%+ workflow success rate
- [ ] <2 second dashboard load time
- [ ] User authentication working
- [ ] Zero critical bugs

### 9.2 Post-Launch (30 Days)
- [ ] 10+ scripts generated daily
- [ ] 80%+ approval rate
- [ ] 5+ videos posted per day
- [ ] User feedback collected

### 9.3 Growth Phase (90 Days)
- [ ] Multi-user support
- [ ] Analytics dashboard live
- [ ] 3+ niches configured
- [ ] Performance benchmarks established

---

## 10. Appendix

### A. Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# n8n
N8N_BASE_URL=
N8N_WEBHOOK_SECRET=

# Services (in n8n)
TIKTOK_NICHE=
TIKTOK_SCRAPER_API_URL=
HEYGEN_API_KEY=
HEYGEN_AVATAR_ID=
```

### B. Status State Machine
```
[New Script] ─────► Pending Script
                         │
                         ▼
               Script Approved ────► Failed
                         │             │
                         ▼             │
              Video Ready (Preview) ◄──┘
                         │
                         ▼
                      Posted
```

### C. API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scripts` | List scripts (optional status filter) |
| GET | `/api/scripts/[id]` | Get single script |
| PATCH | `/api/scripts/[id]` | Update script |
| POST | `/api/scripts/approve` | Approve script (triggers WF2) |
| POST | `/api/videos/post` | Post video (triggers WF3) |

---

## 11. Future Features & Enhancements

### Tier 1: Quick Wins (High Value, Low Effort)
| Feature | Description | Effort |
|---------|-------------|--------|
| Dashboard stats cards | Summary metrics at top (total, posted, avg views) | 30 min |
| Search/filter | Find scripts by hook or caption text | 1 hour |
| Manual metrics form | Input our video's performance after posting | 1 hour |
| Toast notifications | Replace page reloads with toast feedback | 1 hour |
| Video download button | Download final MP4 | 30 min |

### Tier 2: Core Enhancements (High Value, Medium Effort)
| Feature | Description | Effort |
|---------|-------------|--------|
| Analytics dashboard | Charts, performance over time, best hooks | 4 hours |
| Settings page | Brand voice, platforms, notifications config | 3 hours |
| Multi-hook variants | Generate 3-5 hooks, select which to use | 3 hours |
| Platform-specific captions | Different captions for TikTok/IG/YouTube | 2 hours |
| Post URL links | Show links to actual posts after posting | 1 hour |

### Tier 3: Automation & Reliability (Medium Effort)
| Feature | Description | Effort |
|---------|-------------|--------|
| Retry logic | Exponential backoff on workflow failures | 2 hours |
| Failure notifications | Slack/email alerts on Failed status | 2 hours |
| Post scheduling | Schedule posts for optimal times | 3 hours |
| Processing indicator | Real-time progress during video generation | 2 hours |
| Niche tracking | Store which niche each script came from | 1 hour |

### Tier 4: Advanced Features (Future)
| Feature | Description |
|---------|-------------|
| Version history | Track script edits, enable rollback |
| ML predictions | Estimate script performance before posting |
| Team collaboration | User roles, permissions, shared workspaces |
| PWA support | Offline capability, mobile app experience |
| Content calendar | Visual calendar of scheduled/posted content |
| A/B testing | Compare hook variants across posts |

---

**Document Owner:** Product Team
**Reviewers:** Engineering, Design
**Approval Status:** Draft
