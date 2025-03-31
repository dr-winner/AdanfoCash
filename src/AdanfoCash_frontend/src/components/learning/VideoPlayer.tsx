
import React, { useEffect, useState } from 'react';
import { useLearning } from '../../contexts/LearningContext';
import type { Video } from '../../data/courses/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, Pause, CheckCircle, Clock, DownloadCloud, Bookmark, Share2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  video: Video;
  courseId: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, courseId }) => {
  const { markVideoCompleted, userProgress } = useLearning();
  const [videoProgress, setVideoProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = useIsMobile();
  
  // Check if this video is already completed
  useEffect(() => {
    const courseProgress = userProgress[courseId];
    if (courseProgress && courseProgress.completedVideos.includes(video.id)) {
      setIsCompleted(true);
      setVideoProgress(100);
    } else {
      setIsCompleted(false);
      setVideoProgress(0);
    }
  }, [video.id, courseId, userProgress]);

  // Handle video progress updates
  const handleVideoProgress = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Simulate progress when playing
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          const newProgress = prev + 5;
          // Mark as completed if watched more than 90%
          if (newProgress >= 90 && !isCompleted) {
            markVideoCompleted(courseId, video.id);
            setIsCompleted(true);
            clearInterval(interval);
            return 100;
          }
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      // Clear interval when component unmounts
      return () => clearInterval(interval);
    }
  };

  // Reset progress when video changes
  useEffect(() => {
    setVideoProgress(isCompleted ? 100 : 0);
    setIsPlaying(false);
  }, [video.id, isCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg shadow-lg bg-card"
    >
      <div className="relative">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <iframe
            title={video.title}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtubeId}?enablejsapi=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {isCompleted && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg z-10">
              <CheckCircle size={isMobile ? 16 : 20} />
            </div>
          )}
        </div>
        
        <div className="w-full h-1">
          <Progress 
            value={videoProgress} 
            className={cn(
              "h-1 rounded-none", 
              isCompleted ? "bg-green-500" : ""
            )} 
          />
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col space-y-3">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-base sm:text-xl font-semibold line-clamp-2">{video.title}</h3>
              <Badge variant="outline" className="ml-2 shrink-0 flex items-center gap-1">
                <Clock size={12} />
                <span className="text-xs">{video.duration}</span>
              </Badge>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-3">
              {video.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              variant={isPlaying ? "secondary" : "default"}
              size={isMobile ? "sm" : "default"}
              onClick={handleVideoProgress}
              className="flex-1 sm:flex-none"
            >
              {isPlaying ? (
                <>
                  <Pause size={isMobile ? 14 : 16} className="mr-1" />
                  {isCompleted ? 'Pause Replay' : 'Pause'}
                </>
              ) : (
                <>
                  <Play size={isMobile ? 14 : 16} className="mr-1" />
                  {isCompleted ? 'Replay' : 'Play'}
                </>
              )}
            </Button>
            
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Bookmark size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bookmark</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <DownloadCloud size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Materials</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Share2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
};

export default VideoPlayer;
