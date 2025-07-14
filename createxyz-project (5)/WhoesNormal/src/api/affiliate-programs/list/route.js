async function handler() {
  try {
    const programs = await sql`
      SELECT 
        id,
        name,
        description,
        commission_type,
        commission_value,
        cookie_duration_days,
        product_categories,
        benefits,
        requirements,
        is_active,
        created_at
      FROM affiliate_programs
      WHERE is_active = true
      ORDER BY created_at DESC
    `;

    return {
      success: true,
      programs: programs.map((program) => ({
        id: program.id,
        name: program.name,
        description: program.description,
        commissionDetails: {
          type: program.commission_type,
          value: program.commission_value,
          cookieDuration: program.cookie_duration_days,
        },
        categories: program.product_categories,
        benefits: program.benefits,
        requirements: program.requirements,
        createdAt: program.created_at,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch affiliate programs",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}