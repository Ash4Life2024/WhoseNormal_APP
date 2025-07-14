async function handler({ action, workshopId, userId, data }) {
  switch (action) {
    case "create":
      const newWorkshop = await sql`
        INSERT INTO workshops (
          title, description, host_id, event_type, start_time, end_time,
          max_participants, price, status
        ) VALUES (
          ${data.title}, ${data.description}, ${data.hostId}, ${data.eventType},
          ${data.startTime}, ${data.endTime}, ${data.maxParticipants},
          ${data.price}, 'scheduled'
        ) RETURNING *`;
      return { workshop: newWorkshop[0] };

    case "register":
      const registration = await sql`
        INSERT INTO workshop_registrations (
          workshop_id, user_id, payment_status, attendance_status
        ) VALUES (
          ${workshopId}, ${userId}, 'pending', 'registered'
        ) RETURNING *`;

      await sql`
        UPDATE workshops 
        SET current_participants = current_participants + 1 
        WHERE id = ${workshopId}`;

      return { registration: registration[0] };

    case "update":
      const updatedWorkshop = await sql`
        UPDATE workshops SET
          title = ${data.title},
          description = ${data.description},
          event_type = ${data.eventType},
          start_time = ${data.startTime},
          end_time = ${data.endTime},
          max_participants = ${data.maxParticipants},
          price = ${data.price},
          status = ${data.status}
        WHERE id = ${workshopId}
        RETURNING *`;
      return { workshop: updatedWorkshop[0] };

    case "list":
      const workshops = await sql`
        SELECT w.*, 
          COUNT(wr.id) as registered_count,
          pa.profession as host_profession
        FROM workshops w
        LEFT JOIN workshop_registrations wr ON w.id = wr.workshop_id
        LEFT JOIN professional_accounts pa ON w.host_id = pa.id
        WHERE w.status != 'cancelled'
        GROUP BY w.id, pa.profession
        ORDER BY w.start_time ASC`;
      return { workshops };

    case "cancel":
      const cancelledWorkshop = await sql`
        UPDATE workshops 
        SET status = 'cancelled'
        WHERE id = ${workshopId}
        RETURNING *`;
      return { workshop: cancelledWorkshop[0] };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}