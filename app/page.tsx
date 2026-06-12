import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ContactSection from "@/components/sections/contact";
import Hero from "@/components/sections/Hero";
import PortfolioSection from "@/components/sections/Portfolio";
import ProcessTimeline from "@/components/sections/process-time";
import Services from "@/components/sections/Services";
import TestimonialsSection from "@/components/sections/testimonials";
import WhyChooseMe from "@/components/sections/WhyChooseMe";

export default function Home() {
  return (
    <div>
      <Header />

       <main>
      <Hero />
      <Services />
      <WhyChooseMe />
      <PortfolioSection />
      <ProcessTimeline />
      <TestimonialsSection />
      <ContactSection /> 
    </main>

      <MobileBottomNav/>
      <Footer/>
    </div>
  );
}
