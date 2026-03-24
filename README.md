# AAA Las Vegas

Guest list and discounted ticket platform for Las Vegas nightclubs.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema in `supabase/schema.sql` via the Supabase SQL Editor
3. Copy your project URL and keys into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### 3. Run Scrapers

Populate events from LIV Las Vegas and LIV Beach:

```bash
npm run scrape:liv
npm run scrape:beach
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

## Project Structure

```
app/                  # Next.js App Router pages
  api/guestlist/      # Guest list API endpoint
  events/[slug]/      # Individual event pages
  blog/               # Blog (coming soon)
  artists/            # Artists (coming soon)
  media/              # Media (coming soon)
components/           # React components
lib/                  # Supabase clients & types
scripts/              # Event scrapers
supabase/             # Database schema
```
