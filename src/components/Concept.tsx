
import { useEffect } from "react";

const Concept = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".concept-animate");
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
          element.classList.add("fade-in-now");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="section py-24 bg-[#f9f9f9]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="concept-animate opacity-0 order-2 md:order-1 flex justify-center">
            <img 
              src="/lovable-uploads/7db8a3e8-e510-4c14-9431-18cfafe2507b.png" 
              alt="Concept visualization" 
              className="w-full max-w-md"
            />
          </div>
          
          <div className="concept-animate opacity-0 order-1 md:order-2 max-w-lg">
            <h2 className="text-3xl font-bold mb-4">The Concept</h2>
            <p className="text-lg text-gray-700">
              LifePulse bridges the gap between your current reality and your ideal future. We use AI to generate personalized daily plans that let you experience aspects of your dream life today, helping you validate your vision and take practical steps toward making it a reality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Concept;
