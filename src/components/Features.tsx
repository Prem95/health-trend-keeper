
import { useEffect } from "react";
import { HeartPulse, Shield, Stethoscope } from "lucide-react";

const features = [
  {
    icon: <HeartPulse className="h-8 w-8 text-blue-500" />,
    title: "Smart Health Monitoring",
    description:
      "Continuously track your vital metrics with AI-powered analysis that provides personalized insights and early detection of potential health concerns."
  },
  {
    icon: <Shield className="h-8 w-8 text-indigo-500" />,
    title: "Secure Medical Records",
    description:
      "Your health data is protected with enterprise-grade encryption and security protocols, giving you full control over who accesses your information."
  },
  {
    icon: <Stethoscope className="h-8 w-8 text-purple-500" />,
    title: "Personalized Care Plans",
    description:
      "Receive tailored health recommendations based on your unique medical history, lifestyle factors, and current health status."
  }
];

const Features = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
          element.classList.add("is-visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-white via-blue-50 to-indigo-50"></div>
      <div className="absolute top-1/3 right-1/4 -z-10 w-64 h-64 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/3 left-1/4 -z-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transforming Your Healthcare Experience
          </h2>
          <p className="animate-on-scroll delay-100 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our medical intelligence platform empowers you with the tools to take control of your health journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`animate-on-scroll delay-${index * 100} rounded-xl p-8 hover-scale backdrop-blur-sm bg-white/50 border border-blue-100 shadow-lg shadow-blue-100/20`}
            >
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-3 inline-flex mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 relative animate-on-scroll">
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center shadow-lg border border-blue-100">
            <div className="p-12 text-center">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Health Journey, Reimagined</h3>
              <p className="text-muted-foreground">Intelligent analytics that put you at the center of your healthcare decisions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
