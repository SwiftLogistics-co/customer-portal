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

const MyOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const navigate = useNavigate();
  
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders', searchQuery, statusFilter, priorityFilter],
    queryFn: async () => {
      // Mock data - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          recipientName: 'John Smith',
          recipientAddress: '123 Main St, New York, NY 10001',
          status: 'delivered',
          priority: 'standard',
          createdAt: '2024-01-15T10:00:00Z',
          estimatedDelivery: '2024-01-18T16:00:00Z',
          trackingNumber: 'TRK-001-ABC',
          packageType: 'Electronics',
          weight: 2.5
        },
        {
          id: 'ORD-002',
          recipientName: 'Sarah Johnson',
          recipientAddress: '456 Oak Ave, Los Angeles, CA 90210',
          status: 'in_transit',
          priority: 'express',
          createdAt: '2024-01-16T14:30:00Z',
          estimatedDelivery: '2024-01-17T12:00:00Z',
          trackingNumber: 'TRK-002-DEF',
          packageType: 'Documents',
          weight: 0.5
        },
        {
          id: 'ORD-003',
          recipientName: 'Michael Brown',
          recipientAddress: '789 Pine Rd, Chicago, IL 60601',
          status: 'picked_up',
          priority: 'urgent',
          createdAt: '2024-01-17T09:15:00Z',
          estimatedDelivery: '2024-01-17T18:00:00Z',
          trackingNumber: 'TRK-003-GHI',
          packageType: 'Clothing',
          weight: 1.2
        },
        {
          id: 'ORD-004',
          recipientName: 'Emily Davis',
          recipientAddress: '321 Elm St, Houston, TX 77001',
          status: 'pending',
          priority: 'standard',
          createdAt: '2024-01-17T16:45:00Z',
          estimatedDelivery: '2024-01-20T14:00:00Z',
          trackingNumber: 'TRK-004-JKL',
          packageType: 'Food Items',
          weight: 3.8
        },
        {
          id: 'ORD-005',
          recipientName: 'David Wilson',
          recipientAddress: '654 Maple Dr, Phoenix, AZ 85001',
          status: 'failed',
          priority: 'express',
          createdAt: '2024-01-16T11:20:00Z',
          estimatedDelivery: '2024-01-18T10:00:00Z',
          trackingNumber: 'TRK-005-MNO',
          packageType: 'Home & Garden',
          weight: 5.2
        }
      ];
      
      // Apply filters
      let filtered = mockOrders;
      
      if (searchQuery) {
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter);
      }

      if (priorityFilter !== 'all') {
        filtered = filtered.filter(order => order.priority === priorityFilter);
      }

      return filtered;
    }
  });

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
    const headers = ['Order ID', 'Recipient', 'Status', 'Priority', 'Created', 'Est. Delivery', 'Tracking', 'Package Type', 'Weight'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id,
        `"${order.recipientName}"`,
        order.status,
        order.priority,
        format(new Date(order.createdAt), 'yyyy-MM-dd'),
        format(new Date(order.estimatedDelivery), 'yyyy-MM-dd'),
        order.trackingNumber,
        `"${order.packageType}"`,
        order.weight
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

  const handleViewOrder = (orderId: string) => {
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
            orders={orders || []}
            onViewOrder={handleViewOrder}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyOrders;
