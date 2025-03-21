import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAuthenticated } from "@/lib/db";
import { toast } from "sonner";
import { ButtonCustom } from "@/components/ui/button-custom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Measurement {
  id: string;
  timestamp: string;
  metric_type: string;
  value: number;
  source: string;
}

// Date range options
const DATE_RANGES = [
  { label: "Last Week", days: 7 },
  { label: "Last Month", days: 30 },
  { label: "Last 3 Months", days: 90 },
  { label: "Last Year", days: 365 },
  { label: "All Time", days: 0 },
];

// Threshold values for different metrics
const THRESHOLDS = {
  bloodPressure: {
    systolic: [
      { value: 120, label: "Normal", color: "#10b981" },
      { value: 130, label: "Elevated", color: "#fbbf24" },
      { value: 140, label: "Stage 1", color: "#f97316" },
      { value: 180, label: "Stage 2", color: "#ef4444" },
    ],
    diastolic: [
      { value: 80, label: "Normal", color: "#10b981" },
      { value: 90, label: "Stage 1", color: "#f97316" },
      { value: 120, label: "Stage 2", color: "#ef4444" },
    ],
  },
  cholesterol: {
    ldl: [
      { value: 100, label: "Normal", color: "#10b981" },
      { value: 130, label: "Borderline", color: "#fbbf24" },
      { value: 160, label: "High", color: "#ef4444" },
    ],
    hdl: [
      { value: 40, label: "Low (Men)", color: "#ef4444" },
      { value: 50, label: "Low (Women)", color: "#ef4444" },
      { value: 60, label: "Optimal", color: "#10b981" },
    ],
    total: [
      { value: 200, label: "Desirable", color: "#10b981" },
      { value: 240, label: "Borderline", color: "#fbbf24" },
      { value: 300, label: "High", color: "#ef4444" },
    ],
  },
  glucose: [
    { value: 100, label: "Normal", color: "#10b981" },
    { value: 125, label: "Prediabetes", color: "#fbbf24" },
    { value: 180, label: "Diabetes", color: "#ef4444" },
  ],
};

