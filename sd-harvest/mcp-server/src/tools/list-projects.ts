import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HarvestClient } from "../harvest-client.js";
import { HarvestApiError } from "../types.js";

export function registerListProjects(server: McpServer, client: HarvestClient): void {
  server.tool(
    "list_projects",
    "List all Harvest projects with client info. Optionally filter by active status or client ID.",
    {
      is_active: z.boolean().optional().describe("Filter by active status (true/false)"),
      client_id: z.number().optional().describe("Filter by client ID"),
    },
    async (params) => {
      try {
        const response = await client.listProjects({
          is_active: params.is_active,
          client_id: params.client_id,
        });

        const summary = response.projects.map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          client: p.client.name,
          billable: p.is_billable,
          active: p.is_active,
        }));

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
