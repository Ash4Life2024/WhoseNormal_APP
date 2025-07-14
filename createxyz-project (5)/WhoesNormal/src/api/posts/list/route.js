async function handler({ page = 1, limit = 10 }) {
  try {
    const offset = (page - 1) * limit;

    const [posts, countResult] = await sql.transaction([
      sql`
        SELECT 
          p.id,
          p.content,
          p.type,
          p.created_at,
          p.likes_count,
          p.supports_count,
          u.id as author_id,
          u.name as author_name,
          u.image as author_image
        FROM posts p
        LEFT JOIN auth_users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `,
      sql`SELECT COUNT(*) as total FROM posts`,
    ]);

    return {
      posts,
      pagination: {
        total: parseInt(countResult[0].total),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult[0].total) / limit),
      },
    };
  } catch (error) {
    return {
      error: "Failed to fetch posts",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}