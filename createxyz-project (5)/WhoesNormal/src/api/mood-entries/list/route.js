async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized - Please log in",
    };
  }

  try {
    const entries = await sql`
      SELECT 
        id,
        mood_emoji,
        mood_color,
        description,
        created_at,
        is_anonymous
      FROM mood_entries 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return {
      entries: entries.map((entry) => ({
        id: entry.id,
        emoji: entry.mood_emoji,
        color: entry.mood_color,
        description: entry.description,
        timestamp: entry.created_at,
        isAnonymous: entry.is_anonymous,
      })),
    };
  } catch (err) {
    return {
      error: "Failed to fetch mood entries",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}