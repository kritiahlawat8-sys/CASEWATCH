import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Scale } from 'lucide-react';

const ProtectedRoute = ({ children, guestOnly = false }) => {
  const { user, loading } = useAuth();

  // Show a beautiful loading screen while restoring session
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#101B33] flex flex-col items-center justify-center text-[#fdfbf7]">
        <div className="flex flex-col items-center gap-4 text-center select-none">
          <div className="bg-[#1B2A4A] p-5 rounded-2xl border border-[#a67c52]/30 shadow-xl flex items-center justify-center animate-pulse">
            <Scale className="h-12 w-12 text-[#a67c52] stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#fdfbf7] mt-2">
            Loading CaseWatch...
          </h2>
          <span className="text-xs text-[#a67c52] tracking-wider uppercase font-semibold">
            Verifying secure credentials
          </span>
        </div>
      </div>
    );
  }

  if (guestOnly) {
    // If user is already logged in, redirect them to the dashboard
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  // If user is not logged in, redirect them to the login screen
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
