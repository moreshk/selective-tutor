-- Sections table
CREATE TABLE sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answers table
CREATE TABLE answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User responses table
CREATE TABLE user_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Sections: Allow read access to all authenticated users, write access only to admin users
CREATE POLICY "Allow read access for all authenticated users" ON sections FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON sections FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE is_admin = true));

-- Lessons: Allow read access to all authenticated users, write access only to admin users
CREATE POLICY "Allow read access for all authenticated users" ON lessons FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON lessons FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE is_admin = true));

-- Questions: Allow read access to all authenticated users, write access only to admin users
CREATE POLICY "Allow read access for all authenticated users" ON questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON questions FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE is_admin = true));

-- Answers: Allow read access to all authenticated users, write access only to admin users
CREATE POLICY "Allow read access for all authenticated users" ON answers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON answers FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE is_admin = true));

-- User responses: Allow users to insert their own responses and read their own responses
CREATE POLICY "Allow users to insert their own responses" ON user_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to read their own responses" ON user_responses FOR SELECT USING (auth.uid() = user_id);

-- Add is_admin column to the users table
ALTER TABLE auth.users ADD COLUMN is_admin BOOLEAN DEFAULT false;