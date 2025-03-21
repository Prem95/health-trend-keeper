import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/lib/db";
import { toast } from "sonner";

const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const authed = await isAuthenticated();
        if (!authed) {
          toast.error("Please sign in to access the chat");
          navigate("/login");
          return;
        }
        setAuthChecking(false);
        setLoading(false);
      } catch (error) {
        toast.error("Authentication error. Please login again.");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (authChecking || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Chat with Health Assistant</h1>
        
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-xl font-medium text-gray-700 mb-4">Coming Soon</h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            The chat interface is currently under development. Check back soon to ask questions about your health data.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 