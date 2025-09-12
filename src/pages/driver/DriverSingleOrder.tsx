import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail,
  Truck,
  CheckCircle,
  AlertCircle,
  Navigation,
  Weight,
  Calendar,
  FileText,
  Save
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface OrderDetail {
  id: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  recipientEmail?: string;
  status: 'pending' | 'loaded' | 'in_transit' | 'delivered' | 'returned';
  priority: 'standard' | 'express' | 'urgent';
  assignedAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  packageType: string;
  weight: number;
  dimensions: string;
  deliveryNotes?: string;
  driverNotes?: string;
  pickupLocation: string;
  pickupTime?: string;
  senderName: string;
  senderAddress: string;
  trackingNumber: string;
  specialInstructions?: string;
}

const DriverSingleOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [newStatus, setNewStatus] = useState<string>('');
  const [driverNotes, setDriverNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: order, isLoading } = useQuery<OrderDetail>({
    queryKey: ['driver-order', orderId],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        id: orderId || 'ORD-001',
        recipientName: 'John Smith',
        recipientAddress: '123 Main St, Apt 4B, New York, NY 10001',
        recipientPhone: '+1 (555) 123-4567',
        recipientEmail: 'john.smith@email.com',
        status: 'loaded',
        priority: 'urgent',
        assignedAt: '2024-01-17T08:00:00Z',
        estimatedDelivery: '2024-01-18T10:00:00Z',
        packageType: 'Electronics',
        weight: 2.5,
        dimensions: '30cm x 20cm x 15cm',
        deliveryNotes: 'Fragile - Handle with care. Customer prefers morning delivery between 9-11 AM.',
        driverNotes: 'Attempted delivery at 9:30 AM - customer not home. Left note.',
        pickupLocation: 'Warehouse A - 789 Industrial Blvd, Building 3',
        pickupTime: '2024-01-17T08:30:00Z',
        senderName: 'TechStore Inc.',
        senderAddress: '456 Commerce St, New York, NY 10002',
        trackingNumber: 'TRK-001-ABC-2024',
        specialInstructions: 'Ring doorbell twice. If no answer, leave with neighbor at Apt 4A.'
      } as OrderDetail;
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes: string }) => {
      // Mock API call - replace with actual API
      const response = await fetch(`/api/driver/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ 
          status,
          driverNotes: notes,
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
      queryClient.invalidateQueries({ queryKey: ['driver-stats'] });
      toast({
        title: 'Order Updated',
        description: 'Order status has been updated successfully.',
      });
      setIsUpdating(false);
      setNewStatus('');
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
      setIsUpdating(false);
    },
  });

  const handleStatusUpdate = async () => {
    if (!newStatus || !order) return;
    
    setIsUpdating(true);
    updateOrderMutation.mutate({
      status: newStatus,
      notes: driverNotes
    });
  };

  const getStatusIcon = (status: OrderDetail['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'loaded':
        return <Package className="h-5 w-5" />;
      case 'in_transit':
        return <Navigation className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'returned':
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: OrderDetail['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            {getStatusIcon(status)}
            <span className="ml-2 capitalize">Pending</span>
          </Badge>
        );
      case 'loaded':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {getStatusIcon(status)}
            <span className="ml-2 capitalize">Loaded</span>
          </Badge>
        );
      case 'in_transit':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            {getStatusIcon(status)}
            <span className="ml-2 capitalize">In Transit</span>
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            {getStatusIcon(status)}
            <span className="ml-2 capitalize">Delivered</span>
          </Badge>
        );
      case 'returned':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {getStatusIcon(status)}
            <span className="ml-2 capitalize">Returned</span>
          </Badge>
        );
    }
  };

  const getNextStatuses = (currentStatus: OrderDetail['status']) => {
    switch (currentStatus) {
      case 'pending':
        return [
          { value: 'loaded', label: 'Mark as Loaded' },
          { value: 'returned', label: 'Mark as Returned' }
        ];
      case 'loaded':
        return [
          { value: 'in_transit', label: 'Start Delivery' },
          { value: 'returned', label: 'Mark as Returned' }
        ];
      case 'in_transit':
        return [
          { value: 'delivered', label: 'Mark as Delivered' },
          { value: 'returned', label: 'Mark as Returned' }
        ];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/driver/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="text-center py-8">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/driver/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="text-center py-8">Order not found</div>
      </div>
    );
  }

  const nextStatuses = getNextStatuses(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/driver/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order {order.id}</h1>
          <p className="text-muted-foreground">Manage order details and status</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status and Quick Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextStatuses.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Update the order status as you progress through the delivery process.
                  </AlertDescription>
                </Alert>
              )}
              
              {nextStatuses.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status-update">Update Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {nextStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="driver-notes">Driver Notes (Optional)</Label>
                    <Textarea
                      id="driver-notes"
                      placeholder="Add any relevant notes about this delivery..."
                      value={driverNotes}
                      onChange={(e) => setDriverNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleStatusUpdate} 
                    disabled={!newStatus || isUpdating}
                    className="w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="font-medium">{order.recipientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {order.recipientPhone}
                  </p>
                </div>
              </div>
              
              {order.recipientEmail && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {order.recipientEmail}
                  </p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Delivery Address</Label>
                <p className="font-medium flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  {order.recipientAddress}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Package Type</Label>
                  <p className="font-medium">{order.packageType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    {order.weight}kg
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Dimensions</Label>
                  <p className="font-medium">{order.dimensions}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tracking Number</Label>
                <p className="font-medium font-mono">{order.trackingNumber}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Order Assigned</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.assignedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                {order.pickupTime && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Package Picked Up</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.pickupTime), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Estimated Delivery</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.estimatedDelivery), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">From</Label>
                <p className="font-medium">{order.senderName}</p>
                <p className="text-sm text-muted-foreground">{order.senderAddress}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Pickup Location</Label>
                <p className="font-medium">{order.pickupLocation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          {(order.deliveryNotes || order.specialInstructions) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.deliveryNotes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Delivery Notes</Label>
                    <p className="text-sm">{order.deliveryNotes}</p>
                  </div>
                )}
                
                {order.specialInstructions && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Special Instructions</Label>
                    <p className="text-sm">{order.specialInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Driver Notes */}
          {order.driverNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Previous Driver Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.driverNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverSingleOrder;
