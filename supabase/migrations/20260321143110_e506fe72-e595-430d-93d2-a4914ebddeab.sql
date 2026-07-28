CREATE POLICY "Anyone can read own subscription by endpoint"
ON public.push_subscriptions
FOR SELECT
TO anon
USING (true);