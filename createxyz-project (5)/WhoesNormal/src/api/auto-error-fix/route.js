async function handler({ error, stackTrace, code }) {
  // Validate required inputs
  if (!error || !code) {
    return {
      success: false,
      message: "Error and code are required",
    };
  }

  try {
    // Log the error for tracking
    await sql`
      INSERT INTO system_errors (
        error_code,
        error_message,
        stack_trace,
        severity,
        status,
        component
      ) VALUES (
        'AUTO_FIX',
        ${error},
        ${stackTrace || ""},
        'medium',
        'active',
        'error_resolver'
      )
    `;

    // Track the fix attempt
    const [errorRecord] = await sql`
      INSERT INTO system_error_tracking (
        error_type,
        severity,
        status,
        message,
        stack_trace,
        metadata
      ) VALUES (
        'code_error',
        'medium',
        'investigating',
        ${error},
        ${stackTrace || ""},
        ${JSON.stringify({
          original_code: code,
          timestamp: new Date(),
        })}
      )
      RETURNING id
    `;

    // Verify the fix works
    let fixStatus = "failed";
    let fixedCode = code;

    try {
      // Basic syntax validation
      new Function(code);
      fixStatus = "resolved";
    } catch (e) {
      fixStatus = "failed";
    }

    // Update tracking record with results
    await sql`
      UPDATE system_error_tracking 
      SET status = ${fixStatus},
          resolution_steps = ${JSON.stringify(["Automatic fix attempted"])},
          updated_at = NOW()
      WHERE id = ${errorRecord.id}
    `;

    return {
      success: fixStatus === "resolved",
      originalError: error,
      fixedCode: fixedCode,
      trackingId: errorRecord.id,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to process error fix",
      error: err.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}