# GitHub Copilot Instructions for HotelHub

## Project Overview
HotelHub is a multi-tenant hotel management platform with integrated gaming and Web3 features. This is a complex monorepo with multiple React frontends, Node.js backend, and an extensive UI asset library.

## Essential Architecture Knowledge

### Monorepo Structure
```
apps/                    # Main applications
├── web/                # React frontend (MUI-based)
├── api/                # Express.js backend 
└── admin/              # Management dashboard

hotel-ui/               # Specialized UI asset library (324+ components)
├── ui-kit/base/        # Core React components (Button.tsx, Card.tsx, Modal.tsx)
├── digital-assets/     # SVG icons organized by category
├── game-pool/          # HTML5 games (slot-machine.html, airdrop-rush.html)
├── web3-components/    # Financial trading components
└── frontend/           # Complete page templates

packages/               # Shared utilities
scripts/                # MCP servers and automation tools
```

### Key Technology Decisions
- **Frontend**: React 18 + Material-UI with custom theme (`#FF9F40` gold, `#1C1C1E` dark gray)
- **Backend**: Express.js with SQLite (dev) / PostgreSQL (prod) 
- **State Management**: Context API with `HotelContext` (not Redux)
- **Deployment**: Docker with external SSD storage (`/Volumes/128/`)
- **MCP Integration**: Extensive Model Context Protocol servers for AI assistance

## Critical Development Patterns

### UI Asset Integration
The project has a unique UI asset discovery system:
```javascript
// Use the UI finder script for component discovery
node scripts/ui-finder.js search "button hotel"
node scripts/ui-finder.js recommend "dashboard"

// Import pattern for UI assets
import { Button } from './hotel-ui/ui-kit/base/Button.tsx';
import HotelIcon from './hotel-ui/digital-assets/icons/hospitality/room-types.svg';
```

### Component Naming Convention
- **React Components**: PascalCase with descriptive names (`HotelCalendar`, `RoomStatusBoard`)
- **Pages**: Descriptive names in `/pages/` (`LandingPageV2.js`, `MCPDashboard.js`)
- **Context Actions**: SCREAMING_SNAKE_CASE (`ADD_BOOKING`, `UPDATE_ROOM_STATUS`)

### State Management Pattern
All state flows through `HotelContext.js` with a reducer pattern:
```javascript
const { dispatch, state } = useHotel();
dispatch({ type: 'ADD_BOOKING', payload: booking });
```

## Development Workflows

### Local Development
```bash
# Start with Docker (recommended)
./scripts/start.sh start

# Or individual services
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 5001
```

### UI Development Workflow
1. Search existing UI assets first: `node scripts/ui-finder.js search "keyword"`
2. Check `UI_ASSETS_INDEX.md` and `UI_INTEGRATION_GUIDE.md` for examples
3. Reuse components from `hotel-ui/` before creating new ones
4. Follow Material-UI theming with project colors

### MCP Integration
The project has extensive MCP (Model Context Protocol) integration:
- **UI Documentation Server**: `scripts/ui-docs-mcp-server.js`
- **Asset Discovery**: `scripts/ui-assets-mcp-server.js`
- **Natural Language Triggers**: `scripts/natural-language-ui-trigger.js`

Use MCP commands for UI assistance:
```bash
node scripts/ui-docs-mcp-server.js search "hotel dashboard"
```

## Project-Specific Conventions

### API Structure
- Routes in `apps/api/src/routes/`
- Middleware pattern with request logging
- SQLite for development, PostgreSQL for production
- Environment variables in `project-config.json`

### React Patterns
- Functional components with hooks (no class components)
- Material-UI `sx` prop for styling
- `useHotel()` hook for global state
- Route protection with authentication context

### File Organization
- **Pages**: Feature-complete routes in `/pages/`
- **Components**: Reusable UI pieces in `/components/`
- **Context**: Global state management in `/context/`
- **Utils**: Helper functions and constants

## Integration Points

### External Dependencies
- **Firebase**: Authentication and real-time features
- **Docker**: Development and production deployment
- **External SSD**: Data storage at `/Volumes/128/` for performance
- **MCP Servers**: AI assistance and automation

### Cross-Component Communication
- Use `HotelContext` for global state (bookings, rooms, customers)
- Emit custom events for component coordination
- Material-UI Snackbar for global notifications

## Performance Considerations
- Docker memory limits: 512MB per service
- External SSD storage for database and large assets
- Component lazy loading for large pages
- MUI tree-shaking for bundle size optimization

## Key Files to Reference
- `UI_ASSETS_INDEX.md`: Complete UI component catalog
- `UI_INTEGRATION_GUIDE.md`: Integration examples and patterns
- `project-config.json`: Environment and path configurations
- `src/context/HotelContext.js`: Global state management
- `scripts/ui-finder.js`: Component discovery tool

When working on features, always check the UI asset library first and leverage the MCP tools for intelligent suggestions.