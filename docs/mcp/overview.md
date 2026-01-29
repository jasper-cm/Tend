---
layout: default
title: MCP Server
nav_order: 8
---

# MCP Server (Garden Guide AI)

The Tend MCP Server provides AI integration through the Model Context Protocol, enabling the "Garden Guide" - a personalized AI coach that helps users tend their life garden.

---

## What is MCP?

The **Model Context Protocol (MCP)** is an open standard for connecting AI models to external data and tools. Tend's MCP server exposes:

- **Tools**: Functions the AI can call to query and act on user data
- **Resources**: Data snapshots the AI can read for context

This allows any MCP-compatible AI model to serve as the Garden Guide.

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | 5.x | Type-safe implementation |
| @modelcontextprotocol/sdk | latest | MCP server framework |
| Zod | 3.x | Schema validation |
| Node.js | 20.x | Runtime environment |

---

## Project Structure

```
apps/mcp-server/
├── src/
│   ├── index.ts              # Server entry point
│   ├── tools/
│   │   └── index.ts          # Tool registrations
│   └── resources/
│       └── index.ts          # Resource registrations
├── tsconfig.json             # TypeScript config
└── project.json              # Nx project config
```

---

## Server Architecture

### Entry Point

```typescript
// src/index.ts
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
```

---

## Tools

Tools are functions the AI can invoke to query or modify user data.

### get-life-areas

Retrieve all life areas with their current health scores.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | - | - | No parameters required |

**Returns:** Array of life areas with id, name, slug, healthScore, and practices count.

```typescript
server.tool(
  'get-life-areas',
  'Retrieve all life areas with their current health scores',
  {},
  async () => {
    const lifeAreas = await prisma.lifeArea.findMany({
      include: { _count: { select: { practices: true } } },
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(lifeAreas) }],
    };
  }
);
```

### get-practices

Retrieve practices for a specific life area with recent logs.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lifeAreaId | string | No | Filter by life area ID |

**Returns:** Array of practices with streaks and recent completion history.

```typescript
server.tool(
  'get-practices',
  'Retrieve practices for a specific life area, with recent logs',
  { lifeAreaId: z.string().optional().describe('Filter by life area ID') },
  async ({ lifeAreaId }) => {
    const practices = await prisma.practice.findMany({
      where: lifeAreaId ? { lifeAreaId } : undefined,
      include: {
        logs: { take: 10, orderBy: { completedAt: 'desc' } },
        lifeArea: true,
      },
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(practices) }],
    };
  }
);
```

### get-reflections

Retrieve journal reflections with optional filters.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lifeAreaId | string | No | Filter by linked life area |
| fromDate | string | No | Start date (ISO 8601) |
| toDate | string | No | End date (ISO 8601) |

**Returns:** Array of reflections with mood, gratitude items, and insights.

### suggest-practice

Generate a practice suggestion based on user goals and life area health.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lifeAreaId | string | Yes | Target life area for suggestion |
| goal | string | No | Specific goal to work toward |

**Returns:** Suggested practice with name, description, frequency, and rationale.

---

## Resources

Resources are data snapshots the AI can read for broader context.

### life-garden-overview

**URI:** `tend://garden/overview`

A holistic view of all life areas with health scores and recent activity.

```json
{
  "lifeAreas": [
    {
      "id": "clx...",
      "name": "Health",
      "healthScore": 75,
      "trend": "improving",
      "activePractices": 3,
      "lastReflection": "2024-01-15T10:30:00Z"
    }
  ],
  "overallHealth": 68,
  "streaksActive": 5,
  "reflectionsThisWeek": 3
}
```

### practice-streaks

**URI:** `tend://practices/streaks`

Current practice streaks and consistency metrics across all life areas.

```json
{
  "streaks": [
    {
      "practiceId": "clx...",
      "practiceName": "Morning Meditation",
      "lifeArea": "Mind",
      "currentStreak": 12,
      "longestStreak": 30,
      "lastCompleted": "2024-01-15T07:00:00Z"
    }
  ],
  "totalActiveStreaks": 5,
  "averageStreakLength": 8.5
}
```

### weekly-reflection-summary

**URI:** `tend://reflections/weekly`

Summary of reflections from the past week across all life areas.

```json
{
  "reflections": [
    {
      "id": "clx...",
      "title": "Weekly Review",
      "mood": "good",
      "gratitude": ["Family time", "New project launch"],
      "insights": ["Need more focus on exercise"]
    }
  ],
  "moodTrend": ["good", "okay", "good", "great"],
  "topLifeAreas": ["Career", "Relationships"],
  "commonThemes": ["gratitude", "growth", "balance"]
}
```

---

## Integration

### With Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "tend-garden-guide": {
      "command": "node",
      "args": ["/path/to/tend/dist/apps/mcp-server/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/tend"
      }
    }
  }
}
```

### With Other MCP Clients

The server uses stdio transport, making it compatible with any MCP client:

```bash
# Run the server
node dist/apps/mcp-server/index.js

# The server communicates via stdin/stdout using JSON-RPC
```

---

## Garden Guide Capabilities

When connected to an MCP-compatible AI, the Garden Guide can:

### Provide Context-Aware Coaching

- Review health scores across life areas
- Identify struggling areas needing attention
- Recognize patterns in practice completion

### Offer Personalized Suggestions

- Recommend new practices based on goals
- Suggest reflection prompts
- Provide encouragement based on streaks

### Support Self-Reflection

- Summarize weekly progress
- Highlight mood patterns
- Connect insights across reflections

### Example Interactions

**User:** "How am I doing this week?"

**Garden Guide:** *Uses get-life-areas and weekly-reflection-summary*

> "Looking at your garden this week, your **Career** and **Mind** areas are flourishing (both at 85%). Your **Health** area could use some attention - it's dropped to 45%. I notice you haven't logged your morning run in 5 days. Would you like to discuss what's getting in the way, or would a simpler practice work better right now?"

**User:** "I want to be more creative"

**Garden Guide:** *Uses get-practices and suggest-practice*

> "Your **Creativity** area has room to grow (current health: 55%). You have one practice - 'Weekly sketching' - but it shows a broken streak. Here are some suggestions that might fit your lifestyle better:
>
> 1. **Morning Pages** - 10 min daily freewriting
> 2. **Photo Walk** - Weekly creative observation
> 3. **Micro-creativity** - 5 min daily doodle or poem
>
> Which resonates with you?"

---

## Development

### Building

```bash
npx nx run mcp-server:build
```

### Running Locally

```bash
# Build first
npx nx run mcp-server:build

# Run with environment
DATABASE_URL="postgresql://..." node dist/apps/mcp-server/index.js
```

### Testing Tools

Use the MCP Inspector for development:

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Connect to your server
mcp-inspector node dist/apps/mcp-server/index.js
```

---

## Future Enhancements

### Planned Tools

- `log-practice` - Record practice completion from chat
- `create-reflection` - Start a reflection from conversation
- `set-goal` - Create a new goal for a life area

### Planned Resources

- `monthly-progress` - Month-over-month health score trends
- `practice-recommendations` - AI-curated practice suggestions
- `garden-insights` - Cross-area pattern analysis

### Authentication

Future versions will support:
- User-specific data access
- OAuth integration
- Multi-tenant deployments
