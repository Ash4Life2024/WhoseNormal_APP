"use client";
import React from "react";

function MainComponent() {
  const [systemHealth, setSystemHealth] = useState({
    status: "healthy",
    uptime: "99.9%",
    lastChecked: new Date().toISOString(),
  });
  const [errors, setErrors] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchSystemData = async () => {
      setLoading(true);
      try {
        const [healthRes, errorsRes, testsRes] = await Promise.all([
          fetch("/api/system/health", { method: "POST" }),
          fetch("/api/error-resolver", { method: "POST" }),
          fetch("/api/tests/results", { method: "POST" }),
        ]);

        if (!healthRes.ok || !errorsRes.ok || !testsRes.ok) {
          throw new Error("Failed to fetch system data");
        }

        const [healthData, errorsData, testsData] = await Promise.all([
          healthRes.json(),
          errorsRes.json(),
          testsRes.json(),
        ]);

        setSystemHealth(healthData);
        setErrors(errorsData.errors || []);
        setTestResults(testsData.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            System Management
          </h1>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                systemHealth.status === "healthy"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              <i
                className={`fas fa-circle ${
                  systemHealth.status === "healthy"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              ></i>
              <span className="capitalize">{systemHealth.status}</span>
            </div>
            <div className="text-gray-600">Uptime: {systemHealth.uptime}</div>
            <div className="text-gray-600">
              Last Updated:{" "}
              {new Date(systemHealth.lastChecked).toLocaleString()}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {["overview", "errors", "tests", "contacts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? "text-[#357AFF] border-b-2 border-[#357AFF]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage</span>
                      <span>2.4GB/8GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage</span>
                      <span>67%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Active Users</h3>
                  <div className="text-3xl font-bold text-[#357AFF]">1,234</div>
                  <p className="text-gray-600">Current active sessions</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
                  <div className="space-y-2">
                    {errors.slice(0, 3).map((error, index) => (
                      <div key={index} className="text-sm text-red-600">
                        {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "errors" && (
              <div className="space-y-4">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{error.type}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(error.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{error.message}</p>
                    <div className="mt-2">
                      <button className="text-sm text-[#357AFF] hover:underline">
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tests" && (
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div
                    key={index}
                    className={`border-l-4 ${
                      test.status === "passed"
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    } p-4 rounded-r-lg`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{test.name}</span>
                      <span
                        className={`capitalize ${
                          test.status === "passed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {test.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{test.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "contacts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">
                    Emergency Contacts
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-phone text-[#357AFF]"></i>
                      <div>
                        <div className="font-medium">System Administrator</div>
                        <div className="text-gray-600">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-envelope text-[#357AFF]"></i>
                      <div>
                        <div className="font-medium">Technical Support</div>
                        <div className="text-gray-600">support@example.com</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">
                    Escalation Path
                  </h3>
                  <ol className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <div className="bg-[#357AFF] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        1
                      </div>
                      <span>First Line Support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-[#357AFF] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        2
                      </div>
                      <span>Technical Lead</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-[#357AFF] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        3
                      </div>
                      <span>System Administrator</span>
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;