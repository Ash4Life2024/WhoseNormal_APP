async function handler({
  campType,
  focusAreas,
  locationCity,
  locationState,
  minAge,
  maxAge,
}) {
  let queryStr = "SELECT * FROM camps WHERE 1=1";
  const values = [];
  let paramCount = 0;

  if (campType && campType.length > 0) {
    paramCount++;
    queryStr += ` AND camp_type && $${paramCount}`;
    values.push(Array.isArray(campType) ? campType : [campType]);
  }

  if (focusAreas && focusAreas.length > 0) {
    paramCount++;
    queryStr += ` AND focus_areas && $${paramCount}`;
    values.push(Array.isArray(focusAreas) ? focusAreas : [focusAreas]);
  }

  if (locationCity) {
    paramCount++;
    queryStr += ` AND LOWER(location_city) = LOWER($${paramCount})`;
    values.push(locationCity);
  }

  if (locationState) {
    paramCount++;
    queryStr += ` AND LOWER(location_state) = LOWER($${paramCount})`;
    values.push(locationState);
  }

  if (minAge !== undefined) {
    paramCount++;
    queryStr += ` AND age_range_min >= $${paramCount}`;
    values.push(minAge);
  }

  if (maxAge !== undefined) {
    paramCount++;
    queryStr += ` AND age_range_max <= $${paramCount}`;
    values.push(maxAge);
  }

  queryStr += " ORDER BY created_at DESC";

  const camps = await sql(queryStr, values);
  return { camps };
}
export async function POST(request) {
  return handler(await request.json());
}