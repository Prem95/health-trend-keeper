
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 px-10",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-[#E0E0E0]"
          : "bg-transparent"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
        >
          LifePulse
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/login"
            className="text-base font-medium link-underline"
          >
            Log in
          </Link>
          <Link to="/login" className="hidden md:block">
            <button className="btn-outline rounded-md text-base font-medium">
              Start
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 top-[60px] bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col items-center justify-center space-y-8 p-8 h-full">
          <Link
            to="/login"
            className="text-xl font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Log in
          </Link>
          <Link to="/login">
            <button 
              className="btn-outline rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
