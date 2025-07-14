async function handler({ programName, email, userDetails }) {
  const session = getSession();

  if (!programName || !email) {
    return {
      success: false,
      error: "Missing required fields",
    };
  }

  try {
    const [application] = await sql`
      INSERT INTO affiliate_applications (
        program_name,
        email,
        user_details,
        user_id,
        status,
        created_at
      ) VALUES (
        ${programName},
        ${email},
        ${JSON.stringify(userDetails)},
        ${session?.user?.id || null},
        'pending',
        NOW()
      )
      RETURNING id
    `;

    const response = await fetch("https://api.affiliateprogram.com/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program: programName,
        email,
        details: userDetails,
      }),
    });

    await sql`
      UPDATE affiliate_applications 
      SET status = ${response.ok ? "submitted" : "failed"},
          updated_at = NOW()
      WHERE id = ${application.id}
    `;

    return {
      success: true,
      applicationId: application.id,
      nextSteps:
        "We'll review your application and contact you within 2-3 business days.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to process application",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}