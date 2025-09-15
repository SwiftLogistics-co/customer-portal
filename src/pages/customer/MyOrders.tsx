import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { OrderFilters } from '@/components/customer/OrderFilters';
import { OrderTable } from '@/components/customer/OrderTable';
import { getCustomerOrders, Order } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const MyOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders', user?.id],
    queryFn: getCustomerOrders,
    enabled: !!user?.id,
  });

  // Apply client-side filtering
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = !searchQuery || 
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      (order.recipientName && order.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || (order.priority && order.priority === priorityFilter);
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const handleExport = () => {
    if (!orders || orders.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no orders to export.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ['Order ID', 'Product', 'Quantity', 'Status', 'Address', 'Route ID', 'Created'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id.toString(),
        `"${order.product}"`,
        order.quantity.toString(),
        order.status,
        `"${order.address}"`,
        order.route_id?.toString() || '',
        format(new Date(order.created_at), 'yyyy-MM-dd HH:mm')
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Orders have been exported to CSV.",
    });
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage all your delivery orders in one place.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => navigate('/orders/new')}>
            <Package className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onExport={handleExport}
          />
          
          <OrderTable
            orders={filteredOrders}
            onViewOrder={handleViewOrder}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export { MyOrders };
export default MyOrders;
