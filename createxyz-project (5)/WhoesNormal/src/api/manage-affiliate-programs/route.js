async function handler({ action, programId, filters, programData }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized access" };
  }

  switch (action) {
    case "list":
      let query = "SELECT * FROM affiliate_applications WHERE 1=1";
      const values = [];
      let paramCount = 1;

      if (filters?.status) {
        query += ` AND status = $${paramCount}`;
        values.push(filters.status);
        paramCount++;
      }

      if (filters?.program_type) {
        query += ` AND program_type = $${paramCount}`;
        values.push(filters.program_type);
        paramCount++;
      }

      if (filters?.state) {
        query += ` AND location_state = $${paramCount}`;
        values.push(filters.state);
        paramCount++;
      }

      if (filters?.studio_type) {
        query += ` AND studio_type && $${paramCount}`;
        values.push(filters.studio_type);
        paramCount++;
      }

      if (filters?.sort === "location") {
        query += " ORDER BY location_state, location_city";
      } else if (filters?.sort === "commission") {
        query += " ORDER BY commission_rate DESC";
      } else {
        query += " ORDER BY created_at DESC";
      }

      const programs = await sql(query, values);
      return { programs };

    case "get":
      if (!programId) {
        return { error: "Program ID is required" };
      }

      const program = await sql(
        "SELECT * FROM affiliate_applications WHERE id = $1",
        [programId]
      );

      return { program: program[0] };

    case "create":
      if (!programData) {
        return { error: "Program data is required" };
      }

      const newProgram = await sql(
        `INSERT INTO affiliate_applications 
        (program_name, email, program_type, commission_rate, status, user_id, 
         location_city, location_state, studio_type, partnership_benefits) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
        [
          programData.program_name,
          programData.email,
          programData.program_type,
          programData.commission_rate,
          "pending",
          session.user.id,
          programData.location_city,
          programData.location_state,
          programData.studio_type,
          programData.partnership_benefits,
        ]
      );

      return { program: newProgram[0] };

    case "update":
      if (!programId || !programData) {
        return { error: "Program ID and update data are required" };
      }

      const updatedProgram = await sql(
        `UPDATE affiliate_applications 
         SET status = $1, 
             commission_rate = $2, 
             notes = $3, 
             partnership_benefits = $4,
             studio_type = $5,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $6 AND user_id = $7 
         RETURNING *`,
        [
          programData.status,
          programData.commission_rate,
          programData.notes,
          programData.partnership_benefits,
          programData.studio_type,
          programId,
          session.user.id,
        ]
      );

      return { program: updatedProgram[0] };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}