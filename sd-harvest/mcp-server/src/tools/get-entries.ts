import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HarvestClient } from "../harvest-client.js";
import { HarvestApiError } from "../types.js";

export function registerGetEntries(
  server: McpServer,
  client: HarvestClient,
): void {
  server.tool(
    "get_entries",
    "Get time entries for a date range, optionally filtered by project. Returns date, hours, notes, project, task, and billable status.",
    {
      from: z.string().describe("Start date in YYYY-MM-DD format"),
      to: z.string().describe("End date in YYYY-MM-DD format"),
      project_id: z
        .number()
        .optional()
        .describe("Filter by Harvest project ID"),
    },
    async (params) => {
      try {
        const response = await client.getTimeEntries({
          from: params.from,
          to: params.to,
          project_id: params.project_id,
        });

        const entries = response.time_entries.map((e) => ({
          id: e.id,
          date: e.spent_date,
          hours: e.hours,
          notes: e.notes,
          project: e.project.name,
          project_id: e.project.id,
          task: e.task.name,
          task_id: e.task.id,
          billable: e.billable,
          is_running: e.is_running,
        }));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(entries, null, 2),
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
