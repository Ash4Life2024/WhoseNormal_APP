async function handler({ content, mediaUrl, mediaType, mood }) {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "You must be signed in to create a post",
      status: 401,
    };
  }

  try {
    const [userCheck] = await sql`
      SELECT is_child, parent_approved
      FROM users 
      WHERE user_id = ${session.user.id}
    `;

    if (!userCheck) {
      return {
        error: "User not found",
        status: 404,
      };
    }

    if (!userCheck.is_child || !userCheck.parent_approved) {
      return {
        error: "Only children with parental approval can post",
        status: 403,
      };
    }

    if (!content?.trim()) {
      return {
        error: "Content is required",
        status: 400,
      };
    }

    if (mediaUrl && !mediaType) {
      return {
        error: "Media type is required when including media",
        status: 400,
      };
    }

    if (mediaType && !["image", "video", "gif"].includes(mediaType)) {
      return {
        error: "Invalid media type",
        status: 400,
      };
    }

    const [post] = await sql`
      INSERT INTO kids_posts (
        user_id,
        content,
        media_url,
        media_type,
        mood,
        is_approved
      )
      VALUES (
        ${session.user.id},
        ${content},
        ${mediaUrl || null},
        ${mediaType || null},
        ${mood || null},
        false
      )
      RETURNING id, content, media_url, media_type, mood, created_at
    `;

    return {
      message: "Post created and pending approval",
      post,
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