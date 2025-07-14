async function handler({ action, itemData, categoryData, id, filters }) {
  switch (action) {
    case "createItem":
      return await sql`
        INSERT INTO merchandise (
          name, description, category, price, inventory_count, 
          image_url, is_active, created_at, updated_at
        ) VALUES (
          ${itemData.name},
          ${itemData.description},
          ${itemData.category},
          ${itemData.price},
          ${itemData.inventoryCount},
          ${itemData.imageUrl},
          true,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        ) RETURNING *`;

    case "updateItem":
      const setValues = [];
      const queryParams = [];
      let paramCount = 1;

      if (itemData.name) {
        setValues.push(`name = $${paramCount}`);
        queryParams.push(itemData.name);
        paramCount++;
      }
      if (itemData.description) {
        setValues.push(`description = $${paramCount}`);
        queryParams.push(itemData.description);
        paramCount++;
      }
      if (itemData.price) {
        setValues.push(`price = $${paramCount}`);
        queryParams.push(itemData.price);
        paramCount++;
      }
      if (itemData.inventoryCount !== undefined) {
        setValues.push(`inventory_count = $${paramCount}`);
        queryParams.push(itemData.inventoryCount);
        paramCount++;
      }
      if (itemData.imageUrl) {
        setValues.push(`image_url = $${paramCount}`);
        queryParams.push(itemData.imageUrl);
        paramCount++;
      }
      if (itemData.isActive !== undefined) {
        setValues.push(`is_active = $${paramCount}`);
        queryParams.push(itemData.isActive);
        paramCount++;
      }

      setValues.push(`updated_at = CURRENT_TIMESTAMP`);
      queryParams.push(id);

      return await sql(
        `UPDATE merchandise SET ${setValues.join(
          ", "
        )} WHERE id = $${paramCount} RETURNING *`,
        queryParams
      );

    case "deleteItem":
      return await sql`
        DELETE FROM merchandise WHERE id = ${id} RETURNING *`;

    case "getItem":
      return await sql`
        SELECT * FROM merchandise WHERE id = ${id}`;

    case "listItems":
      let query = "SELECT * FROM merchandise WHERE 1=1";
      const listParams = [];
      let listParamCount = 1;

      if (filters?.category) {
        query += ` AND category = $${listParamCount}`;
        listParams.push(filters.category);
        listParamCount++;
      }

      if (filters?.isActive !== undefined) {
        query += ` AND is_active = $${listParamCount}`;
        listParams.push(filters.isActive);
        listParamCount++;
      }

      query += " ORDER BY created_at DESC";
      return await sql(query, listParams);

    case "createCategory":
      return await sql`
        INSERT INTO merchandise_categories (name, description)
        VALUES (${categoryData.name}, ${categoryData.description})
        RETURNING *`;

    case "listCategories":
      return await sql`SELECT * FROM merchandise_categories ORDER BY name`;

    default:
      throw new Error("Invalid action specified");
  }
}
export async function POST(request) {
  return handler(await request.json());
}