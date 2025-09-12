import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { RouteOverview } from '@/components/driver/RouteOverview';
import { RouteStopList } from '@/components/driver/RouteStopList';

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

  const { data: routeData, isLoading, refetch } = useQuery<RouteInfo>({
    queryKey: ['driver-route'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        routeId: 'RT-2024-001',
        driverId: 'DRV-001',
        date: '2024-01-18',
        totalDistance: 45.2,
        estimatedDuration: 180, // 3 hours
        totalStops: 6,
        completedStops: 2,
        optimizedBy: 'system',
        lastUpdated: '2024-01-18T08:30:00Z',
        stops: [
          {
            id: 'stop-1',
            orderId: 'ORD-001',
            type: 'pickup',
            recipientName: 'Warehouse A',
            address: '789 Industrial Blvd, Building 3, New York, NY',
            phone: '+1 (555) 789-0123',
            estimatedTime: '08:30',
            duration: 15,
            status: 'completed',
            packageType: 'Electronics',
            priority: 'urgent',
            latitude: 40.7128,
            longitude: -74.0060
          },
          {
            id: 'stop-2',
            orderId: 'ORD-002',
            type: 'pickup',
            recipientName: 'Main Office',
            address: '123 Business Park, Suite 100, New York, NY',
            phone: '+1 (555) 456-7890',
            estimatedTime: '09:00',
            duration: 10,
            status: 'completed',
            packageType: 'Documents',
            priority: 'express',
            latitude: 40.7589,
            longitude: -73.9851
          },
          {
            id: 'stop-3',
            orderId: 'ORD-001',
            type: 'delivery',
            recipientName: 'John Smith',
            address: '123 Main St, Apt 4B, New York, NY 10001',
            phone: '+1 (555) 123-4567',
            estimatedTime: '10:30',
            duration: 15,
            status: 'pending',
            packageType: 'Electronics',
            priority: 'urgent',
            notes: 'Fragile - Handle with care. Ring doorbell twice.',
            latitude: 40.7505,
            longitude: -73.9934
          },
          {
            id: 'stop-4',
            orderId: 'ORD-002',
            type: 'delivery',
            recipientName: 'Sarah Johnson',
            address: '456 Oak Ave, Suite 200, New York, NY 10016',
            phone: '+1 (555) 234-5678',
            estimatedTime: '11:15',
            duration: 10,
            status: 'pending',
            packageType: 'Documents',
            priority: 'express',
            notes: 'Business delivery - Ask for reception desk',
            latitude: 40.7455,
            longitude: -73.9803
          },
          {
            id: 'stop-5',
            orderId: 'ORD-003',
            type: 'pickup',
            recipientName: 'Tech Store Inc.',
            address: '789 Commerce St, New York, NY 10013',
            phone: '+1 (555) 345-6789',
            estimatedTime: '12:00',
            duration: 20,
            status: 'pending',
            packageType: 'Electronics',
            priority: 'standard',
            latitude: 40.7204,
            longitude: -74.0014
          },
          {
            id: 'stop-6',
            orderId: 'ORD-003',
            type: 'delivery',
            recipientName: 'Michael Brown',
            address: '321 Pine Rd, Brooklyn, NY 11201',
            phone: '+1 (555) 456-7890',
            estimatedTime: '13:30',
            duration: 15,
            status: 'pending',
            packageType: 'Electronics',
            priority: 'standard',
            notes: 'Leave with neighbor if not home',
            latitude: 40.6892,
            longitude: -73.9959
          }
        ]
      } as RouteInfo;
    }
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
