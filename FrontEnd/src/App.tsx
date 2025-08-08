// App.tsx
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import AppDashboard from './pages/AppDashboard';
import VerifyEmail from './pages/VerifyEmail';
import Privacy from './pages/Privacy';
import Subscription from './pages/subscription';

import { ChatInterface } from '@/components/chat';
import { Trialchat } from '@/components/chat/trial';
import { ImmediateSupport } from './components/imediateSupport';
import Layout from '@/components/layout';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import Clarity from './components/dashboard/tools/clarity';
import DailyCheckin from './components/dashboard/tools/dailycheckin';
import Sensory from './components/dashboard/tools/sensory';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Goals from './components/dashboard/tools/goals';
import Dashboard from './components/dashboard/tools/dashboard';
import EmotionalSupport from './components/dashboard/tools/emotionalSupport';
import Community from './components/dashboard/tools/community';
import Executive from './components/dashboard/tools/executive';
import RealLifeMode from './components/dashboard/tools/reallife';
import Research from './components/dashboard/tools/research';
import LearnMore from './components/learn-more';

import { UiPreferencesProvider } from '@/context/UiPreferencesContext';
import { AppWrapper } from './layout/AppWrapper';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UiPreferencesProvider>
            <AppWrapper>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/immediate-support" element={<ImmediateSupport />} />

                  <Route path="/learn-more" element={<LearnMore/>} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route
                    path="/chattrials"
                    element={
                      <ProtectedRoute>
                        <Trialchat />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route element={<Layout />}>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>

                <Route
                  path="/app"
                  element={
                    <ProtectedRoute requirePremium>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="chat" element={<ChatInterface />} />
                  <Route path="immediate-support" element={<ImmediateSupport />} />
                  <Route path="research" element={<Research/>} />
                  <Route path="clarity" element={<Clarity />} />
                  <Route path="checkin" element={<DailyCheckin />} />
                  <Route path="sensory" element={<Sensory />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="executive" element={<Executive />} />
                  <Route path="community" element={<Community />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="reallife" element={<RealLifeMode />} />
                  <Route path="emotional-support" element={<EmotionalSupport />} />
                  <Route path="crisis-support" element={<ImmediateSupport />} />
                </Route>

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AppWrapper>
          </UiPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
