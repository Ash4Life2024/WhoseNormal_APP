async function handler({ page = 1, limit = 10, mood = null }) {
  const session = getSession();
  const offset = (page - 1) * limit;

  try {
    let queryString = `
      SELECT 
        kp.id,
        kp.content,
        kp.media_url,
        kp.media_type,
        kp.mood,
        kp.created_at,
        au.name as author_name,
        au.image as author_image,
        COUNT(DISTINCT kr.id) as reactions_count,
        COUNT(DISTINCT kc.id) as comments_count,
        CASE WHEN kr2.id IS NOT NULL THEN true ELSE false END as has_reacted,
        COALESCE(json_agg(
          DISTINCT jsonb_build_object(
            'type', kr.reaction_type,
            'count', COUNT(kr.id)
          )
        ) FILTER (WHERE kr.id IS NOT NULL), '[]') as reaction_types
      FROM kids_posts kp
      JOIN auth_users au ON kp.user_id = au.id
      LEFT JOIN kids_reactions kr ON kp.id = kr.post_id
      LEFT JOIN kids_comments kc ON kp.id = kc.post_id AND kc.is_approved = true
      LEFT JOIN kids_reactions kr2 ON kp.id = kr2.post_id AND kr2.user_id = $1
      WHERE kp.is_approved = true
    `;

    const values = [session?.user?.id || 0];
    let paramCount = 1;

    if (mood) {
      queryString += ` AND kp.mood = $${paramCount + 1}`;
      values.push(mood);
      paramCount++;
    }

    queryString += `
      GROUP BY kp.id, au.name, au.image, kr2.id
      ORDER BY kp.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    values.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) 
      FROM kids_posts kp
      WHERE kp.is_approved = true
      ${mood ? ` AND kp.mood = $2` : ""}
    `;

    const [posts, countResult] = await sql.transaction([
      sql(queryString, values),
      sql(
        countQuery,
        mood ? [session?.user?.id || 0, mood] : [session?.user?.id || 0]
      ),
    ]);

    return {
      posts: posts.map((post) => ({
        ...post,
        reaction_types: post.reaction_types === null ? [] : post.reaction_types,
      })),
      pagination: {
        total: parseInt(countResult[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult[0].count) / limit),
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