async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized - Please log in to view journals",
    };
  }

  try {
    const journals = await sql`
      SELECT id, title, content, mood, is_private, created_at, updated_at
      FROM journals 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return {
      journals: journals.map((journal) => ({
        id: journal.id,
        title: journal.title,
        content: journal.content,
        mood: journal.mood,
        isPrivate: journal.is_private,
        createdAt: journal.created_at,
        updatedAt: journal.updated_at,
      })),
    };
  } catch (error) {
    return {
      error: "Failed to fetch journal entries",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}