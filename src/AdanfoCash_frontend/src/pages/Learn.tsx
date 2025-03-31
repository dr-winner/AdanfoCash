
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ParticleBackground from '../components/shared/ParticleBackground';
import { LearningProvider } from '../contexts/LearningContext';
import LearnContent from '../components/learning/LearnContent';

const Learn: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <ParticleBackground />
        
        <LearningProvider>
          <LearnContent />
        </LearningProvider>
      </main>
      
      <Footer />
    </div>
  );
};

export default Learn;
