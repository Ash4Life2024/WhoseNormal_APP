async function handler({
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortDir = "desc",
  status,
  programType,
  state,
} = {}) {
  try {
    // Build base query and values array
    let queryStr = `
      SELECT 
        id,
        program_name,
        email,
        status,
        program_type,
        location_state,
        commission_rate,
        created_at,
        website_url,
        price_tier
      FROM affiliate_applications
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 0;

    // Add filters if provided
    if (status) {
      paramCount++;
      queryStr += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (programType) {
      paramCount++;
      queryStr += ` AND program_type = $${paramCount}`;
      values.push(programType);
    }

    if (state) {
      paramCount++;
      queryStr += ` AND location_state = $${paramCount}`;
      values.push(state);
    }

    // Add sorting
    const validSortColumns = [
      "created_at",
      "program_name",
      "status",
      "commission_rate",
    ];
    const validSortDirs = ["asc", "desc"];

    const finalSortBy = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const finalSortDir = validSortDirs.includes(sortDir.toLowerCase())
      ? sortDir.toLowerCase()
      : "desc";

    queryStr += ` ORDER BY ${finalSortBy} ${finalSortDir}`;

    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    queryStr += ` LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    queryStr += ` OFFSET $${paramCount}`;
    values.push(offset);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM affiliate_applications 
      WHERE 1=1
      ${status ? " AND status = $1" : ""}
      ${programType ? ` AND program_type = $${status ? 2 : 1}` : ""}
      ${
        state
          ? ` AND location_state = $${
              (status ? 1 : 0) + (programType ? 1 : 0) + 1
            }`
          : ""
      }
    `;

    const countValues = [
      ...(status ? [status] : []),
      ...(programType ? [programType] : []),
      ...(state ? [state] : []),
    ];

    // Execute queries in transaction
    const [affiliates, [countResult]] = await sql.transaction([
      sql(queryStr, values),
      sql(countQuery, countValues),
    ]);

    return {
      affiliates,
      pagination: {
        total: parseInt(countResult.total),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult.total) / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return {
      error: "Failed to fetch affiliates",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}