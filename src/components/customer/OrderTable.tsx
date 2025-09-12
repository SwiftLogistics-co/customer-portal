import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderRow } from './OrderRow';

interface Order {
  id: string;
  recipientName: string;
  recipientAddress: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  priority: 'standard' | 'express' | 'urgent';
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  packageType: string;
  weight: number;
}

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
  isLoading?: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({ 
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
          <TableHead>Created</TableHead>
          <TableHead>Est. Delivery</TableHead>
          <TableHead>Tracking</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <OrderRow 
            key={order.id} 
            order={order} 
            onView={onViewOrder} 
          />
        ))}
      </TableBody>
    </Table>
  );
};
