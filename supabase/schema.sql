-- AAA Las Vegas Database Schema

-- Events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue text NOT NULL CHECK (venue IN ('liv-las-vegas', 'liv-beach')),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  artist text NOT NULL,
  event_date timestamptz NOT NULL,
  doors_open text,
  image_url text,
  ticket_url text,
  table_url text,
  offer text DEFAULT 'Complimentary Entry until 1AM | Buy Tickets Below',
  custom_offer text,
  is_published boolean DEFAULT true,
  scraped_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Guest list table
CREATE TABLE guest_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  dob date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Blogs table
CREATE TABLE blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  tags text[],
  artist text,
  cover_image_url text,
  is_published boolean DEFAULT false,
  auto_generated boolean DEFAULT true,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Artists table
CREATE TABLE artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text,
  image_url text,
  genres text[],
  created_at timestamptz DEFAULT now()
);

-- Media table
CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('photo', 'video')),
  url text NOT NULL,
  caption text,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  venue text,
  tags text[],
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on guest_list
ALTER TABLE guest_list ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (for the guest list form)
CREATE POLICY "Allow anonymous inserts" ON guest_list
  FOR INSERT
  WITH CHECK (true);

-- Allow service role full access to guest_list
CREATE POLICY "Service role full access" ON guest_list
  FOR ALL
  USING (auth.role() = 'service_role');

-- Public read access for events
CREATE POLICY "Public read events" ON events
  FOR SELECT
  USING (true);

-- Public read access for blogs
CREATE POLICY "Public read blogs" ON blogs
  FOR SELECT
  USING (true);

-- Public read access for artists
CREATE POLICY "Public read artists" ON artists
  FOR SELECT
  USING (true);

-- Public read access for media
CREATE POLICY "Public read media" ON media
  FOR SELECT
  USING (true);

-- Indexes for performance
CREATE INDEX idx_events_venue ON events(venue);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_is_published ON blogs(is_published);
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_media_venue ON media(venue);
CREATE INDEX idx_media_event_id ON media(event_id);
