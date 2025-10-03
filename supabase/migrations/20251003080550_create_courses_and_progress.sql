/*
  # E-Learning Platform Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key) - Unique course identifier
      - `title` (text) - Course title
      - `description` (text) - Course description
      - `instructor` (text) - Instructor name
      - `duration` (text) - Course duration
      - `level` (text) - Difficulty level
      - `thumbnail` (text) - Course thumbnail URL
      - `created_at` (timestamptz) - Creation timestamp
    
    - `lessons`
      - `id` (uuid, primary key) - Unique lesson identifier
      - `course_id` (uuid, foreign key) - Reference to course
      - `title` (text) - Lesson title
      - `duration` (text) - Lesson duration
      - `order_num` (integer) - Lesson order in course
      - `created_at` (timestamptz) - Creation timestamp
    
    - `course_progress`
      - `id` (uuid, primary key) - Unique progress identifier
      - `course_id` (uuid, foreign key) - Reference to course
      - `user_session` (text) - Session identifier for tracking
      - `completed` (boolean) - Completion status
      - `completed_at` (timestamptz) - Completion timestamp
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (no auth required for prototype)
    - Add policies for public write access to progress table
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor text NOT NULL,
  duration text NOT NULL,
  level text NOT NULL,
  thumbnail text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration text NOT NULL,
  order_num integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create course_progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_session text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_session)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Policies for courses (public read)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

-- Policies for lessons (public read)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

-- Policies for course_progress (public read and write for prototype)
CREATE POLICY "Anyone can view progress"
  ON course_progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert progress"
  ON course_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update progress"
  ON course_progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_session ON course_progress(course_id, user_session);