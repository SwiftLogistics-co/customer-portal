import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Download, 
  Package, 
  Eye,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders', searchQuery, statusFilter, priorityFilter, currentPage],
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
          createdAt: '2024-01-14T11:20:00Z',
          estimatedDelivery: '2024-01-16T10:00:00Z',
          trackingNumber: 'TRK-005-MNO',
          packageType: 'Fragile Items',
          weight: 4.2
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

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'express':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'standard':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const exportToCSV = () => {
    if (!orders || orders.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no orders to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Order ID', 'Recipient', 'Address', 'Status', 'Priority', 'Created', 'Estimated Delivery', 'Tracking Number', 'Package Type', 'Weight'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id,
        `"${order.recipientName}"`,
        `"${order.recipientAddress}"`,
        order.status,
        order.priority,
        format(new Date(order.createdAt), 'yyyy-MM-dd'),
        format(new Date(order.estimatedDelivery), 'yyyy-MM-dd'),
        order.trackingNumber,
        order.packageType,
        order.weight
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: "Export Successful",
      description: `Exported ${orders.length} orders to CSV file.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">
              Manage and track all your delivery orders
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => navigate('/orders/new')}>
            <Package className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order ID, recipient, or tracking number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Orders ({orders?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Create your first order to get started'
                }
              </p>
              <Button onClick={() => navigate('/orders/new')}>
                Create New Order
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Est. Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{order.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.trackingNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.recipientName}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {order.recipientAddress.substring(0, 30)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} border-0`}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {format(new Date(order.estimatedDelivery), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyOrders;