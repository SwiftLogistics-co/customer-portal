import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Truck, User, Bell, LogOut, Settings, Package, Route, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'driver' ? '/driver/dashboard' : '/dashboard';
  };

  const getPortalName = () => {
    if (!user) return '';
    return user.role === 'driver' ? 'Driver Portal' : 'Customer Portal';
  };

  return (
    <header className="bg-background border-b shadow-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Truck className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">SwiftCourier</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#tracking" className="text-muted-foreground hover:text-foreground transition-colors">
            Track Package
          </a>
          <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
            Services
          </a>
          {!user && (
            <>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Customer Portal
              </Link>
              <Link to="/driver/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Driver Portal
              </Link>
            </>
          )}
          <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
            Support
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  3
                </Badge>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{user.name}</span>
                    <Badge variant="secondary" className="text-xs hidden lg:block">
                      {user.role === 'driver' ? 'Driver' : 'Customer'}
                    </Badge>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{getPortalName()}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="flex items-center">
                      {user.role === 'driver' ? (
                        <Route className="mr-2 h-4 w-4" />
                      ) : (
                        <Package className="mr-2 h-4 w-4" />
                      )}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'driver' && (
                    <DropdownMenuItem asChild>
                      <Link to="/driver/orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'client' && (
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Customer Login
                </Button>
              </Link>
              <Link to="/driver/login">
                <Button variant="outline" size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Driver Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;