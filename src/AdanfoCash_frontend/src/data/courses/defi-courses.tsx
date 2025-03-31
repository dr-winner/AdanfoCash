
import React from 'react';
import { Database } from 'lucide-react';
import { Course } from './types';

const defiCourses: Course[] = [
  {
    id: 1,
    title: 'DeFi Basics',
    description: 'Learn the fundamentals of Decentralized Finance.',
    icon: <Database size={24} />,
    category: 'DeFi',
    totalVideos: 4,
    totalDuration: '55:45', // Added total duration
    videos: [
      {
        id: 'defi-1',
        title: 'Introduction to DeFi',
        description: 'Overview of DeFi and its importance in the crypto ecosystem.',
        youtubeId: 'k9HYC0EJU6E',
        duration: '12:30'
      },
      {
        id: 'defi-2',
        title: 'DeFi Protocols',
        description: 'Exploring major DeFi protocols and their use cases.',
        youtubeId: 'aTp9er6S73M',
        duration: '15:45'
      },
      {
        id: 'defi-3',
        title: 'Yield Farming',
        description: 'Understanding yield farming strategies and risks.',
        youtubeId: 'ClnnLI1qGww',
        duration: '14:20'
      },
      {
        id: 'defi-4',
        title: 'DeFi Security',
        description: 'Security considerations and best practices in DeFi.',
        youtubeId: 'QN7BkbEIcGo',
        duration: '13:10'
      }
    ]
  }
];

export default defiCourses;
