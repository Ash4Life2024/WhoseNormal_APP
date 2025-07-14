async function handler({ city }) {
  if (!city) {
    return { error: "City name is required" };
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return { error: "OpenWeather API key is not configured" };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "City not found" };
      }
      return { error: "Weather service unavailable" };
    }

    const data = await response.json();

    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  } catch (error) {
    return { error: "Failed to fetch weather data" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}