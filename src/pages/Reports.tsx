import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/lib/db";
import { toast } from "sonner";
import { ButtonCustom } from "@/components/ui/button-custom";

interface Report {
  id: string;
  upload_timestamp: string;
  file_url: string;
  summary: string;
  metrics?: Metric[];
}

interface Metric {
  id: string;
  metric_type: string;
  value: number;
  source: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and fetch reports
    const initializeReports = async () => {
      try {
        // Verify user is authenticated
        const authed = await isAuthenticated();
        if (!authed) {
          toast.error("Please sign in to view your reports");
          navigate("/login");
          return;
        }
        
        setAuthChecking(false);
        await fetchReports();
      } catch (error: any) {
        toast.error(error.message || "Failed to load reports");
        navigate("/login");
      }
    };

    initializeReports();
  }, [navigate]);

  // Fetch reports from Supabase
  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Fetch reports from the database
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('id, upload_timestamp, file_url, summary')
        .eq('user_id', user.id)
        .order('upload_timestamp', { ascending: false });
      
      if (reportsError) throw reportsError;
      
      // Fetch metrics for each report
      const reportsWithMetrics = await Promise.all(
        (reportsData || []).map(async (report) => {
          const { data: metricsData, error: metricsError } = await supabase
            .from('measurements')
            .select('id, metric_type, value, source')
            .eq('report_id', report.id)
            .eq('user_id', user.id);
            
          if (metricsError) {
            console.error(`Failed to fetch metrics for report ${report.id}:`, metricsError);
            return { ...report, metrics: [] };
          }
          
          return { ...report, metrics: metricsData || [] };
        })
      );
      
      setReports(reportsWithMetrics);
    } catch (error: any) {
      toast.error("Failed to load reports");
      console.error(error);
    } finally {
      setLoading(false);
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

  // Generate a human-readable name for a metric type
  const formatMetricName = (metricType: string) => {
    return metricType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get appropriate unit for a metric type
  const getMetricUnit = (metricType: string) => {
    if (metricType.includes('blood_pressure')) return 'mmHg';
    if (metricType.includes('cholesterol')) return 'mg/dL';
    if (metricType.includes('glucose')) return 'mg/dL';
    if (metricType === 'weight') return 'kg';
    return '';
  };

  // Handle click on view original report button
  const handleViewOriginal = async (fileUrl: string) => {
    try {
      // Generate a signed URL for the file
      const { data, error } = await supabase.storage
        .from('reports')
        .createSignedUrl(fileUrl, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error("Could not generate file URL");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to open report");
    }
  };

  // Navigate to upload page
  const handleUploadNew = () => {
    navigate('/reports/upload');
  };

  // Render loading indicator during auth check
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Medical Reports</h1>
          
          <ButtonCustom 
            variant="gradient"
            onClick={handleUploadNew}
          >
            Upload New Report
          </ButtonCustom>
        </div>
        
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm p-16 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4 text-gray-400">📋</div>
            <h2 className="text-xl font-medium text-gray-700 mb-4">No Reports Found</h2>
            <p className="text-gray-500 mb-8">
              You haven't uploaded any medical reports yet. Upload your first report to start tracking your health metrics.
            </p>
            <ButtonCustom 
              variant="gradient"
              onClick={handleUploadNew}
            >
              Upload Your First Report
            </ButtonCustom>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Uploaded on {formatDate(report.upload_timestamp)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Medical Report
                    </h2>
                  </div>
                  
                  <ButtonCustom
                    variant="outline"
                    onClick={() => handleViewOriginal(report.file_url)}
                  >
                    View Original
                  </ButtonCustom>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Summary
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {report.summary || "No summary available"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Extracted Metrics
                  </h3>
                  
                  {report.metrics && report.metrics.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {report.metrics.map((metric) => (
                        <div 
                          key={metric.id}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="text-sm text-gray-500">
                            {formatMetricName(metric.metric_type)}
                          </div>
                          <div className="text-lg font-bold text-indigo-600">
                            {metric.value} {getMetricUnit(metric.metric_type)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No metrics were extracted from this report
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 