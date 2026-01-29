import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerTools(server: McpServer) {
  server.tool(
    'get-life-areas',
    'Retrieve all life areas with their current health scores',
    {},
    async () => {
      // TODO: Connect to Tend database
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ message: 'Life areas query not yet connected to database' }),
          },
        ],
      };
    }
  );

  server.tool(
    'get-practices',
    'Retrieve practices for a specific life area, with recent logs',
    { lifeAreaId: z.string().optional().describe('Filter by life area ID') },
    async ({ lifeAreaId }) => {
      // TODO: Connect to Tend database
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: 'Practices query not yet connected to database',
              filter: lifeAreaId,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    'get-reflections',
    'Retrieve journal reflections, optionally filtered by life area or date range',
    {
      lifeAreaId: z.string().optional().describe('Filter by life area ID'),
      fromDate: z.string().optional().describe('Start date (ISO 8601)'),
      toDate: z.string().optional().describe('End date (ISO 8601)'),
    },
    async ({ lifeAreaId, fromDate, toDate }) => {
      // TODO: Connect to Tend database
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: 'Reflections query not yet connected to database',
              filters: { lifeAreaId, fromDate, toDate },
            }),
          },
        ],
      };
    }
  );

  server.tool(
    'suggest-practice',
    'Suggest a new practice based on user goals and current life area health',
    {
      lifeAreaId: z.string().describe('The life area to suggest a practice for'),
      goal: z.string().optional().describe('Specific goal to work toward'),
    },
    async ({ lifeAreaId, goal }) => {
      // TODO: Implement AI-powered practice suggestions
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: 'Practice suggestion not yet implemented',
              lifeAreaId,
              goal,
            }),
          },
        ],
      };
    }
  );
}
