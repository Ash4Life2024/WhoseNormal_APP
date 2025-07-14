"use client";
import React from "react";

function MainComponent() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [hotels, setHotels] = useState([]);
  const [events, setEvents] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const searchDestination = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsResponse, weatherResponse] = await Promise.all([
        fetch("/api/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city: destination }),
        }),
        fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: destination }),
        }),
      ]);

      if (!eventsResponse.ok || !weatherResponse.ok) {
        throw new Error("Failed to fetch travel data");
      }

      const [eventsData, weatherData] = await Promise.all([
        eventsResponse.json(),
        weatherResponse.json(),
      ]);

      setEvents(eventsData.data?._embedded?.events || []);
      setWeather(weatherData);
    } catch (err) {
      setError("Could not load travel information");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToItinerary = (item) => {
    setItinerary((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const saveTrip = async () => {
    if (!destination || !dates.start || !dates.end) {
      setError("Please fill in destination and dates");
      return;
    }

    try {
      const response = await fetch("/api/trip-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "POST",
          destination,
          startDate: dates.start,
          endDate: dates.end,
          itinerary,
          hotelBookings: hotels,
          eventBookings: events,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save trip");
      }

      const result = await response.json();
      setSavedTrips((prev) => [...prev, result.trip]);
      setError(null);
    } catch (err) {
      setError("Could not save trip");
      console.error(err);
    }
  };

  const loadSavedTrips = async () => {
    try {
      const response = await fetch("/api/trip-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "GET" }),
      });

      if (!response.ok) {
        throw new Error("Failed to load trips");
      }

      const data = await response.json();
      setSavedTrips(data.trips || []);
    } catch (err) {
      console.error("Error loading saved trips:", err);
      setSavedTrips([]);
    }
  };

  useEffect(() => {
    loadSavedTrips();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Travel Planner
          </h1>
          <p className="text-gray-600">
            Plan your perfect trip with weather, events, and more
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg col-span-3">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="destination"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-grow px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              />
              <input
                type="date"
                name="start_date"
                value={dates.start}
                onChange={(e) =>
                  setDates((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              />
              <input
                type="date"
                name="end_date"
                value={dates.end}
                onChange={(e) =>
                  setDates((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              />
              <button
                onClick={searchDestination}
                disabled={loading}
                className="bg-[#357AFF] text-white px-8 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {weather && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                <i className="fas fa-cloud mr-2"></i>Weather
              </h2>
              <div className="text-center">
                <div className="text-4xl mb-2">{weather.temperature}°</div>
                <div className="text-gray-600">{weather.condition}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-calendar mr-2"></i>Events
            </h2>
            <div className="space-y-4">
              {events && events.length > 0 ? (
                events.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {event.dates?.start?.localDate}
                    </p>
                    <button
                      onClick={() => addToItinerary(event)}
                      className="text-[#357AFF] text-sm hover:text-[#2E69DE]"
                    >
                      Add to Itinerary
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">
                  <p>No events found</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-hotel mr-2"></i>Hotels
            </h2>
            <div className="text-center text-gray-600">
              <i className="fas fa-search mb-2"></i>
              <p>Search a destination to see hotels</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-list mr-2"></i>Your Itinerary
          </h2>
          {itinerary && itinerary.length > 0 ? (
            <div className="space-y-4">
              {itinerary.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.dates?.start?.localDate}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setItinerary((prev) =>
                        prev.filter((i) => i.id !== item.id)
                      )
                    }
                    className="text-red-500 hover:text-red-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Add items to your itinerary
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-suitcase mr-2"></i>Saved Trips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedTrips && savedTrips.length > 0 ? (
              savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-[#357AFF] transition-colors"
                  onClick={() => {
                    setSelectedTrip(trip);
                    setDestination(trip.destination);
                    setDates({
                      start: trip.start_date,
                      end: trip.end_date,
                    });
                    setItinerary(trip.itinerary || []);
                  }}
                >
                  <h3 className="font-medium">{trip.destination}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(trip.start_date).toLocaleDateString()} -{" "}
                    {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-600">
                <p>No saved trips yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveTrip}
            className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
          >
            <i className="fas fa-save mr-2"></i>Save Trip
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;