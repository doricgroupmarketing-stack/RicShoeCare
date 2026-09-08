import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Loader } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import AnalyticsTracker from './components/AnalyticsTracker';

// Lazy Load Public Pages
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const AIAnalysis = lazy(() => import('./pages/AIAnalysis'));
const Contact = lazy(() => import('./pages/Contact'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const ContainerLoadingCalculator = lazy(() => import('./pages/ContainerLoadingCalculator'));

// Lazy Load Admin Pages (Heavy components)
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const PageEditor = lazy(() => import('./pages/admin/PageEditor'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const Marketing = lazy(() => import('./pages/admin/Marketing'));
const AIStudio = lazy(() => import('./pages/admin/AIStudio'));
const SEOPremium = lazy(() => import('./pages/admin/SEOPremium'));
const Settings = lazy(() => import('./pages/admin/Settings'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader className="animate-spin text-primary-600" size={40} />
  </div>
);

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <AnalyticsTracker />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Routes - Split chunk */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<Analytics />} />
               <Route path="dashboard" element={<Analytics />} />
               <Route path="pages" element={<PageEditor />} />
               <Route path="inventory" element={<Inventory />} />
               <Route path="marketing" element={<Marketing />} />
               <Route path="studio" element={<AIStudio />} />
               <Route path="seo" element={<SEOPremium />} />
               <Route path="settings" element={<Settings />} />
            </Route>

            {/* Public Website Routes */}
            <Route path="*" element={
              <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-slate-50">
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/ai-analysis" element={<AIAnalysis />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/calculator" element={<ContainerLoadingCalculator />} />
                    </Routes>
                  </Suspense>
                </main>
                <ChatWidget />
                <Footer />
              </div>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
};

export default App;