import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools';
import { registerResources } from './resources';

const server = new McpServer({
  name: 'tend-garden-guide',
  version: '0.1.0',
});

registerTools(server);
registerResources(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Tend Garden Guide MCP server running on stdio');
}

main().catch(console.error);
