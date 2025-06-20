import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from './providers/QueryProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { AppLayout } from './components/layout/AppLayout';
import { LeaderDashboard } from './components/dashboard/LeaderDashboard';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { useAuthStore } from './stores/authStore';
import "./index.css";

function AppRoutes() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <Routes>
        {/* Default route based on user role */}
        <Route
          path="/"
          element={
            <Navigate
              to={user?.role === 'leader' ? '/dashboard' : '/my-tasks'}
              replace
            />
          }
        />

        {/* Leader routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="leader">
              <LeaderDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settlements"
          element={
            <ProtectedRoute requiredRole="leader">
              <div>Settlements Page - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tasks"
          element={
            <ProtectedRoute requiredRole="leader">
              <div>Tasks Management Page - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/players"
          element={
            <ProtectedRoute requiredRole="leader">
              <div>Players Management Page - Coming Soon</div>
            </ProtectedRoute>
          }
        />

        {/* Member routes */}
        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route
          path="*"
          element={
            <Navigate
              to={user?.role === 'leader' ? '/dashboard' : '/my-tasks'}
              replace
            />
          }
        />
      </Routes>
    </AppLayout>
  );
}

export function App() {
  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;
