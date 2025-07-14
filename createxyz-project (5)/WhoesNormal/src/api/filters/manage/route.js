async function handler({ action, filterId, filterData, userId }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  switch (action) {
    case "create":
      if (!filterData?.name || !filterData?.settings) {
        return { error: "Missing required filter data" };
      }

      const newFilter = await sql`
        INSERT INTO custom_filters (
          creator_id, 
          name, 
          description, 
          filter_type,
          settings
        ) VALUES (
          ${session.user.id},
          ${filterData.name},
          ${filterData.description || ""},
          ${filterData.filter_type || "MOOD"},
          ${filterData.settings}
        ) RETURNING *`;
      return { filter: newFilter[0] };

    case "update":
      if (!filterId) {
        return { error: "Filter ID required" };
      }

      const updateClauses = [];
      const updateValues = [];
      let paramCount = 1;

      if (filterData.name) {
        updateClauses.push(`name = $${paramCount}`);
        updateValues.push(filterData.name);
        paramCount++;
      }
      if (filterData.description !== undefined) {
        updateClauses.push(`description = $${paramCount}`);
        updateValues.push(filterData.description);
        paramCount++;
      }
      if (filterData.settings) {
        updateClauses.push(`settings = $${paramCount}`);
        updateValues.push(filterData.settings);
        paramCount++;
      }

      if (updateClauses.length === 0) {
        return { error: "No update data provided" };
      }

      updateValues.push(filterId, session.user.id);
      const updatedFilter = await sql(
        `UPDATE custom_filters 
         SET ${updateClauses.join(", ")} 
         WHERE id = $${paramCount} AND creator_id = $${paramCount + 1}
         RETURNING *`,
        updateValues
      );

      return updatedFilter[0]
        ? { filter: updatedFilter[0] }
        : { error: "Filter not found or unauthorized" };

    case "delete":
      if (!filterId) {
        return { error: "Filter ID required" };
      }

      const deletedFilter = await sql`
        DELETE FROM custom_filters 
        WHERE id = ${filterId} 
        AND creator_id = ${session.user.id}
        RETURNING id`;

      return deletedFilter[0]
        ? { success: true }
        : { error: "Filter not found or unauthorized" };

    case "get":
      if (!filterId) {
        return { error: "Filter ID required" };
      }

      const filter = await sql`
        SELECT * FROM custom_filters 
        WHERE id = ${filterId}`;

      return filter[0] ? { filter: filter[0] } : { error: "Filter not found" };

    case "list":
      const filters = await sql`
        SELECT * FROM custom_filters 
        WHERE creator_id = ${session.user.id} 
        OR is_approved = true
        ORDER BY created_at DESC`;

      return { filters };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}