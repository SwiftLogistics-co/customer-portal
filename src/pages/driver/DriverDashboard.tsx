import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  Clock, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Route,
  Navigation,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

  const getStatusIcon = (status: AssignedOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'loaded':
        return <Truck className="h-4 w-4" />;
      case 'in_transit':
        return <Navigation className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'returned':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: AssignedOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'loaded':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'in_transit':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'delivered':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'returned':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    }
  };

  const getPriorityColor = (priority: AssignedOrder['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'express':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'standard':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
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

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.assignedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              For today's route
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Successful deliveries
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
              Awaiting collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Route Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.estimatedDistance || 0}km</div>
            <p className="text-xs text-muted-foreground">
              <Calendar className="inline h-3 w-3 mr-1" />
              Today's total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/driver/orders?status=pending')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full dark:bg-yellow-900/20">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Pending Orders</h3>
                <p className="text-sm text-muted-foreground">View orders awaiting pickup</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/driver/route')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/20">
                <Route className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Today's Route</h3>
                <p className="text-sm text-muted-foreground">View optimized delivery route</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/driver/orders?status=loaded')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Ready to Deliver</h3>
                <p className="text-sm text-muted-foreground">Orders loaded and ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysOrders?.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {order.id}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground capitalize">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-medium">{order.recipientName}</p>
                  <p className="text-sm text-muted-foreground">{order.recipientAddress}</p>
                  {order.deliveryNotes && (
                    <p className="text-sm text-orange-600 mt-1">Note: {order.deliveryNotes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.estimatedDelivery), { addSuffix: true })}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/driver/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;
