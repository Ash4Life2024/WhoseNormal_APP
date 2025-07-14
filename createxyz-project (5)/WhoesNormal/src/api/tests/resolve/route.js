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
      LIMIT 100
    `;

    const resolutions = [];

    for (const error of errors) {
      let resolved = false;

      if (error.error_code === "DB_INCONSISTENCY") {
        const result = await sql.transaction([
          sql`UPDATE user_challenge_tracking 
              SET progress = '{}', completed = false 
              WHERE progress IS NULL`,
          sql`DELETE FROM user_challenge_progress 
              WHERE status = 'IN_PROGRESS' 
              AND started_at < NOW() - INTERVAL '24 hours'`,
          sql`UPDATE user_points 
              SET streaks = '{}' 
              WHERE streaks IS NULL`,
        ]);
        resolved = true;
      }

      if (error.error_code === "AUTH_FAILURE") {
        await sql`
          UPDATE users 
          SET failed_login_attempts = 0,
              account_locked = false,
              last_failed_login = NULL
          WHERE failed_login_attempts > 3
        `;
        resolved = true;
      }

      if (error.error_code === "ORPHANED_RECORDS") {
        await sql.transaction([
          sql`DELETE FROM kids_reactions WHERE post_id NOT IN (SELECT id FROM kids_posts)`,
          sql`DELETE FROM kids_comments WHERE post_id NOT IN (SELECT id FROM kids_posts)`,
          sql`DELETE FROM filter_reactions WHERE post_id NOT IN (SELECT id FROM kids_posts)`,
        ]);
        resolved = true;
      }

      if (resolved) {
        await sql`
          UPDATE system_errors 
          SET status = 'resolved',
              resolved_at = NOW(),
              resolved_by = ${session.user.id},
              resolution_notes = 'Automatically resolved by error resolution system'
          WHERE id = ${error.id}
        `;

        await sql`
          INSERT INTO security_audit_log 
          (user_id, event_type, event_details, severity, resolution_status)
          VALUES (
            ${session.user.id},
            'ERROR_RESOLUTION',
            ${JSON.stringify({
              error_id: error.id,
              error_code: error.error_code,
              resolution: "automatic",
            })},
            'low',
            'resolved'
          )
        `;

        resolutions.push({
          error_id: error.id,
          error_code: error.error_code,
          status: "resolved",
        });
      }
    }

    return {
      resolved_count: resolutions.length,
      resolutions,
    };
  } catch (error) {
    await sql`
      INSERT INTO system_errors 
      (error_code, error_message, severity, component)
      VALUES (
        'ERROR_RESOLUTION_FAILURE',
        ${error.message},
        'high',
        'error_resolution_system'
      )
    `;

    return { error: "Failed to resolve errors" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}