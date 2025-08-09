import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import Landing from "./pages/Landing";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Play from "./pages/Play";
import ProtestRoom from "./pages/ProtestRoom";
import History from "./pages/History";
import Settings from "./pages/Settings";
import GamePlay from "./pages/GamePlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Landing />} />
            
            {/* Game page */}
            <Route path="/game" element={<GamePlay />} />
            
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardHome />} />
            
            {/* Other pages */}
            <Route path="/play" element={<Play />} />
            <Route path="/protestroom" element={<ProtestRoom />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
