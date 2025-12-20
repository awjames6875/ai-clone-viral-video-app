# Workflow Context Files

This folder stores n8n workflow examples and documentation for reference when building or debugging workflows.

## Folder Structure

```
docs/workflows/
├── README.md           # This file
├── examples/           # Working example workflows
│   └── *.md           # Annotated workflow documentation
└── to-implement/       # New workflows to build
    └── *.json         # Raw workflow JSON files
```

## How to Use

### Adding Example Workflows
1. Export the workflow JSON from n8n
2. Create a `.md` file in `examples/` using the template below
3. Document key patterns worth reusing

### Adding Workflows to Implement
1. Drop the raw `.json` file in `to-implement/`
2. Ask Claude to analyze it against existing examples
3. Get implementation guidance based on patterns

## Annotation Template

```markdown
# Workflow: [Name]

## Purpose
[One sentence describing what this workflow does]

## Trigger
[How the workflow starts - schedule, webhook, manual]

## Node Flow
1. **[Node Name]** - [What it does]
2. **[Node Name]** - [What it does]
...

## Key Patterns
- [Pattern 1 worth noting]
- [Pattern 2 worth noting]

## Credentials Used
- [Service 1]
- [Service 2]

## Important Notes
- [Gotchas, limitations, tips]
```

## HeyGen Avatar Types Reference

| Avatar Type | API Config | ID Parameter | Notes |
|-------------|------------|--------------|-------|
| Regular Avatar | `type: "avatar"` | `avatar_id` | Studio-filmed avatars |
| Instant Avatar | `type: "talking_photo"` | `talking_photo_id` | Photo/selfie-based avatars |

### Get Your Avatar IDs

**Regular Avatars:**
```bash
curl -X GET "https://api.heygen.com/v2/avatars" \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Instant Avatars (Talking Photos):**
```bash
curl -X GET "https://api.heygen.com/v1/talking_photo.list" \
  -H "X-Api-Key: YOUR_API_KEY"
```
