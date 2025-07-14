async function handler({ applications, userId }) {
  if (
    !applications ||
    !Array.isArray(applications) ||
    applications.length === 0
  ) {
    return { error: "Invalid applications data" };
  }

  try {
    // Generate a batch ID for this group of applications
    const batchId = `BATCH_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Build the query to insert multiple applications
    const values = applications
      .map((app, i) => {
        const params = [
          app.program_name,
          app.email,
          app.user_details || {},
          userId,
          "pending",
          app.program_type,
          app.commission_details || {},
          batchId,
          app.commission_rate,
          app.partnership_terms || {},
          app.marketing_materials || {},
          app.location_state,
          app.price_tier,
          app.website_url,
          app.social_media || {},
          app.target_audience || [],
          app.service_areas || [],
          app.specializations || [],
        ];

        const placeholders = params.map(
          (_, idx) => `$${idx + 1 + i * params.length}`
        );
        return `(${placeholders.join(", ")})`;
      })
      .join(", ");

    const flatParams = applications.flatMap((app) => [
      app.program_name,
      app.email,
      app.user_details || {},
      userId,
      "pending",
      app.program_type,
      app.commission_details || {},
      batchId,
      app.commission_rate,
      app.partnership_terms || {},
      app.marketing_materials || {},
      app.location_state,
      app.price_tier,
      app.website_url,
      app.social_media || {},
      app.target_audience || [],
      app.service_areas || [],
      app.specializations || [],
    ]);

    const query = `
      INSERT INTO affiliate_applications (
        program_name, email, user_details, user_id, status, 
        program_type, commission_details, application_batch_id,
        commission_rate, partnership_terms, marketing_materials,
        location_state, price_tier, website_url, social_media,
        target_audience, service_areas, specializations
      )
      VALUES ${values}
      RETURNING id, program_name, status, application_batch_id
    `;

    const results = await sql(query, flatParams);

    return {
      success: true,
      batch_id: batchId,
      applications: results,
      total_submitted: results.length,
    };
  } catch (error) {
    return {
      error: "Failed to process bulk applications",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}