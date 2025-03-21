import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/lib/db";
import { ButtonCustom } from "@/components/ui/button-custom";
import { toast } from "sonner";

const UserSetup = () => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        toast.error("Please sign in to complete your profile setup");
        navigate("/login");
      } else {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          birthdate: birthdate || null,
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
        }
      });

      if (error) throw error;

      toast.success("Profile setup completed!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to set up profile");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute top-1/4 right-1/4 -z-10 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 left-1/4 -z-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>

      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's set up your profile to personalize your experience
          </p>
        </div>

        <div className="mt-8 backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-xl border border-blue-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                id="height"
                name="height"
                type="number"
                step="0.1"
                min="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <ButtonCustom
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Complete Setup"}
              </ButtonCustom>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSetup; 