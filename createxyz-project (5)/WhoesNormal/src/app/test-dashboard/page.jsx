"use client";
import React from "react";

function MainComponent() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState("all");
  const [runningTests, setRunningTests] = useState(false);

  const components = [
    { id: "auth", name: "Authentication" },
    { id: "session", name: "Session Management" },
    { id: "permissions", name: "Permissions" },
    { id: "security", name: "Security Features" },
  ];

  const runTests = async (componentId = "all") => {
    setRunningTests(true);
    setError(null);
    try {
      const response = await fetch("/api/tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ component: componentId }),
      });

      if (!response.ok) {
        throw new Error(`Error running tests: ${response.statusText}`);
      }

      const data = await response.json();
      setTestResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Failed to run tests");
      setTestResults([]);
    } finally {
      setRunningTests(false);
    }
  };

  useEffect(() => {
    runTests(selectedComponent);
  }, [selectedComponent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Authentication Test Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and run tests for authentication components
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {components &&
            components.map((component) => (
              <button
                key={component.id}
                onClick={() => setSelectedComponent(component.id)}
                className={`p-4 rounded-xl shadow-lg transition-colors ${
                  selectedComponent === component.id
                    ? "bg-[#357AFF] text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <h3 className="font-semibold mb-2">{component.name}</h3>
                <div className="text-sm opacity-80">Click to run tests</div>
              </button>
            ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Test Results</h2>
            <button
              onClick={() => runTests(selectedComponent)}
              disabled={runningTests}
              className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE] transition-colors disabled:opacity-50"
            >
              {runningTests ? (
                <span>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Running...
                </span>
              ) : (
                <span>
                  <i className="fas fa-play mr-2"></i>
                  Run Tests
                </span>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div className="space-y-4">
            {testResults &&
              testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === "passed"
                      ? "border-green-200 bg-green-50"
                      : result.status === "failed"
                      ? "border-red-200 bg-red-50"
                      : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{result.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        result.status === "passed"
                          ? "bg-green-200 text-green-800"
                          : result.status === "failed"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{result.message}</p>
                  {result.error && (
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                      {result.error}
                    </pre>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;