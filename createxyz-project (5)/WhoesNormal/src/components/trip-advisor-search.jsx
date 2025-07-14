"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ initialCategory = "hotels" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPhotoIndices, setCurrentPhotoIndices] = useState({});
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search-tripadvisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery, category }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setResults(result.data?.data || []);
      const initialIndices = {};
      result.data?.data?.forEach((item) => {
        initialIndices[item.location_id] = 0;
      });
      setCurrentPhotoIndices(initialIndices);
    } catch (err) {
      setError(err.message);
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (result, photos) => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        handleNextPhoto(result.location_id, photos);
      } else {
        handlePrevPhoto(result.location_id, photos);
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  };

  const handlePrevPhoto = (locationId, photos) => {
    setCurrentPhotoIndices((prev) => ({
      ...prev,
      [locationId]: (prev[locationId] - 1 + photos.length) % photos.length,
    }));
  };

  const handleNextPhoto = (locationId, photos) => {
    setCurrentPhotoIndices((prev) => ({
      ...prev,
      [locationId]: (prev[locationId] + 1) % photos.length,
    }));
  };

  const ResultSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full animate-pulse">
      <div className="h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <input
          type="text"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locations..."
          className="flex-1 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="hotels">Hotels</option>
          <option value="restaurants">Restaurants</option>
          <option value="attractions">Attractions</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors font-inter"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => handleSearch()}
            className="px-6 py-2 border border-gray-200 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 })
              .fill(0)
              .map((_, index) => <ResultSkeleton key={index} />)
          : results.map((result) => {
              const photos = [
                result.photo?.images?.medium?.url,
                ...(result.additional_photos?.map(
                  (p) => p.images?.medium?.url,
                ) || []),
              ].filter(Boolean);

              const currentPhotoIndex =
                currentPhotoIndices[result.location_id] || 0;

              return (
                <div
                  key={result.location_id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className="aspect-video relative group"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => handleTouchEnd(result, photos)}
                  >
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            handlePrevPhoto(result.location_id, photos)
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 sm:block hidden"
                          aria-label="Previous photo"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                          onClick={() =>
                            handleNextPhoto(result.location_id, photos)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 sm:block hidden"
                          aria-label="Next photo"
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </>
                    )}
                    <img
                      src={
                        photos[currentPhotoIndex] ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={`${result.name} - Photo ${currentPhotoIndex + 1} of ${photos.length}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    {photos.length > 1 && (
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setCurrentPhotoIndices((prev) => ({
                                ...prev,
                                [result.location_id]: index,
                              }))
                            }
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentPhotoIndex
                                ? "bg-white scale-110"
                                : "bg-white/50"
                            }`}
                            aria-label={`Go to photo ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {result.name}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {result.category?.name || category}
                    </p>
                    {result.rating && (
                      <div className="flex items-center mb-2">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {result.rating}
                        </span>
                      </div>
                    )}
                    {result.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {result.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {!isLoading && results.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-700 dark:text-gray-300">
            No results found. Try a different search.
          </p>
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainComponent />
    </div>
  );
});
}