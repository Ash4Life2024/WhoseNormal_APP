async function handler({ startDate, endDate, groupBy = "day" } = {}) {
  const dateFilter =
    startDate && endDate ? `AND created_at BETWEEN $1 AND $2` : "";

  const params = startDate && endDate ? [startDate, endDate] : [];

  const revenueData = await sql.transaction(async (sql) => {
    const subscriptionRevenue = await sql(
      `
      SELECT 
        COALESCE(SUM(CASE 
          WHEN plan_type = 'monthly' THEN st.price_monthly 
          WHEN plan_type = 'yearly' THEN st.price_yearly
        END), 0) as total
      FROM subscriptions s
      JOIN subscription_tiers st ON s.plan_type = st.name 
      WHERE status = 'active' ${dateFilter}
    `,
      params
    );

    const virtualCurrencyRevenue = await sql(
      `
      SELECT COALESCE(SUM(price_paid), 0) as total
      FROM virtual_currency_transactions 
      WHERE transaction_type = 'purchase' ${dateFilter}
    `,
      params
    );

    const merchandiseRevenue = await sql(
      `
      SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0) as total
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.status = 'paid' ${dateFilter}
    `,
      params
    );

    const affiliateRevenue = await sql(
      `
      SELECT COALESCE(SUM(total_commission), 0) as total
      FROM affiliate_tracking
      WHERE 1=1 ${dateFilter}
    `,
      params
    );

    return {
      total: {
        subscriptions: subscriptionRevenue[0].total,
        virtualCurrency: virtualCurrencyRevenue[0].total,
        merchandise: merchandiseRevenue[0].total,
        affiliates: affiliateRevenue[0].total,
      },
      summary: {
        totalRevenue:
          subscriptionRevenue[0].total +
          virtualCurrencyRevenue[0].total +
          merchandiseRevenue[0].total +
          affiliateRevenue[0].total,
        period: {
          start: startDate || "all time",
          end: endDate || "present",
        },
      },
    };
  });

  return revenueData;
}
export async function POST(request) {
  return handler(await request.json());
}