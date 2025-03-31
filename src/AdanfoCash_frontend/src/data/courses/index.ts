
import { Course, Video } from './types';
import defiCourses from './defi-courses';
import lendingCourses from './lending-courses';
import investmentCourses from './investment-courses';
import icpCourses from './icp-courses';
import web3Courses from './web3-courses';
import blockchainCourses from './blockchain-courses';

// Combine all courses into a single array
const courses: Course[] = [
  ...defiCourses,
  ...lendingCourses,
  ...investmentCourses,
  ...icpCourses,
  ...web3Courses,
  ...blockchainCourses
];

export default courses;
export { defiCourses, lendingCourses, investmentCourses, icpCourses, web3Courses, blockchainCourses };
export type { Course, Video };
