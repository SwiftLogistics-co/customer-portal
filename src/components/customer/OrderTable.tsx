import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderRow } from './OrderRow';
import { Order } from '@/lib/api';

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (orderId: number) => void;
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
          <TableHead>Product & Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Route ID</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Priority</TableHead>
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
