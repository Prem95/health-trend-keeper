import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  useEffect(() => {
    // Apply animation classes once on component mount
    const elements = document.querySelectorAll('.hero-animate');
    elements.forEach((el) => {
      el.classList.add('fade-in-now');
    });
  }, []);

  return (
    <section className="relative min-h-screen section pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 flex flex-col items-start justify-center mx-auto lg:mx-0 lg:pl-8">
            <h1 className="hero-animate opacity-0 text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 [text-rendering:optimizeLegibility]">
              Track how your health changes <br />
              <span className="italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">autonomously</span>
            </h1>
            
            <p className="hero-animate opacity-0 text-lg md:text-xl text-gray-700 tracking-wide">
              The AI-powered health trend keeper that helps you track your health changes autonomously
            </p>
            
            <div className="hero-animate opacity-0 pt-4">
              <Link to="/login">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-md text-base font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg flex items-center">
                  START YOUR JOURNEY
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
          
          <div className="hero-animate opacity-0 flex justify-center lg:justify-end">
            <img 
              src="/lovable-uploads/0a0d7457-9a84-47a4-a29a-9c581477e7aa.png" 
              alt="Person visualization" 
              className="w-full max-w-md rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
