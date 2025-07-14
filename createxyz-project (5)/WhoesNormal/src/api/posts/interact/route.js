async function handler({ postId, type, action }) {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  if (!postId || !type || !action) {
    return {
      error: "Missing required fields",
      status: 400,
    };
  }

  if (!["like", "support"].includes(type)) {
    return {
      error: "Invalid interaction type",
      status: 400,
    };
  }

  if (!["add", "remove"].includes(action)) {
    return {
      error: "Invalid action",
      status: 400,
    };
  }

  try {
    const [result] = await sql.transaction([
      action === "add"
        ? sql`
            INSERT INTO interactions (user_id, post_id, type)
            VALUES (${session.user.id}, ${postId}, ${type})
            ON CONFLICT (user_id, post_id, type) DO NOTHING
          `
        : sql`
            DELETE FROM interactions 
            WHERE user_id = ${session.user.id} 
            AND post_id = ${postId} 
            AND type = ${type}
          `,

      sql`
        UPDATE posts 
        SET ${type === "like" ? "likes_count" : "supports_count"} = (
          SELECT COUNT(*) 
          FROM interactions 
          WHERE post_id = ${postId} 
          AND type = ${type}
        )
        WHERE id = ${postId}
        RETURNING id, likes_count, supports_count
      `,
    ]);

    return {
      post: result[1][0],
      status: 200,
    };
  } catch (error) {
    return {
      error: "Failed to process interaction",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}