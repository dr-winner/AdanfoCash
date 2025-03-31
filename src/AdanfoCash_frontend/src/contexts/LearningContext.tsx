
import React, { createContext, useContext, useState, useEffect } from 'react';
import courses from '../data/courses';
import type { Course, Video } from '../data/courses/types';

interface UserProgress {
  [courseId: number]: {
    completedVideos: string[];
    currentVideoIndex: number;
    lastWatched: Date | null;
  };
}

interface LearningContextType {
  courses: Course[];
  userProgress: UserProgress;
  currentCourse: Course | null;
  currentVideo: Video | null;
  setCurrentCourse: (course: Course) => void;
  setCurrentVideo: (video: Video) => void;
  markVideoCompleted: (courseId: number, videoId: string) => void;
  getCompletionPercentage: (courseId: number) => number;
  nextVideo: () => void;
  previousVideo: () => void;
  getCourseProgress: (courseId: number) => { completed: number; total: number };
}

// Create the context
const LearningContext = createContext<LearningContextType | undefined>(undefined);

// Custom hook to use the learning context
export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

// Provider component
export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coursesData, setCoursesData] = useState<Course[]>(courses);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // Initialize or load user progress from localStorage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const savedProgress = localStorage.getItem('learningProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Mark a video as completed
  const markVideoCompleted = (courseId: number, videoId: string) => {
    setUserProgress(prev => {
      // Initialize course progress if it doesn't exist
      const courseProgress = prev[courseId] || {
        completedVideos: [],
        currentVideoIndex: 0,
        lastWatched: new Date()
      };

      // Only add the video ID if it's not already marked as completed
      if (!courseProgress.completedVideos.includes(videoId)) {
        return {
          ...prev,
          [courseId]: {
            ...courseProgress,
            completedVideos: [...courseProgress.completedVideos, videoId],
            lastWatched: new Date()
          }
        };
      }
      return prev;
    });
  };

  // Calculate completion percentage for a course
  const getCompletionPercentage = (courseId: number): number => {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return 0;

    const progress = userProgress[courseId];
    if (!progress) return 0;

    return Math.round((progress.completedVideos.length / course.totalVideos) * 100);
  };

  // Get detailed course progress
  const getCourseProgress = (courseId: number) => {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return { completed: 0, total: 0 };

    const progress = userProgress[courseId];
    if (!progress) return { completed: 0, total: course.totalVideos };

    return { 
      completed: progress.completedVideos.length, 
      total: course.totalVideos 
    };
  };

  // Navigate to the next video in the current course
  const nextVideo = () => {
    if (!currentCourse || !currentVideo) return;
    
    const currentIndex = currentCourse.videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex < currentCourse.videos.length - 1) {
      const nextVideoItem = currentCourse.videos[currentIndex + 1];
      setCurrentVideo(nextVideoItem);
      
      // Update current video index in progress
      setUserProgress(prev => ({
        ...prev,
        [currentCourse.id]: {
          ...prev[currentCourse.id] || { completedVideos: [] },
          currentVideoIndex: currentIndex + 1,
          lastWatched: new Date()
        }
      }));
    }
  };

  // Navigate to the previous video in the current course
  const previousVideo = () => {
    if (!currentCourse || !currentVideo) return;
    
    const currentIndex = currentCourse.videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex > 0) {
      const prevVideoItem = currentCourse.videos[currentIndex - 1];
      setCurrentVideo(prevVideoItem);
      
      // Update current video index in progress
      setUserProgress(prev => ({
        ...prev,
        [currentCourse.id]: {
          ...prev[currentCourse.id] || { completedVideos: [] },
          currentVideoIndex: currentIndex - 1,
          lastWatched: new Date()
        }
      }));
    }
  };

  // Create the value object with all our state and functions
  const value = {
    courses: coursesData,
    userProgress,
    currentCourse,
    currentVideo,
    setCurrentCourse,
    setCurrentVideo,
    markVideoCompleted,
    getCompletionPercentage,
    nextVideo,
    previousVideo,
    getCourseProgress
  };

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
};

export default LearningContext;
