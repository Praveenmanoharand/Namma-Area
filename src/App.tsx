import React, { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './router';
import { PhoneFrame } from './components/PhoneFrame';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { NavigationDrawer } from './components/NavigationDrawer';
import { initDB } from './db';
import { handleGoogleRedirectResult } from './services/auth.service';

// Views
import { HomeView } from './views/HomeView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { DashboardView } from './views/DashboardView';
import { CreateComplaintView } from './views/CreateComplaintView';
import { ComplaintFeedView } from './views/ComplaintFeedView';
import { ComplaintDetailsView } from './views/ComplaintDetailsView';
import { ProfileView } from './views/ProfileView';
import { SuccessView } from './views/SuccessView';
import { LostFoundView } from './views/LostFoundView';
import { JobsView } from './views/JobsView';
import { PollsView } from './views/PollsView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { EmergencyView } from './views/EmergencyView';

// Added new views for the menu items
import { BloodDonorsView } from './views/BloodDonorsView';
import { AlertsView } from './views/AlertsView';
import { HelpersView } from './views/HelpersView';
import { MarketplaceView } from './views/MarketplaceView';
import { SettingsView } from './views/SettingsView';
import { HelpView } from './views/HelpView';
import { AboutView } from './views/AboutView';

// Added extended civic views
import { NotificationsView } from './views/NotificationsView';
import { MyAreaView } from './views/MyAreaView';
import { SuggestionsView } from './views/SuggestionsView';
import { VolunteersView } from './views/VolunteersView';
import { GroupsView } from './views/GroupsView';
import { ImpactView } from './views/ImpactView';
import { LeaderboardView } from './views/LeaderboardView';
import { WardView } from './views/WardView';
import { initExtendedDB } from './db_extended';
import { ProtectedRoute } from './components/ProtectedRoute';

import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { path, navigateTo } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize database on startup + handle Google redirect result
  useEffect(() => {
    initDB();
    initExtendedDB();
    // Handle redirect result if user was redirected back from Google Sign-In
    handleGoogleRedirectResult().then(user => {
      if (user) {
        navigateTo('/dashboard');
      }
    }).catch(console.error);
  }, []);

  // Determine which view to render based on path
  const renderActiveView = () => {
    if (path === '/') return <HomeView />;
    if (path === '/login') return <LoginView />;
    if (path === '/register') return <RegisterView />;
    if (path === '/dashboard') return <ProtectedRoute><DashboardView /></ProtectedRoute>;
    if (path === '/create') return <ProtectedRoute><CreateComplaintView /></ProtectedRoute>;
    if (path === '/complaints') return <ProtectedRoute><ComplaintFeedView /></ProtectedRoute>;
    if (path.startsWith('/complaints/')) return <ProtectedRoute><ComplaintDetailsView /></ProtectedRoute>;
    if (path === '/profile') return <ProtectedRoute><ProfileView /></ProtectedRoute>;
    if (path === '/success') return <ProtectedRoute><SuccessView /></ProtectedRoute>;
    if (path === '/lost-found') return <ProtectedRoute><LostFoundView /></ProtectedRoute>;
    if (path === '/jobs') return <ProtectedRoute><JobsView /></ProtectedRoute>;
    if (path === '/polls') return <ProtectedRoute><PollsView /></ProtectedRoute>;
    if (path === '/announcements') return <ProtectedRoute><AnnouncementsView /></ProtectedRoute>;
    if (path === '/emergency') return <ProtectedRoute><EmergencyView /></ProtectedRoute>;
    
    // Added routes for new menu views
    if (path === '/blood-donors') return <ProtectedRoute><BloodDonorsView /></ProtectedRoute>;
    if (path === '/alerts') return <ProtectedRoute><AlertsView /></ProtectedRoute>;
    if (path === '/helpers') return <ProtectedRoute><HelpersView /></ProtectedRoute>;
    if (path === '/marketplace') return <ProtectedRoute><MarketplaceView /></ProtectedRoute>;
    if (path === '/settings') return <ProtectedRoute><SettingsView /></ProtectedRoute>;
    if (path === '/help') return <ProtectedRoute><HelpView /></ProtectedRoute>;
    if (path === '/about') return <ProtectedRoute><AboutView /></ProtectedRoute>;
    
    // Added routes for extended civic views
    if (path === '/notifications') return <ProtectedRoute><NotificationsView /></ProtectedRoute>;
    if (path === '/my-area') return <ProtectedRoute><MyAreaView /></ProtectedRoute>;
    if (path === '/suggestions') return <ProtectedRoute><SuggestionsView /></ProtectedRoute>;
    if (path === '/volunteers') return <ProtectedRoute><VolunteersView /></ProtectedRoute>;
    if (path === '/groups') return <ProtectedRoute><GroupsView /></ProtectedRoute>;
    if (path === '/impact') return <ProtectedRoute><ImpactView /></ProtectedRoute>;
    if (path === '/leaderboard') return <ProtectedRoute><LeaderboardView /></ProtectedRoute>;
    if (path === '/ward') return <ProtectedRoute><WardView /></ProtectedRoute>;
    
    // Default fallback
    return <HomeView />;
  };

  // Selective layout elements
  const isAuthScreen = path === '/login' || path === '/register';
  const isSuccessScreen = path === '/success';
  const shouldShowNav = !isAuthScreen && !isSuccessScreen;

  return (
    <PhoneFrame>
      {/* Persistent top bar header */}
      {shouldShowNav && <Header onMenuClick={() => setIsMenuOpen(true)} />}

      {/* Primary viewport with lightweight fade page transitions */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc] relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent bottom tabs navigation bar */}
      {shouldShowNav && <BottomNavigation />}

      {/* Slide-in Mobile Navigation Drawer */}
      <NavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </PhoneFrame>
  );
};

import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
