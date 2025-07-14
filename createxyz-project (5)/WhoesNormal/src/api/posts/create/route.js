async function handler({ content, type = "general" }) {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return {
      error: "Post content is required",
      status: 400,
    };
  }

  if (content.length > 2000) {
    return {
      error: "Post content must be less than 2000 characters",
      status: 400,
    };
  }

  try {
    const [post] = await sql`
      INSERT INTO posts (user_id, content, type)
      VALUES (${session.user.id}, ${content}, ${type})
      RETURNING id, user_id, content, type, created_at, likes_count, supports_count
    `;

    return {
      post,
      status: 201,
    };
  } catch (error) {
    return {
      error: "Failed to create post",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}