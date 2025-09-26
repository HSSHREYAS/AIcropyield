import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FarmingChatbot, ChatbotToggle } from "@/components/FarmingChatbot";
import { AccessibilityFloatingButton } from "@/components/AccessibilityPanel";
import Index from "./pages/Index";
import Predict from "./pages/Predict";
import Results from "./pages/Results";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { pwaManager } from "@/lib/pwa-manager";

const queryClient = new QueryClient();

const App = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    // Initialize PWA features
    pwaManager.init();
    
    // Add ARIA landmarks for screen readers
    document.body.setAttribute('role', 'application');
    document.body.setAttribute('aria-label', 'CropYieldAI - Smart Farming Assistant');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1" role="main" aria-label="Main content">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/predict" element={<Predict />} />
                <Route path="/results" element={<Results />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Farming Chatbot */}
            <FarmingChatbot 
              isOpen={isChatbotOpen} 
              onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
            />
            {!isChatbotOpen && (
              <ChatbotToggle onClick={() => setIsChatbotOpen(true)} />
            )}
            
            {/* Accessibility Features */}
            <AccessibilityFloatingButton />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
