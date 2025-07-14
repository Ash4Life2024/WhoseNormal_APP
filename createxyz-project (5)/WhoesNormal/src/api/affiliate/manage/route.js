async function handler({
  action,
  userId,
  email,
  programName,
  userDetails,
  affiliateId,
  referralCode,
  applications,
  programType,
  commissionRate,
  state,
  priceTier,
  partnershipTerms,
  marketingMaterials,
  autoApprove,
  targetAudience,
  programFeatures,
  pricingDetails,
}) {
  switch (action) {
    case "bulk-apply": {
      if (!applications || !Array.isArray(applications)) {
        return { error: "Invalid applications data" };
      }

      try {
        const results = await fetch("/api/affiliate/bulk-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applications: applications.map((app) => ({
              ...app,
              autoApprove:
                app.programType === "APP" || app.programType === "PLATFORM",
            })),
          }),
        });

        if (!results.ok) {
          throw new Error("Failed to submit bulk applications");
        }

        const data = await results.json();
        return { success: true, created: data.applications };
      } catch (error) {
        return {
          error: error.message || "Failed to create affiliate applications",
        };
      }
    }

    case "apply": {
      const application = await sql`
        INSERT INTO affiliate_applications (
          program_name, 
          email, 
          user_details, 
          user_id, 
          status,
          program_type,
          commission_rate,
          location_state,
          price_tier,
          partnership_terms,
          marketing_materials
        ) VALUES (
          ${programName},
          ${email},
          ${userDetails},
          ${userId},
          ${autoApprove ? "approved" : "pending"},
          ${programType},
          ${commissionRate},
          ${state},
          ${priceTier},
          ${partnershipTerms},
          ${marketingMaterials}
        ) RETURNING *`;
      return { success: true, application: application[0] };
    }

    case "approve": {
      const [application] = await sql.transaction([
        sql`
          UPDATE affiliate_applications 
          SET status = 'approved', 
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${affiliateId} 
          RETURNING *
        `,
        sql`
          INSERT INTO affiliate_tracking (
            affiliate_id,
            referral_code,
            commission_rate,
            target_audience,
            program_features,
            pricing_details
          ) VALUES (
            ${affiliateId},
            ${referralCode},
            ${commissionRate || 5.0},
            ${targetAudience || null},
            ${programFeatures || null},
            ${pricingDetails || null}
          ) RETURNING *
        `,
      ]);
      return { success: true, application };
    }

    case "reject": {
      const application = await sql`
        UPDATE affiliate_applications 
        SET status = 'rejected',
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${affiliateId} 
        RETURNING *`;
      return { success: true, application: application[0] };
    }

    case "track": {
      const tracking = await sql`
        UPDATE affiliate_tracking 
        SET clicks = clicks + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE referral_code = ${referralCode}
        RETURNING *`;
      return { success: true, tracking: tracking[0] };
    }

    case "convert": {
      const tracking = await sql`
        UPDATE affiliate_tracking 
        SET conversions = conversions + 1,
            total_commission = total_commission + (commission_rate),
            updated_at = CURRENT_TIMESTAMP
        WHERE referral_code = ${referralCode}
        RETURNING *`;
      return { success: true, tracking: tracking[0] };
    }

    case "list": {
      const applications = await sql`
        SELECT 
          a.*,
          t.clicks,
          t.conversions,
          t.total_commission,
          t.target_audience,
          t.program_features,
          t.pricing_details
        FROM affiliate_applications a
        LEFT JOIN affiliate_tracking t ON a.id = t.affiliate_id
        ORDER BY a.created_at DESC`;
      return { applications };
    }

    case "stats": {
      const stats = await sql`
        SELECT * FROM affiliate_tracking 
        WHERE affiliate_id = ${affiliateId}`;
      return { stats: stats[0] };
    }

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}