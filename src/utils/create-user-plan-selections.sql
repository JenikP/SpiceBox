
CREATE TABLE IF NOT EXISTS public.user_plan_selections (
  id SERIAL NOT NULL,
  user_id UUID NULL,
  plan_id TEXT NULL,
  plan_name TEXT NOT NULL,
  plan_price NUMERIC(10, 2) NOT NULL,
  billing_cycle TEXT NULL DEFAULT 'monthly'::text,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT user_plan_selections_pkey PRIMARY KEY (id),
  CONSTRAINT user_plan_selections_user_id_key UNIQUE (user_id),
  CONSTRAINT user_plan_selections_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_plan_selections_billing_cycle_check CHECK (
    billing_cycle = ANY (ARRAY['weekly'::text, 'monthly'::text])
  )
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.user_plan_selections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own plan selections" ON public.user_plan_selections
  FOR ALL USING (auth.uid() = user_id);
