async function handler({ applications }) {
  if (!Array.isArray(applications) || applications.length === 0) {
    return { error: "Invalid or empty applications array" };
  }

  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    // Generate batch ID for tracking
    const batchId = `BATCH_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Prepare values for bulk insert
    const values = applications.map((app, i) => ({
      program_name: app.programName,
      email: app.email,
      program_type: app.programType,
      user_id: session.user.id,
      status: app.autoApprove ? "approved" : "pending",
      application_batch_id: batchId,
      commission_rate: app.commissionRate,
      location_state: app.state,
      price_tier: app.priceTier || "affordable",
      user_details: app.userDetails || {},
      commission_details: app.commissionDetails || {},
      partnership_terms: app.partnershipTerms || {},
      marketing_materials: app.marketingMaterials || {},
    }));

    // Build query for bulk insert
    const insertQuery = `
      INSERT INTO affiliate_applications (
        program_name, email, program_type, user_id, status,
        application_batch_id, commission_rate, location_state,
        price_tier, user_details, commission_details,
        partnership_terms, marketing_materials
      )
      SELECT * FROM UNNEST (
        ${sql(
          values.map((v) => [
            v.program_name,
            v.email,
            v.program_type,
            v.user_id,
            v.status,
            v.application_batch_id,
            v.commission_rate,
            v.location_state,
            v.price_tier,
            v.user_details,
            v.commission_details,
            v.partnership_terms,
            v.marketing_materials,
          ])
        )}
      )
      RETURNING id, program_name, status, application_batch_id
    `;

    const results = await sql(insertQuery);

    return {
      success: true,
      batchId,
      applications: results,
      totalProcessed: results.length,
    };
  } catch (error) {
    console.error("Bulk affiliate signup error:", error);
    return {
      error: "Failed to process affiliate applications",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}