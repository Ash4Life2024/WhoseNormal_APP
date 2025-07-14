"use client";
import React from "react";

function MainComponent() {
  const [affiliates, setAffiliates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [revenue, setRevenue] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [bulkEmails, setBulkEmails] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [affiliatesRes, applicationsRes, revenueRes] = await Promise.all([
          fetch("/api/affiliate-manager/list", { method: "POST" }),
          fetch("/api/apply-affiliate/list", { method: "POST" }),
          fetch("/api/revenue/analytics", { method: "POST" }),
        ]);

        if (!affiliatesRes.ok || !applicationsRes.ok || !revenueRes.ok) {
          throw new Error("Failed to fetch affiliate data");
        }

        const [affiliatesData, applicationsData, revenueData] =
          await Promise.all([
            affiliatesRes.json(),
            applicationsRes.json(),
            revenueRes.json(),
          ]);

        setAffiliates(affiliatesData.affiliates || []);
        setApplications(applicationsData.applications || []);
        setRevenue(revenueData || {});
      } catch (err) {
        setError("Could not load affiliate data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBulkApply = async () => {
    try {
      const emails = bulkEmails
        .split("\n")
        .map((email) => email.trim())
        .filter(Boolean);

      const response = await fetch("/api/bulk-apply-affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, type: selectedType }),
      });

      if (!response.ok) throw new Error("Failed to process bulk applications");

      setBulkEmails("");
      setApplications((prev) => [
        ...prev,
        ...emails.map((email) => ({
          email,
          status: "pending",
          type: selectedType,
        })),
      ]);
    } catch (err) {
      setError("Failed to process bulk applications");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Affiliate Hub
          </h1>
          <p className="text-gray-600">
            Manage all your affiliate partnerships in one place
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Revenue Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Revenue</span>
                <span className="font-bold">${revenue.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Affiliates</span>
                <span className="font-bold">{affiliates.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Applications</span>
                <span className="font-bold">
                  {
                    applications.filter((app) => app.status === "pending")
                      .length
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Bulk Affiliate Signup
            </h2>
            <div className="space-y-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200"
              >
                <option value="all">All Types</option>
                <option value="yoga">Yoga Studios</option>
                <option value="rehab">Rehabilitation Centers</option>
                <option value="associations">Professional Associations</option>
                <option value="counseling">Counseling Services</option>
              </select>
              <textarea
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                placeholder="Enter email addresses (one per line)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 h-32"
              />
              <button
                onClick={handleBulkApply}
                className="w-full bg-[#357AFF] text-white py-3 rounded-lg hover:bg-[#2E69DE]"
              >
                Process Bulk Applications
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Active Affiliates
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="p-3">Affiliate</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((affiliate, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={affiliate.image || "/default-avatar.png"}
                          alt="Affiliate"
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{affiliate.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{affiliate.type}</td>
                    <td className="p-3">${affiliate.revenue || 0}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          affiliate.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {affiliate.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-[#357AFF] hover:text-[#2E69DE]">
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Recent Applications
          </h2>
          <div className="space-y-4">
            {applications.slice(0, 5).map((application, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-100 pb-4"
              >
                <div>
                  <p className="font-medium">{application.email}</p>
                  <p className="text-sm text-gray-500">{application.type}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    application.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {application.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;