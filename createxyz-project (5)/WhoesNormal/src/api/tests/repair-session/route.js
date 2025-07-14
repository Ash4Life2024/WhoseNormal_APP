async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "No active session found" };
  }

  const userId = session.user.id;

  const [authUser, authSession, authAccount] = await sql.transaction([
    sql`SELECT * FROM auth_users WHERE id = ${userId}`,
    sql`SELECT * FROM auth_sessions WHERE "userId" = ${userId}`,
    sql`SELECT * FROM auth_accounts WHERE "userId" = ${userId}`,
  ]);

  if (!authUser?.length) {
    return { error: "User not found in auth_users" };
  }

  if (!authSession?.length) {
    const newSession = await sql`
      INSERT INTO auth_sessions ("userId", "sessionToken", expires)
      VALUES (${userId}, ${session.sessionToken}, ${new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    )})
      RETURNING *
    `;
    return { repaired: true, session: newSession[0] };
  }

  if (!authAccount?.length) {
    return { error: "No linked authentication account found" };
  }

  const expiredSessions = authSession.filter(
    (s) => new Date(s.expires) < new Date()
  );

  if (expiredSessions.length) {
    await sql`DELETE FROM auth_sessions WHERE "userId" = ${userId} AND expires < NOW()`;
  }

  return {
    valid: true,
    user: authUser[0],
    sessions: authSession.filter((s) => new Date(s.expires) >= new Date()),
    accountsCount: authAccount.length,
  };
}
export async function POST(request) {
  return handler(await request.json());
}