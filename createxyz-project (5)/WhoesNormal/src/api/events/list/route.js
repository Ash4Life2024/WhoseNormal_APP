async function handler({
  search,
  category,
  startDate,
  endDate,
  limit = 10,
  offset = 0,
}) {
  const values = [];
  let paramCount = 0;

  let query = `
    SELECT 
      we.id,
      we.title,
      we.description,
      we.event_type,
      we.start_date,
      we.end_date,
      we.points_reward,
      we.created_at,
      COALESCE(uct.participant_count, 0) as participant_count
    FROM weekly_events we
    LEFT JOIN (
      SELECT challenge_id, COUNT(*) as participant_count 
      FROM user_challenge_tracking 
      GROUP BY challenge_id
    ) uct ON we.id = uct.challenge_id
    WHERE 1=1
  `;

  if (search) {
    paramCount++;
    query += ` AND (LOWER(we.title) LIKE LOWER($${paramCount}) OR LOWER(we.description) LIKE LOWER($${paramCount}))`;
    values.push(`%${search}%`);
  }

  if (category) {
    paramCount++;
    query += ` AND we.event_type = $${paramCount}`;
    values.push(category);
  }

  if (startDate) {
    paramCount++;
    query += ` AND we.start_date >= $${paramCount}`;
    values.push(startDate);
  }

  if (endDate) {
    paramCount++;
    query += ` AND we.end_date <= $${paramCount}`;
    values.push(endDate);
  }

  query += ` ORDER BY we.start_date DESC`;

  paramCount++;
  query += ` LIMIT $${paramCount}`;
  values.push(limit);

  paramCount++;
  query += ` OFFSET $${paramCount}`;
  values.push(offset);

  const events = await sql(query, values);

  if (!events.length) {
    return {
      events: [],
      total: 0,
      limit,
      offset,
    };
  }

  const session = getSession();
  let userParticipation = [];

  if (session?.user?.id) {
    userParticipation = await sql(
      `
      SELECT challenge_id, completed 
      FROM user_challenge_tracking 
      WHERE user_id = $1 AND challenge_id = ANY($2)
    `,
      [session.user.id, events.map((e) => e.id)]
    );
  }

  const enrichedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    eventType: event.event_type,
    startDate: event.start_date,
    endDate: event.end_date,
    pointsReward: event.points_reward,
    participantCount: event.participant_count,
    createdAt: event.created_at,
    userStatus: userParticipation.find((p) => p.challenge_id === event.id)
      ? userParticipation.find((p) => p.challenge_id === event.id).completed
        ? "completed"
        : "participating"
      : "not_participating",
  }));

  const totalCount = await sql(
    `
    SELECT COUNT(*) as total 
    FROM weekly_events 
    WHERE 1=1
    ${
      search
        ? ` AND (LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))`
        : ""
    }
    ${category ? ` AND event_type = ${search ? "$2" : "$1"}` : ""}
  `,
    [...(search ? [`%${search}%`] : []), ...(category ? [category] : [])]
  );

  return {
    events: enrichedEvents,
    total: parseInt(totalCount[0].total),
    limit,
    offset,
  };
}
export async function POST(request) {
  return handler(await request.json());
}