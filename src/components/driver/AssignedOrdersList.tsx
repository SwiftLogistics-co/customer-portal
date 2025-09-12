import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusCard } from './OrderStatusCard';

interface AssignedOrder {
  id: string;
  recipientName: string;
  recipientAddress: string;
  status: 'pending' | 'loaded' | 'in_transit' | 'delivered' | 'returned';
  priority: 'standard' | 'express' | 'urgent';
  estimatedDelivery: string;
  packageType: string;
  deliveryNotes?: string;
}

interface AssignedOrdersListProps {
  orders?: AssignedOrder[];
  onViewOrder: (orderId: string) => void;
}

export const AssignedOrdersList: React.FC<AssignedOrdersListProps> = ({ 
  orders, 
  onViewOrder 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders?.map((order) => (
            <OrderStatusCard 
              key={order.id} 
              order={order} 
              onView={onViewOrder} 
            />
          ))}
          {(!orders || orders.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              No orders assigned for today
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
