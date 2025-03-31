
import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import ParticleBackground from '../../components/shared/ParticleBackground';
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Lock size={32} className="text-primary" />
            </motion.div>
            
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Privacy Policy
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Last updated: June 1, 2023
            </motion.p>
          </div>

          <Card className="border-border/60 shadow-lg backdrop-blur-sm bg-background/60">
            <CardContent className="p-6 md:p-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2>Introduction</h2>
                <p>
                  AdanfoCash ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and use our services, and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                </p>

                <h2>Information We Collect</h2>
                <p>
                  We collect several types of information from and about users of our website, including:
                </p>
                <ul>
                  <li>Personal information such as name, email address, telephone number, and financial information necessary to facilitate lending and borrowing on our platform.</li>
                  <li>Information about your internet connection, the equipment you use to access our website, and usage details.</li>
                  <li>Records and copies of your correspondence with us.</li>
                  <li>Transaction details, including loan applications, lending activities, and repayment history.</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>
                  We use information that we collect about you or that you provide to us:
                </p>
                <ul>
                  <li>To provide you with our services and facilitate lending and borrowing transactions.</li>
                  <li>To process and manage loan applications and repayments.</li>
                  <li>To create and maintain your account and verify your identity.</li>
                  <li>To provide you with notices about your account and services.</li>
                  <li>To improve our website and present its contents to you.</li>
                  <li>To fulfill any other purpose for which you provide it.</li>
                </ul>

                <h2>Information Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, theft, and loss. These measures include encryption, secure data storage, and regular security assessments.
                </p>

                <h2>Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul>
                  <li>The right to access the personal information we hold about you.</li>
                  <li>The right to request correction of inaccurate personal information.</li>
                  <li>The right to request deletion of your personal information in certain circumstances.</li>
                  <li>The right to restrict or object to our processing of your personal information.</li>
                  <li>The right to data portability.</li>
                </ul>

                <h2>Contact Information</h2>
                <p>
                  If you have any questions about this Privacy Policy or our practices, please contact us at:
                </p>
                <p>
                  AdanfoCash<br />
                  123 Finance Street<br />
                  Accra, Ghana<br />
                  Email: privacy@adanfocash.com<br />
                  Phone: +233 123 456 789
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
