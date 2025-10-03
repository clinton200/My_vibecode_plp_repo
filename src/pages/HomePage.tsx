import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase, getUserSession, type Course, type CourseProgress } from '../lib/supabase';
import { CourseCard } from '../components/CourseCard';

interface HomePageProps {
  onCourseSelect: (courseId: string) => void;
}

export function HomePage({ onCourseSelect }: HomePageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Map<string, CourseProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [coursesResult, progressResult] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: true }),
        supabase.from('course_progress').select('*').eq('user_session', getUserSession())
      ]);

      if (coursesResult.data) {
        setCourses(coursesResult.data);
      }

      if (progressResult.data) {
        const progressMap = new Map(
          progressResult.data.map(p => [p.course_id, p])
        );
        setProgress(progressMap);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">LearnHub</h1>
          </div>
          <p className="mt-2 text-gray-600">Expand your knowledge with expert-led courses</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Courses</h2>
          <p className="text-gray-600">Choose a course to start your learning journey</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isCompleted={progress.get(course.id)?.completed || false}
                onClick={() => onCourseSelect(course.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
