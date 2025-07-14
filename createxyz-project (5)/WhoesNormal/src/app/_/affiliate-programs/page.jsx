"use client";
import React from "react";

function MainComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [bulkApplicationData, setBulkApplicationData] = useState({
    email: "",
    userDetails: {
      name: "",
      phone: "",
      website: "",
      experience: "",
      certifications: [],
    },
    locationState: "",
    priceTier: "affordable",
    programTypes: ["YOGA", "COUNSELOR", "RETREAT", "CAMP"],
  });

  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [filters, setFilters] = useState({
    programType: "",
    state: "",
    priceTier: "",
    focusArea: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const focusAreas = [
    "Autism Spectrum",
    "ASD Support",
    "Self-Harm Recovery",
    "Trauma Support",
    "Eating Disorders",
    "ADHD Support",
    "Depression Treatment",
    "Anxiety Management",
  ];

  const programTypes = [
    "YOGA",
    "REHAB",
    "ASSOCIATION",
    "CANCELING",
    "TELEHEALTH",
    "APP",
    "PRODUCT",
    "COUNSELING",
    "THERAPY",
    "WORKSHOP",
    "MENTAL_HEALTH",
    "SUPPORT_GROUP",
    "EDUCATION",
    "COACHING",
    "MINDFULNESS",
    "BEHAVIORAL",
    "DEVELOPMENTAL",
    "SOCIAL_SKILLS",
    "OCCUPATIONAL",
    "SPEECH",
    "ART_THERAPY",
    "MUSIC_THERAPY",
    "PHYSICAL_THERAPY",
    "RECREATIONAL",
    "LIFE_SKILLS",
  ];

  // Add auto-save functionality
  const autoSaveData = {
    email: "whosenormal@proton.me",
    userDetails: {
      name: "Ashley Page",
      phone: "3043044476",
      website: "https://who-s-normal-865.created.app",
      experience: "5",
      certifications: [],
    },
    locationState: "",
    priceTier: "affordable",
    programTypes: programTypes,
  };

  // Initialize with saved data
  useEffect(() => {
    setBulkApplicationData(autoSaveData);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [page, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/list-affiliate-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          limit: 50,
          email: "whosenormal@proton.me",
          ...filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const apps = data.applications || [];
      setApplications(apps);
      setTotalPages(data.pagination?.totalPages || 1);

      // Update stats with actual counts from the database
      setApplicationStats({
        total: data.stats?.total || 0,
        pending: data.stats?.pending || 0,
        approved: data.stats?.approved || 0,
        rejected: data.stats?.rejected || 0,
      });
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError(`Could not load applications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Modified bulk apply function to handle multiple applications
  const handleBulkApply = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create applications for each selected program type and state
      const applications = [];

      // Generate combinations for all selected program types and states
      for (const programType of bulkApplicationData.programTypes) {
        for (const state of states) {
          applications.push({
            program_name: `${programType} Program - ${state}`,
            email: autoSaveData.email,
            user_details: autoSaveData.userDetails,
            location_state: state,
            price_tier: bulkApplicationData.priceTier,
            program_type: programType,
            status: "pending",
            auto_apply_enabled: true,
          });
        }
      }

      // Submit all applications in batches
      const batchSize = 50;
      for (let i = 0; i < applications.length; i += batchSize) {
        const batch = applications.slice(i, i + batchSize);

        const response = await fetch("/api/bulk-affiliate-apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applications: batch,
            email: autoSaveData.email,
            userDetails: autoSaveData.userDetails,
            autoApplyEnabled: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit applications");
        }
      }

      // Refresh the applications list after successful submission
      await fetchApplications();

      // Show success message
      setError("Successfully submitted applications!");
    } catch (err) {
      console.error("Bulk application error:", err);
      setError(
        err.message || "Failed to process applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Add new function to handle select all
  const handleSelectAllProgramTypes = () => {
    setBulkApplicationData((prev) => ({
      ...prev,
      programTypes:
        prev.programTypes.length === programTypes.length
          ? []
          : [...programTypes],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bulk Affiliate Application Center
          </h1>
          <p className="text-gray-600">
            Apply to multiple programs with a single application
          </p>
        </header>

        {/* Add loading state */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-xl flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#357AFF]"></div>
              <div className="text-gray-700">Loading applications...</div>
            </div>
          </div>
        )}

        {/* Add Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Type
              </label>
              <select
                value={filters.programType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    programType: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#357AFF] focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="THERAPY">Therapy</option>
                <option value="COUNSELING">Counseling</option>
                <option value="RETREAT">Retreat</option>
                <option value="CAMP">Camp</option>
                <option value="WORKSHOP">Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Area
              </label>
              <select
                value={filters.focusArea}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, focusArea: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#357AFF] focus:border-transparent"
              >
                <option value="">All Focus Areas</option>
                {focusAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={filters.state}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, state: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#357AFF] focus:border-transparent"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Tier
              </label>
              <select
                value={filters.priceTier}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceTier: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#357AFF] focus:border-transparent"
              >
                <option value="">All Tiers</option>
                <option value="affordable">Affordable</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#357AFF]">
                {applicationStats.total}
              </div>
              <div className="text-gray-600">Total Applications</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">
                {applicationStats.pending}
              </div>
              <div className="text-gray-600">Pending Review</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">
                {applicationStats.approved}
              </div>
              <div className="text-gray-600">Approved</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">
                {applicationStats.rejected}
              </div>
              <div className="text-gray-600">Rejected</div>
            </div>
          </div>
        </div>

        {/* Bulk Application Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Bulk Application Form
            <span className="text-sm font-normal text-gray-600 ml-2">
              (Your information is auto-saved)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Auto-saved)
              </label>
              <input
                type="email"
                value={bulkApplicationData.email}
                readOnly
                className="w-full px-4 py-2 rounded-lg border bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (Auto-saved)
              </label>
              <input
                type="text"
                value={bulkApplicationData.userDetails.name}
                readOnly
                className="w-full px-4 py-2 rounded-lg border bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Auto-saved)
              </label>
              <input
                type="tel"
                value={bulkApplicationData.userDetails.phone}
                readOnly
                className="w-full px-4 py-2 rounded-lg border bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Auto-saved)
              </label>
              <input
                type="url"
                value={bulkApplicationData.userDetails.website}
                readOnly
                className="w-full px-4 py-2 rounded-lg border bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={bulkApplicationData.userDetails.experience}
                onChange={(e) =>
                  setBulkApplicationData((prev) => ({
                    ...prev,
                    userDetails: {
                      ...prev.userDetails,
                      experience: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#357AFF] focus:border-transparent"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={bulkApplicationData.locationState}
                onChange={(e) =>
                  setBulkApplicationData((prev) => ({
                    ...prev,
                    locationState: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#357AFF] focus:border-transparent"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Tier
              </label>
              <select
                value={bulkApplicationData.priceTier}
                onChange={(e) =>
                  setBulkApplicationData((prev) => ({
                    ...prev,
                    priceTier: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#357AFF] focus:border-transparent"
              >
                <option value="affordable">Affordable</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Program Types
                </label>
                <button
                  onClick={handleSelectAllProgramTypes}
                  className="text-sm text-[#357AFF] hover:text-[#2E69DE] font-medium"
                >
                  {bulkApplicationData.programTypes.length ===
                  programTypes.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-4">
                {programTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={bulkApplicationData.programTypes.includes(type)}
                      onChange={(e) => {
                        setBulkApplicationData((prev) => ({
                          ...prev,
                          programTypes: e.target.checked
                            ? [...prev.programTypes, type]
                            : prev.programTypes.filter((t) => t !== type),
                        }));
                      }}
                      className="rounded border-gray-300 text-[#357AFF] focus:ring-[#357AFF] h-5 w-5"
                    />
                    <span className="text-gray-700 font-medium">
                      {type
                        .split("_")
                        .map(
                          (word) => word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleBulkApply}
              disabled={loading}
              className="w-full bg-[#357AFF] text-white py-3 rounded-lg hover:bg-[#2E69DE] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting Applications...
                </span>
              ) : (
                "Submit Bulk Applications"
              )}
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl p-6 shadow-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Application Status
          </h2>
          <div className="overflow-x-auto">
            {applications.length > 0 ? (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Focus Areas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Similar Programs
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {app.program_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.price_tier === "luxury"
                              ? "Luxury"
                              : "Affordable"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            {app.program_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(app.program_focus || []).map((focus, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                              >
                                {focus}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {app.location_state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-sm font-medium rounded-full ${
                              app.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : app.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {(app.similar_programs || [])
                              .slice(0, 3)
                              .map((similar, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                  title={similar.focus?.join(", ")}
                                >
                                  {similar.name}
                                </span>
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              !loading && (
                <div className="text-center py-8 text-gray-500">
                  No applications found. Submit your first application using the
                  form above.
                </div>
              )
            )}
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-start">
              <div className="flex-1">{error}</div>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-700 hover:text-red-800"
              >
                ×
              </button>
            </div>
            <button
              onClick={fetchApplications}
              className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;