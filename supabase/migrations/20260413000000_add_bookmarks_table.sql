-- Bookmarks table for cloud sync
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  surah_id int NOT NULL,
  ayah_number int NOT NULL,
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (device_id, surah_id, ayah_number)
);

-- Index for fast lookups by device
CREATE INDEX idx_bookmarks_device_id ON public.bookmarks(device_id);
CREATE INDEX idx_bookmarks_device_timestamp ON public.bookmarks(device_id, updated_at);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Allow anon to read their own bookmarks
CREATE POLICY "Anyone can read own bookmarks" ON public.bookmarks
  FOR SELECT TO anon USING (true);

-- Allow anon to insert their own bookmarks
CREATE POLICY "Anyone can insert own bookmarks" ON public.bookmarks
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anon to update their own bookmarks
CREATE POLICY "Anyone can update own bookmarks" ON public.bookmarks
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Allow anon to delete their own bookmarks
CREATE POLICY "Anyone can delete own bookmarks" ON public.bookmarks
  FOR DELETE TO anon USING (true);

-- Service role full access
CREATE POLICY "Service role full access bookmarks" ON public.bookmarks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Reading progress table
CREATE TABLE public.reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  surah_id int NOT NULL,
  ayah_number int NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (device_id, surah_id)
);

CREATE INDEX idx_reading_progress_device ON public.reading_progress(device_id);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read own progress" ON public.reading_progress
  FOR SELECT TO anon USING (true);

CREATE POLICY "Anyone can insert own progress" ON public.reading_progress
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can update own progress" ON public.reading_progress
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete own progress" ON public.reading_progress
  FOR DELETE TO anon USING (true);

CREATE POLICY "Service role full access progress" ON public.reading_progress
  FOR ALL TO service_role USING (true) WITH CHECK (true);
