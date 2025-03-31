
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Course } from './types';

const lendingCourses: Course[] = [
  {
    id: 2,
    title: 'Lending 101',
    description: 'Understanding decentralized lending platforms and how to get started as a lender.',
    icon: <CreditCard size={24} />,
    category: 'Lending',
    totalVideos: 4,
    totalDuration: '49:45', // Added total duration
    videos: [
      {
        id: 'lending-1',
        title: 'The Basics of DeFi Lending',
        description: 'Introduction to lending in the decentralized finance space.',
        youtubeId: 'aTp9er6S73M',
        duration: '9:45'
      },
      {
        id: 'lending-2',
        title: 'How to Choose Lending Platforms',
        description: 'Factors to consider when selecting platforms for lending.',
        youtubeId: '0KmxwV4v1C0',
        duration: '11:30'
      },
      {
        id: 'lending-3',
        title: 'Risk Management for Lenders',
        description: 'Strategies to mitigate risks when lending in DeFi.',
        youtubeId: 'H-O3r2YMWJ4',
        duration: '13:20'
      },
      {
        id: 'lending-4',
        title: 'Advanced Lending Strategies',
        description: 'Maximizing returns with sophisticated lending approaches.',
        youtubeId: 'qFBYB4W2tqU',
        duration: '15:10'
      }
    ]
  }
];

export default lendingCourses;
