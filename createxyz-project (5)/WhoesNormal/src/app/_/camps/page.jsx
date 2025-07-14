"use client";
import React from "react";

function MainComponent() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list");
  const [filters, setFilters] = useState({
    type: "",
    focus: "",
    state: "",
    ageRange: "",
  });

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const response = await fetch("/api/camps/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch camps");
        }

        const data = await response.json();
        setCamps(data.camps || []);
      } catch (err) {
        setError("Could not load camps");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Special Needs Camps
          </h1>
          <p className="text-gray-600">
            Find the perfect camp for your child across the USA
          </p>
        </header>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="">All Camp Types</option>
              <option value="day">Day Camp</option>
              <option value="overnight">Overnight Camp</option>
              <option value="weekend">Weekend Camp</option>
            </select>

            <select
              value={filters.focus}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, focus: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="">All Focus Areas</option>
              <option value="adhd">ADHD</option>
              <option value="autism">Autism</option>
              <option value="physical">Physical Disabilities</option>
              <option value="learning">Learning Differences</option>
            </select>

            <select
              value={filters.state}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, state: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="">All States</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
            </select>

            <select
              value={filters.ageRange}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, ageRange: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="">All Age Ranges</option>
              <option value="5-8">5-8 years</option>
              <option value="9-12">9-12 years</option>
              <option value="13-16">13-16 years</option>
              <option value="17-21">17-21 years</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg ${
                view === "list" ? "bg-[#357AFF] text-white" : "bg-gray-100"
              }`}
            >
              <i className="fas fa-list mr-2"></i>List View
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-4 py-2 rounded-lg ${
                view === "map" ? "bg-[#357AFF] text-white" : "bg-gray-100"
              }`}
            >
              <i className="fas fa-map-marker-alt mr-2"></i>Map View
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <i className="fas fa-circle-notch fa-spin text-[#357AFF] text-4xl"></i>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div
            className={`grid ${
              view === "list"
                ? "grid-cols-1 md:grid-cols-2 gap-6"
                : "grid-cols-1"
            }`}
          >
            {camps.map((camp) => (
              <div key={camp.id} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {camp.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{camp.location}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      camp.type === "day"
                        ? "bg-green-100 text-green-800"
                        : camp.type === "overnight"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {camp.type} Camp
                  </span>
                </div>

                <img
                  src={camp.image || "/default-camp.jpg"}
                  alt={`Activities at ${camp.name}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                <p className="text-gray-700 mb-4">{camp.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Ages</h3>
                    <p className="text-gray-600">{camp.ageRange}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Focus Areas</h3>
                    <p className="text-gray-600">
                      {camp.focusAreas.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {camp.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    {camp.dates}
                  </div>
                  <button className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE]">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;