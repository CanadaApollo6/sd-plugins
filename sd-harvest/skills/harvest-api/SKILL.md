---
name: harvest-api
description: This skill should be used when the user asks about Harvest API, time entries, Harvest projects, Harvest tasks, mentions creating or querying Harvest data, or needs to understand the available MCP tools for time tracking operations.
---

# Harvest V2 API Knowledge

## Available MCP Tools

| Tool            | Purpose                                                                         |
| --------------- | ------------------------------------------------------------------------------- |
| `list_projects` | List Harvest projects with client info. Filter by active status or client.      |
| `get_me`        | Get current authenticated user's profile (name, email, timezone, roles).        |
| `get_entries`   | Query time entries by date range, project, or user. _(Milestone 2)_             |
| `create_entry`  | Create a new time entry with project, task, date, hours, notes. _(Milestone 3)_ |

## API Concepts

### Projects and Tasks

- Projects belong to Clients (e.g., "Ferguson Portal" belongs to "Ferguson Enterprises")
- Each project has one or more Tasks (e.g., "Development", "Meetings", "Project Management")
- Time entries require both a `project_id` and a `task_id`
- Projects can be billable or non-billable

### Time Entries

- `spent_date` uses YYYY-MM-DD format
- `hours` is decimal (1.5 = 1 hour 30 minutes)
- `notes` is the description field visible on invoices
- Entries inherit billable status from their project/task

### Authentication

- Uses Personal Access Token (not OAuth)
- Requires both `HARVEST_ACCESS_TOKEN` and `HARVEST_ACCOUNT_ID` environment variables
- Token obtained from: Harvest web app > Settings > Developers > Personal Access Tokens

### Rate Limits

- 100 requests per 15 seconds
- 429 response includes `Retry-After` header

## Common Patterns

### Querying a week of entries

Use `get_entries` with `from` (Monday YYYY-MM-DD) and `to` (Friday YYYY-MM-DD).

### Creating entries for a full day

A standard workday is 8 hours. Multiple entries for a day should sum to 8.0.

### Finding the right project/task IDs

Use `list_projects` to get project IDs and names. Task IDs come from the project's task assignments in Harvest.
