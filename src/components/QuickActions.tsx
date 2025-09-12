import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, FileText, MapPin, User, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const QuickActions = () => {
  const { user } = useAuth();
  
  // Actions for logged-in customers
  const customerActions = [
    {
      icon: Package,
      title: "Create New Order",
      description: "Set up a new shipment with delivery details",
      link: "/orders/new",
      variant: "default" as const
    },
    {
      icon: FileText,
      title: "View My Orders",
      description: "Track and manage all your shipments",
      link: "/orders",
      variant: "secondary" as const
    },
    {
      icon: MapPin,
      title: "Track Packages",
      description: "Real-time tracking of your deliveries",
      link: "/dashboard",
      variant: "outline" as const
    },
    {
      icon: Calendar,
      title: "Order History",
      description: "Review past shipments and invoices",
      link: "/orders",
      variant: "outline" as const
    }
  ];

  // Actions for logged-in drivers
  const driverActions = [
    {
      icon: Package,
      title: "View Orders",
      description: "Check assigned deliveries and pickups",
      link: "/driver/orders",
      variant: "default" as const
    },
    {
      icon: MapPin,
      title: "Route Planning",
      description: "Optimize your delivery route",
      link: "/driver/route",
      variant: "secondary" as const
    },
    {
      icon: FileText,
      title: "Dashboard",
      description: "View stats and daily overview",
      link: "/driver/dashboard",
      variant: "outline" as const
    },
    {
      icon: Truck,
      title: "Delivery Status",
      description: "Update package delivery status",
      link: "/driver/orders",
      variant: "outline" as const
    }
  ];

  // Actions for guest users
  const guestActions = [
    {
      icon: Package,
      title: "Ship a Package",
      description: "Create an account and start shipping",
      link: "/login",
      variant: "default" as const
    },
    {
      icon: User,
      title: "Customer Portal",
      description: "Access your dashboard and orders",
      link: "/login",
      variant: "secondary" as const
    },
    {
      icon: Truck,
      title: "Driver Portal",
      description: "Login to manage deliveries",
      link: "/driver/login",
      variant: "outline" as const
    },
    {
      icon: FileText,
      title: "Get Quote",
      description: "Calculate shipping costs instantly",
      action: "getQuote",
      variant: "outline" as const
    }
  ];

  const getActions = () => {
    if (!user) return guestActions;
    return user.role === 'driver' ? driverActions : customerActions;
  };

  const handleQuoteClick = () => {
    alert("Quote Calculator: Enter package details (weight: 2kg, dimensions: 30x20x15cm, distance: 50km) = Estimated cost: $25.99");
  };

  const getTitle = () => {
    if (!user) return "Get Started with SwiftCourier";
    return user.role === 'driver' ? "Driver Quick Actions" : "Manage Your Shipments";
  };

  const getDescription = () => {
    if (!user) return "Choose an option to begin using our courier services";
    return user.role === 'driver' 
      ? "Access your driver tools and manage deliveries" 
      : "Everything you need for your shipping requirements";
  };

  const actions = getActions();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{getTitle()}</h2>
          <p className="text-muted-foreground">
            {getDescription()}
          </p>
          {user && (
            <p className="text-sm text-muted-foreground mt-2">
              Logged in as: <span className="font-medium">{user.name}</span> 
              <span className="ml-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                {user.role === 'driver' ? 'Driver' : 'Customer'}
              </span>
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((item, index) => (
            <Card key={index} className="text-center hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {item.link ? (
                  <Link to={item.link}>
                    <Button variant={item.variant} className="w-full">
                      {item.title.includes('New') ? 'Create Order' : 
                       item.title.includes('View') || item.title.includes('Check') ? 'View' :
                       item.title.includes('Portal') ? 'Login' :
                       item.title.includes('Route') ? 'Plan Route' :
                       item.title.includes('Track') ? 'Track Now' :
                       item.title.includes('History') ? 'View History' :
                       item.title.includes('Status') ? 'Update Status' :
                       item.title.includes('Dashboard') ? 'Go to Dashboard' :
                       'Get Started'}
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant={item.variant} 
                    className="w-full"
                    onClick={item.action === 'getQuote' ? handleQuoteClick : undefined}
                  >
                    Get Quote
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;