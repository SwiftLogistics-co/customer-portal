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
  client_id: number;
  product: string;
  quantity: number;
  status: 'pending' | 'processing' | 'loaded' | 'delivered' | 'cancelled';
  priority: 'standard' | 'express' | 'urgent';
  created_at: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  assignedDriverId?: number;
  address: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  route_id?: number;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  packageType: string;
  weight: number;
  dimensions: string;
  trackingNumber: string;
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
  weight?: number;
  dimensions?: string;
  deliveryNotes?: string;
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
  return data.response.orders;
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

/**
 * Get driver statistics (legacy endpoint)
 */
export const getDriverStats = async (driverId: number): Promise<DriverStats> => {
  const response = await fetch(`${API_BASE_URL}/api/driver/stats/${driverId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch driver stats');
  }

  return await response.json();
};
