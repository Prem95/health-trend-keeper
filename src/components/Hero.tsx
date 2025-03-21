
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
    <section className="relative min-h-screen section pt-32 pb-20 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 max-w-xl">
            <h1 className="hero-animate opacity-0 text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Live the life you <br />
              <span className="italic">envision</span>
            </h1>
            
            <p className="hero-animate opacity-0 text-lg md:text-xl text-gray-700 max-w-md">
              Break the routine. Test the life you crave with AI-generated daily plans tailored to your ideal future.
            </p>
            
            <div className="hero-animate opacity-0 pt-4">
              <Link to="/login">
                <button className="btn-outline rounded-md text-base font-semibold cursor-hover">
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
              className="w-full max-w-md rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
