
import React from 'react';
import { User } from '@/services/auth';
import { Video } from '@/data/courses/types';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import EnhancedButton from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';
import { BookOpen, BarChart3, Clock, LockIcon } from 'lucide-react';
import { Course } from '@/data/courses/types';

interface CourseCatalogProps {
  filteredCourses: Course[];
  getCompletionPercentage: (courseId: number) => number;
  userProgress: Record<number, any>;
  setCurrentVideo: (video: Video) => void;
  user: User;
  handleLoginClick: () => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({
  filteredCourses,
  getCompletionPercentage,
  userProgress,
  setCurrentVideo,
  user,
  handleLoginClick
}) => {
  return (
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-4">
        <TabsTrigger value="courses" className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" /> Courses
        </TabsTrigger>
        <TabsTrigger value="progress" className="flex items-center gap-1">
          <BarChart3 className="h-4 w-4" /> My Progress
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="courses" className="mt-0">
        <Card>
          <CardContent className="p-4">
            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
              <Accordion type="multiple" className="w-full">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <AccordionItem key={course.id} value={`course-${course.id}`}>
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-col items-start text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="capitalize">
                              {course.category}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> 
                              {course.totalDuration}
                            </Badge>
                          </div>
                          <h3 className="font-medium mt-2">{course.title}</h3>
                          <div className="w-full mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{getCompletionPercentage(course.id)}%</span>
                            </div>
                            <Progress 
                              value={getCompletionPercentage(course.id)} 
                              className={cn("h-1", getCompletionPercentage(course.id) === 100 ? "bg-green-500" : "")}
                            />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {course.description}
                        </p>
                        <div className="space-y-2">
                          {course.videos.map((video, index) => {
                            const isCompleted = userProgress[course.id]?.completedVideos?.includes(video.id);
                            return (
                              <Button
                                key={video.id}
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start text-left h-auto py-2",
                                  isCompleted ? "bg-green-500/10" : ""
                                )}
                                onClick={() => setCurrentVideo(video)}
                              >
                                <div className="flex items-start gap-2">
                                  <div className={cn(
                                    "rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5",
                                    isCompleted 
                                      ? "bg-green-500 text-white" 
                                      : "bg-muted"
                                  )}>
                                    {isCompleted ? "✓" : index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{video.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{video.duration}</span>
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No courses found matching your criteria</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        const event = new CustomEvent('clearFilters');
                        document.dispatchEvent(event);
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="progress" className="mt-0">
        <Card>
          <CardContent className="p-4">
            {!user.isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <LockIcon size={40} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Login Required</h3>
                <p className="text-muted-foreground mb-6">
                  You need to log in to track your progress across courses.
                </p>
                <EnhancedButton
                  onClick={handleLoginClick}
                  variant="gradient"
                >
                  Connect Internet Identity
                </EnhancedButton>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                <UserProgressList 
                  filteredCourses={filteredCourses}
                  getCompletionPercentage={getCompletionPercentage}
                  userProgress={userProgress}
                  setCurrentVideo={setCurrentVideo}
                />
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

interface UserProgressListProps {
  filteredCourses: Course[];
  getCompletionPercentage: (courseId: number) => number;
  userProgress: Record<number, any>;
  setCurrentVideo: (video: Video) => void;
}

const UserProgressList: React.FC<UserProgressListProps> = ({
  filteredCourses,
  getCompletionPercentage,
  userProgress,
  setCurrentVideo
}) => {
  const coursesInProgress = filteredCourses.filter(course => getCompletionPercentage(course.id) > 0)
    .sort((a, b) => getCompletionPercentage(b.id) - getCompletionPercentage(a.id));

  if (coursesInProgress.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground mb-4">You haven't started any courses yet</p>
        <EnhancedButton 
          variant="default"
          onClick={() => {
            const coursesTab = document.querySelector('[data-value="courses"]');
            if (coursesTab instanceof HTMLElement) {
              coursesTab.click();
            }
          }}
        >
          Browse Courses
        </EnhancedButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {coursesInProgress.map(course => (
        <EnhancedCard 
          key={course.id} 
          className="p-4 relative"
          interactive
        >
          <div className="mb-2">
            <Badge variant="outline" className="capitalize absolute right-3 top-3">
              {course.category}
            </Badge>
            <h3 className="font-medium pr-16">{course.title}</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Completion</span>
              <span className="font-medium">{getCompletionPercentage(course.id)}%</span>
            </div>
            <Progress 
              value={getCompletionPercentage(course.id)} 
              className={cn(
                "h-2",
                getCompletionPercentage(course.id) === 100 ? "bg-green-500" : ""
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <EnhancedButton
              size="sm"
              variant="default"
              onClick={() => {
                const progress = userProgress[course.id];
                const video = progress ? 
                  course.videos.find(v => !progress.completedVideos?.includes(v.id)) || course.videos[0] :
                  course.videos[0];
                setCurrentVideo(video);
              }}
            >
              {getCompletionPercentage(course.id) === 100 ? 'Review Course' : 'Continue Learning'}
            </EnhancedButton>
          </div>
        </EnhancedCard>
      ))}
    </div>
  );
};

export default CourseCatalog;
