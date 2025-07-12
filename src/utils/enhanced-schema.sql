-- Enhanced order tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'one-time';

-- Create payments table for detailed payment tracking
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table for storing chat history
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Payment policies
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat session policies
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'SPB-' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || '-' || LPAD(CAST(EXTRACT(EPOCH FROM NEW.created_at) AS TEXT), 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Update existing orders with order numbers if they don't have them
UPDATE orders 
SET order_number = 'SPB-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || LPAD(CAST(EXTRACT(EPOCH FROM created_at) AS TEXT), 6, '0')
WHERE order_number IS NULL;

-- Add billing_cycle column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(50) DEFAULT 'one-time';

-- Add plan_duration column to orders table  
ALTER TABLE orders ADD COLUMN IF NOT EXISTS plan_duration VARCHAR(50);

-- Update weekly_meal_plan table structure
ALTER TABLE weekly_meal_plan ADD COLUMN IF NOT EXISTS day_index INTEGER;
ALTER TABLE weekly_meal_plan ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Update the constraint to use day_index instead of day_of_week
ALTER TABLE weekly_meal_plan DROP CONSTRAINT IF EXISTS weekly_meal_plan_day_of_week_check;
ALTER TABLE weekly_meal_plan ADD CONSTRAINT weekly_meal_plan_day_index_check CHECK (day_index >= 0 AND day_index <= 6);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_weekly_meal_plan_user_id ON weekly_meal_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_meal_plan_day_index ON weekly_meal_plan(day_index);

-- Enable RLS for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for service role to insert orders (for webhook)
CREATE POLICY "Service role can insert orders" ON orders
  FOR INSERT WITH CHECK (true);