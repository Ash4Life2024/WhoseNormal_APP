"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    topic: "all",
    date: "all",
    audience: "all",
    location: "all",
    programType: "all",
    ageGroup: "all",
    programFormat: "all",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/workshops-events/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError("Could not load events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const registerForEvent = async (eventId) => {
    if (!user) {
      window.location.href = "/account/signin?callbackUrl=/workshops-events";
      return;
    }

    try {
      const response = await fetch("/api/workshops-events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error("Failed to register for event");
      }

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, participants: event.participants + 1 }
            : event
        )
      );
    } catch (err) {
      setError("Could not register for event");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Therapeutic Programs, Camps & Retreats
          </h1>
          <p className="text-gray-600">
            Find specialized programs, camps, and retreats for mental health and
            emotional well-being
          </p>
        </header>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <select
              value={filters.programType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, programType: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="all">All Program Types</option>
              <option value="camp">Camps</option>
              <option value="retreat">Retreats</option>
              <option value="program">Treatment Programs</option>
              <option value="workshop">Workshops</option>
            </select>

            <select
              value={filters.ageGroup}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, ageGroup: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="all">All Age Groups</option>
              <option value="children">Children & Teens</option>
              <option value="adults">Adults</option>
            </select>

            <select
              value={filters.programFormat}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  programFormat: e.target.value,
                }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="all">All Formats</option>
              <option value="residential">Residential</option>
              <option value="outpatient">Outpatient</option>
              <option value="day_camp">Day Program</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="all">All Locations</option>
              <option value="west">West Coast</option>
              <option value="east">East Coast</option>
              <option value="midwest">Midwest</option>
              <option value="south">South</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-8">
                <i className="fas fa-circle-notch fa-spin text-[#357AFF] text-2xl"></i>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {event.title}
                      </h2>
                      <div className="flex items-center mt-2">
                        <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                        <span className="text-gray-600">
                          {event.location_city}, {event.location_state}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm mb-2">
                        {event.program_type}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                        {event.age_group}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.treatment_focus?.map((focus, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-clock text-gray-400 mr-2"></i>
                      <span className="text-gray-600">
                        {event.program_format}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        (window.location.href = event.website || "#")
                      }
                      className="px-6 py-2 rounded-lg bg-[#357AFF] text-white hover:bg-[#2E69DE] transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;