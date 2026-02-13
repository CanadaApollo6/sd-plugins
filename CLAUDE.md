# sd-plugins — Smart Data Claude Code Plugin Marketplace

## Repository Structure

This is a monorepo. Each plugin lives in its own directory (`sd-harvest/`, etc.) with its own `CLAUDE.md`, README, and dependencies.

## Engineering Principles

These are enforced across all plugins in this repo:

### SOLID

- **Single Responsibility:** Each module/tool does one thing. API clients handle HTTP only. Entry points handle wiring only.
- **Open/Closed:** New functionality is added by creating new files and registering them — no modification of existing code needed.
- **Liskov Substitution:** Clients follow interface contracts — swappable for mocks in tests.
- **Interface Segregation:** Consumers depend only on the methods they use, not the entire surface.
- **Dependency Inversion:** Dependencies are injected, not imported as singletons.

### DRY

- Shared interfaces live in dedicated type files
- Common logic (auth, error handling, pagination) is centralized per plugin
- No duplicated patterns across tools

### If It Can Be Tested, It Should Be Tested

- Unit tests with mocked external calls
- Integration tests for tool registration and parameter validation
- Test files live alongside source

### Code as Cost
- Every dependency must justify its existence
- No over-abstraction — three similar lines are better than a premature helper
- No speculative features — build what's needed now
- Prefer deleting code over adding compatibility shims
- Minimal surface area: if a function isn't called, it shouldn't exist

## Plugin Conventions

Each plugin follows the same component layout:

| Component | Location | Format |
|-----------|----------|--------|
| Plugin manifest | `.claude-plugin/plugin.json` | JSON with name, version, description, author |
| MCP config | `.mcp.json` | Flat format, stdio server type |
| Commands | `commands/*.md` | YAML frontmatter: description, argument-hint, allowed-tools |
| Skills | `skills/<name>/SKILL.md` | YAML frontmatter: name, description, version |
| Agents | `agents/*.md` | YAML frontmatter: name, description, model |
| Hooks | `hooks/hooks.json` | Wrapper format with description + hooks object |

## Marketplace Registry

`marketplace.json` at the repo root lists all available plugins with metadata for discovery and installation.
