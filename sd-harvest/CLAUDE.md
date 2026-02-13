# sd-harvest — Claude Code Plugin for Harvest Time Tracking

## Project Overview

A Claude Code plugin that integrates with Harvest V2 API for time tracking. Two-command workflow:

- `/harvest:log` — Quick daily brain dump of what you worked on (natural language)
- `/harvest:fill` — Weekly assembly from daily logs + git history, with direct Harvest submission

The only real code is a TypeScript MCP server wrapping the Harvest V2 REST API. Commands, skills, and agents are all markdown — no code, no build step.

**Target:** Smart Data internal use, eventually publishable to an SD plugin marketplace.

## Dev Tooling

- **TypeScript** (ES2022, Node16 modules) for the MCP server in `mcp-server/`
- **@modelcontextprotocol/sdk** + **zod** for MCP tool definitions
- **Native fetch** (Node 18+) for HTTP calls — no axios, no node-fetch
- **No framework** — lightweight, minimal dependencies

## Build Commands

```bash
cd mcp-server && npm install && npm run build    # Compile TypeScript
cd mcp-server && npm test                         # Run tests (once they exist)
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HARVEST_ACCESS_TOKEN` | Yes | Personal Access Token from Harvest |
| `HARVEST_ACCOUNT_ID` | Yes | Harvest account ID (visible when creating token) |

Get these from: Harvest web app > Settings > Developers > Personal Access Tokens

## Plugin Conventions

| Component | Location | Format |
|-----------|----------|--------|
| Plugin manifest | `.claude-plugin/plugin.json` | JSON with name, version, description, author |
| MCP config | `.mcp.json` | Flat format, stdio server type |
| Commands | `commands/*.md` | YAML frontmatter: description, argument-hint, allowed-tools |
| Skills | `skills/<name>/SKILL.md` | YAML frontmatter: name, description, version |
| Agents | `agents/*.md` | YAML frontmatter: name, description, model |
| Hooks | `hooks/hooks.json` | Wrapper format with description + hooks object |

## MCP Tool Naming

Tools are auto-prefixed by Claude Code as: `mcp__plugin_sd-harvest_harvest__<tool_name>`

Commands must reference these full names in their `allowed-tools` frontmatter.

## Local Storage

- Daily logs: `~/.sd-harvest/logs.json`
- Submission receipts: `~/.sd-harvest/submissions/`
- Plugin config (mappings, settings): `config/` directory in plugin root

## Harvest API Reference

- Base URL: `https://api.harvestapp.com/v2`
- Auth: `Authorization: Bearer $TOKEN` + `Harvest-Account-Id: $ID` + `User-Agent` header
- Rate limit: 100 requests per 15 seconds
- Pagination: `per_page` param (max 2000), use `links.next` for cursor-based pagination

## Milestones

1. **Proof of Life** — Plugin scaffold + MCP server with `list_projects` and `get_me`
2. **Log + Map** — `/harvest:map`, `/harvest:log`, git log parser
3. **Fill + Submit** — `/harvest:fill` weekly assembly + `create_entry`
4. **Polish** — Billing bias, edit flow, session end hook, dogfooding
