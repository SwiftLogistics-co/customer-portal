import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { DashboardStats } from '@/components/customer/DashboardStats';
import { QuickTracker } from '@/components/customer/QuickTracker';
import { RecentActivity } from '@/components/customer/RecentActivity';

interface DashboardStats {
  activeDeliveries: number;
  pendingPickups: number;
  completedToday: number;
  totalOrders: number;
}

interface ActivityItem {
  id: string;
  type: 'order_created' | 'order_processing' | 'order_delivered' | 'driver_assigned';
  orderId: string;
  message: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        activeDeliveries: 12,
        pendingPickups: 5,
        completedToday: 23,
        totalOrders: 156
      };
    }
  });

  const { data: recentActivity } = useQuery<ActivityItem[]>({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: '1',
          type: 'order_delivered',
          orderId: 'ORD-001',
          message: 'Package delivered to 123 Main St',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'driver_assigned',
          orderId: 'ORD-003',
          message: 'John Smith assigned to delivery',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'order_processing',
          orderId: 'ORD-002',
          message: 'Package is being processed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          type: 'order_created',
          orderId: 'ORD-004',
          message: 'New order created - Electronics shipment',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
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
      <DashboardStats stats={stats} />
      <RecentActivity activities={recentActivity} />
    </div>
  );
};

export default Dashboard;