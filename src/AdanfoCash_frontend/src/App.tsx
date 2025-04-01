
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import BorrowerDashboard from "./pages/BorrowerDashboard";
import LenderDashboard from "./pages/LenderDashboard";
import BorrowerRegistration from "./pages/BorrowerRegistration";
import LenderRegistration from "./pages/LenderRegistration";
import WalletConnection from "./pages/WalletConnection";
import NotFound from "./pages/NotFound";

// Import resource and legal pages
import ResourcesPage from "./pages/Resources";
import FAQPage from "./pages/resources/FAQ";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";

// Create QueryClient outside of the component to avoid re-creation on renders
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/wallet-connection" element={<WalletConnection />} />
                  <Route path="/borrower-registration" element={<BorrowerRegistration />} />
                  <Route path="/lender-registration" element={<LenderRegistration />} />
                  
                  {/* Resource and legal pages */}
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/resources/faq" element={<FAQPage />} />
                  <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/borrower-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['borrower']}>
                        <BorrowerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/lender-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['lender']}>
                        <LenderDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
