import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Route,
  Car,
  Calendar,
  Fuel,
  Timer,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

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
}

interface RouteOverviewProps {
  routeData?: RouteInfo;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const RouteOverview: React.FC<RouteOverviewProps> = ({ 
  routeData, 
  isRefreshing, 
  onRefresh 
}) => {
  if (!routeData) {
    return (
      <Alert>
        <Route className="h-4 w-4" />
        <AlertDescription>
          No route assigned for today. Please check with dispatch.
        </AlertDescription>
      </Alert>
    );
  }

  const progress = (routeData.completedStops / routeData.totalStops) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Route Overview
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{routeData.routeId}</Badge>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 hover:bg-muted rounded"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Car className="h-4 w-4" />
              <span className="text-sm">Distance</span>
            </div>
            <div className="font-semibold">{routeData.totalDistance}km</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span className="text-sm">Duration</span>
            </div>
            <div className="font-semibold">{Math.round(routeData.estimatedDuration / 60)}h {routeData.estimatedDuration % 60}m</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Route className="h-4 w-4" />
              <span className="text-sm">Progress</span>
            </div>
            <div className="font-semibold">{routeData.completedStops}/{routeData.totalStops}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Date</span>
            </div>
            <div className="font-semibold">{format(new Date(routeData.date), 'MMM dd')}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Route Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Optimized by {routeData.optimizedBy}</span>
          <span>•</span>
          <span>Updated {format(new Date(routeData.lastUpdated), 'HH:mm')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
