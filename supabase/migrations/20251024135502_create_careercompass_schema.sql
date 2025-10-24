/*
  # CareerCompass AI Database Schema

  ## Overview
  This migration creates the complete database schema for CareerCompass AI, 
  an AI-powered career guidance platform integrated with Google Gemini.

  ## New Tables

  ### 1. user_profiles
  Stores comprehensive user profile information used by Gemini for personalized career analysis
  - `id` (uuid, primary key) - Links to auth.users
  - `display_name` (text) - User's display name
  - `bio` (text) - Personal biography
  - `display_picture_url` (text) - Profile picture URL
  - `resume_url` (text) - Uploaded resume file URL
  - `education` (jsonb) - Educational background (array of institutions and degrees)
  - `skills` (text[]) - Array of user skills
  - `goals` (text) - Career goals and aspirations
  - `social_links` (jsonb) - Social media and professional links
  - `extracted_resume_data` (jsonb) - AI-parsed resume data (skills, experience, keywords)
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. career_recommendations
  Stores AI-generated career recommendations for users
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References user_profiles
  - `career_title` (text) - Career role name
  - `summary` (text) - Role description
  - `market_demand` (text) - Market demand analysis
  - `confidence_score` (integer) - AI confidence score (0-100)
  - `required_skills` (text[]) - Skills required for this career
  - `salary_range` (text) - Expected salary range
  - `growth_outlook` (text) - Career growth predictions
  - `rank` (integer) - Ranking among top 5 recommendations
  - `created_at` (timestamptz)

  ### 3. career_roadmaps
  Stores detailed career path roadmaps with micro-tasks
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `career_id` (uuid, foreign key) - References career_recommendations
  - `title` (text) - Roadmap milestone title
  - `description` (text) - Detailed description
  - `difficulty_level` (text) - AI-assigned difficulty (Beginner, Intermediate, Advanced, Expert)
  - `estimated_duration` (text) - Time estimate
  - `order_index` (integer) - Display order
  - `resource_links` (jsonb) - Array of learning resources (Coursera, GitHub, etc.)
  - `certification_paths` (text[]) - Related certifications
  - `completed` (boolean) - Completion status
  - `completed_at` (timestamptz) - Completion timestamp
  - `created_at` (timestamptz)

  ### 4. skill_gaps
  Tracks identified skill gaps and recommendations to close them
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `career_id` (uuid, foreign key)
  - `missing_skill` (text) - Skill the user lacks
  - `importance` (text) - Critical, High, Medium, Low
  - `course_suggestions` (jsonb) - AI-recommended courses and certifications
  - `created_at` (timestamptz)

  ### 5. portfolio_items
  User's project portfolio and certifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `type` (text) - 'project' or 'certification'
  - `title` (text) - Project/certification name
  - `description` (text) - Detailed description
  - `file_url` (text) - Uploaded file URL
  - `skills_used` (text[]) - Technologies and skills demonstrated
  - `ai_feedback` (text) - Gemini-generated feedback and suggestions
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. chat_history
  AI Mentor chat conversation history
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `message` (text) - User or AI message content
  - `role` (text) - 'user' or 'assistant'
  - `created_at` (timestamptz)

  ### 7. user_achievements
  Gamification: badges, milestones, and progress tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `achievement_type` (text) - Badge, milestone, streak type
  - `title` (text) - Achievement name
  - `description` (text) - Achievement description
  - `icon` (text) - Icon identifier
  - `unlocked_at` (timestamptz) - When achievement was earned

  ### 8. career_analytics
  Predictive analytics and market trend data
  - `id` (uuid, primary key)
  - `career_title` (text) - Career role name
  - `market_trend_data` (jsonb) - Time-series market demand data
  - `skill_trends` (jsonb) - Emerging skill patterns
  - `growth_prediction` (jsonb) - AI predictions for role demand
  - `last_updated` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Career analytics are publicly readable for all authenticated users
  - Strict authentication and ownership checks on all policies

  ## Important Notes
  1. All user data is strictly protected with Row Level Security
  2. JSONB fields allow flexible storage of complex AI-generated data
  3. Timestamps track data freshness for AI re-analysis
  4. Foreign keys ensure data integrity across related entities
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT '',
  bio text DEFAULT '',
  display_picture_url text,
  resume_url text,
  education jsonb DEFAULT '[]'::jsonb,
  skills text[] DEFAULT ARRAY[]::text[],
  goals text DEFAULT '',
  social_links jsonb DEFAULT '{}'::jsonb,
  extracted_resume_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_recommendations table
CREATE TABLE IF NOT EXISTS career_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  career_title text NOT NULL,
  summary text DEFAULT '',
  market_demand text DEFAULT '',
  confidence_score integer DEFAULT 0,
  required_skills text[] DEFAULT ARRAY[]::text[],
  salary_range text DEFAULT '',
  growth_outlook text DEFAULT '',
  rank integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create career_roadmaps table
CREATE TABLE IF NOT EXISTS career_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  career_id uuid REFERENCES career_recommendations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  difficulty_level text DEFAULT 'Beginner',
  estimated_duration text DEFAULT '',
  order_index integer DEFAULT 0,
  resource_links jsonb DEFAULT '[]'::jsonb,
  certification_paths text[] DEFAULT ARRAY[]::text[],
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create skill_gaps table
CREATE TABLE IF NOT EXISTS skill_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  career_id uuid REFERENCES career_recommendations(id) ON DELETE CASCADE,
  missing_skill text NOT NULL,
  importance text DEFAULT 'Medium',
  course_suggestions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  file_url text,
  skills_used text[] DEFAULT ARRAY[]::text[],
  ai_feedback text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'award',
  unlocked_at timestamptz DEFAULT now()
);

-- Create career_analytics table
CREATE TABLE IF NOT EXISTS career_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_title text UNIQUE NOT NULL,
  market_trend_data jsonb DEFAULT '{}'::jsonb,
  skill_trends jsonb DEFAULT '{}'::jsonb,
  growth_prediction jsonb DEFAULT '{}'::jsonb,
  last_updated timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for career_recommendations
CREATE POLICY "Users can view own recommendations"
  ON career_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON career_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON career_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON career_recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for career_roadmaps
CREATE POLICY "Users can view own roadmaps"
  ON career_roadmaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmaps"
  ON career_roadmaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps"
  ON career_roadmaps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmaps"
  ON career_roadmaps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for skill_gaps
CREATE POLICY "Users can view own skill gaps"
  ON skill_gaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill gaps"
  ON skill_gaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill gaps"
  ON skill_gaps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skill gaps"
  ON skill_gaps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for portfolio_items
CREATE POLICY "Users can view own portfolio"
  ON portfolio_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for chat_history
CREATE POLICY "Users can view own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history"
  ON chat_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for career_analytics (publicly readable for authenticated users)
CREATE POLICY "Authenticated users can view career analytics"
  ON career_analytics FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_career_roadmaps_user_id ON career_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_career_roadmaps_career_id ON career_roadmaps(career_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user_id ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);