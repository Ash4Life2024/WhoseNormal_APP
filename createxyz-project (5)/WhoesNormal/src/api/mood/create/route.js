async function handler({
  moodEmoji,
  moodColor,
  description,
  isAnonymous = false,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [entry] = await sql`
      INSERT INTO mood_entries (
        user_id,
        mood_emoji,
        mood_color,
        description,
        is_anonymous
      )
      VALUES (
        ${session.user.id},
        ${moodEmoji},
        ${moodColor},
        ${description},
        ${isAnonymous}
      )
      RETURNING *
    `;

    return { entry };
  } catch (error) {
    return { error: "Failed to create mood entry" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}