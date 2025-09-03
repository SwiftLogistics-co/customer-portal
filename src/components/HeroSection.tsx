import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-hero text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Track Your Package
        </h1>
        <p className="text-xl mb-8 text-white/90">
          Enter your tracking number to get real-time updates
        </p>
        
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Package className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Enter tracking number (e.g. SW123456789)"
              className="pl-10 h-12 text-foreground bg-background"
            />
          </div>
          <Button variant="accent" size="lg" className="h-12 px-8">
            <Search className="h-5 w-5 mr-2" />
            Track Now
          </Button>
        </div>
        
        <p className="mt-4 text-white/80 text-sm">
          Need help? Try tracking number: SW123456789
        </p>
      </div>
    </section>
  );
};

export default HeroSection;