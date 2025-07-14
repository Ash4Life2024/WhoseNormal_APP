async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "No active session found" };
  }

  try {
    const [authUser] = await sql`
      SELECT * FROM auth_users 
      WHERE id = ${session.user.id}
    `;

    if (!authUser) {
      return { error: "User not found" };
    }

    const [existingSession] = await sql`
      SELECT * FROM auth_sessions 
      WHERE "userId" = ${session.user.id} 
      AND expires > NOW()
    `;

    if (!existingSession) {
      await sql`
        INSERT INTO auth_sessions ("userId", "sessionToken", expires)
        VALUES (
          ${session.user.id},
          ${session.sessionToken || crypto.randomUUID()},
          ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
        )
      `;
    }

    const [userPoints] = await sql`
      SELECT * FROM user_points 
      WHERE user_id = ${session.user.id}
    `;

    if (!userPoints) {
      await sql`
        INSERT INTO user_points (user_id, points, coins, level)
        VALUES (${session.user.id}, 0, 0, 1)
      `;
    }

    const [userProfile] = await sql`
      SELECT * FROM users 
      WHERE user_id = ${session.user.id}
    `;

    if (!userProfile) {
      await sql`
        INSERT INTO users (
          user_id, 
          display_name, 
          age_group,
          account_status,
          terms_accepted,
          privacy_accepted
        )
        VALUES (
          ${session.user.id},
          ${session.user.name || "User"},
          'teen',
          'pending',
          false,
          false
        )
      `;
    }

    await sql`
      INSERT INTO security_audit_log (
        user_id,
        event_type,
        event_details,
        severity
      )
      VALUES (
        ${session.user.id},
        'SESSION_REPAIR',
        ${JSON.stringify({
          timestamp: new Date(),
          success: true,
        })},
        'low'
      )
    `;

    return {
      success: true,
      userId: session.user.id,
      sessionRepaired: !existingSession,
      dataInitialized: !userPoints || !userProfile,
    };
  } catch (error) {
    await sql`
      INSERT INTO system_errors (
        error_code,
        error_message,
        severity,
        component,
        affected_users
      )
      VALUES (
        'SESSION_REPAIR_FAILED',
        ${error.message},
        'high',
        'auth',
        ARRAY[${session.user.id}]
      )
    `;

    return { error: "Failed to repair session" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}