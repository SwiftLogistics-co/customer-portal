#!/usr/bin/env node

const API_BASE = 'http://localhost:8290';

async function testAPI() {
  try {
    // 1. Login
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/cms/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'client1@swift.com',
        password: 'demo123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    console.log('✓ Login successful');

    // 2. Test routes endpoint
    console.log('\n2. Testing routes endpoint...');
    const routesResponse = await fetch(`${API_BASE}/routes`);
    const routes = await routesResponse.json();
    console.log('✓ Routes fetched:', routes.length, 'routes available');
    routes.forEach(route => {
      console.log(`  - ${route.name} (ID: ${route.id}): ${route.description}`);
    });

    // 3. Create order with priority
    console.log('\n3. Testing order creation with priority...');
    const orderData = {
      order: {
        product: 'Test Package with Priority',
        quantity: 1,
        address: '123 Test Street, New York, NY 10001',
        coordinate: [40.7128, -74.0060],
        route: 1,
        weight: 2.5,
        dimensions: '30cm x 20cm x 15cm',
        deliveryNotes: 'Test order with urgent priority',
        priority: 'urgent'
      }
    };

    const orderResponse = await fetch(`${API_BASE}/cms/new-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      throw new Error(`Order creation failed: ${orderResponse.status}`);
    }

    const orderResult = await orderResponse.json();
    console.log('✓ Order created successfully');
    console.log('Order Details:');
    console.log(`  - ID: ${orderResult.response.order.id}`);
    console.log(`  - Product: ${orderResult.response.order.product}`);
    console.log(`  - Priority: ${orderResult.response.order.priority}`);
    console.log(`  - Route ID: ${orderResult.response.order.route_id}`);
    console.log(`  - Tracking: ${orderResult.response.order.trackingNumber}`);
    console.log(`  - Address: ${orderResult.response.order.address}`);
    console.log(`  - Coordinates: ${orderResult.response.order.coordinate.lat}, ${orderResult.response.order.coordinate.lng}`);

    // 4. Test fetching customer orders
    console.log('\n4. Testing customer orders fetch...');
    const customerOrdersResponse = await fetch(`${API_BASE}/cms/getOrdersByCustomer`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!customerOrdersResponse.ok) {
      throw new Error(`Customer orders fetch failed: ${customerOrdersResponse.status}`);
    }

    const customerOrders = await customerOrdersResponse.json();
    console.log(`✓ Customer orders fetched: ${customerOrders.response.orders.length} orders found`);

    console.log('\n🎉 All tests passed! The API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPI();
