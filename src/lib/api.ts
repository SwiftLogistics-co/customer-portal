// API utility functions for ESB endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8290';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'customer' | 'driver';
  phone?: string;
  vehicle?: string;
  licenseNumber?: string;
}

export interface Order {
  id: number;
  product: string;
  quantity: number;
  status: 'pending' | 'processing' | 'loaded' | 'delivered' | 'cancelled';
  address: string;
  route_id?: number;
  created_at: string;
  // Optional fields that may come from other endpoints or may not always be present
  client_id?: number;
  coordinate?: string | {
    lat: number;
    lng: number;
  };
  priority?: 'standard' | 'express' | 'urgent';
  estimatedDelivery?: string;
  actualDelivery?: string;
  assignedDriverId?: number;
  senderName?: string;
  senderAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
  packageType?: string;
  weight?: number;
  dimensions?: string;
  trackingNumber?: string;
  deliveryNotes?: string;
  driverNotes?: string;
  pickupLocation?: string;
  pickupTime?: string;
}

export interface NewOrderRequest {
  product: string;
  quantity: number;
  address: string;
  coordinate: [number, number]; // [lat, lng]
  route?: number;
}

export interface DriverRoute {
  status: string;
  message: string;
  optimization_summary: {
    total_orders: number;
    total_distance_km: number;
    algorithm_used: string;
  };
  optimized_route: {
    orders: Array<{
      order_id: number;
      address: string;
      coordinate: {
        lat: number;
        lng: number;
      };
    }>;
  };
}

export interface DriverStats {
  driverId: number;
  date: string;
  assignedOrders: number;
  completedToday: number;
  pendingPickups: number;
  estimatedDistance: number;
  totalDeliveries: number;
  successRate: number;
  averageDeliveryTime: number;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// ESB API functions

/**
 * Login for both customers and drivers
 */
export const login = async (username: string, password: string): Promise<{ accessToken: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/cms/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return await response.json();
};

/**
 * Get orders for the authenticated customer
 */
export const getCustomerOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/cms/getOrdersByCustomer`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch orders');
  }

  const data = await response.json();
  return data.response.orders.order;
};

/**
 * Create a new order for customer
 */
export const createOrder = async (orderData: NewOrderRequest): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/cms/new-order`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ order: orderData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  const data = await response.json();
  return data.response.order;
};

/**
 * Get orders for a specific driver with optional status filter
 */
export const getDriverOrders = async (driverId: number, status?: string): Promise<Order[]> => {
  const params = new URLSearchParams({ driverId: driverId.toString() });
  if (status && status !== 'all') {
    params.append('status', status);
  }

  const response = await fetch(`${API_BASE_URL}/cms/getOrderByDriverAndStatus?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch driver orders');
  }

  const data = await response.json();
  return data.response.orders.order;
};

/**
 * Update order status (used by warehouse/drivers)
 */
export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/wms/updateOrderStatus/${orderId}/${status}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update order status');
  }
};

/**
 * Get optimized routes for driver
 */
export const getDriverRoutes = async (driverId: number): Promise<DriverRoute> => {
  const response = await fetch(`${API_BASE_URL}/ros/driver/routes/${driverId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch driver routes');
  }

  return await response.json();
};

// /**
//  * Get driver statistics (legacy endpoint)
//  */
// export const getDriverStats = async (driverId: number): Promise<DriverStats> => {
//   const response = await fetch(`${API_BASE_URL}/api/driver/stats/${driverId}`, {
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'Failed to fetch driver stats');
//   }

//   return await response.json();
// };

/**
 * Calculate customer dashboard statistics from orders
 */
export const getCustomerDashboardStats = async (): Promise<{
  activeDeliveries: number;
  pendingPickups: number;
  completedToday: number;
  totalOrders: number;
}> => {
  const orders = await getCustomerOrders();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 1);

  return {
    activeDeliveries: orders.filter(order => 
      ['processing', 'loaded'].includes(order.status)
    ).length,
    pendingPickups: orders.filter(order => 
      order.status === 'pending'
    ).length,
    completedToday: orders.filter(order => 
      order.status === 'delivered' && 
      order.actualDelivery &&
      new Date(order.actualDelivery) >= today && 
      new Date(order.actualDelivery) < todayEnd
    ).length,
    totalOrders: orders.length
  };
};

/**
 * Get recent activity from customer orders
 */
export const getCustomerRecentActivity = async (): Promise<Array<{
  id: string;
  type: 'order_created' | 'order_processing' | 'order_delivered' | 'driver_assigned';
  trackingNumber: string;
  orderId: string;
  message: string;
  timestamp: string;
}>> => {
  const orders = await getCustomerOrders();
  
  const activities = [];
  
  // Add activities for each order based on its current status and timestamps
  orders.forEach(order => {
    // Order created activity
    activities.push({
      id: `created-${order.id}`,
      type: 'order_created' as const,
      trackingNumber: order.trackingNumber || `ORD-${order.id}`,
      orderId: order.id.toString(),
      message: `New order created - ${order.product}`,
      timestamp: order.created_at
    });
    
    // Driver assigned activity (if driver is assigned)
    if (order.assignedDriverId) {
      activities.push({
        id: `assigned-${order.id}`,
        type: 'driver_assigned' as const,
        trackingNumber: order.trackingNumber || `ORD-${order.id}`,
        orderId: order.id.toString(),
        message: `Driver assigned to delivery`,
        timestamp: order.created_at // Use creation time as we don't have assignment time
      });
    }
    
    // Processing activity (if not pending)
    if (order.status !== 'pending') {
      activities.push({
        id: `processing-${order.id}`,
        type: 'order_processing' as const,
        trackingNumber: order.trackingNumber || `ORD-${order.id}`,
        orderId: order.id.toString(),
        message: `Package is being processed`,
        timestamp: order.created_at
      });
    }
    
    // Delivered activity (if delivered)
    if (order.status === 'delivered' && order.actualDelivery) {
      activities.push({
        id: `delivered-${order.id}`,
        type: 'order_delivered' as const,
        trackingNumber: order.trackingNumber || `ORD-${order.id}`,
        orderId: order.id.toString(),
        message: `Package delivered to ${order.address}`,
        timestamp: order.actualDelivery
      });
    }
  });
  
  // Sort by timestamp (most recent first) and take the latest 10
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
};

/**
 * Calculate driver dashboard statistics from assigned orders
 */
export const getDriverDashboardStats = async (driverId: number): Promise<{
  assignedOrders: number;
  completedToday: number;
  pendingPickups: number;
  estimatedDistance: number;
}> => {
  const orders = await getDriverOrders(driverId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 1);

  return {
    assignedOrders: orders.filter(order => 
      ['pending', 'processing', 'loaded'].includes(order.status)
    ).length,
    completedToday: orders.filter(order => 
      order.status === 'delivered' && 
      order.actualDelivery &&
      new Date(order.actualDelivery) >= today && 
      new Date(order.actualDelivery) < todayEnd
    ).length,
    pendingPickups: orders.filter(order => 
      order.status === 'pending'
    ).length,
    estimatedDistance: orders.length * 5.2 // Rough estimate: 5.2km per delivery
  };
};
