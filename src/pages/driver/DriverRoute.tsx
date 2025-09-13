import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { RouteOverview } from '@/components/driver/RouteOverview';
import { RouteStopList } from '@/components/driver/RouteStopList';
import { getDriverRoutes, getDriverOrders } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface RouteStop {
  id: string;
  orderId: string;
  type: 'pickup' | 'delivery';
  recipientName: string;
  address: string;
  phone: string;
  estimatedTime: string;
  duration: number; // minutes
  status: 'pending' | 'completed' | 'failed';
  packageType: string;
  priority: 'standard' | 'express' | 'urgent';
  notes?: string;
  latitude: number;
  longitude: number;
}

interface RouteInfo {
  routeId: string;
  driverId: string;
  date: string;
  totalDistance: number;
  estimatedDuration: number; // minutes
  totalStops: number;
  completedStops: number;
  optimizedBy: 'system' | 'manual';
  lastUpdated: string;
  stops: RouteStop[];
}

const DriverRoute: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  const { data: routeData, isLoading, refetch, error } = useQuery<RouteInfo>({
    queryKey: ['driver-route', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Driver ID not found');
      }

      try {
        // Fetch route optimization data and driver orders in parallel
        const [routeResponse, ordersResponse] = await Promise.all([
          getDriverRoutes(user.id),
          getDriverOrders(user.id)
        ]);

        // Transform the API response to match RouteInfo interface
        const today = new Date().toISOString().split('T')[0];
      
      // Create route stops from orders
      const stops: RouteStop[] = ordersResponse.map((order, index) => {
        // Determine if this is pickup or delivery based on status and workflow
        // If order is pending/processing, it needs pickup first, then delivery
        // If already loaded/delivered/cancelled, it's a delivery stop
        const isPickupPhase = order.status === 'pending' || order.status === 'processing';
        
        return {
          id: `stop-${order.id}`,
          orderId: order.id.toString(),
          type: isPickupPhase ? 'pickup' : 'delivery',
          recipientName: isPickupPhase ? (order.senderName || 'Pickup Location') : order.recipientName,
          address: isPickupPhase ? (order.pickupLocation || order.senderAddress || order.address) : order.address,
          phone: order.recipientPhone || '+1-555-000-0000',
          estimatedTime: new Date(Date.now() + (index + 1) * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          duration: 15, // Default duration
          status: order.status === 'delivered' ? 'completed' : 
                  order.status === 'cancelled' ? 'failed' : 'pending',
          packageType: order.packageType || 'Package',
          priority: order.priority,
          notes: order.deliveryNotes || order.driverNotes,
          latitude: order.coordinate?.lat || 0,
          longitude: order.coordinate?.lng || 0
        };
      });

      const completedStops = stops.filter(stop => stop.status === 'completed').length;

        return {
          routeId: `RT-${today}-${user.id}`,
          driverId: user.id.toString(),
          date: today,
          totalDistance: routeResponse.optimization_summary.total_distance_km,
          estimatedDuration: routeResponse.optimization_summary.total_orders * 30, // Estimate 30 min per order
          totalStops: routeResponse.optimization_summary.total_orders,
          completedStops,
          optimizedBy: 'system' as const,
          lastUpdated: new Date().toISOString(),
          stops
        } as RouteInfo;
      } catch (error) {
        console.error('Failed to fetch route data:', error);
        throw error;
      }
    },
    enabled: !!user?.id && user?.role === 'driver'
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/driver/orders/${orderId}`);
  };

  const handleCallContact = (phone: string) => {
    // Default behavior - open phone dialer
    window.location.href = `tel:${phone}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading route...</div>
      </div>
    );
  }

  if (!user || user.role !== 'driver') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Access denied. Driver role required.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-destructive">Failed to load route data</div>
        <div className="text-sm text-muted-foreground">{error.message}</div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/driver/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Today's Route</h1>
            <p className="text-muted-foreground">
              Optimized delivery route for maximum efficiency
            </p>
          </div>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <RouteOverview 
        routeData={routeData} 
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
      
      {routeData && (
        <RouteStopList 
          stops={routeData.stops}
          onViewOrder={handleViewOrder}
          onCallContact={handleCallContact}
        />
      )}
    </div>
  );
};

export default DriverRoute;
