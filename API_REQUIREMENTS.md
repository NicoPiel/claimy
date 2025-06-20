# Guild Resource Management System - API Requirements

## Overview
This document specifies the API requirements for the guild resource management system backend. The frontend is built with React, TypeScript, and TailwindCSS, and expects a RESTful API from the Rust backend.

## Authentication

### JWT-based Authentication
- Use JWT tokens for session management
- Include user role in token payload
- Implement role-based access control

### Auth Endpoints

#### POST /api/auth/login
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "leader" | "member"
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

#### POST /api/auth/logout
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "string",
  "username": "string",
  "role": "leader" | "member",
  "created_at": "2025-01-20T10:30:00Z"
}
```

## Data Models

### Settlement
```typescript
interface Settlement {
  id: string;
  name: string;
  tier: number; // 1-10
  created_at: string;
  updated_at: string;
}
```

### Resource Category
```typescript
type ResourceCategory = 
  | "Forestry" | "Carpentry" | "Hunting" | "Leatherworking" 
  | "Foraging" | "Mining" | "Tailoring" | "Masonry" 
  | "Smithing" | "Farming" | "Fishing" | "Cooking" | "Scholar";
```

### Resource
```typescript
interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  description?: string;
}
```

### Resource Inventory
```typescript
interface ResourceInventory {
  id: string;
  settlement_id: string;
  resource_id: string;
  resource_name: string;
  category: ResourceCategory;
  quantity_needed: number;
  quantity_assigned: number;
  quantity_completed: number;
  updated_at: string;
}
```

### Task
```typescript
interface Task {
  id: string;
  settlement_id: string;
  settlement_name: string;
  resource_id: string;
  resource_name: string;
  category: ResourceCategory;
  assigned_to: string; // player username
  quantity_requested: number;
  quantity_completed: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  deadline?: string;
  created_by: string; // guild leader username
  created_at: string;
  updated_at: string;
  notes?: string;
}
```

### User
```typescript
interface User {
  id: string;
  username: string;
  role: "leader" | "member";
  created_at: string;
}
```

## Settlement Endpoints

### GET /api/settlements
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Settlement T1",
    "tier": 1,
    "created_at": "2025-01-20T10:30:00Z",
    "updated_at": "2025-01-20T10:30:00Z"
  }
]
```

### GET /api/settlements/:id
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Settlement T1",
  "tier": 1,
  "created_at": "2025-01-20T10:30:00Z",
  "updated_at": "2025-01-20T10:30:00Z"
}
```

### POST /api/settlements
**Headers:** `Authorization: Bearer <token>`
**Role Required:** `leader`

**Request:**
```json
{
  "name": "Settlement T5",
  "tier": 5
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Settlement T5",
  "tier": 5,
  "created_at": "2025-01-20T10:30:00Z",
  "updated_at": "2025-01-20T10:30:00Z"
}
```

### PUT /api/settlements/:id
**Headers:** `Authorization: Bearer <token>`
**Role Required:** `leader`

**Request:**
```json
{
  "name": "Updated Settlement Name",
  "tier": 6
}
```

**Response (200):** Same as GET

### DELETE /api/settlements/:id
**Headers:** `Authorization: Bearer <token>`
**Role Required:** `leader`

**Response (204):** No content

## Resource Endpoints

### GET /api/settlements/:settlement_id/resources
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (optional): Filter by resource category

**Response (200):**
```json
[
  {
    "id": "uuid",
    "settlement_id": "uuid",
    "resource_id": "uuid",
    "resource_name": "trunks",
    "category": "Forestry",
    "quantity_needed": 533,
    "quantity_assigned": 200,
    "quantity_completed": 120,
    "updated_at": "2025-01-20T10:30:00Z"
  }
]
```

### GET /api/settlements/:settlement_id/resources/:category
**Headers:** `Authorization: Bearer <token>`

**Response (200):** Same format as above, filtered by category

### PUT /api/settlements/:settlement_id/resources/:resource_id
**Headers:** `Authorization: Bearer <token>`
**Role Required:** `leader`

**Request:**
```json
{
  "quantity_needed": 600,
  "quantity_assigned": 250,
  "quantity_completed": 150
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "settlement_id": "uuid",
  "resource_id": "uuid",
  "resource_name": "trunks",
  "category": "Forestry",
  "quantity_needed": 600,
  "quantity_assigned": 250,
  "quantity_completed": 150,
  "updated_at": "2025-01-20T10:30:00Z"
}
```

## Task Endpoints

### GET /api/tasks
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `assigned_to` (optional): Filter by player username
- `settlement_id` (optional): Filter by settlement
- `category` (optional): Filter by resource category
- `status` (optional): Filter by task status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page (default: 50)

**Response (200):**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "settlement_id": "uuid",
      "settlement_name": "Settlement T1",
      "resource_id": "uuid",
      "resource_name": "trunks",
      "category": "Forestry",
      "assigned_to": "player123",
      "quantity_requested": 200,
      "quantity_completed": 120,
      "status": "in_progress",
      "deadline": "2025-01-25T00:00:00Z",
      "created_by": "guild_leader",
      "created_at": "2025-01-20T10:30:00Z",
      "updated_at": "2025-01-22T15:45:00Z",
      "notes": "High priority for building upgrades"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 125,
    "total_pages": 3
  }
}
```

### GET /api/tasks/my
**Headers:** `Authorization: Bearer <token>`

