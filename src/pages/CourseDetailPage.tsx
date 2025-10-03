import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock, CheckCircle, Circle, Award } from 'lucide-react';
import { supabase, getUserSession, type Course, type Lesson, type CourseProgress } from '../lib/supabase';

interface CourseDetailPageProps {
  courseId: string;
  onBack: () => void;
}

export function CourseDetailPage({ courseId, onBack }: CourseDetailPageProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  async function loadCourseData() {
    try {
      const [courseResult, lessonsResult, progressResult] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
        supabase.from('lessons').select('*').eq('course_id', courseId).order('order_num'),
        supabase.from('course_progress').select('*').eq('course_id', courseId).eq('user_session', getUserSession()).maybeSingle()
      ]);

      if (courseResult.data) {
        setCourse(courseResult.data);
      }

      if (lessonsResult.data) {
        setLessons(lessonsResult.data);
      }

      if (progressResult.data) {
        setProgress(progressResult.data);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteToggle() {
    if (!course) return;

    setCompleting(true);
    try {
      const userSession = getUserSession();
      const newCompletedState = !progress?.completed;

      if (progress) {
        const { data } = await supabase
          .from('course_progress')
          .update({
            completed: newCompletedState,
            completed_at: newCompletedState ? new Date().toISOString() : null
          })
          .eq('id', progress.id)
          .select()
          .single();

        if (data) {
          setProgress(data);
        }
      } else {
        const { data } = await supabase
          .from('course_progress')
          .insert({
            course_id: course.id,
            user_session: userSession,
            completed: true,
            completed_at: new Date().toISOString()
          })
          .select()
          .single();

        if (data) {
          setProgress(data);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.completed || false;
  const completedPercentage = isCompleted ? 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-2 text-gray-600">{course.description}</p>
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {course.level}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Instructor:</span> {course.instructor}
                </div>
              </div>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Completed</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
                <span className="text-sm text-gray-600">{lessons.length} lessons</span>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No lessons available yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            Lesson {index + 1}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Course Completion</span>
                  <span className="text-sm font-semibold text-gray-800">{completedPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${completedPercentage}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleCompleteToggle}
                disabled={completing}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isCompleted
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {completing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Mark as Incomplete</span>
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>

              {isCompleted && progress?.completed_at && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Completed on {new Date(progress.completed_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
