import { BookOpen, Clock, Award } from 'lucide-react';
import type { Course } from '../lib/supabase';

interface CourseCardProps {
  course: Course;
  isCompleted: boolean;
  onClick: () => void;
}

export function CourseCard({ course, isCompleted, onClick }: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center relative">
        <BookOpen className="w-20 h-20 text-white opacity-80" />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Award className="w-4 h-4" />
            Completed
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {course.level}
          </span>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Instructor:</span> {course.instructor}
        </div>
      </div>
    </div>
  );
}
