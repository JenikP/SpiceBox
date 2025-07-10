
-- Insert sample plans data into Supabase
INSERT INTO plans (name, description, price, weeklyprice, monthlyprice, originalweeklyprice, originalmonthlyprice, duration, meals, permeal, notes, features, badge, badgecolor, recommended) VALUES 
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
  false
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
  true
),
(
  'Full Journey Plan',
  'Maximum support for serious transformation goals',
  2205,
  170,
  735,
  231,
  1001,
  '3 months',
  360,
  '$8.17',
  'Best value — pay upfront',
  '["273 meals total", "Upfront 3-month journey", "Priority support", "1-on-1 nutrition check-in", "Exclusive recipe access"]',
  'Best Value',
  'bg-blue-600',
  false
);
