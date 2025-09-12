import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom auth login route for customers
server.post('/customer_login', (req, res) => {
  const { username, password } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
  
  const user = db.users.find(u => u.username === username && u.password === password && u.role === 'client');
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      accessToken: `mock-token-${user.id}-${Date.now()}`,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Custom auth login route for drivers
server.post('/driver_login', (req, res) => {
  const { username, password } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
  
  const user = db.users.find(u => u.username === username && u.password === password && u.role === 'driver');
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      accessToken: `mock-token-${user.id}-${Date.now()}`,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Driver-specific API endpoints
server.get('/api/driver/stats/:driverId', (req, res) => {
  const { driverId } = req.params;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
  
  const stats = db.driver_stats.find(s => s.driverId === driverId);
  if (stats) {
    res.json(stats);
  } else {
    res.status(404).json({ error: 'Driver stats not found' });
  }
});

server.get('/api/driver/route/:driverId', (req, res) => {
  const { driverId } = req.params;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
  
  const route = db.driver_routes.find(r => r.driverId === driverId);
  if (route) {
    res.json(route);
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

server.get('/api/driver/orders/:driverId', (req, res) => {
  const { driverId } = req.params;
  const { status, priority } = req.query;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
  
  let orders = db.orders.filter(o => o.assignedDriverId === driverId);
  
  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }
  
  if (priority && priority !== 'all') {
    orders = orders.filter(o => o.priority === priority);
  }
  
  res.json(orders);
});

server.patch('/api/driver/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const updates = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
  
  const orderIndex = db.orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    db.orders[orderIndex] = { ...db.orders[orderIndex], ...updates };
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
    res.json(db.orders[orderIndex]);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

server.use(router);

const PORT = process.env.PORT || 8290;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});