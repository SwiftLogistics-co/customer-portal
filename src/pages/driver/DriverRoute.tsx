import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Route,
  MapPin, 
  Clock, 
  Navigation,
  Car,
  Package,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  Fuel,
  Timer,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

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
            latitude: 40.7580,
            longitude: -73.9855
          },
          {
            id: 'stop-3',
            orderId: 'ORD-001',
            type: 'delivery',
            recipientName: 'John Smith',
            address: '123 Main St, Apt 4B, New York, NY 10001',
            phone: '+1 (555) 123-4567',
            estimatedTime: '10:00',
            duration: 10,
            status: 'pending',
            packageType: 'Electronics',
            priority: 'urgent',
            notes: 'Ring doorbell twice. Customer prefers morning delivery.',
            latitude: 40.7505,
            longitude: -73.9934
          },
          {
            id: 'stop-4',
            orderId: 'ORD-002',
            type: 'delivery',
            recipientName: 'Sarah Johnson',
            address: '456 Oak Ave, Brooklyn, NY 11201',
            phone: '+1 (555) 987-6543',
            estimatedTime: '11:30',
            duration: 15,
            status: 'pending',
            packageType: 'Documents',
            priority: 'express',
            latitude: 40.6892,
            longitude: -73.9442
          },
          {
            id: 'stop-5',
            orderId: 'ORD-003',
            type: 'delivery',
            recipientName: 'Michael Brown',
            address: '789 Pine Rd, Queens, NY 11375',
            phone: '+1 (555) 246-8100',
            estimatedTime: '13:00',
            duration: 12,
            status: 'pending',
            packageType: 'Clothing',
            priority: 'standard',
            latitude: 40.7282,
            longitude: -73.8448
          },
          {
            id: 'stop-6',
            orderId: 'ORD-004',
            type: 'delivery',
            recipientName: 'Emily Davis',
            address: '321 Elm St, Manhattan, NY 10014',
            phone: '+1 (555) 135-7924',
            estimatedTime: '14:30',
            duration: 10,
            status: 'pending',
            packageType: 'Food Items',
            priority: 'standard',
            notes: 'Leave with doorman if not available',
            latitude: 40.7359,
            longitude: -74.0014
          }
        ]
      } as RouteInfo;
    }
  });

  const handleRefreshRoute = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStopTypeIcon = (type: RouteStop['type']) => {
    return type === 'pickup' ? <Package className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const getStopTypeColor = (type: RouteStop['type']) => {
    return type === 'pickup' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
  };

  const getStatusIcon = (status: RouteStop['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getPriorityColor = (priority: RouteStop['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'express':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'standard':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Today's Route</h1>
        </div>
        <div className="text-center py-8">Loading route information...</div>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Today's Route</h1>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No route assigned for today. Please contact dispatch for more information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const progress = (routeData.completedStops / routeData.totalStops) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today's Route</h1>
          <p className="text-muted-foreground">
            Optimized delivery route for {format(new Date(routeData.date), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button 
            onClick={handleRefreshRoute} 
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Route
          </Button>
          <Button onClick={() => navigate('/driver/orders')}>
            <Package className="mr-2 h-4 w-4" />
            View Orders
          </Button>
        </div>
      </div>

      {/* Route Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routeData.totalDistance}km</div>
            <p className="text-xs text-muted-foreground">
              <Fuel className="inline h-3 w-3 mr-1" />
              Estimated fuel cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Duration</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(routeData.estimatedDuration)}</div>
            <p className="text-xs text-muted-foreground">
              Including stop times
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stops</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routeData.totalStops}</div>
            <p className="text-xs text-muted-foreground">
              Pickups and deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routeData.completedStops}/{routeData.totalStops}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Route Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Route Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Route ID</p>
              <p className="font-mono">{routeData.routeId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Optimized By</p>
              <p className="capitalize">{routeData.optimizedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p>{format(new Date(routeData.lastUpdated), 'HH:mm')}</p>
            </div>
          </div>
          
          <Alert>
            <Navigation className="h-4 w-4" />
            <AlertDescription>
              This route has been optimized to minimize travel time and fuel consumption. 
              Follow the sequence below for the most efficient delivery path.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Route Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Route Stops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeData.stops.map((stop, index) => (
              <div key={stop.id} className="relative">
                <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  {/* Timeline connector */}
                  {index < routeData.stops.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-border"></div>
                  )}
                  
                  {/* Step number and status */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      stop.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : stop.status === 'failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    {getStatusIcon(stop.status)}
                  </div>
                  
                  {/* Stop details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className={getStopTypeColor(stop.type)}>
                        {getStopTypeIcon(stop.type)}
                        <span className="ml-1 capitalize">{stop.type}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {stop.orderId}
                      </Badge>
                      <Badge variant="secondary" className={getPriorityColor(stop.priority)}>
                        {stop.priority}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {stop.estimatedTime} ({formatDuration(stop.duration)})
                      </span>
                    </div>
                    
                    <h4 className="font-medium">{stop.recipientName}</h4>
                    <p className="text-sm text-muted-foreground">{stop.address}</p>
                    <p className="text-sm text-muted-foreground">{stop.phone}</p>
                    <p className="text-sm text-muted-foreground">Package: {stop.packageType}</p>
                    
                    {stop.notes && (
                      <p className="text-sm text-orange-600 mt-2">
                        <strong>Note:</strong> {stop.notes}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/driver/orders/${stop.orderId}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `https://maps.google.com/maps?q=${encodeURIComponent(stop.address)}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                  </div>
                </div>
                
                {index < routeData.stops.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverRoute;
