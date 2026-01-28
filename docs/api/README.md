# API Reference

The Tend API is a NestJS application with Swagger documentation available at `/api/docs` when running locally.

## Base URL

- Development: `http://localhost:3000/api`

## Endpoints

### Health
- `GET /api/health` - Service health check

### Life Areas
- `GET /api/life-areas` - List all life areas
- `GET /api/life-areas/:id` - Get a specific life area
- `POST /api/life-areas` - Create a life area
- `PATCH /api/life-areas/:id` - Update a life area
- `DELETE /api/life-areas/:id` - Remove a life area

### Practices
- `GET /api/practices` - List all practices
- `GET /api/practices/:id` - Get a specific practice with recent logs
- `POST /api/practices` - Create a practice
- `POST /api/practices/:id/log` - Log a practice completion
- `PATCH /api/practices/:id` - Update a practice
- `DELETE /api/practices/:id` - Remove a practice

### Reflections
- `GET /api/reflections` - List all reflections
- `GET /api/reflections/:id` - Get a specific reflection
- `POST /api/reflections` - Create a reflection
- `PATCH /api/reflections/:id` - Update a reflection
- `DELETE /api/reflections/:id` - Remove a reflection

### Garden Guide
- `POST /api/garden-guide/chat` - Send a message to the AI guide
- `GET /api/garden-guide/insights` - Get AI-generated insights

## Authentication

All endpoints (except health) require a Bearer token. Authentication is handled via the Auth module.
