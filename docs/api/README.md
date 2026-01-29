---
layout: default
title: API Reference
nav_order: 5
has_children: true
---

# API Reference

The Tend API is a RESTful service built with NestJS 10. It provides endpoints for managing life areas, practices, reflections, and the Garden Guide AI.

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000/api` |
| Production | `https://api.tend.app/api` |

## Interactive Documentation

Swagger documentation is available at `/api/docs` when the server is running:

```
http://localhost:3000/api/docs
```

---

## Authentication

All endpoints except `/api/health` require authentication via Bearer token.

```http
Authorization: Bearer <token>
```

---

## Response Format

All responses follow a consistent JSON structure:

**Success Response:**
```json
{
  "id": "clxyz...",
  "name": "Health",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "statusCode": 404,
  "message": "Life area with ID \"abc\" not found",
  "error": "Not Found"
}
```

---

## Endpoints Overview

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health status |

### Life Areas

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/life-areas` | List all life areas |
| GET | `/api/life-areas/:id` | Get life area with practices |
| POST | `/api/life-areas` | Create a life area |
| PUT | `/api/life-areas/:id` | Update a life area |
| DELETE | `/api/life-areas/:id` | Delete a life area |

### Practices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/practices` | List all practices |
| GET | `/api/practices/:id` | Get practice with logs |
| POST | `/api/practices` | Create a practice |
| POST | `/api/practices/:id/log` | Log a completion |
| PUT | `/api/practices/:id` | Update a practice |
| DELETE | `/api/practices/:id` | Delete a practice |

### Reflections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reflections` | List all reflections |
| GET | `/api/reflections/:id` | Get a reflection |
| POST | `/api/reflections` | Create a reflection |
| PUT | `/api/reflections/:id` | Update a reflection |
| DELETE | `/api/reflections/:id` | Delete a reflection |

### Garden Guide

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/garden-guide/chat` | Chat with AI guide |
| GET | `/api/garden-guide/insights` | Get AI insights |

---

## Life Areas API

### List All Life Areas

```http
GET /api/life-areas
```

**Response:** `200 OK`
```json
[
  {
    "id": "clxyz123",
    "name": "Health",
    "slug": "health",
    "description": "Physical well-being, exercise, nutrition, sleep",
    "icon": "heart",
    "color": "#c07850",
    "healthScore": 75,
    "userId": "user123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T08:15:00.000Z",
    "practices": [
      {
        "id": "practice123",
        "name": "Morning Run",
        "currentStreak": 5
      }
    ]
  }
]
```

### Get Life Area

```http
GET /api/life-areas/:id
```

**Response:** `200 OK`
```json
{
  "id": "clxyz123",
  "name": "Health",
  "slug": "health",
  "description": "Physical well-being, exercise, nutrition, sleep",
  "icon": "heart",
  "color": "#c07850",
  "healthScore": 75,
  "practices": [...],
  "reflections": [...]
}
```

**Error:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Life area with ID \"abc\" not found",
  "error": "Not Found"
}
```

### Create Life Area

```http
POST /api/life-areas
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Learning",
  "slug": "learning",
  "description": "Continuous education and skill development",
  "icon": "school",
  "color": "#6b9daa",
  "userId": "user123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name |
| `slug` | string | Yes | URL-friendly identifier (lowercase, hyphens) |
| `description` | string | Yes | Brief description |
| `icon` | string | No | Ionicon name (default: "leaf") |
| `color` | string | No | Hex color (default: "#4a7c59") |
| `userId` | string | Yes | Owner user ID |

**Response:** `201 Created`

### Update Life Area

```http
PUT /api/life-areas/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Health & Fitness",
  "healthScore": 80
}
```

All fields are optional.

**Response:** `200 OK`

### Delete Life Area

```http
DELETE /api/life-areas/:id
```

**Response:** `200 OK`

---

## Practices API

### List All Practices

```http
GET /api/practices
```

Returns all practices with their life areas, ordered by life area name then practice name.

### Get Practice

```http
GET /api/practices/:id
```

Returns practice with the 30 most recent log entries.

### Create Practice

```http
POST /api/practices
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Morning Meditation",
  "description": "10 minutes of mindful breathing",
  "category": "meditation",
  "frequency": "daily",
  "durationMinutes": 10,
  "lifeAreaId": "area123",
  "userId": "user123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Practice name |
| `description` | string | Yes | What this practice involves |
| `category` | string | No | habit, ritual, routine, exercise, meditation, learning |
| `frequency` | string | No | daily, weekly, biweekly, monthly |
| `durationMinutes` | number | No | Expected duration in minutes |
| `lifeAreaId` | string | Yes | Parent life area ID |
| `userId` | string | Yes | Owner user ID |

### Log Practice Completion

```http
POST /api/practices/:id/log
Content-Type: application/json
```

**Request Body:**
```json
{
  "durationMinutes": 12,
  "notes": "Felt very focused today",
  "quality": 5
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `durationMinutes` | number | No | Actual duration |
| `notes` | string | No | Session notes |
| `quality` | number | No | Quality rating 1-5 |

### Update Practice

```http
PUT /api/practices/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Morning Meditation (Extended)",
  "durationMinutes": 15,
  "isActive": true
}
```

### Delete Practice

```http
DELETE /api/practices/:id
```

---

## Reflections API

### List Reflections

```http
GET /api/reflections
GET /api/reflections?lifeAreaId=area123
```

| Query Param | Type | Description |
|-------------|------|-------------|
| `lifeAreaId` | string | Filter by life area |

### Get Reflection

```http
GET /api/reflections/:id
```

### Create Reflection

```http
POST /api/reflections
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "gratitude",
  "title": "Morning Gratitude",
  "content": "Today I'm grateful for...",
  "mood": "good",
  "gratitude": ["Good health", "Supportive family", "New opportunities"],
  "insights": ["I feel more energized when I wake up early"],
  "userId": "user123",
  "lifeAreaIds": ["area123", "area456"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | No | freeform, gratitude, weekly-review, monthly-review, goal-setting |
| `title` | string | Yes | Entry title |
| `content` | string | Yes | Main content |
| `mood` | string | No | great, good, okay, low, struggling |
| `gratitude` | string[] | No | List of gratitude items |
| `insights` | string[] | No | Key realizations |
| `userId` | string | Yes | Author user ID |
| `lifeAreaIds` | string[] | No | Related life area IDs |

### Update Reflection

```http
PUT /api/reflections/:id
Content-Type: application/json
```

### Delete Reflection

```http
DELETE /api/reflections/:id
```

---

## Garden Guide API

### Chat with Garden Guide

```http
POST /api/garden-guide/chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How can I improve my health score?",
  "userId": "user123"
}
```

**Response:**
```json
{
  "response": "Based on your recent activity, I notice your exercise practice has a 3-day streak. To improve your health score, consider...",
  "suggestions": [
    "Log your morning run consistently",
    "Add a new practice for nutrition tracking"
  ]
}
```

### Get Insights

```http
GET /api/garden-guide/insights
```

**Response:**
```json
{
  "insights": [
    {
      "type": "streak_milestone",
      "message": "Great job! Your meditation practice reached a 7-day streak.",
      "lifeAreaId": "spirit-area-id"
    },
    {
      "type": "improvement_opportunity",
      "message": "Your Career area hasn't had any practice logs this week.",
      "lifeAreaId": "career-area-id"
    }
  ]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

API requests are rate-limited to:
- 100 requests per minute per user
- 1000 requests per hour per user

When rate limited, you'll receive a `429 Too Many Requests` response.
