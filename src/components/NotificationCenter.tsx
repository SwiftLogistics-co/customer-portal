import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Package, Truck, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order_created' | 'order_picked_up' | 'order_delivered' | 'driver_assigned' | 'order_delayed';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage or fetch from API
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      // Mock notifications for demo
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'order_delivered',
          title: 'Order Delivered',
          message: 'Your order #ORD-001 has been delivered successfully',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
          read: false,
          orderId: 'ORD-001'
        },
        {
          id: '2',
          type: 'driver_assigned',
          title: 'Driver Assigned',
          message: 'John Smith has been assigned to your order #ORD-003',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false,
          orderId: 'ORD-003'
        },
        {
          id: '3',
          type: 'order_picked_up',
          title: 'Package Picked Up',
          message: 'Your order #ORD-002 has been picked up and is on the way',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          read: true,
          orderId: 'ORD-002'
        }
      ];
      setNotifications(mockNotifications);
      localStorage.setItem('notifications', JSON.stringify(mockNotifications));
    }
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_created':
        return <Package className="h-4 w-4" />;
      case 'order_picked_up':
        return <Truck className="h-4 w-4" />;
      case 'order_delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'driver_assigned':
        return <Truck className="h-4 w-4" />;
      case 'order_delayed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'order_delivered':
        return 'text-green-500';
      case 'order_delayed':
        return 'text-red-500';
      case 'order_picked_up':
      case 'driver_assigned':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center text-xs p-0">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-full mt-6">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-background'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getIconColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};