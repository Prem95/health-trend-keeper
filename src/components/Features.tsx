
import { useEffect } from "react";
import { Inbox, Command, Wand } from "lucide-react";

const features = [
  {
    icon: <Command className="h-8 w-8" />,
    title: "Intuitive Design",
    description:
      "Crafted with simplicity and function at its core. Every interaction is thoughtfully designed to feel natural and effortless."
  },
  {
    icon: <Wand className="h-8 w-8" />,
    title: "Elegant Experience",
    description:
      "Refined animations and transitions create a sense of elegance and sophistication throughout your journey."
  },
  {
    icon: <Inbox className="h-8 w-8" />,
    title: "Thoughtful Details",
    description:
      "From typography to spacing, every element has been meticulously considered to create a harmonious visual experience."
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
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Crafted with Precision
          </h2>
          <p className="animate-on-scroll delay-100 text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughtfully designed to create experiences that feel both beautiful and functional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`animate-on-scroll delay-${index * 100} bg-secondary/30 rounded-xl p-8 hover-scale`}
            >
              <div className="bg-primary/5 rounded-lg p-3 inline-flex mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 relative animate-on-scroll">
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-secondary flex items-center justify-center">
            <div className="p-12 text-center">
              <h3 className="text-2xl font-bold mb-2">Elegant Design for Every Detail</h3>
              <p className="text-muted-foreground">Experience our design philosophy in action</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
