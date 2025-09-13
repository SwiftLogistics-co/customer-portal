import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, MapPin, ArrowLeft, Route } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createOrder, NewOrderRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { CoordinateSelector } from '@/components/customer/CoordinateSelector';

interface Route {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

const orderSchema = z.object({
  product: z.string().min(1, 'Package type is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  address: z.string().min(5, 'Delivery address is required'),
  coordinate: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  route: z.number().optional(),
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  dimensions: z.string().min(1, 'Dimensions are required'),
  deliveryNotes: z.string().optional(),
  priority: z.enum(['standard', 'express', 'urgent']),
});

type OrderFormData = z.infer<typeof orderSchema>;

const NewOrder: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hardcoded routes list
  const routes: Route[] = [
    {
      id: 1,
      name: "Manhattan Route",
      description: "Central Manhattan and surrounding areas",
      active: true
    },
    {
      id: 2,
      name: "Brooklyn Route", 
      description: "Brooklyn and nearby neighborhoods",
      active: true
    },
    {
      id: 3,
      name: "Queens Route",
      description: "Queens and eastern areas",
      active: true
    },
    {
      id: 4,
      name: "Bronx Route",
      description: "Bronx and northern areas", 
      active: true
    },
    {
      id: 5,
      name: "Staten Island Route",
      description: "Staten Island and surrounding areas",
      active: true
    },
    {
      id: 6,
      name: "Express Route",
      description: "Priority deliveries across all areas",
      active: true
    }
  ];

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      priority: 'standard',
      quantity: 1,
      weight: 1.0,
      dimensions: '20cm x 20cm x 20cm',
      coordinate: {
        lat: 40.7128, // Default NYC coordinates
        lng: -74.0060,
      },
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      const orderData: NewOrderRequest = {
        product: data.product,
        quantity: data.quantity,
        address: data.address,
        coordinate: [data.coordinate.lat, data.coordinate.lng],
        route: data.route,
        weight: data.weight,
        dimensions: data.dimensions,
        deliveryNotes: data.deliveryNotes,
        priority: data.priority,
      };

      const newOrder = await createOrder(orderData);
      
      toast({
        title: "Order created successfully!",
        description: `Your order ${newOrder.trackingNumber} has been created and is being processed.`,
      });
      
      // Navigate to order details
      navigate(`/orders/${newOrder.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error creating order",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoordinateChange = (lat: number, lng: number) => {
    form.setValue('coordinate', { lat, lng });
  };

  const handleAddressChange = (address: string) => {
    form.setValue('address', address);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new delivery order.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Package Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Type *</FormLabel>
                      <FormControl>
                        <Input placeholder="Electronics, Documents, Clothing, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          min="0.1" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0.1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensions *</FormLabel>
                      <FormControl>
                        <Input placeholder="30cm x 20cm x 15cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Main Street, City, State 12345" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Coordinate Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Location *</label>
                <CoordinateSelector
                  initialCoordinate={{
                    lat: form.watch('coordinate')?.lat ?? 40.7128,
                    lng: form.watch('coordinate')?.lng ?? -74.0060,
                  }}
                  onCoordinateChange={handleCoordinateChange}
                  onAddressChange={handleAddressChange}
                />
                <p className="text-xs text-muted-foreground">
                  Click on the map to select the exact delivery location
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Route and Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Route and Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Route</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a route (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {routes.filter(route => route.active).map((route) => (
                            <SelectItem key={route.id} value={route.id.toString()}>
                              {route.name} - {route.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="deliveryNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special delivery instructions, access codes, or notes for the driver..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/orders')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewOrder;
