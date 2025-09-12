import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RouteStopCard } from './RouteStopCard';
import { Package } from 'lucide-react';

interface RouteStop {
  id: string;
  orderId: string;
  type: 'pickup' | 'delivery';
  recipientName: string;
  address: string;
  phone: string;
  estimatedTime: string;
  duration: number; // minutes
  status: 'pending' | 'completed' | 'failed';
  packageType: string;
  priority: 'standard' | 'express' | 'urgent';
  notes?: string;
  latitude: number;
  longitude: number;
}

interface RouteStopListProps {
  stops: RouteStop[];
  onViewOrder: (orderId: string) => void;
  onCallContact?: (phone: string) => void;
}

export const RouteStopList: React.FC<RouteStopListProps> = ({ 
  stops, 
  onViewOrder, 
  onCallContact 
}) => {
  const handleCall = (phone: string) => {
    if (onCallContact) {
      onCallContact(phone);
    } else {
      // Default behavior - open phone dialer
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Route Stops ({stops.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stops.map((stop, index) => (
            <RouteStopCard
              key={stop.id}
              stop={stop}
              index={index}
              onView={onViewOrder}
              onCall={handleCall}
            />
          ))}
          {stops.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No stops assigned for this route
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
