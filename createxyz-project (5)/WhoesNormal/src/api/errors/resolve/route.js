async function handler({ errorId, resolutionAction }) {
  if (!errorId || !resolutionAction) {
    return { error: "Missing required parameters" };
  }

  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [error] = await sql`
      SELECT * FROM errors 
      WHERE id = ${errorId}
    `;

    if (!error) {
      return { error: "Error not found" };
    }

    const [resolution] = await sql`
      UPDATE errors
      SET 
        status = 'resolved',
        resolution = ${resolutionAction},
        resolved_at = NOW(),
        resolved_by = ${session.user.id}
      WHERE id = ${errorId}
      RETURNING *
    `;

    await sql`
      INSERT INTO security_audit_log 
      (user_id, event_type, event_details)
      VALUES (
        ${session.user.id},
        'ERROR_RESOLUTION',
        ${JSON.stringify({
          errorId,
          resolutionAction,
          timestamp: new Date().toISOString(),
        })}
      )
    `;

    return {
      success: true,
      resolution: {
        id: resolution.id,
        status: resolution.status,
        resolvedAt: resolution.resolved_at,
        resolutionAction,
      },
    };
  } catch (err) {
    return { error: "Failed to resolve error" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}