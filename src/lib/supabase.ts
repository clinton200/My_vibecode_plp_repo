import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  thumbnail: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  duration: string;
  order_num: number;
  created_at: string;
}

export interface CourseProgress {
  id: string;
  course_id: string;
  user_session: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export function getUserSession(): string {
  let session = localStorage.getItem('user_session');
  if (!session) {
    session = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_session', session);
  }
  return session;
}
