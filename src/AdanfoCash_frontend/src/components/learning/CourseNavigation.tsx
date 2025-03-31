
import React from 'react';
import { useLearning } from '../../contexts/LearningContext';
import type { Video } from '../../data/courses/types';
import { Button } from '@/components/ui/button';
import { SkipForward, SkipBack, ChevronRight, Play, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface CourseNavigationProps {
  onSelectVideo: (video: Video) => void;
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({ onSelectVideo }) => {
  const { 
    courses, 
    currentCourse, 
    currentVideo, 
    setCurrentCourse, 
    userProgress,
    getCompletionPercentage,
    nextVideo,
    previousVideo
  } = useLearning();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!currentCourse || !currentVideo) {
    return null;
  }

  // Extract first name for personalized message
  const firstName = user.isAuthenticated ? user.id.split(' ')[0] : '';

  // Get current video index
  const currentIndex = currentCourse.videos.findIndex(v => v.id === currentVideo.id);
  const isFirstVideo = currentIndex === 0;
  const isLastVideo = currentIndex === currentCourse.videos.length - 1;

  return (
    <Card className="shadow-lg border-border/70">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Course Content</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-500" />
            <span>{userProgress[currentCourse.id]?.completedVideos.length || 0} / {currentCourse.totalVideos}</span>
          </Badge>
        </div>
        
        {user.isAuthenticated ? (
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {firstName}!
          </p>
        ) : (
          <p className="text-sm text-amber-500 mt-1">
            Your progress is not saved. Log in to track your learning.
          </p>
        )}
        
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Course Progress</span>
            <span>{getCompletionPercentage(currentCourse.id)}%</span>
          </div>
          <Progress 
            value={getCompletionPercentage(currentCourse.id)} 
            className={cn(
              "h-1.5", 
              getCompletionPercentage(currentCourse.id) === 100 ? "bg-green-500" : ""
            )} 
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        <ScrollArea className="h-[180px] sm:h-[220px] pr-4">
          <div className="space-y-1">
            {currentCourse.videos.map((video, index) => {
              const isCompleted = userProgress[currentCourse.id]?.completedVideos.includes(video.id);
              const isCurrent = currentVideo?.id === video.id;
              
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div
                    onClick={() => onSelectVideo(video)}
                    className={cn(
                      "relative flex items-start px-3 py-2 rounded-md cursor-pointer transition-colors",
                      isCurrent 
                        ? "bg-primary/10 border-l-4 border-primary" 
                        : isCompleted
                          ? "hover:bg-accent/50 border-l-4 border-green-500"
                          : "hover:bg-accent/50"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-full w-5 h-5 mt-0.5 mr-3 flex-shrink-0",
                      isCurrent 
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-muted"
                    )}>
                      {isCompleted ? (
                        <CheckCircle size={12} />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={cn(
                          "text-sm font-medium line-clamp-2 mr-2",
                          isCompleted && !isCurrent ? "text-muted-foreground" : ""
                        )}>
                          {video.title}
                        </p>
                        <div className="flex items-center whitespace-nowrap text-xs text-muted-foreground ml-auto flex-shrink-0">
                          <Clock size={10} className="mr-1" />
                          {video.duration}
                        </div>
                      </div>
                      
                      {isCurrent && (
                        <div className="flex items-center mt-1">
                          <Play size={10} className="text-primary mr-1" />
                          <span className="text-xs text-primary">Currently Playing</span>
                        </div>
                      )}
                    </div>
                    
                    {isCurrent && (
                      <ChevronRight size={16} className="ml-2 text-primary flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={previousVideo}
            disabled={isFirstVideo}
            size={isMobile ? "sm" : "default"}
            className={cn(
              "text-xs sm:text-sm",
              !isFirstVideo && "hover:border-primary"
            )}
          >
            <SkipBack size={isMobile ? 14 : 16} className="mr-1" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={nextVideo}
            disabled={isLastVideo}
            size={isMobile ? "sm" : "default"}
            className={cn(
              "text-xs sm:text-sm",
              !isLastVideo && "hover:border-primary"
            )}
          >
            Next
            <SkipForward size={isMobile ? 14 : 16} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseNavigation;
