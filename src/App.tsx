import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/customer/Dashboard";
import NewOrder from "./pages/customer/NewOrder";
import MyOrders from "./pages/customer/MyOrders";
import SingleOrder from "./pages/customer/SingleOrder";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Driver Pages
import DriverLogin from "./pages/driver/DriverLogin";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverOrders from "./pages/driver/DriverOrders";
import DriverSingleOrder from "./pages/driver/DriverSingleOrder";
import DriverRoute from "./pages/driver/DriverRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/driver/login" element={<DriverLogin />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/driver/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <DriverDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders/new" element={
              <ProtectedRoute>
                <Layout>
                  <NewOrder />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout>
                  <MyOrders />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/driver/orders" element={
              <ProtectedRoute>
                <Layout>
                  <DriverOrders />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders/:orderId" element={
              <ProtectedRoute>
                <Layout>
                  <SingleOrder />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/driver/orders/:orderId" element={
              <ProtectedRoute>
                <Layout>
                  <DriverSingleOrder />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/driver/route" element={
              <ProtectedRoute>
                <Layout>
                  <DriverRoute />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
