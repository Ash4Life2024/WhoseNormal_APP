async function handler() {
  try {
    const filters = await sql`
      SELECT 
        id,
        name,
        description,
        filter_type,
        settings,
        votes_count,
        preview_image_url
      FROM custom_mood_filters
      WHERE is_public = true
      ORDER BY votes_count DESC, created_at DESC
    `;

    return {
      filters: filters.map((filter) => ({
        ...filter,
        votes: filter.votes_count, // Map to match frontend expectation
        settings: filter.settings || {}, // Ensure settings is always an object
      })),
    };
  } catch (error) {
    console.error("Error fetching filters:", error);
    return {
      error: "Failed to fetch filters",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}