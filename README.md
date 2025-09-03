# SwiftTrack - Courier Service Portal

A modern client web portal for a courier platform built with React, TypeScript, Tailwind CSS, and Vite. Features real-time tracking, order management, and live driver location updates.

## 🚀 Features

- **Authentication**: Secure login with demo users
- **Dashboard**: At-a-glance delivery stats and recent activity
- **Order Management**: Create, track, and manage delivery orders
- **Real-time Tracking**: Live driver location updates with Mapbox integration
- **Notifications**: In-app notification center with toast alerts
- **CSV Export**: Export order data for reporting
- **Responsive Design**: Desktop-first, mobile-friendly interface

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui, Radix UI
- **Maps**: Mapbox GL JS
- **Mock API**: JSON Server
- **Polling**: Custom hooks for real-time updates (3-6s intervals)

## 📋 Prerequisites

- Node.js 18+ and npm
- Mapbox account (token provided)

## 🏃‍♂️ Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Start the mock API server** (in a new terminal):
```bash
npm run mock:server
```

4. **Access the application**:
- Web App: http://localhost:8080
- Mock API: http://localhost:3001

## 🔑 Demo Credentials

- **Client 1**: `client1` / `demo123`
- **Client 2**: `client2` / `demo123`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run mock:server` - Start mock API server
- `npm test` - Run tests

## 🗺 Environment Variables

Create a `.env` file:
```
VITE_API_BASE=http://localhost:3001
VITE_MAPBOX_KEY=pk.eyJ1Ijoia2F2aW5kYWRpbXV0aHUiLCJhIjoiY21mNGI2bzc1MDNuazJscHhsOG5nd2Z2dyJ9.HiZ0XMlEFcfYFeqW5uHRCQ
```

## 🔄 Simulating Real-time Updates

To test polling functionality:

1. Edit `mock-api/db.json` while the app is running
2. Update driver locations in `driver_locations` array
3. Modify order statuses and timeline events
4. Changes will appear in the app within 3-6 seconds

## 🧪 Testing

Run unit tests:
```bash
npm test
```

## 📱 Pages Overview

1. **Login** - Authentication with demo users
2. **Dashboard** - Stats, quick tracking, recent activity
3. **New Order** - Complete order creation form
4. **My Orders** - List with search, filters, pagination, CSV export
5. **Single Order** - Detailed view with live map, timeline, proof upload
6. **Notifications** - In-app notification center

## 🌐 Production Deployment

1. Build the project: `npm run build`
2. Serve the `dist` folder with any static hosting service
3. Replace `VITE_API_BASE` with your production API URL

## 🔧 Customization

- **Polling Interval**: Modify in `src/hooks/usePolling.tsx`
- **Mock Data**: Edit `mock-api/db.json`
- **Styling**: Update `src/index.css` and `tailwind.config.ts`
- **API Endpoints**: Replace mock calls in query functions

---

Built with ❤️ using modern web technologies