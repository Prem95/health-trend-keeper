import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/lib/db";
import { toast } from "sonner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        toast.error("Please sign in to access the dashboard");
        navigate("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Reports</h2>
              <p className="text-gray-500">Upload and view your medical reports</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Manage Reports
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
              <p className="text-gray-500">Track changes in your health metrics over time</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                View Charts
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Health Assistant</h2>
              <p className="text-gray-500">Ask questions about your health data</p>
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Open Chat
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-500">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 