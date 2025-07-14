async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "No valid session found" };
  }

  try {
    const userId = session.user.id;

    const [existingPoints] = await sql`
      SELECT * FROM user_points WHERE user_id = ${userId}
    `;

    if (!existingPoints) {
      await sql`
        INSERT INTO user_points (user_id, points, coins, level)
        VALUES (${userId}, 0, 0, 1)
      `;
    }

    const [existingUser] = await sql`
      SELECT * FROM users WHERE user_id = ${session.user.id}
    `;

    if (!existingUser) {
      await sql`
        INSERT INTO users (
          user_id, 
          display_name, 
          age_group,
          parental_consent,
          account_status,
          terms_accepted,
          privacy_accepted
        )
        VALUES (
          ${session.user.id},
          ${session.user.name || "New User"},
          'teen',
          false,
          'pending',
          false,
          false
        )
      `;
    }

    const [userPoints] = await sql`
      SELECT points, coins, level, badges, streaks
      FROM user_points
      WHERE user_id = ${userId}
    `;

    const [activeChallenges] = await sql`
      SELECT COUNT(*) as count
      FROM user_challenge_tracking
      WHERE user_id = ${userId} 
      AND completed = false
    `;

    return {
      success: true,
      userData: {
        points: userPoints.points,
        coins: userPoints.coins,
        level: userPoints.level,
        badges: userPoints.badges,
        streaks: userPoints.streaks,
        activeChallenges: activeChallenges.count,
      },
    };
  } catch (error) {
    await sql`
      INSERT INTO system_errors (
        error_code,
        error_message,
        severity,
        component
      ) VALUES (
        'SESSION_REPAIR_ERROR',
        ${error.message},
        'high',
        'RepairAndInitialize'
      )
    `;

    return { error: "Failed to repair session" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}