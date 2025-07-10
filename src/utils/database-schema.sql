-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS user_details CASCADE;

-- User details table with all required columns
CREATE TABLE user_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height DECIMAL NOT NULL,
  current_weight DECIMAL NOT NULL,
  goal_weight DECIMAL NOT NULL,
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active')),
  dietary_preference TEXT NOT NULL CHECK (dietary_preference IN ('vegetarian', 'non-vegetarian', 'vegan', 'no-preference')),
  allergies TEXT,
  medical_conditions TEXT,
  goal TEXT NOT NULL CHECK (goal IN ('weight-loss', 'muscle-gain', 'maintain')) DEFAULT 'weight-loss',
  timeline INTEGER NOT NULL,
  calculated_daily_calories INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own details" ON user_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select their own data
CREATE POLICY "Users can view their own details" ON user_details
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own details" ON user_details
  FOR UPDATE USING (auth.uid() = user_id);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price_per_week DECIMAL NOT NULL,
  target_weight_loss DECIMAL,
  daily_calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table for pricing
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  weeklyPrice DECIMAL,
  monthlyPrice DECIMAL,
  originalWeeklyPrice DECIMAL,
  originalMonthlyPrice DECIMAL,
  duration TEXT NOT NULL,
  meals INTEGER NOT NULL,
  perMeal TEXT,
  notes TEXT,
  features JSONB,
  badge TEXT,
  badgeColor TEXT,
  recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly_meal_plan table
CREATE TABLE IF NOT EXISTS weekly_meal_plan (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  meal_number INTEGER NOT NULL CHECK (meal_number >= 1 AND meal_number <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_of_week, meal_number)
);

-- Create orders table for tracking payments
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'AUD',
  plan_name VARCHAR(255),
  plan_id VARCHAR(255),
  meal_count INTEGER DEFAULT 0,
  customer_email VARCHAR(255),
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for weekly_meal_plan
ALTER TABLE weekly_meal_plan ENABLE ROW LEVEL SECURITY;

-- Create policies for weekly_meal_plan
CREATE POLICY "Users can manage their own meal plans" ON weekly_meal_plan
  FOR ALL USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_plan_id INTEGER REFERENCES meal_plans(id),
  order_number TEXT UNIQUE NOT NULL,
  card_name TEXT NOT NULL,
  card_number TEXT NOT NULL, -- Only last 4 digits
  expiry TEXT NOT NULL,
  save_card BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  total_amount DECIMAL NOT NULL,
  plan_name TEXT,
  plan_duration TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table for additional user info
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Insert default plans
INSERT INTO plans (name, description, price, weeklyPrice, monthlyPrice, originalWeeklyPrice, originalMonthlyPrice, duration, meals, perMeal, notes, features, badge, badgeColor, recommended)
VALUES 
(
  '14-Day Kickstart Plan',
  'Perfect for getting started with healthy Indian meals',
  189,
  189,
  819,
  231,
  1001,
  '14 days',
  42,
  '$9.00',
  'Required to begin',
  '["42 meals (3 meals/day for 14 days)", "Same-day delivery", "Basic progress tracking", "Access to nutrition support"]',
  'Required Start',
  'bg-orange-500',
  FALSE
),
(
  'Monthly Plan',
  'Our most popular plan with full meal coverage',
  810,
  187,
  810,
  231,
  1001,
  '30 days',
  90,
  '$9.00',
  'Flexible after 14 days',
  '["90 meals (3/day for 30 days)", "Flexible subscription", "Pause or cancel anytime", "Progress tracking + nutrition support"]',
  'Most Flexible',
  'bg-green-500',
  TRUE
),
(
  'Full Journey Plan',
  'Maximum support for serious transformation goals',
  2940,
  170,
  735,
  231,
  1001,
  '4 months',
  360,
  '$8.17',
  'Best value — pay upfront',
  '["360 meals total", "Upfront 4-month journey", "Priority support", "1-on-1 nutrition check-in", "Exclusive recipe access"]',
  'Best Value',
  'bg-blue-600',
  FALSE
)
ON CONFLICT (id) DO NOTHING;