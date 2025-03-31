
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLearning } from '../../contexts/LearningContext';
import VideoPlayer from './VideoPlayer';
import CourseNavigation from './CourseNavigation';
import CourseStatistics from './CourseStatistics';
import CourseCatalog from './CourseCatalog';
import CourseProgress from './CourseProgress';
import WelcomeContent from './WelcomeContent';
import { 
  GraduationCap, 
  Search, 
  Filter,
  LogIn,
} from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger 
} from "@/components/ui/drawer";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LearnContent: React.FC = () => {
  const { 
    currentCourse, 
    currentVideo, 
    setCurrentVideo,
    courses,
    getCompletionPercentage,
    userProgress
  } = useLearning();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !activeCategory || course.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = Array.from(new Set(courses.map(course => course.category)));

  // Add event listener for clearing filters
  useEffect(() => {
    const handleClearFilters = () => {
      setSearchTerm('');
      setActiveCategory(null);
    };

    document.addEventListener('clearFilters', handleClearFilters);
    return () => {
      document.removeEventListener('clearFilters', handleClearFilters);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getWelcomeMessage = () => {
    if (user.isAuthenticated) {
      const firstName = user.id.split(' ')[0];
      return `Welcome back, ${firstName}!`;
    }
    
    if (!user.isAuthenticated && currentCourse) {
      return "Your progress is not saved. Log in to track your learning.";
    }
    
    if (!currentCourse) return "Welcome to AdanfoCash Learning Center";
    
    switch (currentCourse.category) {
      case 'DeFi':
        return "Exploring DeFi concepts will enhance your understanding of modern finance";
      case 'Lending':
        return "Master lending strategies to maximize your returns on AdanfoCash";
      case 'Investment':
        return "Smart investment decisions start with proper education";
      case 'ICP':
        return "Discover the power of Internet Computer Protocol for the future web";
      case 'Web3':
        return "Welcome to the decentralized web - the future of the internet";
      case 'Blockchain':
        return "Understanding blockchain is essential for modern financial literacy";
      default:
        return "Expand your knowledge with AdanfoCash learning resources";
    }
  };

  const handleLoginClick = () => {
    navigate('/wallet-connection');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8"
    >
      <motion.div variants={itemVariants} className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center">
              <GraduationCap className="mr-2 md:mr-3" size={isMobile ? 24 : 32} />
              Learning Center
            </h1>
            <div className="text-foreground/70 text-sm md:text-base flex items-center">
              <p>{getWelcomeMessage()}</p>
              
              {!user.isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-xs text-adanfo-blue hover:text-adanfo-purple"
                  onClick={handleLoginClick}
                >
                  <LogIn className="h-3 w-3 mr-1" />
                  Log in
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search courses..." 
                className="pl-10 pr-4 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="px-4 py-6">
                    <h3 className="font-medium mb-4">Filter by Category</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={activeCategory === null ? "default" : "outline"}
                        size="sm" 
                        onClick={() => setActiveCategory(null)}
                      >
                        All
                      </Button>
                      {categories.map(category => (
                        <Button
                          key={category}
                          variant={activeCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> 
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem 
                    className={activeCategory === null ? "bg-accent" : ""}
                    onClick={() => setActiveCategory(null)}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {categories.map(category => (
                    <DropdownMenuItem 
                      key={category}
                      className={activeCategory === category ? "bg-accent" : ""}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <CourseStatistics />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 md:gap-8">
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 order-2 lg:order-1"
        >
          <CourseCatalog 
            filteredCourses={filteredCourses}
            getCompletionPercentage={getCompletionPercentage}
            userProgress={userProgress}
            setCurrentVideo={setCurrentVideo}
            user={user}
            handleLoginClick={handleLoginClick}
          />
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-5 order-1 lg:order-2"
        >
          {currentCourse && currentVideo ? (
            <>
              <VideoPlayer 
                video={currentVideo}
                courseId={currentCourse.id}
              />
              
              {!isMobile && (
                <CourseProgress 
                  currentCourse={currentCourse}
                  currentVideo={currentVideo}
                  getCompletionPercentage={getCompletionPercentage}
                />
              )}
              
              <div className="mt-6">
                <CourseNavigation onSelectVideo={setCurrentVideo} />
              </div>
            </>
          ) : (
            <WelcomeContent 
              courses={courses}
              setCurrentVideo={setCurrentVideo}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LearnContent;
