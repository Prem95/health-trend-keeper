
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Process from "@/components/Process";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <Header />
      <main>
        <Hero />
        <Concept />
        <Process />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
