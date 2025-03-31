
import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { Course } from './types';

const investmentCourses: Course[] = [
  {
    id: 3,
    title: 'Investment Strategies',
    description: 'Learn how to build a diversified portfolio with crypto and DeFi investments.',
    icon: <TrendingUp size={24} />,
    category: 'Investment',
    totalVideos: 4,
    totalDuration: '48:50', // Added total duration
    videos: [
      {
        id: 'invest-1',
        title: 'Investment Fundamentals',
        description: 'Basic principles of investing in the digital asset space.',
        youtubeId: 'H-O3r2YMWJ4',
        duration: '10:15'
      },
      {
        id: 'invest-2',
        title: 'Portfolio Diversification',
        description: 'How to spread risk across different crypto assets.',
        youtubeId: '0KmxwV4v1C0',
        duration: '12:30'
      },
      {
        id: 'invest-3',
        title: 'Risk Assessment Methods',
        description: 'Techniques to evaluate investment risks in crypto.',
        youtubeId: 'ClnnLI1qClA',
        duration: '11:45'
      },
      {
        id: 'invest-4',
        title: 'Long-term vs Short-term Strategies',
        description: 'Different timeframes for cryptocurrency investments.',
        youtubeId: 'qFBYB4W2tqU',
        duration: '14:20'
      }
    ]
  },
  {
    id: 10,
    title: 'Crypto Investment Psychology',
    description: 'Understand the psychological aspects of investing in volatile crypto markets.',
    icon: <DollarSign size={24} />,
    category: 'Investment',
    totalVideos: 4,
    totalDuration: '51:50', // Added total duration
    videos: [
      {
        id: 'crypto-psych-1',
        title: 'Managing Emotions in Crypto Trading',
        description: 'How to handle fear, greed, and other emotions when investing.',
        youtubeId: 'qFBYB4W2tqU',
        duration: '11:30'
      },
      {
        id: 'crypto-psych-2',
        title: 'Cognitive Biases in Crypto Investing',
        description: 'Common cognitive biases that affect investment decisions.',
        youtubeId: 'H-O3r2YMWJ4',
        duration: '13:45'
      },
      {
        id: 'crypto-psych-3',
        title: 'Developing a Trading Plan',
        description: 'Creating and sticking to a disciplined investment strategy.',
        youtubeId: 'ClnnLI1qClA',
        duration: '12:20'
      },
      {
        id: 'crypto-psych-4',
        title: 'Dealing with Market Volatility',
        description: 'Psychological strategies for navigating volatile markets.',
        youtubeId: '0KmxwV4v1C0',
        duration: '14:15'
      }
    ]
  }
];

export default investmentCourses;
