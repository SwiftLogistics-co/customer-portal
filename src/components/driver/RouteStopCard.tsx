import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Package,
  Phone,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

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

interface RouteStopCardProps {
  stop: RouteStop;
  index: number;
  onView: (orderId: string, status: string) => void;
  onCall?: (phone: string) => void;
}

export const RouteStopCard: React.FC<RouteStopCardProps> = ({ 
  stop, 
  index, 
  onView, 
  onCall 
}) => {
  const getStatusIcon = (status: RouteStop['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: RouteStop['type']) => {
    return type === 'pickup' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
  };

  const getPriorityColor = (priority: RouteStop['priority']) => {
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
    <div className={`p-4 border rounded-lg ${stop.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
            {index + 1}
          </div>
          <Badge className={getTypeColor(stop.type)}>
            {stop.type}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(stop.priority)}>
            {stop.priority}
          </Badge>
        </div>
        {getStatusIcon(stop.status)}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{stop.orderId}</span>
        </div>
        
        <div>
          <div className="font-medium">{stop.recipientName}</div>
          <div className="text-sm text-muted-foreground flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {stop.address}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {stop.estimatedTime} ({stop.duration}min)
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            {stop.phone}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Package: {stop.packageType}
        </div>
        
        {stop.notes && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <strong>Notes:</strong> {stop.notes}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log('status', stop.status);
              onView(stop.orderId, stop.status || 'pending');
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {onCall && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCall(stop.phone)}
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
