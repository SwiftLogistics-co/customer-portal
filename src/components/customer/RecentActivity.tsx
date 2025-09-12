import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  MapPin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'order_created' | 'order_picked_up' | 'order_delivered' | 'driver_assigned';
  orderId: string;
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const navigate = useNavigate();

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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => (
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
  );
};
