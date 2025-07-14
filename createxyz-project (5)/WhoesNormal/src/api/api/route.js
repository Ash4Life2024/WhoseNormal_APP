const api_key = process.env.TICKETMASTER_API_KEY;
async function handler({
  city,
  stateCode,
  countryCode = "US",
  size = 20,
  keyword,
}) {
  try {
    const params = new URLSearchParams({
      apikey: api_key,
      size: size,
    });

    if (city) params.append("city", city);
    if (stateCode) params.append("stateCode", stateCode);
    if (keyword) params.append("keyword", keyword);

    params.append("countryCode", countryCode);

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
    console.log("Fetching from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      return {
        error: `API request failed with status ${response.status}`,
        details: await response.text(),
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      error: "Failed to fetch events",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}