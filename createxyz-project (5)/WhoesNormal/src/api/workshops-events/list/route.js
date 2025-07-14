async function handler({
  programType,
  ageGroup,
  focusAreas,
  location,
  startDate,
  endDate,
  isOnline,
  limit = 20,
  offset = 0,
}) {
  let queryStr = `
    SELECT * FROM workshops 
    WHERE 1=1
  `;

  const values = [];
  let paramCount = 1;

  if (programType) {
    queryStr += ` AND program_type = $${paramCount}`;
    values.push(programType);
    paramCount++;
  }

  if (ageGroup) {
    queryStr += ` AND age_group = $${paramCount}`;
    values.push(ageGroup);
    paramCount++;
  }

  if (focusAreas && focusAreas.length > 0) {
    queryStr += ` AND focus_areas && $${paramCount}`;
    values.push(focusAreas);
    paramCount++;
  }

  if (location) {
    queryStr += ` AND (LOWER(location_city) LIKE LOWER($${paramCount}) OR LOWER(location_state) LIKE LOWER($${paramCount}))`;
    values.push(`%${location}%`);
    paramCount++;
  }

  if (startDate) {
    queryStr += ` AND start_time >= $${paramCount}`;
    values.push(startDate);
    paramCount++;
  }

  if (endDate) {
    queryStr += ` AND end_time <= $${paramCount}`;
    values.push(endDate);
    paramCount++;
  }

  if (typeof isOnline === "boolean") {
    queryStr += ` AND is_online = $${paramCount}`;
    values.push(isOnline);
    paramCount++;
  }

  queryStr += ` ORDER BY start_time ASC LIMIT $${paramCount} OFFSET $${
    paramCount + 1
  }`;
  values.push(limit, offset);

  const programs = await sql(queryStr, values);

  return {
    programs,
    total: programs.length,
    limit,
    offset,
  };
}
export async function POST(request) {
  return handler(await request.json());
}