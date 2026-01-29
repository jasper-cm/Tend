import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources(server: McpServer) {
  server.resource(
    'life-garden-overview',
    'tend://garden/overview',
    { description: 'A holistic view of all life areas with health scores and recent activity' },
    async () => {
      // TODO: Connect to Tend database and aggregate data
      return {
        contents: [
          {
            uri: 'tend://garden/overview',
            mimeType: 'application/json',
            text: JSON.stringify({
              message: 'Garden overview not yet connected to database',
              lifeAreas: [],
            }),
          },
        ],
      };
    }
  );

  server.resource(
    'practice-streaks',
    'tend://practices/streaks',
    { description: 'Current practice streaks and consistency metrics' },
    async () => {
      // TODO: Calculate streaks from practice logs
      return {
        contents: [
          {
            uri: 'tend://practices/streaks',
            mimeType: 'application/json',
            text: JSON.stringify({
              message: 'Practice streaks not yet connected to database',
              streaks: [],
            }),
          },
        ],
      };
    }
  );

  server.resource(
    'weekly-reflection-summary',
    'tend://reflections/weekly',
    { description: 'Summary of reflections from the past week across all life areas' },
    async () => {
      // TODO: Aggregate recent reflections
      return {
        contents: [
          {
            uri: 'tend://reflections/weekly',
            mimeType: 'application/json',
            text: JSON.stringify({
              message: 'Weekly reflection summary not yet connected to database',
              reflections: [],
            }),
          },
        ],
      };
    }
  );
}
