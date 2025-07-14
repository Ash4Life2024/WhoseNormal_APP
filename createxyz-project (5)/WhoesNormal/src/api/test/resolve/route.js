async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const errors = await sql`
      SELECT * FROM system_errors 
      WHERE status = 'active' 
      ORDER BY severity DESC, created_at DESC
    `;

    const resolutions = [];

    for (const error of errors) {
      if (error.component === "session") {
        await sql`
          DELETE FROM auth_sessions 
          WHERE expires < NOW()
        `;
        resolutions.push({
          type: "session",
          message: "Expired sessions cleaned",
        });
      }

      if (error.component === "database") {
        await sql.transaction([
          sql`
            DELETE FROM kids_reactions 
            WHERE post_id NOT IN (SELECT id FROM kids_posts)
          `,
          sql`
            DELETE FROM kids_comments 
            WHERE post_id NOT IN (SELECT id FROM kids_posts)
          `,
          sql`
            UPDATE user_points 
            SET points = GREATEST(points, 0), 
                coins = GREATEST(coins, 0)
            WHERE points < 0 OR coins < 0
          `,
        ]);
        resolutions.push({
          type: "database",
          message: "Invalid references removed",
        });
      }

      await sql`
        UPDATE system_errors 
        SET status = 'resolved',
            resolved_at = NOW(),
            resolved_by = ${session.user.id},
            resolution_notes = 'Automatically resolved by system'
        WHERE id = ${error.id}
      `;
    }

    return {
      success: true,
      resolved: errors.length,
      resolutions,
    };
  } catch (error) {
    await sql`
      INSERT INTO system_errors (
        error_code,
        error_message,
        component,
        severity
      ) VALUES (
        'RESOLVER_ERROR',
        ${error.message},
        'error_resolver',
        'high'
      )
    `;

    return {
      error: "Failed to resolve errors",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}