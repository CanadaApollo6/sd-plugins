# sd-harvest

Claude Code plugin for Harvest time tracking. Log daily work with natural language, assemble weekly timesheets from your logs and git history, and submit directly to Harvest.

## Prerequisites

- [Claude Code](https://docs.claude.com/en/docs/claude-code) installed
- [Node.js](https://nodejs.org/) 18+ (for the MCP server)
- A [Harvest](https://www.getharvest.com/) account with API access

## Setup

### 1. Get a Harvest API Token

1. Log in to the [Harvest web app](https://id.getharvest.com/)
2. Go to **Developers** (bottom of the left sidebar, or visit <https://id.getharvest.com/developers>)
3. Click **Create New Personal Access Token**
4. Name it `sd-harvest-plugin`
5. Copy both the **token** and your **Account ID** (shown on the same page)

### 2. Set Environment Variables

**Windows (permanent):**

```cmd
setx HARVEST_ACCESS_TOKEN "your-token-here"
setx HARVEST_ACCOUNT_ID "your-account-id-here"
```

**macOS/Linux (add to ~/.bashrc or ~/.zshrc):**

```bash
export HARVEST_ACCESS_TOKEN="your-token-here"
export HARVEST_ACCOUNT_ID="your-account-id-here"
```

Restart your terminal after setting these.

### 3. Build the MCP Server

```bash
cd sd-harvest/mcp-server
npm install
npm run build
```

### 4. Install the Plugin

```bash
claude /plugin install /path/to/sd-plugins/sd-harvest
```

### 5. Verify

```text
/harvest:status
```

You should see your Harvest user info and active project list.

## Commands

| Command            | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `/harvest:status`  | Show active projects and current week's entries              |
| `/harvest:log`     | Quick daily brain dump of what you worked on *(Milestone 2)* |
| `/harvest:map`     | Map git repos to Harvest projects *(Milestone 2)*            |
| `/harvest:fill`    | Assemble and submit weekly timesheet *(Milestone 3)*         |

## Project Structure

```text
.claude-plugin/plugin.json    Plugin manifest
.mcp.json                     MCP server configuration
mcp-server/                   TypeScript MCP server (Harvest V2 API)
commands/                     Slash commands (markdown)
skills/                       Skills (markdown)
config/                       Mappings and settings
```
