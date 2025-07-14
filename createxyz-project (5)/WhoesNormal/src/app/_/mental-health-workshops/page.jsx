"use client";
import React from "react";

function MainComponent() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("/api/workshops/list", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch workshops");
        }

        const data = await response.json();
        setWorkshops(data.workshops);
        setFilteredWorkshops(data.workshops);
      } catch (err) {
        setError("Could not load workshops");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const renderWorkshopCard = (workshop) => (
    <div
      key={workshop.id}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{workshop.title}</h3>
        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
          {workshop.category}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{workshop.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="fas fa-clock text-gray-400"></i>
          <span className="text-sm text-gray-600">{workshop.duration}</span>
        </div>
        <button className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2E69DE] transition-colors">
          Register
        </button>
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Workshop Calendar
      </h2>
      <div className="space-y-4">
        {filteredWorkshops.map((workshop) => (
          <div
            key={workshop.id}
            className="flex items-center justify-between border-b border-gray-200 pb-4"
          >
            <div>
              <h3 className="font-bold text-gray-800">{workshop.title}</h3>
              <p className="text-sm text-gray-600">{workshop.date}</p>
            </div>
            <button className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2E69DE] transition-colors">
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative z-10 p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Global Mental Health Workshops
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Join expert-led workshops focused on mental wellbeing, available
            worldwide in multiple languages and formats.
          </p>
        </div>

        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={() => setView("grid")}
            className={`px-4 py-2 rounded-lg ${
              view === "grid"
                ? "bg-[#357AFF] text-white"
                : "bg-white text-gray-600"
            }`}
          >
            <i className="fas fa-th-large mr-2"></i>Grid
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-lg ${
              view === "calendar"
                ? "bg-[#357AFF] text-white"
                : "bg-white text-gray-600"
            }`}
          >
            <i className="fas fa-calendar mr-2"></i>Calendar
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => renderWorkshopCard(workshop))}
          </div>
        ) : (
          renderCalendarView()
        )}
      </div>
    </div>
  );
}

export default MainComponent;