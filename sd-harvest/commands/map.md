---
description: Map this git repo to a Harvest project and task for time tracking
argument-hint: "[no arguments — interactive selection]"
allowed-tools: ["mcp__plugin_sd-harvest_harvest__list_projects", "Bash"]
---

# Harvest Project Mapping

Map the current git repository to a Harvest project and task so `/harvest:log` knows where to attribute time.

## Instructions

1. Get the current repo path:

   ```bash
   git rev-parse --show-toplevel 2>/dev/null || pwd
   ```

2. Ensure storage directory exists:

   ```bash
   mkdir -p ~/.sd-harvest
   ```

3. Check for an existing mapping:

   ```bash
   cat ~/.sd-harvest/mappings.json 2>/dev/null || echo "{}"
   ```

   If this repo already has a mapping, show it and ask if the user wants to update it.

4. Call `list_projects` with `is_active: true` to get available projects with their tasks.

5. Display projects and tasks to the user:

   ```text
   Available Harvest Projects:

   1. [Project Name] ([Client Name])
      Tasks:
        a. [Task Name] (ID: XXX) [billable]
        b. [Task Name] (ID: XXX) [non-billable]

   2. [Next Project...]
   ```

6. Ask the user which project and task to use for this repository.

7. Once selected, merge the new mapping into the existing file and write it back:

   ```bash
   cat > ~/.sd-harvest/mappings.json << 'EOF'
   {
     "/full/repo/path": {
       "project_id": 12345,
       "task_id": 67890,
       "project_name": "Project Name",
       "task_name": "Task Name"
     }
   }
   EOF
   ```

   Preserve any existing mappings for other repos.

8. Confirm:

   ```text
   Mapped [repo name] → [Project Name] / [Task Name]

   You can now use /harvest:log to record work in this repository.
   ```

## Storage Format

`~/.sd-harvest/mappings.json`:

```json
{
  "/absolute/path/to/repo": {
    "project_id": 12345,
    "task_id": 67890,
    "project_name": "Project Name",
    "task_name": "Task Name"
  }
}
```

## Notes

- If not in a git repository, use the current working directory as the mapping key
- If the mappings file is corrupted JSON, back it up and start fresh
- One mapping per repo — re-running overwrites the previous mapping for that repo
