"use client";
import React from "react";

function MainComponent() {
  const [threats, setThreats] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [rateLimits, setRateLimits] = useState({
    requests: 100,
    timeWindow: 60,
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("threats");

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const [threatsRes, blacklistRes, logsRes] = await Promise.all([
          fetch("/api/security/threats", { method: "POST" }),
          fetch("/api/security/blacklist", { method: "POST" }),
          fetch("/api/security/audit-logs", { method: "POST" }),
        ]);

        if (!threatsRes.ok || !blacklistRes.ok || !logsRes.ok) {
          throw new Error("Failed to fetch security data");
        }

        const [threatsData, blacklistData, logsData] = await Promise.all([
          threatsRes.json(),
          blacklistRes.json(),
          logsRes.json(),
        ]);

        setThreats(threatsData.threats || []);
        setBlacklist(blacklistData.blacklist || []);
        setAuditLogs(logsData.logs || []);
      } catch (err) {
        setError("Could not load security data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBlacklistIP = async (ip) => {
    try {
      const response = await fetch("/api/security/blacklist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });

      if (!response.ok) throw new Error("Failed to blacklist IP");
      setBlacklist((prev) => [...prev, ip]);
    } catch (err) {
      setError("Could not blacklist IP");
      console.error(err);
    }
  };

  const updateRateLimits = async () => {
    try {
      const response = await fetch("/api/security/rate-limits/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rateLimits),
      });

      if (!response.ok) throw new Error("Failed to update rate limits");
    } catch (err) {
      setError("Could not update rate limits");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Security Dashboard
          </h1>
          <p className="text-gray-600">Monitor and manage system security</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Active Threats
              </h2>
              <span
                className={`px-3 py-1 rounded-full ${
                  threats.length > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {threats.length} Active
              </span>
            </div>
            <div className="space-y-4">
              {threats.map((threat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{threat.ip}</p>
                    <p className="text-sm text-gray-600">{threat.type}</p>
                  </div>
                  <button
                    onClick={() => handleBlacklistIP(threat.ip)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Block
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Rate Limiting
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requests per Window
                </label>
                <input
                  type="number"
                  value={rateLimits.requests}
                  onChange={(e) =>
                    setRateLimits((prev) => ({
                      ...prev,
                      requests: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Window (seconds)
                </label>
                <input
                  type="number"
                  value={rateLimits.timeWindow}
                  onChange={(e) =>
                    setRateLimits((prev) => ({
                      ...prev,
                      timeWindow: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <button
                onClick={updateRateLimits}
                className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE]"
              >
                Update Limits
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              IP Blacklist
            </h2>
            <div className="space-y-2">
              {blacklist.map((ip, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span>{ip}</span>
                  <button
                    onClick={() =>
                      setBlacklist((prev) => prev.filter((i) => i !== ip))
                    }
                    className="text-red-500 hover:text-red-600"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Security Audit Log
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-3">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">{log.event}</td>
                    <td className="p-3">{log.ip}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          log.status === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;