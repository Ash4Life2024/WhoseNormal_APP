async function handler() {
  try {
    const quotes = await sql`
      SELECT quote, author, category 
      FROM daily_quotes 
      ORDER BY RANDOM() 
      LIMIT 1
    `;

    if (!quotes || quotes.length === 0) {
      return {
        error: "No quotes available",
      };
    }

    return {
      quote: quotes[0],
    };
  } catch (error) {
    return {
      error: "Failed to fetch quote",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}