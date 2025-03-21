
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { ButtonCustom } from "./ui/button-custom";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    const elements = document.querySelectorAll(".hero-animate");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(240,244,247,0.8)_0%,rgba(255,255,255,0)_70%)]"></div>
      
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="hero-animate opacity-0">
          <span className="inline-block text-sm font-medium bg-secondary px-4 py-1.5 rounded-full mb-4">
            Beautifully Simple
          </span>
        </div>
        
        <h1 className="hero-animate opacity-0 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto leading-tight">
          Create experiences that truly matter.
        </h1>
        
        <p className="hero-animate opacity-0 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance mt-6">
          Designed with precision and built with clarity. Experience a new level of design that focuses on what truly matters.
        </p>
        
        <div className="hero-animate opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <ButtonCustom size="lg" className="w-full sm:w-auto">
            Get Started
          </ButtonCustom>
          <ButtonCustom variant="outline" size="lg" className="w-full sm:w-auto">
            Learn More
          </ButtonCustom>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center hero-animate opacity-0">
        <button 
          onClick={scrollToFeatures}
          className="animate-bounce p-2 rounded-full transition-colors hover:bg-secondary/60"
          aria-label="Scroll down"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default Hero;
