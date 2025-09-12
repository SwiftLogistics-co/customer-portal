// Test script for ESB endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8290';

async function testEndpoints() {
  console.log('Testing ESB Mock API Endpoints');
  console.log('================================\n');

  try {
    // Test 1: Customer Login
    console.log('1. Testing Customer Login');
    const loginResponse = await fetch(`${BASE_URL}/cms/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'client1@swift.com',
        password: 'demo123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    const token = loginData.accessToken;
    console.log('\n');

    // Test 2: Get Customer Orders
    console.log('2. Testing Get Customer Orders');
    const ordersResponse = await fetch(`${BASE_URL}/cms/getOrdersByCustomer`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const ordersData = await ordersResponse.json();
    console.log('Orders Response:', JSON.stringify(ordersData, null, 2));
    console.log('\n');

    // Test 3: Create New Order
    console.log('3. Testing Create New Order');
    const newOrderResponse = await fetch(`${BASE_URL}/cms/new-order`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: {
          product: 'Test Product',
          quantity: 2,
          address: '123 Test Street, Test City',
          coordinate: [40.7128, -74.0060],
          route: 1
        }
      })
    });
    const newOrderData = await newOrderResponse.json();
    console.log('New Order Response:', JSON.stringify(newOrderData, null, 2));
    console.log('\n');

    // Test 4: Driver Login
    console.log('4. Testing Driver Login');
    const driverLoginResponse = await fetch(`${BASE_URL}/cms/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'driver1@swift.com',
        password: 'demo123'
      })
    });
    const driverLoginData = await driverLoginResponse.json();
    console.log('Driver Login Response:', JSON.stringify(driverLoginData, null, 2));
    
    const driverToken = driverLoginData.accessToken;
    console.log('\n');

    // Test 5: Get Driver Orders
    console.log('5. Testing Get Driver Orders');
    const driverOrdersResponse = await fetch(`${BASE_URL}/cms/getOrderByDriverAndStatus?driverId=3&status=pending`, {
      headers: { 
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json'
      }
    });
    const driverOrdersData = await driverOrdersResponse.json();
    console.log('Driver Orders Response:', JSON.stringify(driverOrdersData, null, 2));
    console.log('\n');

    // Test 6: Get Driver Routes
    console.log('6. Testing Get Driver Routes');
    const routesResponse = await fetch(`${BASE_URL}/ros/driver/routes/3`, {
      headers: { 
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json'
      }
    });
    const routesData = await routesResponse.json();
    console.log('Routes Response:', JSON.stringify(routesData, null, 2));
    console.log('\n');

    // Test 7: Update Order Status
    console.log('7. Testing Update Order Status');
    const updateStatusResponse = await fetch(`${BASE_URL}/wms/updateOrderStatus/1/delivered`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json'
      }
    });
    const updateStatusData = await updateStatusResponse.json();
    console.log('Update Status Response:', JSON.stringify(updateStatusData, null, 2));

  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
}

// Export or run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testEndpoints();
}

export default testEndpoints;
