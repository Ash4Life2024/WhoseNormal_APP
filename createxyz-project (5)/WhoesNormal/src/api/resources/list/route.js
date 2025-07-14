async function handler({ category, type, search, page = 1, limit = 10 }) {
  try {
    const offset = (page - 1) * limit;
    let queryString = `
      SELECT 
        id,
        title,
        content,
        resource_type,
        category,
        tags,
        created_at,
        updated_at
      FROM resources
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (category) {
      queryString += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (type) {
      queryString += ` AND resource_type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    if (search) {
      queryString += ` AND (
        LOWER(title) LIKE LOWER($${paramCount})
        OR LOWER(content) LIKE LOWER($${paramCount})
      )`;
      values.push(`%${search}%`);
      paramCount++;
    }

    const countQueryString = queryString.replace(
      "SELECT \n        id,\n        title,\n        content,\n        resource_type,\n        category,\n        tags,\n        created_at,\n        updated_at",
      "SELECT COUNT(*)"
    );

    queryString += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${
      paramCount + 1
    }`;
    values.push(limit, offset);

    const [resources, countResult] = await sql.transaction([
      sql(queryString, values),
      sql(countQueryString, values.slice(0, -2)),
    ]);

    return {
      resources,
      pagination: {
        total: parseInt(countResult[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult[0].count) / limit),
      },
    };
  } catch (error) {
    return {
      error: "Failed to fetch resources",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}