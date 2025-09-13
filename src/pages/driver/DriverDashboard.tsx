import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Package, Route } from 'lucide-react';
import { DriverStats } from '@/components/driver/DriverStats';
import { AssignedOrdersList } from '@/components/driver/AssignedOrdersList';
import { getDriverDashboardStats, getDriverOrders } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface DriverStats {
  assignedOrders: number;
  completedToday: number;
  pendingPickups: number;
  estimatedDistance: number;
}

interface AssignedOrder {
  id: string;
  recipientName: string;
  recipientAddress: string;
  status: 'pending' | 'processing' | 'loaded' | 'delivered' | 'cancelled';
  priority: 'standard' | 'express' | 'urgent';
  estimatedDelivery: string;
  packageType: string;
  deliveryNotes?: string;
}

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Ensure we have a driver ID
  const driverId = user?.id;

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<DriverStats>({
    queryKey: ['driver-dashboard-stats', driverId],
    queryFn: () => getDriverDashboardStats(driverId!),
    enabled: !!driverId && user?.role === 'driver',
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: todaysOrders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['driver-todays-orders', driverId],
    queryFn: () => getDriverOrders(driverId!),
    enabled: !!driverId && user?.role === 'driver',
    refetchInterval: 60000, // Refetch every minute
    select: (orders) => {
      // Transform the API order data to match the expected interface
      return orders.map(order => ({
        id: order.trackingNumber,
        recipientName: order.recipientName,
        recipientAddress: order.address,
        status: order.status,
        priority: order.priority,
        estimatedDelivery: order.estimatedDelivery,
        packageType: order.packageType,
        deliveryNotes: order.deliveryNotes
      }));
    }
  });

  const handleViewOrder = (orderId: string) => {
    navigate(`/driver/orders/${orderId}`);
  };

  // Show loading state while checking authentication
  if (!user || user.role !== 'driver') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">This page is only accessible to drivers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your delivery overview for today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button onClick={() => navigate('/driver/route')} variant="outline">
            <Route className="mr-2 h-4 w-4" />
            View Route
          </Button>
          <Button onClick={() => navigate('/driver/orders')}>
            <Package className="mr-2 h-4 w-4" />
            All Orders
          </Button>
        </div>
      </div>

      {statsError ? (
        <div className="text-red-500">Error loading driver statistics</div>
      ) : (
        <DriverStats stats={stats} />
      )}
      
      {ordersError ? (
        <div className="text-red-500">Error loading assigned orders</div>
      ) : (
        <AssignedOrdersList orders={todaysOrders || []} onViewOrder={handleViewOrder} />
      )}
    </div>
  );
};

export default DriverDashboard;
