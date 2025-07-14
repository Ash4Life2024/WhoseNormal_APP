async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "No active session" };
  }

  const userId = session.user.id;

  // Check auth tables for inconsistencies
  const [user, accounts, sessions] = await sql.transaction([
    sql`SELECT * FROM auth_users WHERE id = ${userId}`,
    sql`SELECT * FROM auth_accounts WHERE "userId" = ${userId}`,
    sql`SELECT * FROM auth_sessions WHERE "userId" = ${userId}`,
  ]);

  const issues = [];
  const fixes = [];

  // Validate user exists
  if (!user?.length) {
    return { error: "User not found in database" };
  }

  // Clean expired sessions
  const now = new Date();
  const expiredSessions = sessions.filter((s) => new Date(s.expires) < now);

  if (expiredSessions.length) {
    await sql`DELETE FROM auth_sessions WHERE "userId" = ${userId} AND expires < ${now}`;
    fixes.push("Removed expired sessions");
  }

  // Validate account links
  if (!accounts?.length) {
    issues.push("No linked accounts found");
  }

  // Check for orphaned sessions
  const validSessionCount = sessions.filter(
    (s) => new Date(s.expires) >= now
  ).length;
  if (validSessionCount === 0) {
    // Create new session
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const sessionToken = Math.random().toString(36).slice(2);

    await sql`
      INSERT INTO auth_sessions ("userId", expires, "sessionToken")
      VALUES (${userId}, ${expires}, ${sessionToken})
    `;
    fixes.push("Created new session");
  }

  // Log resolution attempt
  await sql`
    INSERT INTO security_audit_log (user_id, event_type, event_details, severity, resolution_status)
    VALUES (
      ${userId},
      'session_repair',
      ${JSON.stringify({ issues, fixes })},
      'low',
      'resolved'
    )
  `;

  return {
    success: true,
    resolved: fixes,
    issues: issues.length ? issues : null,
  };
}
export async function POST(request) {
  return handler(await request.json());
}