async function handler({ errorId, resolutionNotes }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const now = new Date();

  const [updatedError] = await sql`
    UPDATE system_errors 
    SET 
      status = 'resolved',
      resolution_notes = ${resolutionNotes},
      resolved_by = ${session.user.id},
      resolved_at = ${now}
    WHERE id = ${errorId}
    RETURNING *
  `;

  if (!updatedError) {
    return { error: "Error not found" };
  }

  return { error: updatedError };
}
export async function POST(request) {
  return handler(await request.json());
}