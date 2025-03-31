
import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import ParticleBackground from '../../components/shared/ParticleBackground';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "General Questions",
    items: [
      {
        question: "What is AdanfoCash?",
        answer: "AdanfoCash is a decentralized lending platform that connects borrowers with lenders in a secure, transparent environment powered by blockchain technology. Our platform enables users to access loans without traditional banking intermediaries."
      },
      {
        question: "How does AdanfoCash ensure security?",
        answer: "AdanfoCash leverages Internet Computer Protocol (ICP) blockchain technology to ensure all transactions are secure, transparent, and immutable. We use smart contracts to automate lending processes, eliminating the need for third-party intermediaries and reducing the risk of fraud."
      },
      {
        question: "Who can use AdanfoCash?",
        answer: "AdanfoCash is available to anyone with an Internet Identity. We currently serve users in Ghana and neighboring countries, with plans to expand across Africa."
      },
      {
        question: "What are the fees for using AdanfoCash?",
        answer: "AdanfoCash charges a small platform fee of 0.5% on all successful loan matchings. There are no hidden fees or charges."
      }
    ]
  },
  {
    title: "Borrower Information",
    items: [
      {
        question: "How can I apply for a loan on AdanfoCash?",
        answer: "To apply for a loan, you need to create an account, complete the verification process, and submit a loan request specifying the amount, purpose, and repayment timeline. Our system will match you with potential lenders based on your profile and loan parameters."
      },
      {
        question: "What loan amounts can I request?",
        answer: "AdanfoCash supports loans ranging from 100 GHS to 10,000 GHS, with flexible repayment terms from 1 month to 12 months."
      },
      {
        question: "How is my creditworthiness determined?",
        answer: "AdanfoCash uses a combination of traditional credit scoring and innovative alternative data points such as mobile money transaction history, utility bill payments, and social connections to assess creditworthiness."
      },
      {
        question: "What happens if I can't repay my loan on time?",
        answer: "We understand that unforeseen circumstances can affect your ability to repay. Contact us immediately if you anticipate repayment difficulties, and we'll work with you to adjust your repayment plan. Late payments may affect your credit score and future borrowing ability on the platform."
      }
    ]
  },
  {
    title: "Lender Information",
    items: [
      {
        question: "How do I start lending on AdanfoCash?",
        answer: "To become a lender, create an account, complete the verification process, and deposit funds into your AdanfoCash wallet. You can then browse loan requests and decide which ones to fund based on risk profiles and interest rates."
      },
      {
        question: "What returns can I expect as a lender?",
        answer: "Lenders can typically earn annual returns between 8% and 15%, depending on the risk profile of the loans they choose to fund. Higher-risk loans generally offer higher interest rates."
      },
      {
        question: "How is my investment protected?",
        answer: "AdanfoCash implements several safeguards including escrow mechanisms, insurance for certain loan categories, and a reserve fund to cover potential defaults. Additionally, our rigorous borrower verification and credit assessment minimize default risks."
      },
      {
        question: "Can I withdraw my funds at any time?",
        answer: "Funds that have not been allocated to loans can be withdrawn at any time. Funds that are currently invested in active loans will become available as borrowers make repayments."
      }
    ]
  },
  {
    title: "Technical Support",
    items: [
      {
        question: "I'm having trouble connecting my wallet. What should I do?",
        answer: "First, ensure you have an Internet Identity set up. If you're still experiencing issues, clear your browser cache and try again. For persistent problems, contact our support team via the 'Help' section of your account dashboard."
      },
      {
        question: "How do I update my personal information?",
        answer: "Log in to your account, navigate to 'Profile Settings', and select 'Edit Profile' to update your personal information. Some changes may require re-verification for security purposes."
      },
      {
        question: "Is there a mobile app available?",
        answer: "We're currently developing mobile applications for both Android and iOS. In the meantime, our website is fully responsive and works well on mobile devices."
      },
      {
        question: "What should I do if I suspect fraudulent activity on my account?",
        answer: "If you notice any suspicious activity, immediately contact our security team at security@adanfocash.com or use the emergency contact form in your account dashboard. We recommend changing your password immediately."
      }
    ]
  }
];

const FAQPage: React.FC = () => {
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
              <HelpCircle size={32} className="text-primary" />
            </motion.div>
            
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Frequently Asked Questions
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Find answers to common questions about AdanfoCash. If you can't find what you're looking for,
              feel free to contact our support team.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {faqData.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="border-border/60 shadow-lg backdrop-blur-sm bg-background/60">
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>
                      Common questions about {category.title.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-4 text-muted-foreground">
                              {item.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
