"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repairing, setRepairing] = useState(false);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

  const repairSession = async () => {
    setRepairing(true);
    try {
      const response = await fetch("/api/tests/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to repair: ${response.statusText}`);
      }

      await runTests();
    } catch (err) {
      console.error("Session repair error:", err);
      setError("Failed to repair session");
    } finally {
      setRepairing(false);
    }
  };

  const runTests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Run basic tests first
      const basicResponse = await fetch("/api/tests/basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!basicResponse.ok) {
        throw new Error(
          `Basic tests failed: ${basicResponse.status} ${basicResponse.statusText}`
        );
      }

      const basicData = await basicResponse.json();

      setTestResults(basicData.tests);
      setSummary(basicData.summary);

      // If basic tests pass, run full suite
      if (basicData.summary.failed === 0) {
        const fullResponse = await fetch("/api/tests/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!fullResponse.ok) {
          throw new Error(
            `Full test suite failed: ${fullResponse.status} ${fullResponse.statusText}`
          );
        }

        const fullData = await fullResponse.json();
        if (fullData.error) {
          throw new Error(fullData.error);
        }

        setTestResults([...basicData.tests, ...fullData.tests]);
        setSummary({
          total: basicData.summary.total + fullData.summary.total,
          passed: basicData.summary.passed + fullData.summary.passed,
          failed: basicData.summary.failed + fullData.summary.failed,
        });
      }
    } catch (err) {
      console.error("Test execution error:", err);
      setError(err.message || "Failed to run test suite");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      runTests();
    }
  }, [userLoading]);

  const failedSessionTest = testResults.find(
    (test) => test.name === "Session Access" && !test.passed
  );

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Test Dashboard</h1>
            <div className="flex gap-4">
              {!user && (
                <a
                  href="/account/signin?callbackUrl=/test-dashboard"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </a>
              )}
              {(failedSessionTest || !user) && (
                <button
                  onClick={repairSession}
                  disabled={repairing || loading}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {repairing ? (
                    <span>
                      <i className="fas fa-circle-notch fa-spin mr-2"></i>
                      Repairing Session...
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-wrench mr-2"></i>
                      Repair Session
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={runTests}
                disabled={loading || repairing}
                className="bg-[#357AFF] text-white px-6 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Running Tests...
                  </span>
                ) : (
                  <span>
                    <i className="fas fa-play mr-2"></i>
                    Run Tests
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800">
                  {summary.total}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {summary.passed}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">
                  {summary.failed}
                </div>
                <div className="text-sm text-gray-600">Tests Failed</div>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <div>
              <div className="font-semibold">Error running tests</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Test Results
          </h2>
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  test.passed
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{test.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      test.passed
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {test.passed ? "Passed" : "Failed"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{test.message}</p>
                {!test.passed && test.error && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                    {test.error}
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