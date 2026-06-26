import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { navigateTo } = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      navigateTo('/login');
    }
  }, [user, loading, navigateTo]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-4 bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-[10px] font-extrabold mt-3 animate-pulse uppercase tracking-widest">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
