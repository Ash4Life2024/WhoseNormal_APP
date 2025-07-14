async function handler({ action, streamId, title, purpose, viewerCount }) {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  try {
    switch (action) {
      case "start":
        if (!title || !purpose) {
          return {
            error: "Title and purpose are required",
            status: 400,
          };
        }

        const newStream = await sql`
          INSERT INTO live_streams (user_id, title, purpose)
          VALUES (${session.user.id}, ${title}, ${purpose})
          RETURNING *
        `;

        return {
          stream: newStream[0],
          status: 201,
        };

      case "end":
        if (!streamId) {
          return {
            error: "Stream ID is required",
            status: 400,
          };
        }

        const endedStream = await sql`
          UPDATE live_streams 
          SET is_active = false, ended_at = CURRENT_TIMESTAMP
          WHERE id = ${streamId} 
          AND user_id = ${session.user.id}
          AND is_active = true
          RETURNING *
        `;

        if (!endedStream.length) {
          return {
            error: "Stream not found or already ended",
            status: 404,
          };
        }

        return {
          stream: endedStream[0],
          status: 200,
        };

      case "update_viewers":
        if (!streamId || typeof viewerCount !== "number") {
          return {
            error: "Stream ID and viewer count are required",
            status: 400,
          };
        }

        const updatedStream = await sql`
          UPDATE live_streams 
          SET viewer_count = ${viewerCount}
          WHERE id = ${streamId} 
          AND is_active = true
          RETURNING *
        `;

        if (!updatedStream.length) {
          return {
            error: "Stream not found or inactive",
            status: 404,
          };
        }

        return {
          stream: updatedStream[0],
          status: 200,
        };

      case "list":
        const activeStreams = await sql`
          SELECT ls.*, au.name as streamer_name
          FROM live_streams ls
          JOIN auth_users au ON ls.user_id = au.id
          WHERE ls.is_active = true
          ORDER BY ls.started_at DESC
        `;

        return {
          streams: activeStreams,
          status: 200,
        };

      default:
        return {
          error: "Invalid action",
          status: 400,
        };
    }
  } catch (error) {
    return {
      error: "Failed to process stream action",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}