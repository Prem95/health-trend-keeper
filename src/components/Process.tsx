
import { useEffect } from "react";

const processSteps = [
  {
    number: "01",
    title: "Current Life",
    description: "Share your current reality, work situation, and what makes you feel stuck or fulfilled."
  },
  {
    number: "02",
    title: "Ideal Future",
    description: "Describe your perfect career, habits, location, and the mindset you aspire to cultivate."
  },
  {
    number: "03",
    title: "Future Day",
    description: "Follow an AI-generated daily plan that bridges the gap between your current and ideal life."
  },
  {
    number: "04",
    title: "Reflection",
    description: "Journal about your experience and refine your vision based on what felt authentic."
  }
];

const Process = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".process-animate");
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
    <section className="section py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-20">
          <div className="process-animate opacity-0">
            <h2 className="text-4xl font-bold mb-4">The Process</h2>
          </div>
          <div className="process-animate opacity-0">
            <p className="text-lg text-gray-700">
              LifePulse guides you through a journey of self-discovery and practical experimentation, helping you bridge the gap between imagination and reality.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-x-24 gap-y-16">
          {processSteps.map((step, index) => (
            <div key={step.number} className="process-animate opacity-0">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{step.number} {step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
