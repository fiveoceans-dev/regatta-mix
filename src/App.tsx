import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
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
        <Routes>
          {/* Landing page without navbar */}
          <Route path="/" element={<Landing />} />
          
          {/* Game page without navbar */}
          <Route path="/game" element={<GamePlay />} />
          
          {/* All other pages with navbar and sidebar */}
          <Route path="/dashboard" element={
            <div className="min-h-screen bg-background">
              <Navbar />
              <Dashboard />
            </div>
          }>
            <Route index element={<DashboardHome />} />
          </Route>
          
          <Route path="/play" element={
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="container py-0">
                <Play />
              </div>
            </div>
          } />
          
          <Route path="/protestroom" element={
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="container py-0">
                <ProtestRoom />
              </div>
            </div>
          } />
          
          <Route path="/history" element={
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="container py-0">
                <History />
              </div>
            </div>
          } />
          
          <Route path="/settings" element={
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="container py-0">
                <Settings />
              </div>
            </div>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
