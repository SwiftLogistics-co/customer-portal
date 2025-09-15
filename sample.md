# WSO2 MI End point Spec

HOST: http://localhost
PORT:8290

## POST:/cms/login

req

```json
{
  "username": "driver1@swift.com",
  "password": "hashpass1"
}
```

res

```json
{
  "status": "success",
  "message": "Login successful",
  "accessToken": "",
  "user": {
    "id": "1",
    "username": "driver1@swift.com",
    "name": "kasun"
  }
}
```

## POST:/cms/new-order

req

```json
{
  "order": {
    "product": "touch",
    "quantity": 5,
    "address": "matara st 23",
    "route": 2,
    "coordinate": [2.1233, 1.2343]
  }
}
```

res

```json
{
  "response": {
    "status": "success",
    "message": "Order placed successfully",
    "order": {
      "id": 25,
      "client_id": 1,
      "product": "touch",
      "quantity": 5,
      "status": "pending",
      "address": "matara st 23",
      "coordinate": "[2.1233,1.2343]",
      "route_id": 2,
      "created_at": "2025-09-11T09:09:18.395168"
    }
  }
}
```

## GET:/cms/getOrdersByCustomer

req

```bash
curl -X GET http://localhost:8290/cms/getOrdersByCustomer \
-H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

res

```json
{
  "response": {
    "status": "success",
    "orders": {
      "order": [
        {
          "id": 12,
          "product": "speaker",
          "quantity": 6,
          "status": "loaded",
          "address": "123 Main Street, Colombo 01",
          "route_id": 3,
          "created_at": "2025-09-10T11:11:57.732964"
        },
        {
          "id": 11,
          "product": "Example Product",
          "quantity": 2,
          "status": "loaded",
          "address": "789 Kandy Road, Kadawatha",
          "route_id": 2,
          "created_at": "2025-09-09T07:18:11.251088"
        }
      ]
    }
  }
}
```

## GET:/cms/getOrderByDriverAndStatus

req

```bash
curl -X GET http://localhost:8290/cms/getOrderByDriverAndStatus?driverId=2&status=pending \
-H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

res

```json
{
  "response": {
    "driver_id": 2,
    "route_id": 2,
    "status": "pending",
    "orders": {
      "order": [
        {
          "id": 24,
          "client_id": 1,
          "route_id": 2,
          "product": "car",
          "quantity": 1,
          "status": "pending",
          "created_at": "2025-09-11T08:59:00.807151",
          "address": "matara st 23",
          "coordinate": {
            "lat": 2.1233,
            "lng": 1.2343
          }
        },
        {
          "id": 25,
          "client_id": 1,
          "route_id": 2,
          "product": "touch",
          "quantity": 5,
          "status": "pending",
          "created_at": "2025-09-11T09:09:18.395168",
          "address": "matara st 23",
          "coordinate": {
            "lat": 2.1233,
            "lng": 1.2343
          }
        }
      ]
    }
  }
}
```

## POST:/ros/optimizeRoutes

req

```json
{
  "response": {
    "status": "success",
    "orders": {
      "order": [
        {
          "order_id": 22,
          "client_id": 1,
          "route_id": 2,
          "product": "sports equipment",
          "quantity": 5,
          "status": "pending",
          "created_at": "2025-09-10T20:12:21.435007",
          "address": "Galle Face Green, Colombo",
          "coordinate": {
            "lat": 6.9271,
            "lng": 79.8425
          }
        },
        {
          "order_id": 23,
          "client_id": 1,
          "route_id": 2,
          "product": "jbl speakers",
          "quantity": 5,
          "status": "pending",
          "created_at": "2025-09-10T20:13:31.097865",
          "address": "Mount Lavinia Hotel",
          "coordinate": {
            "lat": 6.8302,
            "lng": 79.8618
          }
        },
        {
          "order_id": 24,
          "client_id": 1,
          "route_id": 2,
          "product": "electronics",
          "quantity": 3,
          "status": "pending",
          "created_at": "2025-09-10T20:14:31.097865",
          "address": "Unity Plaza, Bambalapitiya",
          "coordinate": {
            "lat": 6.8897,
            "lng": 79.8567
          }
        },
        {
          "order_id": 25,
          "client_id": 1,
          "route_id": 2,
          "product": "office supplies",
          "quantity": 10,
          "status": "pending",
          "created_at": "2025-09-10T20:15:31.097865",
          "address": "World Trade Center, Colombo",
          "coordinate": {
            "lat": 6.935,
            "lng": 79.8433
          }
        }
      ]
    }
  }
}
```

res

