---
description: Show what's been logged in Harvest this week
allowed-tools:
  [
    "mcp__plugin_sd-harvest_harvest__get_me",
    "mcp__plugin_sd-harvest_harvest__list_projects",
    "Bash",
  ]
---

# Harvest Status

Show the current week's time entries from Harvest and flag any gaps.

## Instructions

1. Call the `get_me` MCP tool to get the current user's name and ID
2. Call the `list_projects` MCP tool with `is_active: true` to get the active project list
3. Calculate the current week's Monday and Friday dates
4. Present what you know:

### Output Format

```text
Harvest Status for [User Name]
Week of [Monday] - [Friday]

Active Projects:
  [Project Name] ([Client]) - [billable/non-billable]
  ...

Note: Time entry querying will be available in the next milestone.
Use Harvest web UI to check current entries.
```

### Future Enhancement (Milestone 2)

Once `get_entries` is available, this command will also show:

- Daily time entry breakdown with hours and descriptions
- Daily totals with flags for missing or short days
- Week total and billable vs non-billable breakdown
