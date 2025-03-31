
import React from 'react';
import { Course, Video } from '@/data/courses/types';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CourseProgressProps {
  currentCourse: Course;
  currentVideo: Video;
  getCompletionPercentage: (courseId: number) => number;
}

const CourseProgress: React.FC<CourseProgressProps> = ({
  currentCourse,
  currentVideo,
  getCompletionPercentage
}) => {
  const currentVideoIndex = currentCourse.videos.findIndex(v => v.id === currentVideo.id);
  const isLastVideo = currentVideoIndex === currentCourse.videos.length - 1;
  const nextVideo = !isLastVideo ? currentCourse.videos[currentVideoIndex + 1] : null;

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <EnhancedCard className="p-4" interactive>
        <h3 className="text-sm font-medium mb-2">Course Progress</h3>
        <Progress 
          value={getCompletionPercentage(currentCourse.id)} 
          className={cn(
            "h-2 mb-2",
            getCompletionPercentage(currentCourse.id) === 100 ? "bg-green-500" : ""
          )}
        />
        <p className="text-xs text-muted-foreground">
          {getCompletionPercentage(currentCourse.id)}% complete
        </p>
      </EnhancedCard>
      
      <EnhancedCard className="p-4" interactive>
        <h3 className="text-sm font-medium mb-2">Up Next</h3>
        {nextVideo ? (
          <p className="text-xs truncate">
            {nextVideo.title}
          </p>
        ) : (
          <p className="text-xs">
            End of course
          </p>
        )}
      </EnhancedCard>
      
      <EnhancedCard className="p-4" interactive>
        <h3 className="text-sm font-medium mb-2">Current Course</h3>
        <p className="text-xs truncate">
          {currentCourse.title}
        </p>
      </EnhancedCard>
    </div>
  );
};

export default CourseProgress;
