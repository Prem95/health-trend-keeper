
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonCustom } from "./ui/button-custom";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply animation classes once on component mount
    const elements = document.querySelectorAll('.hero-animate');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
        el.classList.remove('opacity-0');
      }, index * 150);
    });
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
      {/* Medical-themed gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute top-1/4 right-1/5 -z-10 w-72 h-72 bg-gradient-to-r from-teal-200 to-blue-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 left-1/5 -z-10 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="hero-animate opacity-0 transition-all duration-700 ease-out">
          <span className="inline-block text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1.5 rounded-full mb-4">
            Medical Intelligence
          </span>
        </div>
        
        <h1 className="hero-animate opacity-0 transition-all duration-700 delay-100 ease-out text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto leading-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Your Medical Autonomy, <br/>Centered on <span className="relative">YOU
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"></span>
          </span>
        </h1>
        
        <p className="hero-animate opacity-0 transition-all duration-700 delay-200 ease-out text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance mt-6">
          Take control of your health journey with personalized insights and intelligent monitoring. Your medical data, simplified and accessible.
        </p>
        
        <div className="hero-animate opacity-0 transition-all duration-700 delay-300 ease-out flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link to="/login">
            <ButtonCustom size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Get Started
            </ButtonCustom>
          </Link>
          <ButtonCustom variant="outline" size="lg" className="w-full sm:w-auto">
            Learn More
          </ButtonCustom>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center hero-animate opacity-0 transition-all duration-700 delay-400 ease-out">
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
