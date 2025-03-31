
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { 
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart,
  Search,
  Filter
} from 'lucide-react';
import ParticleBackground from '../components/shared/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  // Mockup data
  const adminStats = {
    totalUsers: 256,
    pendingVerifications: 15,
    activeLoans: 87,
    disputesOpen: 3
  };
  
  const verificationRequests = [
    {
      id: 1,
      user: 'James Wilson',
      type: 'borrower',
      date: '2023-10-15',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Emma Lee',
      type: 'lender',
      date: '2023-10-14',
      status: 'pending'
    },
    {
      id: 3,
      user: 'Marcus Johnson',
      type: 'borrower',
      date: '2023-10-12',
      status: 'approved'
    },
    {
      id: 4,
      user: 'Sophia Chen',
      type: 'lender',
      date: '2023-10-10',
      status: 'rejected'
    }
  ];
  
  // Filter verification requests based on selected tab
  const filteredRequests = verificationRequests.filter(request => {
    if (selectedTab === 'pending') return request.status === 'pending';
    if (selectedTab === 'approved') return request.status === 'approved';
    if (selectedTab === 'rejected') return request.status === 'rejected';
    return true;
  });
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Animation variants
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <ParticleBackground />
        
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
                <p className="text-foreground/70">Manage users, verifications and monitor platform activity</p>
              </motion.div>
              
              {/* Admin Stats Overview */}
              <motion.div variants={itemVariants} className="mb-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Platform Overview</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { 
                        title: 'Total Users', 
                        value: adminStats.totalUsers, 
                        icon: <Users size={20} className="text-adanfo-blue" />,
                        change: '+12 this week'
                      },
                      { 
                        title: 'Pending Verifications', 
                        value: adminStats.pendingVerifications, 
                        icon: <Shield size={20} className="text-adanfo-purple" />,
                        change: '5 new today'
                      },
                      { 
                        title: 'Active Loans', 
                        value: adminStats.activeLoans, 
                        icon: <BarChart size={20} className="text-adanfo-green" />,
                        change: '+3 since yesterday'
                      },
                      { 
                        title: 'Open Disputes', 
                        value: adminStats.disputesOpen, 
                        icon: <AlertTriangle size={20} className="text-adanfo-orange" />,
                        change: '1 requires urgent attention'
                      }
                    ].map((stat, index) => (
                      <div 
                        key={index} 
                        className="bg-secondary/40 dark:bg-secondary/30 rounded-xl p-4 backdrop-blur-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-foreground/70">{stat.title}</p>
                          <div className="p-2 rounded-full bg-background/60">
                            {stat.icon}
                          </div>
                        </div>
                        <p className="text-2xl font-semibold mb-1">{stat.value}</p>
                        <p className="text-xs text-foreground/60">{stat.change}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
              
              {/* Verification Requests */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">User Verification Requests</h2>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter size={14} />
                        <span>Filter</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Search size={14} />
                        <span>Search</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(["pending", "approved", "rejected"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedTab(filter)}
                        className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedTab === filter
                            ? 'bg-adanfo-blue text-white'
                            : 'bg-secondary/50 hover:bg-secondary/80'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  {/* Verification Requests List */}
                  <div className="space-y-4">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <div
                          key={request.id}
                          className="border border-border rounded-lg p-4 hover:border-adanfo-blue/30 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="font-medium">{request.user}</span>
                                <span className={`ml-3 px-2 py-0.5 text-xs rounded ${getStatusColor(request.status)}`}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                              </div>
                              
                              <p className="text-sm text-foreground/70 mb-2">
                                {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Application · {new Date(request.date).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {request.status === 'pending' && (
                                <>
                                  <Button variant="default" size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                                    <CheckCircle size={14} />
                                    <span>Approve</span>
                                  </Button>
                                  <Button variant="destructive" size="sm" className="gap-1">
                                    <XCircle size={14} />
                                    <span>Reject</span>
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-foreground/70">No verification requests match your filter</p>
                        <Button 
                          variant="link" 
                          onClick={() => setSelectedTab('pending')}
                          className="mt-2"
                        >
                          Show pending requests
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
