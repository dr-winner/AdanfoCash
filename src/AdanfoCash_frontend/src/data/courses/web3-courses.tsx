
import React from 'react';
import { Globe } from 'lucide-react';
import { Course } from './types';

const web3Courses: Course[] = [
  {
    id: 5,
    title: 'Web3 Fundamentals',
    description: 'Understand the principles of Web3 and the decentralized web.',
    icon: <Globe size={24} />,
    category: 'Web3',
    totalVideos: 4,
    totalDuration: '50:20', // Added total duration
    videos: [
      {
        id: 'web3-1',
        title: 'Web1 to Web3 Evolution',
        description: 'The journey from Web1 to Web3 and what makes each unique.',
        youtubeId: 'nHhAEkG1y2U',
        duration: '10:15'
      },
      {
        id: 'web3-2',
        title: 'Decentralized Applications',
        description: 'Overview of dApps and how they differ from traditional applications.',
        youtubeId: 'F50OrwV6Uk8',
        duration: '14:30'
      },
      {
        id: 'web3-3',
        title: 'Web3 Infrastructure',
        description: 'The technology stack that powers Web3 applications.',
        youtubeId: '1jAl21zi_X8',
        duration: '13:45'
      },
      {
        id: 'web3-4',
        title: 'User Experience in Web3',
        description: 'Challenges and solutions for UX design in Web3 applications.',
        youtubeId: 'ZKDa8BfOOvs',
        duration: '11:50'
      }
    ]
  }
];

export default web3Courses;
