import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Package, 
  Eye,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Navigation,
  MapPin,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

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
          estimatedDelivery: '2024-01-18T09:00:00Z',
          packageType: 'Clothing',
          weight: 1.2,
          pickupLocation: 'Warehouse B - 456 Storage Way'
        },
        {
          id: 'ORD-004',
          recipientName: 'Emily Davis',
          recipientAddress: '321 Elm St, Houston, TX 77001',
          status: 'delivered',
          priority: 'standard',
          assignedAt: '2024-01-17T06:00:00Z',
          estimatedDelivery: '2024-01-17T16:00:00Z',
          packageType: 'Food Items',
          weight: 3.8,
          pickupLocation: 'Cold Storage - 789 Refrigerated Dr'
        },
        {
          id: 'ORD-005',
          recipientName: 'David Wilson',
          recipientAddress: '654 Maple Dr, Phoenix, AZ 85001',
          status: 'returned',
          priority: 'express',
          assignedAt: '2024-01-16T14:00:00Z',
          estimatedDelivery: '2024-01-17T10:00:00Z',
          packageType: 'Books',
          weight: 2.0,
          deliveryNotes: 'Customer unavailable - returned to sender',
          pickupLocation: 'Library Distribution - 234 Book Ave'
        }
      ];

      // Apply filters
      let filteredOrders = mockOrders;

      if (searchQuery) {
        filteredOrders = filteredOrders.filter(order =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.recipientAddress.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }

      if (priorityFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.priority === priorityFilter);
      }

      return filteredOrders;
    }
  });

  const getStatusIcon = (status: DriverOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'loaded':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Navigation className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'returned':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: DriverOrder['status']) => {
    const configs = {
      pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      loaded: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      in_transit: { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
      delivered: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      returned: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
    };
    
    const config = configs[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status.replace('_', ' ')}</span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: DriverOrder['priority']) => {
    switch (priority) {
      case 'urgent':
        return (
          <Badge variant="destructive">
            {priority}
          </Badge>
        );
      case 'express':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
            {priority}
          </Badge>
        );
      case 'standard':
        return (
          <Badge variant="outline">
            {priority}
          </Badge>
        );
    }
  };

  const statusCounts = orders?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your assigned delivery orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => navigate('/driver/route')} variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            View Route
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts?.pending || 0}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('loaded')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts?.loaded || 0}</div>
            <p className="text-sm text-muted-foreground">Loaded</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('in_transit')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{statusCounts?.in_transit || 0}</div>
            <p className="text-sm text-muted-foreground">In Transit</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('delivered')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts?.delivered || 0}</div>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('returned')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts?.returned || 0}</div>
            <p className="text-sm text-muted-foreground">Returned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, recipient name, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="loaded">Loaded</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
            {(statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setSearchQuery('');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Package Type</TableHead>
                  <TableHead>Estimated Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.recipientName}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {order.recipientAddress}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.packageType}</div>
                        <div className="text-sm text-muted-foreground">{order.weight}kg</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {format(new Date(order.estimatedDelivery), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/driver/orders/${order.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {orders?.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverOrders;
