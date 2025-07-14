async function handler({ action, data }) {
  switch (action) {
    case "listProducts":
      return await sql`
        SELECT * FROM merchandise 
        WHERE is_active = true 
        ORDER BY created_at DESC
      `;

    case "addProduct":
      const { name, description, category, price, inventory_count, image_url } =
        data;
      return await sql`
        INSERT INTO merchandise (
          name, description, category, price, 
          inventory_count, image_url
        ) 
        VALUES (
          ${name}, ${description}, ${category}, ${price}, 
          ${inventory_count}, ${image_url}
        )
        RETURNING *
      `;

    case "updateProduct":
      const { id, ...updates } = data;
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          setClauses.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }

      values.push(id);
      return await sql(
        `UPDATE merchandise 
        SET ${setClauses.join(", ")}, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramCount} 
        RETURNING *`,
        values
      );

    case "createOrder":
      const { user_id, items, shipping_address, total_amount } = data;
      return await sql.transaction(async (sql) => {
        const order = await sql`
          INSERT INTO orders (
            user_id, total_amount, shipping_address, status
          ) 
          VALUES (
            ${user_id}, ${total_amount}, ${shipping_address}, 'pending'
          ) 
          RETURNING *
        `;

        for (const item of items) {
          await sql`
            INSERT INTO order_items (
              order_id, merchandise_id, quantity, unit_price
            ) 
            VALUES (
              ${order[0].id}, ${item.merchandise_id}, 
              ${item.quantity}, ${item.unit_price}
            )
          `;

          await sql`
            UPDATE merchandise 
            SET inventory_count = inventory_count - ${item.quantity} 
            WHERE id = ${item.merchandise_id}
          `;
        }

        return order[0];
      });

    case "updateOrderStatus":
      const { order_id, status, tracking_number } = data;
      return await sql`
        UPDATE orders 
        SET 
          status = ${status}, 
          tracking_number = ${tracking_number},
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${order_id} 
        RETURNING *
      `;

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}