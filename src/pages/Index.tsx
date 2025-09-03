import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import QuickActions from "@/components/QuickActions";
import RecentShipments from "@/components/RecentShipments";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
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
  );
};

export default Index;
