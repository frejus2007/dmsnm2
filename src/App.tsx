import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Episodes from "./pages/Episodes";
import EpisodeDetail from "./pages/EpisodeDetail";
import Auth from "./pages/Auth";
import Participer from "./pages/Participer";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEpisodes from "./pages/admin/AdminEpisodes";
import AdminComments from "./pages/admin/AdminComments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminParticipations from "./pages/admin/AdminParticipations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/episode/:id" element={<EpisodeDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/participer" element={<Participer />} />
            <Route path="/profil" element={<Profile />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/episodes" element={<AdminEpisodes />} />
            <Route path="/admin/commentaires" element={<AdminComments />} />
            <Route path="/admin/utilisateurs" element={<AdminUsers />} />
            <Route path="/admin/participations" element={<AdminParticipations />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