const Charts = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [selectedRange, setSelectedRange] = useState(DATE_RANGES[1]); // Default to "Last Month"
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and fetch measurements
    const initializeCharts = async () => {
      try {
        // Verify user is authenticated
        const authed = await isAuthenticated();
        if (!authed) {
          toast.error("Please sign in to view your health trends");
          navigate("/login");
          return;
        }
        
        setAuthChecking(false);
        await fetchMeasurements();
      } catch (error: any) {
        toast.error(error.message || "Failed to load health data");
        navigate("/login");
      }
    };

    initializeCharts();
  }, [navigate]);

  // Fetch measurements when date range changes
  useEffect(() => {
    if (!authChecking) {
      fetchMeasurements();
    }
  }, [selectedRange]);

  // Fetch measurements from Supabase
  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Calculate date range
      let startDate: string | null = null;
      if (selectedRange.days > 0) {
        const date = new Date();
        date.setDate(date.getDate() - selectedRange.days);
        startDate = date.toISOString();
      }
      
      // Build query
      let query = supabase
        .from('measurements')
        .select('id, timestamp, metric_type, value, source')
        .eq('user_id', user.id);
      
      // Add date filter if needed
      if (startDate) {
        query = query.gte('timestamp', startDate);
      }
      
      // Execute query
      const { data, error } = await query.order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      setMeasurements(data || []);
    } catch (error: any) {
      toast.error("Failed to load measurement data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const prepareChartData = (metricTypes: string[]) => {
    const data: Record<string, any>[] = [];
    const filteredMeasurements = measurements.filter(m => 
      metricTypes.includes(m.metric_type)
    );
    
    // Group measurements by date (day)
    const measurementsByDate: Record<string, Measurement[]> = {};
    filteredMeasurements.forEach(measurement => {
      const date = new Date(measurement.timestamp).toDateString();
      if (!measurementsByDate[date]) {
        measurementsByDate[date] = [];
      }
      measurementsByDate[date].push(measurement);
    });
    
    // Create data points
    Object.keys(measurementsByDate).forEach(date => {
      const dataPoint: Record<string, any> = { date };
      
      metricTypes.forEach(metricType => {
        const matchingMeasurements = measurementsByDate[date].filter(
          m => m.metric_type === metricType
        );
        
        if (matchingMeasurements.length > 0) {
          // Use the latest measurement for the day
          const latest = matchingMeasurements.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          
          dataPoint[metricType] = latest.value;
        }
      });
      
      data.push(dataPoint);
    });
    
    return data;
  };

  // Format date for x-axis
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get chart title based on metric types
  const getChartTitle = (metricTypes: string[]) => {
    if (metricTypes.includes('blood_pressure_systolic')) return 'Blood Pressure';
    if (metricTypes.includes('cholesterol_total')) return 'Cholesterol';
    if (metricTypes.includes('weight')) return 'Weight';
    if (metricTypes.includes('glucose')) return 'Glucose';
    return 'Health Metrics';
  };

  // Get appropriate color for a line based on metric type
  const getLineColor = (metricType: string) => {
    if (metricType === 'blood_pressure_systolic') return '#ef4444';
    if (metricType === 'blood_pressure_diastolic') return '#3b82f6';
    if (metricType === 'cholesterol_ldl') return '#ef4444';
    if (metricType === 'cholesterol_hdl') return '#10b981';
    if (metricType === 'cholesterol_total') return '#8b5cf6';
    if (metricType === 'weight') return '#f97316';
    if (metricType === 'glucose') return '#fbbf24';
    return '#6b7280';
  };

  // Format metric name for legend
  const formatMetricName = (metricType: string) => {
    return metricType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get thresholds for a specific chart
  const getThresholds = (metricTypes: string[]) => {
    if (metricTypes.includes('blood_pressure_systolic')) {
      return [
        ...THRESHOLDS.bloodPressure.systolic.map(t => ({
          ...t,
          metricType: 'blood_pressure_systolic',
        })),
        ...THRESHOLDS.bloodPressure.diastolic.map(t => ({
          ...t,
          metricType: 'blood_pressure_diastolic',
        })),
      ];
    }
    
    if (metricTypes.includes('cholesterol_total')) {
      return [
        ...THRESHOLDS.cholesterol.ldl.map(t => ({
          ...t,
          metricType: 'cholesterol_ldl',
        })),
        ...THRESHOLDS.cholesterol.hdl.map(t => ({
          ...t,
          metricType: 'cholesterol_hdl',
        })),
        ...THRESHOLDS.cholesterol.total.map(t => ({
          ...t,
          metricType: 'cholesterol_total',
        })),
      ];
    }
    
    if (metricTypes.includes('glucose')) {
      return THRESHOLDS.glucose.map(t => ({
        ...t,
        metricType: 'glucose',
      }));
    }
    
    return [];
  };

  // Create a chart component
  const renderChart = (metricTypes: string[]) => {
    const data = prepareChartData(metricTypes);
    const title = getChartTitle(metricTypes);
    const thresholds = getThresholds(metricTypes);
    
    // Skip rendering if no data
    if (data.length === 0) {
      return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-500">
            No data available for this time period. Upload medical reports or add measurements to see trends.
          </p>
        </div>
      );
    }
    
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="h-72 sm:h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                labelFormatter={(label) => formatDate(label)} 
                formatter={(value, name) => {
                  return [value, formatMetricName(name as string)];
                }}
              />
              <Legend 
                formatter={(value) => formatMetricName(value)} 
                wrapperStyle={{ fontSize: 12, marginTop: 10 }}
              />
              
              {/* Plot lines for each metric */}
              {metricTypes.map(metricType => (
                <Line
                  key={metricType}
                  type="monotone"
                  dataKey={metricType}
                  stroke={getLineColor(metricType)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
              
              {/* Add threshold lines */}
              {thresholds.map((threshold, index) => (
                <ReferenceLine
                  key={`${threshold.metricType}-${index}`}
                  y={threshold.value}
                  stroke={threshold.color}
                  strokeDasharray="3 3"
                  label={{
                    value: `${threshold.label} (${threshold.value})`,
                    position: 'insideBottomRight',
                    fill: threshold.color,
                    fontSize: 10,
                  }}
                  ifOverflow="extendDomain"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Health Trends</h1>
          
          <div className="flex flex-wrap gap-2">
            {DATE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedRange.label === range.label
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Blood Pressure Chart */}
            {renderChart(['blood_pressure_systolic', 'blood_pressure_diastolic'])}
            
            {/* Cholesterol Chart */}
            {renderChart(['cholesterol_ldl', 'cholesterol_hdl', 'cholesterol_total'])}
            
            {/* Weight Chart */}
            {renderChart(['weight'])}
            
            {/* Glucose Chart */}
            {renderChart(['glucose'])}
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts; 