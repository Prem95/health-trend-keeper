import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Start animation sequence
    setTimeout(() => setAnimationComplete(true), 500);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-white overflow-hidden">
      {/* Abstract decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-300"></div>
        <div className="absolute bottom-12 left-1/4 w-40 h-40 rounded-full bg-purple-200"></div>
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-blue-200"></div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        {/* Text column */}
        <div className="flex flex-col justify-center">
          <div className={`transition-all duration-1000 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-8">
              Health tracking,
              <span className="block mt-1 text-indigo-600">
                simplified.
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-12 max-w-md">
              Understand your health journey through AI-powered insights from your medical reports.
            </p>
            
            <Link to="/login" className="inline-block">
              <button className="group relative px-8 py-3 bg-indigo-600 text-white font-medium rounded-md overflow-hidden transition-all">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-indigo-800 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
        
        {/* Visual column */}
        <div className="flex items-center justify-center">
          <div className={`transition-all duration-1000 delay-300 ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative">
              {/* Stylized chart visualization */}
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-gray-100 flex items-end justify-center overflow-hidden bg-gray-50">
                <div className="flex items-end space-x-3 pb-12">
                  <div className="w-8 bg-indigo-200 rounded-t-md h-20 animate-pulse"></div>
                  <div className="w-8 bg-indigo-400 rounded-t-md h-32 animate-pulse"></div>
                  <div className="w-8 bg-indigo-600 rounded-t-md h-24 animate-pulse"></div>
                  <div className="w-8 bg-indigo-800 rounded-t-md h-40 animate-pulse"></div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-purple-100 border border-purple-200"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-blue-100 border border-blue-200"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
