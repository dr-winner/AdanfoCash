
import React from 'react';

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'Lending' | 'DeFi' | 'Investment' | 'ICP' | 'Web3' | 'Blockchain';
  totalVideos: number;
  // Calculate total duration from all videos
  totalDuration: string;
  videos: Video[];
}

// Define the UserCourseProgress interface to avoid confusion with Course properties
export interface UserCourseProgress {
  completedVideos: string[];
  currentVideoIndex: number;
  lastWatched: Date | null;
}
