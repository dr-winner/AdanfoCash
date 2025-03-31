
import React from 'react';
import { Course, Video } from '@/data/courses/types';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import EnhancedButton from '@/components/ui/enhanced-button';
import { GraduationCap } from 'lucide-react';

interface WelcomeContentProps {
  courses: Course[];
  setCurrentVideo: (video: Video) => void;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({ courses, setCurrentVideo }) => {
  return (
    <EnhancedCard className="p-8 text-center h-[400px] flex flex-col items-center justify-center">
      <GraduationCap size={48} className="mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold mb-2">Select a Course to Begin</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Choose a course from the catalog to start your learning journey with AdanfoCash
      </p>
      <EnhancedButton 
        variant="gradient"
        onClick={() => {
          if (courses.length > 0) {
            const firstCourse = courses[0];
            if (firstCourse.videos.length > 0) {
              setCurrentVideo(firstCourse.videos[0]);
            }
          }
        }}
      >
        Browse Course Catalog
      </EnhancedButton>
    </EnhancedCard>
  );
};

export default WelcomeContent;
