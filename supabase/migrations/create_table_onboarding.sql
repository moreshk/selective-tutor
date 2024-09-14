CREATE TABLE IF NOT EXISTS onboarding (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_type VARCHAR(20) NOT NULL,
  student_name VARCHAR(255),
  student_age INT,
  objectives TEXT,
  completed BOOLEAN DEFAULT FALSE
);

-- Add RLS policies
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view and update their own onboarding data" ON onboarding;

-- Create new policy
CREATE POLICY "Users can view and update their own onboarding data" ON onboarding
  FOR ALL USING (auth.uid() = id);