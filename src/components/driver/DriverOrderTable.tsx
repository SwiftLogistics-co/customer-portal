import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DriverOrderRow } from './DriverOrderRow';

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

interface DriverOrderTableProps {
  orders: DriverOrder[];
  onViewOrder: (orderId: string) => void;
  isLoading?: boolean;
}

export const DriverOrderTable: React.FC<DriverOrderTableProps> = ({ 
  orders, 
  onViewOrder, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No orders found</div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Recipient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assigned</TableHead>
          <TableHead>Est. Delivery</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Pickup Location</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <DriverOrderRow 
            key={order.id} 
            order={order} 
            onView={onViewOrder} 
          />
        ))}
      </TableBody>
    </Table>
  );
};
