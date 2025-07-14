"use client";
import React from "react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiSolution, setAiSolution] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [errorHistory, setErrorHistory] = useState([]);

  const handleErrorSubmit = async (errorDetails) => {
    setLoading(true);
    try {
      const response = await fetch("/api/error-resolver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: errorDetails.message,
          context: errorDetails.context,
          stackTrace: errorDetails.stack,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get error resolution");
      }

      const data = await response.json();
      setAiSolution(data);
      setErrorHistory((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          error: errorDetails,
          solution: data,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Could not get AI solution");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    try {
      await handleErrorSubmit(error);
    } catch (err) {
      setError("Retry failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Error Resolution Center
          </h1>
          <p className="text-gray-600">
            Get AI-powered solutions for your errors
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Report Error
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleErrorSubmit({
                  message: e.target.errorMessage.value,
                  context: e.target.errorContext.value,
                  stack: e.target.errorStack.value,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Message
                </label>
                <input
                  name="errorMessage"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context
                </label>
                <input
                  name="errorContext"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stack Trace
                </label>
                <textarea
                  name="errorStack"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                  rows="4"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#357AFF] text-white py-3 rounded-lg font-medium hover:bg-[#2E69DE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Get Solution"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              AI Solution
            </h2>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-circle-notch fa-spin text-[#357AFF] text-2xl"></i>
                <p className="mt-2 text-gray-600">Analyzing your error...</p>
              </div>
            ) : aiSolution ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800">Root Cause:</h3>
                  <p className="text-gray-600">{aiSolution.error.analysis}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Immediate Fix:
                  </h3>
                  <p className="text-gray-600">
                    {aiSolution.suggestions.immediate}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Long-term Solution:
                  </h3>
                  <p className="text-gray-600">
                    {aiSolution.suggestions.longTerm}
                  </p>
                </div>
                <button
                  onClick={handleRetry}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Retry Solution ({retryCount})
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">
                Submit an error to get AI-powered solutions
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error History
          </h2>
          <div className="space-y-4">
            {errorHistory.map((entry, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800">
                    {entry.error.message}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Solution: {entry.solution.suggestions.immediate}
                </p>
              </div>
            ))}
            {errorHistory.length === 0 && (
              <p className="text-center text-gray-600">
                No errors reported yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;