async function handler({
  audienceType,
  location,
  topic,
  isOnline,
  startDate,
  endDate,
  page = 1,
  limit = 20,
}) {
  const offset = (page - 1) * limit;

  let queryStr = `
    SELECT 
      w.*,
      wc.name as category_name,
      wt.name as topic_name,
      pa.profession as host_profession,
      COUNT(*) OVER() as total_count
    FROM workshops w
    LEFT JOIN workshop_topics wt ON wt.id = w.topic_id
    LEFT JOIN workshop_categories wc ON wc.id = wt.category_id
    LEFT JOIN professional_accounts pa ON pa.id = w.host_id
    WHERE 1=1
  `;

  const values = [];
  let paramCount = 0;

  if (audienceType) {
    paramCount++;
    queryStr += ` AND w.audience_type = $${paramCount}`;
    values.push(audienceType);
  }

  if (location) {
    paramCount++;
    queryStr += ` AND (
      LOWER(w.location_city) LIKE LOWER($${paramCount}) OR 
      LOWER(w.location_state) LIKE LOWER($${paramCount}) OR 
      LOWER(w.location_country) LIKE LOWER($${paramCount})
    )`;
    values.push(`%${location}%`);
  }

  if (isOnline !== undefined) {
    paramCount++;
    queryStr += ` AND w.is_online = $${paramCount}`;
    values.push(isOnline);
  }

  if (topic) {
    paramCount++;
    queryStr += ` AND LOWER(wt.name) LIKE LOWER($${paramCount})`;
    values.push(`%${topic}%`);
  }

  if (startDate) {
    paramCount++;
    queryStr += ` AND w.start_time >= $${paramCount}`;
    values.push(startDate);
  }

  if (endDate) {
    paramCount++;
    queryStr += ` AND w.end_time <= $${paramCount}`;
    values.push(endDate);
  }

  queryStr += ` ORDER BY w.start_time ASC LIMIT $${paramCount + 1} OFFSET $${
    paramCount + 2
  }`;
  values.push(limit, offset);

  const results = await sql(queryStr, values);

  if (!results.length) {
    return {
      workshops: [],
      total: 0,
      page,
      limit,
    };
  }

  return {
    workshops: results.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      eventType: w.event_type,
      startTime: w.start_time,
      endTime: w.end_time,
      maxParticipants: w.max_participants,
      currentParticipants: w.current_participants,
      price: w.price,
      status: w.status,
      isOnline: w.is_online,
      location: {
        city: w.location_city,
        state: w.location_state,
        country: w.location_country,
      },
      category: w.category_name,
      topic: w.topic_name,
      hostProfession: w.host_profession,
      audienceType: w.audience_type,
      mentalHealthFocus: w.mental_health_focus,
    })),
    total: parseInt(results[0].total_count),
    page,
    limit,
  };
}
export async function POST(request) {
  return handler(await request.json());
}