import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { CourseDetailPage } from './pages/CourseDetailPage';

function App() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  return (
    <>
      {selectedCourseId ? (
        <CourseDetailPage
          courseId={selectedCourseId}
          onBack={() => setSelectedCourseId(null)}
        />
      ) : (
        <HomePage onCourseSelect={setSelectedCourseId} />
      )}
    </>
  );
}

export default App;
