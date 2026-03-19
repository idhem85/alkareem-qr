
-- App config table (stores VAPID keys etc.)
CREATE TABLE public.app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Only service role can access app_config (no anon access)
CREATE POLICY "Service role only" ON public.app_config
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Push subscriptions table
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  notification_hour int NOT NULL DEFAULT 8,
  notification_minute int NOT NULL DEFAULT 0,
  timezone text NOT NULL DEFAULT 'Europe/Paris',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert/update their own subscriptions (identified by endpoint)
CREATE POLICY "Anyone can insert subscriptions" ON public.push_subscriptions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can update own subscription" ON public.push_subscriptions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete own subscription" ON public.push_subscriptions
  FOR DELETE TO anon USING (true);

CREATE POLICY "Service role full access subscriptions" ON public.push_subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);
