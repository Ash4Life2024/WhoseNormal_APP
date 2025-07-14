async function handler({ action, userId, planType, subscriptionId, tierId }) {
  switch (action) {
    case "create":
      if (!userId || !planType || !tierId) {
        return { error: "Missing required fields" };
      }

      const tier = await sql`
        SELECT * FROM subscription_tiers WHERE id = ${tierId}
      `;

      if (!tier.length) {
        return { error: "Invalid subscription tier" };
      }

      const newSubscription = await sql`
        INSERT INTO subscriptions (
          user_id, 
          plan_type, 
          status,
          start_date,
          end_date
        )
        VALUES (
          ${userId},
          ${planType},
          'active',
          CURRENT_TIMESTAMP,
          CASE 
            WHEN ${planType} = 'monthly' THEN CURRENT_TIMESTAMP + INTERVAL '1 month'
            WHEN ${planType} = 'yearly' THEN CURRENT_TIMESTAMP + INTERVAL '1 year'
            ELSE CURRENT_TIMESTAMP + INTERVAL '1 month'
          END
        )
        RETURNING *
      `;

      return { subscription: newSubscription[0] };

    case "cancel":
      if (!subscriptionId) {
        return { error: "Subscription ID required" };
      }

      const updatedSubscription = await sql`
        UPDATE subscriptions 
        SET 
          status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${subscriptionId}
        RETURNING *
      `;

      return { subscription: updatedSubscription[0] };

    case "getTiers":
      const tiers = await sql`
        SELECT * FROM subscription_tiers
        ORDER BY price_monthly ASC
      `;

      return { tiers };

    case "getUserSubscription":
      if (!userId) {
        return { error: "User ID required" };
      }

      const userSubscription = await sql`
        SELECT s.*, t.* 
        FROM subscriptions s
        LEFT JOIN subscription_tiers t ON t.id = ${tierId}
        WHERE s.user_id = ${userId}
        AND s.status = 'active'
        ORDER BY s.created_at DESC
        LIMIT 1
      `;

      return { subscription: userSubscription[0] };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}