async function handler({
  status,
  programType,
  locationState,
  priceTier,
  page = 1,
  limit = 10,
}) {
  try {
    const offset = (page - 1) * limit;
    let queryParts = ["SELECT * FROM affiliate_applications WHERE 1=1"];
    let values = [];
    let paramCount = 1;

    if (status) {
      queryParts.push(`AND status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (programType) {
      queryParts.push(`AND program_type = $${paramCount}`);
      values.push(programType);
      paramCount++;
    }

    if (locationState) {
      queryParts.push(`AND location_state = $${paramCount}`);
      values.push(locationState);
      paramCount++;
    }

    if (priceTier) {
      queryParts.push(`AND price_tier = $${paramCount}`);
      values.push(priceTier);
      paramCount++;
    }

    queryParts.push(`LIMIT $${paramCount} OFFSET $${paramCount + 1}`);
    values.push(limit, offset);

    const query = queryParts.join(" ");
    const applications = await sql(query, values);

    // Get total count for pagination
    const countQuery = queryParts[0].replace("SELECT *", "SELECT COUNT(*)");
    const [{ count }] = await sql(
      countQuery.split("LIMIT")[0],
      values.slice(0, -2)
    );

    return {
      applications,
      pagination: {
        total: parseInt(count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(count) / limit),
      },
    };
  } catch (error) {
    console.error("Error listing affiliate applications:", error);
    return {
      error: "Failed to retrieve affiliate applications",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}