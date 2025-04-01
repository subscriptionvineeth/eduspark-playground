import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reading from "./pages/Reading";
import Drawing from "./pages/Drawing";
import MathGames from "./pages/Math";
import Science from "./pages/Science";
import Stories from "./pages/Stories";
import Puzzles from "./pages/Puzzles";
import Music from "./pages/Music";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="pb-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reading" element={<Reading />} />
              <Route path="/drawing" element={<Drawing />} />
              <Route path="/math" element={<MathGames />} />
              <Route path="/science" element={<Science />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/puzzles" element={<Puzzles />} />
              <Route path="/music" element={<Music />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </div>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
