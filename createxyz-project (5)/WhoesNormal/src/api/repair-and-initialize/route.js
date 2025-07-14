async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "No active session found" };
  }

  try {
    const results = await sql.transaction(async (txn) => [
      txn`
        INSERT INTO user_points (user_id, points, coins, level)
        VALUES (${session.user.id}, 0, 0, 1)
        ON CONFLICT (user_id) DO NOTHING
        RETURNING *
      `,

      txn`
        INSERT INTO user_challenge_tracking (user_id, challenge_id, progress)
        SELECT 
          ${session.user.id},
          c.id,
          '{}'::jsonb
        FROM weekly_challenges c
        WHERE NOT EXISTS (
          SELECT 1 FROM user_challenge_tracking t 
          WHERE t.user_id = ${session.user.id} AND t.challenge_id = c.id
        )
        RETURNING *
      `,

      txn`
        INSERT INTO mood_entries (user_id, mood_emoji, mood_color)
        SELECT ${session.user.id}, '😊', '#FFD700'
        WHERE NOT EXISTS (
          SELECT 1 FROM mood_entries 
          WHERE user_id = ${session.user.id}
        )
        RETURNING *
      `,

      txn`
        INSERT INTO user_routines (user_id, title, description, schedule)
        SELECT ${session.user.id}, 'Daily Routine', 'My daily activities', '{"weekdays": [1,2,3,4,5]}'::jsonb
        WHERE NOT EXISTS (
          SELECT 1 FROM user_routines 
          WHERE user_id = ${session.user.id}
        )
        RETURNING *
      `,
    ]);

    return {
      success: true,
      initialized: {
        points: results[0],
        challenges: results[1],
        moods: results[2],
        routines: results[3],
      },
    };
  } catch (error) {
    return {
      error: "Failed to repair and initialize session",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}