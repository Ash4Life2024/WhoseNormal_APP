function handler({ locationId }) {
  if (!locationId || typeof locationId !== "string") {
    return {
      error: "Valid location ID is required",
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
  const photoUrl = `${baseUrl}/location/${locationId}/photos?key=${apiKey}&language=en&limit=10`;

  return fetch(photoUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-TripAdvisor-API-Key": apiKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`TripAdvisor API error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => ({
      status: 200,
      data: data.data || [],
    }))
    .catch((error) => ({
      error: error.message,
      status: 500,
    }));
}
export async function POST(request) {
  return handler(await request.json());
}