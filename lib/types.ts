export interface Event {
  id: string;
  venue: 'liv-las-vegas' | 'liv-beach';
  title: string;
  slug: string;
  artist: string;
  event_date: string;
  doors_open: string | null;
  image_url: string | null;
  ticket_url: string | null;
  table_url: string | null;
  offer: string;
  custom_offer: string | null;
  is_published: boolean;
  scraped_at: string | null;
  created_at: string;
}

export interface GuestListEntry {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tags: string[];
  artist: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  auto_generated: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image_url: string | null;
  genres: string[];
  created_at: string;
}

export interface Media {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string | null;
  event_id: string | null;
  venue: string | null;
  tags: string[];
  created_at: string;
}
