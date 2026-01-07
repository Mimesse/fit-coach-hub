import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrainersSection from "@/components/TrainersSection";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TrainersSection />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
