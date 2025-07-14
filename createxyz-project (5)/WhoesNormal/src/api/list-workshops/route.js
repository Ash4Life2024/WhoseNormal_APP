async function handler({ audience, location_state, topic }) {
  try {
    let queryStr = `
      SELECT 
        w.*,
        pa.profession as host_profession,
        COUNT(wr.id) as registration_count
      FROM workshops w
      LEFT JOIN professional_accounts pa ON w.host_id = pa.id
      LEFT JOIN workshop_registrations wr ON w.id = wr.workshop_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (audience) {
      queryStr += ` AND w.audience_type = $${paramCount}`;
      values.push(audience);
      paramCount++;
    }

    if (location_state === "online") {
      queryStr += ` AND w.is_online = $${paramCount}`;
      values.push(true);
      paramCount++;
    } else if (location_state === "in-person") {
      queryStr += ` AND w.is_online = $${paramCount}`;
      values.push(false);
      paramCount++;
    }

    if (topic && topic !== "all") {
      queryStr += ` AND $${paramCount} = ANY(w.focus_areas)`;
      values.push(topic);
      paramCount++;
    }

    queryStr += ` GROUP BY w.id, pa.profession
                  ORDER BY w.start_time ASC`;

    const workshops = await sql(queryStr, values);

    return {
      workshops: workshops.map((workshop) => ({
        id: workshop.id,
        title: workshop.title,
        description: workshop.description,
        start_time: workshop.start_time,
        price: workshop.price,
        max_participants: workshop.max_participants,
        current_participants: workshop.current_participants,
        is_online: workshop.is_online,
        audience_type: workshop.audience_type,
        image: workshop.image_url || "/workshop-default.jpg",
      })),
    };
  } catch (error) {
    console.error("Workshop query error:", error);
    return {
      error: "Failed to fetch workshops",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}