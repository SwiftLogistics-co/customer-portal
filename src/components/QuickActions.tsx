import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, FileText, MapPin } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: Package,
      title: "Ship a Package",
      description: "Create a new shipment with our easy-to-use form",
      action: "Ship Now",
      variant: "default" as const
    },
    {
      icon: Calendar,
      title: "Schedule Pickup",
      description: "Arrange for package collection at your location",
      action: "Schedule",
      variant: "secondary" as const
    },
    {
      icon: FileText,
      title: "Get Quote",
      description: "Calculate shipping costs for your package",
      action: "Get Quote",
      variant: "outline" as const
    },
    {
      icon: MapPin,
      title: "Find Locations",
      description: "Locate drop-off points and service centers",
      action: "Find Now",
      variant: "outline" as const
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">
            Everything you need for your shipping requirements
          </p>
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
                <Button variant={item.variant} className="w-full">
                  {item.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;