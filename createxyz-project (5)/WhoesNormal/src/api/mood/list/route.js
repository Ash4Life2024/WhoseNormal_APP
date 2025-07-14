async function handler({ page = 1, limit = 10, userId = null }) {
  const offset = (page - 1) * limit;
  let queryParts = ["SELECT m.*, u.name as user_name FROM mood_entries m"];
  queryParts.push("LEFT JOIN auth_users u ON m.user_id = u.id");

  const whereConditions = [];
  const values = [];
  let paramCount = 1;

  if (userId) {
    whereConditions.push(`m.user_id = $${paramCount}`);
    values.push(userId);
    paramCount++;
  }

  if (whereConditions.length > 0) {
    queryParts.push(`WHERE ${whereConditions.join(" AND ")}`);
  }

  queryParts.push("ORDER BY m.created_at DESC");
  queryParts.push(`LIMIT $${paramCount} OFFSET $${paramCount + 1}`);

  values.push(limit, offset);

  const query = queryParts.join(" ");
  const entries = await sql(query, values);

  const totalQuery =
    "SELECT COUNT(*) as total FROM mood_entries" +
    (userId ? " WHERE user_id = $1" : "");
  const totalValues = userId ? [userId] : [];
  const [{ total }] = await sql(totalQuery, totalValues);

  return {
    entries,
    pagination: {
      page,
      limit,
      total: parseInt(total),
      totalPages: Math.ceil(total / limit),
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}