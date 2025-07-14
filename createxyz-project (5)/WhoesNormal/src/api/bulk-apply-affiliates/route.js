async function handler({ applications }) {
  if (!applications || !Array.isArray(applications)) {
    return { error: "Invalid applications data" };
  }

  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const insertQueries = applications.map((app) => {
      const {
        program_name,
        email,
        program_type,
        user_details = {},
        commission_details = {},
      } = app;

      if (!program_name || !email || !program_type) {
        throw new Error("Missing required fields");
      }

      return sql`
        INSERT INTO affiliate_applications 
        (program_name, email, program_type, user_id, user_details, commission_details)
        VALUES 
        (${program_name}, ${email}, ${program_type}, ${session.user.id}, ${user_details}, ${commission_details})
        RETURNING id`;
    });

    const results = await sql.transaction(insertQueries);

    return {
      success: true,
      created: results.map((r) => r[0].id),
    };
  } catch (error) {
    return {
      error: error.message || "Failed to create affiliate applications",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}