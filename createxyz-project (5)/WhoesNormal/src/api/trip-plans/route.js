async function handler({
  method,
  userId,
  tripId,
  destination,
  startDate,
  endDate,
  itinerary,
  hotelBookings,
  eventBookings,
}) {
  switch (method) {
    case "POST": {
      if (!userId || !destination || !startDate || !endDate) {
        return { error: "Missing required fields" };
      }

      const result = await sql`
        INSERT INTO trip_plans (
          user_id, destination, start_date, end_date, 
          itinerary, hotel_bookings, event_bookings
        ) VALUES (
          ${userId}, ${destination}, ${startDate}, ${endDate}, 
          ${itinerary || []}, ${hotelBookings || []}, ${eventBookings || []}
        ) 
        RETURNING *`;

      return { trip: result[0] };
    }

    case "PUT": {
      if (!tripId || !userId) {
        return { error: "Missing required fields" };
      }

      const setValues = [];
      const queryParams = [];
      let paramCount = 1;

      if (destination) {
        setValues.push(`destination = $${paramCount}`);
        queryParams.push(destination);
        paramCount++;
      }
      if (startDate) {
        setValues.push(`start_date = $${paramCount}`);
        queryParams.push(startDate);
        paramCount++;
      }
      if (endDate) {
        setValues.push(`end_date = $${paramCount}`);
        queryParams.push(endDate);
        paramCount++;
      }
      if (itinerary) {
        setValues.push(`itinerary = $${paramCount}`);
        queryParams.push(itinerary);
        paramCount++;
      }
      if (hotelBookings) {
        setValues.push(`hotel_bookings = $${paramCount}`);
        queryParams.push(hotelBookings);
        paramCount++;
      }
      if (eventBookings) {
        setValues.push(`event_bookings = $${paramCount}`);
        queryParams.push(eventBookings);
        paramCount++;
      }

      if (setValues.length === 0) {
        return { error: "No fields to update" };
      }

      queryParams.push(tripId, userId);
      const result = await sql(
        `UPDATE trip_plans 
        SET ${setValues.join(", ")}, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramCount} AND user_id = $${paramCount + 1} 
        RETURNING *`,
        queryParams
      );

      if (!result.length) {
        return { error: "Trip plan not found or unauthorized" };
      }

      return { trip: result[0] };
    }

    case "GET": {
      if (!userId) {
        return { error: "Missing user ID" };
      }

      if (tripId) {
        const result = await sql`
          SELECT * FROM trip_plans 
          WHERE id = ${tripId} AND user_id = ${userId}`;

        if (!result.length) {
          return { error: "Trip plan not found or unauthorized" };
        }

        return { trip: result[0] };
      }

      const trips = await sql`
        SELECT * FROM trip_plans 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC`;

      return { trips };
    }

    case "DELETE": {
      if (!tripId || !userId) {
        return { error: "Missing required fields" };
      }

      const result = await sql`
        DELETE FROM trip_plans 
        WHERE id = ${tripId} AND user_id = ${userId} 
        RETURNING id`;

      if (!result.length) {
        return { error: "Trip plan not found or unauthorized" };
      }

      return { success: true };
    }

    default:
      return { error: "Method not allowed" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}