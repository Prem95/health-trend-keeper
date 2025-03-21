import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/lib/db";
import { toast } from "sonner";
import UploadForm from "@/components/UploadForm";
import { ButtonCustom } from "@/components/ui/button-custom";

interface ExtractedMetric {
  type: string;
  value: number;
  unit: string;
  confidence: number;
}

const ReportUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedMetrics, setExtractedMetrics] = useState<ExtractedMetric[]>([]);
  const [reportSummary, setReportSummary] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lowConfidenceMetrics, setLowConfidenceMetrics] = useState<string[]>([]);
  const [metricOverrides, setMetricOverrides] = useState<Record<string, string>>({});
  const [authChecking, setAuthChecking] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const authed = await isAuthenticated();
        if (!authed) {
          toast.error("Please sign in to upload reports");
          navigate("/login");
          return;
        }
        setAuthChecking(false);
      } catch (error) {
        toast.error("Authentication error. Please login again.");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Handle file upload
  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setExtractedMetrics([]);
      setReportSummary("");
      setUploadSuccess(false);
      setLowConfidenceMetrics([]);
      setMetricOverrides({});

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found");
      }

      // Create a unique file name for the upload
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `reports/${user.id}/${fileName}`;

      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Process the uploaded file
      await processReport(filePath, file.type);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to upload report");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Process the uploaded report
  const processReport = async (filePath: string, fileType: string) => {
    try {
      setIsProcessing(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found");
      }

      // Get the file URL
      const { data: fileData } = await supabase.storage
        .from('reports')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

      if (!fileData?.signedUrl) {
        throw new Error("Failed to get file URL");
      }

      // Call API to process the report
      const response = await fetch('/api/upload-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: fileData.signedUrl,
          fileType,
          userId: user.id,
          filePath,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process report");
      }

      const result = await response.json();
      
      // Set extracted metrics and summary
      setExtractedMetrics(result.metrics);
      setReportSummary(result.summary);
      
      // Check for low confidence metrics
      const lowConfidence = result.metrics
        .filter((metric: ExtractedMetric) => metric.confidence < 0.7)
        .map((metric: ExtractedMetric) => metric.type);
      
      setLowConfidenceMetrics(lowConfidence);
      
      // Set upload success
      setUploadSuccess(true);
      toast.success("Report uploaded and processed successfully");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to process report");
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  // Handle metric override changes
  const handleMetricChange = (metricType: string, value: string) => {
    setMetricOverrides({
      ...metricOverrides,
      [metricType]: value,
    });
  };

  // Handle save and finish
  const handleSaveAndFinish = async () => {
    try {
      // Update any overridden metrics
      const updatedMetrics = extractedMetrics.map(metric => {
        if (metricOverrides[metric.type]) {
          return {
            ...metric,
            value: parseFloat(metricOverrides[metric.type]),
            confidence: 1.0, // User-provided value has 100% confidence
          };
        }
        return metric;
      });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found");
      }

      // Save report to database
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          upload_timestamp: new Date().toISOString(),
          file_url: `reports/${user.id}/${user.id}_${Date.now()}`, // This should match the uploaded file path
          summary: reportSummary,
        })
        .select('id')
        .single();

      if (reportError) throw reportError;

      // Save metrics to database
      const metricsToInsert = updatedMetrics.map(metric => ({
        user_id: user.id,
        report_id: reportData?.id,
        metric_type: metric.type,
        value: metric.value,
        source: 'report',
        timestamp: new Date().toISOString(),
      }));

      const { error: metricsError } = await supabase
        .from('measurements')
        .insert(metricsToInsert);

      if (metricsError) throw metricsError;

      toast.success("Report and metrics saved successfully");
      navigate('/reports');
      
    } catch (error: any) {
      toast.error(error.message || "Failed to save report");
    }
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Medical Report</h1>
        <p className="text-gray-600 mb-8">
          Upload your medical report as a PDF, JPG, or PNG file. We'll extract key health metrics automatically.
        </p>

        {!uploadSuccess ? (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <UploadForm 
              onUpload={handleUpload}
              isUploading={isUploading}
              progress={uploadProgress}
            />
            
            {isProcessing && (
              <div className="mt-8 text-center">
                <div className="animate-pulse text-indigo-600 mb-2">
                  Processing your report...
                </div>
                <div className="text-sm text-gray-500">
                  We're extracting health metrics and generating a summary. This may take a minute.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
              <p className="text-gray-700 whitespace-pre-line">{reportSummary}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Extracted Health Metrics</h2>
              
              {extractedMetrics.length === 0 ? (
                <p className="text-gray-500">No metrics could be extracted from this report.</p>
              ) : (
                <div className="space-y-4">
                  {extractedMetrics.map((metric, index) => {
                    const isLowConfidence = lowConfidenceMetrics.includes(metric.type);
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg ${
                          isLowConfidence ? "bg-red-50 border border-red-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">
                              {metric.type.split('_').join(' ')}
                              {isLowConfidence && (
                                <span className="ml-2 text-xs text-red-500 font-normal">
                                  (Low confidence detection)
                                </span>
                              )}
                            </h3>
                            
                            {!isLowConfidence && (
                              <p className="text-lg font-bold text-indigo-600">
                                {metric.value} {metric.unit}
                              </p>
                            )}
                          </div>
                          
                          {isLowConfidence && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.1"
                                placeholder="Enter correct value"
                                value={metricOverrides[metric.type] || ""}
                                onChange={(e) => handleMetricChange(metric.type, e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <span className="text-gray-500">{metric.unit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <ButtonCustom
                  variant="gradient"
                  onClick={handleSaveAndFinish}
                >
                  Save and Finish
                </ButtonCustom>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/reports')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUpload; 