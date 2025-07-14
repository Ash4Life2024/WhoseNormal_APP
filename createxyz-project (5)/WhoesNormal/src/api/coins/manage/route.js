async function handler({ userId, action, amount, itemId }) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    switch (action) {
      case "getBalance": {
        const [userPoints] = await sql`
          SELECT points, coins FROM user_points 
          WHERE user_id = ${userId}
        `;
        return userPoints || { points: 0, coins: 0 };
      }

      case "addCoins": {
        if (!amount || amount <= 0) {
          return { error: "Invalid amount" };
        }

        const [updated] = await sql`
          INSERT INTO user_points (user_id, coins)
          VALUES (${userId}, ${amount})
          ON CONFLICT (user_id) 
          DO UPDATE SET coins = user_points.coins + ${amount}
          RETURNING coins
        `;
        return { coins: updated.coins };
      }

      case "purchaseItem": {
        if (!itemId) {
          return { error: "Item ID is required" };
        }

        return await sql.transaction(async (sql) => {
          const [item] = await sql`
            SELECT id, coin_price FROM virtual_items 
            WHERE id = ${itemId}
          `;

          if (!item) {
            return { error: "Item not found" };
          }

          const [userPoints] = await sql`
            SELECT coins FROM user_points 
            WHERE user_id = ${userId}
          `;

          if (!userPoints || userPoints.coins < item.coin_price) {
            return { error: "Insufficient coins" };
          }

          await sql`
            UPDATE user_points 
            SET coins = coins - ${item.coin_price}
            WHERE user_id = ${userId}
          `;

          await sql`
            INSERT INTO user_virtual_items (user_id, item_id)
            VALUES (${userId}, ${itemId})
          `;

          return {
            success: true,
            remaining_coins: userPoints.coins - item.coin_price,
          };
        });
      }

      default:
        return { error: "Invalid action" };
    }
  } catch (error) {
    return { error: "Operation failed" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}