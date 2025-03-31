
import React from 'react';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/shared/ParticleBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, HelpCircle, Users, BookOpen } from 'lucide-react';

type ResourceCategory = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: Array<{
    title: string;
    description: string;
    path: string;
  }>;
};

const resourceCategories: ResourceCategory[] = [
  {
    id: "faq",
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about AdanfoCash",
    icon: <HelpCircle size={24} className="text-adanfo-blue" />,
    items: [
      {
        title: "General Questions",
        description: "Basic questions about our platform and services",
        path: "/resources/faq",
      },
      {
        title: "Borrowing",
        description: "Questions related to borrowing on AdanfoCash",
        path: "/resources/faq/borrowing",
      },
      {
        title: "Lending",
        description: "Questions related to lending on AdanfoCash",
        path: "/resources/faq/lending",
      },
    ],
  },
  {
    id: "blog",
    title: "Blog",
    description: "Latest news, updates, and financial insights",
    icon: <FileText size={24} className="text-adanfo-purple" />,
    items: [
      {
        title: "Latest Articles",
        description: "Recent posts from our team",
        path: "/resources/blog",
      },
      {
        title: "Financial Literacy",
        description: "Learn about financial concepts and strategies",
        path: "/resources/blog/financial-literacy",
      },
      {
        title: "Platform Updates",
        description: "Stay informed about new features and improvements",
        path: "/resources/blog/updates",
      },
    ],
  },
  {
    id: "docs",
    title: "Documentation",
    description: "Detailed guides and technical documentation",
    icon: <BookOpen size={24} className="text-green-500" />,
    items: [
      {
        title: "Getting Started",
        description: "Basic guides to start using AdanfoCash",
        path: "/resources/docs",
      },
      {
        title: "API References",
        description: "Technical documentation for developers",
        path: "/resources/docs/api",
      },
      {
        title: "Security",
        description: "Learn about our security practices",
        path: "/resources/docs/security",
      },
    ],
  },
  {
    id: "community",
    title: "Community",
    description: "Join the AdanfoCash community and connect with others",
    icon: <Users size={24} className="text-amber-500" />,
    items: [
      {
        title: "Forums",
        description: "Discuss with other users and our team",
        path: "/resources/community",
      },
      {
        title: "Events",
        description: "Upcoming webinars and community events",
        path: "/resources/community/events",
      },
      {
        title: "Success Stories",
        description: "Real stories from our users",
        path: "/resources/community/stories",
      },
    ],
  },
];

const ResourcesPage: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'faq';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <ParticleBackground />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              AdanfoCash Resources
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Explore our comprehensive resources to learn more about AdanfoCash, find answers to your questions,
              and connect with our growing community.
            </motion.p>
          </div>

          <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-background/60">
            <CardHeader>
              <CardTitle>Browse Resources</CardTitle>
              <CardDescription>
                Select a category to explore related resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={currentTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  {resourceCategories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-2"
                    >
                      {category.icon}
                      <span className="hidden sm:inline">{category.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {resourceCategories.map(category => (
                  <TabsContent key={category.id} value={category.id}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {category.items.map((item, index) => (
                        <Link to={item.path} key={index}>
                          <Card className="h-full border-border/40 transition-all hover:border-primary/50 hover:shadow-md">
                            <CardHeader>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResourcesPage;
