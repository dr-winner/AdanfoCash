
import React from 'react';
import { useLearning } from '../../contexts/LearningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Clock } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

const CourseStatistics: React.FC = () => {
  const { 
    courses, 
    userProgress, 
    getCompletionPercentage, 
    getCourseProgress 
  } = useLearning();
  const isMobile = useIsMobile();

  // Calculate overall statistics
  const totalCourses = courses.length;
  const startedCourses = Object.keys(userProgress).length;
  
  // Calculate total completed videos across all courses
  const totalCompletedVideos = Object.entries(userProgress).reduce((total, [courseId, progress]) => {
    return total + progress.completedVideos.length;
  }, 0);
  
  // Calculate total videos across all courses
  const totalVideos = courses.reduce((total, course) => total + course.totalVideos, 0);
  
  // Calculate overall progress percentage
  const overallProgressPercentage = totalVideos > 0 
    ? Math.round((totalCompletedVideos / totalVideos) * 100)
    : 0;
  
  // Find the most recent course
  const getMostRecentCourse = () => {
    let mostRecentCourse = null;
    let mostRecentDate = new Date(0);
    
    Object.entries(userProgress).forEach(([courseId, progress]) => {
      if (progress.lastWatched && new Date(progress.lastWatched) > mostRecentDate) {
        mostRecentDate = new Date(progress.lastWatched);
        mostRecentCourse = courses.find(c => c.id === parseInt(courseId));
      }
    });
    
    return mostRecentCourse;
  };
  
  const mostRecentCourse = getMostRecentCourse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-1 md:pb-2 px-3 md:px-4 pt-3 md:pt-4">
          <CardTitle className="text-base md:text-lg flex items-center">
            <GraduationCap className="mr-1.5 md:mr-2" size={isMobile ? 16 : 20} />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-4 pb-3 md:pb-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span>Learning Progress</span>
              <span>{overallProgressPercentage}%</span>
            </div>
            <Progress value={overallProgressPercentage} className="h-1.5 md:h-2" />
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-2 md:mt-4 gap-1 md:gap-0">
              <div className="text-xs md:text-sm">
                <span className="text-foreground/70">Courses Started:</span>
                <span className="ml-1 font-medium">{startedCourses} of {totalCourses}</span>
              </div>
              <div className="text-xs md:text-sm">
                <span className="text-foreground/70">Videos Completed:</span>
                <span className="ml-1 font-medium">{totalCompletedVideos} of {totalVideos}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-1 md:pb-2 px-3 md:px-4 pt-3 md:pt-4">
          <CardTitle className="text-base md:text-lg flex items-center">
            <BookOpen className="mr-1.5 md:mr-2" size={isMobile ? 16 : 20} />
            Recently Watched
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-4 pb-3 md:pb-4">
          {mostRecentCourse ? (
            <div className="space-y-2">
              <div className="text-xs md:text-sm">
                <span className="font-medium">{mostRecentCourse.title}</span>
                <div className="text-foreground/70 text-[10px] md:text-xs mt-0.5 md:mt-1 line-clamp-2">
                  {mostRecentCourse.description}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] md:text-xs">
                <span>Course Progress</span>
                <span>{getCompletionPercentage(mostRecentCourse.id)}%</span>
              </div>
              <Progress value={getCompletionPercentage(mostRecentCourse.id)} className="h-1.5 md:h-2" />
              
              <div className="text-[10px] md:text-xs text-foreground/70 mt-1 md:mt-2 flex items-center">
                <Clock size={isMobile ? 10 : 12} className="mr-1" />
                {userProgress[mostRecentCourse.id]?.lastWatched && 
                  `Last watched: ${new Date(userProgress[mostRecentCourse.id].lastWatched).toLocaleDateString()}`
                }
              </div>
            </div>
          ) : (
            <div className="text-center py-2 md:py-4 text-foreground/70 italic text-xs md:text-sm">
              You haven't started any courses yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseStatistics;
