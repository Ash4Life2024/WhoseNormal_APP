async function handler({ action, routineId, routineData, taskData }) {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  try {
    switch (action) {
      case "create_routine": {
        if (!routineData?.title || !routineData?.schedule) {
          return { error: "Title and schedule are required", status: 400 };
        }

        const [routine] = await sql`
          INSERT INTO user_routines (
            user_id, 
            title, 
            description, 
            schedule, 
            is_active
          )
          VALUES (
            ${session.user.id},
            ${routineData.title},
            ${routineData.description || null},
            ${routineData.schedule},
            true
          )
          RETURNING *
        `;

        return { routine, status: 201 };
      }

      case "update_routine": {
        if (!routineId) {
          return { error: "Routine ID is required", status: 400 };
        }

        const setValues = [];
        const queryParams = [];
        let paramCount = 2;

        if (routineData.title) {
          setValues.push(`title = $${paramCount++}`);
          queryParams.push(routineData.title);
        }
        if (routineData.description !== undefined) {
          setValues.push(`description = $${paramCount++}`);
          queryParams.push(routineData.description);
        }
        if (routineData.schedule) {
          setValues.push(`schedule = $${paramCount++}`);
          queryParams.push(routineData.schedule);
        }
        if (routineData.is_active !== undefined) {
          setValues.push(`is_active = $${paramCount++}`);
          queryParams.push(routineData.is_active);
        }

        const [routine] = await sql(
          `UPDATE user_routines 
           SET ${setValues.join(", ")}, updated_at = CURRENT_TIMESTAMP
           WHERE id = $1 AND user_id = $2
           RETURNING *`,
          [routineId, session.user.id, ...queryParams]
        );

        return { routine, status: 200 };
      }

      case "add_task": {
        if (!routineId || !taskData?.title) {
          return {
            error: "Routine ID and task title are required",
            status: 400,
          };
        }

        const [task] = await sql`
          INSERT INTO routine_tasks (
            routine_id,
            title,
            description,
            duration_minutes,
            order_index
          )
          VALUES (
            ${routineId},
            ${taskData.title},
            ${taskData.description || null},
            ${taskData.duration_minutes || null},
            (
              SELECT COALESCE(MAX(order_index) + 1, 0)
              FROM routine_tasks
              WHERE routine_id = ${routineId}
            )
          )
          RETURNING *
        `;

        return { task, status: 201 };
      }

      case "complete_task": {
        if (!taskData?.taskId) {
          return { error: "Task ID is required", status: 400 };
        }

        const [task] = await sql`
          UPDATE routine_tasks
          SET 
            is_completed = true,
            completed_at = CURRENT_TIMESTAMP
          WHERE id = ${taskData.taskId}
          AND routine_id IN (
            SELECT id FROM user_routines 
            WHERE user_id = ${session.user.id}
          )
          RETURNING *
        `;

        return { task, status: 200 };
      }

      case "delete_routine": {
        if (!routineId) {
          return { error: "Routine ID is required", status: 400 };
        }

        await sql`
          DELETE FROM user_routines
          WHERE id = ${routineId}
          AND user_id = ${session.user.id}
        `;

        return { status: 200 };
      }

      default:
        return { error: "Invalid action", status: 400 };
    }
  } catch (error) {
    return {
      error: "Failed to process routine management request",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}