async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "No authenticated user session found" };
  }

  const userId = session.user.id;

  const userPoints = await sql`
    INSERT INTO user_points (user_id, points, coins, level)
    VALUES (${userId}, 0, 0, 1)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING *
  `;

  const userChallenges = await sql`
    SELECT c.id 
    FROM challenges c
    LEFT JOIN user_challenge_progress ucp ON ucp.challenge_id = c.id AND ucp.user_id = ${userId}
    WHERE ucp.id IS NULL
  `;

  if (userChallenges.length > 0) {
    const values = userChallenges.map((c) => [userId, c.id, "IN_PROGRESS"]);
    await sql`
      INSERT INTO user_challenge_progress (user_id, challenge_id, status)
      SELECT * FROM ${sql(values)}
    `;
  }

  const userRoutine = await sql`
    INSERT INTO user_routines (user_id, title, description, schedule, is_active)
    VALUES (${userId}, 'My Daily Routine', 'Default daily routine', '{"days": ["MON","TUE","WED","THU","FRI"]}', true)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING *
  `;

  return {
    success: true,
    session: {
      points: userPoints[0] || null,
      routine: userRoutine[0] || null,
      challengesInitialized: userChallenges.length,
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}