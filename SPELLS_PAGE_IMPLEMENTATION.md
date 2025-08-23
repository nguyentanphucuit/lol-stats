# Spells Page Implementation

## Overview
A new "Spells" page has been created following the same architecture as the existing Champions, Items, and Runes pages. The page displays summoner spells from the League of Legends DDragon API with search, filtering, and pagination capabilities.

## Features
- **Search**: Search spells by name, description, or key
- **Filtering**: Filter by game modes (ARAM, CLASSIC, URF, etc.)
- **Pagination**: Smart pagination with configurable items per page
- **Responsive Design**: Mobile-friendly table layout
- **Image Loading**: Optimized image loading with fallback handling
- **URL State Management**: Search, filters, and pagination state managed in URL parameters

## Data Source
- **API Endpoint**: `https://ddragon.leagueoflegends.com/cdn/15.16.1/data/en_US/summoner.json`
- **Image Base**: `https://ddragon.leagueoflegends.com/cdn/15.16.1/img/spell/`
- **Data Structure**: Transforms DDragon's nested object format to flat array structure

## Architecture

### 1. Types (`types/index.ts`)
```typescript
export interface Spell {
  id: string
  key: string
  name: string
  description: string
  tooltip: string
  maxrank: number
  cooldown: number[]
  cooldownBurn: string
  cost: number[]
  costBurn: string
  range: number[]
  rangeBurn: string
  image: { full: string; sprite: string; group: string; x: number; y: number; w: number; h: number }
  modes: string[]
  summonerLevel: number
  costType: string
  resource: string
  createdAt: Date
  updatedAt: Date
}
```

### 2. Configuration (`lib/league-config.ts`)
```typescript
// Summoner spells data endpoint
get SUMMONER_SPELLS_DATA_URL() {
  return `${this.DDRAGON_BASE_URL}/${this.PATCH}/data/en_US/summoner.json`
},

// Summoner spells image endpoint
get SUMMONER_SPELLS_IMAGE_URL() {
  return `${this.DDRAGON_BASE_URL}/${this.PATCH}/img/spell`
}
```

### 3. Service Layer (`lib/spells-service.ts`)
- `getSpellImageUrl()`: Constructs full image URLs
- `getSpells()`: Fetches paginated spell data with search/filtering
- `getSpellModes()`: Fetches available game modes

### 4. API Routes
- `/api/spells`: Main data endpoint with search, filtering, and pagination
- `/api/spells/modes`: Returns unique game modes
- `/api/spells/image/[spell]`: Proxies spell images from DDragon CDN

### 5. Custom Hook (`hooks/useSpells.ts`)
- Uses TanStack Query for data fetching and caching
- Manages spells data and modes separately
- Configurable cache times

### 6. UI Components
- `SpellsHeader`: Page title and description
- `SpellsFilters`: Search input and mode filtering dropdown
- `SpellsResultsSummary`: Current results range display
- `SpellsTable`: Main data table with loading states
- `SpellsPagination`: Smart pagination component
- `SpellsError`: Error display component

## Table Columns
1. **Image**: Spell icon (48x48px)
2. **Name**: Spell name
3. **Description**: Short description
4. **Cooldown**: Cooldown in seconds
5. **Range**: Cast range
6. **Modes**: Available game modes (shows first 3 + count)

## Filtering Options
- **Search**: Text search across name, description, and key
- **Game Modes**: Multi-select dropdown for filtering by available modes
- **Active Filters Display**: Shows current filters with remove options

## Pagination
- Configurable items per page (default: 20)
- Smart page display with ellipsis for large page counts
- Previous/Next navigation
- Current page highlighting

## Image Handling
- Uses Next.js Image component for optimization
- Fallback to initials if image fails to load
- Proper error handling and logging
- CDN caching headers

## Navigation Integration
- Added to main navigation bar as "Spells"
- Accessible at `/spells` route
- Consistent with other page layouts

## Error Handling
- API error display
- Image loading fallbacks
- Graceful degradation for missing data
- User-friendly error messages

## Performance Features
- TanStack Query caching
- Optimized image loading
- Efficient filtering and pagination
- Responsive design for mobile devices

## Usage
1. Navigate to `/spells` or click "Spells" in navigation
2. Use search bar to find specific spells
3. Filter by game modes using the dropdown
4. Navigate through pages using pagination
5. Click on spell names or images for more details (future enhancement)

## Future Enhancements
- Spell tooltip display on hover
- Detailed spell information modal
- Spell comparison functionality
- Favorite spells system
- Spell usage statistics
