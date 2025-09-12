import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import QuickActions from "@/components/QuickActions";
import RecentShipments from "@/components/RecentShipments";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <QuickActions />
          <RecentShipments />
          <ServicesSection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Index;
