import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/lib/api';

interface OrderRowProps {
  order: Order;
  onView: (orderId: number) => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, onView }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'loaded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
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
    <TableRow>
      <TableCell className="font-medium">{order.id}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{order.recipientName}</div>
          <div className="text-sm text-muted-foreground">{order.address}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(order.status)}>
          {order.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getPriorityColor(order.priority)}>
          {order.priority}
        </Badge>
      </TableCell>
      <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
      <TableCell>{format(new Date(order.estimatedDelivery), 'MMM dd, yyyy')}</TableCell>
      <TableCell>{order.trackingNumber}</TableCell>
      <TableCell>
        <div>
          <div className="text-sm">{order.packageType}</div>
          <div className="text-xs text-muted-foreground">{order.weight}kg</div>
        </div>
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onView(order.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
