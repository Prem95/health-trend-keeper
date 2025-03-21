import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/lib/db";
import { ButtonCustom } from "@/components/ui/button-custom";
import { toast } from "sonner";

// Type definitions
interface WeightRecord {
  id: string;
  timestamp: string;
  value: number;
}

interface ProfileData {
  name: string;
  email: string;
  birthdate: string | null;
  height: number | null;
}

const Profile = () => {
  // Profile data states
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    birthdate: null,
    height: null,
  });
  
  // Weight tracking states
  const [newWeight, setNewWeight] = useState("");
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [savingWeight, setSavingWeight] = useState(false);
  const [loadingWeights, setLoadingWeights] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and fetch data
    const initializeProfile = async () => {
      try {
        // Verify user is authenticated
        const authed = await isAuthenticated();
        if (!authed) {
          toast.error("Please sign in to view your profile");
          navigate("/login");
          return;
        }
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not found");
        }
        
        // Get user profile data
        setProfileData({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          birthdate: user.user_metadata?.birthdate || null,
          height: user.user_metadata?.height || null,
        });
        
        // Fetch weight history
        await fetchWeightHistory();
        
        setAuthChecking(false);
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile");
        navigate("/login");
      }
    };

    initializeProfile();
  }, [navigate]);

  // Fetch weight history from measurements table
  const fetchWeightHistory = async () => {
    try {
      setLoadingWeights(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('measurements')
        .select('id, timestamp, value')
        .eq('user_id', user.id)
        .eq('metric_type', 'weight')
        .eq('source', 'manual')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setWeightHistory(data || []);
    } catch (error: any) {
      toast.error("Failed to load weight history");
      console.error(error);
    } finally {
      setLoadingWeights(false);
    }
  };

  // Handle form submission for profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          birthdate: profileData.birthdate,
          height: profileData.height,
        },
      });
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new weight measurement
  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWeight || isNaN(parseFloat(newWeight)) || parseFloat(newWeight) <= 0) {
      toast.error("Please enter a valid weight value");
      return;
    }
    
    try {
      setSavingWeight(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      const newWeightValue = parseFloat(newWeight);
      
      // Add weight measurement to the database
      const { error } = await supabase
        .from('measurements')
        .insert({
          user_id: user.id,
          metric_type: 'weight',
          value: newWeightValue,
          source: 'manual',
          timestamp: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      // Refresh weight history
      await fetchWeightHistory();
      
      // Clear input field
      setNewWeight("");
      
      toast.success("Weight added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add weight");
    } finally {
      setSavingWeight(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address (cannot be changed)
                </label>
                <input
                  id="email"
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm"
                />
              </div>
              
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="birthdate"
                  type="date"
                  value={profileData.birthdate || ""}
                  onChange={(e) => setProfileData({...profileData, birthdate: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={profileData.height || ""}
                  onChange={(e) => setProfileData({...profileData, height: parseFloat(e.target.value) || null})}
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
                  {loading ? "Saving..." : "Update Profile"}
                </ButtonCustom>
              </div>
            </form>
          </div>
          
          {/* Weight Tracking Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Weight Tracking</h2>
            
            <form onSubmit={handleAddWeight} className="mb-8">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Current Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your current weight"
                  />
                </div>
                
                <ButtonCustom
                  type="submit"
                  variant="gradient"
                  disabled={savingWeight}
                >
                  {savingWeight ? "Saving..." : "Add"}
                </ButtonCustom>
              </div>
            </form>
            
            <h3 className="text-lg font-medium mb-4">Weight History</h3>
            
            {loadingWeights ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : weightHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No weight records found. Add your first measurement above.</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {weightHistory.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {record.value.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 