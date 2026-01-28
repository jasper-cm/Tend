# Garden Guide

The Garden Guide is Tend's AI-powered personal development assistant. It uses the Model Context Protocol (MCP) to access your life data and provide personalized guidance.

## How It Works

The Garden Guide runs as an MCP server that exposes:

### Tools
- `get-life-areas` - Retrieve life areas with health scores
- `get-practices` - Query practices and recent completion logs
- `get-reflections` - Search journal entries by area, date, or content
- `suggest-practice` - Generate practice suggestions based on goals

### Resources
- `tend://garden/overview` - Holistic garden snapshot
- `tend://practices/streaks` - Current streak data
- `tend://reflections/weekly` - Weekly reflection summary

## Integration

The MCP server connects to the same PostgreSQL database as the API. Any MCP-compatible AI client can connect to the Garden Guide for a rich, context-aware coaching experience.

## Future Capabilities

- Pattern recognition across life areas
- Personalized practice recommendations
- Weekly/monthly progress reports
- Goal setting and milestone tracking
- Correlation analysis (e.g., exercise impact on mood)
