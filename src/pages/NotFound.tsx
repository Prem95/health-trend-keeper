
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ButtonCustom } from "@/components/ui/button-custom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="max-w-md mx-auto text-center space-y-6">
          <span className="inline-block text-sm font-medium bg-secondary px-4 py-1.5 rounded-full">
            404 Error
          </span>
          <h1 className="text-4xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been
            moved or doesn't exist.
          </p>
          <div className="pt-4">
            <ButtonCustom asChild size="lg">
              <Link to="/">Return Home</Link>
            </ButtonCustom>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
