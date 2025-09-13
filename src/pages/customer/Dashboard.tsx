import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { DashboardStats } from '@/components/customer/DashboardStats';
import { QuickTracker } from '@/components/customer/QuickTracker';
import { RecentActivity } from '@/components/customer/RecentActivity';
import { getCustomerDashboardStats, getCustomerRecentActivity } from '@/lib/api';

interface DashboardStats {
  activeDeliveries: number;
  pendingPickups: number;
  completedToday: number;
  totalOrders: number;
}

interface ActivityItem {
  id: string;
  type: 'order_created' | 'order_processing' | 'order_delivered' | 'driver_assigned';
  trackingNumber: string;
  orderId: string;
  message: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>({
    queryKey: ['customer-dashboard-stats'],
    queryFn: getCustomerDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: recentActivity, isLoading: activityLoading, error: activityError } = useQuery<ActivityItem[]>({
    queryKey: ['customer-recent-activity'],
    queryFn: getCustomerRecentActivity,
    refetchInterval: 60000, // Refetch every minute
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your deliveries.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => navigate('/orders/new')} className="w-full sm:w-auto">
            <Package className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <QuickTracker />
      
      {statsError ? (
        <div className="text-red-500">Error loading dashboard statistics</div>
      ) : (
        <DashboardStats stats={stats} />
      )}
      
      {activityError ? (
        <div className="text-red-500">Error loading recent activity</div>
      ) : (
        <RecentActivity activities={recentActivity} />
      )}
    </div>
  );
};

export default Dashboard;