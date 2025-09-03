import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye } from "lucide-react";

const RecentShipments = () => {
  const shipments = [
    {
      id: "SW123456789",
      destination: "New York, NY",
      status: "In Transit",
      statusColor: "bg-primary" as const,
      date: "Dec 15, 2024",
      estimatedDelivery: "Dec 17, 2024"
    },
    {
      id: "SW987654321",
      destination: "Los Angeles, CA",
      status: "Delivered",
      statusColor: "bg-success" as const,
      date: "Dec 12, 2024",
      estimatedDelivery: "Dec 14, 2024"
    },
    {
      id: "SW456789123",
      destination: "Chicago, IL",
      status: "Processing",
      statusColor: "bg-accent" as const,
      date: "Dec 16, 2024",
      estimatedDelivery: "Dec 18, 2024"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Recent Shipments</h2>
            <p className="text-muted-foreground">Track your latest packages</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid gap-6">
          {shipments.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{shipment.id}</h3>
                      <p className="text-muted-foreground">To: {shipment.destination}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`${shipment.statusColor} text-white mb-2`}>
                      {shipment.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Shipped: {shipment.date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Est. Delivery: {shipment.estimatedDelivery}
                    </p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentShipments;