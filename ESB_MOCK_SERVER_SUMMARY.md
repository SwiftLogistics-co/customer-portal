# ESB Mock API Server - Implementation Summary

## Overview
The mock API server has been successfully updated to simulate the actual ESB (Enterprise Service Bus) endpoints as defined in the `docs/api-specs.yml` file. The server now runs on port 8290 to match the WSO2 MI API Gateway specification.

## Implemented ESB Endpoints

### 1. User Authentication
- **POST /cms/login**
  - Authenticates both customers and drivers
  - Returns JWT tokens with role-based access
  - Sample: `{"username": "client1@swift.com", "password": "demo123"}`

### 2. Customer Order Management
- **GET /cms/getOrdersByCustomer**
  - Retrieves orders for authenticated customer
  - Requires Bearer token
  - Returns orders filtered by customer ID

- **POST /cms/new-order**
  - Creates new orders for customers
  - Requires Bearer token and customer role
  - Auto-generates tracking numbers and order IDs
  - Sample request body:
    ```json
    {
      "order": {
        "product": "Electronics",
        "quantity": 2,
        "address": "123 Main St, NYC",
        "coordinate": [40.7128, -74.0060],
        "route": 1
      }
    }
    ```

### 3. Driver Order Management
- **GET /cms/getOrderByDriverAndStatus**
  - Retrieves orders assigned to specific driver
  - Supports status filtering (pending, in_transit, delivered, etc.)
  - Query parameters: `driverId`, `status`

### 4. Warehouse Management
- **PUT /wms/updateOrderStatus/{orderId}/{status}**
  - Updates order status (pending, processing, loaded, delivered, cancelled)
  - Requires Bearer token
  - Automatically sets delivery timestamp for completed orders

### 5. Route Optimization
- **GET /ros/driver/routes/{driverId}**
  - Returns optimized routes for specific driver
  - Includes optimization summary and order coordinates
  - Simulates route optimization algorithm

## Data Structure Updates

### Updated db.json Schema
- **Users**: Updated to use numeric IDs and email-based usernames
- **Orders**: Enhanced with coordinate objects, proper relationships
- **Driver Routes**: Linked to numeric driver IDs
- **Routes**: Added route definitions for assignment

### Key Features
1. **JWT Authentication**: Proper token-based authentication
2. **Role-based Access**: Customer vs Driver permissions
3. **Data Validation**: Request validation and error handling
4. **Auto-generated IDs**: Sequential order and user IDs
5. **Timestamp Management**: Automatic creation and delivery timestamps

## Server Configuration
- **Port**: 8290 (matches API specification)
- **CORS**: Enabled for frontend integration
- **JSON Parser**: Handles complex nested objects
- **Error Handling**: Proper HTTP status codes and error messages

## Testing Results
All endpoints have been tested and confirmed working:
- ✅ Customer login: `client1@swift.com` / `demo123`
- ✅ Driver login: `driver1@swift.com` / `demo123`
- ✅ Get customer orders (filtered by user)
- ✅ Create new orders (with auto-generation)
- ✅ Get driver orders (with status filtering)
- ✅ Update order status
- ✅ Get optimized routes

## Legacy Compatibility
Maintained backward compatibility with existing endpoints:
- `/customer_login` and `/driver_login`
- `/api/driver/*` endpoints
- Standard json-server routes

## Usage
```bash
# Start the server
npm run mock:server

# Test endpoints
curl -X POST http://localhost:8290/cms/login \
  -H "Content-Type: application/json" \
  -d '{"username": "client1@swift.com", "password": "demo123"}'
```

## Alignment with API Specs
The implementation closely follows the ESB endpoint specifications in `docs/api-specs.yml`:
- Correct endpoint paths and HTTP methods
- Proper request/response schemas
- Bearer token authentication
- Role-based access control
- Error response formats matching the spec

The mock server now accurately simulates the ESB layer that would orchestrate calls between the Customer Management System (CMS), Warehouse Management System (WMS), and Route Optimization System (ROS).
