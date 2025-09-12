import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Package, Route } from 'lucide-react';
import { DriverStats } from '@/components/driver/DriverStats';
import { AssignedOrdersList } from '@/components/driver/AssignedOrdersList';

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
  status: 'pending' | 'loaded' | 'in_transit' | 'delivered' | 'returned';
  priority: 'standard' | 'express' | 'urgent';
  estimatedDelivery: string;
  packageType: string;
  deliveryNotes?: string;
}

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: stats } = useQuery<DriverStats>({
    queryKey: ['driver-stats'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        assignedOrders: 8,
        completedToday: 5,
        pendingPickups: 3,
        estimatedDistance: 45.2
      };
    }
  });

  const { data: todaysOrders } = useQuery<AssignedOrder[]>({
    queryKey: ['driver-todays-orders'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: 'ORD-001',
          recipientName: 'John Smith',
          recipientAddress: '123 Main St, New York, NY 10001',
          status: 'pending',
          priority: 'urgent',
          estimatedDelivery: '2024-01-18T10:00:00Z',
          packageType: 'Electronics',
          deliveryNotes: 'Fragile - Handle with care'
        },
        {
          id: 'ORD-002',
          recipientName: 'Sarah Johnson',
          recipientAddress: '456 Oak Ave, Los Angeles, CA 90210',
          status: 'loaded',
          priority: 'express',
          estimatedDelivery: '2024-01-18T12:00:00Z',
          packageType: 'Documents'
        },
        {
          id: 'ORD-003',
          recipientName: 'Michael Brown',
          recipientAddress: '789 Pine Rd, Chicago, IL 60601',
          status: 'delivered',
          priority: 'standard',
          estimatedDelivery: '2024-01-18T09:00:00Z',
          packageType: 'Clothing'
        }
      ];
    }
  });

  const handleViewOrder = (orderId: string) => {
    navigate(`/driver/orders/${orderId}`);
  };

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

      <DriverStats stats={stats} />
      <AssignedOrdersList orders={todaysOrders} onViewOrder={handleViewOrder} />
    </div>
  );
};

export default DriverDashboard;
