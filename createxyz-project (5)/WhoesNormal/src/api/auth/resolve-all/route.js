async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "No active session" };
  }

  const userId = session.user.id;
  let fixed = 0;

  await sql`
    DELETE FROM auth_sessions 
    WHERE expires < NOW() 
    OR "userId" NOT IN (SELECT id FROM auth_users)
  `;

  const orphanedAccounts = await sql`
    SELECT id FROM auth_accounts 
    WHERE "userId" NOT IN (SELECT id FROM auth_users)
  `;

  if (orphanedAccounts.length > 0) {
    await sql`DELETE FROM auth_accounts WHERE id = ANY(${orphanedAccounts.map(
      (a) => a.id
    )})`;
    fixed += orphanedAccounts.length;
  }

  const user = await sql`
    SELECT u.*, a.id as account_id 
    FROM auth_users u
    LEFT JOIN auth_accounts a ON a."userId" = u.id
    WHERE u.id = ${userId}
  `;

  if (user.length === 0) {
    return { error: "User not found" };
  }

  const updates = [];
  const values = [];
  let paramCount = 1;

  if (!user[0].email) {
    updates.push(`email = $${paramCount}`);
    values.push(session.user.email || "");
    paramCount++;
  }

  if (!user[0].name) {
    updates.push(`name = $${paramCount}`);
    values.push(session.user.name || "");
    paramCount++;
  }

  if (updates.length > 0) {
    await sql(
      `
      UPDATE auth_users 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
    `,
      [...values, userId]
    );
    fixed++;
  }

  const pointsRecord = await sql`
    SELECT id FROM user_points WHERE user_id = ${userId}
  `;

  if (pointsRecord.length === 0) {
    await sql`
      INSERT INTO user_points (user_id, points, coins, level)
      VALUES (${userId}, 0, 0, 1)
    `;
    fixed++;
  }

  await sql`
    INSERT INTO security_audit_log 
    (user_id, event_type, event_details, severity, resolution_status)
    VALUES (
      ${userId},
      'AUTH_REPAIR',
      ${JSON.stringify({
        fixed_count: fixed,
        timestamp: new Date().toISOString(),
      })},
      'low',
      'resolved'
    )
  `;

  return {
    success: true,
    fixed,
    message: `Fixed ${fixed} authentication issues`,
  };
}
export async function POST(request) {
  return handler(await request.json());
}