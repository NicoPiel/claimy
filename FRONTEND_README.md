# Guild Resource Management Frontend

A React-based single-page application for managing guild resources in a city-building game. Built with Bun, React, TypeScript, TailwindCSS, and Shadcn UI components.

## Features

### For Guild Leaders
- **Dashboard Overview**: Statistics and quick access to all settlements
- **Settlement Management**: Track resources across T1-T10 settlements
- **Resource Categories**: Manage 13 different resource categories (Forestry, Carpentry, Hunting, etc.)
- **Task Assignment**: Assign resource gathering tasks to guild members
- **Progress Tracking**: Monitor completion rates and member performance

### For Guild Members
- **Personal Dashboard**: View assigned tasks and progress
- **Task Updates**: Update progress on assigned resource gathering
- **Settlement View**: See what resources are needed across settlements

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS + Shadcn UI components
- **State Management**: Zustand for client state, React Query for server state
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Build Tool**: Bun
- **Notifications**: Sonner (toast notifications)

## Quick Start

### Prerequisites
- Bun (latest version)
- Node.js 18+ (for compatibility)

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:3000`

### Mock Data Setup
Since the Rust backend is not yet implemented, you can use the API requirements document (`API_REQUIREMENTS.md`) to build the backend, or modify the API client to use mock data for development.

## Project Structure

```
client/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   ├── resources/      # Resource management components
│   └── ui/             # Shadcn UI components
├── stores/             # Zustand stores
├── providers/          # React context providers
├── types/              # TypeScript type definitions
├── api/                # API client and HTTP utilities
└── App.tsx             # Main application component
```

## Key Components

### Authentication
- **LoginForm**: JWT-based authentication
- **ProtectedRoute**: Role-based route protection
- **AuthStore**: Zustand store for auth state management

### Dashboards
- **LeaderDashboard**: Overview with settlement selector and stats
- **MemberDashboard**: Personal task management interface

### Resource Management
- **ResourceGrid**: Interactive grid for managing settlement resources
- **AppLayout**: Main layout with navigation and user controls

## User Roles

### Guild Leader
- Full access to all features
- Can manage settlements and assign tasks
- Can modify resource quantities and requirements
- Access to reports and member management

### Guild Member
- View-only access to most features
- Can update progress on assigned tasks
- Personal dashboard with task tracking

## API Integration

The frontend expects a Rust backend with the following endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/settlements` - List settlements
- `GET /api/settlements/:id/resources` - Get settlement resources
- `GET /api/tasks/my` - Get user's assigned tasks
- `PUT /api/tasks/:id` - Update task progress

See `API_REQUIREMENTS.md` for complete API specification.

## Development

### Available Scripts
```bash
# Start development server with hot reload
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Environment Variables
Create a `.env` file for environment-specific configuration:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Resource Categories

The system tracks 13 resource categories based on the provided spreadsheet:

1. **Forestry**: trunks, logs, resin, bark
2. **Carpentry**: planks, water buckets, refined planks, timber
3. **Hunting**: animals, animal hair, raw meat
4. **Leatherworking**: tannin, leather, refined leather, leather items
5. **Foraging**: roots, clay, gypsite, berries, mushrooms, flowers
6. **Mining**: sand, stone chunk, braxite, ore chunk
7. **Tailoring**: cloth strips, rope, cloth, woven items
8. **Masonry**: bricks, slabs, glass vials, gems, rings
9. **Smithing**: ingots, frames, nails, tools, weapons, armor
10. **Farming**: fertilizer, plants, crops, oils
11. **Fishing**: baitfish, shells, bait, fish, fish oil
12. **Cooking**: salt, prepared foods, teas
13. **Scholar**: research materials, potions, treatments

## Settlement Tiers

The system supports 10 settlement tiers (T1-T10), each with independent resource inventories and requirements.

## Task Workflow

1. **Leader assigns task**: Select settlement, resource, player, and quantity
2. **Member receives assignment**: Task appears in member's dashboard
3. **Member updates progress**: Real-time progress tracking
4. **Task completion**: Automatic status updates when goals are met

## Next Steps

1. **Backend Integration**: Connect to Rust backend using the API specification
2. **Additional Features**: 
   - Bulk import/export for existing spreadsheet data
   - Advanced filtering and search
   - Detailed reporting and analytics
   - Real-time notifications
3. **Mobile Optimization**: Responsive design improvements
4. **Testing**: Unit and integration tests

## Support

For questions or issues with the frontend implementation, refer to the component documentation and API requirements specification.