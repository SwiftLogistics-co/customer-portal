import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';

interface DriverOrder {
  id: string;
  recipientName: string;
  recipientAddress: string;
  status: 'pending' | 'processing' | 'loaded' | 'delivered' | 'cancelled';
  priority?: 'standard' | 'express' | 'urgent';
  assignedAt: string;
  estimatedDelivery?: string;
  packageType: string;
  weight?: number;
  deliveryNotes?: string;
  pickupLocation?: string;
}

interface DriverOrderRowProps {
  order: DriverOrder;
  onView: (orderId: string) => void;
}

export const DriverOrderRow: React.FC<DriverOrderRowProps> = ({ order, onView }) => {
  const getStatusColor = (status: DriverOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'loaded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getPriorityColor = (priority: 'standard' | 'express' | 'urgent') => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'express':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'standard':
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{order.id}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{order.recipientName}</div>
          <div className="text-sm text-muted-foreground">{order.recipientAddress}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(order.status)}>
          {order.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getPriorityColor(order.priority || 'standard')}>
          {order.priority || 'standard'}
        </Badge>
      </TableCell>
      <TableCell>{format(new Date(order.assignedAt), 'MMM dd, yyyy')}</TableCell>
      {/* <TableCell>
        {order.estimatedDelivery 
          ? format(new Date(order.estimatedDelivery), 'MMM dd, HH:mm')
          : 'TBD'
        }
      </TableCell> */}
      <TableCell>
        None
      </TableCell>
      <TableCell>
        <div>
          <div className="text-sm">{order.packageType}</div>
          <div className="text-xs text-muted-foreground">
            {order.weight ? `${order.weight}kg` : 'Weight N/A'}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {order.pickupLocation || 'Warehouse'}
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
