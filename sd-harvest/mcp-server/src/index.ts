import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HarvestClient } from "./harvest-client.js";
import { registerListProjects } from "./tools/list-projects.js";
import { registerGetMe } from "./tools/get-me.js";

const accessToken = process.env.HARVEST_ACCESS_TOKEN;
const accountId = process.env.HARVEST_ACCOUNT_ID;

if (!accessToken || !accountId) {
  console.error("Missing required environment variables: HARVEST_ACCESS_TOKEN and HARVEST_ACCOUNT_ID");
  process.exit(1);
}

const server = new McpServer({
  name: "harvest-server",
  version: "0.1.0",
});

const client = new HarvestClient({ accessToken, accountId });

registerListProjects(server, client);
registerGetMe(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
