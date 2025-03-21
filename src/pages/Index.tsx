
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Add scroll-triggered animation observer
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.reveal');
      
      elements.forEach((el, index) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          // Add staggered delay based on element index
          setTimeout(() => {
            el.classList.add('is-visible');
          }, index * 100);
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <section className="py-16 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-8 reveal">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Take Control of Your Health Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Our medical platform puts you at the center of your healthcare decisions, providing personalized insights and secure access to your complete medical history.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
