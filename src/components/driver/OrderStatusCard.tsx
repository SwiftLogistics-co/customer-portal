import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Navigation,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AssignedOrder {
  id: string;
  recipientName: string;
  recipientAddress: string;
  status: 'pending' | 'processing' | 'loaded' | 'delivered' | 'cancelled';
  priority: 'standard' | 'express' | 'urgent';
  estimatedDelivery: string;
  packageType: string;
  deliveryNotes?: string;
}

interface OrderStatusCardProps {
  order: AssignedOrder;
  onView: (orderId: string) => void;
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ order, onView }) => {
  const getStatusIcon = (status: AssignedOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Truck className="h-4 w-4" />;
      case 'loaded':
        return <Navigation className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: AssignedOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'processing':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'loaded':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'delivered':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'cancelled':
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
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{order.id}</Badge>
          <Badge className={getPriorityColor(order.priority)}>
            {order.priority}
          </Badge>
        </div>
        <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
        </div>
      </div>
      
      <div>
        <div className="font-medium">{order.recipientName}</div>
        <div className="text-sm text-muted-foreground">{order.recipientAddress}</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          ETA: {formatDistanceToNow(new Date(order.estimatedDelivery), { addSuffix: true })}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onView(order.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </div>
      
      {order.deliveryNotes && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          {order.deliveryNotes}
        </div>
      )}
    </div>
  );
};
