-- Supabase Database Schema for CIA (Copilot Implementation Agent)
-- Run this in your Supabase SQL Editor

-- Create the saved_plans table
CREATE TABLE IF NOT EXISTS saved_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  markdown TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_plans ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own plans
CREATE POLICY "Users can view own plans" ON saved_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON saved_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON saved_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON saved_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_saved_plans_user_id ON saved_plans(user_id);

-- Create index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_saved_plans_created_at ON saved_plans(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_saved_plans_updated_at
  BEFORE UPDATE ON saved_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
