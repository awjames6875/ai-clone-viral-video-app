# Workflow: Viral News to AI Avatar Videos

## Purpose
Researches trending news in your niche, generates scripts, creates AI avatar videos with HeyGen, and posts to 9 social platforms via Blotato.

## Trigger
- **Schedule Trigger** - Runs daily at 10am

## Node Flow
1. **Schedule Trigger** - Kicks off daily at 10am
2. **AI Research - Top 10** - Perplexity finds top 10 trending news in your industry
3. **AI Research - Report** - Perplexity selects most viral story and compiles detailed report
4. **AI Writer** - GPT-5 writes monologue script, caption, and title (JSON output)
5. **Setup Heygen** - Configuration node with avatar_id, voice_id, API key
6. **If** - Checks if background video is enabled
7. **Create Avatar Video WITH/WITHOUT Background** - HeyGen API v2 video generation
8. **Merge** - Combines both paths
9. **Wait** - 1 minute pause for video processing
10. **Get Avatar Video** - Polls HeyGen for completed video
11. **If Video Done** - Loops back to Wait if not complete
12. **Upload media** - Uploads to Blotato
13. **[Platform] [BLOTATO]** - Posts to TikTok, LinkedIn, Facebook, Instagram, Twitter, YouTube, Threads, Bluesky, Pinterest (parallel)
14. **Error Report** - Collects errors from all platforms

## Key Patterns

### HeyGen Video Generation (Regular Avatar)
```json
{
  "video_inputs": [{
    "character": {
      "type": "avatar",
      "avatar_id": "your-avatar-id",
      "avatar_style": "normal",
      "scale": 1.0,
      "offset": { "x": 0.15, "y": 0.15 },
      "matting": true
    },
    "voice": {
      "type": "text",
      "input_text": "script here",
      "voice_id": "your-voice-id",
      "speed": 1.1,
      "pitch": 50,
      "emotion": "Excited"
    },
    "background": {
      "type": "video",
      "url": "background-video-url",
      "play_style": "loop",
      "fit": "cover"
    }
  }],
  "dimension": { "width": 720, "height": 1280 },
  "aspect_ratio": "9:16"
}
```

### Polling Pattern
- Wait 1 minute initially
- Check status with `GET /v1/video_status.get?video_id=...`
- If not complete, loop back to Wait node

### Error Handling
- Each Blotato node has `onError: "continueErrorOutput"`
- Errors routed to central Error Report merge node

## Credentials Used
- **Perplexity API** - For news research
- **OpenAI API** - For script writing (GPT-5)
- **HeyGen API** - For avatar video generation (requires paid API plan)
- **Blotato API** - For social media posting

## Important Notes
- HeyGen API plan is separate from web plan - both required
- Instant Avatars (photo-based) use `type: "talking_photo"` instead of `type: "avatar"`
- Long scripts take longer to process - increase wait time if needed
- Test with 1 platform first before enabling all 9
