function handler({ searchQuery, category = "hotels" }) {
  if (
    !searchQuery ||
    typeof searchQuery !== "string" ||
    searchQuery.trim().length === 0
  ) {
    return {
      error: "Search query is required",
      status: 400,
    };
  }

  const apiKey = process.env.TRIPADVISOR_API_KEY;
  if (!apiKey) {
    return {
      error: "API key not configured",
      status: 500,
    };
  }

  const baseUrl = "https://api.content.tripadvisor.com/api/v1";
  const searchUrl = `${baseUrl}/location/search?key=${apiKey}&searchQuery=${encodeURIComponent(
    searchQuery
  )}&category=${encodeURIComponent(category)}&language=en`;

  const fetchPhotos = async (locationId) => {
    try {
      const photoUrl = `${baseUrl}/location/${locationId}/photos?key=${apiKey}&language=en&limit=10`;
      const response = await fetch(photoUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-TripAdvisor-API-Key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Photo API error: ${response.status}`);
      }

      const photoData = await response.json();
      return photoData.data || [];
    } catch (error) {
      return [];
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return fetch(searchUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-TripAdvisor-API-Key": apiKey,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`TripAdvisor API error: ${response.status}`);
      }
      return response.json();
    })
    .then(async (data) => {
      const locations = data.data || [];
      const enrichedLocations = [];

      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        await delay(100);
        const photos = await fetchPhotos(location.location_id);
        enrichedLocations.push({
          ...location,
          additional_photos: photos,
        });
      }

      return {
        status: 200,
        data: {
          data: enrichedLocations,
        },
      };
    })
    .catch((error) => ({
      error: error.message,
      status: 500,
    }));
}
export async function POST(request) {
  return handler(await request.json());
}