```json
{
  "status": "success",
  "message": "Route optimized successfully",
  "optimization_summary": {
    "total_orders": 4,
    "total_distance_km": 12.77,
    "algorithm_used": "nearest_neighbor"
  },
  "optimized_route": {
    "orders": [
      {
        "order_id": 22,
        "client_id": 1,
        "route_id": 2,
        "product": "sports equipment",
        "quantity": 5,
        "status": "pending",
        "created_at": "2025-09-10T20:12:21.435007",
        "address": "Galle Face Green, Colombo",
        "coordinate": {
          "lat": 6.9271,
          "lng": 79.8425
        }
      },
      {
        "order_id": 25,
        "client_id": 1,
        "route_id": 2,
        "product": "office supplies",
        "quantity": 10,
        "status": "pending",
        "created_at": "2025-09-10T20:15:31.097865",
        "address": "World Trade Center, Colombo",
        "coordinate": {
          "lat": 6.935,
          "lng": 79.8433
        }
      },
      {
        "order_id": 24,
        "client_id": 1,
        "route_id": 2,
        "product": "electronics",
        "quantity": 3,
        "status": "pending",
        "created_at": "2025-09-10T20:14:31.097865",
        "address": "Unity Plaza, Bambalapitiya",
        "coordinate": {
          "lat": 6.8897,
          "lng": 79.8567
        }
      },
      {
        "order_id": 23,
        "client_id": 1,
        "route_id": 2,
        "product": "jbl speakers",
        "quantity": 5,
        "status": "pending",
        "created_at": "2025-09-10T20:13:31.097865",
        "address": "Mount Lavinia Hotel",
        "coordinate": {
          "lat": 6.8302,
          "lng": 79.8618
        }
      }
    ]
  }
}
```

## GET:/ros/driver/routes/{driverId}

req

```bash
curl -X GET http://localhost:8290/ros/driver/routes/2\
-H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

res

```json
{
  "status": "success",
  "message": "Route optimized successfully",
  "optimization_summary": {
    "total_orders": 5,
    "total_distance_km": 8762.15,
    "algorithm_used": "nearest_neighbor"
  },
  "optimized_route": {
    "orders": [
      {
        "order_id": 11,
        "client_id": 1,
        "route_id": 2,
        "created_at": "2025-09-09T07:18:11.251088",
        "address": "789 Kandy Road, Kadawatha",
        "coordinate": {
          "lat": 7.0078,
          "lng": 79.9553
        },
        "product": "Example Product",
        "quantity": 2,
        "status": "loaded"
      },
      {
        "order_id": 14,
        "client_id": 1,
        "route_id": 2,
        "created_at": "2025-09-10T17:48:18.401773",
        "address": "321 Negombo Road, Ja-Ela",
        "coordinate": {
          "lat": 7.0744,
          "lng": 79.8947
        },
        "product": "foot ball",
        "quantity": 10,
        "status": "loaded"
      },
      {
        "order_id": 23,
        "client_id": 1,
        "route_id": 2,
        "created_at": "2025-09-10T20:13:31.097865",
        "address": "Colombo Fort Railway Station, Colombo",
        "coordinate": {
          "lat": 6.9344,
          "lng": 79.8428
        },
        "product": "keyboard",
        "quantity": 5,
        "status": "loaded"
      }
    ]
  }
}
```

## GET:/wms/updateOrderStatus/{orderId}/{Status}
<!-- orderId and Status are path params -->

req

```bash
curl -X GET http://localhost:8290/wms/updateOrderStatus/12/loaded\
-H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

res

```json
{
  "id": 12,
  "clientId": 1,
  "routeId": 3,
  "product": "speaker",
  "quantity": 6,
  "status": "loaded",
  "address": "123 Main Street, Colombo 01",
  "createdAt": [2025, 9, 10, 11, 11, 57, 732964000]
}
```











<!-- ----------------------------------------------------------------------------- -->

# CMS End Point Spec

PORT: 3000
HOST: http://localhost

## POST:/auth/login

req

```xml
<login>
    <email>driver1@swift.com</email>
    <password>hashpass1</password>
</login>
```

res

```xml
<?xml version="1.0"?>
<response>
    <status>success</status>
    <message>Login successful</message>
    <user>
        <id>1</id>
        <email>driver1@swift.com</email>
    </user>
    <sessionToken>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkcml2ZXIxQHN3aWZ0LmNvbSIsImlhdCI6MTc1NzIzMDIwNCwiZXhwIjoxNzU3MjMzODA0fQ.u9sRnlih6k2BBsPy1rxQpQyM9K8Nt-WeYIITHuPiXaA</sessionToken>
</response>
```

## POST:/orders/createOrder

req

