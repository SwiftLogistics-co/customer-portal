import { Truck, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-6 w-6" />
              <span className="text-xl font-bold">SwiftCourier</span>
            </div>
            <p className="text-background/80 mb-4">
              Reliable courier services for all your shipping needs. Fast, secure, and affordable.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Track Package</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Ship Now</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Rate Calculator</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Find Locations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Express Delivery</a></li>
              <li><a href="#" className="hover:text-background transition-colors">International Shipping</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Bulk Shipping</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Packaging Services</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-background/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1-800-SWIFT-01</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@swiftcourier.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
          <p>&copy; 2024 SwiftCourier. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;