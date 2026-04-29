import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HelmetProvider, Helmet } from 'react-helmet-async';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import MedicineDetail from './pages/MedicineDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import UploadPrescription from './pages/UploadPrescription';
import Profile from './pages/Profile';
import HealthVault from './pages/HealthVault';
import SubscriptionHub from './pages/SubscriptionHub';
import Offers from './pages/Offers';
import UpiPayment from './pages/UpiPayment';
import NotFound from './pages/NotFound';
import Companies from './pages/Companies';
import CompanyDetailUser from './pages/CompanyDetail';
import CompanyProductUser from './pages/CompanyProduct';
import MaintenanceMode from './pages/MaintenanceMode';
import { settingService } from './services/api';

// Final High-Fidelity Admin Components
import AdminLayout from './admin/components/layout/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import Medicines from './admin/pages/Medicines';
import MedicineFormPage from './admin/pages/MedicineFormPage';
import CategoryManagement from './admin/pages/CategoryManagement';
import CategoryReorder from './admin/pages/CategoryReorder';
import InventoryManagement from './admin/pages/InventoryManagement';
import StockMovements from './admin/pages/StockMovements';
import ExpiryTracker from './admin/pages/ExpiryTracker';
import BulkImport from './admin/pages/BulkImport';
import OrderManagement from './admin/pages/OrderManagement';
import PrescriptionManagement from './admin/pages/PrescriptionManagement';
import WebsiteCMS from './admin/pages/WebsiteCMS';
import SEOSettings from './admin/pages/SEOSettings';
import RiderManagement from './admin/pages/Riders';
import DeliveryZones from './admin/pages/DeliveryZones';
import PricingManager from './admin/pages/PricingManager';
import Analytics from './admin/pages/Analytics';
import Customers from './admin/pages/Customers';
import ActivityLog from './admin/pages/ActivityLog';
import MediaLibrary from './admin/pages/MediaLibrary';
import Notifications from './admin/pages/Notifications';
import Settings from './admin/pages/Settings';
import AdminUsers from './admin/pages/AdminUsers';
import TrashCenter from './admin/pages/TrashCenter';
import Reviews from './admin/pages/Reviews';
import OfferManagement from './admin/pages/OfferManagement';
import PaymentControl from './admin/pages/PaymentControl';
import SupportChat from './admin/pages/SupportChat';
import SupportTickets from './admin/pages/SupportTickets';
import CompaniesIndex from './admin/pages/companies/CompaniesIndex';
import CompanyForm from './admin/pages/companies/CompanyForm';
import CompanyDetail from './admin/pages/companies/CompanyDetail';
import CompanyProductForm from './admin/pages/companies/CompanyProductForm';
import CompanyCategoriesAll from './admin/pages/companies/CompanyCategoriesAll';
import CompanyProductsAll from './admin/pages/companies/CompanyProductsAll';
import PagePlaceholder from './admin/components/ui/PagePlaceholder';
import CompanyHub from './admin/pages/CompanyHub';

// Rider Pages
import RiderLayout from './components/layout/RiderLayout';
import RiderDashboard from './pages/rider/Dashboard';
import NavigationMap from './pages/rider/NavigationMap';
import { SocketProvider } from './providers/SocketProvider';
import AnalyticsTracker from './components/common/AnalyticsTracker';

import { useAuthStore } from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!isAuthenticated) {
    const isAdminRoute = location.pathname.startsWith('/admin');
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Maintenance Guard
const MaintenanceGuard = ({ children }) => {
  const [isActive, setIsActive] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await settingService.getSettings();
        // API returns { success, settings } — not wrapped in .data
        const settings = response.data?.settings || response.data?.data?.settings;
        if (settings) {
          setIsActive(settings.is_active !== false);
        }
      } catch (error) {
        console.error('Status check failed');
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-6">
      <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold text-neutral-900">Synchronizing Health Node...</h2>
        <p className="text-sm text-neutral-400 font-medium">Verifying Clinical Protocols</p>
      </div>
    </div>
  );
  if (!isActive && !location.pathname.startsWith('/admin')) {
    return <MaintenanceMode />;
  }

  return children;
};

