# Setup Guide

## Quick Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

**Important**: You need to get a Neon PostgreSQL database URL:
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Replace the placeholder in your `.env` file

### 3. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Sync Champions Data
```bash
# This will fetch champions from Riot Games API
npm run sync:champions
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What You'll See

- **Home Page**: Project overview and navigation
- **Champions Page**: Search, filter, and browse all champions
- **API Endpoints**: 
  - `/api/champions` - Get champions with search/filtering
  - `/api/sync` - Sync data from Riot Games
  - `/api/champions/tags` - Get available tags

## Features

✅ **Search**: Find champions by name or title  
✅ **Filtering**: Filter by champion tags (Assassin, Fighter, etc.)  
✅ **Pagination**: 30 champions per page  
✅ **Modern UI**: Beautiful shadcn/ui components  
✅ **Type Safety**: Full TypeScript support  
✅ **Real-time Data**: Auto-sync from Riot Games API  

## Troubleshooting

- **Database Connection Error**: Check your `DATABASE_URL` in `.env`
- **No Champions**: Run `npm run sync:champions` first
- **Build Errors**: Make sure all dependencies are installed with `npm install`

## Next Steps

After setup, you can:
- Customize the UI by modifying TailwindCSS classes
- Add more champion data fields in the Prisma schema
- Deploy to Vercel or other platforms
- Add authentication and user features

