import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import InterviewHistory from "./pages/InterviewHistory";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
}

// Only staff users can access this route
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.isStaff)   return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"                   element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login"              element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup"             element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/dashboard"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/interview/:roleId"  element={<ProtectedRoute><Interview /></ProtectedRoute>} />
            <Route path="/results/:sessionId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/history"            element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
            <Route path="/admin"              element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="*"                   element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;