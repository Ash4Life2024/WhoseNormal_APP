async function handler({ postId, reactionType }) {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "You must be logged in to react to posts",
      status: 401,
    };
  }

  if (!postId) {
    return {
      error: "Post ID is required",
      status: 400,
    };
  }

  if (
    !reactionType ||
    !["like", "heart", "laugh", "hug", "star"].includes(reactionType)
  ) {
    return {
      error: "Invalid reaction type",
      status: 400,
    };
  }

  try {
    const existingReaction = await sql`
      SELECT id FROM kids_reactions 
      WHERE post_id = ${postId} 
      AND user_id = ${session.user.id}
    `;

    if (existingReaction.length > 0) {
      await sql`
        DELETE FROM kids_reactions 
        WHERE post_id = ${postId} 
        AND user_id = ${session.user.id}
      `;

      return {
        message: "Reaction removed",
        status: 200,
      };
    }

    await sql`
      INSERT INTO kids_reactions (post_id, user_id, reaction_type)
      VALUES (${postId}, ${session.user.id}, ${reactionType})
    `;

    return {
      message: "Reaction added successfully",
      status: 200,
    };
  } catch (error) {
    return {
      error: "Failed to process reaction",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}