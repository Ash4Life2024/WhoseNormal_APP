async function handler({ filterId, voteType }) {
  if (!filterId) {
    return { error: "Filter ID is required" };
  }

  if (!["up", "down"].includes(voteType)) {
    return { error: "Invalid vote type" };
  }

  try {
    // Update votes count and return updated filter
    const [updatedFilter] = await sql`
      UPDATE custom_mood_filters 
      SET votes_count = votes_count + ${voteType === "up" ? 1 : -1}
      WHERE id = ${filterId}
      RETURNING id, name, description, votes_count, settings
    `;

    if (!updatedFilter) {
      return { error: "Filter not found" };
    }

    return {
      success: true,
      filter: {
        ...updatedFilter,
        votes: updatedFilter.votes_count,
      },
    };
  } catch (error) {
    console.error("Error updating vote:", error);
    return { error: "Failed to update vote count" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}