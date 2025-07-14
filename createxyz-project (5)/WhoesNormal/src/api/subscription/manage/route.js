async function handler({
  action,
  userId,
  planType,
  stripeToken,
  subscriptionId,
}) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  switch (action) {
    case "create": {
      if (!planType || !stripeToken) {
        return { error: "Plan type and payment token are required" };
      }

      const existingSubscription = await sql`
        SELECT * FROM subscriptions 
        WHERE user_id = ${userId} 
        AND status = 'active'
      `;

      if (existingSubscription.length > 0) {
        return { error: "User already has an active subscription" };
      }

      const now = new Date();
      const endDate = new Date();
      endDate.setFullYear(
        endDate.getFullYear() + (planType === "yearly" ? 1 : 0)
      );
      endDate.setMonth(endDate.getMonth() + (planType === "monthly" ? 1 : 0));

      const [subscription] = await sql`
        INSERT INTO subscriptions (
          user_id, 
          plan_type, 
          status, 
          start_date,
          end_date,
          stripe_subscription_id
        )
        VALUES (
          ${userId},
          ${planType},
          'active',
          ${now},
          ${endDate},
          ${stripeToken}
        )
        RETURNING *
      `;

      return { subscription };
    }

    case "cancel": {
      if (!subscriptionId) {
        return { error: "Subscription ID is required" };
      }

      const [subscription] = await sql`
        UPDATE subscriptions
        SET 
          status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${subscriptionId}
        AND user_id = ${userId}
        RETURNING *
      `;

      if (!subscription) {
        return { error: "Subscription not found" };
      }

      return { subscription };
    }

    case "status": {
      const subscriptions = await sql`
        SELECT * FROM subscriptions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;

      return { subscriptions };
    }

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}