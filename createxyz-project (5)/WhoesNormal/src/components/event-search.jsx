"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    keyword: "",
    city: "",
    stateCode: "",
  });

  const stateOptions = [
    { value: "", label: "Select state" },
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/search-function", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      const events = result.data?._embedded?.events || [];
      setResults(events);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderVenueInfo = (venue) => {
    if (!venue) return null;

    const venueName = venue.name || "";
    const cityName = venue.city?.name || "";
    const stateCode = venue.state?.stateCode || "";

    const parts = [venueName];
    if (cityName && stateCode) {
      parts.push(`${cityName}, ${stateCode}`);
    }

    return parts.join(" - ");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
      >
        <div className="space-y-4 md:space-y-6">
          <div>
            <input
              type="text"
              name="keyword"
              value={formData.keyword}
              onChange={handleInputChange}
              placeholder="Search events..."
              className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-inter"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city"
              className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-inter"
            />

            <select
              name="stateCode"
              value={formData.stateCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-inter"
            >
              {stateOptions.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-block px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-inter hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>

          {error && (
            <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-md font-inter text-sm">
              {error}
            </div>
          )}
        </div>
      </form>

      {Array.isArray(results) && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((event) => (
            <div
              key={event?.id || Math.random()}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {event?.images?.[0]?.url && (
                <img
                  src={event.images[0].url}
                  alt={event?.name || "Event image"}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  {event?.name || "Unnamed Event"}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {event?.dates?.start?.localDate && (
                    <p>
                      {new Date(event.dates.start.localDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                      {event.dates.start.localTime &&
                        ` at ${event.dates.start.localTime}`}
                    </p>
                  )}
                  {event?._embedded?.venues?.[0] && (
                    <p>{renderVenueInfo(event._embedded.venues[0])}</p>
                  )}
                </div>
                {event?.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Get Tickets
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(results) && results.length === 0 && (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No events found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <MainComponent />
    </div>
  );
});
}