import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { DriverOrderFilters } from '@/components/driver/DriverOrderFilters';
import { DriverOrderTable } from '@/components/driver/DriverOrderTable';
import { getDriverOrders, Order } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const DriverOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
  
  const { data: allOrders = [], isLoading, error } = useQuery({
    queryKey: ['driver-orders', user?.id, statusFilter],
    queryFn: () => getDriverOrders(user?.id || 1, statusFilter === 'all' ? undefined : statusFilter as any),
    enabled: !!user?.id,
  });

  // Filter and map orders to expected format
  const orders = React.useMemo(() => {
    // Ensure allOrders is an array before filtering
    if (!Array.isArray(allOrders)) {
      console.warn('allOrders is not an array:', allOrders);
      return [];
    }

    return allOrders
      .filter(order => {
        const matchesSearch = 
          order.id.toString().includes(searchQuery.toLowerCase()) ||
          order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.product.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = priorityFilter === 'all' || (order.priority && order.priority === priorityFilter);

        return matchesSearch && matchesPriority;
      })
      .map(order => ({
        id: order.id.toString(),
        recipientName: `Client ${order.client_id || 'Unknown'}`, // Fallback since no recipient name in API
        recipientAddress: order.address,
        status: order.status as 'pending' | 'processing' | 'loaded' | 'delivered' | 'cancelled',
        priority: order.priority || 'standard', // Fallback to standard priority
        assignedAt: order.created_at,
        estimatedDelivery: order.estimatedDelivery || 'TBD', // Fallback since not in API
        packageType: order.product, // Use product as package type
        weight: order.weight || 1, // Fallback weight
        deliveryNotes: order.deliveryNotes || 'No notes',
        pickupLocation: order.pickupLocation || 'Warehouse'
      }));
  }, [allOrders, searchQuery, priorityFilter]);  const handleViewOrder = (orderId: string) => {
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
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">Error loading orders</div>
              <div className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Failed to load orders'}
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverOrders;
