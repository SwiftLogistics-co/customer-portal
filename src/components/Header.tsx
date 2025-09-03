import { Button } from "@/components/ui/button";
import { Truck, User, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b shadow-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Truck className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">SwiftCourier</span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Track Package
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Ship Now
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            My Account
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Support
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;