```xml
curl -X POST http://localhost:3000/orders/createOrder \
  -H "Content-Type: application/xml" \
  -H "Authorization: Bearer token" \
  -d '
  <order>
  <product>blueberry</product>
  <quantity>2</quantity>
  <address>123 Main Street, Colombo</address>
  <route_id>1</route_id>
  <coordinates>
    <lat>6.9271</lat>
    <lng>79.8612</lng>
  </coordinates>
</order>'
<!-- with bearer token  -->
```

res

```xml
<?xml version="1.0"?>
<response>
  <status>success</status>
  <message>Order placed successfully</message>
  <order>
    <id>17</id>
    <client_id>1</client_id>
    <product>blue berry</product>
    <quantity>2</quantity>
    <status>pending</status>
    <address>123 Main Street, Colombo</address>
    <coordinate/>
    <route_id>1</route_id>
    <created_at>2025-09-10T19:33:37.929696</created_at>
  </order>
</response>
```

<!-- ---------------------------------------------------------------------------------------- -->

# ROS END Point spec

PORT:8000
HOST: http://localhost

<!-- route optimizaion -->
<!-- end point for optimize route -->

## POST:/optimize-coordinates

req

```bash
curl -X POST http://localhost:8000/optimize-coordinates \
  -H "Content-Type: application/json" \
  -d '{
    "response": {
        "status": "success",
        "orders": {
            "order": [
                {
                    "order_id": 23,
                    "client_id": 1,
                    "route_id": 2,
                    "product": "jbl speakers",
                    "quantity": 5,
                    "status": "pending",
                    "created_at": "2025-09-10T20:13:31.097865",
                    "address": "Mount Lavinia Hotel",
                    "coordinate": {
                        "lat": 6.8302,
                        "lng": 79.8618
                    }
                },
                {
                    "order_id": 24,
                    "client_id": 1,
                    "route_id": 2,
                    "product": "electronics",
                    "quantity": 3,
                    "status": "pending",
                    "created_at": "2025-09-10T20:14:31.097865",
                    "address": "Unity Plaza, Bambalapitiya",
                    "coordinate": {
                        "lat": 6.8897,
                        "lng": 79.8567
                    }
                },
                {
                    "order_id": 25,
                    "client_id": 1,
                    "route_id": 2,
                    "product": "office supplies",
                    "quantity": 10,
                    "status": "pending",
                    "created_at": "2025-09-10T20:15:31.097865",
                    "address": "World Trade Center, Colombo",
                    "coordinate": {
                        "lat": 6.9350,
                        "lng": 79.8433
                    }
                }
            ]
        }
    }
}'
```

res

```json
curl -X POST http://localhost:8000/api/v1/routes/optimize-coordinates \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "message": "Route optimized successfully",
    "optimization_summary": {
        "total_orders": 5,
        "total_distance_km": 12.05,
        "algorithm_used": "nearest_neighbor"
    },
    "optimized_route": {
        "orders": [
            {
                "order_id": 22,
                "client_id": 1,
                "route_id": 2,
                "product": "sports equipment",
                "quantity": 5,
                "status": "pending",
                "created_at": "2025-09-10T20:12:21.435007",
                "address": "Galle Face Green, Colombo",
                "coordinate": {
                    "lat": 6.9271,
                    "lng": 79.8425
                }
            },
            {
                "order_id": 24,
                "client_id": 1,
                "route_id": 2,
                "product": "electronics",
                "quantity": 3,
                "status": "pending",
                "created_at": "2025-09-10T20:14:31.097865",
                "address": "Unity Plaza, Bambalapitiya",
                "coordinate": {
                    "lat": 6.8897,
                    "lng": 79.8567
                }
            },
            {
                "order_id": 23,
                "client_id": 1,
                "route_id": 2,
                "product": "jbl speakers",
                "quantity": 5,
                "status": "pending",
                "created_at": "2025-09-10T20:13:31.097865",
                "address": "Mount Lavinia Hotel",
                "coordinate": {
                    "lat": 6.8302,
                    "lng": 79.8618
                }
            }
        ]
    }
}'
```

<!-- -------------------------------------------------------------------------------------- -->

# WMS End Point Spec

PORT: 9000
HOST: http://localhost

# PUT:/api/wms/orders/{orderId}/{status}

req

```bash
curl -X PUT http://localhost:9000/api/wms/orders/12/pending"
```

res

```json
{
  "id": 12,
  "clientId": 1,
  "routeId": 3,
  "product": "speaker",
  "quantity": 6,
  "status": "pending",
  "address": "123 Main Street, Colombo 01",
  "createdAt": [2025, 9, 10, 11, 11, 57, 732964000]
}
```
