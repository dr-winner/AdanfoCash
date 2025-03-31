
import React from 'react';
import { Database, Shield } from 'lucide-react';
import { Course } from './types';

const blockchainCourses: Course[] = [
  {
    id: 6,
    title: 'Blockchain Technology',
    description: 'Master the core concepts of blockchain technology and its applications.',
    icon: <Database size={24} />,
    category: 'Blockchain',
    totalVideos: 5,
    totalDuration: '67:20', // Added total duration
    videos: [
      {
        id: 'blockchain-1',
        title: 'Blockchain Fundamentals',
        description: 'Core concepts of blockchain technology explained.',
        youtubeId: '3xGLc-zz9cA',
        duration: '12:30'
      },
      {
        id: 'blockchain-2',
        title: 'Consensus Mechanisms',
        description: 'Understanding Proof of Work, Proof of Stake, and other consensus algorithms.',
        youtubeId: 'oLS9UxL5mzw',
        duration: '15:45'
      },
      {
        id: 'blockchain-3',
        title: 'Smart Contracts Deep Dive',
        description: 'How smart contracts work and their applications.',
        youtubeId: 'pyaIppMhuic',
        duration: '14:20'
      },
      {
        id: 'blockchain-4',
        title: 'Public vs Private Blockchains',
        description: 'Comparing different types of blockchain networks.',
        youtubeId: '8fbhI1qVj0c',
        duration: '11:10'
      },
      {
        id: 'blockchain-5',
        title: 'Blockchain Scalability Solutions',
        description: 'Approaches to solving blockchain scalability challenges.',
        youtubeId: '3xGLc-zz9cA',
        duration: '13:35'
      }
    ]
  },
  {
    id: 8,
    title: 'Crypto Security Essentials',
    description: 'Learn how to secure your digital assets and protect against common threats.',
    icon: <Shield size={24} />,
    category: 'Blockchain',
    totalVideos: 4,
    totalDuration: '53:50', // Added total duration
    videos: [
      {
        id: 'security-1',
        title: 'Wallet Security Best Practices',
        description: 'How to secure your cryptocurrency wallets.',
        youtubeId: 'gJqZVOe3XHU',
        duration: '11:45'
      },
      {
        id: 'security-2',
        title: 'Common Scams and How to Avoid Them',
        description: 'Identifying and avoiding cryptocurrency scams.',
        youtubeId: 'xFQRDlQJl0',
        duration: '14:30'
      },
      {
        id: 'security-3',
        title: 'Private Key Management',
        description: 'Best practices for managing private keys and seed phrases.',
        youtubeId: 'J-yK9iqHn8k',
        duration: '12:15'
      },
      {
        id: 'security-4',
        title: 'Smart Contract Security',
        description: 'Understanding smart contract vulnerabilities and audits.',
        youtubeId: 'M7K71PSZnIE',
        duration: '15:20'
      }
    ]
  }
];

export default blockchainCourses;
