import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import jwt from 'jsonwebtoken';

const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// JWT Secret
const JWT_SECRET = 'swift-delivery-secret-key';

// Helper function to read db
const getDb = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
};

// Helper function to write db
const writeDb = (db) => {
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
};

// Helper function to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Authorization token required' });
  }
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

// Helper function to get user from token
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ESB Endpoints

// ESB: User Login - POST /cms/login
server.post('/cms/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    const accessToken = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      status: 'success',
      message: 'Login successful',
      accessToken,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({ 
      status: 'error', 
      message: 'Authentication failed' 
    });
  }
});

// ESB: Get Orders by Customer - GET /cms/getOrdersByCustomer
server.get('/cms/getOrdersByCustomer', verifyToken, (req, res) => {
  const db = getDb();
  const userId = req.user.id;
  
  if (req.user.role !== 'customer') {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Access denied. Customer role required.' 
    });
  }
  
  const orders = db.orders.filter(o => o.client_id === userId);
  
  res.json({
    response: {
      status: 'success',
      orders: orders
    }
  });
});

// ESB: Create New Order - POST /cms/new-order
server.post('/cms/new-order', verifyToken, (req, res) => {
  const db = getDb();
  const userId = req.user.id;
  
  if (req.user.role !== 'customer') {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Access denied. Customer role required.' 
    });
  }
  
  const { order } = req.body;
  if (!order) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Order object is required' 
    });
  }
  
  const newOrderId = Math.max(...db.orders.map(o => o.id), 0) + 1;
  const newOrder = {
    id: newOrderId,
    client_id: userId,
    product: order.product,
    quantity: order.quantity,
    status: 'pending',
    address: order.address,
    coordinate: {
      lat: order.coordinate[0],
      lng: order.coordinate[1]
    },
    route_id: order.route || null,
    created_at: new Date().toISOString(),
    priority: order.priority || 'standard',
    assignedDriverId: null,
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    senderName: req.user.name,
    senderAddress: order.address,
    recipientName: req.user.name,
    recipientPhone: req.user.phone || '+1-555-000-0000',
    packageType: order.product,
    weight: order.weight || 1.0,
    dimensions: order.dimensions || '20cm x 20cm x 20cm',
    trackingNumber: `TRK-${String(newOrderId).padStart(3, '0')}-${Date.now()}`,
    deliveryNotes: order.deliveryNotes || '',
    pickupLocation: 'Main Warehouse'
  };
  
  db.orders.push(newOrder);
  writeDb(db);
  
  res.status(201).json({
    response: {
      status: 'success',
      message: 'Order placed successfully',
      order: newOrder
    }
  });
});

// ESB: Update Order Status - PUT /wms/updateOrderStatus/{orderId}/{status}
server.put('/wms/updateOrderStatus/:orderId/:status', verifyToken, (req, res) => {
  const { orderId, status } = req.params;
  const db = getDb();
  
  const validStatuses = ['pending', 'processing', 'loaded', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
    });
  }
  
  const orderIndex = db.orders.findIndex(o => o.id === parseInt(orderId));
  if (orderIndex === -1) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'Order not found' 
    });
  }
  
  db.orders[orderIndex].status = status;
  if (status === 'delivered') {
    db.orders[orderIndex].actualDelivery = new Date().toISOString();
  }
  
  writeDb(db);
  
  res.json({
    status: 'success',
    message: 'Order status updated successfully'
  });
});

// ESB: Get Orders by Driver and Status - GET /cms/getOrderByDriverAndStatus
server.get('/cms/getOrderByDriverAndStatus', verifyToken, (req, res) => {
  const { driverId, status } = req.query;
  const db = getDb();
  
  if (!driverId) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'driverId parameter is required' 
    });
  }
  
  let orders = db.orders.filter(o => o.assignedDriverId === parseInt(driverId));
  
  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }
  
  // Find route_id from the first order or default
  const route_id = orders.length > 0 ? orders[0].route_id : null;
  
  res.json({
    response: {
      driver_id: parseInt(driverId),
      route_id: route_id,
      status: status || 'all',
      orders: {
        order: orders
      }
    }
  });
});

// ESB: Get Driver Routes - GET /ros/driver/routes/{driverId}
server.get('/ros/driver/routes/:driverId', verifyToken, (req, res) => {
  const { driverId } = req.params;
  const db = getDb();
  
  const driverRoute = db.driver_routes.find(r => r.driverId === parseInt(driverId));
  const driverOrders = db.orders.filter(o => o.assignedDriverId === parseInt(driverId));
  
  if (!driverRoute) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'No route found for this driver' 
    });
  }
  
  // Simulate route optimization response
  const optimizedOrders = driverOrders.map(order => ({
    order_id: order.id,
    address: order.address,
    coordinate: order.coordinate
  }));
  
  res.json({
    status: 'success',
    message: 'Route optimization completed',
    optimization_summary: {
      total_orders: driverOrders.length,
      total_distance_km: driverRoute.totalDistance,
      algorithm_used: 'nearest_neighbor'
    },
    optimized_route: {
      orders: optimizedOrders
    }
  });
});

// ESB: Get Routes - GET /routes
server.get('/routes', (req, res) => {
  const db = getDb();
  res.json(db.routes);
});

// Use default json-server router for other endpoints
server.use(router);

const PORT = process.env.PORT || 8290;
server.listen(PORT, () => {
  console.log(`ESB Mock Server is running on port ${PORT}`);
  console.log(`Available ESB endpoints:`);
  console.log(`- POST /cms/login`);
  console.log(`- GET /cms/getOrdersByCustomer`);
  console.log(`- POST /cms/new-order`);
  console.log(`- PUT /wms/updateOrderStatus/{orderId}/{status}`);
  console.log(`- GET /cms/getOrderByDriverAndStatus`);
  console.log(`- GET /ros/driver/routes/{driverId}`);
  console.log(`- GET /routes`);
});