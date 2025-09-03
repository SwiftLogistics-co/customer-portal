import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  Clock, 
  Search,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DashboardStats {
  activeDeliveries: number;
  pendingPickups: number;
  completedToday: number;
  totalOrders: number;
}

interface ActivityItem {
  id: string;
  type: 'order_created' | 'order_picked_up' | 'order_delivered' | 'driver_assigned';
  orderId: string;
  message: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('');
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
          type: 'order_picked_up',
          orderId: 'ORD-002',
          message: 'Package picked up from sender',
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

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/orders/${trackingInput.trim()}`);
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order_created':
        return <Package className="h-4 w-4" />;
      case 'order_picked_up':
        return <Truck className="h-4 w-4" />;
      case 'order_delivered':
        return <MapPin className="h-4 w-4" />;
      case 'driver_assigned':
        return <Truck className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order_delivered':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'order_created':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'order_picked_up':
        return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'driver_assigned':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
    }
  };

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

      {/* Quick tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Track
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="flex gap-2">
            <Input
              placeholder="Enter order ID or tracking number..."
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Track</Button>
          </form>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDeliveries || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingPickups || 0}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              <Calendar className="inline h-3 w-3 mr-1" />
              Since midnight
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity?.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.orderId}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{activity.message}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/orders/${activity.orderId}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;