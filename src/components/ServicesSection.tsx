import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Shield, Globe, Zap } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Zap,
      title: "Express Delivery",
      description: "Same-day and next-day delivery options for urgent packages",
      features: ["Same-day delivery", "Real-time tracking", "SMS notifications"]
    },
    {
      icon: Shield,
      title: "Secure Shipping",
      description: "Advanced security measures for valuable and sensitive items",
      features: ["Insurance coverage", "Signature required", "Tamper-proof packaging"]
    },
    {
      icon: Globe,
      title: "International",
      description: "Worldwide shipping with customs clearance support",
      features: ["Global network", "Customs handling", "Door-to-door service"]
    },
    {
      icon: Clock,
      title: "Scheduled Delivery",
      description: "Flexible delivery windows to suit your schedule",
      features: ["Time slots", "Delivery notifications", "Reschedule options"]
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive shipping solutions designed to meet all your delivery needs with reliability and speed
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-card transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;