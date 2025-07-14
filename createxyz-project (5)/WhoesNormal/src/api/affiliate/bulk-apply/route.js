async function handler({ applications, autoApprove = false }) {
  if (!applications || !Array.isArray(applications)) {
    return { error: "Invalid applications data" };
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

    // Process applications in transaction
    const results = await sql.transaction(async (sql) => {
      const processedApplications = [];

      for (const app of applications) {
        // Find similar programs
        const similarPrograms = await sql`
          SELECT id, program_name, commission_rate 
          FROM affiliate_applications 
          WHERE program_type = ${app.program_type}
          AND status = 'approved'
          LIMIT 3
        `;

        // Determine if eligible for auto-approval
        const isEligible =
          autoApprove &&
          app.commission_rate <= 15.0 &&
          !app.price_tier !== "luxury";

        // Insert application
        const [newApp] = await sql`
          INSERT INTO affiliate_applications (
            program_name,
            email,
            user_id,
            status,
            program_type,
            commission_rate,
            price_tier,
            application_batch_id,
            auto_apply_enabled,
            similar_programs,
            location_state
          ) VALUES (
            ${app.program_name},
            ${app.email},
            ${session.user.id},
            ${isEligible ? "approved" : "pending"},
            ${app.program_type},
            ${app.commission_rate},
            ${app.price_tier},
            ${batchId},
            ${autoApprove},
            ${JSON.stringify(similarPrograms)},
            ${app.location_state}
          )
          RETURNING id, status
        `;

        // Create tracking entry
        await sql`
          INSERT INTO affiliate_tracking (
            affiliate_id,
            referral_code,
            commission_rate,
            bulk_import_batch_id,
            auto_approval_eligible
          ) VALUES (
            ${newApp.id},
            ${`REF_${newApp.id}_${Math.random()
              .toString(36)
              .substr(2, 6)}`.toUpperCase()},
            ${app.commission_rate},
            ${batchId},
            ${isEligible}
          )
        `;

        processedApplications.push({
          id: newApp.id,
          status: newApp.status,
          similarPrograms,
        });
      }

      return processedApplications;
    });

    return {
      success: true,
      batchId,
      applications: results,
    };
  } catch (error) {
    return {
      error: "Failed to process applications",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}