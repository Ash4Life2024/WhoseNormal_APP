async function handler({ email }) {
  if (!email) {
    return {
      error: "Email address is required",
    };
  }

  const NEVERBOUNCE_API_KEY = "YOUR_NEVERBOUNCE_API_KEY";
  const NEVERBOUNCE_API_URL = "https://api.neverbounce.com/v4/single/check";

  try {
    const response = await fetch(
      `${NEVERBOUNCE_API_URL}?key=${NEVERBOUNCE_API_KEY}&email=${encodeURIComponent(
        email
      )}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    const session = getSession();
    const userId = session?.user?.id;

    if (userId) {
      await sql`
        INSERT INTO security_audit_log 
        (user_id, event_type, event_details, severity)
        VALUES 
        (${userId}, 'email_verification', ${JSON.stringify({
        email,
        result: data.result,
        verification_time: new Date().toISOString(),
      })}, 'low')
      `;
    }

    return {
      status: data.result,
      result: {
        valid: data.result === "valid",
        suggestion: data.suggested_correction,
        flags: data.flags,
        details: data.explanation,
      },
    };
  } catch (error) {
    await sql`
      INSERT INTO system_errors 
      (error_code, error_message, component, severity)
      VALUES 
      ('EMAIL_VERIFICATION_ERROR', ${error.message}, 'verify-email', 'low')
    `;

    return {
      error: "Email verification failed",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}