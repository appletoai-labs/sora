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
import { ChatInterface } from '@/components/chat';
import { ImmediateSupport } from './components/imediateSupport';
import Layout from '@/components/layout';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import Clarity from './components/dashboard/tools/clarity';
import DailyCheckin from './components/dashboard/tools/dailycheckin';
import Sensory from './components/dashboard/tools/sensory';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Goals from './components/dashboard/tools/goals';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <AuthProvider>
                    <div className="min-h-screen bg-background text-foreground">
                        <Routes>

                            <Route element={<Layout />}>
                                <Route path="/" element={<Index />} />
                                <Route path="/chat" element={<ChatInterface />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/immediate-support" element={<ImmediateSupport />} />
                            </Route>

                            <Route element={<Layout />}>
                                <Route path="/auth" element={<Auth />} />
                                <Route path="/verify-email" element={<VerifyEmail />} />
                            </Route>

                            <Route
                                path="/app"
                                element={
                                    <ProtectedRoute >
                                        <DashboardLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<DashboardHome />} />
                                <Route path="chat" element={<ChatInterface />} />
                                <Route path="immediate-support" element={<ImmediateSupport />} />
                                <Route path="clarity" element={<Clarity />} />
                                <Route path="logs" element={<div>Clarity Logs Coming Soon</div>} />
                                <Route path="checkin" element={<DailyCheckin />} />
                                <Route path="sensory" element={<Sensory />} />
                                <Route path="goals" element={<Goals/>} />
                                <Route path="executive" element={<div>Executive Function Coming Soon</div>} />
                                <Route path="community" element={<div>Community Coming Soon</div>} />
                                <Route path="dashboard" element={<div>dashboard Coming Soon</div>} />
                                <Route path="reallife" element={<div>real life Coming Soon</div>} />
                                <Route path="emotional-support" element={<div>emotional support Coming Soon</div>} />
                                <Route path="crisis-support" element={<div>crisis support Coming Soon</div>} />
                            </Route>



                            <Route path="/404" element={<NotFound />} />
                            <Route path="*" element={<Navigate to="/404" replace />} />
                        </Routes>
                    </div>
                </AuthProvider>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
