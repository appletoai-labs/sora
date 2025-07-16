import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import AppDashboard from './pages/AppDashboard';
import VerifyEmail from './pages/VerifyEmail';
import Privacy from './pages/Privacy';
import { ChatInterface } from '@/components/chat/index';
import Layout from '@/components/layout';
const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/app" element={<AppDashboard />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/chat" element={<ChatInterface />} />
                    </Route>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
