async function handler({ category, type, page = 1, limit = 10 }) {
  const session = getSession();
  const offset = (page - 1) * limit;

  try {
    let queryString = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.category,
        c.challenge_type,
        c.duration_minutes,
        c.points,
        c.created_at
    `;

    if (session?.user?.id) {
      queryString += `,
        ucp.status as user_status,
        ucp.started_at as user_started_at,
        ucp.completed_at as user_completed_at
      `;
    }

    queryString += `
      FROM challenges c
    `;

    if (session?.user?.id) {
      queryString += `
        LEFT JOIN user_challenge_progress ucp 
        ON c.id = ucp.challenge_id 
        AND ucp.user_id = $1
      `;
    }

    queryString += ` WHERE 1=1`;

    const values = session?.user?.id ? [session.user.id] : [];
    let paramCount = values.length + 1;

    if (category) {
      queryString += ` AND c.category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (type) {
      queryString += ` AND c.challenge_type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    const countQuery = queryString.replace(
      /SELECT.*FROM/,
      "SELECT COUNT(*) FROM"
    );

    queryString += ` 
      ORDER BY c.created_at DESC 
      LIMIT $${paramCount} 
      OFFSET $${paramCount + 1}
    `;

    values.push(limit, offset);

    const [challenges, countResult] = await sql.transaction([
      sql(queryString, values),
      sql(countQuery, values.slice(0, -2)),
    ]);

    return {
      challenges,
      pagination: {
        total: parseInt(countResult[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult[0].count) / limit),
      },
    };
  } catch (error) {
    return {
      error: "Failed to fetch challenges",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}