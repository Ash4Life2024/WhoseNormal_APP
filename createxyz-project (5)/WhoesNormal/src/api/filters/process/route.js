async function handler({
  filterId,
  settings,
  type = "basic",
  animation = null,
  textOverlay = null,
  colorPalette = null,
  backgroundEffects = null,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!filterId || !settings) {
    return { error: "Missing required parameters" };
  }

  try {
    // Get the existing filter
    const [filter] = await sql`
      SELECT * FROM custom_mood_filters 
      WHERE id = ${filterId}
    `;

    if (!filter) {
      return { error: "Filter not found" };
    }

    // Update filter with new settings
    const updatedFilter = await sql`
      UPDATE custom_mood_filters
      SET 
        settings = ${JSON.stringify(settings)},
        effects = ${JSON.stringify({
          type,
          animation,
          textOverlay,
          colorPalette,
          backgroundEffects,
        })},
        updated_at = NOW()
      WHERE id = ${filterId}
      RETURNING *
    `;

    // Track filter usage
    await sql`
      INSERT INTO filter_reactions (
        post_id,
        user_id,
        filter_id
      ) VALUES (
        ${null},
        ${session.user.id},
        ${filterId}
      )
    `;

    return {
      success: true,
      filter: updatedFilter[0],
    };
  } catch (error) {
    return {
      error: "Failed to process filter",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}