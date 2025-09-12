import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { DriverOrderFilters } from '@/components/driver/DriverOrderFilters';
import { DriverOrderTable } from '@/components/driver/DriverOrderTable';

interface DriverOrder {
  id: string;
  recipientName: string;
  recipientAddress: string;
  status: 'pending' | 'loaded' | 'in_transit' | 'delivered' | 'returned';
  priority: 'standard' | 'express' | 'urgent';
  assignedAt: string;
  estimatedDelivery: string;
  packageType: string;
  weight: number;
  deliveryNotes?: string;
  pickupLocation: string;
}

const DriverOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    
    if (status) setStatusFilter(status);
    if (priority) setPriorityFilter(priority);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (priorityFilter !== 'all') params.set('priority', priorityFilter);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  }, [statusFilter, priorityFilter, searchQuery, setSearchParams]);
  
  const { data: orders, isLoading } = useQuery<DriverOrder[]>({
    queryKey: ['driver-orders', searchQuery, statusFilter, priorityFilter],
    queryFn: async () => {
      // Mock data - replace with actual API call
      const mockOrders: DriverOrder[] = [
        {
          id: 'ORD-001',
          recipientName: 'John Smith',
          recipientAddress: '123 Main St, New York, NY 10001',
          status: 'pending',
          priority: 'urgent',
          assignedAt: '2024-01-17T08:00:00Z',
          estimatedDelivery: '2024-01-18T10:00:00Z',
          packageType: 'Electronics',
          weight: 2.5,
          deliveryNotes: 'Fragile - Handle with care. Customer prefers morning delivery.',
          pickupLocation: 'Warehouse A - 789 Industrial Blvd'
        },
        {
          id: 'ORD-002',
          recipientName: 'Sarah Johnson',
          recipientAddress: '456 Oak Ave, Los Angeles, CA 90210',
          status: 'loaded',
          priority: 'express',
          assignedAt: '2024-01-17T09:30:00Z',
          estimatedDelivery: '2024-01-18T12:00:00Z',
          packageType: 'Documents',
          weight: 0.5,
          pickupLocation: 'Main Office - 123 Business Park'
        },
        {
          id: 'ORD-003',
          recipientName: 'Michael Brown',
          recipientAddress: '789 Pine Rd, Chicago, IL 60601',
          status: 'in_transit',
          priority: 'standard',
          assignedAt: '2024-01-17T07:15:00Z',
          estimatedDelivery: '2024-01-18T14:00:00Z',
          packageType: 'Clothing',
          weight: 1.2,
          pickupLocation: 'Distribution Center - 456 Commerce St'
        },
        {
          id: 'ORD-004',
          recipientName: 'Emily Davis',
          recipientAddress: '321 Elm St, Houston, TX 77001',
          status: 'delivered',
          priority: 'standard',
          assignedAt: '2024-01-16T10:00:00Z',
          estimatedDelivery: '2024-01-17T16:00:00Z',
          packageType: 'Food Items',
          weight: 3.8,
          pickupLocation: 'Cold Storage - 789 Freezer Way'
        },
        {
          id: 'ORD-005',
          recipientName: 'David Wilson',
          recipientAddress: '654 Maple Dr, Phoenix, AZ 85001',
          status: 'returned',
          priority: 'express',
          assignedAt: '2024-01-16T11:20:00Z',
          estimatedDelivery: '2024-01-17T18:00:00Z',
          packageType: 'Home & Garden',
          weight: 5.2,
          deliveryNotes: 'Customer not available for multiple delivery attempts',
          pickupLocation: 'Garden Center - 321 Plant Ave'
        }
      ];
      
      // Apply filters
      let filtered = mockOrders;
      
      if (searchQuery) {
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.recipientAddress.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleViewOrder = (orderId: string) => {
    navigate(`/driver/orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage all your assigned delivery orders.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => navigate('/driver/route')}>
            <Package className="mr-2 h-4 w-4" />
            View Route
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverOrderFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
          />
          
          <DriverOrderTable
            orders={orders || []}
            onViewOrder={handleViewOrder}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverOrders;
