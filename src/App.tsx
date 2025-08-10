import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Play from "./pages/Play";
import Marketplace from "./pages/Marketplace";
import ProtestRoom from "./pages/ProtestRoom";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import GamePlay from "./pages/GamePlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/game') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
            {/* Landing page */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth page */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Game page */}
            <Route path="/game" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
            
            {/* Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
            
            {/* Other pages */}
            <Route path="/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
            <Route path="/protestroom" element={<ProtectedRoute><ProtestRoom /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/Account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
