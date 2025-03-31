
import React from 'react';
import { Globe } from 'lucide-react';
import { Course } from './types';

const icpCourses: Course[] = [
  {
    id: 4,
    title: 'Internet Computer Protocol',
    description: 'Master the fundamentals of ICP and its revolutionary blockchain.',
    icon: <Globe size={24} />,
    category: 'ICP',
    totalVideos: 4,
    totalDuration: '55:30', // Added total duration
    videos: [
      {
        id: 'icp-1',
        title: 'ICP Fundamentals',
        description: 'Introduction to Internet Computer Protocol architecture.',
        youtubeId: 'XgsOKP224Zw',
        duration: '11:40'
      },
      {
        id: 'icp-2',
        title: 'Developing on ICP',
        description: 'Getting started with development on the Internet Computer.',
        youtubeId: 'M3XwLxG2xvA',
        duration: '16:25'
      },
      {
        id: 'icp-3',
        title: 'Canister Smart Contracts',
        description: 'Understanding canisters and their role in ICP.',
        youtubeId: 'tRl9RhA2k_c',
        duration: '14:35'
      },
      {
        id: 'icp-4',
        title: 'ICP Tokenomics',
        description: 'Exploring the economic model behind ICP.',
        youtubeId: 'dQFdnMrt_uw',
        duration: '12:50'
      }
    ]
  }
];

export default icpCourses;
