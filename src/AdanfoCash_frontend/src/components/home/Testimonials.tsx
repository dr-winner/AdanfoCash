import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  type: 'borrower' | 'lender';
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "AdanfoCash funded my education when traditional banks wouldn't even look at my application. The process was incredibly fast and transparent.",
    author: "Sarah Johnson",
    role: "Computer Science Student",
    type: "borrower"
  },
  {
    id: 2,
    content: "I've been lending on AdanfoCash for six months, and the returns are consistently higher than any other platform I've used. The smart contract security gives me peace of mind.",
    author: "Michael Chen",
    role: "Crypto Investor",
    type: "lender"
  },
  {
    id: 3,
    content: "The immediate funding helped me pay for my textbooks and laptop when I needed them most. The interest rates are fair, and the repayment schedule is flexible.",
    author: "Amara Okafor",
    role: "Engineering Student",
    type: "borrower"
  },
  {
    id: 4,
    content: "As someone who wants to support education, AdanfoCash allows me to directly help students while earning a great return on my investment. It's a win-win.",
    author: "Daniel Rodriguez",
    role: "Passive Income Investor",
    type: "lender"
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = window.setInterval(() => {
        nextTestimonial();
      }, 6000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);
  
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };
  
  const currentTestimonial = testimonials[currentIndex];
  
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <motion.div 
        className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-adanfo-blue/10 blur-3xl -z-10"
        animate={{ 
          x: [0, 40, 0],
          y: [0, 20, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-adanfo-purple/10 blur-3xl -z-10"
        animate={{ 
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
        </div>
        
        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative overflow-hidden h-[300px] sm:h-[250px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full"
              >
                <Card 
                  className="p-8 max-w-3xl mx-auto glass-card"
                >
                  <Quote className="h-10 w-10 text-adanfo-blue/30 mb-4" />
                  <blockquote className="mb-6 text-lg italic">
                    "{currentTestimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{currentTestimonial.author}</p>
                      <p className="text-sm text-foreground/70">{currentTestimonial.role}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-adanfo-blue/10 text-adanfo-blue text-xs font-medium">
                      {currentTestimonial.type === 'borrower' ? 'Borrower' : 'Lender'}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-adanfo-blue w-4' : 'bg-foreground/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
