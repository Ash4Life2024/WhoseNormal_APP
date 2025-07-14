async function handler({ query }) {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return {
      error: "Query parameter is required",
    };
  }

  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    return {
      error: "Giphy API key not configured",
    };
  }

  const baseUrl = "https://api.giphy.com/v1/gifs/search";
  const params = new URLSearchParams({
    api_key: apiKey,
    q: query.trim(),
    limit: 25,
    rating: "g",
    lang: "en",
    bundle: "messaging_non_clips",
  });

  try {
    const response = await fetch(`${baseUrl}?${params}`);

    if (!response.ok) {
      throw new Error("Giphy API request failed");
    }

    const data = await response.json();
    return {
      gifs: data.data,
    };
  } catch (error) {
    return {
      error: "Failed to fetch GIFs",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}