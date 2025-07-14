async function handler({ method, packageId, data }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized access" };
  }

  switch (method) {
    case "GET":
      const packages = await sql`
        SELECT * FROM virtual_currency_packages 
        WHERE is_featured = true 
        OR (available_until IS NULL OR available_until > NOW())
        ORDER BY price_usd ASC`;
      return { packages };

    case "POST":
      if (!data) return { error: "No package data provided" };

      const newPackage = await sql`
        INSERT INTO virtual_currency_packages (
          name, description, coins_amount, price_usd, 
          bonus_coins, is_featured, duration_days, benefits
        ) VALUES (
          ${data.name}, ${data.description}, ${data.coinsAmount}, 
          ${data.priceUsd}, ${data.bonusCoins || 0}, 
          ${data.isFeatured || false}, ${data.durationDays || null}, 
          ${JSON.stringify(data.benefits || [])}
        ) RETURNING *`;
      return { package: newPackage[0] };

    case "PUT":
      if (!packageId) return { error: "No package ID provided" };

      const setClauses = [];
      const values = [];
      let paramCount = 1;

      if (data.name) {
        setClauses.push(`name = $${paramCount}`);
        values.push(data.name);
        paramCount++;
      }
      if (data.description) {
        setClauses.push(`description = $${paramCount}`);
        values.push(data.description);
        paramCount++;
      }
      if (data.coinsAmount) {
        setClauses.push(`coins_amount = $${paramCount}`);
        values.push(data.coinsAmount);
        paramCount++;
      }
      if (data.priceUsd) {
        setClauses.push(`price_usd = $${paramCount}`);
        values.push(data.priceUsd);
        paramCount++;
      }
      if (data.bonusCoins !== undefined) {
        setClauses.push(`bonus_coins = $${paramCount}`);
        values.push(data.bonusCoins);
        paramCount++;
      }
      if (data.isFeatured !== undefined) {
        setClauses.push(`is_featured = $${paramCount}`);
        values.push(data.isFeatured);
        paramCount++;
      }

      values.push(packageId);

      const updatedPackage = await sql(
        `UPDATE virtual_currency_packages 
         SET ${setClauses.join(", ")} 
         WHERE id = $${paramCount} 
         RETURNING *`,
        values
      );

      return { package: updatedPackage[0] };

    case "DELETE":
      if (!packageId) return { error: "No package ID provided" };

      await sql`
        DELETE FROM virtual_currency_packages 
        WHERE id = ${packageId}`;
      return { success: true };

    default:
      return { error: "Invalid method" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}