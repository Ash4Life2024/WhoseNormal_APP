async function handler({
  userId,
  action,
  amount,
  description,
  transactionType,
}) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  switch (action) {
    case "purchase":
      if (!amount) {
        return { error: "Amount is required" };
      }

      const purchase = await sql`
        INSERT INTO virtual_currency_transactions (
          user_id,
          amount,
          transaction_type,
          description,
          price_paid
        )
        VALUES (
          ${userId},
          ${amount},
          'purchase',
          ${description || "Coin purchase"},
          ${amount * 0.01} // $0.01 per coin
        )
        RETURNING *
      `;

      return { transaction: purchase[0] };

    case "spend":
      if (!amount) {
        return { error: "Amount is required" };
      }

      // Check if user has enough coins
      const balance = await sql`
        SELECT COALESCE(SUM(CASE 
          WHEN transaction_type = 'purchase' OR transaction_type = 'reward' THEN amount 
          WHEN transaction_type = 'spend' THEN -amount 
        END), 0) as balance
        FROM virtual_currency_transactions
        WHERE user_id = ${userId}
      `;

      if (balance[0].balance < amount) {
        return { error: "Insufficient coins" };
      }

      const spend = await sql`
        INSERT INTO virtual_currency_transactions (
          user_id,
          amount,
          transaction_type,
          description
        )
        VALUES (
          ${userId},
          ${amount},
          'spend',
          ${description || "Coin spend"}
        )
        RETURNING *
      `;

      return { transaction: spend[0] };

    case "getBalance":
      const currentBalance = await sql`
        SELECT COALESCE(SUM(CASE 
          WHEN transaction_type = 'purchase' OR transaction_type = 'reward' THEN amount 
          WHEN transaction_type = 'spend' THEN -amount 
        END), 0) as balance
        FROM virtual_currency_transactions
        WHERE user_id = ${userId}
      `;

      return { balance: currentBalance[0].balance };

    case "getHistory":
      const history = await sql`
        SELECT * FROM virtual_currency_transactions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 50
      `;

      return { transactions: history };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}