// Page Wrapper for premium motion transitions
const PageWrapper = ({ children }) => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
      className="min-h-[calc(100vh-64px)] bg-white"
    >
      {children}
    </motion.div>
  );
};

import UserLayout from './components/layout/UserLayout';

const App = () => {
  const { getMe } = useAuthStore();
  
  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Helmet>
          <title>MediCheap | Genuine Medicines. Honest Prices.</title>
          <meta name="description" content="Order genuine medicines at honest prices with MediCheap. Same-day delivery from licensed pharmacies." />
        </Helmet>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000, className: 'font-body font-bold text-sm' }} />
        
        <div className="min-h-screen bg-white flex flex-col">
          <SocketProvider>
            <AnimatePresence mode="wait">
            <Routes>
              {/* Admin Panel Routes (Highest Priority) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="activity" element={<ActivityLog />} />
                
                <Route path="medicines">
                  <Route index element={<Medicines />} />
                  <Route path="add" element={<MedicineFormPage />} />
                  <Route path=":id/edit" element={<MedicineFormPage />} />
                  <Route path="import" element={<BulkImport />} />
                  <Route path="trash" element={<TrashCenter />} />
                </Route>

                <Route path="categories">
                  <Route index element={<CategoryManagement />} />
                  <Route path="order" element={<CategoryReorder />} />
                  <Route path="trash" element={<TrashCenter />} />
                </Route>

                <Route path="inventory">
                  <Route index element={<InventoryManagement />} />
                  <Route path="movements" element={<StockMovements />} />
                  <Route path="expiry" element={<ExpiryTracker />} />
                </Route>

                <Route path="media" element={<MediaLibrary />} />
                <Route path="pricing" element={<PricingManager />} />

                <Route path="companies">
                  <Route index element={<CompaniesIndex />} />
                  <Route path="add" element={<CompanyForm />} />
                  <Route path=":id" element={<CompanyDetail />} />
                  <Route path=":id/edit" element={<CompanyForm />} />
                  <Route path=":companyId/products/add" element={<CompanyProductForm />} />
                  <Route path=":companyId/products/:id/edit" element={<CompanyProductForm />} />
                </Route>
                <Route path="company-categories" element={<CompanyCategoriesAll />} />
                <Route path="company-products" element={<CompanyProductsAll />} />
                <Route path="company-hub" element={<CompanyHub />} />

                <Route path="orders">
                  <Route index element={<OrderManagement />} />
                  <Route path="rx" element={<PrescriptionManagement />} />
                </Route>

                <Route path="prescriptions" element={<PrescriptionManagement />} />
                <Route path="reviews" element={<Reviews />} />
                
                <Route path="customers" element={<Customers />} />
                <Route path="payments" element={<PaymentControl />} />
                <Route path="delivery" element={<RiderManagement />} />
                <Route path="website" element={<WebsiteCMS />} />
                <Route path="offers" element={<OfferManagement />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="chat" element={<SupportChat />} />
                <Route path="tickets" element={<SupportTickets />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>

              {/* Rider Routes */}
              <Route path="/rider" element={<ProtectedRoute roles={['rider']}><RiderLayout /></ProtectedRoute>}>
                <Route index element={<RiderDashboard />} />
                <Route path="map" element={<NavigationMap />} />
              </Route>

              {/* 🏥 CLINICAL USER TERMINAL (Unified Layout) */}
              <Route element={<UserLayout />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/health-vault" element={<HealthVault />} />
                <Route path="/subscriptions" element={<SubscriptionHub />} />
              </Route>

              {/* Customer Facing Routes (General) */}
              <Route element={<MaintenanceGuard><Navbar /><PageWrapper><Outlet /></PageWrapper><MobileBottomNav /><Footer /></MaintenanceGuard>}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/medicine/:id" element={<MedicineDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/payment/upi/:orderId" element={<ProtectedRoute><UpiPayment /></ProtectedRoute>} />
                <Route path="/track/:id" element={<TrackOrder />} />
                <Route path="/upload-prescription" element={<UploadPrescription />} />
                <Route path="/offers" element={<Offers />} />
                
                <Route path="/company-product/:id" element={<CompanyProductUser />} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AnimatePresence>
          </SocketProvider>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
