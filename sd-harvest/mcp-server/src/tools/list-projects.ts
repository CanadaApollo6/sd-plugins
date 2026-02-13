import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HarvestClient } from "../harvest-client.js";
import { HarvestApiError } from "../types.js";

export function registerListProjects(
  server: McpServer,
  client: HarvestClient,
): void {
  server.tool(
    "list_projects",
    "List Harvest projects assigned to the current user with client and task info.",
    {
      is_active: z
        .boolean()
        .optional()
        .describe("Filter by active assignment status (true/false)"),
    },
    async (params) => {
      try {
        const response = await client.getMyProjectAssignments();

        let assignments = response.project_assignments;
        if (params.is_active !== undefined) {
          assignments = assignments.filter(
            (a) => a.is_active === params.is_active,
          );
        }

        const summary = assignments.map((a) => ({
          id: a.project.id,
          name: a.project.name,
          code: a.project.code,
          client: a.client.name,
          billable: a.task_assignments.some((t) => t.billable),
          active: a.is_active,
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
        const message =
          error instanceof HarvestApiError
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
