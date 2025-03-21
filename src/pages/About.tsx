
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="animate-on-scroll inline-block text-sm font-medium bg-secondary px-4 py-1.5 rounded-full mb-4">
                About Us
              </span>
              <h1 className="animate-on-scroll text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Our Philosophy
              </h1>
              <p className="animate-on-scroll delay-100 text-lg text-muted-foreground max-w-2xl mx-auto">
                Committed to creating experiences that blend form and function in perfect harmony.
              </p>
            </div>

            <div className="animate-on-scroll delay-200 space-y-8">
              <p className="text-lg">
                At Minimal, we believe in the power of simplicity. Our approach to design is guided by principles 
                that prioritize clarity, functionality, and thoughtful details. We create experiences that are 
                intuitive and elegant, focusing on what truly matters.
              </p>
              
              <p className="text-lg">
                Every element we design is carefully considered and serves a purpose. We eliminate unnecessary 
                complexity and focus on creating solutions that feel effortless to use. This philosophy extends 
                to everything we do, from our user interfaces to our company culture.
              </p>
              
              <blockquote className="border-l-4 border-primary pl-4 py-2 my-8 text-xl italic">
                "Design is not just what it looks like and feels like. Design is how it works."
              </blockquote>
              
              <p className="text-lg">
                We're a team of designers, developers, and thinkers who are passionate about creating products 
                that make a difference. Our work is driven by a deep understanding of our users and a commitment 
                to excellence in everything we do.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="animate-on-scroll text-3xl font-bold tracking-tight mb-4">
                Our Values
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="animate-on-scroll bg-background rounded-xl p-8 hover-scale">
                <h3 className="text-xl font-semibold mb-3">Simplicity</h3>
                <p className="text-muted-foreground">
                  We embrace simplicity in all aspects of our work, focusing on what truly matters.
                </p>
              </div>
              
              <div className="animate-on-scroll delay-100 bg-background rounded-xl p-8 hover-scale">
                <h3 className="text-xl font-semibold mb-3">Attention to Detail</h3>
                <p className="text-muted-foreground">
                  We believe that the smallest details can make the biggest difference.
                </p>
              </div>
              
              <div className="animate-on-scroll delay-200 bg-background rounded-xl p-8 hover-scale">
                <h3 className="text-xl font-semibold mb-3">User-Centered</h3>
                <p className="text-muted-foreground">
                  Everything we create is designed with the user's needs and experiences in mind.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
