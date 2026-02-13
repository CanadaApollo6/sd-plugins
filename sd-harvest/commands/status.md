---
description: Show what's been logged in Harvest this week
allowed-tools:
  [
    "mcp__plugin_sd-harvest_harvest__get_me",
    "mcp__plugin_sd-harvest_harvest__list_projects",
    "mcp__plugin_sd-harvest_harvest__get_entries",
    "Bash",
  ]
---

# Harvest Status

Show the current week's time entries from Harvest and flag any gaps.

## Instructions

1. Call the `get_me` MCP tool to get the current user's name
2. Calculate the current week's Monday and Friday dates in YYYY-MM-DD format
3. Call the `get_entries` MCP tool with `from` (Monday) and `to` (Friday)
4. Process the entries:
   - Group by date (Monday through Friday)
   - Within each day, list entries by project
   - Sum hours per day
   - Calculate billable vs non-billable per day
   - Flag days with <8 hours or 0 hours

## Output Format

```text
Harvest Status for [User Name]
Week of [Monday Date] - [Friday Date]

Monday, [Date]:
  [Project Name] / [Task Name]: [hours]h - "[notes]" [billable/non-billable]
  ...
  Day total: [X]h ([Y]h billable) [FLAG]

Tuesday, [Date]:
  ...

[Continue for Mon-Fri]

---
Week total: [XX]h ([YY]h billable, [ZZ]h non-billable)
Missing days: [List dates with 0 hours, or "None"]
Short days (<8h): [List dates, or "None"]
```

## Flags

- `⚠️ SHORT` — Day has entries but total is under 8 hours
- `❌ MISSING` — Weekday has no entries at all
- `✓` — Day has 8+ hours

## Notes

- Only show Monday through Friday
- If mid-week, future days should show as "—" (not flagged)
- Sort entries within each day by project name
