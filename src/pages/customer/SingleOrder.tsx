import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { getCustomerOrders, Order as ApiOrder } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  FileImage,
  Upload,
  ArrowLeft,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import MapComponent from '@/components/MapComponent';
import { usePolling } from '@/hooks/usePolling';

// Extended interface for detailed order view with timeline and proofs
interface OrderDetails extends ApiOrder {
  timeline: TimelineEvent[];
  proofs: Proof[];
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'assigned' | 'processing' | 'loaded' | 'delivered' | 'cancelled';
  message: string;
  timestamp: string;
  location?: string;
}

interface Proof {
  id: string;
  type: 'signature' | 'photo';
  url: string;
  uploadedAt: string;
  description?: string;
}

const SingleOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadingProof, setUploadingProof] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: order, isLoading, error } = useQuery<OrderDetails>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId || !user) throw new Error('Order ID and user authentication required');
      
      // Get all customer orders and find the specific one
      const orders = await getCustomerOrders();
      const foundOrder = orders.find(o => o.id.toString() === orderId);
      
      if (!foundOrder) {
        throw new Error('Order not found');
      }

      // Create mock timeline and proofs for now since API doesn't provide them
      const timeline: TimelineEvent[] = [];
      
      // Generate timeline based on order status
      timeline.push({
        id: '1',
        type: 'created',
        message: 'Order created and payment confirmed',
        timestamp: foundOrder.created_at,
        location: foundOrder.pickupLocation || 'Pickup Location'
      });

      if (foundOrder.status !== 'pending') {
        timeline.push({
          id: '2',
          type: 'assigned',
          message: foundOrder.assignedDriverId ? `Driver assigned to delivery` : 'Processing order',
          timestamp: foundOrder.created_at,
          location: 'Distribution Center'
        });
      }

      if (foundOrder.status === 'processing' || foundOrder.status === 'loaded' || foundOrder.status === 'delivered') {
        timeline.push({
          id: '3',
          type: 'processing',
          message: 'Order is being processed',
          timestamp: foundOrder.pickupTime || foundOrder.created_at,
          location: foundOrder.pickupLocation || 'Warehouse'
        });
      }

      if (foundOrder.status === 'loaded' || foundOrder.status === 'delivered') {
        timeline.push({
          id: '4',
          type: 'loaded',
          message: 'Package loaded and ready for delivery',
          timestamp: foundOrder.pickupTime || foundOrder.created_at,
          location: 'Delivery Vehicle'
        });
      }

      if (foundOrder.status === 'delivered') {
        timeline.push({
          id: '5',
          type: 'delivered',
          message: 'Package delivered successfully',
          timestamp: foundOrder.actualDelivery || foundOrder.estimatedDelivery,
          location: foundOrder.address
        });
      }

      if (foundOrder.status === 'cancelled') {
        timeline.push({
          id: '6',
          type: 'cancelled',
          message: 'Order has been cancelled',
          timestamp: foundOrder.actualDelivery || new Date().toISOString(),
          location: 'System'
        });
      }

      // Create extended order object with timeline and proofs
      const orderDetails: OrderDetails = {
        ...foundOrder,
        timeline,
        proofs: [] // Empty for now, could be extended later
      };

      return orderDetails;
    },
    enabled: !!orderId && !!user
  });

  // Enable polling for order updates
  usePolling({
    queryKey: ['order', orderId],
    pollingInterval: 5000,
    enabled: !!orderId && order?.status !== 'delivered' && order?.status !== 'cancelled'
  });

  const getStatusColor = (status: ApiOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'loaded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTimelineIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created':
        return <Package className="h-4 w-4" />;
      case 'assigned':
        return <User className="h-4 w-4" />;
      case 'processing':
        return <Truck className="h-4 w-4" />;
      case 'loaded':
        return <MapPin className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = (status: ApiOrder['status']) => {
    switch (status) {
      case 'pending':
        return 20;
      case 'processing':
        return 40;
      case 'loaded':
        return 80;
      case 'delivered':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 10;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setUploadingProof(true);

    try {
      // Mock upload - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Proof uploaded successfully",
        description: "The proof has been added to the order",
      });
      
      // Reset form
      setSelectedFile(null);
      event.target.value = '';
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingProof(false);
    }
  };

  const handleContactDriver = () => {
    // Mock contact functionality
    toast({
      title: "Contact Driver",
      description: "Driver will be notified of your message",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">Error loading order</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Failed to load order details.'}
        </p>
        <Button onClick={() => navigate('/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">Order not found</h3>
        <p className="text-muted-foreground">The requested order could not be found.</p>
        <Button onClick={() => navigate('/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order {order.id}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getStatusColor(order.status)} border-0`}>
                {order.status.replace('_', ' ')}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                ETA: {format(new Date(order.estimatedDelivery), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Delivery Progress</span>
              <span className="text-sm text-muted-foreground">
                {getProgressPercentage(order.status)}%
              </span>
            </div>
            <Progress value={getProgressPercentage(order.status)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <div className="space-y-6">
          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="font-medium">{order.packageType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                  <p className="font-medium">{order.weight} kg</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Dimensions</Label>
                  <p className="font-medium">
                    {order.dimensions || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                  <Badge variant="outline" className="mt-1">
                    {order.priority}
                  </Badge>
                </div>
              </div>
              {order.deliveryNotes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Delivery Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                    {order.deliveryNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">From</Label>
                  <div className="mt-1">
                    <p className="font-medium">{order.senderName}</p>
                    <p className="text-sm text-muted-foreground">{order.senderAddress}</p>
                    <p className="text-sm text-muted-foreground">
                      Contact information not available
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-muted-foreground">To</Label>
                  <div className="mt-1">
                    <p className="font-medium">{order.recipientName}</p>
                    <p className="text-sm text-muted-foreground">{order.address}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {order.recipientPhone}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Driver */}
          {order.assignedDriverId && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Driver Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Need to contact your driver? Send a message or request a callback.
                  </p>
                  <Button onClick={handleContactDriver} className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Driver
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map and Timeline */}
        <div className="space-y-6">
          {/* Live Map */}
          {order.assignedDriverId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MapComponent 
                  orderId={order.id.toString()}
                  driverId={order.assignedDriverId?.toString()}
                  route={{
                    polyline: '',
                    coordinates: [[order.coordinate.lng, order.coordinate.lat]]
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        {getTimelineIcon(event.type)}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{event.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        </span>
                        {event.location && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {event.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proof of Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Proof of Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.proofs.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {order.proofs.map((proof) => (
                    <div key={proof.id} className="border rounded-lg p-3">
                      <img 
                        src={proof.url} 
                        alt="Delivery proof" 
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(proof.uploadedAt), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                  <FileImage className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {order.status === 'delivered' ? 
                      'No proof of delivery available' : 
                      'Proof will appear here once delivery is completed'
                    }
                  </p>
                  
                  {order.status === 'delivered' && (
                    <div>
                      <Label htmlFor="proof-upload" className="cursor-pointer">
                        <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90">
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingProof ? 'Uploading...' : 'Upload Proof'}
                        </div>
                      </Label>
                      <Input
                        id="proof-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingProof}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Max file size: 5MB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;