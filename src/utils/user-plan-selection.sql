
-- Create table for storing user plan selections
CREATE TABLE IF NOT EXISTS user_plan_selections (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id INTEGER,
  plan_name TEXT NOT NULL,
  plan_price DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT CHECK (billing_cycle IN ('weekly', 'monthly')) DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_plan_selections ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to manage their own plan selections
CREATE POLICY "Users can manage their own plan selections" ON user_plan_selections
  FOR ALL USING (auth.uid() = user_id);