**Response (200):** Same format as GET /api/tasks but filtered to current user's assignments

### POST /api/tasks
**Headers:** `Authorization: Bearer <token>`
**Role Required:** `leader`

**Request:**
```json
{
  "settlement_id": "uuid",
  "resource_id": "uuid",
  "assigned_to": "player123",
  "quantity_requested": 200,
  "deadline": "2025-01-25T00:00:00Z",
  "notes": "High priority task"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "settlement_id": "uuid",
  "settlement_name": "Settlement T1",
  "resource_id": "uuid",
  "resource_name": "trunks",
  "category": "Forestry",
  "assigned_to": "player123",
  "quantity_requested": 200,
  "quantity_completed": 0,
  "status": "pending",
  "deadline": "2025-01-25T00:00:00Z",
  "created_by": "guild_leader",
  "created_at": "2025-01-20T10:30:00Z",
  "updated_at": "2025-01-20T10:30:00Z",
  "notes": "High priority task"
}
```

### PUT /api/tasks/:id
**Headers:** `Authorization: Bearer <token>`

**Request (Member updating progress):**
```json
{
  "quantity_completed": 150,
  "status": "in_progress"
}
```

**Request (Leader updating assignment):**
```json
{
  "assigned_to": "different_player",
  "quantity_requested": 300,
  "deadline": "2025-01-30T00:00:00Z",
  "status": "pending",
  "notes": "Updated requirements"
}
```

**Response (200):** Same format as POST response

### DELETE /api/tasks/:id
**Headers:** `Authorization: Bearer <token>`
**Role Required:** `leader`

**Response (204):** No content

## Player Endpoints

### GET /api/players
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "username": "player123",
    "role": "member",
    "created_at": "2025-01-15T08:00:00Z"
  }
]
```

### GET /api/players/:id
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "username": "player123",
  "role": "member",
  "created_at": "2025-01-15T08:00:00Z"
}
```

### POST /api/players
**Headers:** `Authorization: Bearer <token>`
**Role Required:** `leader`

**Request:**
```json
{
  "username": "new_player",
  "password": "secure_password",
  "role": "member"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "username": "new_player",
  "role": "member",
  "created_at": "2025-01-20T10:30:00Z"
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error

## Database Schema Considerations

### Tables Needed
1. **users** - Store user accounts and roles
2. **settlements** - Store settlement information
3. **resources** - Master list of available resources
4. **resource_inventories** - Track resource quantities per settlement
5. **tasks** - Store task assignments and progress

### Key Relationships
- Users can have many tasks assigned
- Settlements have many resource inventories
- Tasks belong to a settlement and reference a resource
- Resource inventories belong to a settlement and reference a resource

## Initial Data Seed

### Predefined Resources by Category
The system should be seeded with the following resources based on the provided spreadsheet:

**Forestry:** trunks, logs, resin, bark
**Carpentry:** planks, water buckets, refined planks, timber
**Hunting:** animals, animal hair, raw meat
**Leatherworking:** tannin, leather, refined leather, leather sheeting, leather cap, leather shirt, leather gloves, leather belt, leather leggings, leather boots
**Foraging:** roots, clay, gypsite, berries, citric berries, mushrooms, flowers
**Mining:** sand, stone chunk, braxite, ore chunk
**Tailoring:** cloth strip, rope, cloth, refined cloth, cloth tarp, woven cap, woven shirt, woven gloves, woven belt, woven shorts, woven shoes
**Masonry:** bricks, refined bricks, slabs, glass vials, simple gem fragment, gem encrusted ring, ruby ring, diamond ring, emerald ring, sapphire ring
**Smithing:** ingots, refined ingots, frames, nails, tools, weapons, plated helm, plated armor, plated bracers, plated belt, plated legguards, plated boots
**Farming:** fertilizer, water buckets, embergrain plant, straw, embergrain, wispweave plant, wispweave filament, starbulb plant, crop oil, starbulb
**Fishing:** baitfish, crushed shells, bait, lake fish, fish oil, lake fish filet
**Cooking:** salt, fish & bulbs, deluxe fish & bulbs, bulb rolls, deluxe bulb rolls, mushroom stuffed bulbs, deluxe shroom stuff bulbs, meat sandwich, deluxe meat sandwich, chilling tea, hot tea
**Scholar:** stone carvings, parchment, ink, journals, healing potions, wood polish, firesand, leather treatment, metal solvant, wood research, cloth research, stone research, leather research, metal research, codices

### Default Settlements
Create settlements T1 through T10 by default.

## Notes for Implementation

1. **Authentication Middleware:** All protected routes should verify JWT tokens and extract user information
2. **Role Authorization:** Routes marked with "Role Required" should check user.role matches requirement
3. **Input Validation:** Validate all request bodies against expected schemas
4. **Error Handling:** Provide consistent error responses with meaningful messages
5. **Logging:** Log all API requests and responses for debugging
6. **Rate Limiting:** Consider implementing rate limiting for security
7. **CORS:** Configure CORS to allow frontend domain
8. **Database Transactions:** Use transactions for operations that modify multiple tables
9. **Pagination:** Implement cursor-based or offset pagination for large datasets
10. **Caching:** Consider caching frequently accessed data like settlements and resources

## Package Management Note
For the frontend, use `bun add <package-name>` instead of npm/yarn for installing dependencies.