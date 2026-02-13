import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";
import { HarvestApiError } from "../types.js";

export function registerGetMe(server: McpServer, client: HarvestClient): void {
  server.tool(
    "get_me",
    "Get the current authenticated Harvest user's profile — name, email, timezone, roles.",
    {},
    async () => {
      try {
        const user = await client.getMe();

        const summary = {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          timezone: user.timezone,
          roles: user.roles,
          is_active: user.is_active,
        };

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof HarvestApiError
          ? `Harvest API error (${error.status}): ${error.body}`
          : `Unexpected error: ${error}`;

        return {
          content: [{ type: "text" as const, text: message }],
          isError: true,
        };
      }
    },
  );
}
